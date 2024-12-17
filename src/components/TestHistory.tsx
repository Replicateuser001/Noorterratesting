import { Clock, Book, CheckCircle2, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import type { TestResults } from '../lib/gemini'
import { languages } from '../data/languages'

interface TestHistoryProps {
  results: TestResults[]
}

// Helper function to get skill info
const getSkillInfo = (skillId: string) => {
  const englishLanguage = languages.find(lang => lang.name === 'English')
  if (!englishLanguage) return { name: skillId, collection: '' }

  for (const path of englishLanguage.paths) {
    for (const level of path.skills) {
      const skill = level.skills.find(s => s.name === skillId)
      if (skill) {
        return {
          name: skill.displayName || skill.name,
          collection: level.name
        }
      }
    }
  }
  return { name: skillId, collection: '' }
}

export default function TestHistory({ results }: TestHistoryProps) {
  const [expandedTest, setExpandedTest] = useState<number | null>(null)
  const [expandedSkills, setExpandedSkills] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'collection' | 'skill'>('collection')
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  if (results.length === 0) {
    return (
      <div className="bg-black/30 border border-white/10 rounded-lg p-6 text-center text-gray-400">
        No test history available
      </div>
    )
  }

  // Get unique skills and collections
  const uniqueSkills = new Set<string>()
  const uniqueCollections = new Set<string>()
  
  results.forEach(test => {
    test.skills_tested?.forEach(skill => {
      uniqueSkills.add(skill)
      const { collection } = getSkillInfo(skill)
      uniqueCollections.add(collection)
    })
  })

  // Group tests by skill collection and filter by selected skill
  const testsByCollection = results.reduce((acc, test) => {
    const skills = test.skills_tested || []
    const shouldIncludeTest = selectedFilter === 'all' || 
      skills.some(skill => {
        const { name } = getSkillInfo(skill)
        return name === selectedFilter
      })

    if (shouldIncludeTest) {
      skills.forEach(skill => {
        const { collection } = getSkillInfo(skill)
        if (!acc[collection]) acc[collection] = []
        if (!acc[collection].includes(test)) {
          acc[collection].push(test)
        }
      })
    }
    return acc
  }, {} as Record<string, typeof results>)

  // Group tests by individual skills
  const testsBySkill = results.reduce((acc, test) => {
    const skills = test.skills_tested || []
    skills.forEach(skill => {
      if (!acc[skill]) acc[skill] = []
      if (!acc[skill].includes(test)) {
        acc[skill].push(test)
      }
    })
    return acc
  }, {} as Record<string, typeof results>)

  // Get all unique skill names for the filter dropdown
  const allSkillNames = Array.from(uniqueSkills).map(skill => {
    const { name } = getSkillInfo(skill)
    return name
  })
  const uniqueSkillNames = Array.from(new Set(allSkillNames)).sort()

  const renderTestCard = (test: TestResults, index: number) => (
    <div 
      key={index} 
      className={`bg-black/30 border transition-all duration-200 hover:bg-black/40
        ${expandedTest === index 
          ? 'border-purple-400/30 bg-black/40' 
          : 'border-white/10'} 
        rounded-lg overflow-hidden`}
    >
      {/* Summary Header - Always visible */}
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5"
        onClick={() => setExpandedTest(expandedTest === index ? null : index)}
      >
        <div className="flex items-center space-x-4">
          <div className="text-gray-400">
            <Book size={20} />
          </div>
          <div>
            <div className="font-medium">
              Learning Session
            </div>
            <div className="text-sm text-gray-400">
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(test.created_at))} - {test.skills_tested?.length || 0} skills tested
            </div>
          </div>
        </div>
        {expandedTest === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      <div className="px-4 pb-4">
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Object.entries(test.skill_scores || {})
            .slice(0, expandedSkills.includes(index) ? undefined : 2)
            .map(([skill, score]) => {
              const { name } = getSkillInfo(skill)
              return (
                <div key={skill} className="bg-black/20 rounded p-2 text-sm">
                  <div className="text-purple-200">{name}</div>
                  <div className="text-xs text-gray-400 mb-1">{skill.split(' - ')[0]}</div>
                  <div className={`font-medium ${
                    score >= 0.7 ? 'text-green-400' : 
                    score >= 0.4 ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {(score * 100).toFixed(0)}%
                  </div>
                </div>
              )
            })}
        </div>

        {Object.keys(test.skill_scores || {}).length > 2 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (expandedSkills.includes(index)) {
                setExpandedSkills(expandedSkills.filter(i => i !== index))
              } else {
                setExpandedSkills([...expandedSkills, index])
              }
            }}
            className="mt-2 text-sm text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1"
          >
            {expandedSkills.includes(index) ? (
              <>Show Less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Show More Skills ({Object.keys(test.skill_scores || {}).length - 2} more) <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        )}

        {expandedTest === index && (
          <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
            {test.questions.map((q, qIndex) => {
              const isCorrect = Number(test.answers[qIndex]) === q.correctAnswer;
              return (
                <div
                  key={qIndex}
                  className={`p-3 rounded-md ${
                    isCorrect
                      ? 'bg-green-500/10 border border-green-400/20'
                      : 'bg-red-500/10 border border-red-400/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-purple-200">{q.skill.split(' - ')[1] || q.skill}</div>
                    <div className="text-xs text-gray-400">{q.skill.split(' - ')[0]}</div>
                  </div>
                  <p className="font-medium mb-2">{q.question}</p>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {q.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={`p-2 rounded ${
                          oIndex === q.correctAnswer
                            ? 'bg-green-500/20'
                            : oIndex === Number(test.answers[qIndex])
                            ? 'bg-red-500/20'
                            : 'bg-black/20'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => {
            setViewMode('collection')
            setSelectedSkill(null)
            setSelectedCollection(null)
            setSelectedFilter('all')
          }}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'collection'
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          View by Collection
        </button>
        <button
          onClick={() => {
            setViewMode('skill')
            setSelectedSkill(null)
            setSelectedCollection(null)
            setSelectedFilter('all')
          }}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'skill'
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          View by Skill
        </button>
      </div>

      {/* Collection View */}
      {viewMode === 'collection' && !selectedCollection && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from(uniqueCollections).sort().map(collection => (
            <button
              key={collection}
              onClick={() => setSelectedCollection(collection)}
              className="bg-black/30 border border-white/10 hover:border-purple-400/30 rounded-lg p-4 text-left transition-all"
            >
              <h3 className="text-lg font-semibold text-white">{collection}</h3>
              <p className="text-sm text-gray-400">
                {testsByCollection[collection]?.length || 0} tests
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Skill View */}
      {viewMode === 'skill' && !selectedSkill && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from(uniqueSkills).sort().map(skill => {
            const { name, collection } = getSkillInfo(skill)
            return (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className="bg-black/30 border border-white/10 hover:border-purple-400/30 rounded-lg p-4 text-left transition-all"
              >
                <h3 className="text-lg font-semibold text-white">
                  {name}
                </h3>
                <p className="text-sm text-gray-400">{collection}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {testsBySkill[skill]?.length || 0} tests
                </p>
              </button>
            )
          })}
        </div>
      )}

      {/* Selected Collection Tests */}
      {selectedCollection && (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedCollection(null)}
            className="text-purple-300 hover:text-purple-200 mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Collections
          </button>
          
          {/* Skill Filter */}
          <div className="mb-6">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white hover:border-purple-400/30 transition-all flex items-center justify-between"
              >
                <span>
                  {selectedFilter === 'all' ? 'All Skills' : selectedFilter}
                </span>
                {isFilterOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {isFilterOpen && (
                <div className="absolute z-10 mt-2 w-full bg-black/95 border border-white/10 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedFilter('all')
                      setIsFilterOpen(false)
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-white/5 ${
                      selectedFilter === 'all' ? 'text-purple-300' : 'text-white'
                    }`}
                  >
                    All Skills
                  </button>
                  {/* Get unique skills for this collection */}
                  {Array.from(new Set(
                    testsByCollection[selectedCollection]
                      ?.flatMap(test => test.skills_tested || [])
                      .map(skill => {
                        const { name } = getSkillInfo(skill)
                        return name
                      })
                  )).sort().map(skillName => (
                    <button
                      key={skillName}
                      onClick={() => {
                        setSelectedFilter(skillName)
                        setIsFilterOpen(false)
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-white/5 ${
                        selectedFilter === skillName ? 'text-purple-300' : 'text-white'
                      }`}
                    >
                      {skillName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white mb-4">
            {selectedCollection} ({testsByCollection[selectedCollection]?.length || 0} tests)
          </h2>
          
          {/* Filter and render tests */}
          {testsByCollection[selectedCollection]
            ?.filter(test => 
              selectedFilter === 'all' || 
              test.skills_tested?.some(skill => {
                const { name } = getSkillInfo(skill)
                return name === selectedFilter
              })
            )
            .map((result, index) => renderTestCard(result, index))
          }
        </div>
      )}

      {/* Selected Skill Tests */}
      {selectedSkill && (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedSkill(null)}
            className="text-purple-300 hover:text-purple-200 mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Skills
          </button>
          <h2 className="text-xl font-semibold text-white mb-4">
            {getSkillInfo(selectedSkill).name}
            <span className="text-sm text-gray-400 block">
              {getSkillInfo(selectedSkill).collection} • {testsBySkill[selectedSkill]?.length || 0} tests
            </span>
          </h2>
          {testsBySkill[selectedSkill]?.map((result, index) => 
            renderTestCard(result, index)
          )}
        </div>
      )}
    </div>
  )
}