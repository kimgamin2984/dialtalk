import { createContext, useContext, useMemo, useState } from 'react'

const AppContext = createContext(null)

const DEMO_PHRASES = [
  '단디 보소, 오천 원이라예.',
  '그거 매끼놔라.',
  '단디 보소, 이거 원래 삼만 원인데 오천 원 처가 이만 오천 원만 주이소.',
]

export function AppProvider({ children }) {
  const [screen, setScreen] = useState('home')
  const [requiredConsent, setRequiredConsent] = useState(false)
  const [learningConsent, setLearningConsent] = useState(false)
  const [dialectText, setDialectText] = useState('')
  const [result, setResult] = useState(null)
  const [demoIndex, setDemoIndex] = useState(0)

  const nextDemoPhrase = () => {
    const phrase = DEMO_PHRASES[demoIndex % DEMO_PHRASES.length]
    setDemoIndex((i) => i + 1)
    return phrase
  }

  const value = useMemo(
    () => ({
      screen,
      setScreen,
      requiredConsent,
      setRequiredConsent,
      learningConsent,
      setLearningConsent,
      dialectText,
      setDialectText,
      result,
      setResult,
      nextDemoPhrase,
    }),
    [screen, requiredConsent, learningConsent, dialectText, result, demoIndex]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}