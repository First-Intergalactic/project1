import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Get all matches
router.get('/', authenticate, async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: req.user.id },
          { user2Id: req.user.id }
        ]
      },
      include: {
        user1: {
          include: {
            photos: {
              where: { isPrimary: true },
              take: 1
            }
          }
        },
        user2: {
          include: {
            photos: {
              where: { isPrimary: true },
              take: 1
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform matches for response
    const result = await Promise.all(matches.map(async match => {
      const otherUser = match.user1Id === req.user.id ? match.user2 : match.user1

      // Count unread messages
      const unreadCount = await prisma.message.count({
        where: {
          matchId: match.id,
          senderId: { not: req.user.id },
          isRead: false
        }
      })

      return {
        id: match.id,
        createdAt: match.createdAt,
        user: {
          id: otherUser.id,
          name: otherUser.name,
          photos: otherUser.photos
        },
        lastMessage: match.messages[0] || null,
        unreadCount
      }
    }))

    res.json(result)
  } catch (error) {
    console.error('Get matches error:', error)
    res.status(500).json({ error: 'Ошибка получения матчей' })
  }
})

// Get messages for a match
router.get('/:matchId/messages', authenticate, async (req, res) => {
  try {
    const match = await prisma.match.findFirst({
      where: {
        id: req.params.matchId,
        OR: [
          { user1Id: req.user.id },
          { user2Id: req.user.id }
        ]
      },
      include: {
        user1: {
          include: {
            photos: {
              where: { isPrimary: true },
              take: 1
            }
          }
        },
        user2: {
          include: {
            photos: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      }
    })

    if (!match) {
      return res.status(404).json({ error: 'Матч не найден' })
    }

    const messages = await prisma.message.findMany({
      where: { matchId: req.params.matchId },
      orderBy: { createdAt: 'asc' }
    })

    const otherUser = match.user1Id === req.user.id ? match.user2 : match.user1

    res.json({
      match: {
        id: match.id,
        user: {
          id: otherUser.id,
          name: otherUser.name,
          photos: otherUser.photos
        }
      },
      messages
    })
  } catch (error) {
    console.error('Get messages error:', error)
    res.status(500).json({ error: 'Ошибка получения сообщений' })
  }
})

// Send message
router.post('/:matchId/messages', authenticate, async (req, res) => {
  try {
    const { content } = req.body

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Сообщение не может быть пустым' })
    }

    // Verify match exists and user is part of it
    const match = await prisma.match.findFirst({
      where: {
        id: req.params.matchId,
        OR: [
          { user1Id: req.user.id },
          { user2Id: req.user.id }
        ]
      }
    })

    if (!match) {
      return res.status(404).json({ error: 'Матч не найден' })
    }

    const message = await prisma.message.create({
      data: {
        matchId: req.params.matchId,
        senderId: req.user.id,
        content: content.trim()
      }
    })

    res.json(message)
  } catch (error) {
    console.error('Send message error:', error)
    res.status(500).json({ error: 'Ошибка отправки сообщения' })
  }
})

// Start or get conversation with any user
router.post('/conversation/:userId', authenticate, async (req, res) => {
  try {
    const otherUserId = req.params.userId

    if (otherUserId === req.user.id) {
      return res.status(400).json({ error: 'Нельзя начать чат с самим собой' })
    }

    // Check if other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      include: {
        photos: { where: { isPrimary: true }, take: 1 }
      }
    })

    if (!otherUser) {
      return res.status(404).json({ error: 'Пользователь не найден' })
    }

    // Find existing match/conversation
    let match = await prisma.match.findFirst({
      where: {
        OR: [
          { user1Id: req.user.id, user2Id: otherUserId },
          { user1Id: otherUserId, user2Id: req.user.id }
        ]
      }
    })

    // Create match if doesn't exist
    if (!match) {
      match = await prisma.match.create({
        data: {
          user1Id: req.user.id,
          user2Id: otherUserId
        }
      })
    }

    res.json({
      matchId: match.id,
      user: {
        id: otherUser.id,
        name: otherUser.name,
        photos: otherUser.photos
      }
    })
  } catch (error) {
    console.error('Start conversation error:', error)
    res.status(500).json({ error: 'Ошибка создания чата' })
  }
})

// Mark messages as read
router.post('/:matchId/read', authenticate, async (req, res) => {
  try {
    await prisma.message.updateMany({
      where: {
        matchId: req.params.matchId,
        senderId: { not: req.user.id },
        isRead: false
      },
      data: { isRead: true }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Mark read error:', error)
    res.status(500).json({ error: 'Ошибка обновления статуса' })
  }
})

// Toggle emoji reaction on message
router.post('/messages/:messageId/react', authenticate, async (req, res) => {
  try {
    const { emoji } = req.body

    if (!emoji) {
      return res.status(400).json({ error: 'Emoji required' })
    }

    // Find message and verify user has access
    const message = await prisma.message.findFirst({
      where: { id: req.params.messageId },
      include: {
        match: true
      }
    })

    if (!message) {
      return res.status(404).json({ error: 'Сообщение не найдено' })
    }

    // Check if user is part of the match
    if (message.match.user1Id !== req.user.id && message.match.user2Id !== req.user.id) {
      return res.status(403).json({ error: 'Нет доступа' })
    }

    // Get current reactions
    let reactions = message.reactions || []

    // Toggle reaction: remove if exists, add if not
    const existingIndex = reactions.findIndex(
      r => r.emoji === emoji && r.userId === req.user.id
    )

    if (existingIndex >= 0) {
      reactions.splice(existingIndex, 1)
    } else {
      reactions.push({ emoji, userId: req.user.id })
    }

    // Update message
    const updated = await prisma.message.update({
      where: { id: req.params.messageId },
      data: { reactions }
    })

    res.json(updated)
  } catch (error) {
    console.error('React error:', error)
    res.status(500).json({ error: 'Ошибка добавления реакции' })
  }
})

export default router
