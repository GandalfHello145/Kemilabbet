# Kemins grunder (i)

Interaktiv kemi med sju områden. Förklaringarna är skrivna för högstadiet och årskurs 7, med flödet **Titta → Förstå → Svara**.

**Elevsida:** https://gandalfhello145.github.io/Kemilabbet/

## Den här versionen

- Utökade förklaringar, vardagsexempel och begreppsstöd i alla sju områden.
- 21 nya detaljerade TikZ-ritningar, tre per område, utöver de sju ursprungliga ritningarna. SVG-bilderna går att förstora på sidan. Redigerbara källor finns i `latex/`.
- Fem ytterligare internetbilder om giftfri miljö, med förklaringar, samtalsfrågor, upphovsperson, licens och faktakällor.
- Sju helt omarbetade originalfilmer på 3–5 minuter, renderade i 1920×1080 med 30 bilder/sekund. De innehåller 95 förklarande avsnitt, LaTeX-text, avancerad 2D/2.5D/3D-animation, svenska undertexter och originalmusik. Ljudspåret innehåller enbart musik, utan berättarröst.
- Rutherford förklaras med en solsystemsliknelse. Liknelsens begränsningar, Bohrs energinivåer och dagens elektronmoln hålls isär.

## Filer och källor

`index.html`, `styles.css` och `script.js` innehåller webbplatsen. `study-galleries.js` och `study-assets.js` visar de nya ritningarna och miljöbilderna. Originalens bildkällor finns i `assets/environment/credits.json` och bredvid varje bild på sidan. Nya filmer, affischbilder och undertexter ligger i respektive `assets/*/v3/`.

`manim/v3/` innehåller de nuvarande filmernas kompletta originalkod, storyboard, tidrapporter och produktionsverktyg. `core.py` innehåller bildspråk, kamerastöd och LaTeX. Scenerna är uppdelade i tre källfiler. `narrate_score.py` lägger till originalmusik utan tal och bevarar videobilder och kapitel. `manim/v3/README.md` länkar till de offentliga 3Blue1Brown-videor och GitHub-exempel som inspirerat visuell förklaring och rörelse. Äldre filmversioner finns kvar på sina äldre sökvägar.

Faktakällor är bland annat American Chemical Society, Institute of Physics, Kemikalieinspektionen och Naturvårdsverket. Länkar finns i respektive område. Modellritningar är förklarande och inte skalenliga eller mätdata, om inte annat anges.

## Köra och bygga

För sidan behövs ingen byggprocess: kör `python3 -m http.server 8000` i projektmappen och öppna `http://localhost:8000/`.

TikZ: installera TeX Live med svenska och TikZ, installera `latex/requirements.txt` i Pythonmiljön och kör `python latex/build_diagrams.py`. Ritningarna kompileras först till PDF och konverteras med PyMuPDF till SVG med inbäddade former och teckenkonturer.

Filmer: använd Python 3.13, installera `manim/requirements.txt` och systemberoendena Cairo, Pango, FFmpeg samt TeX Live med svenska och dvisvgm. Kör sedan `python manim/v3/render_all.py`. Det renderar de sju längre filmerna, skapar undertexter, lägger till enbart musik samt bygger affischbilder och metadata. Ingen talsyntes eller installerad berättarröst behövs. De färdiga filmerna finns i `assets/films/v3/` och fungerar i vanliga webbläsare.

## Svar och publicering

Svar och framsteg sparas i elevens webbläsare. Använd sidans exportfunktion för att spara en kopia eller lämna in svar. På delade datorer kan svar finnas kvar i samma webbläsarprofil. Befintliga svarsdata använder samma lagringsnyckel och filschema som tidigare.

GitHub Pages publicerar grenen `main`, mappen `/ (root)`. `.nojekyll` gör att filerna publiceras utan Jekyll.
