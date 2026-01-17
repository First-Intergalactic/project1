import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfileSetup from './pages/ProfileSetup'
import Discover from './pages/Discover'
import Matches from './pages/Matches'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import './styles/App.css'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-screen">Загрузка...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (!user.isProfileComplete) {
    return <Navigate to="/setup" />
  }

  return children
}

function AuthRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-screen">Загрузка...</div>
  }

  if (user) {
    if (!user.isProfileComplete) {
      return <Navigate to="/setup" />
    }
    return <Navigate to="/discover" />
  }

  return children
}

function SetupRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-screen">Загрузка...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (user.isProfileComplete) {
    return <Navigate to="/discover" />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <AuthRoute>
          <Landing />
        </AuthRoute>
      } />
      <Route path="/login" element={
        <AuthRoute>
          <Login />
        </AuthRoute>
      } />
      <Route path="/register" element={
        <AuthRoute>
          <Register />
        </AuthRoute>
      } />
      <Route path="/setup" element={
        <SetupRoute>
          <ProfileSetup />
        </SetupRoute>
      } />
      <Route path="/discover" element={
        <PrivateRoute>
          <Layout>
            <Discover />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/matches" element={
        <PrivateRoute>
          <Layout>
            <Matches />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/chat/:matchId" element={
        <PrivateRoute>
          <Layout>
            <Chat />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Layout>
            <Profile />
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  )
}
