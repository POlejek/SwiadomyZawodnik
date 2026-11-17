import { PITCH } from './pitch.js'

// Variety between runs, so players read the situation instead of remembering the answer:
//  - mirror: the whole situation on the other side of the pitch (left ↔ right, also in the texts),
//  - variants: a stage may have alternative versions where a different cue (what the opponent does)
//    makes a different answer the best one. All versions of a stage offer the same four answers.

const TEXT_KEYS = new Set(['title', 'subtitle', 'brief', 'question', 'lesson', 'label', 'feedback', 'outcome', 'text'])
const POINT_KEYS = new Set(['from', 'to', 'at'])

// Polish left/right adjectives and adverbs: prawy/lewy, prawą/lewą, z prawej/z lewej, prawego/lewego, …
const SIDE_WORD = /(?<!\p{L})(praw|lew|Praw|Lew)(ymi|ych|ym|ej|ego|emu|ą|y|a|e|o)(?!\p{L})/gu
const SWAP = { praw: 'lew', lew: 'praw', Praw: 'Lew', Lew: 'Praw' }

export function mirrorText(text) {
  return text.replace(SIDE_WORD, (_, stem, end) => SWAP[stem] + end)
}

const flipX = (x) => Math.round((PITCH.width - x) * 1000) / 1000

function mirrorValue(key, value) {
  if (value == null) return value
  if (typeof value === 'string') return TEXT_KEYS.has(key) ? mirrorText(value) : value
  if (typeof value === 'number') {
    if (key === 'x') return flipX(value)
    if (key === 'labelDx') return -value
    return value
  }
  if (Array.isArray(value)) {
    if (POINT_KEYS.has(key) && value.length === 2 && value.every((n) => typeof n === 'number')) {
      return [flipX(value[0]), value[1]]
    }
    return value.map((v) => mirrorValue(key, v))
  }
  if (typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = mirrorValue(k, v)
    return out
  }
  return value
}

/** The same situation played on the other side of the pitch. */
export function mirrorScenario(scenario) {
  return { ...mirrorValue('', scenario), mirrored: !scenario.mirrored }
}

/** Picks one version of every stage (the stage itself or one of its `variants`). */
export function pickVariants(scenario, rand = Math.random) {
  return {
    ...scenario,
    stages: scenario.stages.map((stage) => {
      const { variants = [], ...base } = stage
      const versions = [base, ...variants.map((v) => ({ ...base, ...v }))]
      const chosen = versions[Math.floor(rand() * versions.length)]
      return { ...chosen, variant: chosen === base ? null : chosen.variantId }
    }),
  }
}

/** A fresh version of the scenario for one run: random variants, and mirrored half of the time. */
export function prepareRun(scenario, rand = Math.random) {
  const picked = pickVariants(scenario, rand)
  return scenario.noMirror || rand() < 0.5 ? picked : mirrorScenario(picked)
}
