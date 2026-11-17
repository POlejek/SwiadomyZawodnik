import { initialState } from '../engine/animation'
import { AGE_GROUPS, DECISION_OPTIONS, maxScore } from '../engine/game'
import { personalise, pitchName, shirtOf, suitsPosition } from '../profile'
import { DAILY_SIZE, dueItems, level, medalFor, streak, todayISO, trainedToday } from '../progress'
import { CATALOG } from '../scenarios'
import { load } from '../storage'
import Pitch from './Pitch'
import { Medal } from './ProgressScreen'

export default function Home({
  scenarios,
  settings,
  onSettings,
  profile,
  progress,
  coachSet,
  onPlay,
  onTraining,
  onEditProfile,
  onProgress,
  onCoach,
  onShareSet,
}) {
  const { decisionSeconds, ageGroup, sound } = settings
  const today = todayISO()
  const lv = level(progress.xp)
  const days = streak(progress, today)
  const repeats = dueItems(progress, today).length
  const done = trainedToday(progress, today)
  const shirt = shirtOf(profile)
  const ordered = [...scenarios].sort((a, b) => Number(suitsPosition(b, profile)) - Number(suitsPosition(a, profile)))

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Trening decyzji boiskowych</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">Świadomy Zawodnik</h1>
        </div>
        <button type="button" className="player-card" onClick={onEditProfile} aria-label="Edytuj profil zawodnika">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-black ring-2 ring-yellow-300" style={{ background: shirt.fill, color: shirt.text }}>
            {profile?.number || '?'}
          </span>
          <span className="min-w-0 text-left">
            <span className="block truncate font-extrabold text-white">{pitchName(profile) === 'TY' ? 'Twój zawodnik' : profile.name}</span>
            <span className="block text-xs text-slate-400">
              {lv.name} · {progress.xp} XP{days ? ` · 🔥 ${days}` : ''}
            </span>
            <span className="mt-1 block h-1.5 w-32 overflow-hidden rounded-full bg-slate-800">
              <span className="block h-full rounded-full bg-lime-400" style={{ width: `${Math.round(lv.share * 100)}%` }} />
            </span>
          </span>
        </button>
      </header>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="hero-card">
          <p className="eyebrow">Trening dnia</p>
          <h2 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">{done ? 'Zrobione na dziś ✓' : `${DAILY_SIZE} decyzji · ok. 3 minuty`}</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">
            {done
              ? 'Świetnie! Wróć jutro, żeby nie przerwać serii. Możesz też zagrać jeszcze raz.'
              : repeats
                ? `Czeka ${repeats} ${repeats === 1 ? 'powtórka' : repeats < 5 ? 'powtórki' : 'powtórek'} — decyzje, które warto utrwalić. Czas na decyzję skraca się, gdy trafiasz.`
                : 'Losowe decyzje ze wszystkich sytuacji. Czas na decyzję skraca się, gdy trafiasz — jak w prawdziwym meczu.'}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" className={done ? 'btn-secondary' : 'btn-primary'} onClick={onTraining}>
              {done ? 'Zagraj jeszcze raz' : 'Zacznij trening'}
            </button>
            <span className="text-sm text-slate-400">🔥 Seria: {days} {days === 1 ? 'dzień' : 'dni'}</span>
          </div>
        </div>
        <div className="panel flex flex-col justify-between gap-3 !p-5">
          <div>
            <p className="eyebrow">Twoje zasady</p>
            <p className="mt-1 text-3xl font-black text-white">
              {CATALOG.filter((c) => medalFor(progress.items[c.key])).length}
              <span className="text-lg text-slate-500"> / {CATALOG.length}</span>
            </p>
            <p className="text-sm text-slate-400">z medalem · {Object.keys(progress.badges).length} odznak</p>
          </div>
          <button type="button" className="btn-secondary self-start" onClick={onProgress}>
            Moje postępy →
          </button>
        </div>
      </section>

      {coachSet && <CoachSetBanner set={coachSet} scenarios={scenarios} onPlay={onPlay} onShare={onShareSet} />}

      <div className="mb-4 mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-white">Sytuacje</h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
          <label className="flex items-center gap-2">
            Grupa wiekowa
            <select
              className="select"
              value={ageGroup}
              onChange={(e) => {
                const g = AGE_GROUPS.find((a) => a.id === e.target.value)
                onSettings({ ageGroup: g.id, decisionSeconds: g.seconds })
              }}
            >
              {AGE_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            Czas na decyzję
            <select className="select" value={decisionSeconds} onChange={(e) => onSettings({ decisionSeconds: Number(e.target.value) })}>
              {DECISION_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s ? `${s} s` : 'bez limitu'}
                </option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="h-4 w-4 accent-lime-400" checked={sound} onChange={(e) => onSettings({ sound: e.target.checked })} />
            Dźwięk
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ordered.map((sc) => {
          const best = load(`best:${sc.id}`, null)
          const mine = profile?.position && profile.position !== 'wszystkie' && suitsPosition(sc, profile)
          return (
            <article key={sc.id} className="panel flex flex-col gap-4 !p-4">
              <Pitch entities={personalise(sc.entities, profile)} world={initialState(sc)} label={`Podgląd sytuacji: ${sc.title}`} homeShirt={shirt} youLabel={pitchName(profile)} />
              <div className="flex flex-wrap gap-1.5">
                {mine && <span className="tag !bg-lime-400/15 !text-lime-300">Twoja pozycja</span>}
                <span className="tag">{sc.category}</span>
                <span className="tag">{sc.stages.length} decyzje</span>
                <span className="tag">Poziom: {sc.level}</span>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">{sc.title}</h3>
                <p className="text-sm text-slate-400">{sc.subtitle}</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{sc.brief}</p>
              <div className="flex items-center gap-1.5" aria-label="Medale za zasady">
                {sc.stages.map((st) => (
                  <Medal key={st.id} small medal={medalFor(progress.items[`${sc.id}/${st.id}`])} />
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  {best != null ? (
                    <>
                      Rekord: <b className="text-slate-200">{best}</b> / {maxScore(sc)} pkt
                    </>
                  ) : (
                    'Jeszcze nie grano'
                  )}
                </span>
                <button type="button" className="btn-primary" onClick={() => onPlay(sc.id)}>
                  Graj
                </button>
              </div>
            </article>
          )
        })}
      </div>

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-6 text-sm text-slate-400">
        <p>Jesteś trenerem? Wyślij drużynie zestaw sytuacji na tydzień.</p>
        <button type="button" className="btn-secondary" onClick={onCoach}>
          Dla trenera: stwórz zestaw
        </button>
      </footer>
    </div>
  )
}

function CoachSetBanner({ set, scenarios, onPlay, onShare }) {
  const list = set.ids.map((id) => scenarios.find((s) => s.id === id)).filter(Boolean)
  const finished = list.filter((s) => set.results[s.id]).length
  return (
    <section className="mt-6 rounded-2xl border border-sky-400/30 bg-sky-400/10 p-5" data-testid="coach-set">
      <p className="eyebrow !text-sky-300">Zestaw od trenera</p>
      <h2 className="mt-1 text-xl font-extrabold text-white">{set.title}</h2>
      <p className="mt-1 text-sm text-slate-300">
        Rozegrane: {finished} z {list.length}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {list.map((s) => {
          const r = set.results[s.id]
          return (
            <button key={s.id} type="button" className={`pill ${r ? 'pill-on' : ''}`} onClick={() => onPlay(s.id)}>
              {r ? '✓ ' : ''}
              {s.title}
              {r ? ` · ${'★'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)}` : ''}
            </button>
          )
        })}
      </div>
      {finished > 0 && (
        <button type="button" className="btn-primary mt-4" onClick={onShare}>
          Wyślij wynik trenerowi
        </button>
      )}
    </section>
  )
}
