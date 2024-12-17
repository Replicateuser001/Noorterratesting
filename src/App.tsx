import { Routes, Route } from 'react-router-dom'
import StarryBackground from './components/StarryBackground'
import HomePage from './pages/HomePage'
import DomainPage from './pages/DomainPage'
import LanguageSpecializationPage from './pages/LanguageSpecializationPage'
import StatsPage from './pages/StatsPage'
import TestPage from './pages/TestPage'
import LearningStatsPage from './pages/LearningStatsPage'
import { ModeProvider } from './contexts/ModeContext'
import ModeToggle from './components/ModeToggle'

function App() {
  return (
    <ModeProvider>
      <div className="min-h-screen relative overflow-hidden text-white">
        <StarryBackground />
        <div className="relative z-10">
          {/* Mode Toggle */}
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/domain/:domainTitle" element={<DomainPage />} />
            <Route path="/language/:languageName" element={<LanguageSpecializationPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/learning-stats" element={<LearningStatsPage />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </div>
      </div>
    </ModeProvider>
  )
}

export default App