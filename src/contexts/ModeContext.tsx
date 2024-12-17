import { createContext, useContext, useState, useEffect } from 'react'

type Mode = 'learning'

interface ModeContextType {
  mode: Mode
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode] = useState<Mode>('learning')

  useEffect(() => {
    localStorage.setItem('gameMode', mode)
  }, [mode])

  return (
    <ModeContext.Provider value={{ mode }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const context = useContext(ModeContext)
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}
