import { useState } from 'react'
import { Test, TestResults, evaluateTest } from '../lib/gemini'
import { Check, X, Loader2, ArrowRight, ArrowLeft } from 'lucide-react'
import { recordQuestionAttempt } from '../lib/questionBank'
import { useMode } from '../contexts/ModeContext'
import { useAuth } from '../contexts/AuthContext'
import { saveTestResults } from '../lib/supabase'

interface TestInterfaceProps {
  test: Test
  onTestComplete: (results: TestResults) => void
}

const TestInterface = ({ test, onTestComplete }: TestInterfaceProps) => {
  const { mode } = useMode()
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(Array(test.questions.length).fill(-1))
  const [evaluating, setEvaluating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<TestResults | null>(null)
  const [showExplanation, setShowExplanation] = useState<number | null>(null)

  // Ensure we have valid test data
  if (!test || !test.questions || test.questions.length === 0) {
    return (
      <div className="bg-black/30 border border-white/10 rounded-lg p-6 text-center">
        <div className="text-red-400 mb-2">Error: No test questions available</div>
        <div className="text-sm text-gray-400">Please try regenerating the test</div>
      </div>
    )
  }

  const question = test.questions[currentQuestion]
  if (!question) {
    return (
      <div className="bg-black/30 border border-white/10 rounded-lg p-6 text-center">
        <div className="text-red-400 mb-2">Error: Invalid question index</div>
        <div className="text-sm text-gray-400">Please try regenerating the test</div>
      </div>
    )
  }

  const handleAnswer = (answerIndex: number) => {
    // If explanation is shown, don't allow changing the answer
    if (showExplanation !== null) return

    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)

    // Show explanation after selecting an answer
    setShowExplanation(currentQuestion)
  }

  const navigateQuestion = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else if (direction === 'next' && currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      // Reset explanation when moving to next question
      setShowExplanation(null)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to submit a test')
      return
    }

    setEvaluating(true)
    setError(null)

    try {
      const evaluationResults = await evaluateTest(test, answers)
      
      const results: TestResults = {
        username: user.username,
        test_date: new Date().toISOString(),
        skill_scores: test.questions.reduce((scores, q, i) => {
          if (!scores[q.skill]) scores[q.skill] = []
          scores[q.skill].push(evaluationResults[i])
          return scores
        }, {} as Record<string, number[]>),
        skills_tested: Array.from(new Set(test.questions.map(q => q.skill))),
        questions: test.questions,
        answers: answers,
        difficulty: test.difficulty,
        mode: mode
      }

      // Calculate average scores for each skill
      Object.keys(results.skill_scores).forEach(skill => {
        const scores = results.skill_scores[skill]
        results.skill_scores[skill] = scores.reduce((a, b) => a + b, 0) / scores.length
      })

      // Record attempts for each question
      test.questions.forEach((question, index) => {
        recordQuestionAttempt(
          results.username,
          question.question,
          question.skill,
          evaluationResults[index] === 1,
          test.difficulty
        )
      })

      // Save to Supabase
      await saveTestResults(results)

      setTestResults(results)
      onTestComplete(results)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to evaluate test')
      console.error('Failed to evaluate test:', error)
    } finally {
      setEvaluating(false)
    }
  }

  const formatQuestion = (question: string) => {
    // Replace any text within square brackets with "___"
    return question.replace(/\[([^\]]+)\]/g, '___')
  }

  if (testResults) {
    return (
      <div className="space-y-6">
        <div className="bg-black/30 border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Test Results</h2>
          
          {/* Skill Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Skill Breakdown</h3>
            {Object.entries(testResults.skill_scores).map(([skill, score]) => (
              <div key={skill} className="flex justify-between items-center">
                <span className="text-gray-300">{skill}</span>
                <span className={score >= 0.7 ? 'text-green-400' : score >= 0.4 ? 'text-yellow-400' : 'text-red-400'}>
                  {(score * 100).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>

          {/* Question Review */}
          <div className="mt-8 space-y-6">
            <h3 className="text-lg font-semibold mb-4">Question Review</h3>
            {testResults.questions.map((q, qIndex) => {
              const userAnswer = testResults.answers[qIndex]
              const isCorrect = userAnswer === q.correctAnswer
              return (
                <div 
                  key={qIndex}
                  className={`p-4 rounded-lg ${
                    isCorrect 
                      ? 'bg-green-500/10 border border-green-400/20'
                      : 'bg-red-500/10 border border-red-400/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect 
                      ? <Check className="w-5 h-5 text-green-400" />
                      : <X className="w-5 h-5 text-red-400" />
                    }
                    <span className="text-sm text-gray-400">Question {qIndex + 1}</span>
                  </div>
                  <p className="mb-4">{formatQuestion(q.question)}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={`p-2 rounded ${
                          oIndex === q.correctAnswer
                            ? 'bg-green-500/20'
                            : oIndex === userAnswer && !isCorrect
                            ? 'bg-red-500/20'
                            : 'bg-black/20'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="mt-4 text-sm">
                      <span className="text-purple-300">Explanation: </span>
                      <span className="text-gray-300">{q.explanation}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Navigation Links */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setTestResults(null)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded transition"
            >
              Return to Test
            </button>
            <a
              href="/language/English"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded transition"
            >
              View History
            </a>
          </div>
        </div>
      </div>
    )
  }

  const progress = ((answers.filter(a => a !== -1).length) / test.questions.length) * 100

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="bg-black/30 border border-white/10 rounded-lg p-4">
        <div className="flex justify-between text-sm text-purple-200 mb-2">
          <div>
            <span>Question {currentQuestion + 1} of {test.questions.length}</span>
            <span className="ml-4">
              {mode === 'competitive' 
                ? `Difficulty: ${test.difficulty}` 
                : 'Learning Mode'}
            </span>
          </div>
          <span>Progress: {Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm text-purple-200 mt-2">
          Testing: {question.skill || 'General Knowledge'}
        </div>
      </div>

      {/* Question */}
      <div className="bg-black/30 border border-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {test.questions.length}</span>
            <span className="text-sm text-gray-400">{question.skill}</span>
          </div>
          <span className="text-sm text-gray-400">
            {mode === 'competitive' 
              ? `${test.difficulty} Difficulty` 
              : 'Learning Mode'}
          </span>
        </div>

        <p className="text-lg mb-6">{formatQuestion(question.question)}</p>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = answers[currentQuestion] === index
            const isCorrect = showExplanation !== null && index === question.correctAnswer
            const isWrong = showExplanation !== null && isSelected && !isCorrect

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showExplanation !== null}
                className={`w-full text-left p-4 rounded-md transition-all
                  ${isSelected
                    ? isWrong
                      ? 'bg-red-500/20 border border-red-400/30'
                      : 'bg-purple-500/20 border border-purple-400/30'
                    : 'bg-black/20 border border-white/5 hover:bg-black/30'}
                  ${isCorrect ? 'bg-green-500/20 border border-green-400/30' : ''}
                  ${showExplanation !== null ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {option}
                {isCorrect && showExplanation !== null && (
                  <span className="ml-2 text-green-400">✓</span>
                )}
                {isWrong && (
                  <span className="ml-2 text-red-400">✗</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Show explanation after answer is selected */}
        {showExplanation === currentQuestion && question.explanation && (
          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg">
            <div className="text-sm">
              <span className="text-purple-300">Explanation: </span>
              <span className="text-gray-300">{question.explanation}</span>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => navigateQuestion('prev')}
            disabled={currentQuestion === 0}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              currentQuestion === 0
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-purple-300 hover:text-purple-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          {currentQuestion < test.questions.length - 1 ? (
            <button
              onClick={() => navigateQuestion('next')}
              disabled={answers[currentQuestion] === -1}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                answers[currentQuestion] === -1
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-purple-300 hover:text-purple-200'
              }`}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answers.includes(-1) || evaluating}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                answers.includes(-1) || evaluating
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-green-400 hover:text-green-300'
              }`}
            >
              {evaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  Finish Test
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}
    </div>
  )
}

export default TestInterface