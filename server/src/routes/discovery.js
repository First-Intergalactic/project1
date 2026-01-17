import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Calculate compatibility score
const calculateCompatibility = (user1, user2) => {
  let score = 50 // Base score

  // Same relationship goals
  if (user1.relationshipGoal && user1.relationshipGoal === user2.relationshipGoal) {
    score += 15
  }

  // Common interests
  const user1Interests = user1.interests?.map(i => i.interestId) || []
  const user2Interests = user2.interests?.map(i => i.interestId) || []
  const commonInterests = user1Interests.filter(id => user2Interests.includes(id))
  if (user1Interests.length > 0 || user2Interests.length > 0) {
    const interestScore = (commonInterests.length / Math.max(user1Interests.length, user2Interests.length, 1)) * 25
    score += interestScore
  }

  // Similar lifestyle
  if (user1.smoking === user2.smoking) score += 5
  if (user1.drinking === user2.drinking) score += 5

  return Math.min(Math.round(score), 99)
}

// Get cards for swiping
router.get('/cards', authenticate, async (req, res) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        preferences: true,
        location: true,
        interests: true
      }
    })

    // Get blocked users (both directions)
    const blocks = await prisma.block.findMany({
      where: {
        OR: [
          { blockerId: req.user.id },
          { blockedId: req.user.id }
        ]
      }
    })
    const blockedIds = blocks.map(b => b.blockerId === req.user.id ? b.blockedId : b.blockerId)

    // Get users already swiped
    const swipedUserIds = await prisma.swipe.findMany({
      where: { swiperId: req.user.id },
      select: { swipedId: true }
    })
    const swipedIds = swipedUserIds.map(s => s.swipedId)

    // Build filter conditions
    const excludeIds = [...new Set([...swipedIds, ...blockedIds, req.user.id])]

    const whereConditions = {
      id: { notIn: excludeIds },
      isProfileComplete: true
    }

    // Filter by gender preference
    if (currentUser.preferences?.genderPreference) {
      whereConditions.gender = currentUser.preferences.genderPreference
    }

    // Filter by verified only
    if (currentUser.preferences?.showOnlyVerified) {
      whereConditions.isVerified = true
    }

    // Filter by online only
    if (currentUser.preferences?.showOnlyOnline) {
      whereConditions.isOnline = true
    }

    // Get potential matches
    let users = await prisma.user.findMany({
      where: whereConditions,
      include: {
        photos: { orderBy: { order: 'asc' } },
        interests: { include: { interest: true } },
        location: true
      },
      take: 50
    })

    const now = new Date()
    const minAge = currentUser.preferences?.minAge || 18
    const maxAge = currentUser.preferences?.maxAge || 70
    const maxDistance = currentUser.preferences?.maxDistance || 100

    // Filter and score users
    users = users
      .filter(user => {
        // Age filter
        if (!user.birthDate) return false
        const age = now.getFullYear() - user.birthDate.getFullYear()
        if (age < minAge || age > maxAge) return false

        // Distance filter (if both have location)
        if (currentUser.location && user.location) {
          const distance = calculateDistance(
            currentUser.location.latitude,
            currentUser.location.longitude,
            user.location.latitude,
            user.location.longitude
          )
          if (distance > maxDistance) return false
          user.distance = Math.round(distance)
        }

        return true
      })
      .map(user => ({
        id: user.id,
        name: user.name,
        birthDate: user.birthDate,
        bio: user.bio,
        photos: user.photos,
        interests: user.interests.map(i => i.interest),
        city: user.location?.city,
        distance: user.distance,
        isVerified: user.isVerified,
        isOnline: user.isOnline,
        lastOnline: user.lastOnline,
        relationshipGoal: user.relationshipGoal,
        compatibility: calculateCompatibility(currentUser, user)
      }))
      // Sort by compatibility
      .sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, 20)

    res.json(users)
  } catch (error) {
    console.error('Get cards error:', error)
    res.status(500).json({ error: 'Ошибка получения анкет' })
  }
})

// Get people nearby
router.get('/nearby', authenticate, async (req, res) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { location: true, preferences: true }
    })

    if (!currentUser.location) {
      return res.status(400).json({ error: 'Укажите вашу геолокацию' })
    }

    const users = await prisma.user.findMany({
      where: {
        id: { not: req.user.id },
        isProfileComplete: true,
        location: { isNot: null }
      },
      include: {
        photos: { where: { isPrimary: true }, take: 1 },
        location: true
      }
    })

    const maxDistance = req.query.distance ? parseInt(req.query.distance) : 10

    const nearbyUsers = users
      .map(user => {
        const distance = calculateDistance(
          currentUser.location.latitude,
          currentUser.location.longitude,
          user.location.latitude,
          user.location.longitude
        )
        return { ...user, distance }
      })
      .filter(user => user.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 50)
      .map(user => ({
        id: user.id,
        name: user.name,
        photos: user.photos,
        distance: Math.round(user.distance * 10) / 10,
        isVerified: user.isVerified,
        isOnline: user.isOnline
      }))

    res.json(nearbyUsers)
  } catch (error) {
    console.error('Get nearby error:', error)
    res.status(500).json({ error: 'Ошибка получения людей рядом' })
  }
})

// Get ice breakers
router.get('/icebreakers', authenticate, async (req, res) => {
  try {
    const category = req.query.category
    const where = category ? { category } : {}

    const iceBreakers = await prisma.iceBreaker.findMany({
      where,
      take: 10
    })

    res.json(iceBreakers)
  } catch (error) {
    console.error('Get ice breakers error:', error)
    res.status(500).json({ error: 'Ошибка получения фраз' })
  }
})

// Browse all users (no swipe filtering, includes current user)
router.get('/browse', authenticate, async (req, res) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        interests: true,
        location: true
      }
    })

    // Get ALL users including current user
    const users = await prisma.user.findMany({
      include: {
        photos: { orderBy: { order: 'asc' } },
        interests: { include: { interest: true } },
        location: true
      }
    })

    const result = users.map(user => ({
      id: user.id,
      name: user.name,
      birthDate: user.birthDate,
      bio: user.bio,
      photos: user.photos,
      interests: user.interests.map(i => i.interest),
      city: user.location?.city,
      isVerified: user.isVerified,
      isOnline: user.isOnline,
      lastOnline: user.lastOnline,
      createdAt: user.createdAt,
      compatibility: calculateCompatibility(currentUser, user)
    }))

    res.json(result)
  } catch (error) {
    console.error('Browse users error:', error)
    res.status(500).json({ error: 'Ошибка получения пользователей' })
  }
})

// Who liked me (shows users who swiped right on current user)
router.get('/likes', authenticate, async (req, res) => {
  try {
    const likes = await prisma.swipe.findMany({
      where: {
        swipedId: req.user.id,
        isLike: true,
        // Only show if current user hasn't swiped back yet
        swiper: {
          swipesReceived: {
            none: { swiperId: req.user.id }
          }
        }
      },
      include: {
        swiper: {
          include: { photos: { where: { isPrimary: true }, take: 1 } }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(likes.map(l => ({
      id: l.id,
      user: {
        id: l.swiper.id,
        name: l.swiper.name,
        photos: l.swiper.photos,
        isVerified: l.swiper.isVerified
      },
      isSuperLike: l.isSuperLike,
      likedAt: l.createdAt
    })))
  } catch (error) {
    console.error('Get likes error:', error)
    res.status(500).json({ error: 'Ошибка получения лайков' })
  }
})

export default router
