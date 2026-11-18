// The player's card, FIFA style: six skills and an overall rating up to 99.
// Built to last for months, not weeks:
//  - every skill rises fast at first and ever more slowly (an asymptotic curve),
//  - each skill has a CEILING set by how many fundamentals of its group are mastered (medals),
//    so 90+ needs gold medals, and gold needs the best decision on 5 different days,
//  - every new situation added to the game raises the ceiling again,
//  - ratings never go down: the card keeps the highest value ever reached.
import { CATALOG } from './scenarios'
import { fullWeeks, medalFor, weekProgress } from './progress'
import { fundament } from './taxonomy'

export const BASE = 40
export const MAX = 99
const K = 260 // attribute points for ~63% of the way from BASE to the ceiling

export const ATTRS = [
  { key: 'CZY', label: 'Czytanie gry', how: 'Sytuacje z sygnałem: patrz, co robi rywal, zanim zdecydujesz.' },
  { key: 'ATA', label: 'Atak', how: 'Decyzje z fundamentów ataku.' },
  { key: 'OBR', label: 'Obrona', how: 'Decyzje z fundamentów obrony.' },
  { key: 'PRZ', label: 'Przejścia', how: 'Kontrpressing i powrót po stracie, kontry.' },
  { key: 'SZY', label: 'Szybkość decyzji', how: 'Najlepsze decyzje podjęte szybko, z włączonym czasem.' },
  { key: 'WYT', label: 'Wytrwałość', how: 'Treningi dnia i pełne tygodnie.' },
]

// Overall = weighted average, by position (like a real card).
export const WEIGHTS = {
  obronca: { CZY: 0.2, ATA: 0.1, OBR: 0.3, PRZ: 0.15, SZY: 0.15, WYT: 0.1 },
  pomocnik: { CZY: 0.2, ATA: 0.2, OBR: 0.2, PRZ: 0.2, SZY: 0.1, WYT: 0.1 },
  napastnik: { CZY: 0.2, ATA: 0.35, OBR: 0.05, PRZ: 0.1, SZY: 0.2, WYT: 0.1 },
  wszystkie: { CZY: 1 / 6, ATA: 1 / 6, OBR: 1 / 6, PRZ: 1 / 6, SZY: 1 / 6, WYT: 1 / 6 },
}

export const POSITION_CODE = { obronca: 'OBR', pomocnik: 'POM', napastnik: 'NAP', wszystkie: 'UNI' }

export const TIERS = [
  { min: 85, id: 'elita', label: 'Elita' },
  { min: 75, id: 'zlota', label: 'Złota' },
  { min: 65, id: 'srebrna', label: 'Srebrna' },
  { min: 0, id: 'brazowa', label: 'Brązowa' },
]

const GROUP_ATTR = { 'atak-ind': 'ATA', 'atak-grp': 'ATA', 'obrona-ind': 'OBR', 'obrona-grp': 'OBR', przejscia: 'PRZ' }

/** Which skill a stage trains (plus "reading the game" when the stage has cue variants). */
export function attrsOfStage(stage) {
  const main = GROUP_ATTR[fundament(stage.fundament)?.grupa]
  return { main, cue: (stage.variants?.length ?? 0) > 0 }
}

/** Skill points for one first-attempt decision. Effort counts a little; the best decision counts most. */
export function pointsFor({ stage, quality, timeMs, seconds }) {
  const q = { 3: 3, 2: 2, 1: 1, 0: 0.5 }[quality] ?? 0.5
  const { main, cue } = attrsOfStage(stage)
  const out = {}
  if (main) out[main] = q
  if (cue) out.CZY = q
  if (quality === 3) {
    if (seconds > 0 && timeMs != null) {
      const share = timeMs / (seconds * 1000)
      out.SZY = share < 0.3 ? 3 : share < 0.6 ? 2 : 1
    } else out.SZY = 0.5
  }
  return out
}

const MEDAL_VALUE = { bronze: 1 / 3, silver: 2 / 3, gold: 1 }

/** 0..1 — how well a set of stages is mastered (average medal). */
export function masteryShare(progress, keys) {
  if (!keys.length) return 0
  return keys.reduce((s, k) => s + (MEDAL_VALUE[medalFor(progress.items[k])?.id] ?? 0), 0) / keys.length
}

/** Ceiling for a skill: 60 with no medals, 99 with gold in every stage it covers. */
export const ceiling = (share) => Math.round(60 + 39 * share)

/** Rating from points under a ceiling — fast at first, then ever slower. */
export function rating(points, cap) {
  return Math.min(MAX, Math.floor(BASE + (cap - BASE) * (1 - Math.exp(-points / K))))
}

function stagesFor(attr, scenarios) {
  const keys = []
  for (const sc of scenarios) {
    for (const st of sc.stages) {
      const { main, cue } = attrsOfStage(st)
      const key = `${sc.id}/${st.id}`
      if (attr === main || (attr === 'CZY' && cue) || attr === 'SZY') keys.push(key)
    }
  }
  return keys
}

/**
 * The card as it is now. `scenarios` = all situations (for ceilings), `today` = YYYY-MM-DD.
 * Values never drop below `progress.cardBest` (the highest ever shown).
 */
export function computeCard(progress, scenarios, profile, today) {
  const best = progress.cardBest ?? {}
  const pts = progress.attrPoints ?? {}
  const attrs = {}
  for (const { key } of ATTRS) {
    let value
    let cap
    if (key === 'WYT') {
      const days = new Set(progress.trainingDays ?? []).size
      const p = days * 4 + fullWeeks(progress) * 12
      cap = MAX
      value = rating(p, cap)
    } else {
      cap = ceiling(masteryShare(progress, stagesFor(key, scenarios)))
      value = rating(pts[key] ?? 0, cap)
    }
    attrs[key] = { value: Math.max(value, best[key] ?? BASE), cap }
  }
  const w = WEIGHTS[profile?.position] ?? WEIGHTS.wszystkie
  const raw = Math.round(Object.entries(w).reduce((s, [k, f]) => s + attrs[k].value * f, 0))
  const overall = Math.max(raw, best.overall ?? BASE)
  return {
    overall,
    attrs,
    tier: TIERS.find((t) => overall >= t.min),
    position: POSITION_CODE[profile?.position] ?? 'UNI',
    inForm: weekProgress(progress, today).reached,
  }
}

/** Saves the current values as the new "never lower than" marks. */
export function withCardBest(progress, card) {
  const cardBest = { overall: card.overall }
  for (const [k, a] of Object.entries(card.attrs)) cardBest[k] = a.value
  return { ...progress, cardBest }
}

// ---------- album ----------

export const CARD_TIERS = [
  { id: 'bronze', label: 'Brąz' },
  { id: 'silver', label: 'Srebro' },
  { id: 'gold', label: 'Złoto' },
]
const ORDER = { bronze: 0, silver: 1, gold: 2 }

/** Fundamental cards: the tier is the weakest medal over the decisions that teach it. */
export function albumCards(progress, catalog = CATALOG) {
  const byF = {}
  for (const c of catalog) (byF[c.fundament] ??= []).push(c)
  return Object.entries(byF).map(([id, items]) => {
    const medals = items.map((c) => medalFor(progress.items[c.key])?.id ?? null)
    const tier = medals.includes(null) ? null : medals.reduce((a, b) => (ORDER[a] <= ORDER[b] ? a : b))
    const next = items.find((c) => (ORDER[medalFor(progress.items[c.key])?.id] ?? -1) < (tier ? ORDER[tier] + 1 : 0))
    return { id, fundament: fundament(id), tier, items, next }
  })
}

/** Album completion: three slots per fundamental (bronze, silver, gold) plus one per special card. */
export function albumCompletion(progress, specialIds, catalog = CATALOG) {
  const cards = albumCards(progress, catalog)
  const filled = cards.reduce((s, c) => s + (c.tier ? ORDER[c.tier] + 1 : 0), 0) + specialIds.filter((id) => progress.badges[id]).length
  const total = cards.length * 3 + specialIds.length
  return { filled, total, share: total ? filled / total : 0 }
}

/** Card ids (with tier) present in the album — to spot newly earned cards. */
export function albumSnapshot(progress, catalog = CATALOG) {
  const s = new Set()
  for (const c of albumCards(progress, catalog)) if (c.tier) s.add(`${c.id}:${c.tier}`)
  for (const id of Object.keys(progress.badges)) s.add(`badge:${id}`)
  return s
}
