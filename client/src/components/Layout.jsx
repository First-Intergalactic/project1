import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

export default function Layout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="logo">💜</span>
          <span className="brand-name">LoveMatch</span>
        </div>
        <div className="navbar-links">
          <NavLink to="/discover" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">🔍</span>
            <span className="nav-text">Поиск</span>
          </NavLink>
          <NavLink to="/matches" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">💬</span>
            <span className="nav-text">Сообщения</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">👤</span>
            <span className="nav-text">Профиль</span>
          </NavLink>
        </div>
        <div className="navbar-user">
          <span className="user-name">{user?.name || 'Пользователь'}</span>
          <button onClick={logout} className="logout-btn">Выйти</button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
