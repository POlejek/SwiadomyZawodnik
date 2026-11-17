// Small pictograms next to the answers, so younger players read less: pass, shot, dribble, press, …

const PATHS = {
  pass: (
    <>
      <circle cx="5" cy="15" r="2.5" />
      <path d="M8 13 L18 6 M13 6 h5 v5" />
    </>
  ),
  shot: (
    <>
      <path d="M12 4 h8 v7 h-8 z" />
      <circle cx="5" cy="17" r="2.5" />
      <path d="M7.5 15 L14 9" />
    </>
  ),
  dribble: (
    <>
      <path d="M3 18 l4 -4 l-2 -3 l4 -4 l-2 -3" />
      <circle cx="16" cy="6" r="2.5" />
    </>
  ),
  run: <path d="M4 16 C 8 6, 14 6, 19 5 M15 3 l4 2 l-2 4" />,
  press: (
    <>
      <path d="M3 12 h12 M11 8 l4 4 l-4 4" />
      <circle cx="19" cy="12" r="2" />
    </>
  ),
  retreat: <path d="M19 12 H6 M10 8 l-4 4 l4 4" />,
  wait: (
    <>
      <path d="M8 6 v12 M16 6 v12" />
    </>
  ),
  tackle: (
    <>
      <path d="M3 17 h11 l4 -3" />
      <circle cx="19" cy="11" r="2" />
    </>
  ),
  clear: (
    <>
      <path d="M4 18 C 8 4, 16 4, 20 12" />
      <circle cx="4" cy="18" r="1.8" />
    </>
  ),
  block: (
    <>
      <path d="M12 3 l7 3 v5 c0 5 -3 8 -7 10 c-4 -2 -7 -5 -7 -10 v-5 z" />
    </>
  ),
  card: <rect x="8" y="4" width="8" height="12" rx="1.5" transform="rotate(12 12 10)" />,
}

const RULES = [
  [/strzel|uderzam|dotykam piłkę z pierwszej/i, 'shot'],
  [/wybijam/i, 'clear'],
  [/wślizg/i, 'tackle'],
  [/koszulk|protestuj/i, 'card'],
  [/podaj|przepuszczam|odgryw/i, 'pass'],
  [/czekam|zatrzymuj|zostaję|zwalniam|odwracam/i, 'wait'],
  [/cofam|wracam|odpuszczam|odsuwam/i, 'retreat'],
  [/staję|ustawiam się/i, 'block'],
  [/doskak|atakuję|skracam|wchodzę ciałem|biegnę|wychodzę/i, 'press'],
  [/^na (bliższy|dalszy)|przesuwam|podbiegam|uciekam daleko/i, 'run'],
  [/prowadzę|uciekam|minąć|przyjmuję|obracam/i, 'dribble'],
]

export const ICON_NAMES = Object.keys(PATHS)

export function iconFor(option) {
  if (option.icon) return option.icon
  return RULES.find(([re]) => re.test(option.label))?.[1] ?? null
}

export function MoveIcon({ name, className = '' }) {
  if (!PATHS[name]) return null
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {PATHS[name]}
    </svg>
  )
}
