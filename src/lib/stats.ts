import type { TestResults } from './gemini'

export interface SkillStats {
  skillId: string
  completionPercentage: number
  recentTests: number[]  // Last 15 test scores
  allTestScores: number[]  // All historical test scores
  isCompleted: boolean
}

export interface LearningStats {
  overallCompletion: number
  skillStats: Record<string, SkillStats>
}

export function calculateSkillCompletion(recentTests: number[]): number {
  const perfectScores = recentTests.filter(score => score === 100).length
  return (perfectScores / 15) * 100
}

export function isSkillCompleted(recentTests: number[]): boolean {
  return recentTests.filter(score => score === 100).length >= 10
}

export function calculateOverallCompletion(skillStats: Record<string, SkillStats>): number {
  const skills = Object.values(skillStats)
  if (skills.length === 0) return 0
  
  const completedSkills = skills.filter(skill => skill.isCompleted).length
  return (completedSkills / skills.length) * 100
}

export function updateSkillStats(
  currentStats: SkillStats,
  newScore: number
): SkillStats {
  const updatedRecentTests = [newScore, ...currentStats.recentTests].slice(0, 15)
  const updatedAllTests = [...currentStats.allTestScores, newScore]
  
  return {
    ...currentStats,
    recentTests: updatedRecentTests,
    allTestScores: updatedAllTests,
    completionPercentage: calculateSkillCompletion(updatedRecentTests),
    isCompleted: isSkillCompleted(updatedRecentTests)
  }
}

export function initializeSkillStats(skillId: string): SkillStats {
  return {
    skillId,
    completionPercentage: 0,
    recentTests: [],
    allTestScores: [],
    isCompleted: false
  }
}
