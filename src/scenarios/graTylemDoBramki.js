// Fundamental: playing with your back to goal. "TY" (no. 9) receives from a team-mate behind him.
// The cue is the defender: tight on your back → lay it off first time; far away → turn and attack.
// The view is the OPPONENT's half: their goal at the top, we attack upwards (facingUp: 'home').

const turnOver = (text) => ({ t: 0.7, text, tone: 'bad', dur: 1.6 })

const switchPlay = {
  id: 'przerzut',
  label: 'Podaję z pierwszej daleko na skrzydło',
  correct: false,
  quality: 1,
  outcome: 'Piłka poza boiskiem',
  feedback:
    'Podanie z pierwszej na 30 metrów, tyłem do celu, to loteria — piłka wyszła na aut. Kolega był kilka metrów od ciebie, a prostsze rozwiązanie było pod ręką.',
  clip: {
    duration: 2.6,
    tracks: {
      w: [{ t: 1.6, x: 59, y: 17 }],
      cm: [{ t: 2.6, x: 31, y: 33 }],
    },
    ball: [
      { t: 0.3, x: 34, y: 26.6 },
      { t: 1.6, x: 64, y: 15, arc: 5 },
      { t: 2.2, x: 69.5, y: 13 },
    ],
    events: [{ t: 1.8, text: 'Za mocno — aut', tone: 'bad', dur: 1.4 }],
  },
  highlights: [{ type: 'arrow', from: [34, 26.6], to: [63, 15.4], tone: 'bad', label: '30 metrów tyłem do celu', labelDy: -2.2 }],
}

const holdOn = (feedback, caption) => ({
  id: 'przytrzymaj',
  label: 'Zatrzymuję piłkę i czekam na pomoc',
  correct: false,
  outcome: 'Strata piłki',
  feedback,
  clip: {
    duration: 2.6,
    tracks: {
      d: [{ t: 1.0, x: 34.3, y: 24.2 }],
      m: [{ t: 1.2, x: 36.2, y: 27.4 }, { t: 2.6, x: 40, y: 33 }],
      ty: [{ t: 0.5, x: 34, y: 25.8 }],
    },
    ball: [
      { t: 0.3, x: 34, y: 26.6 },
      { t: 0.4, on: 'ty' },
      { t: 1.2, on: 'ty' },
      { t: 1.35, on: 'm' },
    ],
    events: [{ t: 1.3, text: caption, tone: 'bad', dur: 1.4 }],
  },
  highlights: [{ type: 'circle', at: [35, 26], r: 3.4, tone: 'bad', label: 'dwóch na jednego' }],
})

export const graTylemDoBramki = {
  id: 'gra-tylem-do-bramki',
  title: 'Gra tyłem do bramki',
  subtitle: 'Dostajesz piłkę plecami do bramki rywala — odegrać czy się obrócić?',
  faza: 'atak',
  strefa: 'tercja-ataku',
  liczebnosc: '1v1',
  positions: ['napastnik', 'pomocnik'],
  level: 'Łatwy',
  facingUp: 'home',
  brief:
    'Kolega z pomocy podaje do ciebie. Stoisz tyłem do bramki rywala, a za twoimi plecami jest obrońca. To, co zrobisz, zależy od tego, jak blisko on stoi.',

  entities: [
    { id: 'gk', team: 'awayGK', number: 1, x: 34, y: 2.5 },
    { id: 'd', team: 'away', number: 5, x: 34, y: 20 },
    { id: 'd2', team: 'away', number: 4, x: 24, y: 14 },
    { id: 'm', team: 'away', number: 6, x: 42, y: 36 },
    { id: 'ty', team: 'home', number: 9, x: 34, y: 23, you: true },
    { id: 'cm', team: 'home', number: 8, x: 30, y: 41 },
    { id: 'w', team: 'home', number: 7, x: 54, y: 24 },
  ],
  ball: { on: 'cm' },

  stages: [
    {
      id: 'tylem',
      fundament: 'odwaga-cierpliwosc',
      title: 'Przyjęcie tyłem do bramki',
      question: 'Kolega podaje do ciebie, stoisz tyłem do bramki rywala. Patrz, gdzie jest obrońca! Co robisz?',
      lesson:
        'Tyłem do bramki sprawdź, gdzie jest obrońca: blisko na plecach — odegraj z pierwszej do kolegi; daleko — obróć się z piłką i atakuj bramkę.',
      intro: {
        duration: 2.0,
        tracks: {
          ty: [{ t: 1.6, x: 34, y: 25.5 }],
          d: [{ t: 1.7, x: 35.2, y: 23.4 }],
          cm: [{ t: 2.0, x: 31, y: 36 }],
          m: [{ t: 2.0, x: 39, y: 33 }],
          w: [{ t: 2.0, x: 54, y: 21 }],
        },
        ball: [
          { t: 0.5, on: 'cm' },
          { t: 1.7, x: 34, y: 26.6 },
        ],
        events: [{ t: 0.2, text: 'Patrz, gdzie jest obrońca', tone: 'info', dur: 1.6 }],
      },
      options: [
        {
          id: 'odegraj',
          label: 'Odgrywam piłkę z pierwszej do kolegi, który nadbiega',
          correct: true,
          outcome: 'Gol!',
          feedback:
            'Dobrze! Obrońca był tuż za twoimi plecami — obrót skończyłby się stratą. Odegrałeś z pierwszej, kolega dostał piłkę twarzą do bramki i otworzył drogę skrzydłowemu.',
          clip: {
            duration: 4.0,
            tracks: {
              cm: [{ t: 0.9, x: 32, y: 31 }, { t: 1.3, x: 32.5, y: 30 }],
              w: [{ t: 1.4, x: 50, y: 16 }, { t: 2.4, x: 45, y: 9 }],
              ty: [{ t: 1.2, x: 35.5, y: 22.5 }],
              d: [{ t: 1.2, x: 35, y: 21.5 }],
              d2: [{ t: 2.4, x: 33, y: 9 }],
              m: [{ t: 2.0, x: 34, y: 31 }],
              gk: [{ t: 2.4, x: 37, y: 3.5 }, { t: 3.0, x: 34.5, y: 2.4, pose: 'down' }],
            },
            ball: [
              { t: 0.25, x: 34, y: 26.6 },
              { t: 0.9, on: 'cm' },
              { t: 1.3, on: 'cm' },
              { t: 2.2, on: 'w' },
              { t: 2.6, on: 'w' },
              { t: 3.0, x: 31.5, y: -0.6, arc: 0.8 },
            ],
            events: [
              { t: 0.4, text: 'Odegranie z pierwszej', tone: 'good', dur: 1.2 },
              { t: 3.1, text: 'GOL', tone: 'good', dur: 3 },
            ],
          },
          highlights: [
            { type: 'circle', at: [34.8, 24.2], r: 2.8, tone: 'info', label: 'obrońca na plecach' },
            { type: 'arrow', from: [34, 26.6], to: [32.2, 30.2], tone: 'good', label: 'odegranie', labelDx: -6, labelDy: 0 },
          ],
        },
        {
          id: 'obrot',
          label: 'Obracam się z piłką w stronę bramki',
          correct: false,
          outcome: 'Strata piłki',
          feedback:
            'Obrońca stał metr za tobą — przy obrocie wbiegłeś prosto w niego i stracił piłkę. Gdy rywal jest na plecach, obrót to najczęściej strata.',
          clip: {
            duration: 2.6,
            tracks: {
              ty: [{ t: 0.4, x: 34.6, y: 25.2 }],
              d: [{ t: 0.6, x: 34.9, y: 24.4 }, { t: 2.0, x: 39, y: 30 }],
            },
            ball: [
              { t: 0.3, x: 34, y: 26.6 },
              { t: 0.4, on: 'ty' },
              { t: 0.6, on: 'ty' },
              { t: 0.7, on: 'd' },
            ],
            events: [turnOver('Odbiór na plecach')],
          },
          highlights: [{ type: 'circle', at: [34.5, 24.6], r: 2.8, tone: 'bad', label: 'obrońca na plecach' }],
        },
        holdOn(
          'Zatrzymując piłkę z obrońcą na plecach, dałeś rywalom czas: z przodu doskoczył drugi i we dwóch zabrali ci piłkę.',
          'Podwojenie — strata',
        ),
        switchPlay,
      ],
      variants: [
        {
          // Cue B: the defender drops off — there is time and space to turn.
          variantId: 'obronca-daleko',
          intro: {
            duration: 2.0,
            tracks: {
              ty: [{ t: 1.6, x: 34, y: 25.5 }],
              d: [{ t: 1.7, x: 34, y: 16 }],
              cm: [{ t: 2.0, x: 31, y: 36 }],
              m: [{ t: 2.0, x: 39, y: 33 }],
              w: [{ t: 2.0, x: 54, y: 21 }],
            },
            ball: [
              { t: 0.5, on: 'cm' },
              { t: 1.7, x: 34, y: 26.6 },
            ],
            events: [{ t: 0.2, text: 'Patrz, gdzie jest obrońca', tone: 'info', dur: 1.6 }],
          },
          options: [
            {
              id: 'odegraj',
              label: 'Odgrywam piłkę z pierwszej do kolegi, który nadbiega',
              correct: false,
              quality: 1,
              outcome: 'Akcja zwolniona',
              feedback:
                'Odegranie było bezpieczne, ale niepotrzebne: obrońca stał 10 metrów dalej i miałeś czas na obrót. Zamiast ataku na bramkę — podanie do tyłu.',
              clip: {
                duration: 2.2,
                tracks: {
                  cm: [{ t: 0.9, x: 32, y: 31 }],
                  m: [{ t: 1.4, x: 33.5, y: 32.5 }],
                  d: [{ t: 1.6, x: 34, y: 20 }],
                },
                ball: [
                  { t: 0.25, x: 34, y: 26.6 },
                  { t: 0.9, on: 'cm' },
                ],
                events: [{ t: 0.6, text: 'Podanie do tyłu', tone: 'bad', dur: 1.4 }],
              },
              highlights: [{ type: 'arrow', from: [34, 25], to: [34.5, 18], tone: 'info', label: 'było miejsce na obrót', labelDx: 9, labelDy: 0 }],
            },
            {
              id: 'obrot',
              label: 'Obracam się z piłką w stronę bramki',
              correct: true,
              outcome: 'Gol!',
              feedback:
                'Świetnie! Obrońca stał daleko, więc miałeś czas na obrót. Twarzą do bramki jesteś groźny — i to wykorzystałeś.',
              clip: {
                duration: 3.0,
                tracks: {
                  ty: [{ t: 0.4, x: 34.4, y: 25 }, { t: 1.6, x: 36, y: 19.5 }],
                  d: [{ t: 1.6, x: 35.5, y: 15.5 }],
                  gk: [{ t: 1.6, x: 35, y: 3 }, { t: 2.1, x: 33, y: 2.2, pose: 'down' }],
                  cm: [{ t: 3.0, x: 32, y: 30 }],
                },
                ball: [
                  { t: 0.3, x: 34, y: 26.6 },
                  { t: 0.35, on: 'ty' },
                  { t: 1.6, on: 'ty' },
                  { t: 2.1, x: 31, y: -0.6, arc: 0.8 },
                ],
                events: [
                  { t: 0.5, text: 'Obrót!', tone: 'good', dur: 1 },
                  { t: 2.2, text: 'GOL', tone: 'good', dur: 3 },
                ],
              },
              highlights: [
                { type: 'circle', at: [34, 16.5], r: 2.8, tone: 'info', label: 'obrońca daleko' },
                { type: 'arrow', from: [34, 25], to: [35.8, 20.5], tone: 'good', label: 'obrót i atak', labelDx: 8, labelDy: 0 },
              ],
            },
            holdOn(
              'Obrońca stał daleko i dał ci czas — a ty go oddałeś. Zanim zdecydowałeś, doskoczył on i pomocnik rywala.',
              'Obrońca zdążył doskoczyć',
            ),
            switchPlay,
          ],
        },
      ],
      timeout: {
        optionId: 'przytrzymaj',
        feedback:
          'Zanim zdecydowałeś, rywale byli już przy tobie. Tyłem do bramki decyzję podejmujesz, zanim piłka do ciebie dotrze — rozejrzyj się, gdzie jest obrońca.',
      },
    },
  ],
}
