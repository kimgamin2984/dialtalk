import './Waveform.css'

const BAR_WEIGHTS = [0.4, 0.7, 1, 0.55, 0.85, 0.3, 0.95, 0.5, 0.75, 0.45]

export default function Waveform({ level = 0, active = false }) {
  return (
    <div className={`waveform ${active ? 'waveform--active' : ''}`} aria-hidden="true">
      {BAR_WEIGHTS.map((w, i) => {
        const height = active ? 10 + Math.min(1, level * w * 1.6) * 46 : 10
        return <span key={i} className="waveform__bar" style={{ height: `${height}px` }} />
      })}
    </div>
  )
}