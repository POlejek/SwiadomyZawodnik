// Situation: positional attack, the winger reaches the byline. "TY" (no. 9) is the striker.
// The view is the OPPONENT's half: their goal at the top, we attack upwards (facingUp: 'home').

export const wbiegniecieBlizszySlupek = {
  id: 'wbiegniecie-blizszy-slupek',
  title: 'Wbiegnięcie w pole karne',
  subtitle: 'Skrzydłowy przy linii końcowej, ty jesteś napastnikiem',
  category: 'Wykończenie',
  level: 'Średni',
  facingUp: 'home',
  brief:
    'Atak pozycyjny prawą stroną. Kolega ze skrzydła dochodzi do linii końcowej i zaraz zagra płasko przed bramkę. Jesteś napastnikiem, a obrońca stoi tuż przed tobą.',

  entities: [
    { id: 'gk', team: 'awayGK', number: 1, x: 35, y: 2.5 },
    { id: 'c1', team: 'away', number: 4, x: 37, y: 17 },
    { id: 'c2', team: 'away', number: 5, x: 28, y: 12 },
    { id: 'fb', team: 'away', number: 2, x: 57, y: 13 },
    { id: 'ty', team: 'home', number: 9, x: 36, y: 20, you: true },
    { id: 'wg', team: 'home', number: 7, x: 58, y: 10 },
    { id: 'om', team: 'home', number: 8, x: 30, y: 26 },
  ],
  ball: { on: 'wg' },

  stages: [
    {
      id: 'gdzie-wbiec',
      title: 'Gdzie wbiec?',
      question: 'Skrzydłowy jest przy linii końcowej i zaraz zagra płasko i mocno przed bramkę. Obrońca stoi przed tobą. Gdzie biegniesz?',
      lesson:
        'Do płaskiego, mocnego podania wzdłuż bramki atakuj bliższy słupek i wbiegaj przed obrońcę — kto pierwszy przy piłce, ten strzela.',
      intro: {
        duration: 2.2,
        tracks: {
          wg: [{ t: 2.2, x: 60, y: 5 }],
          fb: [{ t: 2.2, x: 56.5, y: 8.4 }],
          gk: [{ t: 2.2, x: 36.5, y: 2.2 }],
          ty: [{ t: 2.2, x: 35, y: 19 }],
          c1: [{ t: 2.2, x: 37.5, y: 14.6 }],
          c2: [{ t: 2.2, x: 29, y: 10 }],
          om: [{ t: 2.2, x: 31, y: 23 }],
        },
        events: [{ t: 0.2, text: 'Skrzydłowy dochodzi do linii końcowej', tone: 'info', dur: 2 }],
      },
      options: [
        {
          id: 'blizszy',
          label: 'Na bliższy słupek, przed obrońcę',
          correct: true,
          outcome: 'Jesteś pierwszy przy piłce',
          feedback:
            'Dobrze! Wbiegłeś przed obrońcę dokładnie w miejsce, w które leci płaskie podanie. Obrońca został za twoimi plecami.',
          clip: {
            duration: 1.6,
            tracks: {
              ty: [{ t: 0.5, x: 40, y: 15.5 }, { t: 1.3, x: 40.2, y: 6.8 }],
              c1: [{ t: 0.6, x: 38, y: 13 }, { t: 1.4, x: 37.2, y: 9.8 }],
              c2: [{ t: 1.4, x: 31, y: 6.5 }],
              gk: [{ t: 1.4, x: 38.3, y: 1.8 }],
              fb: [{ t: 1.0, x: 57, y: 6.5 }],
              om: [{ t: 1.6, x: 32, y: 16 }],
            },
            ball: [
              { t: 0.9, on: 'wg' },
              { t: 1.4, on: 'ty' },
            ],
            events: [{ t: 1.2, text: 'Jesteś pierwszy przy piłce!', tone: 'good', dur: 1.6 }],
          },
          highlights: [{ type: 'arrow', from: [35, 19], to: [40, 8.6], tone: 'good', label: 'przed obrońcę', labelDx: 8, labelDy: 0 }],
        },
        {
          id: 'zostaje',
          label: 'Zostaję w miejscu i czekam na piłkę',
          correct: false,
          outcome: 'Akcja zmarnowana',
          feedback:
            'Czekając w miejscu, oddałeś obrońcy pozycję przed tobą — płaskie, mocne podanie trafiło prosto do niego. Do takich podań trzeba atakować przestrzeń.',
          clip: {
            duration: 2.8,
            tracks: {
              ty: [{ t: 1.6, x: 35, y: 17.5 }],
              c1: [{ t: 1.3, x: 39.5, y: 7.5 }],
              gk: [{ t: 1.4, x: 37, y: 2.2 }],
            },
            ball: [
              { t: 0.9, on: 'wg' },
              { t: 1.35, on: 'c1' },
              { t: 2.4, x: 47, y: 40, arc: 6 },
            ],
            events: [{ t: 1.35, text: 'Obrońca wybija', tone: 'bad', dur: 1.4 }],
          },
          highlights: [{ type: 'circle', at: [39.5, 8], r: 3, tone: 'bad', label: 'tu leciała piłka' }],
        },
        {
          id: 'dalszy',
          label: 'Na dalszy słupek, za plecy obrońcy',
          correct: false,
          outcome: 'Bramkarz przecina podanie',
          feedback:
            'Płaskie, mocne podanie nie doleci na dalszy słupek — po drodze przetnie je bramkarz albo obrońca. Na dalszy słupek biegnij przy dośrodkowaniu górą.',
          clip: {
            duration: 2.4,
            tracks: {
              ty: [{ t: 1.4, x: 30, y: 6 }],
              c2: [{ t: 1.4, x: 30.5, y: 8 }],
              c1: [{ t: 1.4, x: 37, y: 10 }],
              gk: [{ t: 1.2, x: 38.5, y: 2.8 }],
            },
            ball: [
              { t: 0.9, on: 'wg' },
              { t: 1.3, on: 'gk' },
            ],
            events: [{ t: 1.3, text: 'Bramkarz przecina', tone: 'bad', dur: 1.4 }],
          },
          highlights: [{ type: 'arrow', from: [35, 19], to: [30.3, 7.5], tone: 'bad', label: 'za daleko', labelDx: -6, labelDy: 0 }],
        },
        {
          id: 'cofam',
          label: 'Cofam się na skraj pola karnego',
          correct: false,
          outcome: 'Podanie w pustkę',
          feedback:
            'Gdy skrzydłowy jest przy linii końcowej, napastnik musi być w polu karnym. Cofając się, zostawiłeś kolegę bez adresata podania.',
          clip: {
            duration: 3.0,
            tracks: {
              ty: [{ t: 1.4, x: 37, y: 22 }],
              c1: [{ t: 1.4, x: 37, y: 13 }],
              c2: [{ t: 1.6, x: 35, y: 9.5 }],
            },
            ball: [
              { t: 0.9, on: 'wg' },
              { t: 1.6, on: 'c2' },
              { t: 2.6, x: 20, y: 40, arc: 6 },
            ],
            events: [{ t: 1.4, text: 'Nikogo w polu karnym', tone: 'bad', dur: 1.4 }],
          },
          highlights: [{ type: 'arrow', from: [35, 19], to: [36.8, 21.2], tone: 'bad', label: 'od bramki', labelDx: 6, labelDy: 0 }],
        },
      ],
      timeout: {
        optionId: 'zostaje',
        feedback:
          'Zanim zdecydowałeś, piłka już leciała — a obrońca stał przed tobą i ją wybił. Napastnik decyduje o wbiegnięciu, zanim skrzydłowy poda.',
      },
    },

    {
      id: 'wykonczenie',
      title: 'Wykończenie',
      question: 'Piłka dociera do ciebie przy bliższym słupku. Bramkarz zasłania bliższy róg, obrońca jest tuż za tobą. Co robisz?',
      lesson:
        'Bramkarz zasłania bliższy róg, więc kieruj piłkę tam, gdzie go nie ma. Z bliska wystarczy dokładne dotknięcie, a nie siła.',
      intro: null,
      options: [
        {
          id: 'dalszy-rog',
          label: 'Dotykam piłkę z pierwszej w dalszy róg',
          correct: true,
          outcome: 'Gol!',
          feedback:
            'Świetnie! Jedno dokładne dotknięcie w róg, którego bramkarz nie zasłaniał. Obrońca nie zdążył zareagować.',
          clip: {
            duration: 2.6,
            tracks: {
              gk: [{ t: 0.45, x: 37.5, y: 2 }, { t: 0.75, x: 35.8, y: 1.6, pose: 'down' }],
              c1: [{ t: 0.8, x: 36.5, y: 8 }],
              ty: [{ t: 1.5, x: 38.5, y: 4.5 }],
              om: [{ t: 1.5, x: 33, y: 12 }],
            },
            ball: [
              { t: 0.15, on: 'ty' },
              { t: 0.6, x: 31.5, y: -0.6 },
            ],
            events: [{ t: 0.7, text: 'GOL', tone: 'good', dur: 3 }],
          },
          highlights: [{ type: 'arrow', from: [40.2, 5.8], to: [31.8, -0.2], tone: 'good', label: 'dalszy róg', labelDx: -6, labelDy: 2 }],
        },
        {
          id: 'obrot',
          label: 'Przyjmuję piłkę i próbuję się obrócić',
          correct: false,
          outcome: 'Okazja stracona',
          feedback:
            'Obrońca był tuż za tobą — przyjęcie dało mu czas, żeby wybić ci piłkę spod nóg. Pięć metrów od bramki kończ akcję z pierwszej piłki.',
          clip: {
            duration: 2.4,
            tracks: {
              ty: [{ t: 0.5, x: 40.4, y: 7.2 }],
              c1: [{ t: 0.6, x: 39.4, y: 8.4 }],
            },
            ball: [
              { t: 0.5, on: 'ty' },
              { t: 0.7, on: 'c1' },
              { t: 1.6, x: 50, y: 28, arc: 5 },
            ],
            events: [{ t: 0.7, text: 'Odbiór', tone: 'bad', dur: 1.6 }],
          },
          highlights: [{ type: 'circle', at: [39.8, 8], r: 2.8, tone: 'bad', label: 'obrońca za plecami' }],
        },
        {
          id: 'blizszy-rog',
          label: 'Uderzam z całej siły w bliższy róg',
          correct: false,
          outcome: 'Obrona bramkarza',
          feedback:
            'Bramkarz stał właśnie przy bliższym słupku — mocny strzał prosto w niego łatwo odbić. Siła nie pomoże, gdy celujesz tam, gdzie jest bramkarz.',
          clip: {
            duration: 2.2,
            tracks: {
              gk: [{ t: 0.35, x: 38.8, y: 2.2, pose: 'down' }],
            },
            ball: [
              { t: 0.15, on: 'ty' },
              { t: 0.4, x: 38.4, y: 2.9 },
              { t: 1.2, x: 47, y: 7, arc: 1.2 },
            ],
            events: [{ t: 0.45, text: 'Bramkarz broni', tone: 'bad', dur: 1.6 }],
          },
          highlights: [{ type: 'arrow', from: [40.2, 5.8], to: [38.8, 3], tone: 'bad', label: 'prosto w bramkarza', labelDx: 10, labelDy: 0 }],
        },
        {
          id: 'przepuszczam',
          label: 'Przepuszczam piłkę dalej, do kolegi z tyłu',
          correct: false,
          outcome: 'Okazja stracona',
          feedback:
            'Za tobą nie było nikogo wolnego, a ty byłeś na najlepszej pozycji na boisku. Gdy masz piłkę 5 metrów od bramki — kończ akcję.',
          clip: {
            duration: 2.6,
            tracks: {
              c2: [{ t: 1.25, x: 34.5, y: 12 }],
              om: [{ t: 1.4, x: 32, y: 15 }],
            },
            ball: [
              { t: 0.2, on: 'ty' },
              { t: 1.25, on: 'c2' },
              { t: 2.2, x: 15, y: 35, arc: 6 },
            ],
            events: [{ t: 1.25, text: 'Obrońca przecina', tone: 'bad', dur: 1.4 }],
          },
          highlights: [{ type: 'arrow', from: [40.2, 5.8], to: [34.8, 12], tone: 'bad', label: 'do obrońcy', labelDx: -6, labelDy: 0 }],
        },
      ],
      timeout: {
        optionId: 'obrot',
        feedback:
          'Zastanawiałeś się z piłką przy nodze, a obrońca za plecami nie czekał. Przy bramce na decyzję masz ułamek sekundy.',
      },
    },
  ],
}
