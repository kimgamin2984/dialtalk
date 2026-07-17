import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useAudioRecorder } from '../hooks/useAudioRecorder.js'
import ScreenHeader from '../components/ScreenHeader.jsx'
import Waveform from '../components/Waveform.jsx'
import './DialogScreen.css'

export default function DialogScreen() {
  const { setScreen, setDialectText, nextDemoPhrase } = useApp()
  const { isRecording, level, error, start, stop } = useAudioRecorder()
  const [phase, setPhase] = useState('idle')
  const [transcript, setTranscript] = useState('')
  const startedRef = useRef(false)

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true
      start().then(() => setPhase('recording'))
    }
    return () => stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const finishRecording = () => {
    stop()
    setPhase('recognizing')
    const recognized = nextDemoPhrase()

    let i = 0
    const iv = setInterval(() => {
      i += 1
      setTranscript(recognized.slice(0, i))
      if (i >= recognized.length) {
        clearInterval(iv)
        setPhase('done')
        setTimeout(() => {
          setDialectText(recognized)
          setScreen('result')
        }, 500)
      }
    }, 45)
  }

  const goBack = () => {
    stop()
    setScreen('home')
  }

  return (
    <div className="dialog-screen">
      <ScreenHeader onBack={goBack} />

      <div className="dialog-screen__body">
        {error && <p className="dialog-screen__error">{error}</p>}

        <p className="dialog-screen__status">
          {phase === 'recording' && '듣고 있어요...'}
          {phase === 'recognizing' && '방언을 인식하는 중이에요'}
          {phase === 'done' && '인식 완료'}
          {phase === 'idle' && '마이크를 준비하고 있어요...'}
        </p>

        <Waveform level={level} active={phase === 'recording'} />

        <div className="dialog-screen__transcript" aria-live="polite">
          {phase === 'recording' && (
            <span className="dialog-screen__transcript-hint">말씀하신 내용이 여기에 표시됩니다</span>
          )}
          {(phase === 'recognizing' || phase === 'done') && (
            <span>{transcript}</span>
          )}
        </div>
      </div>

      <div className="dialog-screen__footer">
        <button
          type="button"
          className="btn btn--marker"
          onClick={finishRecording}
          disabled={phase !== 'recording'}
        >
          완료
        </button>
      </div>
    </div>
  )
}