// Situation: 1 v 1 against a winger at the touchline. "TY" (no. 2) is the full-back.
// The view is OUR half: our goal at the top, opponents attack upwards.
// Stage 1 stops while the pass to the winger is still in the air (the ball keys use ease: 'linear'
// so the pass keeps its speed across the pause).

const W = 'Gol dla rywala'

export const pojedynekPrzyLinii = {
  id: 'pojedynek-przy-linii',
  title: 'Pojedynek 1 na 1 przy linii',
  subtitle: 'Skrzydłowy rywala dostaje piłkę, ty jesteś bocznym obrońcą',
  faza: 'obrona',
  strefa: 'tercja-obronna',
  liczebnosc: '1v1',
  positions: ['obronca'],
  level: 'Średni',
  brief:
    'Rywal przenosi grę na skrzydło. Jesteś bocznym obrońcą i to ty zostajesz w pojedynku ze skrzydłowym. Napastnik czeka w polu karnym na dośrodkowanie.',

  entities: [
    { id: 'gk', team: 'homeGK', number: 1, x: 34, y: 3 },
    { id: 'ty', team: 'home', number: 2, x: 12, y: 24, you: true },
    { id: 'cb', team: 'home', number: 5, x: 28, y: 20 },
    { id: 'w', team: 'away', number: 11, x: 7, y: 37 },
    { id: 'st', team: 'away', number: 9, x: 30, y: 30 },
    { id: 'om', team: 'away', number: 8, x: 24, y: 44 },
  ],
  ball: { on: 'om' },

  stages: [
    {
      id: 'dystans',
      fundament: 'kontrola',
      title: 'Piłka w powietrzu',
      question: 'Rywal podaje do skrzydłowego przy linii. Piłka jeszcze leci, a ty stoisz 10 metrów od niego. Co robisz?',
      lesson:
        'Dystans do rywala skracaj, kiedy piłka jest w powietrzu. Hamuj 2–3 metry przed nim i ustaw się bokiem — wtedy to ty decydujesz, dokąd on pobiegnie.',
      intro: {
        duration: 1.1,
        tracks: {
          w: [{ t: 1.1, x: 8.2, y: 35 }],
          st: [{ t: 1.1, x: 31, y: 27 }],
          cb: [{ t: 1.1, x: 28.5, y: 19 }],
          ty: [{ t: 1.1, x: 12, y: 24.5 }],
        },
        ball: [
          { t: 0.3, on: 'om' },
          { t: 1.1, x: 16.3, y: 38, ease: 'linear' },
        ],
        events: [{ t: 0.1, text: 'Podanie na skrzydło', tone: 'info', dur: 1 }],
      },
      options: [
        {
          id: 'skroc',
          label: 'Skracam dystans, póki piłka leci, i hamuję przed nim ustawiony bokiem',
          correct: true,
          outcome: 'Skrzydłowy bez miejsca',
          feedback:
            'Dobrze! Dobiegłeś, zanim piłka do niego doleciała, i zahamowałeś 3 metry przed nim. Nie może się spokojnie obrócić, a ustawiony bokiem kierujesz go do linii bocznej.',
          clip: {
            duration: 1.8,
            tracks: {
              ty: [{ t: 0.8, x: 9.8, y: 30.2 }, { t: 1.6, x: 10.2, y: 30.6 }],
              w: [{ t: 0.8, x: 8.6, y: 34 }, { t: 1.6, x: 8.2, y: 34.5 }],
              st: [{ t: 1.8, x: 31.5, y: 25 }],
            },
            ball: [{ t: 0.8, on: 'w', ease: 'linear' }],
            events: [{ t: 1.0, text: 'Skrzydłowy bez miejsca', tone: 'good', dur: 1.6 }],
          },
          highlights: [{ type: 'arrow', from: [12, 24.5], to: [10.1, 29.2], tone: 'good', label: 'w czasie lotu piłki', labelDx: 9, labelDy: 0 }],
        },
        {
          id: 'czekaj',
          label: 'Czekam na niego w miejscu',
          correct: false,
          outcome: W,
          feedback:
            'Stojąc daleko, dałeś skrzydłowemu czas na przyjęcie, obrót i spokojne dośrodkowanie. Napastnik wygrał główkę w polu karnym.',
          clip: {
            duration: 4.4,
            tracks: {
              w: [{ t: 0.8, x: 8.6, y: 34 }, { t: 2.0, x: 8.4, y: 30 }],
              ty: [{ t: 2.2, x: 11.5, y: 25 }],
              st: [{ t: 1.6, x: 31, y: 20 }, { t: 3.1, x: 33, y: 7.5 }],
              cb: [{ t: 3.1, x: 30.5, y: 9.5 }],
              gk: [{ t: 3.0, x: 35, y: 3 }, { t: 3.4, x: 33, y: 2.2, pose: 'down' }],
            },
            ball: [
              { t: 0.8, on: 'w', ease: 'linear' },
              { t: 2.2, on: 'w' },
              { t: 3.1, on: 'st', arc: 3 },
              { t: 3.5, x: 35.5, y: -0.6, arc: 1.2 },
            ],
            events: [
              { t: 2.2, text: 'Dośrodkowanie bez presji', tone: 'bad', dur: 1.2 },
              { t: 3.6, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [
            { type: 'circle', at: [8.5, 31], r: 3.2, tone: 'bad', label: 'czas i miejsce', labelDx: 0 },
            { type: 'arrow', from: [8.5, 28.5], to: [32.5, 7.5], tone: 'bad', dashed: true },
          ],
        },
        {
          id: 'pelna-predkosc',
          label: 'Biegnę na pełnej prędkości i atakuję go z przodu',
          correct: false,
          outcome: W,
          feedback:
            'Na pełnej prędkości nie zahamujesz — wystarczył jeden zwód i zostałeś za plecami rywala. Biegnij szybko, ale ostatnie metry pokonuj drobnymi krokami.',
          clip: {
            duration: 3.6,
            tracks: {
              ty: [{ t: 0.9, x: 8.9, y: 32.6 }, { t: 1.4, x: 7.8, y: 35 }],
              w: [{ t: 0.8, x: 8.6, y: 34 }, { t: 1.4, x: 13.5, y: 31.5 }, { t: 2.3, x: 21, y: 21 }],
              cb: [{ t: 2.3, x: 25, y: 18 }],
              gk: [{ t: 2.4, x: 33, y: 3 }, { t: 2.9, x: 35.3, y: 2.2, pose: 'down' }],
              st: [{ t: 2.8, x: 31, y: 20 }],
            },
            ball: [
              { t: 0.8, on: 'w', ease: 'linear' },
              { t: 2.3, on: 'w' },
              { t: 2.8, x: 36.5, y: -0.6, arc: 1 },
            ],
            events: [
              { t: 1.3, text: 'Minięty!', tone: 'bad', dur: 1 },
              { t: 2.9, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'arrow', from: [9, 33], to: [20.5, 21.5], tone: 'bad', label: 'zwód do środka', labelDx: 7, labelDy: 0 }],
        },
        {
          id: 'wslizg',
          label: 'Robię wślizg w momencie, gdy przyjmuje piłkę',
          correct: false,
          outcome: 'Rzut wolny i żółta kartka',
          feedback:
            'Wślizg w momencie przyjęcia rzadko trafia w piłkę — trafiłeś w nogi. Rywal ma rzut wolny, a ty kartkę i dalej musisz go kryć.',
          clip: {
            duration: 2.6,
            tracks: {
              ty: [{ t: 0.7, x: 9.8, y: 31 }, { t: 1.0, x: 9.8, y: 32.6, pose: 'down' }],
              w: [{ t: 0.8, x: 8.6, y: 34 }, { t: 1.1, x: 8.2, y: 35.2, pose: 'down' }],
            },
            ball: [
              { t: 0.8, on: 'w', ease: 'linear' },
              { t: 1.4, x: 10.5, y: 36.5 },
            ],
            events: [{ t: 1.1, text: 'Faul! Żółta kartka', tone: 'bad', dur: 2.4 }],
          },
          highlights: [{ type: 'circle', at: [9, 33.8], r: 3, tone: 'bad', label: 'faul' }],
        },
      ],
      timeout: {
        optionId: 'czekaj',
        feedback:
          'Zanim zdecydowałeś, piłka doleciała, a skrzydłowy miał czas się obrócić i dośrodkować. W pojedynku liczy się to, co zrobisz w czasie lotu piłki.',
      },
    },

    {
      id: 'wypuszczona-pilka',
      fundament: 'kontrola',
      title: 'Wyścig wzdłuż linii',
      question: 'Skrzydłowy wypuścił piłkę obok ciebie wzdłuż linii i chce cię przegonić. Co robisz?',
      lesson:
        'Gdy rywal wypuści piłkę za daleko, to twój moment: wejdź ciałem między niego a piłkę. Przy linii bocznej najprostsze rozwiązanie jest najlepsze.',
      intro: {
        duration: 1.8,
        tracks: {
          w: [{ t: 1.3, x: 6, y: 28.5 }, { t: 1.8, x: 6, y: 27.4 }],
          ty: [{ t: 1.3, x: 9.2, y: 25 }, { t: 1.8, x: 9.6, y: 24.2 }],
          st: [{ t: 1.8, x: 32, y: 20 }],
          om: [{ t: 1.8, x: 24, y: 34 }],
          cb: [{ t: 1.8, x: 29.5, y: 15 }],
        },
        ball: [
          { t: 1.3, on: 'w' },
          { t: 1.8, x: 5.4, y: 21.8 },
        ],
        events: [{ t: 0.2, text: 'Skrzydłowy rusza wzdłuż linii', tone: 'info', dur: 1.5 }],
      },
      options: [
        {
          id: 'cialem',
          label: 'Wchodzę ciałem między rywala a piłkę i wybijam ją na aut',
          correct: true,
          outcome: 'Atak zatrzymany',
          feedback:
            'Dokładnie tak! Byłeś bliżej piłki, więc zasłoniłeś ją ciałem i wybiłeś na aut. Rywal nie dośrodkuje, a twoja drużyna zdąży się ustawić.',
          clip: {
            duration: 2.0,
            tracks: {
              ty: [{ t: 0.5, x: 6.8, y: 22.2 }],
              w: [{ t: 0.5, x: 6.4, y: 25.4 }, { t: 1.0, x: 7.6, y: 25.8 }],
            },
            ball: [
              { t: 0.45, x: 5.5, y: 21.6 },
              { t: 0.9, x: -1.5, y: 19.5, arc: 0.6 },
            ],
            events: [{ t: 0.9, text: 'Aut — atak zatrzymany', tone: 'good', dur: 1.6 }],
          },
          highlights: [{ type: 'arrow', from: [9.6, 24.2], to: [7.2, 22.6], tone: 'good', label: 'ciałem do piłki', labelDx: 9, labelDy: 0 }],
        },
        {
          id: 'koszulka',
          label: 'Ścigam się z nim i łapię go za koszulkę',
          correct: false,
          outcome: 'Rzut wolny i żółta kartka',
          feedback:
            'Byłeś bliżej piłki, więc trzymanie za koszulkę nie było potrzebne. Sędzia to widział: rzut wolny dla rywala i żółta kartka dla ciebie.',
          clip: {
            duration: 2.6,
            tracks: {
              ty: [{ t: 0.6, x: 7.3, y: 22.8 }],
              w: [{ t: 0.5, x: 6.4, y: 23.5 }, { t: 0.8, x: 5.6, y: 22.4, pose: 'down' }],
            },
            ball: [
              { t: 0.6, x: 5.3, y: 21.2 },
              { t: 1.4, x: 5, y: 19.8 },
            ],
            events: [{ t: 0.8, text: 'Faul! Żółta kartka', tone: 'bad', dur: 2.2 }],
          },
          highlights: [{ type: 'circle', at: [6.5, 22.8], r: 2.8, tone: 'bad', label: 'faul', labelDx: 0 }],
        },
        {
          id: 'odpuszczam',
          label: 'Odpuszczam go i wracam pod własne pole karne',
          correct: false,
          outcome: W,
          feedback:
            'Odpuszczając, oddałeś skrzydłowemu piłkę i czas na dośrodkowanie. Napastnik w polu karnym tylko na to czekał.',
          clip: {
            duration: 3.6,
            tracks: {
              ty: [{ t: 1.6, x: 22, y: 11 }],
              w: [{ t: 0.8, x: 5.6, y: 21.5 }, { t: 1.4, x: 6, y: 18.5 }],
              st: [{ t: 2.3, x: 33.5, y: 7.5 }],
              cb: [{ t: 2.3, x: 30, y: 9.5 }],
              gk: [{ t: 2.2, x: 32.5, y: 3 }, { t: 2.6, x: 35, y: 2.4, pose: 'down' }],
              om: [{ t: 2.7, x: 24, y: 26 }],
            },
            ball: [
              { t: 0.8, on: 'w' },
              { t: 1.4, on: 'w' },
              { t: 2.3, on: 'st', arc: 2.5 },
              { t: 2.7, x: 31.3, y: -0.6, arc: 1 },
            ],
            events: [
              { t: 1.4, text: 'Dośrodkowanie', tone: 'bad', dur: 1 },
              { t: 2.8, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'arrow', from: [6, 17.5], to: [33, 7], tone: 'bad', dashed: true, label: 'wolne dośrodkowanie', labelDy: -1.8 }],
        },
        {
          id: 'czekam-na-aut',
          label: 'Odwracam się i czekam, aż piłka sama wyjdzie na aut',
          correct: false,
          outcome: W,
          feedback:
            'Piłka nie wyszła na aut, a ty przestałeś walczyć. Skrzydłowy dobiegł do niej, wycofał do wbiegającego pomocnika i ten strzelił. Nigdy nie zakładaj, że piłka sama wyjdzie.',
          clip: {
            duration: 5.0,
            tracks: {
              ty: [{ t: 1.6, x: 8, y: 22 }],
              w: [{ t: 1.7, x: 4.8, y: 18.6 }, { t: 2.3, x: 7, y: 15 }],
              om: [{ t: 3.0, x: 21, y: 18 }, { t: 3.8, x: 23, y: 15 }],
              gk: [{ t: 3.6, x: 32, y: 3 }, { t: 4.1, x: 34, y: 2.2, pose: 'down' }],
              st: [{ t: 3.0, x: 32, y: 10 }],
            },
            ball: [
              { t: 1.6, x: 4.6, y: 17.5 },
              { t: 1.75, on: 'w' },
              { t: 2.3, on: 'w' },
              { t: 3.0, on: 'om' },
              { t: 3.8, on: 'om' },
              { t: 4.2, x: 36, y: -0.6, arc: 1.2 },
            ],
            events: [
              { t: 1.75, text: 'Piłka nie wyszła!', tone: 'bad', dur: 1.2 },
              { t: 4.3, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'circle', at: [4.8, 17.8], r: 2.6, tone: 'bad', label: 'w boisku', labelDx: 0 }],
        },
      ],
      timeout: {
        optionId: 'odpuszczam',
        feedback:
          'Zawahałeś się, a skrzydłowy pierwszy dobiegł do piłki i dośrodkował. W wyścigu do piłki liczy się pierwszy krok.',
      },
    },
  ],
}
