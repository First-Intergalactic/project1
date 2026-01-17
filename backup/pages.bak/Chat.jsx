import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import { api } from '../services/api'
import './Chat.css'

export default function Chat() {
  const { matchId } = useParams()
  const { user } = useAuth()
  const { socket } = useSocket()
  const [messages, setMessages] = useState([])
  const [match, setMatch] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    loadMessages()
  }, [matchId])

  useEffect(() => {
    if (socket && matchId) {
      socket.emit('join_match', matchId)

      socket.on('new_message', (message) => {
        if (message.matchId === matchId) {
          setMessages(prev => [...prev, message])
          api.markMessagesRead(matchId)
        }
      })

      socket.on('user_typing', (data) => {
        if (data.matchId === matchId) {
          setIsTyping(true)
        }
      })

      socket.on('user_stop_typing', (data) => {
        if (data.matchId === matchId) {
          setIsTyping(false)
        }
      })

      return () => {
        socket.emit('leave_match', matchId)
        socket.off('new_message')
        socket.off('user_typing')
        socket.off('user_stop_typing')
      }
    }
  }, [socket, matchId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      const data = await api.getMessages(matchId)
      setMessages(data.messages)
      setMatch(data.match)
      await api.markMessagesRead(matchId)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', { matchId })

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { matchId })
      }, 1000)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    const content = newMessage.trim()
    setNewMessage('')
    setSending(true)

    if (socket) {
      socket.emit('stop_typing', { matchId })
    }

    try {
      const message = await api.sendMessage(matchId, content)
      setMessages(prev => [...prev, message])

      if (socket) {
        socket.emit('send_message', { matchId, content })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(content)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня'
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера'
    }
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    })
  }

  const groupMessagesByDate = (messages) => {
    const groups = {}
    messages.forEach(msg => {
      const date = new Date(msg.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(msg)
    })
    return groups
  }

  if (loading) {
    return (
      <div className="chat-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          💬
        </motion.div>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="chat-page">
      <motion.div
        className="chat-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Link to="/matches" className="back-btn">←</Link>
        <div className="chat-user">
          <div className="chat-avatar">
            {match?.user.photos?.[0] ? (
              <img src={match.user.photos[0].url} alt={match.user.name} />
            ) : (
              <span>👤</span>
            )}
          </div>
          <div>
            <h2>{match?.user.name}</h2>
            <AnimatePresence>
              {isTyping && (
                <motion.span
                  className="typing-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  печатает...
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <motion.div
            className="chat-empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>💬</span>
            <p>Начните разговор! Напишите первое сообщение.</p>
          </motion.div>
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date} className="message-group">
              <div className="date-separator">
                <span>{formatDate(msgs[0].createdAt)}</span>
              </div>
              <AnimatePresence>
                {msgs.map((msg, index) => (
                  <motion.div
                    key={msg.id || index}
                    className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="message-content">
                      <p>{msg.content}</p>
                      <span className="message-time">{formatTime(msg.createdAt)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <motion.form
        className="chat-input"
        onSubmit={handleSend}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value)
            handleTyping()
          }}
          placeholder="Напишите сообщение..."
          disabled={sending}
        />
        <motion.button
          type="submit"
          className="send-btn"
          disabled={!newMessage.trim() || sending}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ➤
        </motion.button>
      </motion.form>
    </div>
  )
}
