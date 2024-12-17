import { BankQuestion, QuestionBank, UserQuestionData, UserQuestionHistory } from '../types/questionBank'
import { getSkillEloRange, getDifficultyLevel } from './eloCalculator'

// Local storage keys
const QUESTION_BANK_KEY = 'questionBank'
const USER_QUESTION_HISTORY_KEY = 'userQuestionHistory'
const QUESTION_ATTEMPTS_KEY = 'questionAttempts'

// Default forms if none are specified
const defaultForms = {
  easy: [
    "Basic sentence structure",
    "Simple present tense",
    "Common vocabulary usage"
  ],
  normal: [
    "Standard grammar patterns",
    "Present and past tense",
    "Basic word order"
  ],
  hard: [
    "Complex sentence structures",
    "Multiple tenses",
    "Advanced patterns"
  ],
  expert: [
    "Sophisticated grammar usage",
    "Complex tense combinations",
    "Rare grammatical forms"
  ]
}

// Load question bank from localStorage
function loadQuestionBank(): QuestionBank {
  const stored = localStorage.getItem(QUESTION_BANK_KEY)
  if (!stored) return {}
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

// Load user question history from localStorage
function loadUserHistory(): UserQuestionData {
  const stored = localStorage.getItem(USER_QUESTION_HISTORY_KEY)
  if (!stored) return {}
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

// Load question attempts from localStorage
function loadQuestionAttempts(): QuestionAttempt[] {
  const stored = localStorage.getItem(QUESTION_ATTEMPTS_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

// Save question bank to localStorage
function saveQuestionBank(bank: QuestionBank) {
  localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(bank))
}

// Save user history to localStorage
function saveUserHistory(history: UserQuestionData) {
  localStorage.setItem(USER_QUESTION_HISTORY_KEY, JSON.stringify(history))
}

// Save question attempts to localStorage
function saveQuestionAttempts(attempts: QuestionAttempt[]) {
  localStorage.setItem(QUESTION_ATTEMPTS_KEY, JSON.stringify(attempts))
}

// Add new questions to the bank
export function addQuestionsToBank(questions: BankQuestion[]): void {
  const bank = loadQuestionBank()

  // Group questions by skill
  for (const question of questions) {
    // Initialize skill in bank if it doesn't exist
    if (!bank[question.skill]) {
      bank[question.skill] = {
        questions: []
      }
    }

    // Add question if it doesn't already exist
    const existingQuestion = bank[question.skill].questions.find(
      q => q.question === question.question
    )
    if (!existingQuestion) {
      bank[question.skill].questions.push(question)
    }
  }

  // Save updated bank
  saveQuestionBank(bank)
}

// Get questions user hasn't seen for a skill
export function getUnattemptedQuestions(
  username: string,
  skill: string,
  count: number
): BankQuestion[] {
  const questionBank = loadQuestionBank()
  const history = loadUserHistory()
  
  // Initialize arrays to avoid undefined
  if (!questionBank[skill]) {
    questionBank[skill] = { questions: [] }
  }

  const skillQuestions = questionBank[skill].questions || []
  
  // If no questions available, return empty array
  if (skillQuestions.length === 0) {
    return []
  }

  // If no user history, all questions are unattempted
  if (!history[username] || !history[username].skills) {
    return shuffleArray([...skillQuestions]).slice(0, count)
  }

  // Find skill history
  const skillHistory = history[username].skills.find(s => s.skill === skill)
  if (!skillHistory || !skillHistory.questions) {
    return shuffleArray([...skillQuestions]).slice(0, count)
  }

  // Filter out questions that have been attempted
  const unattemptedQuestions = skillQuestions.filter(question => {
    const questionHistory = skillHistory.questions.find(q => q.question === question.question)
    return !questionHistory // Question is unattempted if no history exists
  })

  return shuffleArray(unattemptedQuestions).slice(0, count)
}

// Record user's attempt at a question
export function recordQuestionAttempt(
  username: string,
  question: string,
  skill: string,
  wasCorrect: boolean,
  difficulty: 'easy' | 'normal' | 'hard' | 'expert' = 'normal',
  mode: 'competitive' | 'learning' = 'competitive'
): void {
  const attempt: QuestionAttempt = {
    username,
    question,
    skill,
    success: wasCorrect,
    timestamp: new Date().toISOString(),
    mode,
    ...(mode === 'competitive' && { difficulty })
  }

  const attempts = loadQuestionAttempts()
  attempts.push(attempt)
  saveQuestionAttempts(attempts)
}

// Get stats about questions for a skill
export function getSkillQuestionStats(skillId: string) {
  const bank = loadQuestionBank()
  return {
    totalQuestions: bank[skillId]?.questions.length || 0,
    oldestQuestion: bank[skillId]?.questions.reduce((oldest, q) => 
      q.dateGenerated < oldest ? q.dateGenerated : oldest,
      new Date().toISOString()
    )
  }
}

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Get question history for a user
function getQuestionHistory(username: string): UserQuestionHistory | undefined {
  const history = loadUserHistory()
  return history[username]
}

// Get incorrectly answered questions for a user
export function getIncorrectlyAnsweredQuestions(
  username: string,
  skills: string[],
  count: number = 5
): BankQuestion[] {
  const questionBank = loadQuestionBank()
  const history = loadUserHistory()
  const userHistory = history[username]
  
  if (!userHistory || !questionBank) return []

  // Get questions that were answered incorrectly
  const incorrectQuestions: BankQuestion[] = []
  
  for (const skill of skills) {
    const skillQuestions = questionBank[skill]?.questions || []
    
    // Find questions that were last answered incorrectly
    for (const question of skillQuestions) {
      const questionHistory = userHistory.questions[question.question]
      if (questionHistory && questionHistory.attempts > 0) {
        // If the question exists in history and has attempts
        const skillAttempts = userHistory.skillAttempts[skill]
        if (skillAttempts && skillAttempts.attempts.length > 0) {
          const lastAttempt = skillAttempts.attempts[skillAttempts.attempts.length - 1]
          if (!lastAttempt.wasCorrect) {
            incorrectQuestions.push(question)
          }
        }
      }
    }
  }

  // Shuffle and return requested number
  return shuffleArray(incorrectQuestions).slice(0, count)
}

// Get skill progress for a user
export function getSkillProgress(username: string, skill: string, mode: 'competitive' | 'learning'): number {
  const attempts = loadQuestionAttempts()
  const userAttempts = attempts.filter(a => 
    a.username === username && 
    a.skill === skill && 
    a.mode === mode
  )

  if (mode === 'learning') {
    // Get last 20 attempts
    const last20Attempts = userAttempts.slice(-20)
    const successfulTests = last20Attempts.filter(a => a.success).length

    // Check last 3 attempts are successful
    const last3Attempts = userAttempts.slice(-3)
    const last3Successful = last3Attempts.length === 3 && 
      last3Attempts.every(a => a.success)

    return successfulTests >= 10 && last3Successful ? 1 : 
      Math.min(successfulTests / 10, 0.9)  // Cap at 90% until last 3 are successful
  } else {
    // For competitive mode, return raw success rate
    if (userAttempts.length === 0) return 0
    return userAttempts.filter(a => a.success).length / userAttempts.length
  }
}

// Check if skill is complete for a user
export function isSkillComplete(username: string, skill: string, mode: 'competitive' | 'learning'): boolean {
  if (mode === 'learning') {
    const attempts = loadQuestionAttempts()
    const userAttempts = attempts.filter(a => 
      a.username === username && 
      a.skill === skill && 
      a.mode === mode
    )

    // Get last 20 attempts
    const last20Attempts = userAttempts.slice(-20)
    const successfulTests = last20Attempts.filter(a => a.success).length

    // Check last 3 attempts are successful
    const last3Attempts = userAttempts.slice(-3)
    const last3Successful = last3Attempts.length === 3 && 
      last3Attempts.every(a => a.success)

    return successfulTests >= 10 && last3Successful
  } else {
    // For competitive mode, skill is never "complete" - it's always competitive
    return false
  }
}

// Get unattempted questions for a user
export function getUnattemptedQuestionsForUser(username: string, skills: string[]): BankQuestion[] {
  const attempts = loadQuestionAttempts()
  const questionBank = loadQuestionBank()
  
  const attemptedQuestions = new Set(
    attempts
      .filter((a: QuestionAttempt) => a.username === username)
      .map((a: QuestionAttempt) => a.question)
  )

  return questionBank.questions.filter((q: BankQuestion) => 
    !attemptedQuestions.has(q.question) && 
    skills.includes(q.skill)
  )
}

// Get incorrectly answered questions for a user
export function getIncorrectlyAnsweredQuestionsForUser(username: string, skills: string[]): BankQuestion[] {
  const attempts = loadQuestionAttempts()
  const questionBank = loadQuestionBank()
  
  const incorrectQuestions = new Set(
    attempts
      .filter((a: QuestionAttempt) => a.username === username && !a.success)
      .map((a: QuestionAttempt) => a.question)
  )

  return questionBank.questions.filter((q: BankQuestion) => 
    incorrectQuestions.has(q.question) && 
    skills.includes(q.skill)
  )
}

interface QuestionAttempt {
  username: string
  question: string
  skill: string
  success: boolean
  timestamp: string
  mode: 'competitive' | 'learning'
  difficulty?: string  // Only used in competitive mode
}
