import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import twilio from 'twilio'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Twilio client for SMS (only initialize with valid credentials)
let twilioClient = null
if (process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  try {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  } catch (e) {
    console.log('Twilio not configured, SMS will be logged to console')
  }
}

// Generate 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Temporary storage for pending registrations (in production use Redis)
const pendingRegistrations = new Map()

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        preferences: {
          create: {}
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        isProfileComplete: true
      }
    })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })

    res.json({ token, user })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Ошибка регистрации' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(400).json({ error: 'Неверный email или пароль' })
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash)

    if (!validPassword) {
      return res.status(400).json({ error: 'Неверный email или пароль' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isProfileComplete: user.isProfileComplete
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Ошибка входа' })
  }
})

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        location: true
      }
    })

    // Calculate age from birthDate
    let age = null
    if (user.birthDate) {
      const today = new Date()
      const birth = new Date(user.birthDate)
      age = today.getFullYear() - birth.getFullYear()
      const m = today.getMonth() - birth.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--
      }
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      age,
      city: user.location?.city || null,
      bio: user.bio,
      isProfileComplete: user.isProfileComplete
    })
  } catch (error) {
    console.error('Get me error:', error)
    res.status(500).json({ error: 'Ошибка получения данных' })
  }
})

// Step 1: Start registration with phone verification
router.post('/register-start', async (req, res) => {
  try {
    const { name, email, password, phone, birthDate, photo } = req.body

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Все поля обязательны' })
    }

    if (!birthDate) {
      return res.status(400).json({ error: 'Укажите дату рождения' })
    }

    if (!photo) {
      return res.status(400).json({ error: 'Загрузите фото' })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' })
    }

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '')

    // Check if phone already verified by another user
    const existingPhone = await prisma.user.findFirst({
      where: { phone: cleanPhone, phoneVerified: true }
    })

    if (existingPhone) {
      return res.status(400).json({ error: 'Этот номер телефона уже используется' })
    }

    // Generate verification code
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store pending registration
    pendingRegistrations.set(email, {
      name,
      email,
      password,
      phone: cleanPhone,
      birthDate,
      photo,
      code,
      expiresAt
    })

    // Send SMS via Twilio
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `Ваш код регистрации LoveMatch: ${code}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+${cleanPhone}`
        })
      } catch (smsError) {
        console.error('Twilio SMS error:', smsError)
        console.log(`DEV: Registration code for ${cleanPhone}: ${code}`)
      }
    } else {
      console.log(`DEV: Registration code for ${cleanPhone}: ${code}`)
    }

    res.json({
      success: true,
      message: 'Код отправлен',
      // In development, return the code for testing
      ...(process.env.NODE_ENV !== 'production' && { devCode: code })
    })
  } catch (error) {
    console.error('Register start error:', error)
    res.status(500).json({ error: 'Ошибка отправки кода' })
  }
})

// Step 2: Complete registration with code verification
router.post('/register-complete', async (req, res) => {
  try {
    const { email, code } = req.body

    if (!email || !code) {
      return res.status(400).json({ error: 'Email и код обязательны' })
    }

    // Get pending registration
    const pending = pendingRegistrations.get(email)

    if (!pending) {
      return res.status(400).json({ error: 'Регистрация не найдена. Начните заново.' })
    }

    // Check expiration
    if (new Date() > pending.expiresAt) {
      pendingRegistrations.delete(email)
      return res.status(400).json({ error: 'Код истёк. Начните заново.' })
    }

    // Verify code
    if (pending.code !== code) {
      return res.status(400).json({ error: 'Неверный код' })
    }

    // Create user with verified phone
    const passwordHash = await bcrypt.hash(pending.password, 10)

    const user = await prisma.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        passwordHash,
        phone: pending.phone,
        phoneVerified: true,
        isVerified: true, // Verified badge!
        birthDate: new Date(pending.birthDate),
        isProfileComplete: true,
        preferences: {
          create: {}
        },
        photos: {
          create: {
            url: pending.photo,
            isPrimary: true,
            order: 0
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        isProfileComplete: true,
        isVerified: true
      }
    })

    // Clean up pending registration
    pendingRegistrations.delete(email)

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })

    res.json({ token, user })
  } catch (error) {
    console.error('Register complete error:', error)
    res.status(500).json({ error: 'Ошибка регистрации' })
  }
})

export default router
