// Situation: building up from the goalkeeper under pressure. "TY" (no. 4) is the left centre-back
// (we play downwards, so our left is the right side of the screen).
// The view is OUR half: our goal at the top, opponents press upwards.

const W = 'Gol dla rywala'

export const wyjscieSpodPressingu = {
  id: 'wyjscie-spod-pressingu',
  title: 'Wyjście spod pressingu',
  subtitle: 'Bramkarz podaje do ciebie, napastnik rywala doskakuje',
  category: 'Budowanie gry',
  positions: ['obronca'],
  level: 'Średni',
  brief:
    'Wyprowadzacie piłkę od bramkarza. Jesteś lewym środkowym obrońcą. Napastnik rywala pressuje od środka, a ich skrzydłowy czeka, dokąd zagrasz.',

  entities: [
    { id: 'gk', team: 'homeGK', number: 1, x: 34, y: 4 },
    { id: 'ty', team: 'home', number: 4, x: 45, y: 9, you: true },
    { id: 'lcb', team: 'home', number: 5, x: 23, y: 9 },
    { id: 'rb', team: 'home', number: 2, x: 62, y: 20 },
    { id: 'six', team: 'home', number: 6, x: 36, y: 22 },
    { id: 's', team: 'away', number: 9, x: 36, y: 16 },
    { id: 'w', team: 'away', number: 11, x: 56, y: 22 },
    { id: 'm', team: 'away', number: 8, x: 30, y: 30 },
  ],
  ball: { on: 'gk' },

  stages: [
    {
      id: 'przyjecie',
      title: 'Przyjęcie pod presją',
      question: 'Bramkarz podaje do ciebie, a napastnik rywala biegnie na ciebie od środka. Jak przyjmujesz piłkę?',
      lesson:
        'Przyjęcie kierunkowe to pierwsza decyzja: prowadź piłkę w wolne miejsce, z dala od rywala. Rozejrzyj się, zanim piłka do ciebie dotrze.',
      intro: {
        duration: 1.7,
        tracks: {
          ty: [{ t: 1.6, x: 46.5, y: 11 }],
          s: [{ t: 1.7, x: 41.5, y: 13 }],
          w: [{ t: 1.7, x: 57, y: 24 }],
          rb: [{ t: 1.7, x: 62, y: 22 }],
          six: [{ t: 1.7, x: 37, y: 23 }],
        },
        ball: [
          { t: 0.4, on: 'gk' },
          { t: 1.6, on: 'ty' },
        ],
        events: [{ t: 0.2, text: 'Bramkarz podaje do ciebie', tone: 'info', dur: 1.5 }],
      },
      options: [
        {
          id: 'kierunkowe',
          label: 'Przyjmuję kierunkowo na zewnątrz, z dala od napastnika',
          correct: true,
          outcome: 'Napastnik minięty',
          feedback:
            'Dobrze! Jednym dotknięciem odszedłeś od rywala w wolne miejsce. Napastnik dobiegł tam, gdzie piłki już nie było.',
          clip: {
            duration: 1.8,
            tracks: {
              ty: [{ t: 1.6, x: 50.5, y: 16.5 }],
              s: [{ t: 1.6, x: 46, y: 14.5 }],
              w: [{ t: 1.8, x: 57, y: 24 }],
            },
            events: [{ t: 0.6, text: 'Napastnik minięty jednym dotknięciem', tone: 'good', dur: 1.6 }],
          },
          highlights: [{ type: 'arrow', from: [46.5, 11.5], to: [50.2, 16.2], tone: 'good', label: 'w wolne miejsce', labelDx: 8, labelDy: 0 }],
        },
        {
          id: 'zatrzymaj',
          label: 'Zatrzymuję piłkę i dopiero się rozglądam',
          correct: false,
          outcome: W,
          feedback:
            'Zatrzymując piłkę w miejscu, dałeś napastnikowi czas, żeby do ciebie dobiegł. Odebrał ją 15 metrów od bramki i strzelił. Rozglądaj się, zanim piłka do ciebie dotrze.',
          clip: {
            duration: 3.2,
            tracks: {
              ty: [{ t: 1.0, x: 46.5, y: 11.2 }, { t: 2.4, x: 43, y: 9 }],
              s: [{ t: 1.0, x: 45.3, y: 11.8 }, { t: 1.8, x: 41, y: 8.5 }],
              gk: [{ t: 1.6, x: 36, y: 3.5 }, { t: 2.2, x: 33, y: 2.5, pose: 'down' }],
            },
            ball: [
              { t: 0.95, on: 'ty' },
              { t: 1.1, on: 's' },
              { t: 1.8, on: 's' },
              { t: 2.2, x: 31.5, y: -0.6, arc: 0.6 },
            ],
            events: [
              { t: 1.1, text: 'Strata!', tone: 'bad', dur: 1 },
              { t: 2.3, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'circle', at: [45.8, 11.5], r: 2.8, tone: 'bad', label: 'przyjęcie w miejscu' }],
        },
        {
          id: 'do-stopera',
          label: 'Podaję z pierwszej piłki do drugiego stopera',
          correct: false,
          outcome: W,
          feedback:
            'Podanie poszło dokładnie w linię biegu napastnika. Rywal pressuje od środka właśnie po to, żeby przeciąć podanie poprzeczne.',
          clip: {
            duration: 3.0,
            tracks: {
              s: [{ t: 0.6, x: 40.5, y: 11.3 }, { t: 1.4, x: 36.5, y: 7 }],
              ty: [{ t: 2.6, x: 42, y: 8 }],
              lcb: [{ t: 1.5, x: 30, y: 7 }],
              gk: [{ t: 1.3, x: 35, y: 3.5 }, { t: 1.8, x: 32.5, y: 2.5, pose: 'down' }],
            },
            ball: [
              { t: 0.3, on: 'ty' },
              { t: 0.6, on: 's' },
              { t: 1.4, on: 's' },
              { t: 1.8, x: 30.8, y: -0.6, arc: 0.5 },
            ],
            events: [
              { t: 0.6, text: 'Przechwyt!', tone: 'bad', dur: 1 },
              { t: 1.9, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'arrow', from: [46, 11.8], to: [24, 9.4], tone: 'bad', label: 'w linię biegu napastnika', labelDy: -2.2 }],
        },
        {
          id: 'wybij',
          quality: 1,
          label: 'Wybijam piłkę daleko do przodu',
          correct: false,
          outcome: 'Strata piłki',
          feedback:
            'Wybicie pod presją oddało piłkę rywalowi — a miałeś czas i miejsce, żeby ją rozegrać. Wystarczyło jedno dobre przyjęcie.',
          clip: {
            duration: 2.8,
            tracks: {
              s: [{ t: 1.0, x: 45.5, y: 12.5 }],
              m: [{ t: 2.0, x: 44, y: 44 }],
            },
            ball: [
              { t: 0.3, on: 'ty' },
              { t: 2.0, on: 'm', arc: 9 },
            ],
            events: [{ t: 2.0, text: 'Piłka u rywala', tone: 'bad', dur: 1.6 }],
          },
          highlights: [{ type: 'arrow', from: [46.5, 13], to: [44, 41.5], tone: 'bad', label: 'piłka oddana', labelDx: 7, labelDy: 0 }],
        },
      ],
      timeout: {
        optionId: 'zatrzymaj',
        feedback:
          'Czekałeś z decyzją, aż piłka do ciebie dotrze — napastnik zdążył doskoczyć i ją odebrać. Decyzję o przyjęciu podejmuj, zanim dostaniesz podanie.',
      },
    },

    {
      id: 'podanie-przez-linie',
      title: 'Pierwsze podanie',
      question: 'Napastnik goni cię z tyłu. Szóstka i boczny obrońca pokazują się do gry. Patrz na skrzydłowego rywala! Co robisz?',
      lesson:
        'Zanim podasz, sprawdź, co zamyka rywal: jeśli podanie po linii — graj do środka, jeśli środek — graj po linii. Podawaj tam, gdzie rywal nie zdąży.',
      intro: {
        duration: 1.6,
        tracks: {
          ty: [{ t: 1.6, x: 51, y: 20.5 }],
          s: [{ t: 1.6, x: 47.5, y: 17.8 }],
          w: [{ t: 1.6, x: 57, y: 23 }],
          rb: [{ t: 1.6, x: 62, y: 25 }],
          six: [{ t: 1.6, x: 40, y: 26.5 }],
          m: [{ t: 1.6, x: 31.5, y: 32 }],
          lcb: [{ t: 1.6, x: 28, y: 10 }],
        },
        events: [{ t: 0.2, text: 'Patrz, gdzie staje skrzydłowy', tone: 'info', dur: 1.4 }],
      },
      options: [
        {
          id: 'do-szostki',
          label: 'Podaję do szóstki w środku',
          correct: true,
          outcome: 'Pressing przełamany',
          feedback:
            'Świetnie! Skrzydłowy zamknął podanie po linii, więc zagrałeś do środka. Jedno podanie minęło dwóch pressujących rywali, a szóstka obróciła się z piłką.',
          clip: {
            duration: 2.8,
            tracks: {
              six: [{ t: 1.0, x: 40, y: 27 }, { t: 2.6, x: 41, y: 36 }],
              m: [{ t: 2.6, x: 35, y: 35 }],
              s: [{ t: 2.6, x: 46.5, y: 21 }],
              w: [{ t: 2.6, x: 55, y: 26 }],
              ty: [{ t: 2.6, x: 50, y: 22 }],
            },
            ball: [
              { t: 0.3, on: 'ty' },
              { t: 1.0, on: 'six' },
            ],
            events: [{ t: 1.2, text: 'Pressing przełamany!', tone: 'good', dur: 1.8 }],
          },
          highlights: [
            { type: 'cross', from: [51.5, 21.8], to: [61, 24.6], tone: 'bad', label: 'zamknięte', labelDy: -2.2 },
            { type: 'arrow', from: [50.5, 21.8], to: [41.5, 26.6], tone: 'good', label: 'przez linię pressingu', labelDy: 2.6 },
          ],
        },
        {
          id: 'po-linii',
          label: 'Podaję wzdłuż linii do bocznego obrońcy',
          correct: false,
          outcome: W,
          feedback:
            'Skrzydłowy rywala stał w linii podania właśnie po to — to była pułapka pressingu. Przechwycił piłkę 20 metrów od waszej bramki.',
          clip: {
            duration: 3.4,
            tracks: {
              w: [{ t: 0.65, x: 57, y: 23.2 }, { t: 1.6, x: 50, y: 14 }, { t: 2.2, x: 45, y: 10 }],
              ty: [{ t: 2.6, x: 47, y: 15 }],
              s: [{ t: 2.6, x: 42, y: 14 }],
              gk: [{ t: 1.8, x: 37, y: 3.5 }, { t: 2.5, x: 35, y: 2.5, pose: 'down' }],
            },
            ball: [
              { t: 0.3, on: 'ty' },
              { t: 0.65, on: 'w' },
              { t: 2.2, on: 'w' },
              { t: 2.6, x: 31.5, y: -0.6, arc: 1 },
            ],
            events: [
              { t: 0.65, text: 'Przechwyt!', tone: 'bad', dur: 1 },
              { t: 2.7, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'arrow', from: [51.5, 21.8], to: [61, 24.6], tone: 'bad', label: 'pułapka', labelDx: 4, labelDy: -2.4 }],
        },
        {
          id: 'aut',
          quality: 1,
          label: 'Wybijam piłkę na aut',
          correct: false,
          outcome: 'Piłka oddana rywalowi',
          feedback:
            'Bezpiecznie, ale niepotrzebnie: szóstka była wolna. Oddałeś rywalowi piłkę na waszej połowie — a on właśnie tego chciał.',
          clip: {
            duration: 2.4,
            tracks: {
              w: [{ t: 2.4, x: 62, y: 28 }],
              s: [{ t: 2.4, x: 50, y: 21 }],
            },
            ball: [
              { t: 0.3, on: 'ty' },
              { t: 1.2, x: 69.5, y: 30, arc: 3 },
            ],
            events: [{ t: 1.2, text: 'Aut dla rywala', tone: 'bad', dur: 1.6 }],
          },
          highlights: [{ type: 'arrow', from: [51, 21.5], to: [41.5, 26.6], tone: 'info', label: 'wolna szóstka', labelDy: 2.6 }],
        },
        {
          id: 'prowadze',
          label: 'Prowadzę piłkę dalej wzdłuż linii',
          correct: false,
          outcome: W,
          feedback:
            'Wbiegłeś prosto w pułapkę: skrzydłowy z przodu, napastnik z tyłu, a za tobą linia boczna. Dwóch rywali odebrało piłkę i akcja skończyła się golem.',
          clip: {
            duration: 3.6,
            tracks: {
              ty: [{ t: 1.0, x: 54, y: 24 }],
              w: [{ t: 1.0, x: 55.5, y: 24.5 }, { t: 1.8, x: 50, y: 15 }, { t: 2.4, x: 45, y: 11 }],
              s: [{ t: 1.0, x: 52.5, y: 22.5 }, { t: 3.6, x: 44, y: 15 }],
              gk: [{ t: 2.0, x: 33, y: 3.5 }, { t: 2.7, x: 35, y: 2.5, pose: 'down' }],
            },
            ball: [
              { t: 0.95, on: 'ty' },
              { t: 1.1, on: 'w' },
              { t: 2.4, on: 'w' },
              { t: 2.8, x: 36.5, y: -0.6, arc: 1 },
            ],
            events: [
              { t: 1.1, text: 'Złapany w pułapkę', tone: 'bad', dur: 1.2 },
              { t: 2.9, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'circle', at: [54, 23.8], r: 3.4, tone: 'bad', label: 'dwóch rywali' }],
        },
      ],
      variants: [
        {
          // Cue B: the winger steps inside to block the pass to the six — the full-back is free on the line.
          variantId: 'skrzydlowy-w-srodku',
          intro: {
            duration: 1.6,
            tracks: {
              ty: [{ t: 1.6, x: 51, y: 20.5 }],
              s: [{ t: 1.6, x: 47.5, y: 17.8 }],
              w: [{ t: 1.6, x: 46, y: 25 }],
              rb: [{ t: 1.6, x: 62, y: 27 }],
              six: [{ t: 1.6, x: 40, y: 27.5 }],
              m: [{ t: 1.6, x: 36.5, y: 31 }],
              lcb: [{ t: 1.6, x: 28, y: 10 }],
            },
            events: [{ t: 0.2, text: 'Patrz, gdzie staje skrzydłowy', tone: 'info', dur: 1.4 }],
          },
          options: [
            {
              id: 'do-szostki',
              label: 'Podaję do szóstki w środku',
              correct: false,
              outcome: W,
              feedback:
                'Skrzydłowy zszedł do środka właśnie po to, żeby przeciąć podanie do szóstki. Przechwycił piłkę i jego drużyna wyszła z kontrą na twoją bramkę.',
              clip: {
                duration: 3.2,
                tracks: {
                  w: [{ t: 0.6, x: 45.5, y: 24.8 }, { t: 1.4, x: 42, y: 16 }, { t: 2.0, x: 39, y: 11 }],
                  ty: [{ t: 2.4, x: 44, y: 16 }],
                  six: [{ t: 2.4, x: 38, y: 22 }],
                  s: [{ t: 2.4, x: 46, y: 15 }],
                  gk: [{ t: 1.6, x: 36, y: 3.5 }, { t: 2.4, x: 34.5, y: 2.4, pose: 'down' }],
                },
                ball: [
                  { t: 0.3, on: 'ty' },
                  { t: 0.6, on: 'w' },
                  { t: 2.0, on: 'w' },
                  { t: 2.4, x: 31.2, y: -0.6, arc: 1 },
                ],
                events: [
                  { t: 0.6, text: 'Przechwyt!', tone: 'bad', dur: 1 },
                  { t: 2.5, text: 'GOL', tone: 'bad', dur: 3 },
                ],
              },
              highlights: [{ type: 'arrow', from: [50.5, 21.8], to: [46.3, 24.2], tone: 'bad', label: 'w skrzydłowego', labelDx: -9, labelDy: 0 }],
            },
            {
              id: 'po-linii',
              label: 'Podaję wzdłuż linii do bocznego obrońcy',
              correct: true,
              outcome: 'Pressing przełamany',
              feedback:
                'Świetnie! Skrzydłowy zszedł do środka, żeby zamknąć szóstkę — więc wolny był boczny obrońca. Zagrałeś tam, gdzie rywal nie zdążył.',
              clip: {
                duration: 2.8,
                tracks: {
                  rb: [{ t: 1.1, x: 62.5, y: 27.5 }, { t: 2.6, x: 61, y: 38 }],
                  w: [{ t: 2.6, x: 52, y: 30 }],
                  s: [{ t: 2.6, x: 50, y: 22 }],
                  ty: [{ t: 2.6, x: 52, y: 23 }],
                },
                ball: [
                  { t: 0.3, on: 'ty' },
                  { t: 1.1, on: 'rb' },
                ],
                events: [{ t: 1.2, text: 'Pressing przełamany!', tone: 'good', dur: 1.8 }],
              },
              highlights: [
                { type: 'cross', from: [50.5, 21.8], to: [41, 27.3], tone: 'bad', label: 'zamknięte', labelDx: -2, labelDy: 3 },
                { type: 'arrow', from: [51.5, 21.8], to: [61.5, 26.8], tone: 'good', label: 'wolna linia', labelDy: -2.4 },
              ],
            },
            {
              id: 'aut',
              label: 'Wybijam piłkę na aut',
              correct: false,
              quality: 1,
              outcome: 'Piłka oddana rywalowi',
              feedback:
                'Bezpiecznie, ale niepotrzebnie: boczny obrońca był wolny. Oddałeś rywalowi piłkę na waszej połowie.',
              clip: {
                duration: 2.4,
                tracks: {
                  w: [{ t: 2.4, x: 52, y: 27 }],
                  s: [{ t: 2.4, x: 50, y: 21 }],
                },
                ball: [
                  { t: 0.3, on: 'ty' },
                  { t: 1.2, x: 69.5, y: 30, arc: 3 },
                ],
                events: [{ t: 1.2, text: 'Aut dla rywala', tone: 'bad', dur: 1.6 }],
              },
              highlights: [{ type: 'arrow', from: [51.5, 21.8], to: [61.5, 26.8], tone: 'info', label: 'wolny boczny obrońca', labelDy: -2.4 }],
            },
            {
              id: 'prowadze',
              label: 'Prowadzę piłkę dalej wzdłuż linii',
              correct: false,
              outcome: 'Strata piłki',
              feedback:
                'Boczny obrońca był wolny, a ty zostałeś z piłką i napastnikiem na plecach. Dogonił cię i odebrał piłkę 25 metrów od waszej bramki.',
              clip: {
                duration: 3.0,
                tracks: {
                  ty: [{ t: 1.0, x: 54.5, y: 25 }],
                  s: [{ t: 1.0, x: 53.5, y: 23.5 }, { t: 2.6, x: 47, y: 16 }],
                  w: [{ t: 2.6, x: 50, y: 22 }],
                },
                ball: [
                  { t: 0.95, on: 'ty' },
                  { t: 1.1, on: 's' },
                ],
                events: [{ t: 1.1, text: 'Odbiór od tyłu', tone: 'bad', dur: 1.6 }],
              },
              highlights: [{ type: 'arrow', from: [51.5, 21.8], to: [61.5, 26.8], tone: 'info', label: 'wolny boczny obrońca', labelDy: -2.4 }],
            },
          ],
        },
      ],
      timeout: {
        optionId: 'prowadze',
        feedback:
          'Stałeś z piłką i szukałeś rozwiązania, a napastnik dogonił cię z tyłu. Pod pressingiem decyzja musi być szybka.',
      },
    },
  ],
}
