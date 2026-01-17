import express from 'express'
import { PrismaClient } from '@prisma/client'
import twilio from 'twilio'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Initialize Twilio client (only with valid credentials)
let twilioClient = null
if (process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  try {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  } catch (e) {
    console.log('Twilio not configured for phone verification')
  }
}

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

// Generate random 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send verification code
router.post('/send-code', authenticate, async (req, res) => {
  try {
    const { phone } = req.body

    if (!phone) {
      return res.status(400).json({ error: 'Номер телефона обязателен' })
    }

    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/\D/g, '')

    // Check if phone is already used by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        phone: cleanPhone,
        id: { not: req.user.id },
        phoneVerified: true
      }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Этот номер уже используется' })
    }

    // Generate code and expiration (10 minutes)
    const code = generateCode()
    const expires = new Date(Date.now() + 10 * 60 * 1000)

    // Save code to database
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        phone: cleanPhone,
        phoneCode: code,
        phoneCodeExpires: expires,
        phoneVerified: false
      }
    })

    // Send SMS via Twilio
    if (twilioClient && TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `Ваш код подтверждения LoveMatch: ${code}`,
          from: TWILIO_PHONE_NUMBER,
          to: `+${cleanPhone}`
        })
      } catch (smsError) {
        console.error('Twilio SMS error:', smsError)
        // In development, log the code instead
        console.log(`DEV: Verification code for ${cleanPhone}: ${code}`)
      }
    } else {
      // Development mode - log the code
      console.log(`DEV: Verification code for ${cleanPhone}: ${code}`)
    }

    res.json({
      success: true,
      message: 'Код отправлен',
      // In development, return the code for testing
      ...(process.env.NODE_ENV !== 'production' && { devCode: code })
    })
  } catch (error) {
    console.error('Send code error:', error)
    res.status(500).json({ error: 'Ошибка отправки кода' })
  }
})

// Verify code
router.post('/verify-code', authenticate, async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Код обязателен' })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    })

    if (!user.phoneCode || !user.phoneCodeExpires) {
      return res.status(400).json({ error: 'Сначала запросите код' })
    }

    // Check if code expired
    if (new Date() > user.phoneCodeExpires) {
      return res.status(400).json({ error: 'Код истёк. Запросите новый.' })
    }

    // Check code
    if (user.phoneCode !== code) {
      return res.status(400).json({ error: 'Неверный код' })
    }

    // Verify phone and mark user as verified
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        phoneVerified: true,
        isVerified: true,  // Also set the main verified flag
        phoneCode: null,
        phoneCodeExpires: null
      }
    })

    res.json({
      success: true,
      message: 'Телефон подтверждён',
      isVerified: true
    })
  } catch (error) {
    console.error('Verify code error:', error)
    res.status(500).json({ error: 'Ошибка проверки кода' })
  }
})

// Get phone verification status
router.get('/status', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        phone: true,
        phoneVerified: true,
        isVerified: true
      }
    })

    res.json({
      phone: user.phone ? `***${user.phone.slice(-4)}` : null,
      phoneVerified: user.phoneVerified,
      isVerified: user.isVerified
    })
  } catch (error) {
    console.error('Phone status error:', error)
    res.status(500).json({ error: 'Ошибка получения статуса' })
  }
})

export default router
