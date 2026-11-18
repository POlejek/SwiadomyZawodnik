// How situations are categorised — built to scale to hundreds of situations.
//
// Every situation (scenario) has:
//   faza        — phase of play (one)
//   strefa      — zone of the pitch where it happens (one)
//   liczebnosc  — numbers around the ball from the player's point of view, e.g. '2v1' (one)
//   positions   — positions it suits (several)
//   level       — difficulty
// Every stage (decision) has:
//   fundament   — the id of the ONE game principle (zasada gry) it teaches; medals, album cards
//                 and the progress screen are grouped by it. (The key keeps its older name.)
//
// The principles are the club's own model "ZASADY GRY": 10 in attack, 8 in defence, and one for each
// transition (AO — attack to defence, OA — defence to attack). Explanation, signal and key behaviour are
// filled in only where the club's own slides give them; the rest are to be completed from those slides.

export const FAZY = [
  { id: 'atak', label: 'Atak' },
  { id: 'obrona', label: 'Obrona' },
  { id: 'przejscie-obrona', label: 'Przejście do obrony (AO)' },
  { id: 'przejscie-atak', label: 'Przejście do ataku (OA)' },
  { id: 'stale-fragmenty', label: 'Stałe fragmenty' },
]

export const GRUPY = [
  { id: 'atak', label: 'Atak', opis: 'Otwarcie gry, budowa i kreowanie, finalizacja' },
  { id: 'ao', label: 'Przejście atak → obrona (AO)' },
  { id: 'obrona', label: 'Obrona' },
  { id: 'oa', label: 'Przejście obrona → atak (OA)' },
]

const OBS = 'Obserwacja boiska (przestrzeń, przeciwnicy, partnerzy).'

export const FUNDAMENTY = [
  // ATAK
  {
    id: 'struktura', nr: 1, grupa: 'atak', label: 'Zasada struktury',
    opis: 'Ustawienie szerokości i głębokości zespołu dla zawodnika z piłką (pozycjonowanie drużyny). Rozciągnięcie przeciwników — stworzenie więcej wolnej, realnej przestrzeni do ataku w sektorze środkowym.',
    sygnal: 'Drużyna posiada piłkę.', zachowanie: OBS,
  },
  {
    id: 'pierwszenstwo', nr: 2, grupa: 'atak', label: 'Zasada pierwszeństwa',
    opis: 'Wykorzystywanie lepiej ustawionego kolegi, następnie decyzja, jak swoim ustawieniem dalej mogę pomóc drużynie. Jeśli podanie do lepiej ustawionego kolegi jest niemożliwe, wybieramy wprowadzenie lub 1x1.',
    sygnal: 'Partner z drużyny jest lepiej ustawiony ode mnie = bliżej bramki przeciwnika, bez presji rywala.', zachowanie: OBS,
  },
  {
    id: 'odwaga-cierpliwosc', nr: 3, grupa: 'atak', label: 'Zasada odwaga vs cierpliwość',
    opis: 'Wykorzystywanie wolnych przestrzeni z piłką — poprzez wprowadzenie, podanie, uderzenie lub 1x1. Brak miejsca (zamknięta przestrzeń, przewaga rywali) = utrzymanie i zmiana miejsca ataku.',
    sygnal: 'Odwaga — mam przestrzeń. Cierpliwość — nie mam przestrzeni.', zachowanie: OBS,
  },
  {
    id: 'gotowosc-do-gry', nr: 4, grupa: 'atak', label: 'Zasada gotowości do gry',
    opis: 'Zawodnik w każdym momencie gry próbuje szybko zareagować na wydarzenia boiskowe. Szczególnie martwe momenty gry (SFG). Nie daje się zaskoczyć i sam próbuje zaskoczyć przeciwnika.',
    sygnal: 'W ataku — dezorganizacja przeciwnika. W obronie — szybka obserwacja piłki i przeciwników.',
    zachowanie: 'Obserwacja przeciwników w ataku. Obserwacja piłki i przeciwników w obronie.',
  },
  { id: 'atakowanie-przestrzeni', nr: 5, grupa: 'atak', label: 'Zasada atakowania i zwalniania przestrzeni' },
  { id: 'centrum-gry', nr: 6, grupa: 'atak', label: 'Zasada centrum gry +1' },
  { id: 'rotacja-pozycji', nr: 7, grupa: 'atak', label: 'Zasada rotacji pozycji' },
  { id: 'srodek', nr: 8, grupa: 'atak', label: 'Zasada środka' },
  { id: 'skupienie-uwagi', nr: 9, grupa: 'atak', label: 'Zasada skupienia uwagi' },
  { id: 'gotowy-do-obrony', nr: 10, grupa: 'atak', label: 'Zasada gotowy do obrony' },
  // AO
  { id: 'reakcja', nr: 1, grupa: 'ao', label: 'Zasada reakcji' },
  // OBRONA
  { id: 'tarcza', nr: 1, grupa: 'obrona', label: 'Zasada tarczy' },
  { id: 'razem', nr: 2, grupa: 'obrona', label: 'Zasada razem' },
  { id: 'powrot-pod-pilke', nr: 3, grupa: 'obrona', label: 'Zasada powrót pod piłkę' },
  { id: 'asekuracja', nr: 4, grupa: 'obrona', label: 'Zasada asekuracji' },
  { id: 'kontrola', nr: 5, grupa: 'obrona', label: 'Zasada kontroli' },
  { id: 'opoznianie', nr: 6, grupa: 'obrona', label: 'Zasada opóźniania' },
  { id: 'gotowosc-do-opadania', nr: 7, grupa: 'obrona', label: 'Zasada gotowość do opadania', odWieku: 'U12' },
  { id: 'skracanie-pola', nr: 8, grupa: 'obrona', label: 'Zasada skracania pola', odWieku: 'U12' },
  // OA
  { id: 'utrzymanie-zaskoczenie', nr: 1, grupa: 'oa', label: 'Zasada utrzymanie vs zaskoczenie' },
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
