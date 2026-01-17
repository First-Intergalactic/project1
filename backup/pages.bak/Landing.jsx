import { Link } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="landing-content">
        <div className="landing-hero">
          <span className="hero-icon">💜</span>
          <h1 className="hero-title">LoveMatch</h1>
          <p className="hero-subtitle">
            Найди свою половинку среди тысяч людей рядом с тобой
          </p>
        </div>

        <div className="landing-features">
          <div className="feature">
            <span className="feature-icon">🔍</span>
            <h3>Умный поиск</h3>
            <p>Алгоритм подберёт идеальные анкеты именно для тебя</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💫</span>
            <h3>Свайпы</h3>
            <p>Листай вправо если нравится, влево если нет</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💬</span>
            <h3>Чат</h3>
            <p>Общайся с теми, кто тоже проявил интерес</p>
          </div>
        </div>

        <div className="landing-actions">
          <Link to="/register" className="btn btn-primary btn-large">
            Начать знакомства
          </Link>
          <Link to="/login" className="btn btn-secondary btn-large">
            Уже есть аккаунт
          </Link>
        </div>

        <div className="landing-stats">
          <div className="stat">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Пользователей</span>
          </div>
          <div className="stat">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Пар</span>
          </div>
          <div className="stat">
            <span className="stat-number">1M+</span>
            <span className="stat-label">Сообщений</span>
          </div>
        </div>
      </div>
    </div>
  )
}
