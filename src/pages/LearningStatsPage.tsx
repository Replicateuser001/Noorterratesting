import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Book, ChevronRight, LineChart, BarChart, TrendingUp, TrendingDown, Minus, Star, Target } from 'lucide-react'
import CircularProgress from '../components/CircularProgress'
import { useAuth } from '../contexts/AuthContext'
import type { TestResults } from '../lib/gemini'
import { languages } from '../data/languages'
import type { LearningStats, SkillStats } from '../lib/stats'
import { calculateSkillCompletion, isSkillCompleted, calculateOverallCompletion } from '../lib/stats'
import { getTestResults, syncLocalTestResults } from '../lib/supabase'

const getSkillDisplayName = (skillId: string): string => {
  const englishLanguage = languages.find(lang => lang.name === 'English')
  if (!englishLanguage) return skillId

  const grammarPath = englishLanguage.paths.find(p => p.name === 'Grammar')
  if (!grammarPath) return skillId

  for (const level of grammarPath.skills || []) {
    for (const pkg of level.skills || []) {
      if (pkg.skills) {  
        for (const skill of pkg.skills) {
          if (skill.name === skillId) {
            return skill.name
          }
        }
      }
      if (pkg.name === skillId) {
        return pkg.name
      }
    }
  }
  
  return skillId
}

const LearningStatsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showDetailed, setShowDetailed] = useState(false)
  const [view, setView] = useState<'completion' | 'performance'>('completion')
  const [stats, setStats] = useState<LearningStats | null>(null)

  useEffect(() => {
    async function loadTestResults() {
      if (user) {
        try {
          const allResults = await getTestResults(user.username)
          const userResults = allResults.filter(result => 
            result.username === user.username && result.mode === 'learning'
          )

          const skillTestsMap = new Map<string, number[]>()
          
          userResults.forEach(result => {
            if (result.skill_scores) {
              Object.entries(result.skill_scores).forEach(([skill, score]) => {
                const tests = skillTestsMap.get(skill) || []
                tests.push(score * 100)
                skillTestsMap.set(skill, tests)
              })
            }
          })

          const skillStats: Record<string, SkillStats> = {}
          
          skillTestsMap.forEach((scores, skillId) => {
            const recentTests = scores.slice(-15)
            skillStats[skillId] = {
              skillId,
              completionPercentage: calculateSkillCompletion(recentTests),
              recentTests,
              allTestScores: scores,
              isCompleted: isSkillCompleted(recentTests),
              averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
              trend: scores.length > 1 ? 
                scores[scores.length - 1] > scores[scores.length - 2] ? 'up' :
                scores[scores.length - 1] < scores[scores.length - 2] ? 'down' : 'stable'
                : 'stable'
            }
          })

          setStats({
            overallCompletion: calculateOverallCompletion(skillStats),
            skillStats
          })
        } catch (error) {
          console.error('Error loading test results:', error)
        }
      }
    }
    loadTestResults()
  }, [user])

  if (!user) {
    return <div>Please log in to view stats</div>
  }

  const renderSimpleOverview = () => {
    if (!stats) return null

    const allSkills = Object.values(stats.skillStats)
    const masteredSkills = allSkills.filter(s => s.isCompleted)
    const inProgressSkills = allSkills.filter(s => !s.isCompleted)
    const overallAverage = allSkills.reduce((acc, skill) => acc + skill.averageScore, 0) / allSkills.length

    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/30 border border-white/10 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {Math.round(overallAverage)}%
            </div>
            <div className="text-sm text-gray-400">Overall Performance</div>
          </div>
          <div className="bg-black/30 border border-white/10 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {masteredSkills.length}
            </div>
            <div className="text-sm text-gray-400">Skills Mastered</div>
          </div>
          <div className="bg-black/30 border border-white/10 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {inProgressSkills.length}
            </div>
            <div className="text-sm text-gray-400">Skills in Progress</div>
          </div>
        </div>

        {/* Skill Overview */}
        <div className="bg-black/30 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Progress</h3>
            <button
              onClick={() => setShowDetailed(true)}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              View Detailed Analysis →
            </button>
          </div>
          <div className="space-y-4">
            {allSkills
              .sort((a, b) => b.averageScore - a.averageScore)
              .slice(0, 5)
              .map(skill => (
                <div key={skill.skillId} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{getSkillDisplayName(skill.skillId)}</span>
                      <span className="text-sm text-gray-400">{Math.round(skill.averageScore)}%</span>
                    </div>
                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all"
                        style={{ width: `${skill.averageScore}%` }}
                      />
                    </div>
                  </div>
                  {skill.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                  {skill.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                  {skill.trend === 'stable' && <Minus className="w-4 h-4 text-gray-400" />}
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  const renderDetailedAnalysis = () => {
    if (!stats) return null

    const allSkills = Object.values(stats.skillStats)
    const strengthsAndWeaknesses = allSkills.sort((a, b) => b.averageScore - a.averageScore)
    const strengths = strengthsAndWeaknesses.slice(0, 3)
    const weaknesses = strengthsAndWeaknesses.slice(-3).reverse()

    return (
      <div className="space-y-6">
        <button
          onClick={() => setShowDetailed(false)}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>

        {/* Strengths */}
        <div className="bg-black/30 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Strongest Skills
          </h3>
          <div className="space-y-4">
            {strengths.map(skill => (
              <div key={skill.skillId} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{getSkillDisplayName(skill.skillId)}</span>
                    <span className="text-green-400">{Math.round(skill.averageScore)}%</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {skill.isCompleted ? 'Mastered' : `${skill.recentTests.length} recent tests`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-black/30 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Areas for Improvement
          </h3>
          <div className="space-y-4">
            {weaknesses.map(skill => (
              <div key={skill.skillId} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{getSkillDisplayName(skill.skillId)}</span>
                    <span className="text-red-400">{Math.round(skill.averageScore)}%</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Needs more practice • {skill.recentTests.length} tests taken
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-black/30 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Progress Timeline</h3>
          <div className="space-y-2">
            {allSkills.map(skill => (
              <div key={skill.skillId} className="p-3 bg-black/20 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{getSkillDisplayName(skill.skillId)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      Last 15 tests:
                    </span>
                    <div className="flex gap-1">
                      {skill.recentTests.map((score, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            score >= 90 ? 'bg-green-400' :
                            score >= 70 ? 'bg-yellow-400' :
                            'bg-red-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
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
          <h1 className="text-4xl font-bold mb-4">Learning Progress</h1>
          <p className="text-lg text-purple-200">Track your learning journey</p>
        </div>

        {showDetailed ? renderDetailedAnalysis() : renderSimpleOverview()}
      </div>
    </div>
  )
}

export default LearningStatsPage
