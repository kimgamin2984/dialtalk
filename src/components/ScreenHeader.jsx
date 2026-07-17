import './ScreenHeader.css'

export default function ScreenHeader({ title, onBack, backLabel = '홈으로' }) {
  return (
    <header className="screen-header">
      {onBack ? (
        <button type="button" className="screen-header__back" onClick={onBack}>
          <span aria-hidden="true">‹</span> {backLabel}
        </button>
      ) : (
        <span />
      )}
      {title && <span className="screen-header__title">{title}</span>}
    </header>
  )
}