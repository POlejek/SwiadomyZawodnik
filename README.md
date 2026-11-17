# Świadomy Zawodnik

Gra decyzyjna dla piłkarzy. Zawodnik ogląda animację sytuacji boiskowej, akcja zatrzymuje się w kluczowym momencie
i trzeba wybrać jedną z 4 odpowiedzi. Postać „TY” wykonuje dokładnie to, co wybrał gracz — zła decyzja kończy się stratą,
golem albo rzutem karnym, dobra prowadzi do kolejnego etapu akcji.

**Status: draft** — jedna sytuacja, trzy etapy decyzji.

**Zagraj:** https://polejek.github.io/SwiadomyZawodnik/

## Sytuacja w drafcie: Obrona 2 na 1

Rywal kontratakuje prawym skrzydłem, drugi napastnik wbiega środkiem, a ty jesteś ostatnim obrońcą przed bramkarzem.

| Etap | Moment | Dobra decyzja | Złe decyzje (skutek) |
|---|---|---|---|
| 1. Kontra 2 na 1 | rywale w środkowej strefie | cofam się, ustawiam między nimi, opóźniam | doskok (podanie → gol), krycie środkowego (wolna droga → gol), pułapka ofsajdowa w pojedynkę (podanie za plecy → gol) |
| 2. Wejście w pole karne | zawodnik z piłką na linii pola karnego | staję w linii podania, kieruję go do linii końcowej → strzał z ostrego kąta, bramkarz broni | wślizg (faul → rzut karny), cofnięcie na linię bramkową (strzał bez presji → gol), bieg do środkowego (wolna droga → gol) |
| 3. Odbita piłka | piłka po obronie bramkarza obok ciebie | wybijam mocno w bok, na aut | przyjęcie i drybling (strata → gol), podanie do leżącego bramkarza (przechwyt → gol), wybicie na środek (strzał z dystansu → gol) |

Do tego w każdym etapie: **10 sekund na decyzję** (można wyłączyć) — brak decyzji też ma swój skutek na boisku.

## Jak gra działa

- **Obserwuj → Zdecyduj → Zobacz skutek.** Po każdej odpowiedzi: animacja skutku, wyjaśnienie trenerskie i rysunek
  na boisku (strzałki, linia podania).
- Zła odpowiedź: *Spróbuj jeszcze raz*, *Powtórka w zwolnionym tempie*, a po dwóch nietrafionych — *Pokaż dobrą decyzję*.
- Punkty liczą się tylko za pierwszą próbę: 100 za dobrą decyzję + do 50 za szybkość. Na koniec gwiazdki,
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

**Układ współrzędnych (metry):** `x` 0–68 w poprzek boiska (od lewej), `y` od **naszej** linii bramkowej (0, góra ekranu)
do linii środkowej (52,5). Rywale atakują w górę ekranu, więc ich prawe skrzydło jest po prawej stronie.
Pole karne: `x` 13,84–54,16, `y` 0–16,5. Bramka: `x` 30,34–37,66.

```js
{
  entities: [{ id: 'ty', team: 'home', number: 4, x: 40, y: 30, you: true }, ...], // team: home | homeGK | away
  ball: { on: 'a' },                       // piłka u zawodnika albo { x, y }
  stages: [{
    title, question, lesson,               // lesson = zasada pokazywana po dobrej decyzji i w podsumowaniu
    intro: KLIP,                           // animacja przed pytaniem
    options: [                             // dokładnie 4, dokładnie jedna correct: true
      { id, label, correct, outcome, feedback, clip: KLIP, highlights: [...] },
    ],
    timeout: { outcome, feedback, clip: KLIP },   // co się dzieje, gdy skończy się czas
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
  events: [{ t: 2.2, text: 'GOL', tone: 'bad' }],        // napisy na boisku: info | good | bad
}
```

`highlights` to rysunki pokazywane po decyzji: `arrow`, `line` (`dashed`), `cross` (odcięte podanie) i `circle`;
punkty jako `[x, y]` albo id zawodnika. `npm test` od razu wskaże literówki w id, nieposortowane klucze, brak 4 odpowiedzi
czy strzał, który nie trafia do bramki.

## Pomysły na kolejne kroki

- Więcej sytuacji: wyjście spod pressingu, 3 na 2 w ataku, obrona przy dośrodkowaniu, stałe fragmenty.
- Rozgałęzienia: zła (ale nie katastrofalna) decyzja prowadzi do innego, trudniejszego etapu zamiast końca akcji.
- Widok z perspektywy zawodnika (kamera za plecami „TY”), poziomy trudności z krótszym czasem.
- Profile zawodników i postępy dla trenera; instalacja jako aplikacja na telefon (PWA).
