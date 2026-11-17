import { atak2v1 } from './atak2v1.js'
import { kontrpressing } from './kontrpressing.js'
import { obrona2v1Skrzydlo } from './obrona2v1Skrzydlo.js'
import { pojedynekPrzyLinii } from './pojedynekPrzyLinii.js'
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
]

export function findScenario(id) {
  return SCENARIOS.find((s) => s.id === id)
}
