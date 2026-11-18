import { BADGES } from '../progress'

/** Pop-ups at the bottom of the screen: new badges, new album cards, a higher card rating. */
export default function Toasts({ toasts }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
      {toasts.slice(-3).map((t) => {
        let icon = t.icon
        let title = t.title
        let text = t.text
        if (t.badge) {
          const b = BADGES[t.badge]
          if (!b) return null
          icon = b.icon
          title = 'Nowa odznaka'
          text = b.name
        }
        return (
          <div key={t.id} className="toast">
            <span className="text-2xl" aria-hidden>
              {icon}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-lime-300">{title}</p>
              <p className="font-bold text-white">{text}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
