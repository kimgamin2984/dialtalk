import { useCallback, useState } from 'react'

export function useSpeak() {
  const [speaking, setSpeaking] = useState(false)

  const speak = useCallback((text, lang = 'en-US') => {
    if (!('speechSynthesis' in window) || !text) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.95
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  return { speak, stop, speaking }
}