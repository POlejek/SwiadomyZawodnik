# Świadomy Zawodnik

Gra decyzyjna dla piłkarzy. Zawodnik ogląda animację sytuacji boiskowej, akcja zatrzymuje się w kluczowym momencie
i trzeba wybrać jedną z 4 odpowiedzi. Postać „TY” wykonuje dokładnie to, co wybrał gracz — zła decyzja kończy się stratą,
golem albo rzutem karnym, dobra prowadzi do kolejnego etapu akcji.

**Zagraj:** https://polejek.github.io/SwiadomyZawodnik/

## Sytuacje

| Sytuacja | Kategoria | Etapy decyzji | Dobra decyzja |
|---|---|---|---|
| Obrona 2 na 1 | Obrona | 3 | opóźniaj → zamknij podanie do środka → wybij odbitą piłkę w bok |
| Atak 2 na 1 | Atak | 2 | prowadź piłkę na obrońcę → podaj, gdy wyjdzie do ciebie |
| Wyjście spod pressingu | Budowanie gry | 2 | przyjęcie kierunkowe od napastnika → podanie do szóstki przez linię pressingu |
| Pojedynek 1 na 1 przy linii | Obrona | 2 | skróć dystans w czasie lotu piłki → wejdź ciałem między rywala a piłkę |
| Wbiegnięcie w pole karne | Wykończenie | 2 | bliższy słupek przed obrońcę → dotknięcie w dalszy róg |
| Kontrpressing po stracie | Przejście do obrony | 2 | blisko → doskok, daleko → powrót (sygnał) → atak we dwóch |
| Gra tyłem do bramki | Atak | 1 | obrońca blisko → odegraj, daleko → obróć się (sygnał) |
| Asekuracja kolegi | Obrona | 2 | skośnie za kolegą → po minięciu kolegi zamiana ról |
| Pokaż się do gry | Atak | 2 | wolna linia podania, bokiem → przyjęcie w wolne miejsce i gra do przodu |

## Kategoryzacja (na setki sytuacji)

Każda sytuacja ma: **fazę gry** (atak, obrona, przejście do obrony/ataku, stałe fragmenty), **strefę**
(tercja obronna / środek / tercja ataku), **liczebność** (np. `2v1`), **pozycje** i **poziom**. Każdy etap (decyzja)
uczy jednego **fundamentu gry**. Fundamenty są pogrupowane: atak indywidualnie i grupowo, obrona indywidualnie
i grupowo, przejścia. Lista jest w `src/taxonomy.js`.

Lista fundamentów jest robocza. Opiera się na powszechnym podziale z polskiego szkolenia dzieci i młodzieży i trzeba
ją dopasować co do słowa do „Dorastania w grze” (M. Ludwiczak, T. Tchórz), rozdział o fundamentach gry.

- **Biblioteka sytuacji** na ekranie startowym ma zakładki faz gry z licznikami, wyszukiwarkę i filtry
  (fundament, pozycja, liczebność, poziom, nierozegrane / do powtórki). Sytuacje są pogrupowane według grup fundamentów.
  Filtry zapamiętują się w przeglądarce.
- **Moje postępy** pokazują medale według fundamentów. Medal fundamentu to najsłabszy medal z jego decyzji.
- Testy pilnują, żeby każda nowa sytuacja była poprawnie skategoryzowana (`checkTaxonomy`).

Każdy etap ma 4 odpowiedzi i dla każdej osobną animację skutku. Do tego jest skutek braku decyzji, gdy skończy się czas.

## Grywalność: co sprawia, że chce się wracać

Grupa docelowa: U11–U16.

- **Każda gra jest trochę inna.** Połowa rozgrywek toczy się lustrzanie (drugą stroną boiska, łącznie z tekstami „lewą/prawą”).
  Dwa etapy mają **warianty z sygnałem**: te same 4 odpowiedzi, ale najlepsza zależy od tego, co zrobi rywal:
  - Atak 2 na 1: obrońca wychodzi do ciebie → podaj; zostaje przy koledze → prowadź i strzelaj.
  - Wyjście spod pressingu: skrzydłowy zamyka linię → graj do szóstki; zamyka środek → graj po linii.

  Zawodnik musi *patrzeć*, a nie pamiętać, czyli trenuje czytanie gry.
- **Oceny stopniowane:** najlepsza / dobra / słaba / zła decyzja. Słaba daje część punktów i zachętę „Poszukaj lepszej decyzji”
  zamiast samego „źle”.
- **„Co by było, gdyby…”:** po najlepszej decyzji można obejrzeć skutki pozostałych odpowiedzi, z licznikiem obejrzanych.
- **Grupa wiekowa** ustawia czas na decyzję: U11–U12 → 40 s, U13–U14 → 25 s, U15–U16 → 15 s (można zmienić ręcznie).
- **Dźwięk:** gwizdek na start i przy faulu, trybuny przy golu, krótki sygnał przy ocenie, wibracja przy złej decyzji (Android).
  Dźwięki są generowane w przeglądarce, bez plików. Można je wyłączyć.
- **Czytanie na głos:** przycisk 🔊 czyta pytanie i odpowiedzi (głos systemu, po polsku), co pomaga młodszym zawodnikom.

## Karta zawodnika i album (długa gra)

- **Twoja karta** w stylu kart piłkarskich ma ogólną ocenę i sześć umiejętności w skali 40–99: Czytanie gry (CZY), Atak (ATA),
  Obrona (OBR), Przejścia (PRZ), Szybkość decyzji (SZY) i Wytrwałość (WYT). Ocena ogólna to średnia ważona według pozycji.
  Poziomy karty: brązowa < 65, srebrna 65+, złota 75+, elita 85+. W tygodniu z osiągniętym celem karta ma znaczek „W formie”.
  Kartę można udostępnić jako obrazek.
- **Każda decyzja daje punkty umiejętności.** Najlepsza decyzja daje najwięcej, a starania liczą się trochę.
  Ocena rośnie po krzywej: szybko na początku, potem coraz wolniej (`src/card.js`, stała `K`).
- **Pułap umiejętności** zależy od medali za fundamenty z jej grupy: bez medali 60, ze złotem we wszystkich 99.
  Złoto wymaga najlepszej decyzji w **5 różnych dniach**, więc nie da się go wyklikać jednego wieczoru.
  Każda nowa sytuacja podnosi pułap, czyli daje nowy cel.
- **Oceny nigdy nie spadają.** Karta zapamiętuje najwyższe wartości.
- **Album:** każdy fundament ma kartę brązową, srebrną i złotą, do tego są karty specjalne (odznaki). Wszystko zdobywa się
  za decyzje, **bez losowania i bez paczek**. Puste miejsca mówią, co zrobić, żeby je wypełnić.
- Symulacja w testach pilnuje tempa: zawodnik grający codziennie bezbłędnie ma po 30 dniach ok. 68,
  a typowy (3× w tygodniu, 70% trafień) ok. 52 po miesiącu, 70 po 3 miesiącach, 84 po pół roku i 92 po roku.

## Wyzwanie dla kolegi (przez link, bez kont)

- Po rozegraniu sytuacji przycisk **„Wyzwij kolegę”** wysyła link (udostępnianie w telefonie albo schowek), np.
  `…/#wyzwanie=obrona-2v1-skrzydlo&ziarno=777&pkt=212&gw=2&czas=25&od=Kuba&nr=9`.
- **Uczciwie:** link zawiera **ziarno losowania**, więc kolega gra dokładnie tę samą wersję sytuacji (ten sam wariant
  z sygnałem, ta sama strona boiska, ta sama kolejność odpowiedzi) i z tym samym czasem na decyzję (`src/rng.js`).
- Kolega widzi na ekranie startowym baner „Kuba (nr 9) wyzywa cię!”. Po grze dostaje porównanie wyników i przycisk **„Wyślij rewanż”**.
- Karty specjalne do albumu: **Rzucona rękawica** (pierwsze wyzwanie) i **Wygrany pojedynek**.
- Dane z linku są sprawdzane: nieznana sytuacja albo niemożliwy wynik są ignorowane. Bez kont nie da się jednak
  całkiem zabezpieczyć wyniku przed ręczną zmianą linku — to zabawa między kolegami, a nie ranking.

## Motywacja i postęp (bez kont — zapis w przeglądarce)

- **Profil zawodnika:** imię (wyświetlane nad zawodnikiem zamiast „TY”), numer na koszulce, pozycja, kolor koszulki,
  grupa wiekowa. Sytuacje dla twojej pozycji są na początku listy, z etykietą „Twoja pozycja”.
- **Trening dnia:** 5 decyzji w ok. 3 minuty, każda jako osobny etap. Kolejność wyboru: najpierw powtórki, które są na dziś,
  potem nowe etapy, potem reszta losowo. **Tempo meczu:** każda najlepsza decyzja skraca czas o 3 s (minimum 8 s),
  a inna przywraca czas wyjściowy.
- **Powtórki rozłożone w czasie (system Leitnera):** zła decyzja wraca jutro, a najlepsza po 3, 7, 14 i 30 dniach.
- **Cel tygodnia zamiast serii dni:** 3 treningi dnia w tygodniu (poniedziałek–niedziela). Nic się nie traci, każdy tydzień
  zaczyna się od nowa, a cel pasuje do tygodnia młodego zawodnika (treningi klubowe, mecze, szkoła).
- **Medale za zasady** (każdy etap uczy jednej zasady): najlepsza decyzja w 1 dniu daje brąz, w 3 dniach srebro, w 5 dniach złoto.
- **Odznaki:** Pierwszy krok, Analityk, Błyskawica, Trening dnia, Pełny tydzień, 4 pełne tygodnie (nie muszą być pod rząd), Komplet, Złoty zawodnik.
- **XP i poziomy:** Debiutant → Talent → Zawodnik ligowy → Kapitan → Reprezentant.
- **Ikony przy odpowiedziach** (podanie, strzał, drybling, doskok, cofnięcie…): mniej czytania dla młodszych.
- **Zestaw od trenera:** trener wybiera sytuacje i wysyła link (np. `…/#zestaw=atak-2v1,kontrpressing&tytul=Tydzień 12`).
  Zawodnik widzi zestaw na ekranie startowym, a po rozegraniu wysyła wynik przyciskiem (udostępnianie albo schowek).
  Nie wymaga to kont ani bazy danych.

Postęp jest zapisany w pamięci przeglądarki na danym urządzeniu. Konta i synchronizacja zostaną dodane później.

## Jak gra działa

- **Obserwuj → Zdecyduj → Zobacz skutek.** Po każdej odpowiedzi: animacja skutku, wyjaśnienie trenerskie i rysunek
  na boisku (strzałki, linia podania).
- Zła odpowiedź: *Spróbuj jeszcze raz*, *Powtórka w zwolnionym tempie*, a po dwóch nietrafionych — *Pokaż dobrą decyzję*.
- **Czas na decyzję** wybiera się na ekranie startowym: 15 s, 25 s (domyślnie), 40 s albo bez limitu.
- Punkty liczą się tylko za pierwszą próbę: 100 za dobrą decyzję + do 50 za szybkość (gdy czas jest włączony). Na koniec gwiazdki,
  podsumowanie decyzji i zasady do zapamiętania. Rekord zapisuje się w przeglądarce.
- Odpowiedzi są tasowane przy każdej grze, żeby uczyć się piłki, a nie położenia przycisku. Skróty: klawisze 1–4 / A–D.

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # testy silnika, przebiegu gry, sytuacji i interfejsu
npm run build    # wersja produkcyjna w dist/
```

## Wdrożenie (GitHub Pages)

Workflow `.github/workflows/deploy.yml` przy każdym pushu i pull requeście uruchamia testy i build. Po zmianie na `main`
publikuje stronę na GitHub Pages, ale tylko wtedy, gdy testy przejdą.

Jednorazowo w repozytorium: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Struktura

```
src/
  engine/
    pitch.js          wymiary boiska (metry), kolory drużyn
    animation.js      silnik animacji: pozycje zawodników i piłki w czasie
    game.js           przebieg gry (etapy, odpowiedzi, punkty) — czysta logika
  scenarios/
    obrona2v1Skrzydlo.js   sytuacja z draftu
    index.js               lista wszystkich sytuacji
    validate.js            kontrola błędów w nowych sytuacjach (uruchamiana w testach)
  components/
    Pitch.jsx         boisko w SVG: linie, zawodnicy, piłka, rysunki trenerskie
    GameScreen.jsx    ekran gry: animacja, pytanie, odpowiedzi, wyjaśnienie, podsumowanie
    Home.jsx          ekran startowy z listą sytuacji
```

## Jak dodać sytuację

Sytuacja to sam plik z danymi — bez zmian w kodzie gry. Skopiuj `src/scenarios/obrona2v1Skrzydlo.js`, zmień treść
i dopisz ją w `src/scenarios/index.js`.

**Układ współrzędnych (metry):** widać zawsze połowę boiska z bramką u góry ekranu. `x` 0–68 w poprzek boiska (od lewej),
`y` od linii bramkowej (0, góra ekranu) do linii środkowej (52,5).
- Sytuacje w obronie i przy wyprowadzaniu piłki: u góry jest **nasza** bramka (`homeGK`), rywale grają w górę ekranu.
- Sytuacje w ataku: ustaw `facingUp: 'home'`. Wtedy u góry jest bramka **rywala** (`awayGK`), a my gramy w górę.
Pole karne: `x` 13,84–54,16, `y` 0–16,5. Bramka: `x` 30,34–37,66.

```js
{
  faza: 'obrona', strefa: 'tercja-obronna', liczebnosc: '2v1', positions: ['obronca'], level: 'Średni',
  facingUp: 'away',                        // która drużyna gra w górę ekranu: 'away' (domyślnie) albo 'home'
  entities: [{ id: 'ty', team: 'home', number: 4, x: 40, y: 30, you: true }, ...], // team: home | homeGK | away | awayGK
  ball: { on: 'a' },                       // piłka u zawodnika albo { x, y }
  stages: [{
    title, question, lesson,               // lesson = zasada pokazywana po dobrej decyzji i w podsumowaniu
    fundament: 'asekuracja',               // id z src/taxonomy.js — czego uczy ta decyzja
    intro: KLIP,                           // animacja przed pytaniem
    options: [                             // dokładnie 4, dokładnie jedna correct: true
      { id, label, correct, quality, outcome, feedback, clip: KLIP, highlights: [...] }, // quality: 0 zła (domyślnie), 1 słaba, 2 dobra
    ],
    intro: null,                           // etap może zacząć się od razu od pytania
    timeout: { outcome, feedback, clip: KLIP },   // skutek końca czasu; albo { optionId, feedback } = animacja jednej z odpowiedzi
    variants: [{ variantId, intro, options }],    // opcjonalnie: inne wersje etapu (inny sygnał → inna najlepsza odpowiedź)
  }],
}
```

**KLIP** opisuje tylko, *dokąd* kto biegnie — zawsze startuje z miejsca, w którym skończył się poprzedni,
więc etapy łączą się płynnie:

```js
{
  duration: 3.4,                                         // sekundy
  tracks: { ty: [{ t: 3.4, x: 38, y: 19.5 }],            // klucze ruchu; pose: 'down' = wślizg, parada, upadek
            gk: [{ t: 2.4, x: 38, y: 1.8, pose: 'down' }] },
  ball: [{ t: 0.8, on: 'a' },                            // piłka przy nodze zawodnika „a” do 0,8 s
         { t: 1.5, on: 'b' },                            // podanie do „b” (dociera w 1,5 s)
         { t: 2.1, x: 36, y: -0.6, arc: 1.2 }],          // strzał do bramki; arc = wysokość lotu w metrach
                                                         // ease: 'linear' = stała prędkość (pytanie w trakcie lotu piłki)
  events: [{ t: 2.2, text: 'GOL', tone: 'bad' }],        // napisy na boisku: info | good | bad
}
```

`highlights` to rysunki pokazywane po decyzji: `arrow`, `line` (`dashed`), `cross` (odcięte podanie) i `circle`;
punkty jako `[x, y]` albo id zawodnika. `npm test` od razu wskaże literówki w id, nieposortowane klucze, brak 4 odpowiedzi
czy strzał, który nie trafia do bramki.

## Pomysły na kolejne kroki

- Więcej sytuacji: 3 na 2 w ataku, obrona przy dośrodkowaniu, stałe fragmenty gry, gra bramkarza.
- Rozgałęzienia: zła (ale nie katastrofalna) decyzja prowadzi do innego, trudniejszego etapu zamiast końca akcji.
- Widok z perspektywy zawodnika (kamera za plecami „TY”), poziomy trudności z krótszym czasem.
- Konta i baza danych: postępy na wielu urządzeniach, panel trenera z wynikami całej drużyny.
- Instalacja jako aplikacja na telefon (PWA).
