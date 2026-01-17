import express from 'express'
import { PrismaClient } from '@prisma/client'
import Anthropic from '@anthropic-ai/sdk'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

// Check if user has premium or free suggestions left
const checkAiAccess = async (userId, matchId) => {
  // Get user's subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  })

  // Premium users have unlimited access
  if (subscription?.status === 'active' && subscription?.plan === 'premium') {
    return { allowed: true, isPremium: true }
  }

  // Count user's messages in this match
  const messageCount = await prisma.message.count({
    where: {
      matchId,
      senderId: userId
    }
  })

  // Free users get 3 AI suggestions per conversation
  if (messageCount < 3) {
    return { allowed: true, isPremium: false, messagesLeft: 3 - messageCount }
  }

  return { allowed: false, isPremium: false, messagesLeft: 0 }
}

// Generate AI suggestion
router.post('/suggest', authenticate, async (req, res) => {
  try {
    const { matchId } = req.body

    if (!matchId) {
      return res.status(400).json({ error: 'matchId is required' })
    }

    // Check access
    const access = await checkAiAccess(req.user.id, matchId)
    if (!access.allowed) {
      return res.status(403).json({
        error: 'Лимит бесплатных подсказок исчерпан',
        requiresPremium: true
      })
    }

    // Get match details with other user's profile
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [
          { user1Id: req.user.id },
          { user2Id: req.user.id }
        ]
      },
      include: {
        user1: {
          include: {
            interests: { include: { interest: true } }
          }
        },
        user2: {
          include: {
            interests: { include: { interest: true } }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!match) {
      return res.status(404).json({ error: 'Чат не найден' })
    }

    // Determine other user
    const otherUser = match.user1Id === req.user.id ? match.user2 : match.user1
    const currentUser = match.user1Id === req.user.id ? match.user1 : match.user2

    // Build context for AI
    const otherUserInterests = otherUser.interests.map(i => i.interest.name).join(', ')
    const recentMessages = match.messages.reverse().map(m => ({
      role: m.senderId === req.user.id ? 'Я' : otherUser.name,
      content: m.content
    }))

    const conversationContext = recentMessages.length > 0
      ? `\n\nПоследние сообщения в диалоге:\n${recentMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`
      : '\n\nЭто будет первое сообщение в диалоге.'

    const prompt = `Ты помощник в приложении для знакомств. Твоя задача — помочь написать дружелюбное сообщение.

Информация о собеседнике:
- Имя: ${otherUser.name}
- О себе: ${otherUser.bio || 'Не указано'}
- Интересы: ${otherUserInterests || 'Не указаны'}
${conversationContext}

Напиши одно короткое (1-2 предложения), дружелюбное сообщение от моего имени. Учти интересы собеседника и контекст диалога. Будь естественным, не слишком формальным. Не используй смайлики чрезмерно (максимум 1). Отвечай ТОЛЬКО текстом сообщения, без пояснений.`

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 150,
      messages: [
        { role: 'user', content: prompt }
      ]
    })

    const suggestion = message.content[0].text.trim()

    res.json({
      suggestion,
      isPremium: access.isPremium,
      messagesLeft: access.messagesLeft
    })
  } catch (error) {
    console.error('AI suggestion error:', error)
    res.status(500).json({ error: 'Ошибка генерации подсказки' })
  }
})

// Check AI access status
router.get('/status/:matchId', authenticate, async (req, res) => {
  try {
    const access = await checkAiAccess(req.user.id, req.params.matchId)
    res.json(access)
  } catch (error) {
    console.error('AI status error:', error)
    res.status(500).json({ error: 'Ошибка проверки статуса' })
  }
})

export default router
