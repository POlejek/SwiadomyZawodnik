// Situation: our counter-attack, 2 v 1. "TY" (no. 10) carries the ball through the middle,
// a team-mate runs on the left, one defender stands between you and the goalkeeper.
// The view is the OPPONENT's half: their goal at the top, we attack upwards (facingUp: 'home').

export const atak2v1 = {
  id: 'atak-2v1',
  title: 'Atak 2 na 1',
  subtitle: 'Kontra: prowadzisz piłkę środkiem, kolega biegnie z lewej',
  category: 'Atak',
  level: 'Łatwy',
  facingUp: 'home',
  brief:
    'Odebraliście piłkę i ruszacie z kontrą. Prowadzisz ją środkiem boiska, kolega biegnie lewą stroną, a przed wami jest tylko jeden obrońca i bramkarz.',

  entities: [
    { id: 'gk', team: 'awayGK', number: 1, x: 34, y: 2.5 },
    { id: 'd', team: 'away', number: 4, x: 34, y: 28 },
    { id: 'r', team: 'away', number: 6, x: 47, y: 54 },
    { id: 'ty', team: 'home', number: 10, x: 40, y: 44, you: true },
    { id: 'p', team: 'home', number: 9, x: 22, y: 44 },
  ],
  ball: { on: 'ty' },

  stages: [
    {
      id: 'zaangazuj',
      title: 'Kontra 2 na 1',
      question: 'Masz piłkę, kolega biegnie lewą stroną, przed wami jest jeden obrońca. Co robisz?',
      lesson:
        'W przewadze 2 na 1 prowadź piłkę prosto na obrońcę. Musi się zdecydować — a każda jego decyzja otwiera drogę tobie albo koledze.',
      intro: {
        duration: 3.0,
        tracks: {
          ty: [{ t: 3.0, x: 39, y: 36 }],
          p: [{ t: 3.0, x: 23, y: 36 }],
          d: [{ t: 3.0, x: 34.5, y: 25 }],
          r: [{ t: 3.0, x: 44, y: 46 }],
          gk: [{ t: 3.0, x: 34.5, y: 3.5 }],
        },
        events: [{ t: 0.2, text: 'Kontra! 2 na 1', tone: 'info', dur: 2.6 }],
      },
      options: [
        {
          id: 'na-obronce',
          label: 'Prowadzę piłkę prosto na obrońcę, żeby musiał się zdecydować',
          correct: true,
          outcome: 'Obrońca musi wybrać',
          feedback:
            'Dobrze! Atakując obrońcę zmuszasz go do decyzji: albo wyjdzie do ciebie i zostawi kolegę, albo zostanie przy koledze i odda ci drogę do bramki.',
          clip: {
            duration: 3.0,
            tracks: {
              ty: [{ t: 3.0, x: 37, y: 24 }],
              p: [{ t: 3.0, x: 21, y: 24 }],
              d: [{ t: 2.0, x: 34.5, y: 22 }, { t: 3.0, x: 35.5, y: 21 }],
              r: [{ t: 3.0, x: 42, y: 34 }],
              gk: [{ t: 3.0, x: 34.5, y: 4 }],
            },
            events: [{ t: 2.0, text: 'Obrońca musi wybrać', tone: 'good', dur: 2 }],
          },
          highlights: [
            { type: 'arrow', from: [39, 36], to: [37.3, 26.5], tone: 'good', label: 'atakujesz obrońcę', labelDx: 8, labelDy: 0 },
            { type: 'line', from: 'd', to: 'p', tone: 'info', dashed: true },
          ],
        },
        {
          id: 'podaj-od-razu',
          label: 'Od razu podaję do kolegi',
          correct: false,
          outcome: 'Strata piłki',
          feedback:
            'Podanie przyszło za wcześnie: obrońca nie musiał wybierać, tylko przesunął się i przeciął piłkę. W 2 na 1 najpierw zaangażuj obrońcę, dopiero potem podawaj.',
          clip: {
            duration: 3.0,
            tracks: {
              ty: [{ t: 3.0, x: 37, y: 32 }],
              p: [{ t: 1.2, x: 22.5, y: 32.5 }, { t: 3.0, x: 23, y: 30 }],
              d: [{ t: 1.1, x: 26, y: 30.8 }, { t: 1.6, x: 26.5, y: 31.5 }],
              r: [{ t: 3.0, x: 42, y: 38 }],
            },
            ball: [
              { t: 0.3, on: 'ty' },
              { t: 1.1, on: 'd' },
              { t: 1.6, on: 'd' },
              { t: 2.7, x: 10, y: 55, arc: 6 },
            ],
            events: [{ t: 1.1, text: 'Przechwyt!', tone: 'bad', dur: 1.8 }],
          },
          highlights: [{ type: 'arrow', from: [38.5, 35], to: [26.5, 31], tone: 'bad', label: 'za wcześnie', labelDy: -2 }],
        },
        {
          id: 'do-linii',
          label: 'Uciekam z piłką do prawej linii, daleko od obrońcy',
          correct: false,
          outcome: 'Akcja zgaszona',
          feedback:
            'Uciekając do linii, ułatwiłeś obrońcy zadanie: jednym ruchem zamknął ci drogę do bramki, a kolega został bez podania. Akcja straciła tempo i rywale zdążyli wrócić.',
          clip: {
            duration: 3.4,
            tracks: {
              ty: [{ t: 1.6, x: 53, y: 29 }, { t: 2.6, x: 56, y: 22 }],
              p: [{ t: 3.4, x: 24, y: 24 }],
              d: [{ t: 1.6, x: 45, y: 23 }, { t: 2.6, x: 55, y: 21 }],
              r: [{ t: 3.4, x: 50, y: 30 }],
            },
            ball: [
              { t: 2.5, on: 'ty' },
              { t: 2.7, on: 'd' },
              { t: 3.2, x: 69, y: 19 },
            ],
            events: [{ t: 2.7, text: 'Wybita na aut', tone: 'bad', dur: 1.6 }],
          },
          highlights: [{ type: 'arrow', from: [39, 36], to: [55, 23], tone: 'bad', label: 'z dala od bramki', labelDx: -9, labelDy: 0 }],
        },
        {
          id: 'strzal-z-daleka',
          quality: 1,
          label: 'Strzelam od razu z 35 metrów',
          correct: false,
          outcome: 'Łatwa obrona bramkarza',
          feedback:
            'Strzał z tak daleka to prezent dla bramkarza — a mieliście przewagę 2 na 1. Najlepsza okazja dopiero miała przyjść.',
          clip: {
            duration: 2.8,
            tracks: {
              ty: [{ t: 2.8, x: 38.5, y: 33 }],
              p: [{ t: 2.8, x: 23, y: 31 }],
              d: [{ t: 2.8, x: 35, y: 23 }],
              gk: [{ t: 1.5, x: 35.5, y: 2.2 }],
              r: [{ t: 2.8, x: 43, y: 40 }],
            },
            ball: [
              { t: 0.4, on: 'ty' },
              { t: 1.6, on: 'gk', arc: 3 },
            ],
            events: [{ t: 1.6, text: 'Bramkarz łapie', tone: 'bad', dur: 1.6 }],
          },
          highlights: [{ type: 'arrow', from: [39, 35], to: [35.5, 4], tone: 'bad', label: '35 metrów', labelDx: 6, labelDy: 0 }],
        },
      ],
      timeout: {
        outcome: 'Strata piłki',
        feedback:
          'Zwolniłeś i czekałeś — obrońca to wykorzystał, doskoczył i odebrał piłkę. Przewaga 2 na 1 trwa tylko chwilę.',
        clip: {
          duration: 2.6,
          tracks: {
            ty: [{ t: 1.5, x: 39.5, y: 34 }],
            d: [{ t: 1.5, x: 39.5, y: 31.5 }, { t: 2.6, x: 42, y: 34 }],
            p: [{ t: 2.6, x: 23, y: 31 }],
            r: [{ t: 2.6, x: 42, y: 38 }],
          },
          ball: [
            { t: 1.5, on: 'ty' },
            { t: 1.7, on: 'd' },
          ],
          events: [{ t: 1.7, text: 'Odbiór', tone: 'bad', dur: 1.6 }],
        },
      },
    },

    {
      id: 'moment-podania',
      title: 'Moment podania',
      question: 'Zbliżasz się do pola karnego, kolega biegnie lewą stroną. Patrz na obrońcę! Co robisz?',
      lesson:
        'Patrz na obrońcę: jeśli wychodzi do ciebie — podaj do wolnego kolegi. Jeśli zostaje przy koledze — prowadź piłkę na bramkę i strzelaj.',
      intro: {
        duration: 1.8,
        tracks: {
          ty: [{ t: 1.8, x: 35.5, y: 20.3 }],
          d: [{ t: 1.8, x: 37.2, y: 16.2 }],
          p: [{ t: 1.8, x: 22, y: 17 }],
          r: [{ t: 1.8, x: 40, y: 28 }],
          gk: [{ t: 1.8, x: 35, y: 4 }],
        },
        events: [{ t: 0.2, text: 'Patrz, co robi obrońca', tone: 'info', dur: 1.6 }],
      },
      options: [
        {
          id: 'podaj',
          label: 'Podaję do kolegi',
          correct: true,
          outcome: 'Gol!',
          feedback:
            'Idealnie! Obrońca wyszedł do ciebie i zostawił kolegę — podałeś dokładnie w tym momencie. Kolega miał przed sobą tylko bramkarza.',
          clip: {
            duration: 3.0,
            tracks: {
              p: [{ t: 1.0, x: 24, y: 13.5 }, { t: 1.9, x: 27, y: 9 }],
              d: [{ t: 0.5, x: 36, y: 17 }, { t: 2.2, x: 31, y: 12 }],
              ty: [{ t: 3.0, x: 35, y: 11 }],
              gk: [{ t: 1.4, x: 31.5, y: 4 }, { t: 2.2, x: 32, y: 3, pose: 'down' }],
              r: [{ t: 3.0, x: 38, y: 19 }],
            },
            ball: [
              { t: 0.3, on: 'ty' },
              { t: 1.0, on: 'p' },
              { t: 1.9, on: 'p' },
              { t: 2.3, x: 36.8, y: -0.6, arc: 0.8 },
            ],
            events: [{ t: 2.4, text: 'GOL', tone: 'good', dur: 3 }],
          },
          highlights: [{ type: 'arrow', from: [35.5, 19.3], to: [24.5, 14], tone: 'good', label: 'w tym momencie', labelDy: 2.6 }],
        },
        {
          id: 'strzal',
          label: 'Prowadzę piłkę dalej i strzelam',
          correct: false,
          outcome: 'Strzał zablokowany',
          feedback:
            'Obrońca wyszedł do ciebie i stał metr przed tobą — taki strzał prawie zawsze trafia w niego. A kolega obok był zupełnie wolny.',
          clip: {
            duration: 2.6,
            tracks: {
              d: [{ t: 0.4, x: 36.8, y: 17.2, pose: 'down' }],
              p: [{ t: 2.6, x: 24, y: 13 }],
              r: [{ t: 2.6, x: 39, y: 23 }],
            },
            ball: [
              { t: 0.3, on: 'ty' },
              { t: 0.5, x: 36.2, y: 17.8 },
              { t: 1.5, x: 47, y: 24, arc: 1.5 },
            ],
            events: [{ t: 0.5, text: 'Zablokowany!', tone: 'bad', dur: 1.8 }],
          },
          highlights: [{ type: 'circle', at: [36.6, 17.4], r: 3, tone: 'bad', label: 'obrońca na linii strzału' }],
        },
        {
          id: 'drybling',
          label: 'Próbuję minąć obrońcę zwodem',
          correct: false,
          outcome: 'Strata piłki',
          feedback:
            'Drybling 1 na 1, gdy obok jest wolny kolega, to niepotrzebne ryzyko. Obrońca właśnie na to czekał.',
          clip: {
            duration: 2.6,
            tracks: {
              ty: [{ t: 0.8, x: 38.4, y: 18.6 }],
              d: [{ t: 0.8, x: 38.6, y: 16.4 }, { t: 1.5, x: 39.4, y: 16.8 }],
              p: [{ t: 2.6, x: 24, y: 13 }],
              r: [{ t: 2.6, x: 39, y: 23 }],
            },
            ball: [
              { t: 0.85, on: 'ty' },
              { t: 1.0, on: 'd' },
              { t: 1.4, on: 'd' },
              { t: 2.4, x: 60, y: 40, arc: 4 },
            ],
            events: [{ t: 1.0, text: 'Odbiór', tone: 'bad', dur: 1.6 }],
          },
          highlights: [{ type: 'arrow', from: [35.5, 19.3], to: [24.5, 14.5], tone: 'info', label: 'wolny kolega', labelDy: 2.6 }],
        },
        {
          id: 'czekaj',
          label: 'Zwalniam i czekam, aż kolega podbiegnie bliżej',
          correct: false,
          outcome: 'Przewaga stracona',
          feedback:
            'Każda sekunda czekania pozwala rywalom wrócić. Zawodnik, który gonił akcję, dobiegł i odebrał ci piłkę od tyłu.',
          clip: {
            duration: 2.6,
            tracks: {
              p: [{ t: 1.6, x: 30, y: 18 }],
              d: [{ t: 1.6, x: 34, y: 17 }],
              r: [{ t: 1.5, x: 37, y: 21.8 }, { t: 2.6, x: 41, y: 24 }],
            },
            ball: [
              { t: 1.5, on: 'ty' },
              { t: 1.7, on: 'r' },
            ],
            events: [{ t: 1.6, text: 'Rywal wrócił', tone: 'bad', dur: 1.6 }],
          },
          highlights: [{ type: 'arrow', from: [40, 28], to: [37.8, 21.8], tone: 'bad', label: 'rywal wraca', labelDx: 7, labelDy: 0 }],
        },
      ],
      variants: [
        {
          // Cue B: the defender stays with the team-mate and cuts the pass — the way to goal is open.
          variantId: 'obronca-przy-koledze',
          intro: {
            duration: 1.8,
            tracks: {
              ty: [{ t: 1.8, x: 35.5, y: 20.3 }],
              d: [{ t: 1.8, x: 28.5, y: 14.5 }],
              p: [{ t: 1.8, x: 22, y: 17 }],
              r: [{ t: 1.8, x: 40, y: 28 }],
              gk: [{ t: 1.8, x: 35, y: 4 }],
            },
            events: [{ t: 0.2, text: 'Patrz, co robi obrońca', tone: 'info', dur: 1.6 }],
          },
          options: [
            {
              id: 'podaj',
              label: 'Podaję do kolegi',
              correct: false,
              outcome: 'Strata piłki',
              feedback:
                'Obrońca został przy koledze właśnie po to, żeby przeciąć podanie. Gdy obrońca pilnuje partnera, droga do bramki jest twoja.',
              clip: {
                duration: 2.6,
                tracks: {
                  d: [{ t: 0.9, x: 27.5, y: 15.5 }],
                  p: [{ t: 2.6, x: 24, y: 14 }],
                  r: [{ t: 2.6, x: 38, y: 24 }],
                },
                ball: [
                  { t: 0.3, on: 'ty' },
                  { t: 0.9, on: 'd' },
                  { t: 1.4, on: 'd' },
                  { t: 2.4, x: 12, y: 40, arc: 5 },
                ],
                events: [{ t: 0.9, text: 'Przechwyt!', tone: 'bad', dur: 1.6 }],
              },
              highlights: [{ type: 'cross', from: [35.5, 19.3], to: [23, 16.5], tone: 'bad', label: 'obrońca w linii podania', labelDy: -2.2 }],
            },
            {
              id: 'strzal',
              label: 'Prowadzę piłkę dalej i strzelam',
              correct: true,
              outcome: 'Gol!',
              feedback:
                'Świetnie! Obrońca został przy koledze i odciął podanie — więc droga do bramki była wolna. Wykorzystałeś to, co dał ci rywal.',
              clip: {
                duration: 2.8,
                tracks: {
                  ty: [{ t: 1.0, x: 36, y: 12.5 }, { t: 2.8, x: 35, y: 9 }],
                  d: [{ t: 1.4, x: 32, y: 12 }],
                  p: [{ t: 1.6, x: 24, y: 11 }],
                  gk: [{ t: 1.0, x: 35.5, y: 3.5 }, { t: 1.5, x: 33.5, y: 2.4, pose: 'down' }],
                  r: [{ t: 2.6, x: 38, y: 20 }],
                },
                ball: [
                  { t: 1.0, on: 'ty' },
                  { t: 1.4, x: 31.2, y: -0.6, arc: 0.6 },
                ],
                events: [{ t: 1.5, text: 'GOL', tone: 'good', dur: 3 }],
              },
              highlights: [{ type: 'arrow', from: [35.5, 19.3], to: [36, 13.5], tone: 'good', label: 'wolna droga', labelDx: 7, labelDy: 0 }],
            },
            {
              id: 'drybling',
              label: 'Próbuję minąć obrońcę zwodem',
              correct: false,
              outcome: 'Strata piłki',
              feedback:
                'Obrońca nie wyszedł do ciebie — to ty ruszyłeś na niego. Pojedynek, którego nie trzeba było grać, skończył się stratą, a droga do bramki była wolna.',
              clip: {
                duration: 2.6,
                tracks: {
                  ty: [{ t: 1.0, x: 31.5, y: 16 }],
                  d: [{ t: 1.0, x: 30, y: 15.2 }],
                  p: [{ t: 2.6, x: 24, y: 13 }],
                  r: [{ t: 2.6, x: 38, y: 23 }],
                },
                ball: [
                  { t: 0.95, on: 'ty' },
                  { t: 1.1, on: 'd' },
                  { t: 1.5, on: 'd' },
                  { t: 2.5, x: 14, y: 40, arc: 5 },
                ],
                events: [{ t: 1.1, text: 'Odbiór', tone: 'bad', dur: 1.4 }],
              },
              highlights: [{ type: 'arrow', from: [35.5, 19.3], to: [36, 13.5], tone: 'info', label: 'wolna droga', labelDx: 7, labelDy: 0 }],
            },
            {
              id: 'czekaj',
              label: 'Zwalniam i czekam, aż kolega podbiegnie bliżej',
              correct: false,
              outcome: 'Przewaga stracona',
              feedback:
                'Każda sekunda czekania pozwala rywalom wrócić. Zawodnik, który gonił akcję, dobiegł i odebrał ci piłkę od tyłu.',
              clip: {
                duration: 2.6,
                tracks: {
                  p: [{ t: 1.6, x: 26, y: 17 }],
                  d: [{ t: 1.6, x: 30, y: 15.5 }],
                  r: [{ t: 1.5, x: 37, y: 21.8 }, { t: 2.6, x: 41, y: 24 }],
                },
                ball: [
                  { t: 1.5, on: 'ty' },
                  { t: 1.7, on: 'r' },
                ],
                events: [{ t: 1.6, text: 'Rywal wrócił', tone: 'bad', dur: 1.6 }],
              },
              highlights: [{ type: 'arrow', from: [40, 28], to: [37.8, 21.8], tone: 'bad', label: 'rywal wraca', labelDx: 7, labelDy: 0 }],
            },
          ],
        },
      ],
      timeout: {
        optionId: 'czekaj',
        feedback:
          'Zbyt długo się zastanawiałeś — rywal, który gonił akcję, dobiegł i odebrał piłkę. Przewagę 2 na 1 trzeba wykorzystać od razu.',
      },
    },
  ],
}
