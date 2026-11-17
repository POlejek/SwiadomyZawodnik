import { useState } from 'react'
import GameScreen from './components/GameScreen'
import Home from './components/Home'
import { SCENARIOS, findScenario } from './scenarios'
import { load, save } from './storage'

export default function App() {
  const [scenarioId, setScenarioId] = useState(null)
  const [timerOn, setTimerOn] = useState(() => load('timer', true))
  const scenario = scenarioId ? findScenario(scenarioId) : null

  const toggleTimer = (on) => {
    setTimerOn(on)
    save('timer', on)
  }

  return (
    <main className="min-h-dvh">
      {scenario ? (
        <GameScreen key={scenario.id} scenario={scenario} timerOn={timerOn} onExit={() => setScenarioId(null)} />
      ) : (
        <Home scenarios={SCENARIOS} onPlay={setScenarioId} timerOn={timerOn} onToggleTimer={toggleTimer} />
      )}
    </main>
  )
}
