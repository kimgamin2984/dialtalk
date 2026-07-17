import { useCallback, useRef, useState } from 'react'

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [level, setLevel] = useState(0)
  const [error, setError] = useState(null)
  const [durationMs, setDurationMs] = useState(0)

  const mediaStreamRef = useRef(null)
  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const rafRef = useRef(null)
  const startTimeRef = useRef(0)
  const timerRef = useRef(null)

  const tick = useCallback(() => {
    const analyser = analyserRef.current
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteTimeDomainData(data)
    let sum = 0
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128
      sum += v * v
    }
    const rms = Math.sqrt(sum / data.length)
    setLevel(Math.min(1, rms * 4))
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const start = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const audioCtx = new AudioCtx()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 512
      source.connect(analyser)
      audioCtxRef.current = audioCtx
      analyserRef.current = analyser

      setIsRecording(true)
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        setDurationMs(Date.now() - startTimeRef.current)
      }, 100)
      rafRef.current = requestAnimationFrame(tick)
    } catch (err) {
      setError(
        err?.name === 'NotAllowedError'
          ? '마이크 권한이 거부되었습니다. 브라우저 설정에서 허용해 주세요.'
          : '마이크를 사용할 수 없습니다.'
      )
    }
  }, [tick])

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop())
      mediaStreamRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close()
      audioCtxRef.current = null
    }
    setIsRecording(false)
    setLevel(0)
  }, [])

  return { isRecording, level, error, durationMs, start, stop }
}