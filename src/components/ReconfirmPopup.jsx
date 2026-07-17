import { useEffect, useRef } from 'react'
import './ReconfirmPopup.css'

export default function ReconfirmPopup({ confidence, question, onConfirm, onCancel }) {
  const confirmRef = useRef(null)

  useEffect(() => {
    confirmRef.current?.focus()
  }, [])

  return (
    <div className="reconfirm-overlay">
      <div
        className="reconfirm-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="reconfirm-title"
      >
        <p id="reconfirm-title" className="reconfirm-card__title">
          <span aria-hidden="true">⚠️</span> 확인이 필요합니다 (신뢰도: {Math.round(confidence * 100)}%)
        </p>
        <p className="reconfirm-card__question">{question}</p>
        <div className="reconfirm-card__actions">
          <button ref={confirmRef} type="button" className="btn btn--primary" onClick={onConfirm}>
            예, 맞아요
          </button>
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            아니오, 다시 말할게요
          </button>
        </div>
      </div>
    </div>
  )
}