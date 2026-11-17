import { useEffect, useState } from 'react'
import GameScreen from './components/GameScreen'
import Home from './components/Home'
import { AGE_GROUPS, DECISION_OPTIONS, DEFAULT_DECISION_SECONDS } from './engine/game'
import { SCENARIOS, findScenario } from './scenarios'
import { setSoundEnabled, unlockAudio } from './sound'
import { load, save } from './storage'

function loadSettings() {
  const saved = load('settings', {})
  const ageGroup = AGE_GROUPS.some((g) => g.id === saved.ageGroup) ? saved.ageGroup : 'u13'
  const decisionSeconds = DECISION_OPTIONS.includes(saved.decisionSeconds) ? saved.decisionSeconds : DEFAULT_DECISION_SECONDS
  return { ageGroup, decisionSeconds, sound: saved.sound ?? true }
}

export default function App() {
  const [scenarioId, setScenarioId] = useState(null)
  const [settings, setSettings] = useState(loadSettings)
  const scenario = scenarioId ? findScenario(scenarioId) : null

  useEffect(() => setSoundEnabled(settings.sound), [settings.sound])

  const changeSettings = (patch) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    save('settings', next)
  }

  const play = (id) => {
    unlockAudio() // inside the tap, so phones allow sound
    setScenarioId(id)
  }

  return (
    <main className="min-h-dvh">
      {scenario ? (
        <GameScreen key={scenario.id} scenario={scenario} decisionSeconds={settings.decisionSeconds} onExit={() => setScenarioId(null)} />
      ) : (
        <Home scenarios={SCENARIOS} onPlay={play} settings={settings} onSettings={changeSettings} />
      )}
    </main>
  )
}
