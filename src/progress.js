// Player progress kept in this browser (no accounts yet): spaced repetition, a weekly goal,
// medals for each principle, badges, XP and level. Pure functions take `today` (YYYY-MM-DD) so they are testable.
import { load, save } from './storage'

// Days until a stage comes back, by box (Leitner system): a mistake → box 0 → tomorrow.
export const INTERVALS = [1, 3, 7, 14, 30]
export const DAILY_SIZE = 5
export const DAILY_XP = 50
// Weekly goal instead of a daily streak: nothing is ever lost, every Monday starts fresh,
// and it fits a young player's week (club training, matches, school).
export const WEEKLY_GOAL = 3

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
  'pelny-tydzien': { icon: '✅', name: 'Pełny tydzień', text: `Cel tygodnia: ${WEEKLY_GOAL} treningi dnia w jednym tygodniu.` },
  'cztery-tygodnie': { icon: '🏆', name: '4 pełne tygodnie', text: 'Cel tygodnia osiągnięty w 4 tygodniach (nie muszą być pod rząd).' },
  komplet: { icon: '🧩', name: 'Komplet', text: 'Każda sytuacja rozegrana do końca.' },
  wyzwanie: { icon: '📨', name: 'Rzucona rękawica', text: 'Pierwsze wyzwanie wysłane koledze.' },
  'pojedynek-wygrany': { icon: '⚔️', name: 'Wygrany pojedynek', text: 'Pobiłeś wynik kolegi z wyzwania.' },
  'zloty-zawodnik': { icon: '🥇', name: 'Złoty zawodnik', text: 'Złoty medal za 5 zasad.' },
}

export const emptyProgress = () => ({ xp: 0, items: {}, trainingDays: [], badges: {}, completed: {}, attrPoints: {}, cardBest: {} })

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
export function recordDecision(progress, { scenarioId, stageId, quality, timeMs, points, attrs }, today) {
  const key = itemKey(scenarioId, stageId)
  const prev = progress.items[key] ?? { box: 0, plays: 0, best: 0, bestDays: 0 }
  const box = quality === 3 ? Math.min(prev.box + 1, INTERVALS.length - 1) : quality === 0 ? 0 : prev.box
  const due = addDays(today, quality === 3 ? INTERVALS[box] : 1)
  // Medals count DAYS with a best decision, so they reward remembering, not replaying one evening.
  const newBestDay = quality === 3 && prev.lastBestDay !== today
  const item = {
    box,
    due,
    plays: prev.plays + 1,
    best: prev.best + (quality === 3 ? 1 : 0),
    bestDays: (prev.bestDays ?? prev.best ?? 0) + (newBestDay ? 1 : 0),
    lastBestDay: quality === 3 ? today : prev.lastBestDay,
    last: today,
    lastQuality: quality,
  }
  const attrPoints = { ...(progress.attrPoints ?? {}) }
  for (const [k, v] of Object.entries(attrs ?? {})) attrPoints[k] = (attrPoints[k] ?? 0) + v
  let p = { ...progress, xp: progress.xp + (points ?? 0), attrPoints, items: { ...progress.items, [key]: item } }
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

/** Monday of the week containing `iso`. */
export function weekStart(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const shift = (date.getDay() + 6) % 7 // Monday = 0
  return addDays(iso, -shift)
}

/** Daily trainings done in the current week (Monday–Sunday) — counts up, never down. */
export function weekProgress(progress, today) {
  const start = weekStart(today)
  const done = new Set(progress.trainingDays.filter((d) => d >= start && d <= today)).size
  return { done, goal: WEEKLY_GOAL, reached: done >= WEEKLY_GOAL }
}

/** Weeks in which the goal was reached (any weeks, not necessarily in a row). */
export function fullWeeks(progress) {
  const perWeek = {}
  for (const d of new Set(progress.trainingDays)) perWeek[weekStart(d)] = (perWeek[weekStart(d)] ?? 0) + 1
  return Object.values(perWeek).filter((n) => n >= WEEKLY_GOAL).length
}

export function recordTraining(progress, today) {
  let p = { ...progress, xp: progress.xp + DAILY_XP, trainingDays: [...new Set([...progress.trainingDays, today])] }
  const earned = []
  p = grant(p, 'trening-dnia', today, earned)
  if (weekProgress(p, today).reached) p = grant(p, 'pelny-tydzien', today, earned)
  if (fullWeeks(p) >= 4) p = grant(p, 'cztery-tygodnie', today, earned)
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
  return MEDALS.find((m) => (item.bestDays ?? item.best) >= m.min) ?? null
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

export function recordChallengeSent(progress, today) {
  const earned = []
  return { progress: grant(progress, 'wyzwanie', today, earned), earned }
}

export function recordChallengeWon(progress, today) {
  const earned = []
  return { progress: grant(progress, 'pojedynek-wygrany', today, earned), earned }
}
