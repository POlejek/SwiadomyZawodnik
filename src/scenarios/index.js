import { asekuracja } from './asekuracja.js'
import { atak2v1 } from './atak2v1.js'
import { graTylemDoBramki } from './graTylemDoBramki.js'
import { kontrpressing } from './kontrpressing.js'
import { obrona2v1Skrzydlo } from './obrona2v1Skrzydlo.js'
import { pojedynekPrzyLinii } from './pojedynekPrzyLinii.js'
import { pokazSieDoGry } from './pokazSieDoGry.js'
import { szybkiRzutWolny } from './szybkiRzutWolny.js'
import { wbiegniecieBlizszySlupek } from './wbiegniecieBlizszySlupek.js'
import { wyjscieSpodPressingu } from './wyjscieSpodPressingu.js'

// Every situation available in the game, in the order shown on the home screen.
// Add new ones here (see README: "Jak dodać sytuację").
export const SCENARIOS = [
  obrona2v1Skrzydlo,
  atak2v1,
  wyjscieSpodPressingu,
  pojedynekPrzyLinii,
  wbiegniecieBlizszySlupek,
  kontrpressing,
  graTylemDoBramki,
  asekuracja,
  pokazSieDoGry,
  szybkiRzutWolny,
]

// Every stage of every situation — the pool for the daily training and the medals for principles.
export const CATALOG = SCENARIOS.flatMap((sc) =>
  sc.stages.map((st, stageIndex) => ({
    key: `${sc.id}/${st.id}`,
    scenarioId: sc.id,
    stageIndex,
    title: st.title,
    scenarioTitle: sc.title,
    lesson: st.lesson,
    fundament: st.fundament,
  })),
)

export function findScenario(id) {
  return SCENARIOS.find((s) => s.id === id)
}
