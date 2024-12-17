import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, Check, History } from 'lucide-react'
import { languages } from '../data/languages'
import { useState, useEffect } from 'react'
import TestGenerator from '../components/TestGenerator'
import TestInterface from '../components/TestInterface'
import TestHistory from '../components/TestHistory'
import type { Test, TestResults } from '../lib/gemini'
import { useAuth } from '../contexts/AuthContext'
import { useMode } from '../contexts/ModeContext'
import { CompetitiveDifficulty } from '../types/questionBank'
import { supabase } from '../lib/supabase'

const LanguageSpecializationPage = () => {
  const { languageName } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { mode } = useMode()
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set())
  const [expandedPath, setExpandedPath] = useState<string | null>(null)
  const [currentTest, setCurrentTest] = useState<Test | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [testResults, setTestResults] = useState<TestResults[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<CompetitiveDifficulty>('normal')

  const language = languages.find(l => l.name === languageName)

  const cycleDifficulty = () => {
    const difficulties: CompetitiveDifficulty[] = ['easy', 'normal', 'hard', 'expert']
    const currentIndex = difficulties.indexOf(selectedDifficulty)
    const nextIndex = (currentIndex + 1) % difficulties.length
    setSelectedDifficulty(difficulties[nextIndex])
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'normal': return 'text-blue-400'
      case 'hard': return 'text-orange-400'
      case 'expert': return 'text-red-400'
      default: return 'text-white'
    }
  }

  useEffect(() => {
    if (user) {
      // Get test results from Supabase
      const loadTestResults = async () => {
        try {
          const userResults = await getTestResults(user.username)
          console.log('Loading test results:', { userResults, user })
          setTestResults(userResults || [])
        } catch (error) {
          console.error('Error loading test results:', error)
        }
      }
      loadTestResults()
    }
  }, [user])

  const handleSkillClick = (skill: string) => {
    setSelectedSkills(prev => {
      const newSet = new Set(prev)
      
      // Handle Grade 8 Package selection
      if (skill === 'Grade 8 Complete Package') {
        const grammarPath = language.paths?.find(p => p.name === 'Grammar')
        const grade8Skills = grammarPath?.skills?.[0].skills.map(s => s.name) || []
        
        if (newSet.has(skill)) {
          // Deselect all Grade 8 skills
          grade8Skills.forEach(s => newSet.delete(s))
          newSet.delete(skill)
        } else {
          // Select all Grade 8 skills
          grade8Skills.forEach(s => newSet.add(s))
          newSet.add(skill)
        }
        return newSet
      }

      // Handle individual skill selection/deselection
      if (newSet.has(skill)) {
        newSet.delete(skill)
        // If a Grade 8 skill is deselected, also deselect the package
        const grammarPath = language.paths?.find(p => p.name === 'Grammar')
        if (grammarPath?.skills?.[0]?.skills) {
          newSet.delete('Grade 8 Complete Package')
        }
      } else {
        newSet.add(skill)
        // Check if all Grade 8 skills are selected
        const grammarPath = language.paths?.find(p => p.name === 'Grammar')
        if (grammarPath?.skills?.[0]?.skills) {
          const grade8Skills = grammarPath.skills[0].skills.map(s => s.name)
          const allGrade8Selected = grade8Skills.every(s => newSet.has(s))
          if (allGrade8Selected) {
            newSet.add('Grade 8 Complete Package')
          }
        }
      }
      return newSet
    })
  }

  const togglePath = (pathName: string) => {
    setExpandedPath(expandedPath === pathName ? null : pathName)
  }

  const handleTestGenerated = (test: Test) => {
    setCurrentTest(test)
    setShowHistory(false)
  }

  const handleTestComplete = async (results: TestResults) => {
    if (!user) {
      console.error('Cannot save test results: No user logged in')
      return
    }

    try {
      // Add username to results
      const resultsWithUser = {
        ...results,
        username: user.username,
        timestamp: new Date().toISOString()
      }

      // Save to Supabase
      await saveTestResults(resultsWithUser)
      
      // Update local state
      setTestResults(prev => [...prev, resultsWithUser])
      setShowHistory(true)
    } catch (error) {
      console.error('Error saving test results:', error)
    }
  }

  // Get unique skills, excluding duplicates from other levels
  const getUniqueSkills = (path: any) => {
    if (!path.skills) return []
    return Array.from(new Set(
      path.skills.flatMap((level, index) => {
        // For the first level (Grade 8 Package), show all skills
        // For other levels, filter out skills that are already in Grade 8 Package
        if (index === 0) {
          return level.skills.map(skill => skill.name)
        }
        const grade8Skills = new Set(path.skills[0].skills.map(skill => skill.name))
        return level.skills
          .map(skill => skill.name)
          .filter(skillName => !grade8Skills.has(skillName))
      })
    )).sort()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/domain/The Tongue')}
        className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to The Tongue
      </button>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{language.name}</h1>
        <p className="text-xl text-purple-200 mb-8">{language.description}</p>

        {!currentTest ? (
          <>
            <div className="sticky top-4 z-20 mb-8">
              <div className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm rounded-lg p-6 border border-purple-400/30 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-purple-200">
                    {showHistory ? 'Test History' : 'Generate Your Test'}
                  </h2>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    {showHistory ? (
                      <>Generate New Test</>
                    ) : (
                      <>
                        <History className="w-4 h-4" />
                        View History
                      </>
                    )}
                  </button>
                </div>

                {showHistory ? (
                  <TestHistory results={testResults} />
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-purple-200">
                        Selected skills: {selectedSkills.size > 0 
                          ? Array.from(selectedSkills).filter(s => s !== 'Grade 8 Complete Package').length
                          : 'None'}
                      </div>
                      {mode === 'competitive' && (
                        <button
                          onClick={cycleDifficulty}
                          className={`px-4 py-2 rounded-lg bg-black/30 border border-white/10 ${getDifficultyColor(selectedDifficulty)} hover:bg-black/40 transition-colors`}
                        >
                          Difficulty: {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                        </button>
                      )}
                    </div>
                    <TestGenerator
                      language={languageName || ''}
                      skillsTested={Array.from(selectedSkills).filter(s => s !== 'Grade 8 Complete Package')}
                      username={user?.username || 'Anonymous'}
                      selectedDifficulty={selectedDifficulty}
                    />
                  </>
                )}
              </div>
            </div>

            {!showHistory && language.paths && (
              <div className="space-y-4">
                {language.paths.map((path) => (
                  <div
                    key={path.name}
                    className="rounded-lg bg-black/30 border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() => togglePath(path.name)}
                      className="w-full p-6 flex items-center justify-between hover:bg-black/40 transition-all"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-purple-200 text-left">{path.name}</h3>
                        <p className="text-gray-300 text-sm text-left">{path.description}</p>
                      </div>
                      {expandedPath === path.name ? (
                        <ChevronUp className="w-5 h-5 text-purple-300" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-purple-300" />
                      )}
                    </button>
                    
                    {expandedPath === path.name && path.skills && (
                      <div className="p-6 pt-2 border-t border-white/10 space-y-4">
                        {path.name === 'Grammar' && (
                          <div className="p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg mb-6">
                            <button
                              onClick={() => handleSkillClick('Grade 8 Complete Package')}
                              className={`flex items-center gap-3 w-full p-3 rounded-md text-left transition-all
                                ${selectedSkills.has('Grade 8 Complete Package')
                                  ? 'bg-purple-500/30 border border-purple-400/50'
                                  : 'bg-black/20 border border-white/10 hover:bg-black/30'
                                }`}
                            >
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                                ${selectedSkills.has('Grade 8 Complete Package')
                                  ? 'border-purple-400 bg-purple-400'
                                  : 'border-white/30'
                                }`}
                              >
                                {selectedSkills.has('Grade 8 Complete Package') && 
                                  <Check className="w-3 h-3 text-black" />}
                              </div>
                              <span className="flex-1 font-semibold">Grade 8 Complete Package</span>
                            </button>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {getUniqueSkills(path)
                            .filter(skill => skill !== 'Grade 8 Complete Package')
                            .map((skill) => (
                              <button
                                key={skill}
                                onClick={() => handleSkillClick(skill)}
                                className={`flex items-center gap-3 p-3 rounded-md text-left text-sm transition-all
                                  ${selectedSkills.has(skill)
                                    ? 'bg-purple-500/20 border border-purple-400/30'
                                    : 'bg-black/20 border border-white/5 hover:bg-black/30'
                                  }`}
                              >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                                  ${selectedSkills.has(skill)
                                    ? 'border-purple-400 bg-purple-400'
                                    : 'border-white/30'
                                  }`}
                                >
                                  {selectedSkills.has(skill) && <Check className="w-3 h-3 text-black" />}
                                </div>
                                <span className="flex-1">{skill}</span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">            
            <TestInterface
              test={currentTest}
              onTestComplete={handleTestComplete}
            />

            {showHistory && (
              <button
                onClick={() => setCurrentTest(null)}
                className="w-full py-3 rounded-md font-medium bg-purple-500 hover:bg-purple-600 transition-all"
              >
                Start New Test
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const getTestResults = async (username: string) => {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('username', username)
  if (error) {
    throw error
  }
  return data
}

const saveTestResults = async (results: TestResults) => {
  const { error } = await supabase
    .from('test_results')
    .insert([results])
  if (error) {
    throw error
  }
}

export default LanguageSpecializationPage