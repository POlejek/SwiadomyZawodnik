// The player's own profile, kept in this browser: name on the pitch, shirt number, position, shirt colour, age group.
import { load, save } from './storage'

export const POSITIONS = [
  { id: 'obronca', label: 'Obrońca' },
  { id: 'pomocnik', label: 'Pomocnik' },
  { id: 'napastnik', label: 'Napastnik' },
  { id: 'wszystkie', label: 'Gram wszędzie' },
]

// Shirt colours that stay distinct from the opponents (red), our goalkeeper (yellow) and theirs (black).
export const SHIRTS = [
  { id: 'niebieski', label: 'Niebieski', fill: '#2563eb', text: '#ffffff' },
  { id: 'granatowy', label: 'Granatowy', fill: '#1e3a8a', text: '#ffffff' },
  { id: 'blekitny', label: 'Błękitny', fill: '#0ea5e9', text: '#ffffff' },
  { id: 'fioletowy', label: 'Fioletowy', fill: '#7c3aed', text: '#ffffff' },
  { id: 'pomaranczowy', label: 'Pomarańczowy', fill: '#ea580c', text: '#ffffff' },
  { id: 'bialy', label: 'Biały', fill: '#f8fafc', text: '#0f172a' },
]

export const DEFAULT_PROFILE = { name: '', number: null, position: 'wszystkie', shirt: 'niebieski' }

export function loadProfile() {
  const saved = load('profile', null)
  return saved ? { ...DEFAULT_PROFILE, ...saved } : null
}

export function saveProfile(profile) {
  save('profile', profile)
}

export const shirtOf = (profile) => SHIRTS.find((s) => s.id === profile?.shirt) ?? SHIRTS[0]

/** Short name for the label above the player on the pitch. */
export const pitchName = (profile) => (profile?.name?.trim() ? profile.name.trim().slice(0, 10).toUpperCase() : 'TY')

/** The scenario's players with the profile's shirt number on "TY" (a team-mate with that number swaps). */
export function personalise(entities, profile) {
  const n = profile?.number
  const you = entities.find((e) => e.you)
  if (!n || !you || n === you.number) return entities
  return entities.map((e) => {
    if (e.you) return { ...e, number: n }
    if (e.team === 'home' && e.number === n) return { ...e, number: you.number }
    return e
  })
}

export function suitsPosition(scenario, profile) {
  const pos = profile?.position
  return !pos || pos === 'wszystkie' || (scenario.positions ?? []).includes(pos)
}
