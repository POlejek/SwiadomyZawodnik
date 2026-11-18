import { AGE_GROUPS, DECISION_OPTIONS } from '../engine/game'
import { pitchName, shirtOf } from '../profile'
import { albumCompletion } from '../card'
import { BADGES, DAILY_SIZE, dueItems, medalFor, todayISO, trainedToday, weekProgress } from '../progress'
import { CATALOG } from '../scenarios'
import Library from './Library'
import PlayerCard from './PlayerCard'
import { WeekDots } from './ProgressScreen'

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
  onCard,
  card,
  onCoach,
  onShareSet,
}) {
  const { decisionSeconds, ageGroup, sound } = settings
  const today = todayISO()
  const album = albumCompletion(progress, Object.keys(BADGES))
  const week = weekProgress(progress, today)
  const repeats = dueItems(progress, today).length
  const done = trainedToday(progress, today)
  const shirt = shirtOf(profile)

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
              Karta {card.overall} · {card.tier.label}
            </span>
            <span className="mt-1 block h-1.5 w-32 overflow-hidden rounded-full bg-slate-800">
              <span className="block h-full rounded-full bg-lime-400" style={{ width: `${card.overall}%` }} />
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
              ? week.reached
                ? 'Brawo! Cel tygodnia osiągnięty — każdy kolejny trening to bonus. Możesz zagrać jeszcze raz.'
                : `Brawo! Masz ${week.done} z ${week.goal} treningów w tym tygodniu. Możesz zagrać jeszcze raz.`
              : repeats
                ? `Czeka ${repeats} ${repeats === 1 ? 'powtórka' : repeats < 5 ? 'powtórki' : 'powtórek'} — decyzje, które warto utrwalić. Czas na decyzję skraca się, gdy trafiasz.`
                : 'Losowe decyzje ze wszystkich sytuacji. Czas na decyzję skraca się, gdy trafiasz — jak w prawdziwym meczu.'}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" className={done ? 'btn-secondary' : 'btn-primary'} onClick={onTraining}>
              {done ? 'Zagraj jeszcze raz' : 'Zacznij trening'}
            </button>
            <span className="flex items-center gap-2 text-sm text-slate-400">
              Cel tygodnia <WeekDots week={week} />
            </span>
          </div>
        </div>
        <div className="panel flex gap-4 !p-4">
          <button type="button" className="w-28 shrink-0 transition hover:scale-[1.03] sm:w-32" onClick={onCard} aria-label="Otwórz kartę i album">
            <PlayerCard card={card} name={profile?.name} number={profile?.number} shirt={shirt} idPrefix="mini" className="w-full drop-shadow-xl" />
          </button>
          <div className="flex min-w-0 flex-col justify-between gap-2">
            <div>
              <p className="eyebrow">Twoja karta</p>
              <p className="mt-1 text-3xl font-black text-white">
                {card.overall} <span className="text-base font-bold text-slate-400">{card.tier.label}</span>
              </p>
              <p className="text-sm text-slate-400">
                Album: {album.filled}/{album.total} kart · {CATALOG.filter((c) => medalFor(progress.items[c.key])).length}/{CATALOG.length} zasad z medalem
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-secondary !min-h-[38px] text-sm" onClick={onCard}>
                Karta i album →
              </button>
              <button type="button" className="btn-chip" onClick={onProgress}>
                Postępy
              </button>
            </div>
          </div>
        </div>
      </section>

      {coachSet && <CoachSetBanner set={coachSet} scenarios={scenarios} onPlay={onPlay} onShare={onShareSet} />}

      <div className="mb-4 mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-white">Biblioteka sytuacji</h2>
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

      <Library scenarios={scenarios} profile={profile} progress={progress} onPlay={onPlay} />

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
