import type { TestResults } from '../lib/gemini'

interface User {
  username: string
  displayName: string
  password: string
}

declare global {
  interface Window {}
}
