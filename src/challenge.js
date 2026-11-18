// Challenge a friend — no accounts: everything needed travels in the link.
// The seed makes the friend play exactly the same version; the time limit keeps it fair.
import { DECISION_OPTIONS, maxScore } from './engine/game'

export function challengeLink({ scenarioId, seed, score, stars, seconds, from, number }, base = `${window.location.origin}${window.location.pathname}`) {
  const parts = [`wyzwanie=${scenarioId}`, `ziarno=${seed}`, `pkt=${score}`, `gw=${stars}`, `czas=${seconds}`]
  if (from) parts.push(`od=${encodeURIComponent(from)}`)
  if (number) parts.push(`nr=${number}`)
  return `${base}#${parts.join('&')}`
}

const int = (v) => (/^\d+$/.test(v ?? '') ? Number(v) : NaN)

/** Reads a challenge from the link; anything invalid → null (links can be edited by anyone). */
export function readChallenge(hash, scenarios) {
  const q = new URLSearchParams((hash ?? '').replace(/^#/, ''))
  const sc = scenarios.find((s) => s.id === q.get('wyzwanie'))
  if (!sc) return null
  const seed = int(q.get('ziarno'))
  const score = int(q.get('pkt'))
  const stars = int(q.get('gw'))
  if (!(seed >= 0 && seed < 2 ** 32) || !(score >= 0 && score <= maxScore(sc)) || !(stars >= 0 && stars <= 3)) return null
  const seconds = DECISION_OPTIONS.includes(int(q.get('czas'))) ? int(q.get('czas')) : 0
  const from = (q.get('od') ?? '').trim().slice(0, 12) || 'Kolega'
  const nr = int(q.get('nr'))
  return { scenarioId: sc.id, seed, score, stars, seconds, from, number: nr >= 1 && nr <= 99 ? nr : null }
}

export function challengeMessage({ from, scenarioTitle, score, link }) {
  return `${from || 'Kolega'} wyzywa cię w Świadomym Zawodniku! „${scenarioTitle}”: ${score} pkt. Pobijesz? ${link}`
}
