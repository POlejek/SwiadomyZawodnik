// Situation: transition to defence — the ball is lost in midfield. "TY" (no. 8) is the nearest player.
// The view is OUR half: our goal at the top, the opponents counter upwards.

const W = 'Gol dla rywala'

export const kontrpressing = {
  id: 'kontrpressing',
  title: 'Kontrpressing po stracie',
  subtitle: 'Rywal przejmuje piłkę — doskoczyć czy wrócić?',
  category: 'Przejście do obrony',
  positions: ['pomocnik'],
  level: 'Trudny',
  brief:
    'Rywal przecina podanie w środku boiska. Ich napastnicy już ruszają do kontry, a wasi obrońcy są daleko. Od tego, gdzie stoisz, zależy, co powinieneś zrobić.',

  entities: [
    { id: 'gk', team: 'homeGK', number: 1, x: 34, y: 3 },
    { id: 'cb', team: 'home', number: 4, x: 38, y: 18 },
    { id: 'cb2', team: 'home', number: 5, x: 26, y: 19 },
    { id: 'ty', team: 'home', number: 8, x: 34, y: 40, you: true },
    { id: 'tm', team: 'home', number: 10, x: 26, y: 47 },
    { id: 'om', team: 'away', number: 6, x: 31, y: 43.5 },
    { id: 'om2', team: 'away', number: 10, x: 46, y: 50 },
    { id: 'f1', team: 'away', number: 9, x: 38, y: 26 },
    { id: 'f2', team: 'away', number: 11, x: 56, y: 30 },
  ],
  ball: { on: 'tm' },

  stages: [
    {
      id: 'reakcja',
      title: 'Pierwsza reakcja',
      question: 'Straciliście piłkę w środku boiska. Patrz, gdzie jest rywal z piłką! Co robisz?',
      lesson:
        'Po stracie patrz na odległość: jesteś blisko rywala z piłką — doskocz od razu i zamknij podanie do przodu. Jesteś daleko — sprintem wróć za linię piłki i zamknij środek.',
      intro: {
        duration: 1.4,
        tracks: {
          om: [{ t: 0.8, x: 31, y: 43 }, { t: 1.4, x: 31, y: 42.6 }],
          f1: [{ t: 1.4, x: 38, y: 24 }],
          f2: [{ t: 1.4, x: 55, y: 28 }],
          om2: [{ t: 1.4, x: 45, y: 48 }],
          tm: [{ t: 1.4, x: 26.5, y: 46.5 }],
        },
        ball: [
          { t: 0.2, on: 'tm' },
          { t: 0.8, on: 'om' },
        ],
        events: [{ t: 0.8, text: 'Strata piłki!', tone: 'bad', dur: 0.8 }],
      },
      options: [
        {
          id: 'doskok',
          label: 'Natychmiast doskakuję i zamykam mu podanie do przodu',
          correct: true,
          outcome: 'Rywal osaczony',
          feedback:
            'Dobrze! Pierwsze sekundy po stracie to najlepszy moment na odbiór: rywal jeszcze nie podniósł głowy, a twoja drużyna jest blisko. Zamknąłeś mu podanie do przodu, a kolega doskakuje z drugiej strony.',
          clip: {
            duration: 1.6,
            tracks: {
              ty: [{ t: 0.5, x: 32.3, y: 39 }],
              tm: [{ t: 1.0, x: 27.5, y: 46.5 }],
              om: [{ t: 1.0, x: 30.6, y: 43.4 }],
              f1: [{ t: 1.6, x: 38, y: 23 }],
            },
            events: [{ t: 0.9, text: 'Rywal osaczony', tone: 'good', dur: 1.4 }],
          },
          highlights: [{ type: 'cross', from: 'om', to: 'f1', tone: 'good', label: 'podanie do przodu zamknięte', labelDx: 11, labelDy: 0 }],
        },
        {
          id: 'wracam',
          label: 'Cofam się za linię piłki, w stronę własnej bramki',
          correct: false,
          outcome: W,
          feedback:
            'Byłeś najbliżej, kilka metrów od rywala — to był moment na doskok. Cofając się, dałeś mu czas, żeby podniósł głowę, a jedno prostopadłe podanie minęło całą twoją drużynę.',
          clip: {
            duration: 3.8,
            tracks: {
              ty: [{ t: 2.0, x: 35, y: 33 }],
              om: [{ t: 0.6, x: 31, y: 42.2 }],
              f1: [{ t: 1.7, x: 37, y: 17 }, { t: 2.6, x: 35.5, y: 9 }],
              cb: [{ t: 1.7, x: 39.5, y: 16 }, { t: 2.6, x: 37.5, y: 10.5 }],
              cb2: [{ t: 2.6, x: 30, y: 12 }],
              gk: [{ t: 2.4, x: 34, y: 5 }, { t: 2.9, x: 32.5, y: 3.5, pose: 'down' }],
            },
            ball: [
              { t: 0.7, on: 'om' },
              { t: 1.7, on: 'f1' },
              { t: 2.6, on: 'f1' },
              { t: 3.0, x: 36.5, y: -0.6, arc: 0.8 },
            ],
            events: [
              { t: 0.8, text: 'Prostopadłe podanie', tone: 'bad', dur: 1 },
              { t: 3.1, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'arrow', from: [31, 41.2], to: [36.9, 17.5], tone: 'bad', label: 'wolne podanie', labelDx: 7, labelDy: 0 }],
        },
        {
          id: 'protest',
          label: 'Protestuję do sędziego, że był faul',
          correct: false,
          outcome: W,
          feedback:
            'Sędzia nie zagwizdał — gra toczyła się dalej. Każda sekunda na protesty to sekunda, w której rywal kontratakuje bez przeszkód.',
          clip: {
            duration: 4.6,
            tracks: {
              om: [{ t: 0.8, x: 31.5, y: 41 }],
              f2: [{ t: 1.6, x: 54, y: 25 }, { t: 2.6, x: 50, y: 15 }],
              f1: [{ t: 2.0, x: 38, y: 18 }, { t: 3.4, x: 33.5, y: 7 }],
              cb: [{ t: 3.4, x: 35.5, y: 9 }],
              cb2: [{ t: 3.4, x: 29, y: 10 }],
              gk: [{ t: 3.3, x: 35, y: 3 }, { t: 3.7, x: 33, y: 2.4, pose: 'down' }],
            },
            ball: [
              { t: 0.8, on: 'om' },
              { t: 1.6, on: 'f2' },
              { t: 2.6, on: 'f2' },
              { t: 3.4, on: 'f1', arc: 2.5 },
              { t: 3.8, x: 31.5, y: -0.6, arc: 1 },
            ],
            events: [
              { t: 0.6, text: 'Gra toczy się dalej', tone: 'bad', dur: 1.4 },
              { t: 3.9, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'circle', at: [34, 40], r: 3, tone: 'bad', label: 'protestujesz zamiast biec' }],
        },
        {
          id: 'wslizg',
          label: 'Rzucam się wślizgiem na zawodnika z piłką',
          correct: false,
          outcome: 'Faul i żółta kartka',
          feedback:
            'Rywal osłaniał piłkę ciałem, więc wślizg trafił w nogi, nie w piłkę. Kontrpressing to szybki doskok i zamknięcie podania, a nie desperacki wślizg.',
          clip: {
            duration: 2.6,
            tracks: {
              ty: [{ t: 0.4, x: 32.4, y: 40.2 }, { t: 0.6, x: 32.6, y: 41.2, pose: 'down' }],
              om: [{ t: 0.6, x: 30.8, y: 42.6 }, { t: 0.8, x: 30.2, y: 43.8, pose: 'down' }],
            },
            ball: [
              { t: 0.7, on: 'om' },
              { t: 1.3, x: 29.5, y: 39.5 },
            ],
            events: [{ t: 0.8, text: 'Faul! Żółta kartka', tone: 'bad', dur: 2.4 }],
          },
          highlights: [{ type: 'circle', at: [31.4, 42.4], r: 3.2, tone: 'bad', label: 'faul' }],
        },
      ],
      variants: [
        {
          // Cue B: the ball is won far away from you — too far to press, so get back goal-side and close the middle.
          variantId: 'daleko',
          intro: {
            duration: 1.4,
            tracks: {
              om2: [{ t: 0.9, x: 47, y: 46 }, { t: 1.4, x: 46.5, y: 45.5 }],
              om: [{ t: 1.4, x: 30.5, y: 44 }],
              f1: [{ t: 1.4, x: 38, y: 24 }],
              f2: [{ t: 1.4, x: 55, y: 28 }],
              tm: [{ t: 1.4, x: 28, y: 46 }],
            },
            ball: [
              { t: 0.2, on: 'tm' },
              { t: 0.9, on: 'om2' },
            ],
            events: [{ t: 0.9, text: 'Strata piłki!', tone: 'bad', dur: 0.8 }],
          },
          options: [
            {
              id: 'doskok',
              label: 'Natychmiast doskakuję i zamykam mu podanie do przodu',
              correct: false,
              outcome: W,
              feedback:
                'Byłeś kilkanaście metrów od rywala — zanim dobiegłeś, zagrał piłkę w miejsce, które opuściłeś. Z daleka doskok nie zdąży, a otwiera środek.',
              clip: {
                duration: 3.6,
                tracks: {
                  ty: [{ t: 1.2, x: 43, y: 43 }],
                  f1: [{ t: 1.5, x: 37, y: 18 }, { t: 2.4, x: 35.5, y: 9.5 }],
                  cb: [{ t: 1.5, x: 39.5, y: 16 }, { t: 2.4, x: 37.5, y: 11 }],
                  gk: [{ t: 2.2, x: 34.5, y: 4.5 }, { t: 2.7, x: 33, y: 3, pose: 'down' }],
                },
                ball: [
                  { t: 0.6, on: 'om2' },
                  { t: 1.5, on: 'f1' },
                  { t: 2.4, on: 'f1' },
                  { t: 2.8, x: 36.5, y: -0.6, arc: 0.8 },
                ],
                events: [
                  { t: 0.7, text: 'Podanie w wolny środek', tone: 'bad', dur: 1 },
                  { t: 2.9, text: 'GOL', tone: 'bad', dur: 3 },
                ],
              },
              highlights: [{ type: 'arrow', from: [46.5, 44.5], to: [37.2, 18.8], tone: 'bad', label: 'otwarty środek', labelDx: -8, labelDy: 0 }],
            },
            {
              id: 'wracam',
              label: 'Cofam się za linię piłki, w stronę własnej bramki',
              correct: true,
              outcome: 'Kontra zatrzymana',
              feedback:
                'Dobrze! Byłeś za daleko na doskok, więc sprintem zamknąłeś środek. Rywal nie miał podania do przodu i musiał zagrać do tyłu — twoja drużyna zdążyła wrócić.',
              clip: {
                duration: 2.6,
                tracks: {
                  ty: [{ t: 1.2, x: 41.5, y: 33 }],
                  om2: [{ t: 1.0, x: 46.5, y: 45 }],
                  om: [{ t: 2.0, x: 30, y: 44.5 }],
                  tm: [{ t: 2.4, x: 29, y: 46.5 }],
                  f1: [{ t: 2.4, x: 38, y: 23 }],
                },
                ball: [
                  { t: 1.3, on: 'om2' },
                  { t: 2.1, on: 'om' },
                ],
                events: [{ t: 1.4, text: 'Kontra zatrzymana', tone: 'good', dur: 1.6 }],
              },
              highlights: [{ type: 'cross', from: [46.5, 44.5], to: [38, 23], tone: 'good', label: 'środek zamknięty', labelDx: 9, labelDy: 0 }],
            },
            {
              id: 'protest',
              label: 'Protestuję do sędziego, że był faul',
              correct: false,
              outcome: W,
              feedback:
                'Sędzia nie zagwizdał — gra toczyła się dalej. Gdy protestowałeś, rywal zagrał prostopadle i napastnik wyszedł sam na sam z bramkarzem.',
              clip: {
                duration: 3.8,
                tracks: {
                  f1: [{ t: 1.7, x: 38, y: 17 }, { t: 2.6, x: 35, y: 9 }],
                  cb: [{ t: 2.6, x: 37.5, y: 10.5 }],
                  gk: [{ t: 2.5, x: 35, y: 3.5 }, { t: 2.9, x: 33, y: 2.4, pose: 'down' }],
                },
                ball: [
                  { t: 0.8, on: 'om2' },
                  { t: 1.7, on: 'f1' },
                  { t: 2.6, on: 'f1' },
                  { t: 3.0, x: 31.5, y: -0.6, arc: 0.8 },
                ],
                events: [
                  { t: 0.6, text: 'Gra toczy się dalej', tone: 'bad', dur: 1.4 },
                  { t: 3.1, text: 'GOL', tone: 'bad', dur: 3 },
                ],
              },
              highlights: [{ type: 'circle', at: [34, 40], r: 3, tone: 'bad', label: 'protestujesz zamiast biec' }],
            },
            {
              id: 'wslizg',
              label: 'Rzucam się wślizgiem na zawodnika z piłką',
              correct: false,
              outcome: 'Rywal minął cię i rusza z kontrą',
              feedback:
                'Wślizg z kilku metrów rozpędu łatwo ominąć. Rywal przełożył piłkę, a ty zostałeś na ziemi — droga do waszej bramki stoi otworem.',
              clip: {
                duration: 2.8,
                tracks: {
                  ty: [{ t: 0.9, x: 42.5, y: 43 }, { t: 1.2, x: 44, y: 44.2, pose: 'down' }],
                  om2: [{ t: 1.1, x: 48.5, y: 43 }, { t: 2.6, x: 46, y: 35 }],
                  f2: [{ t: 2.6, x: 53, y: 22 }],
                },
                events: [{ t: 1.2, text: 'Minięty!', tone: 'bad', dur: 1.4 }],
              },
              highlights: [{ type: 'circle', at: [44, 44], r: 3, tone: 'bad', label: 'za daleko na wślizg' }],
            },
          ],
          timeout: {
            optionId: 'protest',
            feedback:
              'Zawahałeś się, a rywal nie: zagrał prostopadle w wolny środek. Po stracie decyzja — doskok albo powrót — musi być natychmiastowa.',
          },
        },
      ],
      timeout: {
        optionId: 'wracam',
        feedback:
          'Zawahałeś się — a rywal nie. Podniósł głowę i zagrał prostopadle do napastnika. W kontrpressingu decyzję podejmujesz w chwili straty.',
      },
    },

    {
      id: 'osaczony',
      title: 'Rywal w pułapce',
      question: 'Rywal jest osaczony przez ciebie i kolegę i szuka wolnego partnera. Co dalej?',
      lesson:
        'Osaczonego rywala atakujcie we dwóch od razu, zanim podniesie głowę. Czekanie daje mu czas na znalezienie wolnego partnera.',
      intro: {
        duration: 1.2,
        tracks: {
          om: [{ t: 1.2, x: 31, y: 44.5 }],
          ty: [{ t: 1.2, x: 32, y: 40.8 }],
          tm: [{ t: 1.2, x: 28, y: 47.3 }],
          om2: [{ t: 1.2, x: 44, y: 47 }],
        },
        events: [{ t: 0.1, text: 'Rywal szuka wolnego partnera', tone: 'info', dur: 1.1 }],
      },
      options: [
        {
          id: 'razem',
          label: 'Atakuję piłkę razem z kolegą, zanim rywal się uwolni',
          correct: true,
          outcome: 'Piłka odzyskana',
          feedback:
            'Świetnie! Zaatakowaliście we dwóch, zanim rywal znalazł rozwiązanie. Piłka wróciła do was kilka sekund po stracie, a rywale, którzy ruszyli do kontry, są teraz za akcją.',
          clip: {
            duration: 2.0,
            tracks: {
              ty: [{ t: 0.5, x: 31.6, y: 42.4 }, { t: 1.6, x: 35, y: 48.5 }],
              om: [{ t: 0.6, x: 30.8, y: 45 }, { t: 1.2, x: 29.2, y: 44 }],
              tm: [{ t: 0.5, x: 29, y: 46.4 }, { t: 2.0, x: 26.5, y: 50 }],
            },
            ball: [
              { t: 0.45, on: 'om' },
              { t: 0.6, on: 'ty' },
            ],
            events: [{ t: 0.7, text: 'Piłka odzyskana!', tone: 'good', dur: 1.6 }],
          },
          highlights: [
            { type: 'circle', at: [31, 44], r: 4, tone: 'good', label: 'we dwóch' },
          ],
        },
        {
          id: 'zostawiam',
          label: 'Zostawiam go koledze i wracam na pozycję',
          correct: false,
          outcome: W,
          feedback:
            'Jeden zawodnik nie utrzyma rywala w pułapce. Gdy odpuściłeś, rywal uciekł w wolne miejsce i zagrał prostopadle do napastnika.',
          clip: {
            duration: 4.0,
            tracks: {
              ty: [{ t: 1.4, x: 36, y: 35 }],
              om: [{ t: 0.8, x: 28.5, y: 41.5 }, { t: 1.2, x: 28, y: 38.5 }],
              tm: [{ t: 1.2, x: 29.5, y: 44 }],
              f1: [{ t: 2.0, x: 37.5, y: 18 }, { t: 2.8, x: 35.5, y: 9.5 }],
              cb: [{ t: 2.0, x: 40, y: 16 }, { t: 2.8, x: 37.5, y: 11 }],
              gk: [{ t: 2.6, x: 35, y: 4.5 }, { t: 3.1, x: 33.5, y: 3, pose: 'down' }],
            },
            ball: [
              { t: 1.2, on: 'om' },
              { t: 2.0, on: 'f1' },
              { t: 2.8, on: 'f1' },
              { t: 3.2, x: 31.8, y: -0.6, arc: 0.8 },
            ],
            events: [
              { t: 1.0, text: 'Rywal się uwolnił', tone: 'bad', dur: 1 },
              { t: 3.3, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'arrow', from: [28, 37.5], to: [37.3, 18.8], tone: 'bad', label: 'prostopadłe podanie', labelDx: 8, labelDy: 0 }],
        },
        {
          id: 'czekam',
          label: 'Czekam, aż rywal sam popełni błąd',
          correct: false,
          outcome: 'Kontrpressing przełamany',
          feedback:
            'Czekając, dałeś rywalowi czas, żeby podniósł głowę. Znalazł wolnego partnera z boku i jego drużyna wyszła z pressingu z piłką.',
          clip: {
            duration: 3.0,
            tracks: {
              ty: [{ t: 0.8, x: 32, y: 40.6 }],
              om: [{ t: 0.6, x: 31.2, y: 44.6 }],
              om2: [{ t: 1.4, x: 44, y: 46.5 }, { t: 2.6, x: 45, y: 38 }],
              tm: [{ t: 2.6, x: 33, y: 44 }],
            },
            ball: [
              { t: 0.6, on: 'om' },
              { t: 1.4, on: 'om2' },
            ],
            events: [{ t: 1.4, text: 'Podanie do wolnego partnera', tone: 'bad', dur: 1.4 }],
          },
          highlights: [{ type: 'arrow', from: [31.2, 43.6], to: [43.5, 45.4], tone: 'bad', label: 'wolny partner', labelDy: 2.6 }],
        },
        {
          id: 'boczne-podanie',
          label: 'Odsuwam się, żeby zamknąć podanie do partnera z boku',
          correct: false,
          outcome: 'Rywal uciekł z pułapki',
          feedback:
            'Odsuwając się, otworzyłeś mu drogę do przodu, czyli tam, gdzie było najgroźniej. Najpierw zamykasz podanie i drogę w stronę własnej bramki, a dopiero potem boki.',
          clip: {
            duration: 2.4,
            tracks: {
              ty: [{ t: 0.7, x: 38.5, y: 45 }],
              om: [{ t: 0.8, x: 33, y: 40 }, { t: 1.8, x: 34, y: 33 }],
              tm: [{ t: 1.8, x: 31, y: 39 }],
              f1: [{ t: 1.8, x: 37, y: 20 }],
            },
            events: [{ t: 0.9, text: 'Rywal przechodzi środkiem', tone: 'bad', dur: 1.4 }],
          },
          highlights: [{ type: 'arrow', from: [31, 43.5], to: [33.8, 33.5], tone: 'bad', label: 'otwarta droga', labelDx: 8, labelDy: 0 }],
        },
      ],
      timeout: {
        optionId: 'czekam',
        feedback:
          'Pułapka działa tylko przez chwilę. Gdy się zastanawiałeś, rywal znalazł wolnego partnera i jego drużyna wyszła z pressingu.',
      },
    },
  ],
}
