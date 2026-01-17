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
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
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
