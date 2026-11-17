import { useState } from 'react'

/** Link with a set of situations chosen by the coach — no accounts needed: the set lives in the link itself. */
export function setLink(ids, title) {
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}#zestaw=${ids.join(',')}${title ? `&tytul=${encodeURIComponent(title)}` : ''}`
}

export function readSetFromHash(hash, knownIds) {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  const ids = (params.get('zestaw') ?? '').split(',').filter((id) => knownIds.includes(id))
  if (!ids.length) return null
  return { ids, title: params.get('tytul') ?? 'Zestaw od trenera', key: `set:${ids.join(',')}:${params.get('tytul') ?? ''}` }
}

export async function shareText(text) {
  try {
    if (navigator.share) {
      await navigator.share({ text })
      return 'shared'
    }
  } catch {
    /* cancelled — fall back to copying */
  }
  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return 'failed'
  }
}

export default function CoachPanel({ scenarios, onClose }) {
  const [ids, setIds] = useState(scenarios.map((s) => s.id))
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('')
  const link = ids.length ? setLink(ids, title.trim()) : ''
  const toggle = (id) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="coach-title">
      <div className="modal">
        <p className="eyebrow">Dla trenera</p>
        <h2 id="coach-title" className="mt-1 text-2xl font-extrabold text-white">
          Zestaw sytuacji dla drużyny
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Wybierz sytuacje, np. temat tygodnia, i wyślij link zawodnikom. Po rozegraniu zawodnik jednym przyciskiem odeśle ci swój wynik.
        </p>

        <label className="field mt-4">
          <span>Nazwa zestawu</span>
          <input value={title} maxLength={40} placeholder="np. Tydzień 12: obrona w przewadze rywala" onChange={(e) => setTitle(e.target.value)} />
        </label>

        <div className="mt-4 space-y-2">
          {scenarios.map((sc) => (
            <label key={sc.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-800 px-3 py-2.5 text-sm text-slate-200">
              <input type="checkbox" className="h-4 w-4 accent-lime-400" checked={ids.includes(sc.id)} onChange={() => toggle(sc.id)} />
              <span className="flex-1">{sc.title}</span>
              <span className="text-xs text-slate-500">{sc.category}</span>
            </label>
          ))}
        </div>

        {link && (
          <div className="mt-4 break-all rounded-lg bg-slate-950 p-3 font-mono text-xs text-lime-300" data-testid="set-link">
            {link}
          </div>
        )}
        {status && <p className="mt-2 text-sm text-lime-300">{status}</p>}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Zamknij
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!link}
            onClick={async () => {
              const r = await shareText(link)
              setStatus(r === 'copied' ? 'Link skopiowany — wklej go w wiadomości do drużyny.' : r === 'shared' ? 'Link wysłany.' : 'Skopiuj link powyżej.')
            }}
          >
            Wyślij / skopiuj link
          </button>
        </div>
      </div>
    </div>
  )
}
