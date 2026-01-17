import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import './ProfileSetup.css'

export default function ProfileSetup() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [bio, setBio] = useState('')
  const [photos, setPhotos] = useState([])
  const [genderPreference, setGenderPreference] = useState('')
  const [minAge, setMinAge] = useState(18)
  const [maxAge, setMaxAge] = useState(50)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { updateUser } = useAuth()
  const navigate = useNavigate()

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      // Update profile
      await api.updateProfile({
        name,
        birthDate,
        gender,
        bio
      })

      // Upload photos
      for (const photo of photos) {
        await api.uploadPhoto(photo)
      }

      // Update preferences
      await api.updatePreferences({
        genderPreference,
        minAge,
        maxAge
      })

      updateUser({ isProfileComplete: true, name })
      navigate('/discover')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && (!name || !birthDate || !gender)) {
      setError('Заполните все поля')
      return
    }
    if (step === 2 && photos.length === 0) {
      setError('Добавьте хотя бы одно фото')
      return
    }
    setError('')
    setStep(prev => prev + 1)
  }

  const prevStep = () => setStep(prev => prev - 1)

  return (
    <div className="setup-page">
      <div className="setup-card card animate-fade-in">
        <div className="setup-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        <div className="setup-header">
          <h1>
            {step === 1 && 'Расскажите о себе'}
            {step === 2 && 'Добавьте фото'}
            {step === 3 && 'Кого вы ищете?'}
          </h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        {step === 1 && (
          <div className="setup-form">
            <div className="input-group">
              <label>Ваше имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Как вас зовут?"
              />
            </div>

            <div className="input-group">
              <label>Дата рождения</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Пол</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Выберите</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>

            <div className="input-group">
              <label>О себе</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Расскажите немного о себе..."
                rows={4}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="setup-form">
            <div className="photos-grid">
              {photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo} alt={`Photo ${index + 1}`} />
                  <button
                    className="photo-remove"
                    onClick={() => removePhoto(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
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
            <p className="photos-hint">Добавьте до 6 фотографий</p>
          </div>
        )}

        {step === 3 && (
          <div className="setup-form">
            <div className="input-group">
              <label>Кого ищете</label>
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
          </div>
        )}

        <div className="setup-actions">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={prevStep}>
              Назад
            </button>
          )}
          {step < 3 ? (
            <button className="btn btn-primary" onClick={nextStep}>
              Далее
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Сохранение...' : 'Начать знакомства'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
