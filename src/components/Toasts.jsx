import { BADGES } from '../progress'

/** New badges pop up at the bottom of the screen for a few seconds. */
export default function Toasts({ toasts }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
      {toasts.map((t) => {
        const b = BADGES[t.badge]
        return (
          <div key={t.id} className="toast">
            <span className="text-2xl" aria-hidden>
              {b.icon}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-lime-300">Nowa odznaka</p>
              <p className="font-bold text-white">{b.name}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
