# Kemins grunder (i)

Interaktiv kemi med sju områden. Förklaringarna är skrivna för högstadiet och årskurs 7, med flödet **Titta → Förstå → Svara**.

**Elevsida:** https://gandalfhello145.github.io/Kemilabbet/

## Den här versionen

- Utökade förklaringar, vardagsexempel och begreppsstöd i alla sju områden.
- Detaljerade TikZ-ritningar i områdena 1–6 och en ny genererad scenariobild i Giftfri miljö. SVG-bilderna går att förstora på sidan. Redigerbara källor finns i `latex/`.
- Fem ytterligare internetbilder om giftfri miljö, med förklaringar, samtalsfrågor, upphovsperson, licens och faktakällor.
- Sju helt omarbetade originalfilmer på 3–5 minuter, renderade i 1920×1080 med 30 bilder/sekund. De innehåller 95 förklarande avsnitt, LaTeX-text, avancerad 2D/2.5D/3D-animation, svenska undertexter och originalmusik. Ljudspåret innehåller enbart musik, utan berättarröst.
- Rutherford förklaras med en solsystemsliknelse. Liknelsens begränsningar, Bohrs energinivåer och dagens elektronmoln hålls isär.

## Labb och bildförklaringar

[Öppna labben](https://gandalfhello145.github.io/Kemilabbet/?lab=alla&v=20261110-labs3#omrade-1). Områdena 1, 2, 3, 5 och 6 har labb överst i steg 2, Förstå. Förändring och Giftfri miljö har bildförklaringar utan simulering. Länken med lab=alla öppnar steg 2 direkt även när ni växlar område.

| Område | Labb | Undersök |
|---|---|---|
| 1 | Molekylverkstaden | Dra, välj och bind H/O; skilj atomer, atomslag, molekyler och ämnen åt. |
| 2 | Atomdetektiven | Börja med Thomson, fortsätt med Rutherford och jämför sedan samma strålstart; förklara orsak och slutsats utan vinkelmått. |
| 3 | Bindningslabbet | Flytta en elektron, räkna laddningar och jämför jongitter med delat elektronpar. |
| 4 | Bildförklaring | Jämför kemiska och fysikaliska förändringar utan simulering. |
| 5 | Materialdetektiven | Undersök fyra definierade prov med fyra tester och samla belägg om ett okänt prov. |
| 6 | Vattenlabbet | Värm/kyl 50 g vatten och koppla ihop fasandelar, molekylvy och temperaturkurva. |
| 7 | Scenariobild | Följ målarfärg från spill till vatten och jämför förebyggande handlingar. |

De fem aktiva labben har tydliga elevknappar, direkta handlingar och förklarande återkoppling. Atomdetektiven visar en atommodell i taget innan båda kan jämföras, med slowmotion och närbild av kraften. Grader, histogram och tekniska laddningsreglage har tagits bort. Den extra sektionen Undersök vidare tillsammans visas inte i labben. Text i gränssnitt, knappar, diagram och canvas sätts som LaTeX med lokalt MathJax och SVG. Vattenlabbet behåller sin 3D-vy och 2D-reservvy.

lab-kit.js innehåller gemensam layout, rendering och livscykel. lab-router.js laddar bara valt experiment. Varje labb har separat gränssnitt, ren modellfil och modelltester. Äldre modell- och testfiler för de två borttagna labben finns kvar som källhistorik men laddas inte på elevsidan. Rörelser stannar när området, lektionssteget eller webbläsarfliken inte visas. Era befintliga svar använder samma lagringsnyckel och schema.

Kör alla 61 modellkontroller med node --test water-model.test.mjs lab-*.test.mjs från webbplatsens projektmapp.

## Giftfri miljö

assets/environment/giftfri-miljo-scenarier.webp är webbkopian av en AI-genererad illustration med fyra vardagsscenarier. PNG-original och exakt prompt finns bredvid. environment-scenarios.js innehåller svenska förklaringar, alttext och faktakällor. Bilden är skapad med OpenAI image_gen; fakta har kontrollerats mot primärkällor. De tidigare TikZ-bilderna i område 7 visas inte. De fem internetbilderna och deras käll-/licensuppgifter är kvar.

## Vattenlabbet

[Öppna experimentet](https://gandalfhello145.github.io/Kemilabbet/?lab=vatten&v=20261109-water1#omrade-6). Det finns överst i steg 2, Förstå, i område 6 och nås också med knappen Öppna Vattenlabbet ovanför filmen.

Eleverna kan värma och kyla 50 g rent vatten, vrida och zooma en 3D-modell med 48 representativa H₂O-molekyler, följa en markerad molekyl och undersöka temperaturkurvan. Ett försök kan sparas som jämförelse och mätdata exporteras som CSV. Hastighet kan väljas till 1×, 10× eller 30×. Simuleringen stannar när den döljs eller när sidan lämnas; pausen bevarar försöket mellan lektionsstegen.

water-model.js använder en entalpimodell med konstanta, avrundade värmekapaciteter och latenta värmen. Smältning/frysning sker vid 0 °C och kokning/kondensation vid 100 °C. Massan och det yttre trycket hålls konstanta med ett schematiskt rörligt lock. Modellen inkluderar inte värmeförluster, temperaturgradienter eller avdunstning under kokpunkten. Modellkort och primärkällor finns i experimentet.

water-scene.js använder lokalt Three.js 0.184.0 (MIT; licens i vendor/three/). Grafiken visar schematiska positioner och rörelser, utan att ändra molekylernas uppbyggnad. WebGL2-vyn kompletteras av en 2D-reservvy. water-lab.js, water-lab.css och water-graph.js innehåller reglage, tillgänglighetsstöd och graf. Inga externa bibliotek hämtas när sidan körs.

Kör modellkontrollerna med node --test water-model.test.mjs från webbplatsens projektmapp.

## Filer och källor

`index.html`, `styles.css` och `script.js` innehåller webbplatsen. `study-galleries.js` och `study-assets.js` visar de nya ritningarna och miljöbilderna. Originalens bildkällor finns i `assets/environment/credits.json` och bredvid varje bild på sidan. Nya filmer, affischbilder och undertexter ligger i respektive `assets/*/v3/`.

`manim/v3/` innehåller de nuvarande filmernas kompletta originalkod, storyboard, tidrapporter och produktionsverktyg. `core.py` innehåller bildspråk, kamerastöd och LaTeX. Scenerna är uppdelade i tre källfiler. `narrate_score.py` lägger till originalmusik utan tal och bevarar videobilder och kapitel. `manim/v3/README.md` länkar till de offentliga 3Blue1Brown-videor och GitHub-exempel som inspirerat visuell förklaring och rörelse. Äldre filmversioner finns kvar på sina äldre sökvägar.

Faktakällor är bland annat American Chemical Society, Institute of Physics, Kemikalieinspektionen och Naturvårdsverket. Länkar finns i respektive område. Ritningarna hjälper eleverna att följa kemiska samband.

## Köra och bygga

För sidan behövs ingen byggprocess: kör `python3 -m http.server 8000` i projektmappen och öppna `http://localhost:8000/`.

TikZ: installera TeX Live med svenska och TikZ, installera `latex/requirements.txt` i Pythonmiljön och kör `python latex/build_diagrams.py`. Ritningarna kompileras först till PDF och konverteras med PyMuPDF till SVG med inbäddade former och teckenkonturer.

Filmer: använd Python 3.13, installera `manim/requirements.txt` och systemberoendena Cairo, Pango, FFmpeg samt TeX Live med svenska och dvisvgm. Kör sedan `python manim/v3/render_all.py`. Det renderar de sju längre filmerna, skapar undertexter, lägger till enbart musik samt bygger affischbilder och metadata. Ingen talsyntes eller installerad berättarröst behövs. De färdiga filmerna finns i `assets/films/v3/` och fungerar i vanliga webbläsare.

## Svar och publicering

Svar och framsteg sparas i elevens webbläsare. Använd sidans exportfunktion för att spara en kopia eller lämna in svar. På delade datorer kan svar finnas kvar i samma webbläsarprofil. Befintliga svarsdata använder samma lagringsnyckel och filschema som tidigare.

GitHub Pages publicerar grenen `main`, mappen `/ (root)`. `.nojekyll` gör att filerna publiceras utan Jekyll.

## LaTeX i labben

lab-tex.js använder MathJax 3.2.2 för att sätta knappar, förklaringar, valmenyer, canvasetiketter och graftext som LaTeX till SVG-path. Alla filer körs lokalt; Apache-2.0-licens och ursprungsnotis finns i vendor/mathjax. Tillgängliga originaltexter, formulärvärden och tangentbordsstyrning bevaras. Begränsade cacheminnen återanvänder redan satta texter och bara ändrad text sätts om.
