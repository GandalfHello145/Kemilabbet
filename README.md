# Kemins grunder (i)

Kemi för årskurs 7 med korta förklaringar, tydliga bilder, fyra interaktiva labb och valbart läs- och skrivstöd.

**Elevsida:** https://gandalfhello145.github.io/Kemilabbet/?v=20261111-clear8

## Ett samband i taget

Varje område börjar med ett vardagsexempel och tre eller fyra förklarade ord. Tre korta steg följs av en tydlig bild och en kort slutsats. Fler förklaringar går att öppna när de behövs. Frågor, ledtrådar, exempel och de längre texterna är också omskrivna. Meningsstarter hjälper eleven att formulera ett eget svar.

De sex nya SVG-ritningarna kan visas som en översikt eller en bilddel i taget. På liten skärm visas en bilddel från början, med stora etiketter, nästa/föregående och textbeskrivning. Förstoringen behåller vald bilddel. Giftfri miljö använder den tidigare AI-genererade bilden, men visar ett scenario i taget. Fem internetbilder med källor och licenser finns som valbar förklaring.

Sju nya Manim-filmer har fyra eller fem undervisningssteg, stora LaTeX-texter och lugna rörelser. De är cirka 88–95 sekunder, i 1920×1080/30 bilder per sekund. Ljudspåret innehåller enbart originalmusik. Filmerna har ingen berättarröst.

## Lässtöd

Verktygen högst upp kan användas av alla elever. Det krävs ingen diagnos.

- Uppläsning av synlig text, markerad text eller elevens eget svar, med styckemarkering, paus, fortsätt och stopp.
- Läsrad som följer musen eller flyttas med knappar.
- En förklaringsdel i taget, med nästa och föregående.
- Ordlista för det aktuella området.
- Val av textstorlek, typsnitt, rad-/ordavstånd, bakgrund och kontrast.
- Vanlig text som alternativ till TeX-grafik i labbens knappar och förklaringar.
- Lugnare rörelser, men undervisande rörelse och kemimodeller finns kvar.
- Meningsstarter, rättstavningsstöd och möjlighet att lyssna på det egna svaret.
- Tal till text visas när webbläsaren har stöd. Det startar bara när eleven väljer det. Text läggs till sist och ersätter inte ett markerat svar. En upplysning om webbläsarens eventuella internettjänst visas före användning.

Uppläsningens röster och diktering beror på enheten och webbläsaren. Inställningarna sparas lokalt med en separat nyckel från elevsvaren. Webbplatsen skickar inte elevsvaren till någon egen server. Använd skolans rutiner vid val av enhetens eller webbläsarens rösttjänst.

## De fyra labben är kvar

| Område | Labb | Första uppgift |
|---|---|---|
| 1 | Molekylverkstaden | Sätt ihop två H med en O. |
| 2 | Atomdetektiven | Följ en partikel och koppla banan till atommodellen. |
| 3 | Bindningslabbet | För samman två väteatomer och dela ett elektronpar. |
| 6 | Vattenlabbet | Värm och kyl steg för steg; läs temperatur och fas samtidigt. |

Fler reglage finns under Fler verktyg. Dragmoment har synliga knappalternativ. Atomdetektivens närbild och långsamma rörelse är kvar. Vattnets energimål är oförändrade. Områdena 4, 5 och 7 använder bilder och förklaringar utan labb.

## Kursplan, bedömning och källor

[PEDAGOGIK.md](PEDAGOGIK.md) beskriver genomgången av Skolverkets centrala innehåll och betygskriterier, SPSM:s råd om tillgängliga läromedel samt material från Kemilärarnas resurscentrum. Dokumentet innehåller kopplingar för alla sju områden och direkta primärkällor.

Det centrala innehållet gäller årskurs 7–9 tillsammans. Här används det för en första genomgång i årskurs 7. Materialet täcker ett arbetsområde, inte hela högstadiets kemi. Läraren bedömer elevens kunskaper utifrån genomförd undervisning; sidan tilldelar inga betyg.

## Utveckla och kontrollera

Starta en vanlig statisk webbserver i denna mapp. Ingen byggprocess eller extern CDN krävs. För att provspela avsnittshopp i Safari behöver den lokala servern stödja HTTP byte ranges.

`learning-content.js` innehåller de nya elevtexterna. `learning-tools.js` och `learning-tools.css` innehåller lässtödet. `learning-diagrams.js` använder SVG-bilder och panelgränser i `assets/diagrams-v5/index.json`. `study-galleries.js` visar miljöbilderna. `script.js` kopplar innehåll, filmer, svar och navigation.

Filmkällor, storyboards och tidrapporter finns i `manim/v5/`. Kör `python manim/v5/render_all.py` med Python 3.13, Manim enligt `manim/requirements.txt`, FFmpeg och TeX Live med svenska. Kontrollera slutfilmerna med `python manim/v5/audit.py`. SVG-bilderna återskapas med `python manim/v5/generate_diagrams.py`. Äldre versioner finns kvar som källhistorik.

De oförändrade kemimodellerna har 61 tester: `node --test water-model.test.mjs lab-*.test.mjs`. Filmkontrollen granskar verklig längd, native 1080p30, bildformat, kapitel, synkroniserad VTT, lästid och musik utan tal. Gränssnittet kontrolleras med tangentbord, förstoring, liten skärm och de verkliga stödknapparna.

## Elevsvar och publicering

Elevsvar använder samma lagringsnyckel och schema som tidigare. Frågornas ämnesinnehåll och snabbkollernas rätta index är bevarade. Svar kan sparas som fil, text eller PDF från sidan. Ingen befintlig svarsfil raderas av uppdateringen.

GitHub Pages publicerar `main` från projektets rot. `source-manifest.json` listar de publicerade filerna med byteantal och SHA-256.
