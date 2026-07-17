import './DialectTag.css'

export default function DialectTag({ label = '경상도 사투리', text }) {
  return (
    <div className="dialect-tag" role="note" aria-label={`${label} 원문: ${text}`}>
      <span className="dialect-tag__hole" aria-hidden="true" />
      <span className="dialect-tag__label">{label}</span>
      <span className="dialect-tag__text">{text}</span>
    </div>
  )
}