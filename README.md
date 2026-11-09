# Kemins grunder (i)

Interaktiv kemi med sju områden. Förklaringarna är skrivna för högstadiet och årskurs 7, med flödet **Titta → Förstå → Svara**.

**Elevsida:** https://gandalfhello145.github.io/Kemilabbet/

## Den här versionen

- Utökade förklaringar, vardagsexempel och begreppsstöd i alla sju områden.
- 21 nya detaljerade TikZ-ritningar, tre per område, utöver de sju ursprungliga ritningarna. SVG-bilderna går att förstora på sidan. Redigerbara källor finns i `latex/`.
- Fem ytterligare internetbilder om giftfri miljö, med förklaringar, samtalsfrågor, upphovsperson, licens och faktakällor.
- Sju nya originalfilmer skapade i Manim, med LaTeX-text, 2D-/3D-animation, svenska undertexter och nykomponerad lågmäld instrumentalmusik. Filmerna är 1280×720 och 30 bilder/sekund.
- Rutherford förklaras med en solsystemsliknelse. Liknelsens begränsningar, Bohrs energinivåer och dagens elektronmoln hålls isär.

## Filer och källor

`index.html`, `styles.css` och `script.js` innehåller webbplatsen. `study-galleries.js` och `study-assets.js` visar de nya ritningarna och miljöbilderna. Originalens bildkällor finns i `assets/environment/credits.json` och bredvid varje bild på sidan. Nya filmer, affischbilder och undertexter ligger i respektive `assets/*/v2/`.

`manim/kemilabbet_films.py` är filmkällan; all synlig filmtext renderas med `Tex` eller `MathTex`. `manim/compose_score.py` skapar den nya originalmusiken. De sju äldre filmerna finns kvar på sina ursprungliga sökvägar men används inte i den nya versionen.

Faktakällor är bland annat American Chemical Society, Institute of Physics, Kemikalieinspektionen och Naturvårdsverket. Länkar finns i respektive område. Modellritningar är förklarande och inte skalenliga eller mätdata, om inte annat anges.

## Köra och bygga

För sidan behövs ingen byggprocess: kör `python3 -m http.server 8000` i projektmappen och öppna `http://localhost:8000/`.

TikZ: installera TeX Live med svenska och TikZ, installera `latex/requirements.txt` i Pythonmiljön och kör `python latex/build_diagrams.py`. Ritningarna kompileras först till PDF och konverteras med PyMuPDF till SVG med inbäddade former och teckenkonturer.

Filmer: använd Python 3.13, installera `manim/requirements.txt` och systemberoendena Cairo, Pango, FFmpeg samt TeX Live med svenska och dvisvgm. Kör sedan `python manim/render_all.py`. Det renderar sju filmer, lägger till musiken och skapar affischbilder och metadata.

## Svar och publicering

Svar och framsteg sparas i elevens webbläsare. Använd sidans exportfunktion för att spara en kopia eller lämna in svar. På delade datorer kan svar finnas kvar i samma webbläsarprofil. Befintliga svarsdata använder samma lagringsnyckel och filschema som tidigare.

GitHub Pages publicerar grenen `main`, mappen `/ (root)`. `.nojekyll` gör att filerna publiceras utan Jekyll.
