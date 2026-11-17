// Fundamental: cover (asekuracja). A team-mate presses the ball carrier; "TY" (no. 4) is the second defender.
// Stage 2: the team-mate is beaten — swap roles: you press, he recovers and covers you.
// The view is OUR half: our goal at the top, opponents attack upwards.

const W = 'Gol dla rywala'

export const asekuracja = {
  id: 'asekuracja',
  title: 'Asekuracja kolegi',
  subtitle: 'Kolega atakuje zawodnika z piłką — gdzie jesteś ty?',
  faza: 'obrona',
  strefa: 'tercja-obronna',
  liczebnosc: '2v2',
  positions: ['obronca', 'pomocnik'],
  level: 'Średni',
  brief:
    'Rywal prowadzi piłkę bliżej linii bocznej. Twój kolega wychodzi do niego, a drugi napastnik rywala jest kryty przez waszego bocznego obrońcę. Ty jesteś drugim obrońcą.',

  entities: [
    { id: 'gk', team: 'homeGK', number: 1, x: 34, y: 3 },
    { id: 'tm', team: 'home', number: 5, x: 24, y: 24 },
    { id: 'ty', team: 'home', number: 4, x: 37, y: 21, you: true },
    { id: 'rb', team: 'home', number: 2, x: 49, y: 24 },
    { id: 'a', team: 'away', number: 7, x: 25, y: 38 },
    { id: 'b', team: 'away', number: 9, x: 47, y: 31 },
    { id: 'c', team: 'away', number: 10, x: 37, y: 47 },
  ],
  ball: { on: 'a' },

  stages: [
    {
      id: 'ustawienie',
      fundament: 'asekuracja',
      title: 'Ustawienie do asekuracji',
      question: 'Twój kolega wychodzi do zawodnika z piłką. Drugi napastnik jest kryty. Gdzie się ustawiasz?',
      lesson:
        'Gdy kolega atakuje piłkę, ty go asekurujesz: stań skośnie za nim, 4–5 metrów, od strony bramki. Jeśli zostanie minięty — jesteś na miejscu.',
      intro: {
        duration: 2.2,
        tracks: {
          a: [{ t: 2.2, x: 24.5, y: 30 }],
          tm: [{ t: 2.2, x: 24, y: 26.5 }],
          ty: [{ t: 2.2, x: 35, y: 21 }],
          b: [{ t: 2.2, x: 46, y: 27 }],
          rb: [{ t: 2.2, x: 47.5, y: 24 }],
          c: [{ t: 2.2, x: 36, y: 38 }],
        },
        events: [{ t: 0.2, text: 'Kolega wychodzi do rywala', tone: 'info', dur: 1.8 }],
      },
      options: [
        {
          id: 'skos',
          label: 'Ustawiam się skośnie za kolegą, 4–5 metrów od niego',
          correct: true,
          outcome: 'Kolega ma asekurację',
          feedback:
            'Dobrze! Stoisz skośnie za kolegą, od strony bramki. Rywal minął go zwodem do środka — ale wbiegł prosto na ciebie.',
          clip: {
            duration: 2.0,
            tracks: {
              ty: [{ t: 1.0, x: 28.5, y: 21.5 }],
              a: [{ t: 1.0, x: 25.5, y: 28 }, { t: 1.8, x: 27.5, y: 25 }],
              tm: [{ t: 1.2, x: 23.5, y: 27.2 }, { t: 2.0, x: 24, y: 27.6 }],
              c: [{ t: 2.0, x: 36, y: 34 }],
            },
            events: [{ t: 1.3, text: 'Kolega minięty — ale ty jesteś na miejscu', tone: 'good', dur: 1.6 }],
          },
          highlights: [
            { type: 'line', from: 'tm', to: [28.5, 21.5], tone: 'good', dashed: true, label: 'skośnie, 4–5 m', labelDx: 5, labelDy: -1.5 },
          ],
        },
        {
          id: 'obok',
          label: 'Staję w jednej linii obok kolegi',
          correct: false,
          outcome: W,
          feedback:
            'Stojąc w linii z kolegą, nie asekurujesz go — jeden zwód minął was obu naraz. Asekuracja to ustawienie za kolegą, od strony bramki, a nie obok niego.',
          clip: {
            duration: 3.6,
            tracks: {
              ty: [{ t: 0.9, x: 30, y: 26.5 }, { t: 2.0, x: 29.5, y: 22 }],
              a: [{ t: 1.0, x: 26, y: 27.5 }, { t: 1.6, x: 27, y: 22 }, { t: 2.4, x: 28, y: 15.5 }],
              tm: [{ t: 2.0, x: 24.5, y: 24 }],
              gk: [{ t: 2.2, x: 32, y: 4.5 }, { t: 2.8, x: 34.5, y: 2.6, pose: 'down' }],
            },
            ball: [
              { t: 2.4, on: 'a' },
              { t: 2.8, x: 36.5, y: -0.6, arc: 1 },
            ],
            events: [
              { t: 1.3, text: 'Obaj minięci jednym zwodem', tone: 'bad', dur: 1.2 },
              { t: 2.9, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'line', from: [24, 26.5], to: [30, 26.5], tone: 'bad', dashed: true, label: 'w jednej linii', labelDy: -1.8 }],
        },
        {
          id: 'podwajam',
          label: 'Też doskakuję do zawodnika z piłką',
          correct: false,
          outcome: W,
          feedback:
            'Doskakując we dwóch, zostawiliście pusty środek. Rywal zagrał do wbiegającego pomocnika, który miał przed sobą tylko bramkarza.',
          clip: {
            duration: 3.6,
            tracks: {
              ty: [{ t: 1.0, x: 26.5, y: 28.5 }],
              c: [{ t: 1.6, x: 34.5, y: 26 }, { t: 2.6, x: 34, y: 15 }],
              gk: [{ t: 2.6, x: 34, y: 5 }, { t: 3.1, x: 32, y: 3.5, pose: 'down' }],
            },
            ball: [
              { t: 0.9, on: 'a' },
              { t: 1.6, on: 'c' },
              { t: 2.6, on: 'c' },
              { t: 3.0, x: 36, y: -0.6, arc: 0.8 },
            ],
            events: [
              { t: 1.0, text: 'Pusty środek', tone: 'bad', dur: 1.2 },
              { t: 3.1, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'arrow', from: [24.5, 29], to: [34, 26.5], tone: 'bad', label: 'podanie w pusty środek', labelDy: -2 }],
        },
        {
          id: 'swoj',
          label: 'Zostaję w środku, w swojej strefie',
          correct: false,
          outcome: W,
          feedback:
            'Stałeś 10 metrów od akcji. Gdy rywal minął kolegę, nie było nikogo, kto mógłby go zatrzymać — miał wolną drogę do bramki.',
          clip: {
            duration: 3.4,
            tracks: {
              ty: [{ t: 2.0, x: 33, y: 18 }],
              a: [{ t: 1.0, x: 26, y: 27.5 }, { t: 2.0, x: 27, y: 18 }, { t: 2.4, x: 28, y: 14 }],
              tm: [{ t: 2.0, x: 24.5, y: 24 }],
              gk: [{ t: 2.2, x: 32, y: 4.5 }, { t: 2.8, x: 34.5, y: 2.6, pose: 'down' }],
            },
            ball: [
              { t: 2.4, on: 'a' },
              { t: 2.8, x: 36.5, y: -0.6, arc: 1 },
            ],
            events: [
              { t: 1.2, text: 'Kolega minięty — nikt nie asekuruje', tone: 'bad', dur: 1.4 },
              { t: 2.9, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'line', from: [24, 26.5], to: [35, 21], tone: 'bad', dashed: true, label: 'za daleko', labelDx: 3, labelDy: -2 }],
        },
      ],
      timeout: {
        optionId: 'swoj',
        feedback:
          'Zanim zdecydowałeś, rywal minął twojego kolegę — a ty byłeś za daleko, żeby pomóc. Asekurację ustawiasz w chwili, gdy kolega rusza do piłki.',
      },
    },

    {
      id: 'zamiana-rol',
      fundament: 'asekuracja',
      title: 'Kolega minięty',
      question: 'Rywal minął twojego kolegę i biegnie z piłką na ciebie. Co teraz?',
      lesson:
        'Kolega minięty? Teraz ty atakujesz piłkę, a on wraca i asekuruje ciebie — to zamiana ról.',
      intro: null,
      options: [
        {
          id: 'doskok',
          label: 'Od razu atakuję go — teraz to ja jestem pierwszym obrońcą',
          correct: true,
          outcome: 'Piłka odebrana',
          feedback:
            'Świetnie! Zaatakowałeś rywala od razu, zanim się rozpędził, a kolega wrócił i stanął skośnie za tobą. Zamiana ról zadziałała i piłka jest wasza.',
          clip: {
            duration: 2.4,
            tracks: {
              ty: [{ t: 0.6, x: 27.8, y: 23.4 }, { t: 2.0, x: 30, y: 26 }],
              a: [{ t: 0.6, x: 27.6, y: 24.6 }, { t: 1.4, x: 27.5, y: 25.5, pose: 'down' }],
              tm: [{ t: 1.6, x: 31, y: 21.5 }],
            },
            ball: [
              { t: 1.3, on: 'a' },
              { t: 1.5, on: 'ty' },
            ],
            events: [{ t: 1.5, text: 'Zamiana ról — piłka odebrana', tone: 'good', dur: 1.6 }],
          },
          highlights: [
            { type: 'arrow', from: [24, 27.6], to: [30.6, 21.9], tone: 'good', label: 'kolega teraz asekuruje', labelDx: 9, labelDy: 0 },
          ],
        },
        {
          id: 'cofam',
          label: 'Cofam się dalej i czekam na pomoc kolegi',
          correct: false,
          outcome: W,
          feedback:
            'Cofając się, dałeś rywalowi czas i miejsce na strzał z 18 metrów. Asekurujący nie czeka — gdy kolega jest minięty, to on staje się pierwszym obrońcą.',
          clip: {
            duration: 3.0,
            tracks: {
              ty: [{ t: 1.2, x: 29, y: 15 }],
              a: [{ t: 1.2, x: 28, y: 19.5 }],
              tm: [{ t: 2.0, x: 26, y: 22 }],
              gk: [{ t: 1.5, x: 33, y: 3.5 }, { t: 1.9, x: 35, y: 2.4, pose: 'down' }],
            },
            ball: [
              { t: 1.3, on: 'a' },
              { t: 1.8, x: 36.6, y: -0.6, arc: 1.2 },
            ],
            events: [
              { t: 1.2, text: 'Strzał bez presji', tone: 'bad', dur: 1 },
              { t: 1.9, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'arrow', from: [28.5, 22.5], to: [29, 15.6], tone: 'bad', label: 'cofanie = miejsce na strzał', labelDx: 11, labelDy: 0 }],
        },
        {
          id: 'swoj',
          label: 'Wracam do środka, do swojej strefy',
          correct: false,
          outcome: W,
          feedback:
            'Wracając do swojej strefy, zostawiłeś rywala z piłką samego. Strefa nie jest ważniejsza niż piłka, która jedzie na twoją bramkę.',
          clip: {
            duration: 3.0,
            tracks: {
              ty: [{ t: 1.2, x: 35, y: 20 }],
              a: [{ t: 1.4, x: 29, y: 14 }],
              gk: [{ t: 1.6, x: 32, y: 4.5 }, { t: 2.1, x: 34, y: 2.6, pose: 'down' }],
            },
            ball: [
              { t: 1.5, on: 'a' },
              { t: 1.9, x: 36.5, y: -0.6, arc: 0.8 },
            ],
            events: [{ t: 2.0, text: 'GOL', tone: 'bad', dur: 3 }],
          },
          highlights: [{ type: 'arrow', from: [28.5, 22], to: [34.5, 20.2], tone: 'bad', label: 'od piłki', labelDy: -1.8 }],
        },
        {
          id: 'wslizg',
          label: 'Rzucam się wślizgiem z kilku metrów',
          correct: false,
          outcome: W,
          feedback:
            'Wślizg z kilku metrów rywal łatwo przeskoczył i miał przed sobą już tylko bramkarza. Ostatni obrońca zostaje na nogach.',
          clip: {
            duration: 3.0,
            tracks: {
              ty: [{ t: 0.3, x: 28, y: 22.8 }, { t: 0.6, x: 27.6, y: 24, pose: 'down' }],
              a: [{ t: 0.8, x: 30.5, y: 22 }, { t: 1.6, x: 32, y: 13 }],
              gk: [{ t: 1.6, x: 33.5, y: 5 }, { t: 2.0, x: 35, y: 3.2, pose: 'down' }],
            },
            ball: [
              { t: 1.6, on: 'a' },
              { t: 2.0, x: 31.5, y: -0.6, arc: 0.6 },
            ],
            events: [
              { t: 0.8, text: 'Minięty!', tone: 'bad', dur: 1 },
              { t: 2.1, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'circle', at: [27.8, 23.8], r: 2.8, tone: 'bad', label: 'wślizg z daleka' }],
        },
      ],
      timeout: {
        optionId: 'cofam',
        feedback:
          'Gdy się wahałeś, rywal miał czas na spokojny strzał. Po minięciu kolegi decyzja musi być natychmiastowa: atakujesz piłkę.',
      },
    },
  ],
}
