import { useState } from 'react'
import GameScreen from './components/GameScreen'
import Home from './components/Home'
import { DECISION_OPTIONS, DEFAULT_DECISION_SECONDS } from './engine/game'
import { SCENARIOS, findScenario } from './scenarios'
import { load, save } from './storage'

export default function App() {
  const [scenarioId, setScenarioId] = useState(null)
  const [decisionSeconds, setDecisionSeconds] = useState(() => {
    const saved = load('decisionSeconds', DEFAULT_DECISION_SECONDS)
    return DECISION_OPTIONS.includes(saved) ? saved : DEFAULT_DECISION_SECONDS
  })
  const scenario = scenarioId ? findScenario(scenarioId) : null

  const changeSeconds = (seconds) => {
    setDecisionSeconds(seconds)
    save('decisionSeconds', seconds)
  }

  return (
    <main className="min-h-dvh">
      {scenario ? (
        <GameScreen key={scenario.id} scenario={scenario} decisionSeconds={decisionSeconds} onExit={() => setScenarioId(null)} />
      ) : (
        <Home scenarios={SCENARIOS} onPlay={setScenarioId} decisionSeconds={decisionSeconds} onDecisionSeconds={changeSeconds} />
      )}
    </main>
  )
}
