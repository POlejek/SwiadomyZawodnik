import { obrona2v1Skrzydlo } from './obrona2v1Skrzydlo'

// Every situation available in the game. Add new ones here (see README: "Jak dodać sytuację").
export const SCENARIOS = [obrona2v1Skrzydlo]

export function findScenario(id) {
  return SCENARIOS.find((s) => s.id === id)
}
