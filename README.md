# Kemilabbet

Interaktiv kemi för årskurs 7 med sju provområden, filmer, bilder, svenska undertexter och svarsfält. Eleverna arbetar i flödet **Titta → Förstå → Svara**.

**Elevsida:** https://gandalfhello145.github.io/Kemilabbet/

## Innehåll

- Atomer och molekyler
- Modeller
- Elektroner
- Förändringar
- Ämnens egenskaper
- Faser
- Kemi och miljö

Den senaste nedladdade versionen från Work ligger här som en statisk webbplats. Alla sju filmer och övriga inbäddade tillgångar har bevarats. Filmerna ligger separat i `assets/films/` så att hela filmpaketet inte behöver laddas när sidan öppnas.

## Publicering

GitHub Pages använder grenen `main` och mappen `/ (root)`. Filen `.nojekyll` gör att filerna publiceras direkt, utan Jekyll eller byggsteg.

## Svar och delade datorer

Svar och framsteg sparas lokalt i elevens webbläsare. Ingen server samlar in svaren. Använd sidans exportfunktion för att spara eller lämna in svar. På delade datorer kan tidigare svar finnas kvar i samma webbläsarprofil.

## Redigera och köra lokalt

`index.html` innehåller sidans struktur, `styles.css` utseendet och `script.js` det fullständiga innehållet och interaktionerna. Filmer, bilder, typsnitt och undertexter finns i `assets/`. `source-manifest.json` dokumenterar ursprungsfilen och tillgångarnas kontrollsummor.

Starta en lokal webbserver i projektmappen med `python3 -m http.server 8000` och öppna `http://localhost:8000/`.
