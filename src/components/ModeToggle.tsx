import { Book, Trophy, Lock } from 'lucide-react'
import { useMode } from '../contexts/ModeContext'

const ModeToggle = () => {
  const { mode, setMode, isModeLocked } = useMode()

  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg p-2">
      <button
        onClick={() => setMode('learning')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
          mode === 'learning' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
        disabled={isModeLocked && mode !== 'learning'}
      >
        <Book className="w-4 h-4" />
        Learning
        {isModeLocked && mode === 'learning' && (
          <Lock className="w-3 h-3 text-white/50" />
        )}
      </button>
      <button
        onClick={() => setMode('competitive')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
          mode === 'competitive' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
        disabled={isModeLocked}
      >
        <Trophy className="w-4 h-4" />
        Competitive
      </button>
    </div>
  )
}

export default ModeToggle
