// Principle: "Zasada gotowości do gry" (attack 4) — dead moments of the game (SFG): don't get caught out,
// try to catch the opponent out. The cue (the club's "Sygnał"): is the opponent disorganised?
// Disorganised → take the free kick at once; organised → play it calmly and keep the ball.
// The view is the OPPONENT's half: their goal at the top, we attack upwards (facingUp: 'home').

const reorganise = {
  d1: [{ t: 1.8, x: 34.5, y: 20.5 }],
  d2: [{ t: 1.8, x: 41, y: 19 }],
  m1: [{ t: 1.8, x: 41, y: 34 }],
  m2: [{ t: 1.8, x: 35, y: 33 }],
  fb: [{ t: 1.8, x: 52, y: 23 }],
}

const longBall = {
  id: 'daleko',
  label: 'Kopię piłkę daleko w pole karne',
  icon: 'clear',
  correct: false,
  outcome: 'Strata piłki',
  feedback:
    'Długie wykopnięcie w pole karne, w którym nie ma kolegi, to prezent dla bramkarza. Lepsze rozwiązanie było bliżej ciebie.',
  clip: {
    duration: 2.6,
    tracks: { gk: [{ t: 1.8, x: 35, y: 6 }], st: [{ t: 2.0, x: 36.5, y: 19 }] },
    ball: [
      { t: 0.4, on: 'ty' },
      { t: 1.8, on: 'gk', arc: 10 },
    ],
    events: [{ t: 1.8, text: 'Bramkarz łapie', tone: 'bad', dur: 1.4 }],
  },
  highlights: [{ type: 'arrow', from: [42, 41], to: [35.2, 7.5], tone: 'bad', label: 'do bramkarza', labelDx: 8, labelDy: 0 }],
}

const protest = (moves) => ({
  id: 'protest',
  label: 'Protestuję u sędziego, że rywal powinien dostać kartkę',
  correct: false,
  outcome: 'Żółta kartka',
  feedback:
    'Rzut wolny był dla was, a dyskusja z sędzią tylko dała rywalom czas — tobie przyniosła kartkę. W martwym momencie gry myśl o grze, nie o sędzi.',
  clip: {
    duration: 2.6,
    tracks: moves,
    events: [{ t: 1.0, text: 'Żółta kartka za dyskusję', tone: 'bad', dur: 1.8 }],
  },
  highlights: [{ type: 'circle', at: [42, 42], r: 3, tone: 'bad', label: 'stracony czas' }],
})

export const szybkiRzutWolny = {
  id: 'szybki-rzut-wolny',
  title: 'Szybki rzut wolny',
  subtitle: 'Martwy moment gry — zaskoczyć rywala czy spokojnie rozegrać?',
  faza: 'stale-fragmenty',
  strefa: 'tercja-srodkowa',
  liczebnosc: '2v2',
  positions: ['pomocnik', 'napastnik', 'obronca'],
  level: 'Łatwy',
  facingUp: 'home',
  brief:
    'Rywal sfaulował cię w środku boiska i sędzia gwizdnął rzut wolny dla was. Piłka leży przy tobie. Zanim zdecydujesz, sprawdź, co robią rywale.',

  entities: [
    { id: 'gk', team: 'awayGK', number: 1, x: 34, y: 2.5 },
    { id: 'd1', team: 'away', number: 4, x: 28, y: 17 },
    { id: 'd2', team: 'away', number: 5, x: 42, y: 16 },
    { id: 'fb', team: 'away', number: 2, x: 55, y: 21 },
    { id: 'm1', team: 'away', number: 6, x: 44, y: 38 },
    { id: 'm2', team: 'away', number: 8, x: 30, y: 33 },
    { id: 'ty', team: 'home', number: 8, x: 42, y: 42, you: true },
    { id: 'st', team: 'home', number: 9, x: 36, y: 24 },
    { id: 'w', team: 'home', number: 7, x: 57, y: 29 },
    { id: 'cm', team: 'home', number: 6, x: 33, y: 45 },
  ],
  ball: { on: 'ty' },

  stages: [
    {
      id: 'rzut-wolny',
      fundament: 'gotowosc-do-gry',
      title: 'Rzut wolny dla was',
      question: 'Faul na tobie, rzut wolny dla was. Patrz na rywali! Co robisz?',
      lesson:
        'Martwy moment gry to szansa. Rywale nieustawieni (stoją tyłem, dyskutują) — wykonaj szybko i zaskocz ich. Rywale ustawieni — spokojnie rozegraj i utrzymaj piłkę.',
      intro: {
        duration: 2.2,
        tracks: {
          m1: [{ t: 2.2, x: 45, y: 39 }],
          m2: [{ t: 2.2, x: 29, y: 35 }],
          d1: [{ t: 2.2, x: 27, y: 18.5 }],
          d2: [{ t: 2.2, x: 43, y: 18 }],
          fb: [{ t: 2.2, x: 55, y: 22 }],
          st: [{ t: 2.2, x: 37, y: 22.5 }],
          w: [{ t: 2.2, x: 57, y: 28 }],
          cm: [{ t: 2.2, x: 34, y: 44 }],
        },
        events: [
          { t: 0.1, text: 'Faul! Rzut wolny dla was', tone: 'info', dur: 1 },
          { t: 1.1, text: 'Rywale dyskutują z sędzią', tone: 'info', dur: 1.2 },
        ],
      },
      options: [
        {
          id: 'szybko',
          label: 'Wykonuję rzut wolny od razu, zanim rywale się ustawią',
          icon: 'pass',
          correct: true,
          outcome: 'Gol!',
          feedback:
            'Świetnie! Rywale stali tyłem i dyskutowali, a napastnik był wolny. Szybko wykonany rzut wolny zaskoczył całą obronę — to jest gotowość do gry.',
          clip: {
            duration: 3.6,
            tracks: {
              st: [{ t: 1.2, x: 36, y: 15 }, { t: 2.3, x: 35, y: 8 }],
              d1: [{ t: 2.3, x: 31, y: 11 }],
              d2: [{ t: 2.3, x: 39.5, y: 10 }],
              gk: [{ t: 2.0, x: 35, y: 4 }, { t: 2.6, x: 33.5, y: 2.5, pose: 'down' }],
              m1: [{ t: 2.5, x: 43, y: 35 }],
            },
            ball: [
              { t: 0.3, on: 'ty' },
              { t: 1.2, on: 'st' },
              { t: 2.3, on: 'st' },
              { t: 2.7, x: 31.5, y: -0.6, arc: 0.6 },
            ],
            events: [
              { t: 0.3, text: 'Szybko wykonany!', tone: 'good', dur: 1.2 },
              { t: 2.8, text: 'GOL', tone: 'good', dur: 3 },
            ],
          },
          highlights: [
            { type: 'arrow', from: [42, 41], to: [36.3, 15.8], tone: 'good', label: 'zaskoczenie', labelDx: 8, labelDy: 0 },
            { type: 'circle', at: [45, 39], r: 2.6, tone: 'info', label: 'rywal tyłem' },
          ],
        },
        {
          id: 'spokojnie',
          label: 'Spokojnie ustawiam piłkę i rozgrywam krótko do najbliższego kolegi',
          icon: 'pass',
          correct: false,
          quality: 1,
          outcome: 'Okazja minęła',
          feedback:
            'Piłka została u was, ale szansa przepadła: rywale stali tyłem i dyskutowali, a napastnik był wolny. Gdy rywal jest zdezorganizowany, to ty możesz go zaskoczyć.',
          clip: {
            duration: 2.6,
            tracks: { ...reorganise, cm: [{ t: 1.6, x: 34, y: 43 }] },
            ball: [
              { t: 0.9, on: 'ty' },
              { t: 1.6, on: 'cm' },
            ],
            events: [{ t: 1.6, text: 'Rywale zdążyli się ustawić', tone: 'bad', dur: 1.4 }],
          },
          highlights: [{ type: 'arrow', from: [42, 41], to: [36.8, 23.5], tone: 'info', label: 'był wolny napastnik', labelDx: -10, labelDy: 0 }],
        },
        protest(reorganise),
        longBall,
      ],
      variants: [
        {
          // Cue B: the opponents are already organised — a player stands in front of the ball, the striker is marked.
          variantId: 'rywale-ustawieni',
          intro: {
            duration: 2.2,
            tracks: {
              m1: [{ t: 2.2, x: 41, y: 34 }],
              m2: [{ t: 2.2, x: 35, y: 33 }],
              d1: [{ t: 2.2, x: 35.5, y: 20.5 }],
              d2: [{ t: 2.2, x: 41, y: 19 }],
              fb: [{ t: 2.2, x: 52, y: 23 }],
              st: [{ t: 2.2, x: 37, y: 22.5 }],
              w: [{ t: 2.2, x: 57, y: 28 }],
              cm: [{ t: 2.2, x: 34, y: 44 }],
            },
            events: [
              { t: 0.1, text: 'Faul! Rzut wolny dla was', tone: 'info', dur: 1 },
              { t: 1.1, text: 'Rywale wracają na pozycje', tone: 'info', dur: 1.2 },
            ],
          },
          options: [
            {
              id: 'szybko',
              label: 'Wykonuję rzut wolny od razu, zanim rywale się ustawią',
              icon: 'pass',
              correct: false,
              outcome: 'Strata piłki',
              feedback:
                'Rywale byli już ustawieni: zawodnik stojący przed piłką przeciął szybkie podanie. Szybkie wykonanie zaskakuje tylko rywala, który nie jest gotowy.',
              clip: {
                duration: 2.6,
                tracks: { m1: [{ t: 0.7, x: 40.6, y: 34.3 }, { t: 2.2, x: 44, y: 44 }] },
                ball: [
                  { t: 0.3, on: 'ty' },
                  { t: 0.7, on: 'm1' },
                ],
                events: [{ t: 0.7, text: 'Przechwyt!', tone: 'bad', dur: 1.4 }],
              },
              highlights: [{ type: 'circle', at: [41, 34], r: 2.8, tone: 'bad', label: 'rywal przed piłką' }],
            },
            {
              id: 'spokojnie',
              label: 'Spokojnie ustawiam piłkę i rozgrywam krótko do najbliższego kolegi',
              icon: 'pass',
              correct: true,
              outcome: 'Piłka utrzymana',
              feedback:
                'Dobrze! Rywale byli ustawieni, a napastnik kryty — szybkie zagranie skończyłoby się stratą. Spokojnie rozegrałeś i twoja drużyna dalej ma piłkę.',
              clip: {
                duration: 2.4,
                tracks: { cm: [{ t: 1.6, x: 34, y: 43 }] },
                ball: [
                  { t: 0.9, on: 'ty' },
                  { t: 1.6, on: 'cm' },
                ],
                events: [{ t: 1.6, text: 'Piłka utrzymana', tone: 'good', dur: 1.4 }],
              },
              highlights: [{ type: 'circle', at: [41, 34], r: 2.8, tone: 'info', label: 'rywale ustawieni' }],
            },
            protest({}),
            longBall,
          ],
        },
      ],
      timeout: {
        outcome: 'Okazja minęła',
        feedback:
          'Zastanawiałeś się zbyt długo — rywale wrócili na pozycje. W martwym momencie gry patrz na rywali od razu, zanim piłka się zatrzyma.',
        clip: {
          duration: 2.4,
          tracks: reorganise,
          events: [{ t: 1.2, text: 'Rywale się ustawili', tone: 'bad', dur: 1.2 }],
        },
      },
    },
  ],
}
