import { useState } from 'react'
import { AGE_GROUPS } from '../engine/game'
import { DEFAULT_PROFILE, POSITIONS, SHIRTS } from '../profile'

/** Who is playing: name on the pitch, shirt number and colour, position, age group. Shown on the first visit. */
export default function ProfileModal({ profile, ageGroup, onSave, onClose, first }) {
  const [p, setP] = useState(profile ?? DEFAULT_PROFILE)
  const [age, setAge] = useState(ageGroup)
  const set = (patch) => setP((cur) => ({ ...cur, ...patch }))
  const shirt = SHIRTS.find((s) => s.id === p.shirt) ?? SHIRTS[0]
  const save = () => onSave({ ...p, name: p.name.trim().slice(0, 12) }, age)

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="profile-title">
      <div className="modal">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">{first ? 'Witaj!' : 'Profil'}</p>
            <h2 id="profile-title" className="mt-1 text-2xl font-extrabold text-white">
              Twój zawodnik
            </h2>
          </div>
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-xl font-black ring-4 ring-yellow-300" style={{ background: shirt.fill, color: shirt.text }}>
            {p.number || '?'}
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-[1fr_96px] gap-3">
            <label className="field">
              <span>Imię lub ksywka</span>
              <input value={p.name} maxLength={12} placeholder="np. Kuba" onChange={(e) => set({ name: e.target.value })} />
            </label>
            <label className="field">
              <span>Numer</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={99}
                value={p.number ?? ''}
                onChange={(e) => {
                  const n = Number(e.target.value)
                  set({ number: n >= 1 && n <= 99 ? Math.round(n) : null })
                }}
              />
            </label>
          </div>

          <fieldset>
            <legend className="field-label">Pozycja</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {POSITIONS.map((pos) => (
                <button key={pos.id} type="button" className={`pill ${p.position === pos.id ? 'pill-on' : ''}`} aria-pressed={p.position === pos.id} onClick={() => set({ position: pos.id })}>
                  {pos.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="field-label">Kolor koszulki</legend>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {SHIRTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`h-10 w-10 rounded-full border-2 transition ${p.shirt === s.id ? 'border-yellow-300 scale-110' : 'border-slate-600'}`}
                  style={{ background: s.fill }}
                  aria-label={s.label}
                  aria-pressed={p.shirt === s.id}
                  onClick={() => set({ shirt: s.id })}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="field-label">Grupa wiekowa</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {AGE_GROUPS.map((g) => (
                <button key={g.id} type="button" className={`pill ${age === g.id ? 'pill-on' : ''}`} aria-pressed={age === g.id} onClick={() => setAge(g.id)}>
                  {g.label} <span className="font-normal opacity-70">· {g.seconds} s</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {!first && (
            <button type="button" className="btn-secondary" onClick={onClose}>
              Anuluj
            </button>
          )}
          {first && (
            <button type="button" className="btn-secondary" onClick={() => onSave(DEFAULT_PROFILE, age)}>
              Pomiń
            </button>
          )}
          <button type="button" className="btn-primary" onClick={save}>
            {first ? 'Gramy!' : 'Zapisz'}
          </button>
        </div>
      </div>
    </div>
  )
}
