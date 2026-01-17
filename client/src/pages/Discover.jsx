import React, { useState, useEffect, useRef, createRef } from 'react'
import TinderCard from 'react-tinder-card'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../services/api'
import './Discover.css'

export default function Discover() {
  const [cards, setCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [matchPopup, setMatchPopup] = useState(null)
  const currentIndexRef = useRef(currentIndex)
  const childRefs = useRef([])

  useEffect(() => {
    loadCards()
  }, [])

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  const loadCards = async () => {
    try {
      const data = await api.getCards()
      setCards(data)
      setCurrentIndex(data.length - 1)
      childRefs.current = data.map(() => createRef())
    } catch (error) {
      console.error('Error loading cards:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canSwipe = currentIndex >= 0

  const swiped = async (direction, userId, index) => {
    const isLike = direction === 'right'

    try {
      const result = await api.swipe(userId, isLike)
      if (result.isMatch) {
        const matchedCard = cards.find(c => c.id === userId)
        setMatchPopup(matchedCard)
      }
    } catch (error) {
      console.error('Error swiping:', error)
    }

    updateCurrentIndex(index - 1)
  }

  const outOfFrame = (name, idx) => {
    if (currentIndexRef.current >= idx) {
      childRefs.current[idx]?.current?.restoreCard()
    }
  }

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < cards.length) {
      await childRefs.current[currentIndex]?.current?.swipe(dir)
    }
  }

  const closeMatchPopup = () => {
    setMatchPopup(null)
  }

  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  if (loading) {
    return (
      <div className="discover-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="loading-spinner"
        >
          💜
        </motion.div>
        <p>Загрузка анкет...</p>
      </div>
    )
  }

  if (cards.length === 0 || currentIndex < 0) {
    return (
      <motion.div
        className="discover-empty"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="empty-icon">🔍</span>
        <h2>Анкеты закончились</h2>
        <p>Вернитесь позже, чтобы увидеть новых людей</p>
        <motion.button
          className="btn btn-primary"
          onClick={() => {
            setLoading(true)
            loadCards()
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Обновить
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="discover-page">
      <div className="cards-container">
        {cards.map((card, index) => (
          <TinderCard
            ref={childRefs.current[index]}
            key={card.id}
            className="swipe-card-wrapper"
            onSwipe={(dir) => swiped(dir, card.id, index)}
            onCardLeftScreen={() => outOfFrame(card.name, index)}
            preventSwipe={['up', 'down']}
          >
            <motion.div
              className="swipe-card card"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="card-photo">
                {card.photos?.[0] ? (
                  <img src={card.photos[0].url} alt={card.name} draggable={false} />
                ) : (
                  <div className="no-photo">👤</div>
                )}
                <div className="card-gradient"></div>
              </div>
              <div className="card-info">
                <h2>{card.name}, {calculateAge(card.birthDate)}</h2>
                {card.bio && <p className="card-bio">{card.bio}</p>}
              </div>
            </motion.div>
          </TinderCard>
        ))}
      </div>

      <div className="swipe-buttons">
        <motion.button
          className="btn-nope"
          onClick={() => swipe('left')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={!canSwipe}
        >
          ✕
        </motion.button>
        <motion.button
          className="btn-superlike"
          onClick={() => swipe('up')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={!canSwipe}
        >
          ⭐
        </motion.button>
        <motion.button
          className="btn-like"
          onClick={() => swipe('right')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={!canSwipe}
        >
          ♥
        </motion.button>
      </div>

      <AnimatePresence>
        {matchPopup && (
          <motion.div
            className="match-popup"
            onClick={closeMatchPopup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="match-content"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.span
                className="match-icon"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                💜
              </motion.span>
              <h2>It's a Match!</h2>
              <p>Вы понравились друг другу с {matchPopup.name}</p>
              <div className="match-actions">
                <motion.button
                  className="btn btn-secondary"
                  onClick={closeMatchPopup}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Продолжить
                </motion.button>
                <motion.button
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/matches'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Написать
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
