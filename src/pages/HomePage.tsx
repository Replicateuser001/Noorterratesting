import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DomainSelector from '../components/DomainSelector'
import LoginModal from '../components/LoginModal'
import StatsButton from '../components/StatsButton'
import { useAuth } from '../contexts/AuthContext'
import { LogOut } from 'lucide-react'

const HomePage = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(!isAuthenticated)
  const navigate = useNavigate()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-200">
          Magical Aptitude Test
        </h1>
        <p className="text-lg text-purple-200 mb-6">
          Discover your mystical calling among the ancient disciplines
        </p>

        {isAuthenticated && (
          <div className="flex items-center justify-center gap-4">
            <p className="text-purple-200">
              Welcome, <span className="font-semibold">{user?.displayName}</span>
            </p>
            <StatsButton />
            <button
              onClick={logout}
              className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <DomainSelector />
      ) : (
        showLogin && <LoginModal onClose={() => setShowLogin(false)} />
      )}
    </div>
  )
}

export default HomePage