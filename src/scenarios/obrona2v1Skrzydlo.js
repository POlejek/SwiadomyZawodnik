// Situation: opponents counter-attack 2 v 1 down their right wing, the second attacker runs through the middle.
// The player ("TY", no. 4) is the last defender in front of the goalkeeper.
//
// Coordinates in metres (see engine/pitch.js): x 0..68 across, y 0 = our goal line → 52.5 = halfway line.
// Opponents attack upwards; each clip lists only where things move TO — it starts from the current state.

const W = 'Gol dla rywala'

export const obrona2v1Skrzydlo = {
  id: 'obrona-2v1-skrzydlo',
  title: 'Obrona 2 na 1',
  subtitle: 'Kontra rywala prawym skrzydłem, drugi napastnik wbiega środkiem',
  category: 'Obrona',
  level: 'Średni',
  brief:
    'Twoja drużyna straciła piłkę. Rywal z piłką pędzi prawym skrzydłem, jego partner wbiega środkiem. Jesteś ostatnim obrońcą przed bramkarzem, a kolega z pomocy dopiero wraca.',

  entities: [
    { id: 'gk', team: 'homeGK', number: 1, x: 34, y: 2.5 },
    { id: 'ty', team: 'home', number: 4, x: 40, y: 30, you: true },
    { id: 'm', team: 'home', number: 8, x: 47, y: 53 },
    { id: 'a', team: 'away', number: 7, x: 56, y: 42 },
    { id: 'b', team: 'away', number: 9, x: 31, y: 44 },
    { id: 'c', team: 'away', number: 10, x: 22, y: 53 },
  ],
  ball: { on: 'a' },

  stages: [
    // ───────────────────────────── Stage 1: the 2 v 1 arrives ─────────────────────────────
    {
      id: 'opoznianie',
      title: 'Kontra 2 na 1',
      question: 'Rywal z piłką atakuje skrzydłem, partner wbiega środkiem. Jesteś sam. Co robisz?',
      lesson:
        '2 na 1 w obronie: nie doskakuj do piłki. Opóźniaj — ustaw się między rywalami i cofaj się, żeby koledzy zdążyli wrócić.',
      intro: {
        duration: 3.2,
        tracks: {
          a: [{ t: 3.2, x: 53, y: 33 }],
          b: [{ t: 3.2, x: 31, y: 35 }],
          ty: [{ t: 3.2, x: 40, y: 27 }],
          m: [{ t: 3.2, x: 46, y: 45 }],
          c: [{ t: 3.2, x: 24, y: 47 }],
          gk: [{ t: 3.2, x: 35, y: 3 }],
        },
        events: [{ t: 0.2, text: 'Kontra rywala 2 na 1', tone: 'info', dur: 2.6 }],
      },
      options: [
        {
          id: 'doskok',
          label: 'Doskakuję do zawodnika z piłką i próbuję ją odebrać',
          correct: false,
          outcome: W,
          feedback:
            'Doskok zostawił środkowego napastnika bez opieki. Przy 2 na 1 jedno podanie mija cię „za darmo”, a za tobą jest już tylko bramkarz.',
          clip: {
            duration: 4.6,
            tracks: {
              ty: [{ t: 0.9, x: 50, y: 31 }, { t: 1.7, x: 48.5, y: 29.5 }],
              a: [{ t: 0.8, x: 52, y: 31.5 }, { t: 2.4, x: 51, y: 27 }],
              b: [{ t: 1.5, x: 32.5, y: 25 }, { t: 3.3, x: 34, y: 14 }],
              gk: [{ t: 3.0, x: 34.5, y: 5 }, { t: 3.6, x: 33, y: 3.5, pose: 'down' }],
              m: [{ t: 4.6, x: 43, y: 32 }],
              c: [{ t: 4.6, x: 27, y: 36 }],
            },
            ball: [
              { t: 0.75, on: 'a' },
              { t: 1.5, on: 'b' },
              { t: 3.3, on: 'b' },
              { t: 3.9, x: 36.5, y: -0.8, arc: 1.5 },
            ],
            events: [
              { t: 0.8, text: 'Podanie do środka' },
              { t: 4.0, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [
            { type: 'arrow', from: [52, 30.5], to: [33, 25], tone: 'bad', label: 'jedno podanie — minięty' },
          ],
        },
        {
          id: 'opozniaj',
          label: 'Cofam się, ustawiam między nimi i opóźniam akcję',
          correct: true,
          outcome: 'Akcja zwolniona',
          feedback:
            'Dobrze! Stojąc między rywalami reagujesz i na podanie, i na drybling. Cofając się kupujesz czas — kolega z pomocy już wraca.',
          clip: {
            duration: 3.4,
            tracks: {
              ty: [{ t: 3.4, x: 38, y: 19.5 }],
              a: [{ t: 3.4, x: 50, y: 23 }],
              b: [{ t: 3.4, x: 31.5, y: 24 }],
              m: [{ t: 3.4, x: 45, y: 33 }],
              c: [{ t: 3.4, x: 26, y: 37 }],
              gk: [{ t: 3.4, x: 35.5, y: 3.5 }],
            },
            events: [{ t: 2.4, text: 'Akcja zwolniona', tone: 'good', dur: 2 }],
          },
          highlights: [
            { type: 'line', from: 'a', to: 'b', tone: 'good', dashed: true, label: 'podanie pod kontrolą', labelDy: 2.2 },
            { type: 'arrow', from: [40, 27], to: [38.2, 20.5], tone: 'good' },
            { type: 'arrow', from: [46, 45], to: [45, 34.5], tone: 'info', label: 'kolega wraca' },
          ],
        },
        {
          id: 'kryj-srodek',
          label: 'Biegnę kryć napastnika w środku',
          correct: false,
          outcome: W,
          feedback:
            'Zawodnik z piłką dostał wolną drogę do bramki i strzelił z dobrej pozycji. Kryjąc tylko jednego rywala, oddajesz drugiemu całą przestrzeń.',
          clip: {
            duration: 4.2,
            tracks: {
              ty: [{ t: 1.2, x: 32.5, y: 33 }, { t: 3.0, x: 33, y: 22 }],
              b: [{ t: 3.0, x: 32, y: 22 }],
              a: [{ t: 1.2, x: 50, y: 27 }, { t: 2.6, x: 45, y: 17 }, { t: 3.0, x: 44, y: 15 }],
              gk: [{ t: 2.6, x: 37, y: 3.5 }, { t: 3.4, x: 34.5, y: 2, pose: 'down' }],
              m: [{ t: 4.2, x: 43, y: 31 }],
              c: [{ t: 4.2, x: 27, y: 38 }],
            },
            ball: [
              { t: 2.9, on: 'a' },
              { t: 3.5, x: 31.5, y: -0.6, arc: 1.2 },
            ],
            events: [
              { t: 1.6, text: 'Wolna droga do bramki' },
              { t: 3.6, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'arrow', from: [53, 33], to: [44.5, 16], tone: 'bad', label: 'wolna droga' }],
        },
        {
          id: 'spalony',
          label: 'Wychodzę do przodu, żeby złapać ich na spalonego',
          correct: false,
          outcome: W,
          feedback:
            'Samemu nie zrobisz pułapki ofsajdowej — wystarczy, że napastnik zgra moment wbiegnięcia. Za twoimi plecami zostało 30 metrów wolnego miejsca.',
          clip: {
            duration: 4.4,
            tracks: {
              ty: [{ t: 0.9, x: 40, y: 31.5 }, { t: 1.6, x: 39, y: 30 }, { t: 3.4, x: 37, y: 16 }],
              b: [{ t: 0.9, x: 31.5, y: 31.8 }, { t: 1.8, x: 35, y: 22.5 }, { t: 2.8, x: 35.5, y: 13 }],
              a: [{ t: 0.9, x: 52, y: 31 }, { t: 4.4, x: 49, y: 24 }],
              gk: [{ t: 2.2, x: 35, y: 6 }, { t: 3.0, x: 36.5, y: 5, pose: 'down' }],
              m: [{ t: 4.4, x: 44, y: 32 }],
              c: [{ t: 4.4, x: 27, y: 37 }],
            },
            ball: [
              { t: 0.85, on: 'a' },
              { t: 1.8, on: 'b' },
              { t: 2.8, on: 'b' },
              { t: 3.3, x: 32, y: -0.6, arc: 0.8 },
            ],
            events: [
              { t: 0.9, text: 'Nie ma spalonego!' },
              { t: 3.5, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [
            { type: 'line', from: [0, 31.5], to: [68, 31.5], tone: 'info', dashed: true, label: 'twoja linia' },
            { type: 'arrow', from: [52, 30], to: [35, 22.5], tone: 'bad', label: 'podanie za plecy' },
          ],
        },
      ],
      timeout: {
        outcome: W,
        feedback:
          'Stałeś w miejscu, więc rywale zdecydowali za ciebie: zawodnik z piłką podszedł bliżej i podał do wolnego partnera. W obronie brak decyzji to też decyzja.',
        clip: {
          duration: 4.0,
          tracks: {
            ty: [{ t: 1.6, x: 40.5, y: 25.5 }],
            a: [{ t: 1.5, x: 47, y: 26 }],
            b: [{ t: 1.5, x: 31.5, y: 27 }, { t: 2.3, x: 33, y: 18 }, { t: 2.9, x: 34, y: 12 }],
            gk: [{ t: 2.6, x: 35, y: 5 }, { t: 3.2, x: 36.5, y: 3.5, pose: 'down' }],
            m: [{ t: 4, x: 44, y: 34 }],
            c: [{ t: 4, x: 27, y: 37 }],
          },
          ball: [
            { t: 1.5, on: 'a' },
            { t: 2.3, on: 'b' },
            { t: 2.9, on: 'b' },
            { t: 3.3, x: 32.5, y: -0.6, arc: 0.6 },
          ],
          events: [{ t: 3.4, text: 'GOL', tone: 'bad', dur: 3 }],
        },
      },
    },

    // ───────────────────────────── Stage 2: at the edge of the box ─────────────────────────────
    {
      id: 'linia-podania',
      title: 'Wejście w pole karne',
      question: 'Zawodnik z piłką wchodzi w pole karne, środkowy czeka na podanie. Kolega wraca, ale jest jeszcze 2 sekundy za akcją. Co teraz?',
      lesson:
        'Blisko bramki: zamknij podanie do środka, a zawodnika z piłką kieruj na zewnątrz. Strzał z ostrego kąta to piłka dla bramkarza.',
      intro: {
        duration: 2.4,
        tracks: {
          a: [{ t: 2.4, x: 47, y: 16.5 }],
          b: [{ t: 2.4, x: 32, y: 16 }],
          ty: [{ t: 2.4, x: 38.5, y: 13.5 }],
          m: [{ t: 2.4, x: 44.5, y: 25 }],
          c: [{ t: 2.4, x: 28, y: 30 }],
          gk: [{ t: 2.4, x: 36, y: 3.5 }],
        },
        events: [{ t: 0.2, text: 'Kolega wraca — jeszcze 2 sekundy', tone: 'info', dur: 2.2 }],
      },
      options: [
        {
          id: 'wslizg',
          label: 'Robię wślizg na zawodnika z piłką',
          correct: false,
          outcome: 'Rzut karny dla rywala',
          feedback:
            'Wślizg w polu karnym przy przewadze rywala to podwójne ryzyko: albo napastnik minie cię zwodem, albo go sfaulujesz. Tu skończyło się rzutem karnym.',
          clip: {
            duration: 3.4,
            tracks: {
              ty: [{ t: 0.6, x: 44, y: 16 }, { t: 1.0, x: 45, y: 16.8, pose: 'down' }],
              a: [{ t: 0.85, x: 46.8, y: 15.2 }, { t: 1.1, x: 47.8, y: 13.8, pose: 'down' }],
              b: [{ t: 2.0, x: 33, y: 12 }],
              m: [{ t: 3.4, x: 42, y: 21.5 }],
              c: [{ t: 3.4, x: 29, y: 25 }],
            },
            ball: [
              { t: 1.0, on: 'a' },
              { t: 1.7, x: 44, y: 12.5 },
            ],
            events: [{ t: 1.1, text: 'Faul! Rzut karny', tone: 'bad', dur: 3 }],
          },
          highlights: [{ type: 'circle', at: [46.3, 15.3], r: 3, tone: 'bad', label: 'faul w polu karnym' }],
        },
        {
          id: 'linia-podania',
          label: 'Staję w linii podania do środka i kieruję go do linii końcowej',
          correct: true,
          outcome: 'Bramkarz broni',
          feedback:
            'Świetnie! Odciąłeś podanie do środka i zostawiłeś rywalowi tylko strzał z ostrego kąta. To sytuacja, którą bramkarz ma obronić.',
          clip: {
            duration: 4.2,
            tracks: {
              ty: [{ t: 1.2, x: 40.5, y: 10.5 }, { t: 2.2, x: 41, y: 9.8 }, { t: 4.2, x: 41, y: 10 }],
              a: [{ t: 1.2, x: 47.5, y: 11 }, { t: 2.0, x: 47, y: 8.5 }],
              b: [{ t: 1.2, x: 33, y: 11 }, { t: 2.4, x: 34, y: 9 }, { t: 4.2, x: 35.5, y: 9.5 }],
              gk: [{ t: 1.6, x: 37, y: 2.5 }, { t: 2.3, x: 37.5, y: 2.2 }, { t: 2.45, x: 38.2, y: 1.8, pose: 'down' }],
              m: [{ t: 4.2, x: 45.5, y: 17 }],
              c: [{ t: 4.2, x: 29, y: 22 }],
            },
            ball: [
              { t: 2.0, on: 'a' },
              { t: 2.4, x: 38, y: 1.4 },
              { t: 2.9, x: 38.8, y: 7.9, arc: 0.6 },
            ],
            events: [
              { t: 1.9, text: 'Strzał z ostrego kąta' },
              { t: 2.5, text: 'Obrona bramkarza!', tone: 'good', dur: 1.6 },
            ],
          },
          highlights: [
            { type: 'cross', from: 'a', to: 'b', tone: 'good', label: 'podanie do środka odcięte', labelDy: 4 },
            { type: 'arrow', from: [50.5, 17.5], to: [50, 10.5], tone: 'good', label: 'na zewnątrz', labelDx: 5, labelDy: 0 },
          ],
        },
        {
          id: 'linia-bramkowa',
          label: 'Cofam się na linię bramkową, żeby pomóc bramkarzowi',
          correct: false,
          outcome: W,
          feedback:
            'Oddałeś rywalowi całe pole karne. Strzał z 16 metrów bez żadnej presji to prezent — na linii bramkowej nic już nie zablokujesz.',
          clip: {
            duration: 3.6,
            tracks: {
              ty: [{ t: 1.6, x: 34, y: 1.2 }],
              a: [{ t: 1.2, x: 45.5, y: 15 }],
              b: [{ t: 3.6, x: 33, y: 10 }],
              gk: [{ t: 1.6, x: 35, y: 2.5 }, { t: 1.9, x: 32.8, y: 2.2, pose: 'down' }],
              m: [{ t: 3.6, x: 44, y: 19 }],
              c: [{ t: 3.6, x: 29, y: 24 }],
            },
            ball: [
              { t: 1.3, on: 'a' },
              { t: 1.9, x: 31, y: -0.6, arc: 1.4 },
            ],
            events: [
              { t: 1.3, text: 'Strzał bez presji' },
              { t: 2.1, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'arrow', from: [45.5, 14], to: [31.5, 0.5], tone: 'bad', label: 'strzał bez presji' }],
        },
        {
          id: 'do-srodkowego',
          label: 'Zostawiam zawodnika z piłką i biegnę do środkowego',
          correct: false,
          outcome: W,
          feedback:
            'Zawodnik z piłką był bliżej bramki i dostał wolną drogę. Pilnuj linii podania, a nie samego zawodnika — wtedy kontrolujesz obu rywali naraz.',
          clip: {
            duration: 3.8,
            tracks: {
              ty: [{ t: 1.0, x: 33, y: 14 }, { t: 2.0, x: 33.5, y: 12 }],
              b: [{ t: 2.0, x: 32.5, y: 12 }],
              a: [{ t: 1.0, x: 45, y: 12.5 }, { t: 2.0, x: 41, y: 8 }],
              gk: [{ t: 1.6, x: 38, y: 4.5 }, { t: 2.3, x: 38.5, y: 4, pose: 'down' }],
              m: [{ t: 3.8, x: 44, y: 18 }],
              c: [{ t: 3.8, x: 29, y: 24 }],
            },
            ball: [
              { t: 2.1, on: 'a' },
              { t: 2.5, x: 32.5, y: -0.6, arc: 0.5 },
            ],
            events: [
              { t: 1.1, text: 'Wolna droga' },
              { t: 2.7, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'arrow', from: [47, 16.5], to: [41.5, 8.5], tone: 'bad', label: 'wolna droga' }],
        },
      ],
      timeout: {
        outcome: W,
        feedback:
          'Czekałeś, a rywal nie czekał: podanie wzdłuż bramki trafiło do wolnego napastnika. W polu karnym decyzję trzeba podjąć, zanim rywal podniesie głowę.',
        clip: {
          duration: 3.2,
          tracks: {
            ty: [{ t: 1.2, x: 38.5, y: 12.5 }],
            a: [{ t: 1.0, x: 45, y: 12 }],
            b: [{ t: 1.6, x: 33.5, y: 7 }],
            gk: [{ t: 1.4, x: 37, y: 3.5 }, { t: 1.9, x: 35.5, y: 2.5, pose: 'down' }],
            m: [{ t: 3.2, x: 44, y: 19 }],
            c: [{ t: 3.2, x: 29, y: 24 }],
          },
          ball: [
            { t: 1.0, on: 'a' },
            { t: 1.6, on: 'b' },
            { t: 2.0, x: 33, y: -0.6 },
          ],
          events: [{ t: 2.1, text: 'GOL', tone: 'bad', dur: 3 }],
        },
      },
    },

    // ───────────────────────────── Stage 3: rebound after the save ─────────────────────────────
    {
      id: 'dobitka',
      title: 'Odbita piłka',
      question: 'Bramkarz odbił piłkę przed siebie. Leży tuż obok ciebie, a środkowy napastnik biegnie do dobitki. Co robisz?',
      lesson:
        'Piłka bezpańska w polu karnym: najpierw bezpieczeństwo. Wybij ją mocno do boku, z dala od środka boiska.',
      intro: {
        duration: 0.8,
        tracks: { gk: [{ t: 0.8, x: 38.2, y: 1.8, pose: 'down' }] },
        events: [{ t: 0, text: 'Piłka odbita!', tone: 'info', dur: 0.8 }],
      },
      options: [
        {
          id: 'wybij-w-bok',
          label: 'Wybijam piłkę mocno do boku, za linię boczną',
          correct: true,
          outcome: 'Zagrożenie zażegnane',
          feedback:
            'Dokładnie tak! Piłka jest daleko od bramki, a twoja drużyna ma czas, żeby się ustawić. Aut dla rywala jest dużo mniej groźny niż dobitka.',
          clip: {
            duration: 2.6,
            tracks: {
              ty: [{ t: 0.35, x: 39.4, y: 9 }],
              b: [{ t: 0.7, x: 36.2, y: 9.8 }],
              gk: [{ t: 0.7, x: 38.2, y: 1.8, pose: 'down' }, { t: 1.4, x: 37, y: 2.6 }],
              m: [{ t: 2.6, x: 44, y: 13 }],
            },
            ball: [
              { t: 0.35, x: 38.8, y: 7.9 },
              { t: 1.6, x: 70, y: 24, arc: 6 },
            ],
            events: [{ t: 1.2, text: 'Zagrożenie zażegnane', tone: 'good', dur: 2 }],
          },
          highlights: [{ type: 'arrow', from: [38.8, 7.9], to: [67, 22.5], tone: 'good', label: 'do boku, poza boisko', labelDx: 6, labelDy: -2.5 }],
        },
        {
          id: 'przyjmij',
          label: 'Przyjmuję piłkę i próbuję wyprowadzić ją dryblingiem',
          correct: false,
          outcome: 'Strata i gol',
          feedback:
            'Z rywalem na plecach, w polu karnym, przyjęcie piłki to ryzyko, które nic nie daje. Napastnik doskoczył, odebrał piłkę i strzelił do pustej bramki.',
          clip: {
            duration: 3.4,
            tracks: {
              ty: [{ t: 0.4, x: 39.4, y: 9.1 }, { t: 1.2, x: 38.4, y: 12 }, { t: 1.6, x: 37.8, y: 12.6, pose: 'down' }],
              b: [{ t: 1.2, x: 37.4, y: 11 }, { t: 2.0, x: 35, y: 7 }],
              gk: [{ t: 1.8, x: 36.5, y: 3 }, { t: 2.3, x: 35.5, y: 2.5, pose: 'down' }],
              m: [{ t: 3.4, x: 42, y: 13 }],
            },
            ball: [
              { t: 0.4, x: 38.9, y: 8.1 },
              { t: 0.5, on: 'ty' },
              { t: 1.15, on: 'ty' },
              { t: 1.3, on: 'b' },
              { t: 2.0, on: 'b' },
              { t: 2.4, x: 33, y: -0.6, arc: 0.6 },
            ],
            events: [
              { t: 1.25, text: 'Strata piłki!', tone: 'bad', dur: 1.2 },
              { t: 2.6, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'circle', at: [37.8, 11.6], r: 2.6, tone: 'bad', label: 'strata' }],
        },
        {
          id: 'do-bramkarza',
          label: 'Podaję piłkę do bramkarza',
          correct: false,
          outcome: W,
          feedback:
            'Bramkarz leży po interwencji — podanie do niego w tej chwili to podanie do rywala. Zanim zagrasz do kogoś, sprawdź, czy może przyjąć piłkę.',
          clip: {
            duration: 3.0,
            tracks: {
              ty: [{ t: 0.4, x: 39.4, y: 9 }],
              b: [{ t: 1.3, x: 36.8, y: 4.8 }, { t: 1.8, x: 36, y: 3.2 }],
              gk: [{ t: 1.6, x: 38.2, y: 1.8, pose: 'down' }, { t: 2.4, x: 37.6, y: 2.4 }],
              m: [{ t: 3, x: 42, y: 13 }],
            },
            ball: [
              { t: 0.4, x: 38.9, y: 8.1 },
              { t: 1.3, on: 'b' },
              { t: 1.8, on: 'b' },
              { t: 2.1, x: 33.5, y: -0.6 },
            ],
            events: [
              { t: 1.3, text: 'Przechwyt!', tone: 'bad', dur: 1 },
              { t: 2.3, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'arrow', from: [38.8, 7.9], to: [37.4, 5.4], tone: 'bad', label: 'bramkarz leży' }],
        },
        {
          id: 'na-srodek',
          label: 'Wybijam piłkę przed siebie, na środek',
          correct: false,
          outcome: W,
          feedback:
            'Wybicie na środek spadło prosto pod nogi wbiegającego rywala, który uderzył z pierwszej piłki. Środek przed polem karnym to strefa strzału — wybijaj do boku.',
          clip: {
            duration: 3.2,
            tracks: {
              ty: [{ t: 0.35, x: 39.4, y: 9 }, { t: 2.4, x: 37, y: 12 }],
              c: [{ t: 1.5, x: 30, y: 23.2 }],
              b: [{ t: 2.0, x: 34, y: 10 }],
              gk: [{ t: 1.8, x: 37, y: 2.6 }, { t: 2.3, x: 35, y: 2.3, pose: 'down' }],
              m: [{ t: 3.2, x: 42, y: 15 }],
            },
            ball: [
              { t: 0.35, x: 38.8, y: 7.9 },
              { t: 1.5, on: 'c', arc: 4 },
              { t: 1.7, on: 'c' },
              { t: 2.4, x: 31.5, y: -0.6, arc: 1.5 },
            ],
            events: [
              { t: 1.5, text: 'Piłka pod nogi rywala', dur: 1 },
              { t: 2.6, text: 'GOL', tone: 'bad', dur: 3 },
            ],
          },
          highlights: [{ type: 'arrow', from: [38.8, 7.9], to: [30.5, 21.5], tone: 'bad', label: 'strefa strzału' }],
        },
      ],
      timeout: {
        outcome: W,
        feedback:
          'Napastnik był szybszy do bezpańskiej piłki i dobił ją do siatki. Przy odbitej piłce liczy się pierwszy krok — kto pierwszy, ten decyduje.',
        clip: {
          duration: 2.4,
          tracks: {
            b: [{ t: 0.9, x: 38.2, y: 7.9 }],
            ty: [{ t: 0.9, x: 40.2, y: 9.2 }],
            gk: [{ t: 1.4, x: 37.5, y: 2.2, pose: 'down' }],
          },
          ball: [
            { t: 0.85, x: 38.8, y: 7.9 },
            { t: 0.95, on: 'b' },
            { t: 1.4, x: 35, y: -0.6 },
          ],
          events: [{ t: 1.5, text: 'GOL', tone: 'bad', dur: 3 }],
        },
      },
    },
  ],
}
