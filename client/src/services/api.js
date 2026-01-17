const API_URL = '/api'

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

const handleResponse = async (response) => {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Произошла ошибка')
  }
  return data
}

export const api = {
  // Auth
  async register(email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    })
    return handleResponse(response)
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    })
    return handleResponse(response)
  },

  async getMe() {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Profile
  async getProfile() {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async updateProfile(data) {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async uploadPhoto(base64Data, isVerification = false) {
    const response = await fetch(`${API_URL}/users/photos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ photo: base64Data, isVerification })
    })
    return handleResponse(response)
  },

  async deletePhoto(photoId) {
    const response = await fetch(`${API_URL}/users/photos/${photoId}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async verifyProfile(photo) {
    const response = await fetch(`${API_URL}/users/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ photo })
    })
    return handleResponse(response)
  },

  async updatePreferences(data) {
    const response = await fetch(`${API_URL}/users/preferences`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async updateLocation(latitude, longitude, city, country) {
    const response = await fetch(`${API_URL}/users/location`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ latitude, longitude, city, country })
    })
    return handleResponse(response)
  },

  async updateInterests(interestIds) {
    const response = await fetch(`${API_URL}/users/interests`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ interestIds })
    })
    return handleResponse(response)
  },

  async getAllInterests() {
    const response = await fetch(`${API_URL}/users/interests/all`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Views & Favorites
  async getProfileViews() {
    const response = await fetch(`${API_URL}/users/views`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async getFavorites() {
    const response = await fetch(`${API_URL}/users/favorites`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async addToFavorites(userId) {
    const response = await fetch(`${API_URL}/users/favorites/${userId}`, {
      method: 'POST',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async removeFromFavorites(userId) {
    const response = await fetch(`${API_URL}/users/favorites/${userId}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Block & Report
  async blockUser(userId) {
    const response = await fetch(`${API_URL}/users/block/${userId}`, {
      method: 'POST',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async unblockUser(userId) {
    const response = await fetch(`${API_URL}/users/block/${userId}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async reportUser(userId, reason, description) {
    const response = await fetch(`${API_URL}/users/report/${userId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason, description })
    })
    return handleResponse(response)
  },

  // Notifications
  async getNotifications() {
    const response = await fetch(`${API_URL}/users/notifications`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async markNotificationsRead() {
    const response = await fetch(`${API_URL}/users/notifications/read`, {
      method: 'POST',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Get user by ID
  async getUser(userId) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Discovery
  async getCards() {
    const response = await fetch(`${API_URL}/discovery/cards`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async getNearby(distance = 10) {
    const response = await fetch(`${API_URL}/discovery/nearby?distance=${distance}`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async getLikes() {
    const response = await fetch(`${API_URL}/discovery/likes`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async getIceBreakers(category) {
    const url = category
      ? `${API_URL}/discovery/icebreakers?category=${category}`
      : `${API_URL}/discovery/icebreakers`
    const response = await fetch(url, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async swipe(userId, isLike, isSuperLike = false) {
    const response = await fetch(`${API_URL}/swipes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ swipedId: userId, isLike, isSuperLike })
    })
    return handleResponse(response)
  },

  // Matches
  async getMatches() {
    const response = await fetch(`${API_URL}/matches`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async getMessages(matchId) {
    const response = await fetch(`${API_URL}/matches/${matchId}/messages`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async sendMessage(matchId, content, isIceBreaker = false) {
    const response = await fetch(`${API_URL}/matches/${matchId}/messages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content, isIceBreaker })
    })
    return handleResponse(response)
  },

  async markMessagesRead(matchId) {
    const response = await fetch(`${API_URL}/matches/${matchId}/read`, {
      method: 'POST',
      headers: getHeaders()
    })
    return handleResponse(response)
  }
}
