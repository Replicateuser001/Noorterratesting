import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, Lock, TrendingUp, Activity, Star } from 'lucide-react'
import CircularProgress from '../components/CircularProgress'
import { useAuth } from '../contexts/AuthContext'
import type { TestResults } from '../lib/gemini'
import { languages } from '../data/languages'
import { calculateEloChange, normalizeElo, getEloRankColor, getEloRankTitle } from '../lib/eloCalculator'

interface SkillStats {
  skill: string
  displayName: string
  eloRating: number
  attempts: number
  lastTestDate: string
  isUnlocked: boolean
  recentTrend?: 'up' | 'down' | 'stable'
  highestRating?: number
}

const INITIAL_ELO = 1000

const getSkillDisplayName = (skillId: string): string => {
  const englishLanguage = languages.find(lang => lang.name === 'English')
  if (!englishLanguage) return skillId

  const grammarPath = englishLanguage.paths.find(p => p.name === 'Grammar')
  if (!grammarPath) return skillId

  for (const level of grammarPath.skills || []) {
    for (const pkg of level.skills || []) {
      // Check package skills
      if (pkg.skills) {  
        for (const skill of pkg.skills) {
          if (skill.name === skillId) {
            return skill.name
          }
        }
      }
      // Check package itself
      if (pkg.name === skillId) {
        return pkg.name
      }
    }
  }
  
  return skillId
}

const StatsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState<SkillStats[]>([])
  const [overallProgress, setOverallProgress] = useState(0)

  useEffect(() => {
    if (user) {
      // Clean up any abnormal test results first
      const allResults: TestResults[] = JSON.parse(localStorage.getItem('testResults') || '[]')
      const cleanedResults = allResults.filter(result => {
        // Keep the result only if all skill scores are <= 1
        return Object.values(result.skill_scores).every(score => score <= 1)
      })

      // If we removed any results, update localStorage
      if (cleanedResults.length < allResults.length) {
        localStorage.setItem('testResults', JSON.stringify(cleanedResults))
        console.log(`Removed ${allResults.length - cleanedResults.length} abnormal test results`)
      }

      // Continue with normal stats processing using cleaned results
      const userResults = cleanedResults.filter(result => result.username === user.username)

      const skillTestsMap = new Map<string, Array<{ score: number, date: string, difficulty: string }>>()
      
      userResults.forEach(result => {
        Object.entries(result.skill_scores).forEach(([skill, score]) => {
          const tests = skillTestsMap.get(skill) || []
          tests.push({ 
            score, 
            date: result.test_date,
            difficulty: result.difficulty || 'normal' // Default to normal if difficulty not set
          })
          skillTestsMap.set(skill, tests)
        })
      })

      const skillStats = new Map<string, SkillStats>()
      
      skillTestsMap.forEach((tests, skill) => {
        const sortedTests = tests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        const stats: SkillStats = {
          skill,
          displayName: getSkillDisplayName(skill),
          eloRating: INITIAL_ELO,
          attempts: tests.length,
          lastTestDate: sortedTests[0]?.date || '',
          isUnlocked: tests.length >= 10
        }

        if (tests.length > 0) {
          // Calculate ELO changes using our new calculator
          stats.eloRating = sortedTests.reverse().reduce((elo, test, index) => {
            const eloChange = calculateEloChange(elo, test.score, index + 1, skill, test.difficulty)
            return elo + eloChange
          }, INITIAL_ELO)
        }

        if (tests.length > 1) {
          const recentTests = sortedTests.slice(0, 3)
          const recentElo = recentTests.reduce((elo, test, index) => {
            const eloChange = calculateEloChange(elo, test.score, stats.attempts - 2 + index, skill, test.difficulty)
            return elo + eloChange
          }, stats.eloRating)
          
          if (recentElo > stats.eloRating) {
            stats.recentTrend = 'up'
          } else if (recentElo < stats.eloRating) {
            stats.recentTrend = 'down'
          } else {
            stats.recentTrend = 'stable'
          }
        }

        if (stats.eloRating > (stats.highestRating || 0)) {
          stats.highestRating = stats.eloRating
        }

        skillStats.set(skill, stats)
      })

      const statsArray = Array.from(skillStats.values())
        .sort((a, b) => b.attempts - a.attempts)

      setStats(statsArray)

      const unlockedStats = statsArray.filter(stat => stat.isUnlocked)
      if (unlockedStats.length > 0) {
        // Calculate overall progress based on actual ELO ratings
        const avgElo = unlockedStats.reduce((acc, curr) => 
          acc + curr.eloRating, 0
        ) / unlockedStats.length
        setOverallProgress(normalizeElo(avgElo))
      }
    }
  }, [user])

  if (!user) {
    return <div>Please log in to view stats</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Your Progress</h1>
          <p className="text-lg text-purple-200">Mastery tracking across all skills</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-black/30 border border-white/10 rounded-lg p-8 mb-8">
          <div className="flex flex-col items-center">
            <Trophy className="w-8 h-8 text-purple-300 mb-4" />
            {stats.some(stat => stat.isUnlocked) ? (
              <div className="text-center">
                <CircularProgress
                  value={overallProgress * 100}
                  size={160}
                  strokeWidth={12}
                  label="Overall Mastery"
                />
                <div className="mt-4">
                  <div className={`text-2xl font-bold ${getEloRankColor(overallProgress * (2000 - 0) + 0)}`}>
                    {getEloRankTitle(overallProgress * (2000 - 0) + 0)}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    ELO: {Math.round(overallProgress * (2000 - 0) + 0)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Complete 10 tests in any skill to unlock overall mastery</p>
              </div>
            )}
          </div>
        </div>

        {/* Individual Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.skill}
              className="bg-black/30 border border-white/10 rounded-lg p-6 flex flex-col items-center"
            >
              {stat.isUnlocked ? (
                <div className="text-center w-full">
                  <CircularProgress
                    value={normalizeElo(stat.eloRating) * 100}
                    label={stat.displayName}
                  />
                  <div className="mt-4 space-y-2">
                    <div className={`text-xl font-bold ${getEloRankColor(stat.eloRating)}`}>
                      {getEloRankTitle(stat.eloRating)}
                    </div>
                    <div className="text-sm text-gray-400">
                      ELO Rating: {Math.round(stat.eloRating)}
                    </div>
                    {stat.recentTrend && (
                      <div className="flex items-center justify-center gap-1 text-sm">
                        {stat.recentTrend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                        {stat.recentTrend === 'down' && <TrendingUp className="w-4 h-4 text-red-400 transform rotate-180" />}
                        {stat.recentTrend === 'stable' && <Activity className="w-4 h-4 text-blue-400" />}
                        <span className="text-gray-400">
                          {stat.recentTrend === 'up' ? 'Improving' : 
                           stat.recentTrend === 'down' ? 'Declining' : 'Stable'}
                        </span>
                      </div>
                    )}
                    {stat.highestRating && stat.highestRating > stat.eloRating && (
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-400">
                          Best: {Math.round(stat.highestRating)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Lock className="w-8 h-8 text-gray-500 mx-auto mb-4" />
                  <div className="mb-4">{stat.displayName}</div>
                  <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${(stat.attempts / 10) * 100}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    {stat.attempts}/10 tests needed
                  </div>
                </div>
              )}
              <div className="mt-4 text-center">
                <div className="text-sm text-gray-400">
                  Tests taken: {stat.attempts}
                </div>
                <div className="text-sm text-gray-400">
                  Last test: {new Date(stat.lastTestDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatsPage