import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.js'

const prisma = new PrismaClient()
import userRoutes from './routes/users.js'
import discoveryRoutes from './routes/discovery.js'
import matchRoutes from './routes/matches.js'
import swipeRoutes from './routes/swipes.js'
import aiRoutes from './routes/ai.js'
import subscriptionRoutes from './routes/subscription.js'
import phoneRoutes from './routes/phone.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://project161.netlify.app', 'https://project161.netlify.com']
  : ['http://localhost:5173', 'http://localhost:3000']

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Make io available in routes
app.set('io', io)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/discovery', discoveryRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/swipes', swipeRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/subscription', subscriptionRoutes)
app.use('/api/phone', phoneRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Seed database endpoint (one-time use)
import bcrypt from 'bcryptjs'
app.post('/api/admin/seed', async (req, res) => {
  const { key } = req.body
  if (key !== 'seed-lovematch-2026') {
    return res.status(403).json({ error: 'Invalid key' })
  }

  try {
    // Check if already seeded
    const existingUsers = await prisma.user.count()
    if (existingUsers > 10) {
      return res.json({ message: 'Database already seeded', users: existingUsers })
    }

    const interests = [
      { name: 'Фитнес', icon: '💪', category: 'sports' },
      { name: 'Йога', icon: '🧘', category: 'sports' },
      { name: 'Путешествия', icon: '✈️', category: 'travel' },
      { name: 'Фотография', icon: '📷', category: 'creative' },
      { name: 'Кино', icon: '🎬', category: 'entertainment' },
      { name: 'Музыка', icon: '🎵', category: 'creative' },
      { name: 'Танцы', icon: '💃', category: 'creative' },
      { name: 'Кофе', icon: '☕', category: 'food' },
      { name: 'Готовка', icon: '👨‍🍳', category: 'food' },
      { name: 'Чтение', icon: '📚', category: 'entertainment' },
      { name: 'Видеоигры', icon: '🎮', category: 'entertainment' },
      { name: 'Рисование', icon: '🎨', category: 'creative' }
    ]

    for (const interest of interests) {
      await prisma.interest.upsert({
        where: { name: interest.name },
        update: {},
        create: interest
      })
    }

    const demoUsers = [
      // 14 девушек (70%)
      { email: 'sofia@demo.com', name: 'София', gender: 'female', bio: '✨ Студентка медицинского! Обожаю танцы и K-pop 💜', birthDate: new Date('2005-03-12'), photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400' },
      { email: 'alisa@demo.com', name: 'Алиса', gender: 'female', bio: '🌸 Художница и мечтательница. Рисую аниме арты!', birthDate: new Date('2005-07-22'), photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
      { email: 'mia@demo.com', name: 'Мия', gender: 'female', bio: '🎀 Люблю аниме, мангу и милых котиков~ Nyaa!', birthDate: new Date('2006-11-08'), photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' },
      { email: 'daria@demo.com', name: 'Дарья', gender: 'female', bio: '🦋 Мечтаю стать косплеером! Смотрю дорамы', birthDate: new Date('2005-01-25'), photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400' },
      { email: 'polina@demo.com', name: 'Полина', gender: 'female', bio: '💕 Танцую и снимаю тиктоки! Позитивная~', birthDate: new Date('2005-06-14'), photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
      { email: 'karina@demo.com', name: 'Карина', gender: 'female', bio: '🎨 Дизайнер, рисую персонажей! Обожаю Genshin', birthDate: new Date('2005-09-30'), photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400' },
      { email: 'milana@demo.com', name: 'Милана', gender: 'female', bio: '💃 Танцую с 5 лет! K-pop dance cover~', birthDate: new Date('2006-04-18'), photo: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400' },
      { email: 'eva@demo.com', name: 'Ева', gender: 'female', bio: '🌊 Люблю аниме про море и приключения!', birthDate: new Date('2005-08-05'), photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
      { email: 'nika@demo.com', name: 'Ника', gender: 'female', bio: '💜 Отаку и геймерша! Играю в Visual Novels', birthDate: new Date('2006-01-22'), photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400' },
      { email: 'liza@demo.com', name: 'Лиза', gender: 'female', bio: '🌟 Пишу фанфики и читаю мангу! Ищу соулмейта', birthDate: new Date('2005-05-17'), photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400' },
      { email: 'anya@demo.com', name: 'Аня', gender: 'female', bio: '🎵 Слушаю J-pop и учу японский! がんばって!', birthDate: new Date('2006-02-28'), photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400' },
      { email: 'sasha@demo.com', name: 'Саша', gender: 'female', bio: '🎮 Геймерша! Apex, Valorant, Genshin Impact', birthDate: new Date('2005-10-03'), photo: 'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=400' },
      { email: 'nastya@demo.com', name: 'Настя', gender: 'female', bio: '📚 Люблю романтические манхвы и дорамы!', birthDate: new Date('2005-12-11'), photo: 'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=400' },
      { email: 'vika@demo.com', name: 'Вика', gender: 'female', bio: '🌙 Ночная сова~ Смотрю аниме до утра!', birthDate: new Date('2006-07-25'), photo: 'https://images.unsplash.com/photo-1464863979621-258859e62245?w=400' },
      // 6 парней (30%)
      { email: 'maksim@demo.com', name: 'Максим', gender: 'male', bio: '💻 Программист и геймер. Смотрю аниме!', birthDate: new Date('2004-08-17'), photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
      { email: 'nikita@demo.com', name: 'Никита', gender: 'male', bio: '📸 Фотограф-косплеер! Снимаю аниме фесты', birthDate: new Date('2004-11-25'), photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
      { email: 'artem@demo.com', name: 'Артём', gender: 'male', bio: '🎸 Играю J-rock на гитаре! ONE OK ROCK fan', birthDate: new Date('2004-04-30'), photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400' },
      { email: 'danil@demo.com', name: 'Данил', gender: 'male', bio: '🎮 Стример и геймер! Играю в Genshin', birthDate: new Date('2005-09-08'), photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400' },
      { email: 'kirill@demo.com', name: 'Кирилл', gender: 'male', bio: '✨ Люблю аниме и мангу. Ищу няшную девушку!', birthDate: new Date('2004-01-15'), photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
      { email: 'gleb@demo.com', name: 'Глеб', gender: 'male', bio: '🎮 Геймдизайнер, создаю игры в anime стиле', birthDate: new Date('2005-10-28'), photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400' }
    ]

    const passwordHash = await bcrypt.hash('demo123', 10)
    let created = 0

    for (const userData of demoUsers) {
      const existing = await prisma.user.findUnique({ where: { email: userData.email } })
      if (existing) continue

      await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          gender: userData.gender,
          bio: userData.bio,
          birthDate: userData.birthDate,
          passwordHash,
          isProfileComplete: true,
          isVerified: Math.random() > 0.3,
          preferences: { create: { minAge: 18, maxAge: 25 } },
          photos: { create: { url: userData.photo, isPrimary: true, order: 0 } },
          location: { create: { latitude: 55.75 + (Math.random() - 0.5) * 0.2, longitude: 37.62 + (Math.random() - 0.5) * 0.2, city: 'Москва', country: 'Россия' } }
        }
      })
      created++
    }

    res.json({ message: 'Seed complete', created, total: demoUsers.length })
  } catch (error) {
    console.error('Seed error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    return next(new Error('Authentication error'))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = decoded.userId
    next()
  } catch (err) {
    next(new Error('Authentication error'))
  }
})

// Socket.IO connection handling
const userSockets = new Map()

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`)
  userSockets.set(socket.userId, socket.id)

  // Join user's personal room
  socket.join(`user:${socket.userId}`)

  // Join match rooms
  socket.on('join_match', (matchId) => {
    socket.join(`match:${matchId}`)
    console.log(`User ${socket.userId} joined match ${matchId}`)
  })

  // Leave match room
  socket.on('leave_match', (matchId) => {
    socket.leave(`match:${matchId}`)
  })

  // Handle new message
  socket.on('send_message', async (data) => {
    const { matchId, content } = data

    // Broadcast to match room (excluding sender)
    socket.to(`match:${matchId}`).emit('new_message', {
      matchId,
      senderId: socket.userId,
      content,
      createdAt: new Date().toISOString()
    })
  })

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(`match:${data.matchId}`).emit('user_typing', {
      matchId: data.matchId,
      userId: socket.userId
    })
  })

  socket.on('stop_typing', (data) => {
    socket.to(`match:${data.matchId}`).emit('user_stop_typing', {
      matchId: data.matchId,
      userId: socket.userId
    })
  })

  // Handle disconnect - mark user as offline
  socket.on('disconnect', async () => {
    console.log(`User disconnected: ${socket.userId}`)
    userSockets.delete(socket.userId)

    // Mark user as offline in database
    try {
      await prisma.user.update({
        where: { id: socket.userId },
        data: { isOnline: false, lastOnline: new Date() }
      })
    } catch (err) {
      console.error('Error updating offline status:', err)
    }
  })
})

// Export for use in routes (for sending notifications)
export { io, userSockets }

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Внутренняя ошибка сервера' })
})

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Socket.IO ready`)
})

// Periodic task: mark inactive users as offline (every 2 minutes)
setInterval(async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    await prisma.user.updateMany({
      where: {
        isOnline: true,
        lastOnline: { lt: fiveMinutesAgo }
      },
      data: { isOnline: false }
    })
  } catch (err) {
    console.error('Error in offline check:', err)
  }
}, 2 * 60 * 1000) // Every 2 minutes
