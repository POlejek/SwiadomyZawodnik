// Player progress kept in this browser (no accounts yet): spaced repetition, daily streak,
// medals for each principle, badges, XP and level. Pure functions take `today` (YYYY-MM-DD) so they are testable.
import { load, save } from './storage'

// Days until a stage comes back, by box (Leitner system): a mistake → box 0 → tomorrow.
export const INTERVALS = [1, 3, 7, 14, 30]
export const DAILY_SIZE = 5
export const DAILY_XP = 50

export const LEVELS = [
  { xp: 0, name: 'Debiutant' },
  { xp: 300, name: 'Talent' },
  { xp: 900, name: 'Zawodnik ligowy' },
  { xp: 2000, name: 'Kapitan' },
  { xp: 4000, name: 'Reprezentant' },
]

export const MEDALS = [
  { min: 5, id: 'gold', label: 'Złoto' },
  { min: 3, id: 'silver', label: 'Srebro' },
  { min: 1, id: 'bronze', label: 'Brąz' },
]

export const BADGES = {
  'pierwszy-krok': { icon: '👟', name: 'Pierwszy krok', text: 'Pierwsza decyzja na boisku.' },
  analityk: { icon: '🔍', name: 'Analityk', text: 'Obejrzałeś skutki wszystkich odpowiedzi w jednej sytuacji.' },
  blyskawica: { icon: '⚡', name: 'Błyskawica', text: 'Najlepsza decyzja w mniej niż 5 sekund.' },
  'trening-dnia': { icon: '📅', name: 'Trening dnia', text: 'Pierwszy ukończony trening dnia.' },
  'seria-3': { icon: '🔥', name: 'Seria 3 dni', text: 'Trening dnia 3 razy z rzędu.' },
  'seria-7': { icon: '🏆', name: 'Seria 7 dni', text: 'Trening dnia 7 razy z rzędu.' },
  komplet: { icon: '🧩', name: 'Komplet', text: 'Każda sytuacja rozegrana do końca.' },
  'zloty-zawodnik': { icon: '🥇', name: 'Złoty zawodnik', text: 'Złoty medal za 5 zasad.' },
}

export const emptyProgress = () => ({ xp: 0, items: {}, trainingDays: [], badges: {}, completed: {} })

export function loadProgress() {
  return { ...emptyProgress(), ...load('progress', {}) }
}

export function saveProgress(p) {
  save('progress', p)
}

export const todayISO = (d = new Date()) => {
  const z = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
}

export function addDays(iso, n) {
  const [y, m, d] = iso.split('-').map(Number)
  return todayISO(new Date(y, m - 1, d + n))
}

function daysBetween(a, b) {
  const [y1, m1, d1] = a.split('-').map(Number)
  const [y2, m2, d2] = b.split('-').map(Number)
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000)
}

export const itemKey = (scenarioId, stageId) => `${scenarioId}/${stageId}`

function grant(p, id, today, earned) {
  if (p.badges[id]) return p
  earned.push(id)
  return { ...p, badges: { ...p.badges, [id]: today } }
}

/**
 * A first-attempt decision. Returns { progress, earned } — `earned` lists badges won by this decision.
 * quality 3 = best (box up, comes back later), 0 = wrong (box 0, tomorrow), 1–2 = stays, tomorrow.
 */
export function recordDecision(progress, { scenarioId, stageId, quality, timeMs, points }, today) {
  const key = itemKey(scenarioId, stageId)
  const prev = progress.items[key] ?? { box: 0, plays: 0, best: 0 }
  const box = quality === 3 ? Math.min(prev.box + 1, INTERVALS.length - 1) : quality === 0 ? 0 : prev.box
  const due = addDays(today, quality === 3 ? INTERVALS[box] : 1)
  const item = { box, due, plays: prev.plays + 1, best: prev.best + (quality === 3 ? 1 : 0), last: today, lastQuality: quality }
  let p = { ...progress, xp: progress.xp + (points ?? 0), items: { ...progress.items, [key]: item } }
  const earned = []
  p = grant(p, 'pierwszy-krok', today, earned)
  if (quality === 3 && timeMs != null && timeMs < 5000) p = grant(p, 'blyskawica', today, earned)
  if (Object.values(p.items).filter((i) => medalFor(i)?.id === 'gold').length >= 5) p = grant(p, 'zloty-zawodnik', today, earned)
  return { progress: p, earned }
}

export function recordWhatIfAll(progress, today) {
  const earned = []
  return { progress: grant(progress, 'analityk', today, earned), earned }
}

export function recordScenarioComplete(progress, scenarioId, allScenarioIds, today) {
  let p = { ...progress, completed: { ...progress.completed, [scenarioId]: today } }
  const earned = []
  if (allScenarioIds.every((id) => p.completed[id])) p = grant(p, 'komplet', today, earned)
  return { progress: p, earned }
}

/** Training days in a row; one missed day in between does not break the streak. */
export function streak(progress, today) {
  const days = [...new Set(progress.trainingDays)].sort()
  if (!days.length || daysBetween(days[days.length - 1], today) > 2) return 0
  let n = 1
  for (let i = days.length - 1; i > 0; i--) {
    if (daysBetween(days[i - 1], days[i]) > 2) break
    n++
  }
  return n
}

export function recordTraining(progress, today) {
  let p = { ...progress, xp: progress.xp + DAILY_XP, trainingDays: [...new Set([...progress.trainingDays, today])] }
  const earned = []
  p = grant(p, 'trening-dnia', today, earned)
  const s = streak(p, today)
  if (s >= 3) p = grant(p, 'seria-3', today, earned)
  if (s >= 7) p = grant(p, 'seria-7', today, earned)
  return { progress: p, earned }
}

export const trainedToday = (progress, today) => progress.trainingDays.includes(today)

/** Stages that are due for a repeat today. */
export function dueItems(progress, today) {
  return Object.entries(progress.items)
    .filter(([, i]) => i.due <= today)
    .sort((a, b) => (a[1].due < b[1].due ? -1 : 1))
    .map(([k]) => k)
}

/**
 * Today's training: repeats that are due first, then stages never played, then the rest at random.
 * `catalog` is a list of { key, scenarioId, stageIndex }.
 */
export function pickDaily(progress, catalog, today, rand = Math.random, size = DAILY_SIZE) {
  const byKey = new Map(catalog.map((c) => [c.key, c]))
  const shuffled = (list) => list.map((x) => [rand(), x]).sort((a, b) => a[0] - b[0]).map(([, x]) => x)
  const due = dueItems(progress, today).filter((k) => byKey.has(k))
  const unseen = shuffled(catalog.filter((c) => !progress.items[c.key]).map((c) => c.key))
  const rest = shuffled(catalog.map((c) => c.key).filter((k) => !due.includes(k) && !unseen.includes(k)))
  return [...due, ...unseen, ...rest].slice(0, size).map((k) => ({ ...byKey.get(k), repeat: due.includes(k) }))
}

export function medalFor(item) {
  if (!item) return null
  return MEDALS.find((m) => item.best >= m.min) ?? null
}

export function level(xp) {
  let i = 0
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].xp) i++
  const cur = LEVELS[i]
  const next = LEVELS[i + 1]
  return { index: i, name: cur.name, xp, from: cur.xp, to: next?.xp ?? null, share: next ? (xp - cur.xp) / (next.xp - cur.xp) : 1 }
}

/** When a stage will come back, in words. */
export function comesBack(item, today) {
  if (!item) return ''
  const d = daysBetween(today, item.due)
  if (d <= 0) return 'dziś'
  if (d === 1) return 'jutro'
  return `za ${d} dni`
}
