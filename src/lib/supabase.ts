import { createClient } from '@supabase/supabase-js'
import type { TestResults } from './gemini'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Test Results Management
export async function saveTestResults(results: TestResults) {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .insert([{
        ...results,
        created_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Error saving test results:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in saveTestResults:', error)
    throw error
  }
}

export async function getTestResults(username: string) {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching test results:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getTestResults:', error)
    throw error
  }
}

export async function syncLocalTestResults(username: string) {
  try {
    // Get local test results
    const localResults = JSON.parse(localStorage.getItem('testResults') || '[]')
    
    // Save any unsaved local results to Supabase
    for (const result of localResults) {
      if (result.username === username) {
        try {
          await saveTestResults(result)
        } catch (error) {
          console.error('Error syncing test result:', error)
        }
      }
    }

    // Get all results from Supabase
    const allResults = await getTestResults(username)

    // Update localStorage with all results
    localStorage.setItem('testResults', JSON.stringify(allResults))

    return allResults
  } catch (error) {
    console.error('Error during test results sync:', error)
    throw error
  }
}
