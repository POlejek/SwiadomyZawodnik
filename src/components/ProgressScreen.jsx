import { BADGES, comesBack, level, medalFor, streak, todayISO } from '../progress'
import { CATALOG, SCENARIOS } from '../scenarios'

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

/** Level, streak, badges and a medal for every principle (stage) with the date it comes back. */
export default function ProgressScreen({ progress, onExit }) {
  const today = todayISO()
  const lv = level(progress.xp)
  const days = streak(progress, today)
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
          <p className="eyebrow">Seria treningów</p>
          <p className="mt-1 text-xl font-extrabold text-white">
            🔥 {days} {days === 1 ? 'dzień' : 'dni'}
          </p>
          <p className="mt-1 text-xs text-slate-400">Jeden dzień przerwy nie przerywa serii.</p>
        </div>
        <div className="panel !p-4">
          <p className="eyebrow">Zasady</p>
          <p className="mt-1 text-xl font-extrabold text-white">
            {CATALOG.filter((c) => medalFor(progress.items[c.key])).length} / {CATALOG.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">z medalem (brąz 1×, srebro 3×, złoto 5× najlepsza decyzja)</p>
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

      <h2 className="mb-3 mt-8 text-lg font-extrabold text-white">Zasady</h2>
      <div className="space-y-4">
        {SCENARIOS.map((sc) => (
          <div key={sc.id} className="panel !p-4">
            <p className="font-bold text-white">{sc.title}</p>
            <div className="mt-3 space-y-3">
              {CATALOG.filter((c) => c.scenarioId === sc.id).map((c) => {
                const it = progress.items[c.key]
                return (
                  <div key={c.key} className="flex items-start gap-3">
                    <Medal medal={medalFor(it)} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-100">{c.title}</p>
                      <p className="text-xs leading-snug text-slate-400">{c.lesson}</p>
                    </div>
                    <span className="shrink-0 text-right text-xs text-slate-500">{it ? `powtórka ${comesBack(it, today)}` : 'nowa'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
