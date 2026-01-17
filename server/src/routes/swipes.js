import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Daily swipe limit for free users
const DAILY_SWIPE_LIMIT = 20

// Helper: count today's swipes
async function getTodaySwipeCount(userId) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return prisma.swipe.count({
    where: {
      swiperId: userId,
      createdAt: { gte: today }
    }
  })
}

// Helper: check if user is premium
async function isPremiumUser(userId) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'active',
      currentPeriodEnd: { gt: new Date() }
    }
  })
  return !!subscription
}

// Get remaining swipes
router.get('/remaining', authenticate, async (req, res) => {
  try {
    const isPremium = await isPremiumUser(req.user.id)

    if (isPremium) {
      return res.json({ remaining: -1, limit: -1, isPremium: true }) // -1 means unlimited
    }

    const todayCount = await getTodaySwipeCount(req.user.id)
    const remaining = Math.max(0, DAILY_SWIPE_LIMIT - todayCount)

    res.json({ remaining, limit: DAILY_SWIPE_LIMIT, isPremium: false })
  } catch (error) {
    console.error('Get remaining error:', error)
    res.status(500).json({ error: 'Ошибка получения лимита' })
  }
})

// Create swipe
router.post('/', authenticate, async (req, res) => {
  try {
    const { swipedId, isLike, isSuperLike } = req.body

    if (!swipedId) {
      return res.status(400).json({ error: 'swipedId обязателен' })
    }

    // Check swipe limit for free users
    const isPremium = await isPremiumUser(req.user.id)
    if (!isPremium) {
      const todayCount = await getTodaySwipeCount(req.user.id)
      if (todayCount >= DAILY_SWIPE_LIMIT) {
        return res.status(403).json({
          error: 'Лимит свайпов на сегодня исчерпан',
          limitReached: true,
          remaining: 0
        })
      }
    }

    // Check if user exists
    const swipedUser = await prisma.user.findUnique({
      where: { id: swipedId }
    })

    if (!swipedUser) {
      return res.status(404).json({ error: 'Пользователь не найден' })
    }

    // Check if blocked
    const blocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: req.user.id, blockedId: swipedId },
          { blockerId: swipedId, blockedId: req.user.id }
        ]
      }
    })

    if (blocked) {
      return res.status(400).json({ error: 'Невозможно оценить этого пользователя' })
    }

    // Check if already swiped
    const existingSwipe = await prisma.swipe.findUnique({
      where: {
        swiperId_swipedId: {
          swiperId: req.user.id,
          swipedId
        }
      }
    })

    if (existingSwipe) {
      return res.status(400).json({ error: 'Вы уже оценили этого пользователя' })
    }

    // Create swipe
    const swipe = await prisma.swipe.create({
      data: {
        swiperId: req.user.id,
        swipedId,
        isLike,
        isSuperLike: isSuperLike || false
      }
    })

    let isMatch = false
    let matchId = null

    // Check for mutual like (match)
    if (isLike) {
      const mutualLike = await prisma.swipe.findFirst({
        where: {
          swiperId: swipedId,
          swipedId: req.user.id,
          isLike: true
        }
      })

      if (mutualLike) {
        // Create match
        const [user1Id, user2Id] = [req.user.id, swipedId].sort()

        const match = await prisma.match.create({
          data: {
            user1Id,
            user2Id
          }
        })

        isMatch = true
        matchId = match.id

        // Create notification for the other user
        await prisma.notification.create({
          data: {
            userId: swipedId,
            type: 'match',
            title: 'Новый матч!',
            body: `Вы понравились друг другу с ${req.user.name}!`,
            data: { matchId: match.id }
          }
        })
      } else {
        // Create like notification
        const notificationType = isSuperLike ? 'super_like' : 'like'
        const notificationTitle = isSuperLike ? 'Super Like!' : 'Новый лайк!'
        const notificationBody = isSuperLike
          ? 'Кто-то поставил вам Super Like!'
          : 'Кому-то понравился ваш профиль!'

        await prisma.notification.create({
          data: {
            userId: swipedId,
            type: notificationType,
            title: notificationTitle,
            body: notificationBody,
            data: { swiperId: req.user.id }
          }
        })
      }
    }

    res.json({ swipe, isMatch, matchId })
  } catch (error) {
    console.error('Create swipe error:', error)
    res.status(500).json({ error: 'Ошибка создания свайпа' })
  }
})

export default router
