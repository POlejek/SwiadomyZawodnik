import { useCallback, useEffect, useRef, useState } from 'react'
import { CARD_TIERS, albumCards, albumSnapshot, computeCard, pointsFor, withCardBest } from './card'
import { challengeLink, challengeMessage, readChallenge } from './challenge'
import CardScreen from './components/CardScreen'
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
  recordChallengeSent,
  recordChallengeWon,
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
  const [incoming, setIncoming] = useState(() => readChallenge(window.location.hash, SCENARIOS))
  const screenRef = useRef(screen)
  screenRef.current = screen
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

  const profileRef = useRef(profile)
  profileRef.current = profile

  const toast = useCallback((items) => {
    if (!items.length) return
    playSound('good')
    const stamped = items.map((t, i) => ({ ...t, id: `${Date.now()}-${i}-${Math.random()}` }))
    setToasts((cur) => [...cur, ...stamped])
    setTimeout(() => setToasts((cur) => cur.filter((t) => !stamped.includes(t))), 4000)
  }, [])

  // Every progress change goes through here: saved at once; new badges, album cards and a higher rating pop up.
  const updateProgress = useCallback(
    (fn) => {
      const before = progressRef.current
      const today = todayISO()
      const cardBefore = computeCard(before, SCENARIOS, profileRef.current, today)
      const albumBefore = albumSnapshot(before)
      const { progress: changed, earned } = fn(before)
      const cardAfter = computeCard(changed, SCENARIOS, profileRef.current, today)
      const next = withCardBest(changed, cardAfter)
      progressRef.current = next
      saveProgress(next)
      setProgress(next)

      const items = earned.map((badge) => ({ badge }))
      for (const c of albumCards(next)) {
        if (c.tier && !albumBefore.has(`${c.id}:${c.tier}`)) {
          items.push({ icon: '🃏', title: 'Nowa karta w albumie', text: `${c.fundament.label} · ${CARD_TIERS.find((t) => t.id === c.tier).label}` })
        }
      }
      if (cardAfter.overall > cardBefore.overall) {
        items.push({ icon: '⬆️', title: 'Twoja karta', text: `Ocena ${cardBefore.overall} → ${cardAfter.overall}${cardAfter.tier.id !== cardBefore.tier.id ? ` · karta ${cardAfter.tier.label.toLowerCase()}!` : ''}` })
      }
      toast(items)
    },
    [toast],
  )

  const onDecision = useCallback(
    (r) => {
      const stage = findScenario(r.scenarioId)?.stages.find((s) => s.id === r.stageId)
      const attrs = stage ? pointsFor({ stage, quality: r.quality, timeMs: r.timeMs, seconds: r.seconds }) : {}
      updateProgress((p) => recordDecision(p, { scenarioId: r.scenarioId, stageId: r.stageId, quality: r.quality, timeMs: r.timeMs, points: r.points, attrs }, todayISO()))
    },
    [updateProgress],
  )
  const card = computeCard(progress, SCENARIOS, profile, todayISO())
  const onWhatIfAll = useCallback(() => updateProgress((p) => recordWhatIfAll(p, todayISO())), [updateProgress])
  const onComplete = useCallback(
    (id, score, stars) => {
      updateProgress((p) => recordScenarioComplete(p, id, ALL_IDS, todayISO()))
      const ch = screenRef.current.challenge
      if (ch && ch.scenarioId === id && score > ch.score) updateProgress((p) => recordChallengeWon(p, todayISO()))
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

  // Challenge a friend: the link carries the scenario, the seed (same version), the score and the time limit.
  const sendChallenge = async ({ scenarioId, seed, score, stars }) => {
    const ch = screenRef.current.challenge
    const link = challengeLink({
      scenarioId,
      seed,
      score,
      stars,
      seconds: ch ? ch.seconds : seconds,
      from: profile?.name?.trim(),
      number: profile?.number,
    })
    const r = await shareText(challengeMessage({ from: profile?.name?.trim(), scenarioTitle: findScenario(scenarioId).title, score, link }))
    if (r !== 'failed') updateProgress((p) => recordChallengeSent(p, todayISO()))
    return r === 'shared' ? 'Wyzwanie wysłane!' : r === 'copied' ? 'Link skopiowany — wklej go koledze w wiadomości.' : `Skopiuj link: ${link}`
  }

  let content
  if (screen.name === 'game') {
    content = (
      <GameScreen
        key={`${screen.id}-${screen.challenge?.seed ?? ''}`}
        scenario={findScenario(screen.id)}
        challenge={screen.challenge}
        onChallenge={sendChallenge}
        decisionSeconds={screen.challenge ? screen.challenge.seconds : seconds}
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
  } else if (screen.name === 'card') {
    content = <CardScreen card={card} progress={progress} profile={profile} onExit={home} />
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
        challenge={incoming}
        onAcceptChallenge={() => go({ name: 'game', id: incoming.scenarioId, challenge: incoming })}
        onDismissChallenge={() => {
          setIncoming(null)
          try {
            window.history.replaceState(null, '', window.location.pathname)
          } catch {
            /* ignore */
          }
        }}
        onPlay={(id) => go({ name: 'game', id })}
        onTraining={() => go({ name: 'training', items: pickDaily(progressRef.current, CATALOG, todayISO()) })}
        onEditProfile={() => setEditingProfile(true)}
        onProgress={() => go({ name: 'progress' })}
        onCard={() => go({ name: 'card' })}
        card={card}
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
