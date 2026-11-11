# Korta filmer till Kemins grunder (i)

Sju nya originalfilmer för årskurs 7. Varje film är kortare än två minuter, med en begränsad mängd begrepp och tid att läsa. Innehållet är en introduktion till relevanta delar av kemins centrala innehåll för årskurs 7–9, inte en genomgång av hela högstadiekursen.

Filmerna är nyanimerade från scenkoden i denna mapp. De tidigare filmerna har inte snabbats upp. Samma atomer, färger och markeringar följer med genom förflyttningar och ombildningar. Rörelse, närbild och spår ska förklara ett samband. All synlig text sätts med LaTeX. Ljudspåret innehåller enbart originalmusik; filmerna har ingen berättarröst.

## Innehåll och kursplan

Utgångspunkten är [Skolverkets kursplan i kemi för grundskolan](https://syllabuswebb.skolverket.se/compulsorycw/jsp/subject.htm?subjectCode=GRGRKEM01&tos=gr), kontrollerad 2026-11-11. Kursplanens centrala innehåll gäller årskurs 7–9 tillsammans. Språk, urval och progression här är anpassade för en introduktion i årskurs 7.

| Film | Undervisningens fokus | Koppling till centralt innehåll |
|---|---|---|
| 1. Atomer och molekyler | Byggstenar, vattenformeln, grundämne, förening och blandning | Materiens uppbyggnad och partikelmodeller; grundämnen och molekylföreningar |
| 2. Atommodeller | Hur observationer förändrar en förklaringsmodell | Modellernas historiska utveckling, användbarhet och föränderlighet |
| 3. Elektroner | Laddningar, neutral atom, jon och enkel bindning | Atomer, elektroner, kärnpartiklar och jonföreningar |
| 4. Förändringar | Samma molekyler vid fasbyte; atomer omgrupperas vid reaktion | Kemiska reaktioner och materiens oförstörbarhet |
| 5. Egenskaper | Rättvisa jämförelser och motiverade materialval | Identifikation av ämnen, materialutveckling och systematiska undersökningar |
| 6. Värme och faser | Molekylrörelse, fasövergångar och temperaturkurva | Partikelmodeller som förklarar materia; observationer och diagram |
| 7. Giftfri miljö | Spridningsväg, möjlig påverkan och förebyggande val | Vatten som transportör; miljögifters spridning; miljö och hälsa |

## Visuell inspiration

[The Essence of Calculus](https://www.3blue1brown.com/lessons/essence-of-calculus/) visar hur en konkret fråga kan utvecklas till en förklaring genom en sammanhängande bild. Den offentliga scenkoden för [Adding waves](https://github.com/3b1b/videos/blob/master/_2023/optics_puzzles/adding_waves.py) ger exempel på rörelser och etiketter som följer samma parameter. Här används dessa principer för egna kemiscener. Kod, filmklipp, musik och figurer från 3Blue1Brown återanvänds inte.

## Produktion och kontroll

Använd Python 3.13, Manim Community enligt `../requirements.txt`, FFmpeg och TeX Live med svenska och dvisvgm. Kör från webbplatsens projektmapp:

```sh
python manim/v4/render_all.py
python manim/v4/audit.py
```

Renderingen sker i 1920×1080 med 30 bilder per sekund. Varje scen stoppar produktionen om den överstiger två minuter. `core.py` skriver synkroniserade svenska undertexter och tidrapporter med faktisk längd och läshastighet. `music_score.py` lägger till originalmusik och kopierar videobilderna utan omkodning. `audit.py` kontrollerar slutliga videoströmmar, längd, undertexter och kapitel. Slutfiler, affischbilder och undertexter finns i `assets/*/v4/`.

De tidigare källversionerna i `manim/v3/` är historik. Elevsidan använder version 4.
