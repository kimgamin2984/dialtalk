import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { runTranslation } from '../lib/mockTranslate.js'
import { useSpeak } from '../hooks/useSpeak.js'
import ScreenHeader from '../components/ScreenHeader.jsx'
import DialectTag from '../components/DialectTag.jsx'
import ReconfirmPopup from '../components/ReconfirmPopup.jsx'
import './ResultScreen.css'

export default function ResultScreen() {
  const { dialectText, setScreen, setDialectText } = useApp()
  const { speak, speaking } = useSpeak()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [reconfirmResolved, setReconfirmResolved] = useState(false)
  const [autoSpoken, setAutoSpoken] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setReconfirmResolved(false)
    setAutoSpoken(false)
    runTranslation(dialectText).then((res) => {
      if (!cancelled) {
        setData(res)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [dialectText])

  useEffect(() => {
    if (!loading && data && (!data.needs_reconfirmation || reconfirmResolved) && !autoSpoken) {
      speak(data.translated_text, 'en-US')
      setAutoSpoken(true)
    }
  }, [loading, data, reconfirmResolved, autoSpoken, speak])

  const goHome = () => {
    setDialectText('')
    setScreen('home')
  }

  const retry = () => {
    setDialectText('')
    setScreen('home')
  }

  return (
    <div className="result-screen">
      <ScreenHeader onBack={goHome} backLabel="홈으로" />

      <div className="result-screen__body">
        <section className="result-block">
          <p className="result-block__eyebrow">입력</p>
          <DialectTag text={dialectText} />
        </section>

        {loading && (
          <div className="result-screen__loading" role="status">
            <span className="spinner" aria-hidden="true" />
            표준어로 바꾸고 번역하는 중이에요...
          </div>
        )}

        {!loading && data && (
          <>
            <section className="result-block">
              <p className="result-block__eyebrow">표준어 변환</p>
              <p className="result-block__text">{data.standard_korean}</p>
            </section>

            <section className="result-block result-block--translation">
              <p className="result-block__eyebrow result-block__eyebrow--light">영어 번역</p>
              <p className="result-block__text result-block__text--light">{data.translated_text}</p>
              <button
                type="button"
                className="tts-button"
                onClick={() => speak(data.translated_text, 'en-US')}
              >
                <span aria-hidden="true">{speaking ? '🔊' : '🔈'}</span>
                {speaking ? '재생 중...' : '다시 듣기'}
              </button>
            </section>

            <div className="result-screen__confidence">
              신뢰도 {Math.round(data.confidence_score * 100)}%
              {data.confidence_score >= 0.9 && ' · 높음'}
            </div>

            <button type="button" className="btn btn--ghost" onClick={retry}>
              새로 말하기
            </button>
          </>
        )}
      </div>

      {!loading && data && data.needs_reconfirmation && !reconfirmResolved && (
        <ReconfirmPopup
          confidence={data.confidence_score}
          question={`"${data.standard_korean.split('(')[0].trim()}"가 맞습니까?`}
          onConfirm={() => setReconfirmResolved(true)}
          onCancel={retry}
        />
      )}
    </div>
  )
}