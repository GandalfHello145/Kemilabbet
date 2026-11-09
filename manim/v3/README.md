# Längre filmer till Kemins grunder (i)

Sju originalfilmer om kemi, avsedda för högstadiet. Varje film ska vara 180–300 sekunder, renderad i 1920×1080 med 30 bilder per sekund. All synlig text renderas med LaTeX.

## Visuell inspiration

- [3Blue1Brown The Essence of Calculus](https://www.3blue1brown.com/lessons/essence-of-calculus/): låt en konkret fråga utvecklas genom samma bild och följ delarna genom omformningar.
- [3Blue1Brown Divergence and curl](https://www.youtube.com/watch?v=rB83DpBJQsE) och [offentlig scenkod](https://github.com/3b1b/videos/blob/master/_2018/div_curl.py): visa flöden genom beständiga partiklar, spår och lokala riktningsfält.
- [Offentlig kod för Adding waves](https://github.com/3b1b/videos/blob/master/_2023/optics_puzzles/adding_waves.py): länka etiketter, parametrar och bilder så att de förändras tillsammans.

Kemiscenerna, manusen, ritningarna och musiken är nyskrivna för projektet. Inspirationskällorna används för principer om visuell förklaring, inte som återanvända scener eller medietillgångar. Filmerna körs med Manim Community 0.22.1.

## Produktion

`core.py` innehåller gemensamt bildspråk, LaTeX-mallar, kamerastöd, kapitel och undertexter. Scenerna finns i `scenes_1_2.py`, `scenes_3_4.py` och `scenes_5_7.py`. Storyboardfiler dokumenterar undervisningsstegen. Tidsrapporter visar faktisk filmlängd, animeringstid och lästid.

Färgerna och byggstenarnas identitet följer med genom övergångarna. Skolmodeller, liknelser och schematiska grafer anges som sådana. Texterna ska gå att läsa och varje större rörelse ska förklara ett samband.

## Återskapa de publicerade filmerna

Använd Python 3.13 och installera `../requirements.txt`. Kör `python manim/v3/render_all.py` från webbplatsens projektmapp. FFmpeg, TeX Live och dvisvgm behövs. Filmerna renderas i 1920×1080 med 30 bilder/sekund och sparas i `assets/films/v3/`. Ljudspåret innehåller enbart originalmusik, utan berättarröst. Ingen talsyntes eller installerad röst behövs. Undertexter och avsnittstider genereras av scenerna.

`narrate_score.py` behåller sitt tidigare filnamn men lägger nu bara till originalmusik. Videoströmmen kopieras utan omkodning. Befintliga MP4-kapitel bevaras; för nya råfilmer skapas kapitel från undertexterna. Undertextfilerna ändras inte av ljudverktyget. Ljudrapporten anger `narration: false`, `mix_version: 3` och noll talade sekunder.

För att byta ljudspår i en befintlig film utan att rendera om bilderna, kör från projektmappen:

```sh
python manim/v3/narrate_score.py assets/films/v3/01-atomer.mp4 .build/music-only/01-atomer.mp4 assets/captions/v3/01-atomer.vtt --variation 1
```

Använd en separat utfil och variation 1–7 för respektive film. Kontrollera resultatet innan den publicerade filen ersätts.
