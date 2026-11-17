// How situations are categorised — built to scale to hundreds of situations.
//
// Every situation (scenario) has:
//   faza        — phase of play (one)
//   strefa      — zone of the pitch where it happens (one)
//   liczebnosc  — numbers around the ball from the player's point of view, e.g. '2v1' (one)
//   positions   — positions it suits (several)
//   level       — difficulty
// Every stage (decision) has:
//   fundament   — the one game fundamental it teaches; medals and the progress screen are grouped by it.
//
// The fundamentals follow the usual split used in Polish youth coaching (in attack / in defence,
// individual / group, plus transitions). The names are a working list — to be matched word for word
// with "Dorastanie w grze" (M. Ludwiczak, T. Tchórz), chapter on the fundamentals of the game.

export const FAZY = [
  { id: 'atak', label: 'Atak' },
  { id: 'obrona', label: 'Obrona' },
  { id: 'przejscie-obrona', label: 'Przejście do obrony' },
  { id: 'przejscie-atak', label: 'Przejście do ataku' },
  { id: 'stale-fragmenty', label: 'Stałe fragmenty' },
]

export const GRUPY = [
  { id: 'atak-ind', faza: 'atak', label: 'Atak · indywidualne' },
  { id: 'atak-grp', faza: 'atak', label: 'Atak · grupowe' },
  { id: 'obrona-ind', faza: 'obrona', label: 'Obrona · indywidualne' },
  { id: 'obrona-grp', faza: 'obrona', label: 'Obrona · grupowe' },
  { id: 'przejscia', faza: 'przejscia', label: 'Przejścia' },
]

export const FUNDAMENTY = [
  // Atak — indywidualne
  { id: 'orientacja', grupa: 'atak-ind', label: 'Orientacja przed przyjęciem', opis: 'Rozejrzyj się, zanim dostaniesz piłkę.' },
  { id: 'przyjecie-kierunkowe', grupa: 'atak-ind', label: 'Przyjęcie kierunkowe', opis: 'Pierwszy kontakt w wolną przestrzeń, z dala od rywala.' },
  { id: 'gra-tylem', grupa: 'atak-ind', label: 'Gra tyłem do bramki', opis: 'Rywal blisko — odegraj; rywal daleko — obróć się.' },
  { id: 'prowadzenie', grupa: 'atak-ind', label: 'Prowadzenie piłki w wolną przestrzeń', opis: 'Prowadź piłkę tam, gdzie jest miejsce i droga do bramki.' },
  { id: 'drybling', grupa: 'atak-ind', label: 'Gra 1 na 1 w ataku', opis: 'Atakuj obrońcę, gdy masz za nim przestrzeń.' },
  { id: 'wykonczenie', grupa: 'atak-ind', label: 'Wykończenie', opis: 'Celuj tam, gdzie nie ma bramkarza.' },
  // Atak — grupowe
  { id: 'wsparcie', grupa: 'atak-grp', label: 'Wsparcie (pokazanie się do gry)', opis: 'Ustaw się w wolnej linii podania, z otwartym ciałem.' },
  { id: 'przewaga', grupa: 'atak-grp', label: 'Gra w przewadze', opis: 'Zaangażuj obrońcę, potem podaj do wolnego.' },
  { id: 'podanie-przez-linie', grupa: 'atak-grp', label: 'Podanie przez linię', opis: 'Graj tam, gdzie rywal nie zamyka.' },
  { id: 'gra-bez-pilki', grupa: 'atak-grp', label: 'Gra bez piłki w polu karnym', opis: 'Atakuj przestrzeń przed obrońcą.' },
  // Obrona — indywidualne
  { id: 'dystans', grupa: 'obrona-ind', label: 'Doskok i dystans', opis: 'Skracaj dystans, gdy piłka leci; hamuj przed rywalem.' },
  { id: 'opoznianie', grupa: 'obrona-ind', label: 'Opóźnianie', opis: 'W osłabieniu nie doskakuj — kupuj czas.' },
  { id: 'kierowanie', grupa: 'obrona-ind', label: 'Kierowanie rywala', opis: 'Ustaw ciało bokiem i spychaj rywala do linii.' },
  { id: 'odbior', grupa: 'obrona-ind', label: 'Odbiór i walka o piłkę', opis: 'Atakuj piłkę, gdy rywal wypuści ją za daleko.' },
  { id: 'bezpieczenstwo', grupa: 'obrona-ind', label: 'Bezpieczeństwo przy własnej bramce', opis: 'Bezpańska piłka w polu karnym — wybij w bok.' },
  // Obrona — grupowe
  { id: 'asekuracja', grupa: 'obrona-grp', label: 'Asekuracja', opis: 'Stań skośnie za kolegą, który atakuje piłkę.' },
  { id: 'linia-podania', grupa: 'obrona-grp', label: 'Zamykanie linii podania', opis: 'Pilnuj podania, a nie tylko zawodnika.' },
  // Przejścia
  { id: 'kontrpressing', grupa: 'przejscia', label: 'Kontrpressing', opis: 'Po stracie blisko piłki — doskocz od razu.' },
  { id: 'powrot', grupa: 'przejscia', label: 'Powrót za linię piłki', opis: 'Po stracie daleko od piłki — wróć i zamknij środek.' },
]

export const STREFY = [
  { id: 'tercja-obronna', label: 'Tercja obronna' },
  { id: 'tercja-srodkowa', label: 'Środek boiska' },
  { id: 'tercja-ataku', label: 'Tercja ataku' },
]

export const POZYCJE = [
  { id: 'obronca', label: 'Obrońca' },
  { id: 'pomocnik', label: 'Pomocnik' },
  { id: 'napastnik', label: 'Napastnik' },
]

export const POZIOMY = ['Łatwy', 'Średni', 'Trudny']

export const fundament = (id) => FUNDAMENTY.find((f) => f.id === id)
export const grupa = (id) => GRUPY.find((g) => g.id === id)
export const faza = (id) => FAZY.find((f) => f.id === id)

/** All fundamentals a situation teaches (from its stages, in order, without repeats). */
export function fundamentyOf(scenario) {
  return [...new Set(scenario.stages.map((s) => s.fundament))]
}

/** Problems with a scenario's categories (empty = OK). */
export function checkTaxonomy(sc) {
  const p = []
  if (!faza(sc.faza)) p.push(`nieznana faza "${sc.faza}"`)
  if (!STREFY.some((s) => s.id === sc.strefa)) p.push(`nieznana strefa "${sc.strefa}"`)
  if (!/^\d+v\d+$/.test(sc.liczebnosc ?? '')) p.push(`liczebność w formacie np. "2v1", jest "${sc.liczebnosc}"`)
  if (!POZIOMY.includes(sc.level)) p.push(`nieznany poziom "${sc.level}"`)
  if (!(sc.positions ?? []).length || sc.positions.some((x) => !POZYCJE.some((q) => q.id === x))) p.push('pozycje spoza listy')
  for (const st of sc.stages) if (!fundament(st.fundament)) p.push(`etap ${st.id}: nieznany fundament "${st.fundament}"`)
  return p
}

/**
 * Filters for the library. `f` = { q, faza, fundament, pozycja, liczebnosc, poziom, strefa, status }
 * status: 'nowe' (never played) | 'powtorki' (a stage is due) | ''.
 */
export function filterScenarios(scenarios, f, { played = () => false, due = () => false } = {}) {
  const q = (f.q ?? '').trim().toLowerCase()
  return scenarios.filter((sc) => {
    if (f.faza && sc.faza !== f.faza && !(f.faza === 'przejscia' && sc.faza.startsWith('przejscie'))) return false
    if (f.fundament && !fundamentyOf(sc).includes(f.fundament)) return false
    if (f.pozycja && !sc.positions.includes(f.pozycja)) return false
    if (f.liczebnosc && sc.liczebnosc !== f.liczebnosc) return false
    if (f.poziom && sc.level !== f.poziom) return false
    if (f.strefa && sc.strefa !== f.strefa) return false
    if (f.status === 'nowe' && played(sc)) return false
    if (f.status === 'powtorki' && !due(sc)) return false
    if (q) {
      const text = [sc.title, sc.subtitle, sc.brief, ...fundamentyOf(sc).map((id) => fundament(id)?.label)].join(' ').toLowerCase()
      if (!text.includes(q)) return false
    }
    return true
  })
}
