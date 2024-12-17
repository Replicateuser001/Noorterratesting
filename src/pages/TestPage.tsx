import { useLocation, useNavigate } from 'react-router-dom'
import TestInterface from '../components/TestInterface'
import type { Test, TestResults } from '../lib/gemini'

const TestPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const test = location.state?.test as Test | undefined

  const handleTestComplete = (results: TestResults) => {
    // After test completion, navigate back to the language page
    const language = test?.language || 'English'
    navigate(`/language/${language}`)
  }

  if (!test) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-black/30 border border-white/10 rounded-lg p-6 text-center">
          <div className="text-red-400 mb-2">Error: No test data available</div>
          <div className="text-sm text-gray-400">Please return to the language page and generate a new test</div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <TestInterface test={test} onTestComplete={handleTestComplete} />
      </div>
    </div>
  )
}

export default TestPage
