// Fundamental: support — showing for the ball. "TY" (no. 8) is a central midfielder hidden behind an opponent.
// Stage 2: receiving side-on and playing forward.
// The view is the OPPONENT's half: their goal at the top, we attack upwards (facingUp: 'home').

export const pokazSieDoGry = {
  id: 'pokaz-sie-do-gry',
  title: 'Pokaż się do gry',
  subtitle: 'Kolega z piłką jest pod presją, a ty stoisz za plecami rywala',
  faza: 'atak',
  strefa: 'tercja-srodkowa',
  liczebnosc: '2v2',
  positions: ['pomocnik', 'obronca'],
  level: 'Łatwy',
  facingUp: 'home',
  brief:
    'Wasz obrońca ma piłkę, a napastnik rywala biegnie do niego. Jesteś środkowym pomocnikiem i stoisz za plecami pomocnika rywala — kolega nie może do ciebie podać.',

  entities: [
    { id: 'gk', team: 'awayGK', number: 1, x: 34, y: 2.5 },
    { id: 'cb1', team: 'away', number: 4, x: 30, y: 15 },
    { id: 'cb2', team: 'away', number: 5, x: 40, y: 15 },
    { id: 'm1', team: 'away', number: 6, x: 36, y: 35 },
    { id: 'm2', team: 'away', number: 8, x: 49, y: 27 },
    { id: 'f9', team: 'away', number: 9, x: 33, y: 47 },
    { id: 'cm', team: 'home', number: 5, x: 30, y: 41 },
    { id: 'ty', team: 'home', number: 8, x: 40, y: 32, you: true },
    { id: 'st', team: 'home', number: 9, x: 35, y: 19 },
    { id: 'w', team: 'home', number: 7, x: 58, y: 23 },
  ],
  ball: { on: 'cm' },

  stages: [
    {
      id: 'gdzie-sie-pokazac',
      fundament: 'wsparcie',
      title: 'Gdzie się pokazać?',
      question: 'Kolega z piłką jest pod presją. Stoisz za plecami pomocnika rywala. Co robisz?',
      lesson:
        'Pokaż się do gry tam, gdzie nie zasłania cię rywal: w wolnej linii podania, kilka metrów od kolegi, ustawiony bokiem.',
      intro: {
        duration: 1.8,
        tracks: {
          f9: [{ t: 1.8, x: 31.5, y: 43.5 }],
          cm: [{ t: 1.8, x: 30, y: 40.5 }],
          m1: [{ t: 1.8, x: 36, y: 35.2 }],
          st: [{ t: 1.8, x: 35, y: 18.5 }],
          cb1: [{ t: 1.8, x: 32, y: 16 }],
        },
        events: [{ t: 0.2, text: 'Napastnik rywala doskakuje do kolegi', tone: 'info', dur: 1.6 }],
      },
      options: [
        {
          id: 'wolna-linia',
          label: 'Przesuwam się w wolną linię podania i ustawiam bokiem',
          correct: true,
          outcome: 'Jesteś do gry',
          feedback:
            'Dobrze! Wyszedłeś zza pleców rywala w miejsce, gdzie kolega cię widzi i może bezpiecznie podać. Ustawiony bokiem widzisz i kolegę, i boisko przed sobą.',
          clip: {
            duration: 2.2,
            tracks: {
              ty: [{ t: 1.0, x: 45, y: 37.5 }],
              m1: [{ t: 2.2, x: 38.5, y: 35.5 }],
              f9: [{ t: 1.2, x: 31, y: 42 }],
            },
            ball: [
              { t: 1.0, on: 'cm' },
              { t: 1.8, on: 'ty' },
            ],
            events: [{ t: 1.2, text: 'Wolna linia podania', tone: 'good', dur: 1.4 }],
          },
          highlights: [
            { type: 'cross', from: [30, 39.5], to: [40, 32], tone: 'bad', label: 'zasłonięte', labelDx: -3, labelDy: -2.4 },
            { type: 'arrow', from: [30, 39.5], to: [44.3, 37.6], tone: 'good', label: 'wolna linia', labelDy: 2.4 },
          ],
        },
        {
          id: 'za-rywalem',
          label: 'Zostaję w miejscu i wołam o piłkę',
          correct: false,
          outcome: 'Przechwyt',
          feedback:
            'Stałeś za plecami rywala — podanie do ciebie musiało przejść przez niego. Wołanie nie pomoże, jeśli kolega nie ma wolnej linii podania.',
          clip: {
            duration: 2.4,
            tracks: {
              m1: [{ t: 0.9, x: 36.4, y: 35.6 }, { t: 2.4, x: 37, y: 42 }],
              ty: [{ t: 2.4, x: 40, y: 33 }],
            },
            ball: [
              { t: 0.4, on: 'cm' },
              { t: 0.9, on: 'm1' },
            ],
            events: [{ t: 0.9, text: 'Przechwyt!', tone: 'bad', dur: 1.4 }],
          },
          highlights: [{ type: 'cross', from: [30, 39.5], to: [40, 32], tone: 'bad', label: 'rywal w linii podania', labelDx: 2, labelDy: -2.6 }],
        },
        {
          id: 'do-kolegi',
          label: 'Podbiegam blisko kolegi z piłką',
          correct: false,
          outcome: 'Strata piłki',
          feedback:
            'Podbiegając blisko, ściągnąłeś do kolegi drugiego rywala. Na małej przestrzeni napastnik rywala zabrał piłkę wam obu.',
          clip: {
            duration: 2.6,
            tracks: {
              ty: [{ t: 1.0, x: 32.5, y: 38 }],
              m1: [{ t: 1.2, x: 33.5, y: 37 }],
              f9: [{ t: 1.4, x: 31, y: 41.6 }],
            },
            ball: [
              { t: 1.3, on: 'cm' },
              { t: 1.5, on: 'f9' },
            ],
            events: [{ t: 1.5, text: 'Dwóch na małej przestrzeni — strata', tone: 'bad', dur: 1.4 }],
          },
          highlights: [{ type: 'circle', at: [31.5, 39.5], r: 3.6, tone: 'bad', label: 'za ciasno' }],
        },
        {
          id: 'daleko',
          label: 'Uciekam daleko do przodu, pod pole karne',
          correct: false,
          quality: 1,
          outcome: 'Wybicie do rywala',
          feedback:
            'Bieg do przodu może się przydać, ale kolega pod presją nie miał krótkiego podania — musiał wybić długo, a obrońcy rywala łatwo przejęli piłkę.',
          clip: {
            duration: 2.8,
            tracks: {
              ty: [{ t: 1.6, x: 41, y: 20 }],
              cb2: [{ t: 2.0, x: 40.5, y: 17 }],
            },
            ball: [
              { t: 0.9, on: 'cm' },
              { t: 2.1, on: 'cb2', arc: 8 },
            ],
            events: [{ t: 2.1, text: 'Piłka u rywala', tone: 'bad', dur: 1.4 }],
          },
          highlights: [{ type: 'arrow', from: [40, 32], to: [41, 21], tone: 'info', label: 'za daleko od kolegi', labelDx: 9, labelDy: 0 }],
        },
      ],
      timeout: {
        optionId: 'za-rywalem',
        feedback:
          'Zanim się ruszyłeś, kolega pod presją musiał podać — a ty wciąż stałeś za plecami rywala. Pokazuj się do gry, zanim kolega dostanie presję.',
      },
    },

    {
      id: 'gra-do-przodu',
      fundament: 'orientacja',
      title: 'Przyjęcie bokiem',
      question: 'Dostałeś piłkę, ustawiony bokiem. Pomocnik rywala biegnie do ciebie. Skrzydłowy jest wolny. Co robisz?',
      lesson:
        'Ustawiony bokiem widzisz całe boisko: pierwszym kontaktem idź w wolne miejsce i graj do przodu, jeśli tylko się da.',
      intro: {
        duration: 0.8,
        tracks: { m2: [{ t: 0.8, x: 48, y: 31 }] },
        events: [{ t: 0, text: 'Rywal doskakuje', tone: 'info', dur: 0.8 }],
      },
      options: [
        {
          id: 'do-przodu',
          label: 'Przyjmuję w wolne miejsce i podaję do przodu do skrzydłowego',
          correct: true,
          outcome: 'Gra do przodu',
          feedback:
            'Świetnie! Pierwszym kontaktem odszedłeś od rywala i od razu zagrałeś do wolnego skrzydłowego. Dwa kontakty — i akcja jest 20 metrów dalej.',
          clip: {
            duration: 2.8,
            tracks: {
              ty: [{ t: 0.4, x: 44, y: 36 }],
              m2: [{ t: 1.0, x: 45.5, y: 34 }],
              w: [{ t: 1.4, x: 58.5, y: 21.5 }, { t: 2.8, x: 60, y: 13 }],
            },
            ball: [
              { t: 0.5, on: 'ty' },
              { t: 1.4, on: 'w' },
            ],
            events: [{ t: 1.4, text: 'Gra do przodu!', tone: 'good', dur: 1.4 }],
          },
          highlights: [{ type: 'arrow', from: [44, 35], to: [57.8, 22.6], tone: 'good', label: 'do wolnego', labelDx: 6, labelDy: 0 }],
        },
        {
          id: 'do-tylu',
          label: 'Odgrywam z powrotem do kolegi, od którego dostałem piłkę',
          correct: false,
          quality: 1,
          outcome: 'Akcja cofnięta',
          feedback:
            'Odegranie do tyłu było bezpieczne, ale kolega wciąż był pod presją i musiał wybić. Skrzydłowy był wolny — to był moment na grę do przodu.',
          clip: {
            duration: 3.0,
            tracks: {
              f9: [{ t: 1.3, x: 30.8, y: 41.2 }],
              cb1: [{ t: 2.6, x: 36, y: 12 }],
            },
            ball: [
              { t: 0.3, on: 'ty' },
              { t: 1.1, on: 'cm' },
              { t: 1.4, on: 'cm' },
              { t: 2.6, on: 'cb1', arc: 8 },
            ],
            events: [{ t: 1.6, text: 'Akcja cofnięta', tone: 'bad', dur: 1.4 }],
          },
          highlights: [{ type: 'arrow', from: [45, 36.5], to: [57.8, 22.6], tone: 'info', label: 'wolny skrzydłowy', labelDx: 7, labelDy: 0 }],
        },
        {
          id: 'drybling',
          label: 'Prowadzę piłkę prosto na rywala',
          correct: false,
          outcome: 'Strata piłki',
          feedback:
            'Prowadząc piłkę w stronę rywala, ułatwiłeś mu odbiór. Przyjęcie bokiem jest po to, żeby grać w wolne miejsce, a nie w przeciwnika.',
          clip: {
            duration: 2.4,
            tracks: {
              ty: [{ t: 0.8, x: 46.5, y: 34 }],
              m2: [{ t: 0.8, x: 47.2, y: 32.6 }, { t: 2.0, x: 50, y: 38 }],
            },
            ball: [
              { t: 0.8, on: 'ty' },
              { t: 0.95, on: 'm2' },
            ],
            events: [{ t: 0.95, text: 'Strata', tone: 'bad', dur: 1.4 }],
          },
          highlights: [{ type: 'arrow', from: [45, 36.5], to: [57.8, 22.6], tone: 'info', label: 'wolny skrzydłowy', labelDx: 7, labelDy: 0 }],
        },
        {
          id: 'zatrzymaj',
          label: 'Zatrzymuję piłkę i rozglądam się',
          correct: false,
          outcome: 'Strata piłki',
          feedback:
            'Rozglądać trzeba się zanim dostaniesz piłkę. Gdy ją zatrzymałeś, rywale doskoczyli z dwóch stron i zabrali ci ją.',
          clip: {
            duration: 2.4,
            tracks: {
              m2: [{ t: 1.0, x: 46, y: 35 }],
              m1: [{ t: 1.0, x: 43, y: 37.5 }],
            },
            ball: [
              { t: 1.0, on: 'ty' },
              { t: 1.15, on: 'm2' },
            ],
            events: [{ t: 1.15, text: 'Strata', tone: 'bad', dur: 1.4 }],
          },
          highlights: [{ type: 'circle', at: [45, 36.5], r: 3.6, tone: 'bad', label: 'dwóch rywali' }],
        },
      ],
      timeout: {
        optionId: 'zatrzymaj',
        feedback:
          'Zbyt długo się zastanawiałeś i rywale doskoczyli z dwóch stron. Rozglądaj się, zanim dostaniesz piłkę — wtedy decyzja jest gotowa.',
      },
    },
  ],
}
