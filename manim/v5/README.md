# Filmer med lugnare förklaringar

Version 5 är skriven för elever som behöver kortare meningar och färre saker att tolka samtidigt. Filmerna har fyra eller fem undervisningssteg. Ett nytt ord visas tillsammans med bilden som förklarar det. H och O behåller sina bokstäver och färger. Rörelserna visar vad som händer med de delar som redan syns.

All synlig filmtext skapas med LaTeX. Filmerna har inga röster. De råa MP4-filerna har inget ljudspår; webbplatsens byggsteg kan lägga till bakgrundsmusik. Slutrenderingen är 1920 × 1080, 30 bilder per sekund och kortare än två minuter.

## Underlag för undervisningen

- [Skolverkets kursplan i kemi](https://syllabuswebb.skolverket.se/compulsorycw/jsp/subject.htm?subjectCode=GRGRKEM01&tos=gr): partikelmodeller, atomer, ämnen, kemiska reaktioner, vatten och miljö kopplas till enkla observationer.
- [SPSM: språkstörning](https://www.spsm.se/funktionsnedsattningar/sprakstorning/): korta konkreta meningar, visuellt stöd, återkommande struktur och tid att bearbeta information.
- [SPSM: lärmiljö och språkutvecklande undervisning](https://www.spsm.se/studiepaket-sprakstorning/grundskola/moment-3/): bilder ska göra undervisningens innehåll tydligt.
- [Kemilärarnas resurscentrum: Modeller i kemiundervisningen, informationsbrev 1/2022](https://utbildning.su.se/download/18.3e707ac0199a328fe972039/1759928239341/KRC%20Informationsbrev%202022%20nr%2012022_IB_1.pdf): modellens syfte behöver styra vad den visar. Här visas därför få relevanta delar och ett samband åt gången.

Bildspråket är originalkod. Ingen film eller scenkod från 3Blue1Brown har kopierats. Den geometriska inspirationen finns främst i att följa samma föremål genom en förändring.

## Filer

- `core.py`: typografi, kapitel, textning, tider och läshastighet.
- `shared.py`: gemensamma atomer, vattenmolekyler, etiketter och lugna rörelser.
- `scenes_1_2.py`, `scenes_3_4.py`, `scenes_5_7.py`: undervisningsfilmerna.
- `storyboard_*.json`: steg, elevtexter och avsikter.
- `generate_diagrams.py`: sex redigerbara SVG-bilder i `assets/diagrams-v5/`.
- `assets/diagrams-v5/index.json`: titel, textalternativ och panelernas exakta utsnitt.

SVG-bildernas atomkulor har täckande bakgrund bakom bokstäver och laddningar. Därför kan en bindning eller cirkellinje inte få ett minustecken att se ut som ett plustecken.

Förhandsrendering sker i 854 × 480 vid 15 bilder per sekund. Därefter granskas ett kontaktblad och den färdiga filmen renderas i 1080p30. `qa.py <slug> <SceneClass> preview|final` kontrollerar längd, bildformat, ljudspår och läshastighet samt sparar en bild per undervisningssteg i `.build/manim-v5/<slug>/qa/`.

Uppvärmningskurvan för samma vattenmängd använder energistegen 31,5 / 334 / 418 / 2256 / 40 kJ per kilogram. Därför är kokplatån cirka 6,75 gånger bredare än smältplatån. Dessa tal finns i koden, inte som extra siffertext i elevfilmen.
