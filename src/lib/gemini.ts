import { GoogleGenerativeAI } from '@google/generative-ai'
import { languages } from '../data/languages'
import { getUnattemptedQuestions, addQuestionsToBank, getIncorrectlyAnsweredQuestions } from './questionBank'
import { getSkillEloRange } from './eloCalculator'
import { CompetitiveDifficulty, Difficulty } from '../types/questionBank'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const generationConfig: GenerationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

interface Question {
  question: string
  options: string[]
  skill: string  // Track which skill this question tests
  correctAnswer?: number  // Index of the correct answer in options
  explanation?: string  // Add explanation field
  mode?: 'competitive' | 'learning'
  difficulty?: CompetitiveDifficulty
  learningPoint?: string
}

export interface Test {
  language: string
  skillsTested: string[]
  questions: Question[]
  difficulty: Difficulty
  username: string
  mode: 'learning'
}

export interface TestResults {
  username: string
  test_date: string
  skill_scores: Record<string, number>
  skills_tested: string[]
  questions: Question[]
  answers: number[]
  difficulty: Difficulty
  mode: 'learning'
}

interface SkillConfig {
  name: string
  description: string
  competitiveForms: {
    easy: SkillForm[]
    normal: SkillForm[]
    hard: SkillForm[]
    expert: SkillForm[]
  }
  learningPoints: LearningPoint[]
}

interface SkillForm {
  name: string
  description: string
  examples: string[]
}

interface LearningPoint {
  name: string
  forms: SkillForm[]
}

interface EloRange {
  min: number
  optimal: number
  max: number
  forms: {
    easy: string[]
    normal: string[]
    hard: string[]
    expert: string[]
  }
}

// Helper functions for skill config
const convertToSkillConfig = (skill: any): SkillConfig => {
  return {
    name: skill.name,
    description: skill.name, // Using name as description if not provided
    competitiveForms: {
      easy: skill.eloRange.forms.easy.map((form: string) => ({
        name: form,
        description: form,
        examples: []
      })),
      normal: skill.eloRange.forms.normal.map((form: string) => ({
        name: form,
        description: form,
        examples: []
      })),
      hard: skill.eloRange.forms.hard.map((form: string) => ({
        name: form,
        description: form,
        examples: []
      })),
      expert: skill.eloRange.forms.expert.map((form: string) => ({
        name: form,
        description: form,
        examples: []
      }))
    },
    learningPoints: []
  }
}

const findSkillConfig = (skillName: string): SkillConfig | null => {
  const language = languages.find(l => l.skills.some(s => s.name === skillName))
  if (!language) return null
  const skill = language.skills.find(s => s.name === skillName)
  if (!skill) return null
  return convertToSkillConfig(skill)
}

const getDifficultyLevel = (userElo: number, skillRange: EloRange): string => {
  if (userElo <= skillRange.min) return 'easy'
  if (userElo <= skillRange.optimal) return 'normal'
  if (userElo <= skillRange.max) return 'hard'
  return 'expert'
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

const getSkillDisplayName = (skill: string): string => {
  const skillConfig = findSkillConfig(skill)
  if (!skillConfig) return skill
  return skillConfig.name
}

const getDefaultDifficultyDesc = (level: string): string => {
  switch (level) {
    case 'easy':
      return 'Basic concepts and simple patterns'
    case 'normal':
      return 'Standard usage and common patterns'
    case 'hard':
      return 'Advanced concepts and complex patterns'
    case 'expert':
      return 'Expert-level usage and rare patterns'
    default:
      return 'Unknown difficulty level'
  }
}

async function generateQuestionsForSkill(
  language: string, 
  skill: string, 
  mode: 'learning',
  distribution?: { point: string; count: number }[]
): Promise<Question[]> {
  try {
    console.log('Generating questions for skill:', skill, 'mode:', mode, 'distribution:', distribution)
    
    const skillConfig = findSkillConfig(skill)
    if (!skillConfig) {
      throw new Error(`Skill "${skill}" not found`)
    }

    // Create form descriptions based on distribution
    const formDescriptions = distribution
      ?.map(({ point }) => {
        const learningPoint = skillConfig.learningPoints.find(p => p.name === point)
        if (!learningPoint) return ''
        return learningPoint.forms
          .map(form => `${point} - ${form.name}\n   ${form.description}\n   Examples: ${form.examples.join(', ')}`)
          .join('\n- ')
      })
      .filter(desc => desc !== '')
      .join('\n- ')

    const prompt = `Generate exactly 5 multiple choice questions for skill "${skill}".
Generate questions according to this distribution:
${distribution?.map(d => `- ${d.count} question(s) testing ${d.point}`).join('\n')}

Grammar Forms to Test:
- ${formDescriptions}

CRITICAL FORMAT REQUIREMENTS:
1. Put ONLY ONE WORD in [square brackets] - the word that should be replaced:
   CORRECT: She [goes] to school every day.
   WRONG: She _____ to school.         // Don't use underscores

2. The word in [brackets] MUST EXACTLY MATCH one of the four options (A, B, C, D):
   CORRECT:
   Question: She [goes] to school every day.
   A) go
   B) goes    // "goes" matches exactly what's in brackets
   C) went
   D) going

3. Question Must always include keywords that makes clarify the tense of the sentece, like "yesterday, everyday, tomorrow, just now, right now" etc.

Format each question EXACTLY as follows:
Question: She [goes] to school every day.
A) go
B) goes
C) went
D) going
Explanation: "Goes" is correct because we use the third-person singular form in present simple.

IMPORTANT:
1. Generate exactly 5 questions, numbered as "Question 1:", "Question 2:", etc.
2. Follow the distribution specified above for each learning point.
3. Make sure each question clearly tests its assigned learning point.

Requirements:
1. Each question must test its assigned learning point above.
2. Include 4 options (A, B, C, D) for each question.
3. ONE of the options must EXACTLY match the word in brackets.
4. Provide a brief explanation after "Explanation:" for why the answer is correct.
5. The explanation should reference the specific grammar form being tested.
6. Only ONE word in brackets. Do not use underscores.
`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    const questions = await parseQuestionsFromText(text, skill)
    
    // Map questions to their learning points based on distribution
    return questions.map((q, index) => {
      // Find which learning point this question belongs to based on distribution
      let pointIndex = 0;
      let questionCount = 0;
      for (let i = 0; i < (distribution?.length || 0); i++) {
        questionCount += distribution![i].count;
        if (index < questionCount) {
          pointIndex = i;
          break;
        }
      }
      
      return {
        ...q,
        mode,
        learningPoint: distribution![pointIndex].point
      }
    })
  } catch (error) {
    console.error('Error generating questions:', error)
    throw error
  }
}

export async function generateTest(
  language: string,
  skillsTested: string[],
  username: string,
  mode: 'learning'
): Promise<Test> {
  console.log('Generating test with params:', { language, skillsTested, username, mode })

  try {
    const languageConfig = languages.find(l => l.name === language)
    if (!languageConfig) {
      throw new Error(`Language "${language}" not found`)
    }
    console.log('Language config found:', language)

    const allQuestions: Question[] = []
    const TOTAL_QUESTIONS = 5

    // For each skill, get all learning points
    for (const skill of skillsTested) {
      const skillConfig = findSkillConfig(skill)
      if (!skillConfig) continue

      // Get all available learning points
      const availablePoints = skillConfig.learningPoints.map(p => p.name)
      
      // Randomly distribute 5 questions among learning points
      const distribution = generateRandomDistribution(availablePoints, TOTAL_QUESTIONS)
      
      const questions = await generateQuestionsForSkill(
        language,
        skill,
        mode,
        distribution
      )
      allQuestions.push(...questions)
    }

    // Shuffle all questions
    const shuffledQuestions = shuffleArray(allQuestions)

    return {
      language,
      skillsTested,
      questions: shuffledQuestions.slice(0, TOTAL_QUESTIONS),
      difficulty: 'learn',
      username,
      mode
    }
  } catch (error) {
    console.error('Error in generateTest:', error)
    throw error
  }
}

// Helper function to generate random distribution of questions
function generateRandomDistribution(points: string[], totalQuestions: number): { point: string; count: number }[] {
  if (points.length === 0) return []
  if (points.length === 1) return [{ point: points[0], count: totalQuestions }]

  // Initialize distribution with 0 count for each point
  const distribution = points.map(point => ({ point, count: 0 }))
  
  // Randomly assign questions to points
  for (let i = 0; i < totalQuestions; i++) {
    const randomIndex = Math.floor(Math.random() * points.length)
    distribution[randomIndex].count++
  }

  // Filter out points with 0 questions
  return distribution.filter(d => d.count > 0)
}

async function parseQuestionsFromText(text: string, skill: string): Promise<Question[]> {
  const questions: Question[] = []
  const questionBlocks = text.split(/Question \d+:/).filter(block => block.trim())

  for (const block of questionBlocks) {
    try {
      // Extract question text
      const questionMatch = block.match(/([^\n]+)\n/)
      if (!questionMatch) continue
      let questionText = questionMatch[1].trim()

      // Extract options
      const options: string[] = []
      const optionMatches = block.match(/[A-D]\) [^\n]+/g)
      if (!optionMatches || optionMatches.length !== 4) continue

      for (const option of optionMatches) {
        options.push(option.replace(/^[A-D]\) /, '').trim())
      }

      // Extract correct answer from question text
      const bracketMatch = questionText.match(/\[([^\]]+)\]/)
      if (!bracketMatch) continue
      const correctWord = bracketMatch[1]

      // Find correct answer index
      const correctAnswer = options.findIndex(option => option === correctWord)
      if (correctAnswer === -1) continue

      // Extract explanation
      const explanationMatch = block.match(/Explanation: ([^\n]+)/)
      const explanation = explanationMatch ? explanationMatch[1].trim() : ''

      // Remove brackets from question text for display
      questionText = questionText.replace(/\[([^\]]+)\]/, '$1')

      questions.push({
        question: questionText,
        options,
        correctAnswer,
        explanation,
        skill
      })
    } catch (error) {
      console.error('Error parsing question block:', error)
      continue
    }
  }

  return questions
}

export async function evaluateTest(test: Test, userAnswers: number[]): Promise<number[]> {
  const correctAnswers = test.questions.map(q => q.correctAnswer || 0)
  const scores: number[] = []

  for (let i = 0; i < correctAnswers.length; i++) {
    const isCorrect = userAnswers[i] === correctAnswers[i]
    scores.push(isCorrect ? 1 : 0)
  }

  return scores
}
