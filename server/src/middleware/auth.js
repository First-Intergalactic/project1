import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Требуется авторизация' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' })
    }

    // Update online status (non-blocking)
    prisma.user.update({
      where: { id: user.id },
      data: { lastOnline: new Date(), isOnline: true }
    }).catch(console.error)

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Неверный токен' })
  }
}
