import { forwardRef } from 'react'
import { ATTRS } from '../card'

// Card look per tier: background gradient stops, text colour, accent.
const LOOK = {
  brazowa: { stops: ['#4a2c14', '#c4844a', '#6e4220'], text: '#1c1006', soft: 'rgba(28,16,6,0.55)', line: 'rgba(28,16,6,0.25)', shine: 0.25 },
  srebrna: { stops: ['#5d6878', '#e9eef5', '#7f8a9a'], text: '#121821', soft: 'rgba(18,24,33,0.55)', line: 'rgba(18,24,33,0.2)', shine: 0.35 },
  zlota: { stops: ['#7a560a', '#ffe48f', '#a97c17'], text: '#1d1503', soft: 'rgba(29,21,3,0.55)', line: 'rgba(29,21,3,0.22)', shine: 0.45 },
  elita: { stops: ['#070b16', '#16213b', '#0a1020'], text: '#f4f7fb', soft: 'rgba(244,247,251,0.6)', line: 'rgba(200,240,74,0.35)', shine: 0.5, holo: true },
}

const SHAPE = 'M22,44 Q22,22 44,20 L112,13 Q150,2 188,13 L256,20 Q278,22 278,44 L278,348 Q278,370 258,378 L162,410 Q150,415 138,410 L42,378 Q22,370 22,348 Z'

/** The player's own card (SVG, so it scales crisply and exports to an image). */
const PlayerCard = forwardRef(function PlayerCard({ card, name, number, shirt, className = '', idPrefix = 'pc' }, ref) {
  const look = LOOK[card.tier.id]
  const g = `${idPrefix}-${card.tier.id}`
  const attrs = ATTRS.map((a) => [a.key, card.attrs[a.key].value])
  const displayName = (name?.trim() || 'Zawodnik').toUpperCase().slice(0, 12)
  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420" className={className} role="img" aria-label={`Karta zawodnika: ocena ${card.overall}, ${card.tier.label}`}>
      <defs>
        <linearGradient id={`${g}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={look.stops[0]} />
          <stop offset="0.5" stopColor={look.stops[1]} />
          <stop offset="1" stopColor={look.stops[2]} />
        </linearGradient>
        <linearGradient id={`${g}-shine`} x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(25)">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity={look.shine} />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${g}-holo`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c8f04a" />
          <stop offset="0.5" stopColor="#57c7ff" />
          <stop offset="1" stopColor="#c8f04a" />
        </linearGradient>
        <clipPath id={`${g}-clip`}>
          <path d={SHAPE} />
        </clipPath>
      </defs>

      <path d={SHAPE} fill={`url(#${g}-bg)`} />
      <g clipPath={`url(#${g}-clip)`}>
        {/* fine diagonal texture */}
        {Array.from({ length: 18 }, (_, i) => (
          <line key={i} x1={-60 + i * 26} y1="0" x2={60 + i * 26} y2="420" stroke={look.line} strokeWidth="0.6" opacity="0.5" />
        ))}
        <rect x="-300" y="0" width="200" height="420" fill={`url(#${g}-shine)`} className="card-shine" />
      </g>
      <path d={SHAPE} fill="none" stroke={look.holo ? `url(#${g}-holo)` : look.line} strokeWidth={look.holo ? 3 : 2} />

      {/* rating and position */}
      <text x="76" y="90" textAnchor="middle" fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif" fontWeight="900" fontSize="50" fill={look.holo ? '#c8f04a' : look.text}>
        {card.overall}
      </text>
      <text x="76" y="116" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="19" letterSpacing="1.5" fill={look.text}>
        {card.position}
      </text>
      <rect x="54" y="130" width="44" height="28" rx="6" fill={shirt.fill} stroke={look.line} />
      <text x="76" y="150" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="17" fill={shirt.text}>
        {number || '?'}
      </text>

      {/* player silhouette in the shirt colour */}
      <g transform="translate(176 150)">
        <ellipse cx="0" cy="76" rx="62" ry="10" fill="rgba(0,0,0,0.18)" />
        <path d="M-62,74 Q-60,20 -26,12 L-14,8 Q0,22 14,8 L26,12 Q60,20 62,74 Z" fill={shirt.fill} stroke={look.line} />
        <path d="M-14,8 Q0,22 14,8" fill="none" stroke={shirt.text} strokeOpacity="0.5" strokeWidth="3" />
        <rect x="-9" y="-6" width="18" height="16" rx="5" fill="#c99a78" />
        <ellipse cx="0" cy="-30" rx="25" ry="29" fill="#d9a882" />
        <path d="M-25,-36 Q-24,-62 0,-62 Q24,-62 25,-36 Q14,-48 0,-46 Q-14,-48 -25,-36 Z" fill="#2b1d12" />
        <text x="0" y="56" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="26" fill={shirt.text} opacity="0.9">
          {number || ''}
        </text>
      </g>

      {card.inForm && (
        <g transform="translate(228 46)">
          <rect x="-40" y="-13" width="80" height="24" rx="12" fill="#c8f04a" />
          <text x="0" y="4" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="12" letterSpacing="1" fill="#0b1220">
            W FORMIE
          </text>
        </g>
      )}

      {/* name */}
      <line x1="48" y1="240" x2="252" y2="240" stroke={look.line} strokeWidth="1.5" />
      <text x="150" y="270" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="26" letterSpacing="1" fill={look.text}>
        {displayName}
      </text>
      <line x1="48" y1="284" x2="252" y2="284" stroke={look.line} strokeWidth="1.5" />

      {/* six skills in two columns */}
      {attrs.map(([key, value], i) => {
        const col = i % 2
        const row = Math.floor(i / 2)
        const x = col ? 172 : 62
        const y = 314 + row * 28
        return (
          <g key={key}>
            <text x={x} y={y} fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="21" fill={look.holo ? '#ffffff' : look.text}>
              {value}
            </text>
            <text x={x + 34} y={y} fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="16" letterSpacing="1" fill={look.soft}>
              {key}
            </text>
          </g>
        )
      })}
      <line x1="150" y1="296" x2="150" y2="372" stroke={look.line} strokeWidth="1.5" />
      <text x="150" y="392" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="10" letterSpacing="2" fill={look.soft}>
        {card.tier.label.toUpperCase()}
      </text>
    </svg>
  )
})

export default PlayerCard

/** PNG of the card (2× size) — for sharing on a phone or saving. */
export function cardToPng(svg) {
  return new Promise((resolve, reject) => {
    const xml = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = 600
      c.height = 840
      c.getContext('2d').drawImage(img, 0, 0, 600, 840)
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('Nie udało się utworzyć obrazka'))), 'image/png')
    }
    img.onerror = reject
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`
  })
}
