import { useCallback, useEffect, useRef, useState } from 'react'
import CoachPanel, { readSetFromHash, shareText } from './components/CoachPanel'
import GameScreen from './components/GameScreen'
import Home from './components/Home'
import ProfileModal from './components/ProfileModal'
import ProgressScreen from './components/ProgressScreen'
import Toasts from './components/Toasts'
import TrainingSession from './components/TrainingSession'
import { AGE_GROUPS, DECISION_OPTIONS, DEFAULT_DECISION_SECONDS } from './engine/game'
import { loadProfile, saveProfile } from './profile'
import {
  loadProgress,
  pickDaily,
  recordDecision,
  recordScenarioComplete,
  recordTraining,
  recordWhatIfAll,
  saveProgress,
  todayISO,
} from './progress'
import { CATALOG, SCENARIOS, findScenario } from './scenarios'
import { playSound, setSoundEnabled, unlockAudio } from './sound'
import { load, save } from './storage'

function loadSettings() {
  const saved = load('settings', {})
  const ageGroup = AGE_GROUPS.some((g) => g.id === saved.ageGroup) ? saved.ageGroup : 'u13'
  const decisionSeconds = DECISION_OPTIONS.includes(saved.decisionSeconds) ? saved.decisionSeconds : DEFAULT_DECISION_SECONDS
  return { ageGroup, decisionSeconds, sound: saved.sound ?? true }
}

const ALL_IDS = SCENARIOS.map((s) => s.id)

export default function App() {
  // screen: { name: 'home' } | { name: 'game', id } | { name: 'training', items } | { name: 'progress' }
  const [screen, setScreen] = useState({ name: 'home' })
  const [settings, setSettings] = useState(loadSettings)
  const [profile, setProfile] = useState(loadProfile)
  const [editingProfile, setEditingProfile] = useState(false)
  const [coachOpen, setCoachOpen] = useState(false)
  const [progress, setProgress] = useState(loadProgress)
  const progressRef = useRef(progress)
  const [toasts, setToasts] = useState([])
  const [coachSet, setCoachSet] = useState(() => {
    const set = readSetFromHash(window.location.hash, ALL_IDS)
    return set && { ...set, results: load(set.key, {}) }
  })

  useEffect(() => setSoundEnabled(settings.sound), [settings.sound])

  const changeSettings = (patch) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    save('settings', next)
  }

  // Every progress change goes through here: saved at once, new badges shown as toasts.
  const updateProgress = useCallback((fn) => {
    const { progress: next, earned } = fn(progressRef.current)
    progressRef.current = next
    saveProgress(next)
    setProgress(next)
    if (earned.length) {
      playSound('good')
      const items = earned.map((badge) => ({ id: `${badge}-${Date.now()}`, badge }))
      setToasts((cur) => [...cur, ...items])
      setTimeout(() => setToasts((cur) => cur.filter((t) => !items.includes(t))), 3800)
    }
  }, [])

  const onDecision = useCallback(
    (r) => updateProgress((p) => recordDecision(p, { scenarioId: r.scenarioId, stageId: r.stageId, quality: r.quality, timeMs: r.timeMs, points: r.points }, todayISO())),
    [updateProgress],
  )
  const onWhatIfAll = useCallback(() => updateProgress((p) => recordWhatIfAll(p, todayISO())), [updateProgress])
  const onComplete = useCallback(
    (id, score, stars) => {
      updateProgress((p) => recordScenarioComplete(p, id, ALL_IDS, todayISO()))
      setCoachSet((set) => {
        if (!set?.ids.includes(id)) return set
        const prev = set.results[id]
        const results = { ...set.results, [id]: prev && prev.score >= score ? prev : { score, stars } }
        save(set.key, results)
        return { ...set, results }
      })
    },
    [updateProgress],
  )

  const go = (next) => {
    unlockAudio() // inside the tap, so phones allow sound
    setScreen(next)
    window.scrollTo?.(0, 0)
  }
  const home = () => go({ name: 'home' })
  const seconds = settings.decisionSeconds

  const shareSetResult = async () => {
    const lines = coachSet.ids
      .map((id) => {
        const r = coachSet.results[id]
        const sc = findScenario(id)
        return `${r ? '✓' : '–'} ${sc.title}${r ? `: ${'★'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)} (${r.score} pkt)` : ''}`
      })
      .join('\n')
    const who = profile?.name?.trim() || 'Zawodnik'
    await shareText(`${who}${profile?.number ? ` (nr ${profile.number})` : ''} — ${coachSet.title}\n${lines}\nŚwiadomy Zawodnik`)
  }

  let content
  if (screen.name === 'game') {
    content = (
      <GameScreen
        key={screen.id}
        scenario={findScenario(screen.id)}
        decisionSeconds={seconds}
        profile={profile}
        onExit={home}
        onDecision={onDecision}
        onWhatIfAll={onWhatIfAll}
        onComplete={onComplete}
      />
    )
  } else if (screen.name === 'training') {
    content = (
      <TrainingSession
        items={screen.items}
        profile={profile}
        baseSeconds={seconds}
        progress={progress}
        onDecision={onDecision}
        onWhatIfAll={onWhatIfAll}
        onFinish={() => updateProgress((p) => recordTraining(p, todayISO()))}
        onExit={home}
      />
    )
  } else if (screen.name === 'progress') {
    content = <ProgressScreen progress={progress} onExit={home} />
  } else {
    content = (
      <Home
        scenarios={SCENARIOS}
        settings={settings}
        onSettings={changeSettings}
        profile={profile}
        progress={progress}
        coachSet={coachSet}
        onPlay={(id) => go({ name: 'game', id })}
        onTraining={() => go({ name: 'training', items: pickDaily(progressRef.current, CATALOG, todayISO()) })}
        onEditProfile={() => setEditingProfile(true)}
        onProgress={() => go({ name: 'progress' })}
        onCoach={() => setCoachOpen(true)}
        onShareSet={shareSetResult}
      />
    )
  }

  return (
    <main className="min-h-dvh">
      {content}
      {(editingProfile || !profile) && (
        <ProfileModal
          first={!profile}
          profile={profile}
          ageGroup={settings.ageGroup}
          onClose={() => setEditingProfile(false)}
          onSave={(p, age) => {
            saveProfile(p)
            setProfile(p)
            const g = AGE_GROUPS.find((a) => a.id === age)
            if (g && g.id !== settings.ageGroup) changeSettings({ ageGroup: g.id, decisionSeconds: g.seconds })
            setEditingProfile(false)
          }}
        />
      )}
      {coachOpen && <CoachPanel scenarios={SCENARIOS} onClose={() => setCoachOpen(false)} />}
      <Toasts toasts={toasts} />
    </main>
  )
}
