import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { X } from 'lucide-react'

interface LoginModalProps {
  onClose: () => void
}

const LoginModal = ({ onClose }: LoginModalProps) => {
  const { login, register } = useAuth()
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isRegistering) {
      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      if (!formData.email) {
        setError('Email is required')
        return
      }
      
      const success = await register(formData.username, formData.email, formData.displayName, formData.password)
      if (success) {
        onClose()
      } else {
        setError('Registration failed. Username or email might already exist.')
      }
    } else {
      const success = await login(formData.username, formData.password)
      if (success) {
        onClose()
      } else {
        setError('Invalid username or password')
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/90 border border-white/10 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {isRegistering ? 'Register' : 'Login'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full bg-black/30 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-purple-400"
              placeholder="Enter username"
            />
          </div>

          {isRegistering && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full bg-black/30 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                  placeholder="Enter display name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-black/30 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                  placeholder="Enter email"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full bg-black/30 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-purple-400"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-md font-medium bg-purple-500 hover:bg-purple-600 transition-all"
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>

          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full text-sm text-purple-300 hover:text-purple-200"
          >
            {isRegistering
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal