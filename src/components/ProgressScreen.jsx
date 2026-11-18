import { BADGES, comesBack, fullWeeks, level, medalFor, todayISO, weekProgress } from '../progress'
import { CATALOG } from '../scenarios'
import { FUNDAMENTY, GRUPY } from '../taxonomy'

const MEDAL_ORDER = { bronze: 0, silver: 1, gold: 2 }

const MEDAL_STYLE = {
  gold: 'bg-yellow-300 text-slate-900',
  silver: 'bg-slate-300 text-slate-900',
  bronze: 'bg-amber-700 text-amber-50',
}

export function Medal({ medal, small }) {
  const size = small ? 'h-5 w-5 text-[10px]' : 'h-8 w-8 text-sm'
  if (!medal) return <span className={`grid ${size} shrink-0 place-items-center rounded-full border border-dashed border-slate-600 text-slate-600`}>–</span>
  return (
    <span className={`grid ${size} shrink-0 place-items-center rounded-full font-black ${MEDAL_STYLE[medal.id]}`} title={medal.label}>
      {medal.label[0]}
    </span>
  )
}

export function WeekDots({ week }) {
  return (
    <span className="mt-1 inline-flex items-center gap-1.5 text-xl font-extrabold text-white" aria-label={`${week.done} z ${week.goal} treningów w tym tygodniu`}>
      {Array.from({ length: week.goal }, (_, i) => (
        <span key={i} className={`grid h-6 w-6 place-items-center rounded-full text-xs ${i < week.done ? 'bg-lime-400 text-slate-900' : 'border border-slate-600 text-transparent'}`}>
          ✓
        </span>
      ))}
      <span className="ml-1 text-base">
        {Math.min(week.done, week.goal)} / {week.goal}
      </span>
    </span>
  )
}

/** Level, weekly goal, badges and a medal for every principle (stage) with the date it comes back. */
export default function ProgressScreen({ progress, onExit }) {
  const today = todayISO()
  const lv = level(progress.xp)
  const week = weekProgress(progress, today)
  const weeks = fullWeeks(progress)
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6" data-testid="progress">
      <header className="flex items-center gap-3 py-2">
        <button type="button" onClick={onExit} className="btn-ghost" aria-label="Wróć">
          ←
        </button>
        <h1 className="text-2xl font-extrabold text-white">Moje postępy</h1>
      </header>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="panel !p-4">
          <p className="eyebrow">Poziom</p>
          <p className="mt-1 text-xl font-extrabold text-white">{lv.name}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-lime-400" style={{ width: `${Math.round(lv.share * 100)}%` }} />
          </div>
          <p className="mt-1 text-xs text-slate-400">{lv.to ? `${progress.xp} / ${lv.to} XP` : `${progress.xp} XP — najwyższy poziom`}</p>
        </div>
        <div className="panel !p-4">
          <p className="eyebrow">Cel tygodnia</p>
          <WeekDots week={week} />
          <p className="mt-1 text-xs text-slate-400">
            {week.reached ? 'Cel osiągnięty — każdy kolejny trening to bonus.' : `Treningi dnia w tym tygodniu: ${week.done} z ${week.goal}.`} Pełne tygodnie: {weeks}.
          </p>
        </div>
        <div className="panel !p-4">
          <p className="eyebrow">Zasady</p>
          <p className="mt-1 text-xl font-extrabold text-white">
            {CATALOG.filter((c) => medalFor(progress.items[c.key])).length} / {CATALOG.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">z medalem: najlepsza decyzja w 1 dniu = brąz, w 3 dniach = srebro, w 5 dniach = złoto</p>
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-extrabold text-white">Odznaki</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Object.entries(BADGES).map(([id, b]) => {
          const got = progress.badges[id]
          return (
            <div key={id} className={`panel !p-3 ${got ? '' : 'opacity-40 grayscale'}`}>
              <p className="text-2xl" aria-hidden>
                {b.icon}
              </p>
              <p className="mt-1 text-sm font-bold text-white">{b.name}</p>
              <p className="text-xs leading-snug text-slate-400">{b.text}</p>
            </div>
          )
        })}
      </div>

      <h2 className="mb-1 mt-8 text-lg font-extrabold text-white">Zasady gry</h2>
      <p className="mb-3 text-sm text-slate-400">Każda decyzja uczy jednej zasady gry. Medal zasady to najsłabszy medal z jej decyzji.</p>
      <div className="space-y-6">
        {GRUPY.map((g) => {
          const fs = FUNDAMENTY.filter((f) => f.grupa === g.id && CATALOG.some((c) => c.fundament === f.id))
          if (!fs.length) return null
          return (
            <div key={g.id}>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">{g.label}</h3>
              <div className="space-y-3">
                {fs.map((f) => {
                  const stages = CATALOG.filter((c) => c.fundament === f.id)
                  const medals = stages.map((c) => medalFor(progress.items[c.key]))
                  const weakest = medals.includes(null) ? null : medals.reduce((a, b) => (MEDAL_ORDER[a.id] <= MEDAL_ORDER[b.id] ? a : b))
                  return (
                    <div key={f.id} className="panel !p-4">
                      <div className="flex items-start gap-3">
                        <Medal medal={weakest} />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white">
                            {f.nr}. {f.label}
                            {f.odWieku ? ` (od ${f.odWieku})` : ''}
                          </p>
                          {f.opis && <p className="text-xs text-slate-400">{f.opis}</p>}
                        </div>
                      </div>
                      <div className="mt-3 space-y-2 border-t border-slate-800 pt-3">
                        {stages.map((c) => {
                          const it = progress.items[c.key]
                          return (
                            <div key={c.key} className="flex items-center gap-3">
                              <Medal small medal={medalFor(it)} />
                              <p className="min-w-0 flex-1 truncate text-sm text-slate-200">
                                {c.scenarioTitle} <span className="text-slate-500">· {c.title}</span>
                              </p>
                              <span className="shrink-0 text-xs text-slate-500">{it ? `powtórka ${comesBack(it, today)}` : 'nowa'}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
