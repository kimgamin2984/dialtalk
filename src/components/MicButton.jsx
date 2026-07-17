import './MicButton.css'

export default function MicButton({ recording, level = 0, disabled, onClick, label }) {
  const ringScale = 1 + level * 0.5

  return (
    <div className="mic-button-wrap">
      {recording && (
        <span
          className="mic-button__ring"
          style={{ transform: `scale(${ringScale})` }}
          aria-hidden="true"
        />
      )}
      <button
        type="button"
        className={`mic-button ${recording ? 'mic-button--recording' : ''}`}
        onClick={onClick}
        disabled={disabled}
        aria-pressed={recording}
        aria-label={recording ? '녹음 중지' : '누르고 말하기'}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z"
            fill="currentColor"
          />
          <path
            d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.93V20H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-2.07A7 7 0 0 0 19 11Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <span className="mic-button__label">{label}</span>
    </div>
  )
}