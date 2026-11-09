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

Använd Python 3.13 och installera `../requirements.txt`. Kör `python manim/v3/render_all.py` från webbplatsens projektmapp. FFmpeg, TeX Live och dvisvgm behövs. Filmerna renderas i 1920×1080 med 30 bilder/sekund. Svenskt tal genereras lokalt med macOS-rösten Alva; det kräver macOS `say` och den installerade svenska rösten. Undertexter och avsnittstider genereras av scenerna.

`narrate_score.py` lägger talet på rätt tidspositioner, blandar in originalmusiken och skriver MP4-kapitel. Bildrutorna i huvudfilmerna kopieras utan en extra omkodning. I korta avslutningar används en koncentrerad uppmaning i berättarspåret medan bildens fullständiga sammanfattning finns kvar att läsa.
