import { initialState } from '../engine/animation'
import { AGE_GROUPS, DECISION_OPTIONS, maxScore } from '../engine/game'
import { load } from '../storage'
import Pitch from './Pitch'

const steps = (seconds) => [
  ['Obserwuj', 'Akcja rozgrywa się na boisku i zatrzymuje w kluczowym momencie.'],
  ['Zdecyduj', seconds ? `Masz 4 odpowiedzi i ${seconds} sekund na decyzję.` : 'Masz 4 odpowiedzi. Zastanów się i wybierz.'],
  ['Zobacz skutek', 'Zawodnik robi to, co wybrałeś. Zła decyzja kosztuje: strata, gol, rzut karny. Każda gra może potoczyć się inaczej.'],
]

export default function Home({ scenarios, onPlay, settings, onSettings }) {
  const { decisionSeconds, ageGroup, sound } = settings
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <header className="mb-8 sm:mb-10">
        <p className="eyebrow">Trening decyzji boiskowych</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">Świadomy Zawodnik</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Obejrzyj sytuację z meczu, zatrzymaj akcję i zdecyduj, co robisz. Twój zawodnik wykona dokładnie to, co wybierzesz.
        </p>
      </header>

      <ol className="mb-10 grid gap-3 sm:grid-cols-3">
        {steps(decisionSeconds).map(([title, text], i) => (
          <li key={title} className="panel !p-4">
            <p className="flex items-center gap-2 font-bold text-white">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-lime-400 text-xs font-black text-slate-900">{i + 1}</span>
              {title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{text}</p>
          </li>
        ))}
      </ol>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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
        {scenarios.map((sc) => {
          const best = load(`best:${sc.id}`, null)
          return (
            <article key={sc.id} className="panel flex flex-col gap-4 !p-4">
              <Pitch entities={sc.entities} world={initialState(sc)} label={`Podgląd sytuacji: ${sc.title}`} />
              <div className="flex flex-wrap gap-1.5">
                <span className="tag">{sc.category}</span>
                <span className="tag">{sc.stages.length} decyzje</span>
                <span className="tag">Poziom: {sc.level}</span>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">{sc.title}</h3>
                <p className="text-sm text-slate-400">{sc.subtitle}</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{sc.brief}</p>
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
    </div>
  )
}
