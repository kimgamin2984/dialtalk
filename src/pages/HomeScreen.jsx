import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import MicButton from '../components/MicButton.jsx'
import './HomeScreen.css'

export default function HomeScreen() {
  const {
    setScreen,
    requiredConsent,
    setRequiredConsent,
    learningConsent,
    setLearningConsent,
    setDialectText,
    nextDemoPhrase,
  } = useApp()

  const [typedText, setTypedText] = useState('')

  const canProceed = requiredConsent

  const startVoice = () => {
    if (!canProceed) return
    setDialectText('')
    setScreen('dialog')
  }

  const submitTyped = () => {
    if (!canProceed || !typedText.trim()) return
    setDialectText(typedText.trim())
    setScreen('result')
  }

  const fillDemoPhrase = () => {
    setTypedText(nextDemoPhrase())
  }

  return (
    <div className="home-screen">
      <div className="home-screen__brand">
        <div className="home-screen__logo" aria-hidden="true">
          다
        </div>
        <div>
          <h1 className="home-screen__title">다이얼톡</h1>
          <p className="home-screen__tagline">사투리와 마음을 잇다</p>
        </div>
      </div>

      <div className="lang-pair" role="group" aria-label="번역 언어 쌍">
        <span className="lang-pair__chip lang-pair__chip--active">경상도 사투리</span>
        <span className="lang-pair__arrow" aria-hidden="true">
          ⇄
        </span>
        <span className="lang-pair__chip">English</span>
      </div>

      <div className="home-screen__main">
        <MicButton
          recording={false}
          disabled={!canProceed}
          onClick={startVoice}
          label="누르고 말하기"
        />

        <div className="divider">
          <span />
          또는
          <span />
        </div>

        <div className="text-entry">
          <label htmlFor="dialect-input" className="sr-only">
            사투리를 직접 입력하세요
          </label>
          <textarea
            id="dialect-input"
            className="text-entry__input"
            placeholder="여기에 사투리를 직접 입력하세요..."
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            disabled={!canProceed}
            rows={2}
          />
          <div className="text-entry__actions">
            <button type="button" className="text-entry__demo" onClick={fillDemoPhrase} disabled={!canProceed}>
              예시 문장 채우기
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={submitTyped}
              disabled={!canProceed || !typedText.trim()}
            >
              번역하기
            </button>
          </div>
        </div>
      </div>

      <div className="consent-card">
        <p className="consent-card__notice">
          <span aria-hidden="true">!</span> 마이크 사용 및 외부 전송 동의 (필수)
        </p>
        <p className="consent-card__body">
          실시간 번역을 위해 음성이 외부 번역 엔진(gemini)으로 임시 전송되며, 처리 직후
          즉시 파기됩니다.
        </p>
        <label className="consent-card__checkbox">
          <input
            type="checkbox"
            checked={requiredConsent}
            onChange={(e) => setRequiredConsent(e.target.checked)}
          />
          동의합니다 (필수)
        </label>
        <label className="consent-card__checkbox consent-card__checkbox--optional">
          <input
            type="checkbox"
            checked={learningConsent}
            onChange={(e) => setLearningConsent(e.target.checked)}
          />
          번역 품질 개선을 위해 이 대화를 학습 데이터로 활용하는 것에 동의(선택)
        </label>
      </div>
    </div>
  )
}