import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import './Matches.css'

export default function Matches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      const data = await api.getMatches()
      setMatches(data)
    } catch (error) {
      console.error('Error loading matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'только что'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч назад`
    return date.toLocaleDateString('ru-RU')
  }

  if (loading) {
    return <div className="matches-loading">Загрузка...</div>
  }

  return (
    <div className="matches-page">
      <h1 className="page-title">Сообщения</h1>

      {matches.length === 0 ? (
        <div className="matches-empty">
          <span className="empty-icon">💬</span>
          <h2>Пока нет совпадений</h2>
          <p>Когда вы понравитесь друг другу, здесь появится чат</p>
          <Link to="/discover" className="btn btn-primary">
            Искать пару
          </Link>
        </div>
      ) : (
        <div className="matches-list">
          {matches.map(match => (
            <Link key={match.id} to={`/chat/${match.id}`} className="match-item">
              <div className="match-avatar">
                {match.user.photos?.[0] ? (
                  <img src={match.user.photos[0].url} alt={match.user.name} />
                ) : (
                  <span>👤</span>
                )}
                {match.unreadCount > 0 && (
                  <span className="unread-badge">{match.unreadCount}</span>
                )}
              </div>
              <div className="match-info">
                <h3>{match.user.name}</h3>
                {match.lastMessage ? (
                  <p className={match.unreadCount > 0 ? 'unread' : ''}>
                    {match.lastMessage.content}
                  </p>
                ) : (
                  <p className="no-messages">Начните разговор!</p>
                )}
              </div>
              <div className="match-time">
                {match.lastMessage && formatTime(match.lastMessage.createdAt)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
