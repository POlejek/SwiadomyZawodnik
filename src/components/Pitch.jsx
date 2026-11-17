import { PITCH, TEAM_STYLE, VIEW } from '../engine/pitch'

const TONE = { good: '#4ade80', bad: '#f87171', info: '#e2e8f0' }

function PitchMarkings() {
  const P = PITCH
  const cx = P.width / 2
  const stripes = []
  for (let i = 0; i * 5.25 < VIEW.height + VIEW.y + 4; i++) {
    stripes.push(<rect key={i} x={VIEW.x} y={i * 5.25 - 5.25} width={VIEW.width} height={5.25} fill={i % 2 ? '#2c7a3b' : '#317f40'} />)
  }
  const arcDx = Math.sqrt(P.circleRadius ** 2 - (P.boxDepth - P.penaltySpot) ** 2)
  const line = { stroke: 'rgba(255,255,255,0.85)', strokeWidth: 0.2, fill: 'none' }
  return (
    <g>
      <rect x={VIEW.x} y={VIEW.y} width={VIEW.width} height={VIEW.height} fill="#2a7238" />
      {stripes}
      {/* goal net */}
      <rect x={cx - P.goalWidth / 2} y={-P.goalDepth} width={P.goalWidth} height={P.goalDepth} fill="url(#net)" stroke="#f8fafc" strokeWidth={0.25} />
      <rect x={0} y={0} width={P.width} height={P.length} {...line} />
      <rect x={cx - P.boxWidth / 2} y={0} width={P.boxWidth} height={P.boxDepth} {...line} />
      <rect x={cx - P.sixWidth / 2} y={0} width={P.sixWidth} height={P.sixDepth} {...line} />
      <circle cx={cx} cy={P.penaltySpot} r={0.25} fill="rgba(255,255,255,0.85)" />
      <path d={`M ${cx - arcDx} ${P.boxDepth} A ${P.circleRadius} ${P.circleRadius} 0 0 0 ${cx + arcDx} ${P.boxDepth}`} {...line} />
      <path d={`M ${cx - P.circleRadius} ${P.length} A ${P.circleRadius} ${P.circleRadius} 0 0 1 ${cx + P.circleRadius} ${P.length}`} {...line} />
      <circle cx={cx} cy={P.length} r={0.3} fill="rgba(255,255,255,0.85)" />
    </g>
  )
}

function Player({ entity, pos }) {
  const style = TEAM_STYLE[entity.team]
  const down = pos.pose === 'down'
  return (
    <g transform={`translate(${pos.x} ${pos.y})`} data-player={entity.id}>
      {entity.you && (
        <>
          <circle r={2.7} fill="none" stroke="#fde047" strokeWidth={0.35} className="you-ring" />
          {!down && (
            <g transform="translate(0 -3.7)">
              <rect x={-1.9} y={-0.95} width={3.8} height={1.9} rx={0.7} fill="#fde047" />
              <text textAnchor="middle" dominantBaseline="central" fontSize={1.3} fontWeight={800} fill="#1f2937">
                TY
              </text>
            </g>
          )}
        </>
      )}
      <ellipse cx={0.3} cy={0.5} rx={down ? 2.4 : 1.75} ry={down ? 1.25 : 1.45} fill="rgba(0,0,0,0.28)" />
      {down ? (
        <ellipse rx={2.3} ry={1.2} transform="rotate(-18)" fill={style.fill} stroke={style.stroke} strokeWidth={0.22} />
      ) : (
        <circle r={1.75} fill={style.fill} stroke={style.stroke} strokeWidth={0.25} />
      )}
      <text textAnchor="middle" dominantBaseline="central" fontSize={1.7} fontWeight={800} fill={style.text}>
        {entity.number}
      </text>
    </g>
  )
}

function Ball({ ball }) {
  const h = ball.h ?? 0
  return (
    <g data-ball>
      <ellipse cx={ball.x + 0.15} cy={ball.y + 0.3} rx={0.7} ry={0.35} fill="rgba(0,0,0,0.4)" />
      <circle cx={ball.x} cy={ball.y - h * 0.7} r={0.75 * (1 + h * 0.05)} fill="#ffffff" stroke="#111827" strokeWidth={0.14} />
      <circle cx={ball.x} cy={ball.y - h * 0.7} r={0.27 * (1 + h * 0.05)} fill="#111827" />
    </g>
  )
}

function point(ref, world) {
  if (typeof ref === 'string') {
    const p = world.players[ref]
    return [p.x, p.y]
  }
  return ref
}

function shape(h, world) {
  if (h.type === 'circle') {
    const [x, y] = h.at
    const r = h.r ?? 2.5
    return { x1: x, y1: y, x2: x, y2: y, mx: x, my: y, labelX: x, labelY: y - r - 0.9 }
  }
  const [x1, y1] = point(h.from, world)
  const [x2, y2] = point(h.to, world)
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  return { x1, y1, x2, y2, mx, my, labelX: mx + (h.labelDx ?? 0), labelY: my + (h.labelDy ?? -1.4) }
}

function HighlightShape({ h, world }) {
  const color = TONE[h.tone ?? 'info']
  const s = shape(h, world)
  if (h.type === 'circle') {
    return <circle cx={s.mx} cy={s.my} r={h.r ?? 2.5} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={0.3} strokeDasharray="0.8 0.6" />
  }
  return (
    <g>
      <line
        x1={s.x1}
        y1={s.y1}
        x2={s.x2}
        y2={s.y2}
        stroke={color}
        strokeWidth={0.4}
        strokeLinecap="round"
        strokeDasharray={h.dashed || h.type === 'cross' ? '1 0.8' : undefined}
        markerEnd={h.type === 'arrow' ? `url(#arrow-${h.tone ?? 'info'})` : undefined}
      />
      {h.type === 'cross' && (
        <g transform={`translate(${s.mx} ${s.my})`} stroke={color} strokeWidth={0.5} strokeLinecap="round">
          <line x1={-1} y1={-1} x2={1} y2={1} />
          <line x1={-1} y1={1} x2={1} y2={-1} />
        </g>
      )}
    </g>
  )
}

function HighlightLabel({ h, world }) {
  if (!h.label) return null
  const s = shape(h, world)
  return (
    <text x={s.labelX} y={s.labelY} textAnchor="middle" dominantBaseline="central" fontSize={1.5} fontWeight={800} fill={TONE[h.tone ?? 'info']} className="hl-label">
      {h.label}
    </text>
  )
}

const caption = (c, i) => (
  <span key={`${c.text}-${i}`} className={`caption caption-${c.tone ?? 'neutral'} ${c.text === 'GOL' ? 'caption-goal' : ''}`}>
    {c.text}
  </span>
)

/**
 * The pitch, players, ball and optional coaching drawings. Pure: draws exactly the `world` it is given.
 */
export default function Pitch({ entities, world, highlights = [], captions = [], className = '', label }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`}
        className="block w-full h-auto rounded-xl"
        role="img"
        aria-label={label ?? 'Boisko z sytuacją meczową'}
      >
        <defs>
          <pattern id="net" width="0.8" height="0.8" patternUnits="userSpaceOnUse">
            <path d="M0 0 L0.8 0.8 M0.8 0 L0 0.8" stroke="rgba(255,255,255,0.45)" strokeWidth="0.08" />
          </pattern>
          {Object.entries(TONE).map(([k, c]) => (
            <marker key={k} id={`arrow-${k}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill={c} />
            </marker>
          ))}
        </defs>
        <PitchMarkings />
        {highlights.map((h, i) => (
          <HighlightShape key={i} h={h} world={world} />
        ))}
        {entities.map((e) => (
          <Player key={e.id} entity={e} pos={world.players[e.id]} />
        ))}
        <Ball ball={world.ball} />
        {highlights.map((h, i) => (
          <HighlightLabel key={i} h={h} world={world} />
        ))}
      </svg>
      {/* Captions sit at the end of the pitch away from the ball, so they never hide the action. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center gap-2 pt-[2.5%]" aria-live="polite">
        {captions.filter((c) => c.pos !== 'bottom').map(caption)}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 pb-[5%]" aria-live="polite">
        {captions.filter((c) => c.pos === 'bottom').map(caption)}
      </div>
    </div>
  )
}
