import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import './Profile.css'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [minAge, setMinAge] = useState(18)
  const [maxAge, setMaxAge] = useState(50)
  const [genderPreference, setGenderPreference] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await api.getProfile()
      setProfile(data)
      setName(data.name || '')
      setBio(data.bio || '')
      setMinAge(data.preferences?.minAge || 18)
      setMaxAge(data.preferences?.maxAge || 50)
      setGenderPreference(data.preferences?.genderPreference || '')
    } catch (error) {
      setError('Ошибка загрузки профиля')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await api.updateProfile({ name, bio })
      await api.updatePreferences({ minAge, maxAge, genderPreference })
      updateUser({ name })
      setSuccess('Профиль сохранён')
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const photo = await api.uploadPhoto(reader.result)
          setProfile(prev => ({
            ...prev,
            photos: [...prev.photos, photo]
          }))
        } catch (err) {
          setError(err.message)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeletePhoto = async (photoId) => {
    try {
      await api.deletePhoto(photoId)
      setProfile(prev => ({
        ...prev,
        photos: prev.photos.filter(p => p.id !== photoId)
      }))
    } catch (err) {
      setError(err.message)
    }
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
    return <div className="profile-loading">Загрузка...</div>
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Мой профиль</h1>
        {!editing && (
          <button className="btn btn-secondary" onClick={() => setEditing(true)}>
            Редактировать
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-content">
        <div className="profile-photos card">
          <h2>Фотографии</h2>
          <div className="photos-grid">
            {profile?.photos.map(photo => (
              <div key={photo.id} className="photo-item">
                <img src={photo.url} alt="Profile" />
                {editing && (
                  <button
                    className="photo-remove"
                    onClick={() => handleDeletePhoto(photo.id)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {editing && profile?.photos.length < 6 && (
              <label className="photo-add">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  hidden
                />
                <span>+</span>
              </label>
            )}
          </div>
        </div>

        <div className="profile-info card">
          <h2>Информация</h2>
          {editing ? (
            <>
              <div className="input-group">
                <label>Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>О себе</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                />
              </div>
            </>
          ) : (
            <>
              <div className="info-row">
                <span className="info-label">Имя</span>
                <span className="info-value">{profile?.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Возраст</span>
                <span className="info-value">
                  {profile?.birthDate ? calculateAge(profile.birthDate) : '—'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Пол</span>
                <span className="info-value">
                  {profile?.gender === 'male' ? 'Мужской' : profile?.gender === 'female' ? 'Женский' : '—'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">О себе</span>
                <span className="info-value">{profile?.bio || '—'}</span>
              </div>
            </>
          )}
        </div>

        <div className="profile-preferences card">
          <h2>Настройки поиска</h2>
          {editing ? (
            <>
              <div className="input-group">
                <label>Кого ищу</label>
                <select
                  value={genderPreference}
                  onChange={(e) => setGenderPreference(e.target.value)}
                >
                  <option value="">Всех</option>
                  <option value="male">Мужчин</option>
                  <option value="female">Женщин</option>
                </select>
              </div>
              <div className="input-group">
                <label>Возраст: {minAge} - {maxAge} лет</label>
                <div className="age-inputs">
                  <input
                    type="range"
                    min="18"
                    max="70"
                    value={minAge}
                    onChange={(e) => setMinAge(Number(e.target.value))}
                  />
                  <input
                    type="range"
                    min="18"
                    max="70"
                    value={maxAge}
                    onChange={(e) => setMaxAge(Number(e.target.value))}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="info-row">
                <span className="info-label">Ищу</span>
                <span className="info-value">
                  {genderPreference === 'male' ? 'Мужчин' :
                   genderPreference === 'female' ? 'Женщин' : 'Всех'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Возраст</span>
                <span className="info-value">{minAge} - {maxAge} лет</span>
              </div>
            </>
          )}
        </div>

        {editing && (
          <div className="profile-actions">
            <button className="btn btn-secondary" onClick={() => {
              setEditing(false)
              loadProfile()
            }}>
              Отмена
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
