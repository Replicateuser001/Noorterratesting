import { BarChart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMode } from '../contexts/ModeContext'

const StatsButton = () => {
  const navigate = useNavigate()
  const { mode } = useMode()

  const handleClick = () => {
    navigate(mode === 'learning' ? '/learning-stats' : '/stats')
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
    >
      <BarChart className="w-4 h-4 text-purple-300" />
      <span className="text-sm text-purple-200">View Stats</span>
    </button>
  )
}

export default StatsButton
