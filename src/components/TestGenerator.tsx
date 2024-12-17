import { useState } from 'react'
import { generateTest } from '../lib/gemini'
import { useNavigate } from 'react-router-dom'

interface Props {
  language: string
  skillsTested: string[]
  username: string
}

export default function TestGenerator({ language, skillsTested, username }: Props) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateTest = async () => {
    setLoading(true)
    setError(null)
    try {
      const test = await generateTest(
        language, 
        skillsTested, 
        username,
        'learning'
      )
      navigate('/test', { state: { test } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate test')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">      
      <button
        onClick={handleGenerateTest}
        disabled={loading}
        className={`px-4 py-2 rounded-md text-white ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {loading ? 'Generating...' : 'Generate Learning Test'}
      </button>
      
      {error && (
        <div className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  )
}