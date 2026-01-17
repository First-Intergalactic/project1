import express from 'express'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Initialize Stripe with test key (replace with your own)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16'
})

// Price ID for $10/month subscription (you'll create this in Stripe dashboard)
const PREMIUM_PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_placeholder'

// Get subscription status
router.get('/status', authenticate, async (req, res) => {
  try {
    let subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    })

    // Create default subscription record if doesn't exist
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId: req.user.id,
          status: 'inactive',
          plan: 'free'
        }
      })
    }

    res.json({
      isPremium: subscription.status === 'active' && subscription.plan === 'premium',
      status: subscription.status,
      plan: subscription.plan,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
    })
  } catch (error) {
    console.error('Get subscription status error:', error)
    res.status(500).json({ error: 'Ошибка получения статуса подписки' })
  }
})

// Create checkout session
router.post('/create-checkout', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { subscription: true }
    })

    // Get or create Stripe customer
    let customerId = user.subscription?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id
        }
      })
      customerId = customer.id

      // Save customer ID
      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: { stripeCustomerId: customerId },
        create: {
          userId: user.id,
          stripeCustomerId: customerId,
          status: 'inactive',
          plan: 'free'
        }
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PREMIUM_PRICE_ID,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/subscription/cancel`,
      metadata: {
        userId: user.id
      }
    })

    res.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Create checkout error:', error)
    res.status(500).json({ error: 'Ошибка создания сессии оплаты' })
  }
})

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
    } else {
      event = req.body
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const userId = session.metadata?.userId

      if (userId && session.subscription) {
        // Get subscription details from Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription)

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeSubscriptionId: session.subscription,
            status: 'active',
            plan: 'premium',
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
          },
          create: {
            userId,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            status: 'active',
            plan: 'premium',
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
          }
        })
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object
      const customerId = subscription.customer

      // Find user by Stripe customer ID
      const userSubscription = await prisma.subscription.findFirst({
        where: { stripeCustomerId: customerId }
      })

      if (userSubscription) {
        await prisma.subscription.update({
          where: { id: userSubscription.id },
          data: {
            status: subscription.status === 'active' ? 'active' : 'inactive',
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end
          }
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      const customerId = subscription.customer

      const userSubscription = await prisma.subscription.findFirst({
        where: { stripeCustomerId: customerId }
      })

      if (userSubscription) {
        await prisma.subscription.update({
          where: { id: userSubscription.id },
          data: {
            status: 'canceled',
            plan: 'free',
            stripeSubscriptionId: null
          }
        })
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object
      const customerId = invoice.customer

      const userSubscription = await prisma.subscription.findFirst({
        where: { stripeCustomerId: customerId }
      })

      if (userSubscription) {
        await prisma.subscription.update({
          where: { id: userSubscription.id },
          data: { status: 'past_due' }
        })
      }
      break
    }
  }

  res.json({ received: true })
})

// Cancel subscription
router.post('/cancel', authenticate, async (req, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    })

    if (!subscription?.stripeSubscriptionId) {
      return res.status(400).json({ error: 'Нет активной подписки' })
    }

    // Cancel at period end (user keeps access until end of billing period)
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    })

    await prisma.subscription.update({
      where: { userId: req.user.id },
      data: { cancelAtPeriodEnd: true }
    })

    res.json({ success: true, message: 'Подписка будет отменена в конце периода' })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    res.status(500).json({ error: 'Ошибка отмены подписки' })
  }
})

// Reactivate subscription
router.post('/reactivate', authenticate, async (req, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    })

    if (!subscription?.stripeSubscriptionId) {
      return res.status(400).json({ error: 'Нет подписки для восстановления' })
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false
    })

    await prisma.subscription.update({
      where: { userId: req.user.id },
      data: { cancelAtPeriodEnd: false }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Reactivate subscription error:', error)
    res.status(500).json({ error: 'Ошибка восстановления подписки' })
  }
})

export default router
