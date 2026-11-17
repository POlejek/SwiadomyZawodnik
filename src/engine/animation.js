// Animation engine: a clip only says where things GO; it always starts from the current world state.
// That keeps stages continuous — each answer's animation begins exactly where the previous one ended.
//
// World state: { players: { [id]: { x, y, pose } }, ball: { x, y, h, owner } }
// Clip: {
//   duration,                                  // seconds
//   tracks: { [playerId]: [{ t, x, y, pose? }] },// pose 'down' = lying (slide, dive, fall)
//   ball:   [{ t, on: playerId } | { t, x, y, arc?, ease? }], // arc = peak height (m) of the flight INTO this key;
//                                                             // ease: 'linear' keeps the speed constant (a pass split over two clips)
//   events: [{ t, text, tone?: 'info'|'good'|'bad', dur? }],
// }

const BALL_OFFSET = 1.0 // metres in front of the player's feet

const clamp01 = (u) => Math.min(1, Math.max(0, u))
const lerp = (a, b, u) => a + (b - a) * u
const easeIn = (u) => u * u
const easeOut = (u) => 1 - (1 - u) * (1 - u)
const easeInOut = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2)

/** Keys with the start position prepended when the clip does not set one at t = 0. */
function withStart(keys = [], start) {
  const sorted = [...keys].sort((a, b) => a.t - b.t)
  if (!start) return sorted
  if (sorted.length === 0 || sorted[0].t > 0) return [{ t: 0, ...start }, ...sorted]
  return sorted
}

/** Player position at time t. Accelerates out of the first key and decelerates into the last one. */
export function playerAt(keys, start, t) {
  const ks = withStart(keys, start)
  if (ks.length === 0) return { x: 0, y: 0, pose: undefined }
  if (t <= ks[0].t) return { x: ks[0].x, y: ks[0].y, pose: ks[0].pose }
  const last = ks[ks.length - 1]
  if (t >= last.t) return { x: last.x, y: last.y, pose: last.pose }
  let i = 0
  while (t > ks[i + 1].t) i++
  const k0 = ks[i]
  const k1 = ks[i + 1]
  const u = clamp01((t - k0.t) / (k1.t - k0.t))
  const first = i === 0
  const lastSeg = i === ks.length - 2
  const e = first && lastSeg ? easeInOut(u) : first ? easeIn(u) : lastSeg ? easeOut(u) : u
  return { x: lerp(k0.x, k1.x, e), y: lerp(k0.y, k1.y, e), pose: k0.pose }
}

// The team that plays towards the goal at the top of the screen (y = 0) keeps the ball in front of them, upwards.
// Default 'away': opponents attacking our goal. Attacking scenarios set `facingUp: 'home'` on the scenario.
function feet(entities, id, pos, facingUp = 'away') {
  const team = entities.find((e) => e.id === id)?.team ?? ''
  const dir = team === facingUp ? -1 : 1
  return { x: pos.x, y: pos.y + dir * BALL_OFFSET }
}

/** Whole world at time t of a clip that starts from `start`. */
export function stateAt(clip, start, entities, t, facingUp) {
  const players = {}
  for (const e of entities) {
    players[e.id] = playerAt(clip?.tracks?.[e.id], start.players[e.id], t)
  }
  const playerPos = (id, time) => playerAt(clip?.tracks?.[id], start.players[id], time)

  const ballStart = start.ball.owner ? { on: start.ball.owner } : { x: start.ball.x, y: start.ball.y }
  const keys = withStart(clip?.ball, ballStart)
  const resolve = (k, time) => (k.on ? feet(entities, k.on, playerPos(k.on, time), facingUp) : { x: k.x, y: k.y })

  let ball
  if (t <= keys[0].t) {
    ball = { ...resolve(keys[0], t), h: 0, owner: keys[0].on ?? null }
  } else if (t >= keys[keys.length - 1].t) {
    const last = keys[keys.length - 1]
    ball = { ...resolve(last, t), h: 0, owner: last.on ?? null }
  } else {
    let i = 0
    while (t > keys[i + 1].t) i++
    const k0 = keys[i]
    const k1 = keys[i + 1]
    if (k0.on && k0.on === k1.on) {
      ball = { ...resolve(k0, t), h: 0, owner: k0.on }
    } else {
      // Ball in flight: decelerates like a real pass, rises on a parabola when the key has an arc.
      const u = clamp01((t - k0.t) / (k1.t - k0.t))
      const p0 = resolve(k0, k0.t)
      const p1 = resolve(k1, k1.t)
      const e = k1.ease === 'linear' ? u : easeOut(u)
      ball = { x: lerp(p0.x, p1.x, e), y: lerp(p0.y, p1.y, e), h: (k1.arc ?? 0) * 4 * u * (1 - u), owner: null }
    }
  }
  return { players, ball }
}

/** World at the end of a clip — the starting point of whatever comes next. */
export function endState(clip, start, entities, facingUp) {
  if (!clip) return start
  const s = stateAt(clip, start, entities, clip.duration, facingUp)
  return { players: s.players, ball: { x: s.ball.x, y: s.ball.y, h: 0, owner: s.ball.owner } }
}

/** Events (captions) visible at time t. */
export function eventsAt(clip, t) {
  return (clip?.events ?? []).filter((ev) => t >= ev.t && t < ev.t + (ev.dur ?? 1.6))
}

/** Build the initial world state from a scenario's entity list. */
export function initialState(scenario) {
  const players = {}
  for (const e of scenario.entities) players[e.id] = { x: e.x, y: e.y, pose: undefined }
  const b = scenario.ball
  return {
    players,
    ball: b.on ? { ...feet(scenario.entities, b.on, players[b.on], scenario.facingUp), h: 0, owner: b.on } : { x: b.x, y: b.y, h: 0, owner: null },
  }
}
