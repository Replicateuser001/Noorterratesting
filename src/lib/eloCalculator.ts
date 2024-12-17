import { languages } from '../data/languages'
import { EloRange } from '../data/languages'

const INITIAL_ELO = 1000
const PROVISIONAL_K = 40
const REGULAR_K = 20
const EXPECTED_SCORE = 0.7
const MIN_ELO = 0
const MAX_ELO = 2000

// Difficulty multipliers for ELO changes
const DIFFICULTY_MULTIPLIERS = {
  easy: {
    gain: 0.5,    // Gain less ELO on easy mode
    loss: 1.5     // Lose more ELO on easy mode (shouldn't be losing on easy!)
  },
  normal: {
    gain: 1.0,    // Standard ELO changes
    loss: 1.0
  },
  hard: {
    gain: 1.5,    // Gain more ELO on hard mode
    loss: 0.75    // Lose less ELO on hard mode
  },
  expert: {
    gain: 2.0,    // Gain much more ELO on expert mode
    loss: 0.5     // Lose even less ELO on expert mode
  }
}

// Find skill's ELO range from languages data
export function getSkillEloRange(skillId: string): EloRange {
  for (const language of languages) {
    for (const path of language.paths || []) {
      for (const level of path.skills || []) {
        for (const pkg of level.skills || []) {
          // Check package skills
          if (pkg.skills) {
            for (const skill of pkg.skills) {
              if (skill.name === skillId && skill.eloRange) {
                return skill.eloRange
              }
            }
          }
          // Check package itself
          if (pkg.name === skillId && pkg.eloRange) {
            return pkg.eloRange
          }
        }
      }
    }
  }
  
  // Default range if not found
  return {
    min: 800,
    optimal: 1200,
    max: 1600,
    forms: {
      easy: ["Basic forms"],
      normal: ["Standard forms"],
      hard: ["Advanced forms"],
      expert: ["Expert forms"]
    }
  }
}

// Calculate ELO multiplier based on current ELO and skill's optimal range
function getEloMultiplier(currentElo: number, skillEloRange: EloRange) {
  if (currentElo < skillEloRange.min) {
    // Below minimum: much easier to gain points, much harder to lose them
    return {
      gainMultiplier: 2.0,
      lossMultiplier: 0.25
    }
  } else if (currentElo <= skillEloRange.optimal) {
    // In optimal range: slightly easier to gain than lose
    return {
      gainMultiplier: 1.25,
      lossMultiplier: 0.75
    }
  } else if (currentElo <= skillEloRange.max) {
    // Above optimal but below max: harder to gain, easier to lose
    return {
      gainMultiplier: 0.5,
      lossMultiplier: 1.5
    }
  } else {
    // Above max: extremely hard to gain, very easy to lose
    return {
      gainMultiplier: 0.1,
      lossMultiplier: 2.5
    }
  }
}

// Get K-factor based on attempts and current ELO
function getKFactor(attempts: number, currentElo: number): number {
  if (attempts < 10) {
    return PROVISIONAL_K
  }
  return REGULAR_K
}

// Calculate expected score based on ELO difference and current level
function getExpectedScore(currentElo: number, skillEloRange: EloRange): number {
  const difficultyLevel = getDifficultyLevel(currentElo, skillEloRange)
  
  // Adjust expected score based on difficulty level
  switch (difficultyLevel) {
    case 'easy':
      return EXPECTED_SCORE + 0.1
    case 'normal':
      return EXPECTED_SCORE
    case 'hard':
      return EXPECTED_SCORE - 0.05
    case 'expert':
      return EXPECTED_SCORE - 0.1
    default:
      return EXPECTED_SCORE
  }
}

// Calculate ELO change based on performance
export function calculateEloChange(
  currentElo: number,
  score: number,
  attempts: number,
  skillId: string,
  difficulty: 'easy' | 'normal' | 'hard' | 'expert'
): number {
  const skillEloRange = getSkillEloRange(skillId)
  const kFactor = getKFactor(attempts, currentElo)
  const { gainMultiplier, lossMultiplier } = getEloMultiplier(currentElo, skillEloRange)
  const expectedScore = getExpectedScore(currentElo, skillEloRange)
  
  // Calculate base ELO change
  let eloChange = kFactor * (score - expectedScore)
  
  // Apply skill-based multiplier
  eloChange *= eloChange > 0 ? gainMultiplier : lossMultiplier
  
  // Apply difficulty multiplier
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty]
  eloChange *= eloChange > 0 ? difficultyMultiplier.gain : difficultyMultiplier.loss
  
  // Ensure ELO stays within bounds
  const newElo = Math.max(MIN_ELO, Math.min(MAX_ELO, currentElo + eloChange))
  return newElo - currentElo
}

// Get difficulty level based on current ELO
export function getDifficultyLevel(currentElo: number, skillRange: EloRange): 'easy' | 'normal' | 'hard' | 'expert' {
  if (currentElo < skillRange.min) return 'easy'
  if (currentElo <= skillRange.optimal) return 'normal'
  if (currentElo <= skillRange.max) return 'hard'
  return 'expert'
}

// Get available forms for current ELO level
export function getAvailableForms(currentElo: number, skillId: string): string[] {
  const skillRange = getSkillEloRange(skillId)
  const level = getDifficultyLevel(currentElo, skillRange)
  return skillRange.forms[level]
}

// Normalize ELO to 0-1 range for display
export function normalizeElo(elo: number): number {
  const clampedElo = Math.max(MIN_ELO, elo)
  return Math.min(1, clampedElo / MAX_ELO)
}

// Get color based on ELO rating
export function getEloRankColor(elo: number): string {
  if (elo >= 2000) return 'text-yellow-400'      // Mythical
  if (elo >= 1800) return 'text-purple-500'      // Legendary
  if (elo >= 1500) return 'text-blue-400'        // Insane
  if (elo >= 1200) return 'text-cyan-400'        // Advanced
  if (elo >= 800) return 'text-green-400'        // Intermediate
  if (elo >= 400) return 'text-gray-400'         // Beginner
  if (elo >= 200) return 'text-orange-400'       // Novice
  return 'text-red-400'                          // Initiate
}

// Get rank title based on ELO
export function getEloRankTitle(elo: number): string {
  if (elo >= 2000) return 'Mythical'
  if (elo >= 1800) return 'Legendary'
  if (elo >= 1500) return 'Insane'
  if (elo >= 1200) return 'Advanced'
  if (elo >= 800) return 'Intermediate'
  if (elo >= 400) return 'Beginner'
  if (elo >= 200) return 'Novice'
  return 'Initiate'
}
