import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Update online status middleware
const updateOnlineStatus = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { lastOnline: new Date(), isOnline: true }
  })
}

// Get profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    await updateOnlineStatus(req.user.id)

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        photos: { orderBy: { order: 'asc' } },
        preferences: true,
        interests: { include: { interest: true } },
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
      ...user,
      age,
      city: user.location?.city || null
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Ошибка получения профиля' })
  }
})

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const {
      name, birthDate, age, gender, bio, city,
      height, occupation, education, relationshipGoal,
      smoking, drinking, children, languages
    } = req.body

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (birthDate !== undefined) updateData.birthDate = new Date(birthDate)
    // Convert age to birthDate if age is provided
    if (age !== undefined && !birthDate) {
      const today = new Date()
      const birthYear = today.getFullYear() - parseInt(age)
      updateData.birthDate = new Date(birthYear, today.getMonth(), today.getDate())
    }
    if (gender !== undefined) updateData.gender = gender
    if (bio !== undefined) updateData.bio = bio
    if (height !== undefined) updateData.height = height
    if (occupation !== undefined) updateData.occupation = occupation
    if (education !== undefined) updateData.education = education
    if (relationshipGoal !== undefined) updateData.relationshipGoal = relationshipGoal
    if (smoking !== undefined) updateData.smoking = smoking
    if (drinking !== undefined) updateData.drinking = drinking
    if (children !== undefined) updateData.children = children
    if (languages !== undefined) updateData.languages = languages

    const hasPhotos = await prisma.photo.count({ where: { userId: req.user.id } })

    if (name && (birthDate || age) && gender && hasPhotos > 0) {
      updateData.isProfileComplete = true
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      include: { location: true }
    })

    // Update city in Location table if provided
    if (city !== undefined) {
      await prisma.location.upsert({
        where: { userId: req.user.id },
        update: { city },
        create: { userId: req.user.id, city, latitude: 0, longitude: 0 }
      })
    }

    // Calculate age from birthDate for response
    let userAge = null
    if (user.birthDate) {
      const today = new Date()
      const birth = new Date(user.birthDate)
      userAge = today.getFullYear() - birth.getFullYear()
      const m = today.getMonth() - birth.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        userAge--
      }
    }

    // Get updated location
    const location = await prisma.location.findUnique({ where: { userId: req.user.id } })

    res.json({
      ...user,
      age: userAge,
      city: location?.city || null
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Ошибка обновления профиля' })
  }
})

// Upload photo
router.post('/photos', authenticate, async (req, res) => {
  try {
    const { photo, isVerification } = req.body

    if (!photo) {
      return res.status(400).json({ error: 'Фото обязательно' })
    }

    const photosCount = await prisma.photo.count({ where: { userId: req.user.id } })

    if (photosCount >= 6 && !isVerification) {
      return res.status(400).json({ error: 'Максимум 6 фото' })
    }

    const newPhoto = await prisma.photo.create({
      data: {
        userId: req.user.id,
        url: photo,
        isPrimary: photosCount === 0,
        isVerification: isVerification || false,
        order: photosCount
      }
    })

    // Update profile completeness
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })

    if (user.name && user.birthDate && user.gender) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { isProfileComplete: true }
      })
    }

    res.json(newPhoto)
  } catch (error) {
    console.error('Upload photo error:', error)
    res.status(500).json({ error: 'Ошибка загрузки фото' })
  }
})

// Delete photo
router.delete('/photos/:id', authenticate, async (req, res) => {
  try {
    const photo = await prisma.photo.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    })

    if (!photo) {
      return res.status(404).json({ error: 'Фото не найдено' })
    }

    await prisma.photo.delete({ where: { id: req.params.id } })

    res.json({ success: true })
  } catch (error) {
    console.error('Delete photo error:', error)
    res.status(500).json({ error: 'Ошибка удаления фото' })
  }
})

// Verify profile (submit verification photo)
router.post('/verify', authenticate, async (req, res) => {
  try {
    const { photo } = req.body

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        verificationPhoto: photo,
        isVerified: true // In production, this would be manual review
      }
    })

    res.json({ success: true, message: 'Профиль верифицирован' })
  } catch (error) {
    console.error('Verify error:', error)
    res.status(500).json({ error: 'Ошибка верификации' })
  }
})

// Update preferences
router.put('/preferences', authenticate, async (req, res) => {
  try {
    const {
      minAge, maxAge, genderPreference, maxDistance,
      showOnlyVerified, showOnlyOnline, onlyMatchedCanMessage
    } = req.body

    const preferences = await prisma.preferences.upsert({
      where: { userId: req.user.id },
      update: {
        minAge: minAge ?? undefined,
        maxAge: maxAge ?? undefined,
        genderPreference: genderPreference ?? undefined,
        maxDistance: maxDistance ?? undefined,
        showOnlyVerified: showOnlyVerified ?? undefined,
        showOnlyOnline: showOnlyOnline ?? undefined,
        onlyMatchedCanMessage: onlyMatchedCanMessage ?? undefined
      },
      create: {
        userId: req.user.id,
        minAge: minAge ?? 18,
        maxAge: maxAge ?? 50,
        genderPreference,
        maxDistance: maxDistance ?? 50
      }
    })

    res.json(preferences)
  } catch (error) {
    console.error('Update preferences error:', error)
    res.status(500).json({ error: 'Ошибка обновления настроек' })
  }
})

// Update location
router.put('/location', authenticate, async (req, res) => {
  try {
    const { latitude, longitude, city, country } = req.body

    const location = await prisma.location.upsert({
      where: { userId: req.user.id },
      update: { latitude, longitude, city, country },
      create: { userId: req.user.id, latitude, longitude, city, country }
    })

    res.json(location)
  } catch (error) {
    console.error('Update location error:', error)
    res.status(500).json({ error: 'Ошибка обновления локации' })
  }
})

// Update interests
router.put('/interests', authenticate, async (req, res) => {
  try {
    const { interestIds } = req.body

    // Remove existing interests
    await prisma.userInterest.deleteMany({ where: { userId: req.user.id } })

    // Add new interests
    if (interestIds && interestIds.length > 0) {
      await prisma.userInterest.createMany({
        data: interestIds.map(interestId => ({
          userId: req.user.id,
          interestId
        }))
      })
    }

    const interests = await prisma.userInterest.findMany({
      where: { userId: req.user.id },
      include: { interest: true }
    })

    res.json(interests)
  } catch (error) {
    console.error('Update interests error:', error)
    res.status(500).json({ error: 'Ошибка обновления интересов' })
  }
})

// Get all interests
router.get('/interests/all', authenticate, async (req, res) => {
  try {
    const interests = await prisma.interest.findMany({
      orderBy: { category: 'asc' }
    })
    res.json(interests)
  } catch (error) {
    console.error('Get interests error:', error)
    res.status(500).json({ error: 'Ошибка получения интересов' })
  }
})

// Get who viewed my profile
router.get('/views', authenticate, async (req, res) => {
  try {
    const views = await prisma.profileView.findMany({
      where: { viewedId: req.user.id },
      include: {
        viewer: {
          include: { photos: { where: { isPrimary: true }, take: 1 } }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    res.json(views.map(v => ({
      id: v.id,
      user: {
        id: v.viewer.id,
        name: v.viewer.name,
        photos: v.viewer.photos,
        isVerified: v.viewer.isVerified,
        isOnline: v.viewer.isOnline
      },
      viewedAt: v.createdAt
    })))
  } catch (error) {
    console.error('Get views error:', error)
    res.status(500).json({ error: 'Ошибка получения просмотров' })
  }
})

// Get favorites
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        favorite: {
          include: { photos: { where: { isPrimary: true }, take: 1 } }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(favorites.map(f => ({
      id: f.id,
      user: {
        id: f.favorite.id,
        name: f.favorite.name,
        birthDate: f.favorite.birthDate,
        photos: f.favorite.photos,
        isVerified: f.favorite.isVerified,
        isOnline: f.favorite.isOnline,
        lastOnline: f.favorite.lastOnline
      },
      addedAt: f.createdAt
    })))
  } catch (error) {
    console.error('Get favorites error:', error)
    res.status(500).json({ error: 'Ошибка получения избранного' })
  }
})

// Add to favorites
router.post('/favorites/:userId', authenticate, async (req, res) => {
  try {
    const favorite = await prisma.favorite.create({
      data: { userId: req.user.id, favoriteId: req.params.userId }
    })
    res.json(favorite)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Уже в избранном' })
    }
    console.error('Add favorite error:', error)
    res.status(500).json({ error: 'Ошибка добавления в избранное' })
  }
})

// Remove from favorites
router.delete('/favorites/:userId', authenticate, async (req, res) => {
  try {
    await prisma.favorite.deleteMany({
      where: { userId: req.user.id, favoriteId: req.params.userId }
    })
    res.json({ success: true })
  } catch (error) {
    console.error('Remove favorite error:', error)
    res.status(500).json({ error: 'Ошибка удаления из избранного' })
  }
})

// Block user
router.post('/block/:userId', authenticate, async (req, res) => {
  try {
    await prisma.block.create({
      data: { blockerId: req.user.id, blockedId: req.params.userId }
    })

    // Also unmatch if matched
    await prisma.match.deleteMany({
      where: {
        OR: [
          { user1Id: req.user.id, user2Id: req.params.userId },
          { user1Id: req.params.userId, user2Id: req.user.id }
        ]
      }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Block user error:', error)
    res.status(500).json({ error: 'Ошибка блокировки' })
  }
})

// Unblock user
router.delete('/block/:userId', authenticate, async (req, res) => {
  try {
    await prisma.block.deleteMany({
      where: { blockerId: req.user.id, blockedId: req.params.userId }
    })
    res.json({ success: true })
  } catch (error) {
    console.error('Unblock user error:', error)
    res.status(500).json({ error: 'Ошибка разблокировки' })
  }
})

// Report user
router.post('/report/:userId', authenticate, async (req, res) => {
  try {
    const { reason, description } = req.body

    const report = await prisma.report.create({
      data: {
        reporterId: req.user.id,
        reportedId: req.params.userId,
        reason,
        description
      }
    })

    res.json({ success: true, reportId: report.id })
  } catch (error) {
    console.error('Report user error:', error)
    res.status(500).json({ error: 'Ошибка отправки жалобы' })
  }
})

// Get notifications
router.get('/notifications', authenticate, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    res.json(notifications)
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ error: 'Ошибка получения уведомлений' })
  }
})

// Mark notifications as read
router.post('/notifications/read', authenticate, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true }
    })
    res.json({ success: true })
  } catch (error) {
    console.error('Mark notifications read error:', error)
    res.status(500).json({ error: 'Ошибка обновления уведомлений' })
  }
})

// Get user profile by ID (for viewing other profiles)
router.get('/:userId', authenticate, async (req, res) => {
  try {
    // Check if blocked
    const blocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: req.user.id, blockedId: req.params.userId },
          { blockerId: req.params.userId, blockedId: req.user.id }
        ]
      }
    })

    if (blocked) {
      return res.status(404).json({ error: 'Пользователь не найден' })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      include: {
        photos: { orderBy: { order: 'asc' } },
        interests: { include: { interest: true } },
        location: { select: { city: true } }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' })
    }

    // Record profile view
    await prisma.profileView.create({
      data: { viewerId: req.user.id, viewedId: req.params.userId }
    }).catch(() => {}) // Ignore if duplicate

    // Calculate compatibility
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { interests: true }
    })

    const userInterestIds = user.interests.map(i => i.interestId)
    const myInterestIds = currentUser.interests.map(i => i.interestId)
    const commonInterests = userInterestIds.filter(id => myInterestIds.includes(id))
    const compatibility = userInterestIds.length > 0
      ? Math.round((commonInterests.length / Math.max(userInterestIds.length, myInterestIds.length)) * 100)
      : 50

    // Check if in favorites
    const isFavorite = await prisma.favorite.findFirst({
      where: { userId: req.user.id, favoriteId: req.params.userId }
    })

    res.json({
      id: user.id,
      name: user.name,
      birthDate: user.birthDate,
      gender: user.gender,
      bio: user.bio,
      photos: user.photos,
      interests: user.interests.map(i => i.interest),
      city: user.location?.city,
      isVerified: user.isVerified,
      isOnline: user.isOnline,
      lastOnline: user.lastOnline,
      height: user.height,
      occupation: user.occupation,
      education: user.education,
      relationshipGoal: user.relationshipGoal,
      smoking: user.smoking,
      drinking: user.drinking,
      children: user.children,
      compatibility,
      isFavorite: !!isFavorite
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Ошибка получения профиля' })
  }
})

export default router
