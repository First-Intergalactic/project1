import React, { createContext, useContext, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import './styles/index.css'

// === LOCALIZATION ===
const translations = {
  ru: {
    // Landing
    appName: 'LoveMatch',
    tagline: 'Найди свою половинку среди тысяч людей рядом',
    usersCount: 'Более 10 000 пользователей уже нашли свою любовь',
    login: 'Войти',
    register: 'Регистрация',
    // Auth
    loginTitle: 'Вход',
    email: 'Email',
    password: 'Пароль',
    loading: 'Загрузка...',
    demo: 'Демо: anna@demo.com / demo123',
    backToMain: '← На главную',
    // Navigation
    search: 'Поиск',
    people: 'Люди',
    chats: 'Чаты',
    profile: 'Профиль',
    // People page
    searchPeople: 'Поиск людей',
    byCompatibility: 'По совместимости',
    youngerFirst: 'Сначала младше',
    olderFirst: 'Сначала старше',
    newProfiles: 'Новые анкеты',
    onlineNow: 'Сейчас онлайн',
    age: 'Возраст',
    found: 'Найдено',
    persons: 'человек',
    noOneFound: 'Никого не найдено',
    changeFilters: 'Попробуй изменить фильтры',
    backToTop: '↑ В начало',
    // Profile modal
    itsYou: 'Это ты!',
    skip: 'Пропустить',
    like: 'Нравится',
    write: 'Написать',
    match: 'совпадение',
    interests: 'Интересы',
    defaultBio: 'Привет! Я ищу интересных людей для общения. Давай познакомимся!',
    // Discover
    cardsEnded: 'Карточки закончились',
    checkLater: 'Загляни позже!',
    itsMatch: 'Это Match!',
    youLikedEachOther: 'Вы понравились друг другу с',
    continue: 'Продолжить',
    // Profile
    logout: 'Выйти',
    name: 'Имя',
    city: 'Город',
    aboutMe: 'О себе',
    edit: 'Редактировать',
    cancel: 'Отмена',
    save: 'Сохранить',
    saving: 'Сохранение...',
    // Chats
    messages: 'Сообщения',
    noMessages: 'Пока нет сообщений',
    startChatting: 'Начни общаться с людьми на странице "Люди"',
    startConversation: 'Начните общение...',
    writeMessage: 'Написать сообщение...',
    writeFirst: 'Напишите первое сообщение!',
    // Language
    selectLanguage: 'Язык',
    russian: 'Русский',
    english: 'English',
    spanish: 'Español',
    // AI Suggestions
    aiSuggest: 'AI подсказка',
    aiGenerating: 'Генерирую...',
    aiUseThis: 'Использовать',
    aiTryAnother: 'Другой вариант',
    aiClose: 'Закрыть',
    aiFreeSuggestionsLeft: 'Осталось бесплатных подсказок',
    aiPremiumRequired: 'Нужна Premium подписка',
    // Subscription
    premiumTitle: 'LoveMatch Premium',
    premiumDescription: 'Безлимитные AI-подсказки для общения',
    premiumPrice: '$10 / месяц',
    premiumSubscribe: 'Подписаться',
    premiumActive: 'Premium активен',
    premiumCancel: 'Отменить подписку',
    premiumUntil: 'Активна до',
    premiumCanceled: 'Подписка отменена',
    // Gift feature
    sendGift: 'Отправить подарок',
    giftSent: 'Подарок отправлен!',
    // Phone verification
    phoneVerification: 'Подтверждение телефона',
    enterPhone: 'Введите номер телефона',
    sendCode: 'Отправить код',
    enterCode: 'Введите код из SMS',
    verifyCode: 'Подтвердить',
    phoneVerified: 'Телефон подтверждён!',
    verifyToGetBadge: 'Подтвердите номер телефона, чтобы получить значок верификации',
    // Registration
    uploadPhoto: 'Загрузите ваше фото',
    clickToUpload: 'Нажмите, чтобы выбрать фото',
    birthDate: 'Дата рождения',
    // Chat
    typing: 'печатает...',
    online: 'онлайн',
    minAgo: 'мин. назад',
    hoursAgo: 'ч. назад',
    daysAgo: 'дн. назад'
  },
  en: {
    appName: 'LoveMatch',
    tagline: 'Find your soulmate among thousands of people nearby',
    usersCount: 'Over 10,000 users have already found their love',
    login: 'Login',
    register: 'Sign Up',
    loginTitle: 'Login',
    email: 'Email',
    password: 'Password',
    loading: 'Loading...',
    demo: 'Demo: anna@demo.com / demo123',
    backToMain: '← Back to main',
    search: 'Search',
    people: 'People',
    chats: 'Chats',
    profile: 'Profile',
    searchPeople: 'Search People',
    byCompatibility: 'By compatibility',
    youngerFirst: 'Younger first',
    olderFirst: 'Older first',
    newProfiles: 'New profiles',
    onlineNow: 'Online now',
    age: 'Age',
    found: 'Found',
    persons: 'people',
    noOneFound: 'No one found',
    changeFilters: 'Try changing the filters',
    backToTop: '↑ Back to top',
    itsYou: "It's you!",
    skip: 'Skip',
    like: 'Like',
    write: 'Message',
    match: 'match',
    interests: 'Interests',
    defaultBio: "Hi! I'm looking for interesting people to chat with. Let's get to know each other!",
    cardsEnded: 'No more cards',
    checkLater: 'Check back later!',
    itsMatch: "It's a Match!",
    youLikedEachOther: 'You liked each other with',
    continue: 'Continue',
    logout: 'Logout',
    name: 'Name',
    city: 'City',
    aboutMe: 'About me',
    edit: 'Edit',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    messages: 'Messages',
    noMessages: 'No messages yet',
    startChatting: 'Start chatting with people on the "People" page',
    startConversation: 'Start a conversation...',
    writeMessage: 'Write a message...',
    writeFirst: 'Write the first message!',
    selectLanguage: 'Language',
    russian: 'Русский',
    english: 'English',
    spanish: 'Español',
    // AI Suggestions
    aiSuggest: 'AI suggestion',
    aiGenerating: 'Generating...',
    aiUseThis: 'Use this',
    aiTryAnother: 'Try another',
    aiClose: 'Close',
    aiFreeSuggestionsLeft: 'Free suggestions left',
    aiPremiumRequired: 'Premium required',
    // Subscription
    premiumTitle: 'LoveMatch Premium',
    premiumDescription: 'Unlimited AI suggestions for chatting',
    premiumPrice: '$10 / month',
    premiumSubscribe: 'Subscribe',
    premiumActive: 'Premium active',
    premiumCancel: 'Cancel subscription',
    premiumUntil: 'Active until',
    premiumCanceled: 'Subscription canceled',
    // Gift feature
    sendGift: 'Send gift',
    giftSent: 'Gift sent!',
    // Phone verification
    phoneVerification: 'Phone Verification',
    enterPhone: 'Enter phone number',
    sendCode: 'Send code',
    enterCode: 'Enter SMS code',
    verifyCode: 'Verify',
    phoneVerified: 'Phone verified!',
    verifyToGetBadge: 'Verify your phone number to get the verification badge',
    // Registration
    uploadPhoto: 'Upload your photo',
    clickToUpload: 'Click to select photo',
    birthDate: 'Date of birth',
    // Chat
    typing: 'typing...',
    online: 'online',
    minAgo: 'min ago',
    hoursAgo: 'h ago',
    daysAgo: 'd ago'
  },
  es: {
    appName: 'LoveMatch',
    tagline: 'Encuentra tu media naranja entre miles de personas cercanas',
    usersCount: 'Más de 10.000 usuarios ya han encontrado su amor',
    login: 'Entrar',
    register: 'Registrarse',
    loginTitle: 'Iniciar sesión',
    email: 'Correo',
    password: 'Contraseña',
    loading: 'Cargando...',
    demo: 'Demo: anna@demo.com / demo123',
    backToMain: '← Volver al inicio',
    search: 'Buscar',
    people: 'Personas',
    chats: 'Chats',
    profile: 'Perfil',
    searchPeople: 'Buscar personas',
    byCompatibility: 'Por compatibilidad',
    youngerFirst: 'Más jóvenes primero',
    olderFirst: 'Mayores primero',
    newProfiles: 'Perfiles nuevos',
    onlineNow: 'En línea ahora',
    age: 'Edad',
    found: 'Encontrados',
    persons: 'personas',
    noOneFound: 'Nadie encontrado',
    changeFilters: 'Intenta cambiar los filtros',
    backToTop: '↑ Ir arriba',
    itsYou: '¡Eres tú!',
    skip: 'Omitir',
    like: 'Me gusta',
    write: 'Escribir',
    match: 'coincidencia',
    interests: 'Intereses',
    defaultBio: '¡Hola! Busco personas interesantes para charlar. ¡Conozcámonos!',
    cardsEnded: 'No hay más tarjetas',
    checkLater: '¡Vuelve más tarde!',
    itsMatch: '¡Es un Match!',
    youLikedEachOther: 'Os habéis gustado mutuamente con',
    continue: 'Continuar',
    logout: 'Salir',
    name: 'Nombre',
    city: 'Ciudad',
    aboutMe: 'Sobre mí',
    edit: 'Editar',
    cancel: 'Cancelar',
    save: 'Guardar',
    saving: 'Guardando...',
    messages: 'Mensajes',
    noMessages: 'Aún no hay mensajes',
    startChatting: 'Comienza a chatear con personas en la página "Personas"',
    startConversation: 'Iniciar conversación...',
    writeMessage: 'Escribe un mensaje...',
    writeFirst: '¡Escribe el primer mensaje!',
    selectLanguage: 'Idioma',
    russian: 'Русский',
    english: 'English',
    spanish: 'Español',
    // AI Suggestions
    aiSuggest: 'Sugerencia AI',
    aiGenerating: 'Generando...',
    aiUseThis: 'Usar esto',
    aiTryAnother: 'Otra opción',
    aiClose: 'Cerrar',
    aiFreeSuggestionsLeft: 'Sugerencias gratis restantes',
    aiPremiumRequired: 'Se requiere Premium',
    // Subscription
    premiumTitle: 'LoveMatch Premium',
    premiumDescription: 'Sugerencias AI ilimitadas para chatear',
    premiumPrice: '$10 / mes',
    premiumSubscribe: 'Suscribirse',
    premiumActive: 'Premium activo',
    premiumCancel: 'Cancelar suscripción',
    premiumUntil: 'Activa hasta',
    premiumCanceled: 'Suscripción cancelada',
    // Gift feature
    sendGift: 'Enviar regalo',
    giftSent: '¡Regalo enviado!',
    // Phone verification
    phoneVerification: 'Verificación de teléfono',
    enterPhone: 'Ingrese número de teléfono',
    sendCode: 'Enviar código',
    enterCode: 'Ingrese el código SMS',
    verifyCode: 'Verificar',
    phoneVerified: '¡Teléfono verificado!',
    verifyToGetBadge: 'Verifica tu número de teléfono para obtener la insignia de verificación',
    // Registration
    uploadPhoto: 'Sube tu foto',
    clickToUpload: 'Haz clic para seleccionar foto',
    birthDate: 'Fecha de nacimiento',
    // Chat
    typing: 'escribiendo...',
    online: 'en línea',
    minAgo: 'min atrás',
    hoursAgo: 'h atrás',
    daysAgo: 'd atrás'
  }
}

// Language Context
const LanguageContext = createContext(null)

function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ru')

  const changeLang = (newLang) => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  const t = (key) => translations[lang][key] || key

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

const useLang = () => useContext(LanguageContext)

// Language Selector Component - Horizontal bar with 3 flags
function LanguageSelector() {
  const { lang, changeLang } = useLang()

  const languages = [
    { code: 'es', flag: '🇪🇸' },
    { code: 'ru', flag: '🇷🇺' },
    { code: 'en', flag: '🇬🇧' }
  ]

  return (
    <div style={{
      display: 'flex',
      background: 'white',
      borderRadius: '0.75em',
      overflow: 'hidden',
      border: '1px solid #e9d5ff',
      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)'
    }}>
      {languages.map((l, index) => (
        <button
          key={l.code}
          onClick={() => changeLang(l.code)}
          style={{
            padding: '0.5em 0.75em',
            background: lang === l.code ? 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)' : 'white',
            border: 'none',
            borderRight: index < languages.length - 1 ? '1px solid #e9d5ff' : 'none',
            cursor: 'pointer',
            fontSize: '1.25em',
            transition: 'all 0.2s',
            opacity: lang === l.code ? 1 : 0.6
          }}
        >
          {l.flag}
        </button>
      ))}
    </div>
  )
}

// === API ===
const API_URL = '/api'

const api = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async getMe() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async getCards() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/discovery/cards`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async swipe(userId, isLike, isSuperLike = false) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/swipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ swipedId: userId, isLike, isSuperLike })
    })
    const data = await response.json()
    if (!response.ok) {
      if (data.limitReached) throw new Error('LIMIT_REACHED')
      throw new Error(data.error || 'Ошибка')
    }
    return data
  },
  async getSwipeLimit() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/swipes/remaining`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async updateProfile(profileData) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async getMatches() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/matches`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async getLikes() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/discovery/likes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async browseUsers() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/discovery/browse`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async startConversation(userId) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/matches/conversation/${userId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async getConversations() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/matches`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async getMessages(matchId) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/matches/${matchId}/messages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async sendMessage(matchId, content) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/matches/${matchId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  // AI Suggestions
  async getAiSuggestion(matchId) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/ai/suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ matchId })
    })
    const data = await response.json()
    if (!response.ok) {
      if (data.requiresPremium) {
        throw { message: data.error, requiresPremium: true }
      }
      throw new Error(data.error || 'Ошибка')
    }
    return data
  },
  async getAiStatus(matchId) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/ai/status/${matchId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  // Subscription
  async getSubscriptionStatus() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/subscription/status`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async createCheckout() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/subscription/create-checkout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async cancelSubscription() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/subscription/cancel`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  // Phone verification
  async sendPhoneCode(phone) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/phone/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ phone })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async verifyPhoneCode(code) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/phone/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ code })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  async getPhoneStatus() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/phone/status`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  },
  // Mark messages as read
  async markAsRead(matchId) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/matches/${matchId}/read`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.ok
  },
  // Toggle emoji reaction on message
  async reactToMessage(messageId, emoji) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/matches/messages/${messageId}/react`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ emoji })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Ошибка')
    return data
  }
}

// === Auth Context ===
const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.getMe()
        .then(data => setUser(data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { token, user } = await api.login(email, password)
    localStorage.setItem('token', token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

// === Pages ===
function Landing() {
  const { t } = useLang()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-base)',
      backgroundImage: 'url(https://images.unsplash.com/photo-1604881991405-b273c7a4386a?w=1920&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      {/* Светлый оверлей */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(250,245,255,0.75) 0%, rgba(243,232,255,0.70) 50%, rgba(233,213,255,0.65) 100%)'
      }} />

      {/* Контент */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        background: 'rgba(255,255,255,0.95)',
        padding: '3em 3.75em',
        borderRadius: '1.875em',
        boxShadow: '0 20px 60px rgba(139, 92, 246, 0.2)',
        maxWidth: 'var(--app-max-width)'
      }}>
        {/* Language selector inside white card */}
        <div style={{ position: 'absolute', top: '1em', right: '1em' }}>
          <LanguageSelector />
        </div>

        <div style={{ fontSize: '4em', marginBottom: '0.25em' }}>💜</div>
        <h1 style={{
          fontSize: '3.25em',
          marginBottom: '0.3em',
          background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '700'
        }}>{t('appName')}</h1>
        <p style={{
          fontSize: '1.25em',
          color: '#6b7280',
          marginBottom: '0.75em'
        }}>
          {t('tagline')}
        </p>
        <p style={{
          fontSize: '0.875em',
          color: '#9ca3af',
          marginBottom: '2em'
        }}>
          {t('usersCount')}
        </p>
        <div style={{ display: 'flex', gap: '1em', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/login" className="btn btn-primary" style={{
            padding: '1em 2.5em',
            fontSize: '1.0625em',
            borderRadius: '1.5em'
          }}>{t('login')}</Link>
          <Link to="/register" className="btn btn-secondary" style={{
            padding: '1em 2.5em',
            fontSize: '1.0625em',
            borderRadius: '1.5em',
            background: 'rgba(139,92,246,0.1)',
            border: '2px solid #c4b5fd',
            color: '#7c3aed'
          }}>{t('register')}</Link>
        </div>
      </div>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('anna@demo.com')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useLang()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/people')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-base)',
      backgroundImage: 'url(https://images.unsplash.com/photo-1604881991405-b273c7a4386a?w=1920&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      {/* Overlay like landing page */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(250,245,255,0.75) 0%, rgba(243,232,255,0.70) 50%, rgba(233,213,255,0.65) 100%)'
      }} />

      <form onSubmit={handleSubmit} style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(255,255,255,0.95)',
        padding: '3em 3.75em',
        borderRadius: '1.875em',
        width: '100%',
        maxWidth: 'var(--app-max-width)',
        boxShadow: '0 20px 60px rgba(139, 92, 246, 0.2)'
      }}>
        {/* Language selector inside white card */}
        <div style={{ position: 'absolute', top: '1em', right: '1em' }}>
          <LanguageSelector />
        </div>

        <h2 style={{ marginBottom: '1.5em', textAlign: 'center', fontSize: '2em', color: '#1f2937' }}>💜 {t('loginTitle')}</h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '1.25em', textAlign: 'center', fontSize: '1em' }}>{error}</p>}
        <input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          style={{ width: '100%', padding: '1.125em', marginBottom: '1.125em', background: '#f3e8ff', border: '1px solid #e9d5ff', borderRadius: '0.875em', color: '#1f2937', fontSize: '1.125em' }}
        />
        <input
          type="password"
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '1.125em', marginBottom: '1.5em', background: '#f3e8ff', border: '1px solid #e9d5ff', borderRadius: '0.875em', color: '#1f2937', fontSize: '1.125em' }}
        />
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.125em', fontSize: '1.125em', borderRadius: '0.875em' }} disabled={loading}>
          {loading ? t('loading') : t('login')}
        </button>
        <p style={{ marginTop: '1.5em', textAlign: 'center', color: '#6b7280', fontSize: '1em' }}>
          {t('demo')}
        </p>
        <p style={{ marginTop: '1.125em', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#7c3aed', fontSize: '1em' }}>{t('backToMain')}</Link>
        </p>
      </form>
    </div>
  )
}

function Register() {
  const [step, setStep] = useState(1) // 1: info, 2: photo+age, 3: phone, 4: code
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', birthDate: '' })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [devCode, setDevCode] = useState('')
  const navigate = useNavigate()
  const { t } = useLang()

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Фото должно быть меньше 5MB')
        return
      }
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleNext = () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.password) {
        setError('Заполните все поля')
        return
      }
      setError('')
      setStep(2)
    } else if (step === 2) {
      if (!photo) {
        setError('Загрузите фото')
        return
      }
      if (!form.birthDate) {
        setError('Укажите дату рождения')
        return
      }
      // Check age >= 18
      const birth = new Date(form.birthDate)
      const age = Math.floor((Date.now() - birth) / (365.25 * 24 * 60 * 60 * 1000))
      if (age < 18) {
        setError('Вам должно быть 18 лет или больше')
        return
      }
      setError('')
      setStep(3)
    }
  }

  const handleSendCode = async () => {
    if (!form.phone) {
      setError('Введите номер телефона')
      return
    }
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, photo: photoPreview })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      if (data.devCode) setDevCode(data.devCode)
      setStep(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Введите 6-значный код')
      return
    }
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      localStorage.setItem('token', data.token)
      window.location.href = '/people'
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Shared card style - same as Landing
  const cardStyle = {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(255,255,255,0.95)',
    padding: '3em 3.75em',
    borderRadius: '1.875em',
    width: '100%',
    maxWidth: 'var(--app-max-width)',
    boxShadow: '0 20px 60px rgba(139, 92, 246, 0.2)',
    textAlign: 'center'
  }

  const inputStyle = {
    width: '100%',
    padding: '1.125em',
    marginBottom: '1.125em',
    background: '#f3e8ff',
    border: '1px solid #e9d5ff',
    borderRadius: '0.875em',
    color: '#1f2937',
    fontSize: '1.125em'
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-base)',
      backgroundImage: 'url(https://images.unsplash.com/photo-1604881991405-b273c7a4386a?w=1920&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      {/* Overlay - same as Landing */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(250,245,255,0.75) 0%, rgba(243,232,255,0.70) 50%, rgba(233,213,255,0.65) 100%)'
      }} />

      <div style={cardStyle}>
        {/* Language selector - same position as Landing */}
        <div style={{ position: 'absolute', top: '1em', right: '1em' }}>
          <LanguageSelector />
        </div>

        <h2 style={{ marginBottom: '1.5em', fontSize: '2em', color: '#1f2937' }}>💜 {t('register')}</h2>

        {error && <p style={{ color: '#ef4444', marginBottom: '1.25em', fontSize: '1em' }}>{error}</p>}

        {/* Step 1: Basic info */}
        {step === 1 && (
          <>
            <input
              type="text"
              placeholder={t('name')}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder={t('email')}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder={t('password')}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
            />
            <button onClick={handleNext} className="btn btn-primary" style={{ width: '100%', padding: '1.125em', fontSize: '1.125em', borderRadius: '0.875em' }}>
              {t('continue')}
            </button>
          </>
        )}

        {/* Step 2: Photo and Age */}
        {step === 2 && (
          <>
            <p style={{ color: '#6b7280', marginBottom: '1.5em' }}>{t('uploadPhoto')}</p>

            {/* Photo upload */}
            <div style={{ marginBottom: '1.5em' }}>
              <label style={{
                width: '10em',
                height: '10em',
                margin: '0 auto',
                borderRadius: '50%',
                background: photoPreview ? `url(${photoPreview}) center/cover` : '#f3e8ff',
                border: '3px dashed #c084fc',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {!photoPreview && <span style={{ fontSize: '3em' }}>📷</span>}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </label>
              <p style={{ color: '#9ca3af', fontSize: '0.875em', marginTop: '0.5em' }}>{t('clickToUpload')}</p>
            </div>

            {/* Birth date */}
            <label style={{ display: 'block', color: '#6b7280', fontSize: '0.875em', marginBottom: '0.5em', textAlign: 'left' }}>
              {t('birthDate')}
            </label>
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              style={inputStyle}
            />
            <button onClick={handleNext} className="btn btn-primary" style={{ width: '100%', padding: '1.125em', fontSize: '1.125em', borderRadius: '0.875em' }}>
              {t('continue')}
            </button>
          </>
        )}

        {/* Step 3: Phone */}
        {step === 3 && (
          <>
            <p style={{ color: '#6b7280', marginBottom: '1.5em' }}>{t('verifyToGetBadge')}</p>
            <input
              type="text"
              inputMode="tel"
              placeholder={t('enterPhone')}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
            />
            <button onClick={handleSendCode} disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1.125em', fontSize: '1.125em', borderRadius: '0.875em' }}>
              {loading ? t('loading') : t('sendCode')}
            </button>
          </>
        )}

        {/* Step 4: Code verification */}
        {step === 4 && (
          <>
            <p style={{ color: '#6b7280', marginBottom: '1.5em' }}>{t('enterCode')}</p>
            {devCode && <p style={{ color: '#9ca3af', marginBottom: '1em', fontSize: '0.875em' }}>DEV код: {devCode}</p>}
            <input
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              style={{ ...inputStyle, letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.5em' }}
            />
            <button onClick={handleVerify} disabled={loading || code.length !== 6} className="btn btn-primary" style={{ width: '100%', padding: '1.125em', fontSize: '1.125em', borderRadius: '0.875em' }}>
              {loading ? t('loading') : t('verifyCode')}
            </button>
          </>
        )}

        <p style={{ marginTop: '1.5em' }}>
          <Link to="/login" style={{ color: '#7c3aed', fontSize: '1em' }}>{t('login')}</Link>
          {' | '}
          <Link to="/" style={{ color: '#7c3aed', fontSize: '1em' }}>{t('backToMain')}</Link>
        </p>
      </div>
    </div>
  )
}

function Discover() {
  const { user } = useAuth()
  const { t } = useLang()
  const [cards, setCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [match, setMatch] = useState(null)
  const [swipeLimit, setSwipeLimit] = useState({ remaining: -1, limit: -1, isPremium: false })
  const [limitReached, setLimitReached] = useState(false)

  useEffect(() => {
    Promise.all([
      api.getCards(),
      api.getSwipeLimit()
    ])
      .then(([cardsData, limitData]) => {
        setCards(cardsData)
        setSwipeLimit(limitData)
        if (!limitData.isPremium && limitData.remaining === 0) {
          setLimitReached(true)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSwipe = async (isLike, isSuperLike = false) => {
    if (cards.length === 0 || limitReached) return
    const card = cards[currentIndex]
    setCurrentIndex(prev => (prev + 1) % cards.length)
    try {
      const result = await api.swipe(card.id, isLike, isSuperLike)
      if (result.match) {
        setMatch(card)
      }
      // Update remaining swipes
      if (!swipeLimit.isPremium) {
        setSwipeLimit(prev => ({
          ...prev,
          remaining: prev.remaining - 1
        }))
        if (swipeLimit.remaining <= 1) {
          setLimitReached(true)
        }
      }
    } catch (err) {
      if (err.message === 'LIMIT_REACHED') {
        setLimitReached(true)
      }
      console.error(err)
    }
  }

  const handleSuperLike = () => handleSwipe(true, true)

  const currentCard = cards[currentIndex]

  return (
    <div style={{ minHeight: '100vh', padding: 'var(--spacing-base)', paddingBottom: '6em', maxWidth: 'var(--app-max-width)', margin: '0 auto', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25em' }}>
        <h1 style={{ fontSize: '1.5em', color: '#1f2937' }}>💜 LoveMatch</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
          {!swipeLimit.isPremium && swipeLimit.remaining >= 0 && (
            <span style={{
              background: swipeLimit.remaining > 5 ? '#dcfce7' : '#fef2f2',
              color: swipeLimit.remaining > 5 ? '#16a34a' : '#dc2626',
              padding: '0.3em 0.75em',
              borderRadius: '1em',
              fontSize: '0.8em',
              fontWeight: '500'
            }}>
              {swipeLimit.remaining}/{swipeLimit.limit}
            </span>
          )}
          <span style={{ color: '#7c3aed', fontSize: '0.875em' }}>👤 {user?.name}</span>
        </div>
      </div>

      {/* Match popup */}
      {match && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ textAlign: 'center', padding: '2.5em', background: 'white', borderRadius: '1.875em', boxShadow: '0 20px 60px rgba(139, 92, 246, 0.2)' }}>
            <div style={{ fontSize: '3em', marginBottom: '0.5em' }}>🎉</div>
            <h2 style={{ fontSize: '2em', marginBottom: '0.5em', background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('itsMatch')}</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5em' }}>{t('youLikedEachOther')} {match.name}</p>
            <button onClick={() => setMatch(null)} className="btn btn-primary">{t('continue')}</button>
          </div>
        </div>
      )}

      {/* Card */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3em', color: '#6b7280' }}>{t('loading')}</div>
      ) : currentCard ? (
        <div style={{ background: 'white', borderRadius: '1.25em', overflow: 'hidden', boxShadow: '0 10px 40px rgba(139, 92, 246, 0.15)' }}>
          <div style={{ height: '25em', background: 'linear-gradient(135deg, #c4b5fd 0%, #f0abfc 100%)', position: 'relative' }}>
            {currentCard.photos && currentCard.photos[0] ? (
              <img src={currentCard.photos[0].url} alt={currentCard.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '7.5em' }}>👤</span>
              </div>
            )}
            {currentCard.isVerified && (
              <span style={{
                position: 'absolute',
                top: '1em',
                right: '1em',
                width: '1.75em',
                height: '1.75em',
                borderRadius: '50%',
                background: '#1d9bf0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(29, 155, 240, 0.4)'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                </svg>
              </span>
            )}
          </div>
          <div style={{ padding: '1.25em' }}>
            <h2 style={{ marginBottom: '0.3em', color: '#1f2937', fontSize: '1.4em' }}>
              {currentCard.name}, {currentCard.birthDate ? new Date().getFullYear() - new Date(currentCard.birthDate).getFullYear() : '?'}
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '0.6em' }}>{currentCard.city || 'Москва'}</p>
            <p style={{ color: '#4b5563', fontSize: '0.875em' }}>{currentCard.bio || 'Привет! Давай познакомимся!'}</p>
            {currentCard.compatibility && (
              <div style={{ marginTop: '0.6em', display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                <div style={{ flex: 1, height: '0.25em', background: '#e9d5ff', borderRadius: '0.125em' }}>
                  <div style={{ width: `${currentCard.compatibility}%`, height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)', borderRadius: '0.125em' }} />
                </div>
                <span style={{ color: '#7c3aed', fontSize: '0.875em', fontWeight: '600' }}>{currentCard.compatibility}%</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5em', padding: '1.25em', alignItems: 'center' }}>
            <button onClick={() => handleSwipe(false)} className="btn btn-nope" style={{ width: '4em', height: '4em', borderRadius: '50%', fontSize: '1.5em' }}>✕</button>
            <button onClick={handleSuperLike} style={{
              width: '3.5em',
              height: '3.5em',
              borderRadius: '50%',
              fontSize: '1.4em',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
              transition: 'transform 0.2s'
            }} title="Super Like">⭐</button>
            <button onClick={() => handleSwipe(true)} className="btn btn-like" style={{ width: '4em', height: '4em', borderRadius: '50%', fontSize: '1.5em' }}>♥</button>
          </div>
        </div>
      ) : limitReached ? (
        <div style={{ textAlign: 'center', padding: '3em', background: 'white', borderRadius: '1.25em' }}>
          <div style={{ fontSize: '3em', marginBottom: '0.5em' }}>⏰</div>
          <h2 style={{ marginBottom: '0.5em', color: '#1f2937' }}>Лимит исчерпан</h2>
          <p style={{ color: '#6b7280', marginBottom: '1em' }}>Вы использовали все свайпы на сегодня</p>
          <p style={{ color: '#7c3aed', fontSize: '0.875em' }}>
            Premium — безлимитные свайпы ✨
          </p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3em', background: 'white', borderRadius: '1.25em' }}>
          <h2 style={{ marginBottom: '1em', color: '#1f2937' }}>{t('cardsEnded')}</h2>
          <p style={{ color: '#6b7280' }}>{t('checkLater')}</p>
        </div>
      )}
      <BottomNav />
    </div>
  )
}

function Profile() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const { t } = useLang()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    age: '',
    city: '',
    bio: ''
  })
  // Phone verification
  const [phone, setPhone] = useState('')
  const [phoneCode, setPhoneCode] = useState('')
  const [phoneStep, setPhoneStep] = useState('input') // input, code, verified
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [isVerified, setIsVerified] = useState(false)

  // Check verification status on load
  useEffect(() => {
    api.getPhoneStatus()
      .then(data => {
        setIsVerified(data.isVerified)
        if (data.phoneVerified) {
          setPhoneStep('verified')
        }
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        age: user.age || '',
        city: user.city || '',
        bio: user.bio || ''
      })
    }
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await api.updateProfile(form)
      updateUser(updated)
      setEditing(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleSendCode = async () => {
    setPhoneError('')
    setPhoneLoading(true)
    try {
      const result = await api.sendPhoneCode(phone)
      setPhoneStep('code')
      // In development, show the code
      if (result.devCode) {
        console.log('DEV: Verification code:', result.devCode)
      }
    } catch (err) {
      setPhoneError(err.message)
    } finally {
      setPhoneLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setPhoneError('')
    setPhoneLoading(true)
    try {
      await api.verifyPhoneCode(phoneCode)
      setPhoneStep('verified')
      setIsVerified(true)
      updateUser({ isVerified: true })
    } catch (err) {
      setPhoneError(err.message)
    } finally {
      setPhoneLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.875em',
    marginBottom: '1em',
    background: editing ? '#f3e8ff' : '#faf5ff',
    border: '1px solid #e9d5ff',
    borderRadius: '0.75em',
    color: '#1f2937',
    fontSize: '1em'
  }

  return (
    <div style={{ minHeight: '100vh', padding: 'var(--spacing-base)', paddingBottom: '6em', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' }}>
      <div style={{ maxWidth: 'var(--app-max-width)', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25em' }}>
          <h1 style={{ fontSize: '1.5em', color: '#1f2937' }}>👤 {t('profile')}</h1>
          <div style={{ display: 'flex', gap: '0.5em', alignItems: 'center' }}>
            <LanguageSelector />
            <button onClick={logout} style={{ padding: '0.5em 1em', background: 'white', border: '1px solid #e9d5ff', borderRadius: '0.5em', color: '#7c3aed', cursor: 'pointer' }}>
              {t('logout')}
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div style={{ background: 'white', borderRadius: '1.25em', padding: '1.875em', boxShadow: '0 10px 40px rgba(139, 92, 246, 0.15)' }}>
          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: '1.5em' }}>
            <div style={{ width: '7.5em', height: '7.5em', borderRadius: '50%', background: 'linear-gradient(135deg, #c4b5fd 0%, #f0abfc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '3.75em' }}>
              👤
            </div>
            <p style={{ marginTop: '0.625em', color: '#6b7280', fontSize: '0.875em' }}>{user?.email}</p>
          </div>

          {/* Form */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.3em', color: '#6b7280', fontSize: '0.875em' }}>{t('name')}</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={!editing}
              style={inputStyle}
            />

            <label style={{ display: 'block', marginBottom: '0.3em', color: '#6b7280', fontSize: '0.875em' }}>{t('age')}</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              disabled={!editing}
              style={inputStyle}
            />

            <label style={{ display: 'block', marginBottom: '0.3em', color: '#6b7280', fontSize: '0.875em' }}>{t('city')}</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              disabled={!editing}
              style={inputStyle}
            />

            <label style={{ display: 'block', marginBottom: '0.3em', color: '#6b7280', fontSize: '0.875em' }}>{t('aboutMe')}</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              disabled={!editing}
              rows={3}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          {/* Buttons */}
          <div style={{ marginTop: '1.25em' }}>
            {editing ? (
              <div style={{ display: 'flex', gap: '0.625em' }}>
                <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '0.875em', background: 'white', border: '1px solid #e9d5ff', borderRadius: '0.75em', color: '#6b7280', cursor: 'pointer', fontSize: '1em' }}>
                  {t('cancel')}
                </button>
                <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ flex: 1, borderRadius: '0.75em' }}>
                  {saving ? t('saving') : t('save')}
                </button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className="btn btn-primary" style={{ width: '100%', borderRadius: '0.75em' }}>
                {t('edit')}
              </button>
            )}
          </div>
        </div>

        {/* Phone Verification Card */}
        <div style={{ background: 'white', borderRadius: '1.25em', padding: '1.875em', marginTop: '1.25em', boxShadow: '0 10px 40px rgba(139, 92, 246, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75em', marginBottom: '1em' }}>
            <h2 style={{ color: '#1f2937', fontSize: '1.25em' }}>{t('phoneVerification')}</h2>
            {isVerified && (
              <span style={{
                width: '1.5em',
                height: '1.5em',
                borderRadius: '50%',
                background: '#1d9bf0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                </svg>
              </span>
            )}
          </div>

          {phoneStep === 'verified' ? (
            <div style={{ textAlign: 'center', padding: '1em' }}>
              <div style={{ fontSize: '3em', marginBottom: '0.5em' }}>✅</div>
              <p style={{ color: '#22c55e', fontWeight: '600' }}>{t('phoneVerified')}</p>
            </div>
          ) : (
            <>
              <p style={{ color: '#6b7280', fontSize: '0.875em', marginBottom: '1em' }}>
                {t('verifyToGetBadge')}
              </p>

              {phoneError && (
                <p style={{ color: '#ef4444', marginBottom: '1em', fontSize: '0.875em' }}>{phoneError}</p>
              )}

              {phoneStep === 'input' ? (
                <div style={{ display: 'flex', gap: '0.5em' }}>
                  <input
                    type="text"
                    inputMode="tel"
                    placeholder={t('enterPhone')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.875em',
                      borderRadius: '0.75em',
                      border: '1px solid #e9d5ff',
                      background: '#faf5ff',
                      fontSize: '1em'
                    }}
                  />
                  <button
                    onClick={handleSendCode}
                    disabled={!phone || phoneLoading}
                    className="btn btn-primary"
                    style={{ borderRadius: '0.75em', whiteSpace: 'nowrap' }}
                  >
                    {phoneLoading ? '...' : t('sendCode')}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5em' }}>
                  <input
                    type="text"
                    placeholder={t('enterCode')}
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    maxLength={6}
                    style={{
                      flex: 1,
                      padding: '0.875em',
                      borderRadius: '0.75em',
                      border: '1px solid #e9d5ff',
                      background: '#faf5ff',
                      fontSize: '1em',
                      letterSpacing: '0.25em',
                      textAlign: 'center'
                    }}
                  />
                  <button
                    onClick={handleVerifyCode}
                    disabled={phoneCode.length !== 6 || phoneLoading}
                    className="btn btn-primary"
                    style={{ borderRadius: '0.75em', whiteSpace: 'nowrap' }}
                  >
                    {phoneLoading ? '...' : t('verifyCode')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

// Bottom Navigation
function BottomNav() {
  const location = window.location.pathname
  const { t } = useLang()
  const navStyle = {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 'var(--app-max-width)',
    background: 'white',
    borderTop: '1px solid #e9d5ff',
    borderRadius: '1.5em 1.5em 0 0',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0.75em 0',
    zIndex: 50,
    boxShadow: '0 -4px 20px rgba(139, 92, 246, 0.1)'
  }
  const linkStyle = (active) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    color: active ? '#7c3aed' : '#9ca3af',
    fontSize: '0.75em',
    gap: '0.25em',
    transition: 'color 0.2s'
  })
  return (
    <div style={navStyle}>
      <Link to="/discover" style={linkStyle(location === '/discover')}>
        <span style={{ fontSize: '1.5em' }}>🔍</span>
        <span>{t('search')}</span>
      </Link>
      <Link to="/people" style={linkStyle(location === '/people')}>
        <span style={{ fontSize: '1.5em' }}>💜</span>
        <span>{t('people')}</span>
      </Link>
      <Link to="/chats" style={linkStyle(location === '/chats' || location.startsWith('/chat/'))}>
        <span style={{ fontSize: '1.5em' }}>💬</span>
        <span>{t('chats')}</span>
      </Link>
      <Link to="/profile" style={linkStyle(location === '/profile')}>
        <span style={{ fontSize: '1.5em' }}>👤</span>
        <span>{t('profile')}</span>
      </Link>
    </div>
  )
}

// Format "last seen" time
function formatLastSeen(lastOnline, t) {
  if (!lastOnline) return ''
  const now = new Date()
  const last = new Date(lastOnline)
  const diffMs = now - last
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return t('online')
  if (diffMins < 60) return `${diffMins} ${t('minAgo')}`
  if (diffHours < 24) return `${diffHours} ${t('hoursAgo')}`
  return `${diffDays} ${t('daysAgo')}`
}

// Gift stickers - random cute emojis
const GIFT_STICKERS = [
  '🌹', '💐', '🎁', '🧸', '💝', '🍫', '🎀', '🌷',
  '💎', '🦋', '🌸', '🍰', '🧁', '☕', '🍓', '🌺',
  '🎈', '🎊', '✨', '🌟', '💫', '🦄', '🐻', '🐰'
]

// People Page - Browse Users with Filters
function People() {
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()
  const { t } = useLang()
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('compatibility')
  const [ageRange, setAgeRange] = useState([18, 35])
  const [showOnline, setShowOnline] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [giftSending, setGiftSending] = useState(false)

  useEffect(() => {
    api.browseUsers()
      .then(data => {
        setUsers(data)
        setFiltered(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStartChat = async (userId) => {
    try {
      const { matchId } = await api.startConversation(userId)
      navigate(`/chat/${matchId}`)
    } catch (err) {
      console.error(err)
    }
  }

  // Apply filters and sorting
  useEffect(() => {
    let result = [...users]

    // Filter by age
    result = result.filter(user => {
      const age = user.birthDate ? new Date().getFullYear() - new Date(user.birthDate).getFullYear() : 25
      return age >= ageRange[0] && age <= ageRange[1]
    })

    // Filter online only
    if (showOnline) {
      result = result.filter(user => user.isOnline)
    }

    // Sort
    if (sortBy === 'age_asc') {
      result.sort((a, b) => {
        const ageA = a.birthDate ? new Date(a.birthDate).getTime() : 0
        const ageB = b.birthDate ? new Date(b.birthDate).getTime() : 0
        return ageB - ageA
      })
    } else if (sortBy === 'age_desc') {
      result.sort((a, b) => {
        const ageA = a.birthDate ? new Date(a.birthDate).getTime() : 0
        const ageB = b.birthDate ? new Date(b.birthDate).getTime() : 0
        return ageA - ageB
      })
    } else if (sortBy === 'compatibility') {
      result.sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0))
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    }

    setFiltered(result)
  }, [users, sortBy, ageRange, showOnline])

  const getAge = (birthDate) => {
    if (!birthDate) return '?'
    return new Date().getFullYear() - new Date(birthDate).getFullYear()
  }

  const handleSendGift = async (userId) => {
    if (giftSending) return
    setGiftSending(true)
    try {
      // Start conversation and send random sticker
      const { matchId } = await api.startConversation(userId)
      const randomSticker = GIFT_STICKERS[Math.floor(Math.random() * GIFT_STICKERS.length)]
      await api.sendMessage(matchId, randomSticker)
      setSelectedUser(null)
      navigate(`/chat/${matchId}`)
    } catch (err) {
      console.error(err)
    } finally {
      setGiftSending(false)
    }
  }

  const filterBarStyle = {
    background: 'white',
    borderRadius: '1em',
    padding: '1em',
    marginBottom: '1.25em',
    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.1)'
  }

  const selectStyle = {
    padding: '0.625em 0.875em',
    borderRadius: '0.625em',
    border: '1px solid #e9d5ff',
    background: '#faf5ff',
    color: '#1f2937',
    fontSize: '0.875em',
    cursor: 'pointer',
    outline: 'none'
  }

  const chipStyle = (active) => ({
    padding: '0.5em 1em',
    borderRadius: '1.25em',
    border: 'none',
    background: active ? 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)' : '#f3e8ff',
    color: active ? 'white' : '#7c3aed',
    fontSize: '0.8125em',
    cursor: 'pointer',
    transition: 'all 0.2s'
  })

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '6em', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' }}>
      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            top: '1em',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            padding: '0.75em 1.5em',
            background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '2em',
            fontSize: '0.875em',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {t('backToTop')}
        </button>
      )}

      <div style={{ maxWidth: 'var(--app-max-width)', margin: '0 auto', padding: 'var(--spacing-base)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25em' }}>
          <h1 style={{ fontSize: '1.5em', color: '#1f2937' }}>💜 {t('searchPeople')}</h1>
          <LanguageSelector />
        </div>

        {/* Filter Bar */}
        <div style={filterBarStyle}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625em', alignItems: 'center', marginBottom: '1em' }}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
              <option value="compatibility">{t('byCompatibility')}</option>
              <option value="age_asc">{t('youngerFirst')}</option>
              <option value="age_desc">{t('olderFirst')}</option>
              <option value="newest">{t('newProfiles')}</option>
            </select>

            <button onClick={() => setShowOnline(!showOnline)} style={chipStyle(showOnline)}>
              🟢 {t('onlineNow')}
            </button>
          </div>

          {/* Age Range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625em' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875em' }}>{t('age')}:</span>
            <input
              type="range"
              min="18"
              max="50"
              value={ageRange[0]}
              onChange={(e) => setAgeRange([parseInt(e.target.value), ageRange[1]])}
              style={{ flex: 1, accentColor: '#a855f7' }}
            />
            <span style={{ color: '#7c3aed', fontWeight: '600', minWidth: '4.5em', textAlign: 'center' }}>{ageRange[0]} - {ageRange[1]}</span>
            <input
              type="range"
              min="18"
              max="50"
              value={ageRange[1]}
              onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])}
              style={{ flex: 1, accentColor: '#a855f7' }}
            />
          </div>
        </div>

        {/* Results count */}
        <p style={{ color: '#6b7280', marginBottom: '1em', fontSize: '0.875em' }}>
          {t('found')}: {filtered.length} {t('persons')}
        </p>

        {/* Users Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3em', color: '#6b7280' }}>{t('loading')}</div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1em' }}>
            {filtered.map(user => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                style={{
                  background: 'white',
                  borderRadius: '1em',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.1)'
                }}
              >
                <div style={{ height: '12.5em', background: 'linear-gradient(135deg, #c4b5fd 0%, #f0abfc 100%)', position: 'relative' }}>
                  {user.photos && user.photos[0] ? (
                    <img src={user.photos[0].url} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.75em' }}>👤</div>
                  )}
                  {user.isOnline && (
                    <span style={{ position: 'absolute', top: '0.625em', left: '0.625em', width: '0.75em', height: '0.75em', background: '#22c55e', borderRadius: '50%', border: '2px solid white' }} />
                  )}
                  {user.isVerified && (
                    <span style={{
                      position: 'absolute',
                      top: '0.625em',
                      right: '0.625em',
                      width: '1.5em',
                      height: '1.5em',
                      borderRadius: '50%',
                      background: '#1d9bf0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(29, 155, 240, 0.4)'
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                      </svg>
                    </span>
                  )}
                  {user.compatibility && (
                    <span style={{ position: 'absolute', bottom: '0.625em', right: '0.625em', background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)', color: 'white', padding: '0.25em 0.625em', borderRadius: '0.75em', fontSize: '0.75em', fontWeight: '600' }}>
                      {user.compatibility}%
                    </span>
                  )}
                </div>
                <div style={{ padding: '0.75em' }}>
                  <h3 style={{ color: '#1f2937', fontSize: '1em', marginBottom: '0.25em' }}>
                    {user.name}, {getAge(user.birthDate)}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.8125em', marginBottom: '0.25em' }}>
                    📍 {user.city || 'Москва'}
                  </p>
                  <p style={{
                    color: user.isOnline ? '#22c55e' : '#9ca3af',
                    fontSize: '0.75em',
                    marginBottom: '0.25em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25em'
                  }}>
                    {user.isOnline ? (
                      <>🟢 {t('online')}</>
                    ) : (
                      formatLastSeen(user.lastOnline, t)
                    )}
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '0.75em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.bio || 'Привет! Давай познакомимся'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3em', background: 'white', borderRadius: '1.25em' }}>
            <div style={{ fontSize: '3em', marginBottom: '1em' }}>🔍</div>
            <h2 style={{ color: '#1f2937', marginBottom: '0.625em' }}>{t('noOneFound')}</h2>
            <p style={{ color: '#6b7280' }}>{t('changeFilters')}</p>
          </div>
        )}
      </div>

      {/* User Modal */}
      {selectedUser && (
        <div
          onClick={() => setSelectedUser(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1.25em'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '1.5em',
              maxWidth: 'var(--app-max-width)',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <div style={{ height: '22em', position: 'relative' }}>
              {selectedUser.photos && selectedUser.photos[0] ? (
                <img src={selectedUser.photos[0].url} alt={selectedUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1.5em 1.5em 0 0' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #c4b5fd 0%, #f0abfc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6.25em', borderRadius: '1.5em 1.5em 0 0' }}>👤</div>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                style={{ position: 'absolute', top: '1em', right: '1em', width: '2.25em', height: '2.25em', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', fontSize: '1.125em', cursor: 'pointer' }}
              >✕</button>
            </div>
            <div style={{ padding: '1.25em' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1em', flexWrap: 'wrap', gap: '0.5em' }}>
                <div>
                  <h2 style={{ color: '#1f2937', fontSize: '1.5em', marginBottom: '0.3em', display: 'flex', alignItems: 'center', gap: '0.4em', flexWrap: 'wrap' }}>
                    <span>{selectedUser.name}, {getAge(selectedUser.birthDate)}</span>
                    {selectedUser.isVerified && (
                      <span style={{
                        width: '1.25em',
                        height: '1.25em',
                        borderRadius: '50%',
                        background: '#1d9bf0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                        </svg>
                      </span>
                    )}
                  </h2>
                  <p style={{ color: '#6b7280' }}>📍 {selectedUser.city || 'Москва'}</p>
                </div>
                {selectedUser.compatibility && (
                  <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)', color: 'white', padding: '0.5em 1em', borderRadius: '1.25em', fontWeight: '600', fontSize: '0.875em' }}>
                    {selectedUser.compatibility}% {t('match')}
                  </div>
                )}
              </div>

              <p style={{ color: '#4b5563', marginBottom: '1.25em', lineHeight: '1.6' }}>
                {selectedUser.bio || t('defaultBio')}
              </p>

              {selectedUser.interests && selectedUser.interests.length > 0 && (
                <div style={{ marginBottom: '1.25em' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.875em', marginBottom: '0.5em' }}>{t('interests')}:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5em' }}>
                    {selectedUser.interests.map((interest, i) => (
                      <span key={i} style={{ background: '#f3e8ff', color: '#7c3aed', padding: '0.375em 0.75em', borderRadius: '1em', fontSize: '0.8125em' }}>
                        {interest.name || interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.id === currentUser?.id ? (
                <button
                  onClick={() => setSelectedUser(null)}
                  className="btn btn-primary"
                  style={{ width: '100%', borderRadius: '0.75em' }}
                >
                  {t('itsYou')}
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '0.5em' }}>
                  <button
                    onClick={() => { setSelectedUser(null) }}
                    style={{ padding: '0.875em', borderRadius: '0.75em', border: '1px solid #e9d5ff', background: 'white', color: '#6b7280', fontSize: '1em', cursor: 'pointer' }}
                    title={t('skip')}
                  >
                    ✕
                  </button>
                  <button
                    onClick={() => handleSendGift(selectedUser.id)}
                    disabled={giftSending}
                    style={{
                      padding: '0.875em 1.25em',
                      borderRadius: '0.75em',
                      border: 'none',
                      background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
                      color: 'white',
                      fontSize: '1.25em',
                      cursor: giftSending ? 'not-allowed' : 'pointer',
                      opacity: giftSending ? 0.7 : 1
                    }}
                    title={t('sendGift')}
                  >
                    🎁
                  </button>
                  <button
                    onClick={() => handleStartChat(selectedUser.id)}
                    className="btn btn-primary"
                    style={{ flex: 1, borderRadius: '0.75em' }}
                  >
                    💬 {t('write')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

// Chats List Page
function Chats() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { t, lang } = useLang()

  useEffect(() => {
    api.getConversations()
      .then(data => setConversations(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const locale = lang === 'es' ? 'es' : lang === 'en' ? 'en' : 'ru'
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '6em', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' }}>
      <div style={{ maxWidth: 'var(--app-max-width)', margin: '0 auto', padding: 'var(--spacing-base)' }}>
        <h1 style={{ fontSize: '1.5em', color: '#1f2937', marginBottom: '1.25em' }}>💬 {t('messages')}</h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3em', color: '#6b7280' }}>{t('loading')}</div>
        ) : conversations.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75em' }}>
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => navigate(`/chat/${conv.id}`)}
                style={{
                  background: 'white',
                  borderRadius: '1em',
                  padding: '1em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1em',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(139, 92, 246, 0.08)',
                  transition: 'transform 0.2s'
                }}
              >
                <div style={{ width: '3.5em', height: '3.5em', borderRadius: '50%', background: 'linear-gradient(135deg, #c4b5fd 0%, #f0abfc 100%)', overflow: 'hidden', flexShrink: 0 }}>
                  {conv.user.photos && conv.user.photos[0] ? (
                    <img src={conv.user.photos[0].url} alt={conv.user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5em' }}>👤</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25em' }}>
                    <h3 style={{ color: '#1f2937', fontSize: '1em', fontWeight: conv.unreadCount > 0 ? '600' : '500' }}>{conv.user.name}</h3>
                    <span style={{ color: '#9ca3af', fontSize: '0.75em' }}>{formatTime(conv.lastMessage?.createdAt)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: conv.unreadCount > 0 ? '#1f2937' : '#6b7280', fontSize: '0.875em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: conv.unreadCount > 0 ? '500' : '400' }}>
                      {conv.lastMessage?.content || t('startConversation')}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)', color: 'white', padding: '0.2em 0.5em', borderRadius: '1em', fontSize: '0.75em', minWidth: '1.5em', textAlign: 'center' }}>
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3em', background: 'white', borderRadius: '1.25em' }}>
            <div style={{ fontSize: '3em', marginBottom: '1em' }}>💬</div>
            <h2 style={{ color: '#1f2937', marginBottom: '0.625em' }}>{t('noMessages')}</h2>
            <p style={{ color: '#6b7280' }}>{t('startChatting')}</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

// Single Chat Page
function Chat() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const [match, setMatch] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = React.useRef(null)
  const typingTimeoutRef = React.useRef(null)
  const socketRef = React.useRef(null)

  // AI Suggestion states
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState(null)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  // Emoji reactions
  const [reactionOpenFor, setReactionOpenFor] = useState(null)
  const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '👍', '👎']

  // Get matchId from URL
  const matchId = window.location.pathname.split('/chat/')[1]

  // Socket.IO for real-time typing indicator
  useEffect(() => {
    if (!matchId) return

    const token = localStorage.getItem('token')
    const socket = window.io?.('http://localhost:3001', { auth: { token } })
    if (!socket) return

    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join_match', matchId)
    })

    socket.on('user_typing', (data) => {
      if (data.matchId === matchId && data.userId !== user?.id) {
        setIsTyping(true)
      }
    })

    socket.on('user_stop_typing', (data) => {
      if (data.matchId === matchId) {
        setIsTyping(false)
      }
    })

    socket.on('new_message', (data) => {
      if (data.matchId === matchId) {
        setMessages(prev => [...prev, data])
        setIsTyping(false)
      }
    })

    return () => {
      socket.emit('leave_match', matchId)
      socket.disconnect()
    }
  }, [matchId, user?.id])

  // Emit typing events
  const handleTyping = (value) => {
    setNewMessage(value)

    if (socketRef.current && matchId) {
      socketRef.current.emit('typing', { matchId })

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Stop typing after 2 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('stop_typing', { matchId })
      }, 2000)
    }
  }

  // Handle emoji reaction
  const handleReaction = async (messageId, emoji) => {
    try {
      const updated = await api.reactToMessage(messageId, emoji)
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reactions: updated.reactions } : m))
      setReactionOpenFor(null)
    } catch (err) {
      console.error('Reaction error:', err)
    }
  }

  useEffect(() => {
    if (matchId) {
      api.getMessages(matchId)
        .then(data => {
          setMatch(data.match)
          setMessages(data.messages)
          // Mark messages as read
          api.markAsRead(matchId).catch(console.error)
        })
        .catch(console.error)
        .finally(() => setLoading(false))

      // Get AI status
      api.getAiStatus(matchId)
        .then(setAiStatus)
        .catch(console.error)
    }
  }, [matchId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (!matchId) return
    const interval = setInterval(() => {
      api.getMessages(matchId)
        .then(data => setMessages(data.messages))
        .catch(console.error)
    }, 3000)
    return () => clearInterval(interval)
  }, [matchId])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const msg = await api.sendMessage(matchId, newMessage.trim())
      setMessages(prev => [...prev, msg])
      setNewMessage('')
      // Update AI status after sending
      api.getAiStatus(matchId).then(setAiStatus).catch(console.error)
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  const handleAiSuggest = async () => {
    setAiLoading(true)
    setShowAiModal(true)
    setAiSuggestion('')

    try {
      const data = await api.getAiSuggestion(matchId)
      setAiSuggestion(data.suggestion)
      setAiStatus({ allowed: true, isPremium: data.isPremium, messagesLeft: data.messagesLeft })
    } catch (err) {
      if (err.requiresPremium) {
        setShowAiModal(false)
        setShowPremiumModal(true)
      } else {
        console.error(err)
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleUseSuggestion = () => {
    setNewMessage(aiSuggestion)
    setShowAiModal(false)
  }

  const handleSubscribe = async () => {
    try {
      const { url } = await api.createCheckout()
      window.location.href = url
    } catch (err) {
      console.error(err)
    }
  }

  const locale = lang === 'es' ? 'es' : lang === 'en' ? 'en' : 'ru'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' }}>
        <p style={{ color: '#6b7280' }}>{t('loading')}</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '1em', display: 'flex', alignItems: 'center', gap: '1em', borderBottom: '1px solid #e9d5ff', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => navigate('/chats')} style={{ background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer', padding: '0.25em' }}>←</button>
        <div style={{ width: '2.5em', height: '2.5em', borderRadius: '50%', background: 'linear-gradient(135deg, #c4b5fd 0%, #f0abfc 100%)', overflow: 'hidden' }}>
          {match?.user?.photos && match.user.photos[0] ? (
            <img src={match.user.photos[0].url} alt={match?.user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25em' }}>👤</div>
          )}
        </div>
        <h2 style={{ color: '#1f2937', fontSize: '1.125em' }}>{match?.user?.name || t('chats')}</h2>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '1em', maxWidth: 'var(--app-max-width)', margin: '0 auto', width: '100%', overflowY: 'auto' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3em', color: '#6b7280' }}>
            <p>{t('writeFirst')}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75em' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.senderId === user?.id ? 'flex-end' : 'flex-start',
                  position: 'relative'
                }}
              >
                {/* Reaction picker */}
                {reactionOpenFor === msg.id && (
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    [msg.senderId === user?.id ? 'right' : 'left']: 0,
                    background: 'white',
                    borderRadius: '2em',
                    padding: '0.5em',
                    display: 'flex',
                    gap: '0.25em',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                    zIndex: 10,
                    marginBottom: '0.5em'
                  }}>
                    {REACTION_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(msg.id, emoji)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '1.25em',
                          cursor: 'pointer',
                          padding: '0.25em',
                          borderRadius: '50%',
                          transition: 'transform 0.15s'
                        }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.3)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  onDoubleClick={() => setReactionOpenFor(reactionOpenFor === msg.id ? null : msg.id)}
                  style={{
                    maxWidth: '75%',
                    padding: '0.75em 1em',
                    borderRadius: msg.senderId === user?.id ? '1em 1em 0.25em 1em' : '1em 1em 1em 0.25em',
                    background: msg.senderId === user?.id ? 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)' : 'white',
                    color: msg.senderId === user?.id ? 'white' : '#1f2937',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}>
                  <p style={{ fontSize: '0.9375em', lineHeight: '1.4' }}>{msg.content}</p>
                  <p style={{ fontSize: '0.6875em', marginTop: '0.375em', opacity: 0.7, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3em' }}>
                    {new Date(msg.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    {msg.senderId === user?.id && (
                      <span style={{ fontSize: '1.1em' }}>
                        {msg.isRead ? '✓✓' : '✓'}
                      </span>
                    )}
                  </p>
                </div>

                {/* Display reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '0.25em',
                    marginTop: '0.25em',
                    flexWrap: 'wrap'
                  }}>
                    {Object.entries(
                      msg.reactions.reduce((acc, r) => {
                        acc[r.emoji] = (acc[r.emoji] || 0) + 1
                        return acc
                      }, {})
                    ).map(([emoji, count]) => (
                      <span
                        key={emoji}
                        onClick={() => handleReaction(msg.id, emoji)}
                        style={{
                          background: 'white',
                          borderRadius: '1em',
                          padding: '0.2em 0.5em',
                          fontSize: '0.8em',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                          cursor: 'pointer',
                          border: msg.reactions.some(r => r.emoji === emoji && r.userId === user?.id)
                            ? '2px solid #a855f7'
                            : '2px solid transparent'
                        }}
                      >
                        {emoji} {count > 1 && count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.75em' }}>
                <div style={{
                  background: 'white',
                  padding: '0.75em 1em',
                  borderRadius: '1em',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)',
                  display: 'flex',
                  gap: '0.3em',
                  alignItems: 'center'
                }}>
                  <span style={{ animation: 'pulse 1s infinite', animationDelay: '0s' }}>•</span>
                  <span style={{ animation: 'pulse 1s infinite', animationDelay: '0.2s' }}>•</span>
                  <span style={{ animation: 'pulse 1s infinite', animationDelay: '0.4s' }}>•</span>
                  <span style={{ marginLeft: '0.5em', fontSize: '0.8em', color: '#6b7280' }}>{t('typing')}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* AI Suggestion Modal */}
      {showAiModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1em'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1.5em',
            padding: '1.5em',
            maxWidth: '90%',
            width: '400px',
            boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
              <h3 style={{ color: '#1f2937', fontSize: '1.125em', display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                <span style={{ fontSize: '1.25em' }}>✨</span> {t('aiSuggest')}
              </h3>
              <button
                onClick={() => setShowAiModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25em', cursor: 'pointer', color: '#6b7280' }}
              >✕</button>
            </div>

            {aiLoading ? (
              <div style={{ textAlign: 'center', padding: '2em' }}>
                <div style={{ fontSize: '2em', marginBottom: '0.5em', animation: 'pulse 1s infinite' }}>✨</div>
                <p style={{ color: '#6b7280' }}>{t('aiGenerating')}</p>
              </div>
            ) : (
              <>
                <div style={{
                  background: '#f3e8ff',
                  borderRadius: '1em',
                  padding: '1em',
                  marginBottom: '1em',
                  color: '#1f2937',
                  lineHeight: '1.5'
                }}>
                  {aiSuggestion}
                </div>

                {!aiStatus?.isPremium && aiStatus?.messagesLeft !== undefined && (
                  <p style={{ color: '#6b7280', fontSize: '0.875em', marginBottom: '1em', textAlign: 'center' }}>
                    {t('aiFreeSuggestionsLeft')}: {aiStatus.messagesLeft}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '0.75em' }}>
                  <button
                    onClick={handleAiSuggest}
                    style={{
                      flex: 1,
                      padding: '0.75em',
                      borderRadius: '0.75em',
                      border: '1px solid #e9d5ff',
                      background: 'white',
                      color: '#7c3aed',
                      cursor: 'pointer',
                      fontSize: '0.875em'
                    }}
                  >
                    🔄 {t('aiTryAnother')}
                  </button>
                  <button
                    onClick={handleUseSuggestion}
                    style={{
                      flex: 1,
                      padding: '0.75em',
                      borderRadius: '0.75em',
                      border: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.875em'
                    }}
                  >
                    ✓ {t('aiUseThis')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1em'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1.5em',
            padding: '2em',
            maxWidth: '90%',
            width: '400px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)'
          }}>
            <div style={{ fontSize: '3em', marginBottom: '0.5em' }}>👑</div>
            <h2 style={{
              background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.5em',
              marginBottom: '0.5em'
            }}>{t('premiumTitle')}</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5em' }}>{t('premiumDescription')}</p>
            <p style={{
              fontSize: '2em',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1.5em'
            }}>{t('premiumPrice')}</p>
            <button
              onClick={handleSubscribe}
              style={{
                width: '100%',
                padding: '1em',
                borderRadius: '0.75em',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)',
                color: 'white',
                fontSize: '1.125em',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '1em'
              }}
            >
              {t('premiumSubscribe')}
            </button>
            <button
              onClick={() => setShowPremiumModal(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer'
              }}
            >{t('aiClose')}</button>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} style={{ background: 'white', padding: '1em', borderTop: '1px solid #e9d5ff', position: 'sticky', bottom: 0 }}>
        <div style={{ display: 'flex', gap: '0.5em', maxWidth: 'var(--app-max-width)', margin: '0 auto', alignItems: 'center' }}>
          {/* AI Suggestion Button - Animated */}
          <button
            type="button"
            onClick={handleAiSuggest}
            style={{
              width: '3em',
              height: '3em',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f0abfc 0%, #c084fc 100%)',
              border: 'none',
              color: 'white',
              fontSize: '1.25em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite',
              boxShadow: '0 4px 15px rgba(192, 132, 252, 0.4)'
            }}
            title={t('aiSuggest')}
          >
            ✨
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder={t('writeMessage')}
            style={{
              flex: 1,
              padding: '0.875em 1em',
              borderRadius: '1.5em',
              border: '1px solid #e9d5ff',
              background: '#faf5ff',
              fontSize: '1em',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            style={{
              width: '3em',
              height: '3em',
              borderRadius: '50%',
              background: newMessage.trim() ? 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)' : '#e9d5ff',
              border: 'none',
              color: 'white',
              fontSize: '1.25em',
              cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  )
}

// Subscription Success Page
function SubscriptionSuccess() {
  const { t } = useLang()
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2em', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' }}>
      <div style={{ textAlign: 'center', background: 'white', padding: '3em', borderRadius: '1.5em', boxShadow: '0 20px 60px rgba(139, 92, 246, 0.2)', maxWidth: '400px' }}>
        <div style={{ fontSize: '4em', marginBottom: '0.5em' }}>🎉</div>
        <h1 style={{
          background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.75em',
          marginBottom: '0.5em'
        }}>{t('premiumActive')}</h1>
        <p style={{ color: '#6b7280', marginBottom: '2em' }}>{t('premiumDescription')}</p>
        <button
          onClick={() => navigate('/chats')}
          style={{
            padding: '1em 2em',
            borderRadius: '0.75em',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)',
            color: 'white',
            fontSize: '1em',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {t('continue')}
        </button>
      </div>
    </div>
  )
}

// Subscription Cancel Page
function SubscriptionCancel() {
  const { t } = useLang()
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2em', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' }}>
      <div style={{ textAlign: 'center', background: 'white', padding: '3em', borderRadius: '1.5em', boxShadow: '0 20px 60px rgba(139, 92, 246, 0.2)', maxWidth: '400px' }}>
        <div style={{ fontSize: '4em', marginBottom: '0.5em' }}>💜</div>
        <h1 style={{ color: '#1f2937', fontSize: '1.5em', marginBottom: '0.5em' }}>{t('premiumCanceled')}</h1>
        <p style={{ color: '#6b7280', marginBottom: '2em' }}>{t('startChatting')}</p>
        <button
          onClick={() => navigate('/chats')}
          style={{
            padding: '1em 2em',
            borderRadius: '0.75em',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)',
            color: 'white',
            fontSize: '1em',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {t('continue')}
        </button>
      </div>
    </div>
  )
}

// === Routes ===
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Загрузка...</div>
  if (!user) return <Navigate to="/login" />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Загрузка...</div>
  if (user) return <Navigate to="/people" />
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/discover" element={<PrivateRoute><Discover /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/people" element={<PrivateRoute><People /></PrivateRoute>} />
      <Route path="/chats" element={<PrivateRoute><Chats /></PrivateRoute>} />
      <Route path="/chat/:matchId" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/subscription/success" element={<PrivateRoute><SubscriptionSuccess /></PrivateRoute>} />
      <Route path="/subscription/cancel" element={<PrivateRoute><SubscriptionCancel /></PrivateRoute>} />
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LanguageProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LanguageProvider>
  </BrowserRouter>
)
