#!/usr/bin/env python3
"""Rebuild the 21 original educational TikZ diagrams as SVG (TeX Live + dvisvgm)."""
from pathlib import Path
import concurrent.futures
import json
import re
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent
DEST = ROOT.parent / 'assets' / 'diagrams-v2'

PREAMBLE = r'''\documentclass[tikz,border=0pt,11pt]{standalone}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{lmodern,amsmath,amssymb}
\usepackage[swedish]{babel}
\usetikzlibrary{arrows.meta,calc,positioning,decorations.pathmorphing,decorations.pathreplacing,patterns,shadings}
\definecolor{navy}{HTML}{102F40}
\definecolor{teal}{HTML}{147D78}
\definecolor{lightteal}{HTML}{E6F1ED}
\definecolor{gold}{HTML}{B88B3B}
\definecolor{palegold}{HTML}{F7EEDB}
\definecolor{rust}{HTML}{B6533B}
\definecolor{palerust}{HTML}{FAEAE4}
\definecolor{paper}{HTML}{F7F5EE}
\definecolor{muted}{HTML}{5B6D72}
\definecolor{line}{HTML}{D6DED8}
\renewcommand{\familydefault}{\sfdefault}
\newcommand{\atom}[5]{\shade[ball color=#3!70] (#1,#2) circle (#5);\node[text=white,font=\bfseries\small] at (#1,#2){#4};}
\newcommand{\water}[3]{\begin{scope}[shift={(#1,#2)},scale=#3]\draw[navy!45,line width=2pt] (-.3,.22)--(0,0)--(.3,.22);\atom{0}{0}{rust}{O}{.22}\atom{-.3}{.22}{teal}{H}{.15}\atom{.3}{.22}{teal}{H}{.15}\end{scope}}
\newcommand{\panel}[4]{\filldraw[fill=white,draw=line,rounded corners=5pt] (#1,#2) rectangle ++(#3,#4);}
\newcommand{\note}[4]{\node[txt,text width=#3cm] at (#1,#2){#4};}
\tikzset{txt/.style={anchor=north west,align=left,text=navy,font=\small},
 head/.style={anchor=west,text=navy,font=\bfseries\large},
 label/.style={align=center,text=navy,font=\small},
 smalllabel/.style={align=center,text=muted,font=\footnotesize},
 arrow/.style={-{Latex[length=2.5mm,width=1.8mm]},line width=1.2pt,draw=teal},
 goldarrow/.style={-{Latex[length=2.5mm]},line width=1.2pt,draw=gold},
 rustarrow/.style={-{Latex[length=2.5mm]},line width=1.2pt,draw=rust},
 dashedarrow/.style={arrow,dashed},
 badge/.style={fill=lightteal,rounded corners=3pt,text=teal,font=\bfseries\small,inner sep=5pt}}
\begin{document}
\begin{tikzpicture}[x=1cm,y=1cm]
\path[use as bounding box] (0,0) rectangle (16,10);
\fill[paper] (0,0) rectangle (16,10);
'''

DIAGRAMS = []

def diagram(module, slug, title, subtitle, body, alt, caption, question):
    index = len([d for d in DIAGRAMS if d['module'] == module]) + 1
    name = f'{module:02d}-{index:02d}-{slug}'
    DIAGRAMS.append(dict(module=module, id=name, title=title, subtitle=subtitle,
                         body=body, alt=alt, caption=caption, question=question))

diagram(1, 'atom-molekyl-atomslag', 'En byggsten, flera byggstenar, olika sorter',
 'Räkna atomer och atomslag var för sig. Bokstaven visar vilket atomslag det är.', r'''
\panel{.5}{2}{4.7}{6.1}\panel{5.65}{2}{4.7}{6.1}\panel{10.8}{2}{4.7}{6.1}
\node[badge] at (2.85,7.55){EN ATOM};\node[badge] at (8,7.55){EN MOLEKYL};\node[badge] at (13.15,7.55){EN MOLEKYL}
\atom{2.85}{5.65}{teal}{H}{.64}
\draw[navy!50,line width=4pt] (7.48,5.65)--(8.52,5.65);
\atom{7.48}{5.65}{teal}{H}{.58}\atom{8.52}{5.65}{teal}{H}{.58}
\begin{scope}[shift={(13.15,5.45)},scale=1.8]\water{0}{0}{1.4}\end{scope}
\node[label,font=\bfseries\Large] at (2.85,4.35){H};\node[label,font=\bfseries\Large] at (8,4.35){$\mathrm{H_2}$};\node[label,font=\bfseries\Large] at (13.15,4.35){$\mathrm{H_2O}$};
\note{.9}{3.65}{3.9}{\textbf{1 atom}\par \textbf{1 atomslag}: väte\par En ensam byggsten.}
\note{6.05}{3.65}{3.9}{\textbf{2 atomer}\par \textbf{1 atomslag}: väte\par Atomerna sitter ihop.}
\note{11.2}{3.65}{3.9}{\textbf{3 atomer}\par \textbf{2 atomslag}: väte och syre\par Atomerna sitter ihop.}
\draw[arrow] (4.85,5.65)--(5.95,5.65);\draw[arrow] (10,5.65)--(11.1,5.65);
''',
 'Tre jämförelsepaneler visar en väteatom H, en vätemolekyl H₂ och en vattenmolekyl H₂O. Antalet atomer och atomslag anges under varje modell.',
 'En molekyl innehåller minst två bundna atomer. Atomslagen behöver inte vara olika.',
 'Varför har H₂ två atomer men bara ett atomslag?')

diagram(1, 'formel-siffror', 'Läs formeln som en ritning',
 'En liten nedsänkt siffra hör till bokstaven framför. En stor siffra framför gäller hela molekylen.', r'''
\panel{.5}{2}{7.1}{6.1}\panel{8.1}{2}{7.4}{6.1}
\node[label,font=\bfseries\Huge] at (4.05,6.7){$\mathrm{H_2O}$};
\draw[arrow] (3.9,6.35)--(2.2,5.7);\draw[goldarrow] (4.75,6.35)--(5.65,5.7);
\node[label,text width=2.6cm] at (2.2,5.3){\textbf{2 väteatomer}\par Den lilla tvåan hör till H.};
\node[label,text width=2.8cm] at (5.65,5.3){\textbf{1 syreatom}\par Ingen siffra betyder en.};
\water{4}{3.7}{2.5}
\node[label,font=\bfseries\Huge] at (11.8,6.7){$2\,\mathrm{H_2O}$};
\water{10.15}{4.7}{2.1}\water{13.35}{4.7}{2.1}
\draw[decorate,decoration={brace,amplitude=6pt,mirror},navy!60] (9.05,3.7)--(14.5,3.7);
\node[label,text width=6cm] at (11.8,2.9){\textbf{2 hela vattenmolekyler}\par Totalt: 4 H-atomer + 2 O-atomer = 6 atomer.};
''',
 'En formel med pilar från H₂ och O förklarar två väteatomer och en syreatom. Bredvid visas 2 H₂O som två separata vattenmolekyler.',
 'Den nedsänkta tvåan ändrar antalet H i varje molekyl. Tvåan framför ändrar antalet hela molekyler.',
 'Hur många atomer av varje slag finns i 3 H₂O?')

diagram(1, 'grundamne-forening-blandning', 'Samma atomslag, olika atomslag eller en blandning?',
 'Titta både på vilka atomer som finns och på hur de sitter ihop.', r'''
\foreach \x in {.5,5.65,10.8}{\panel{\x}{2}{4.7}{6.1}}
\node[badge] at (2.85,7.55){GRUNDÄMNE};\node[badge] at (8,7.55){KEMISK FÖRENING};\node[badge] at (13.15,7.55){BLANDNING}
\foreach \x/\y in {1.9/6.1,3.6/5.3,1.8/4.5}{\draw[navy!45,line width=2pt] (\x,\y)--++(.58,0);\atom{\x}{\y}{rust}{O}{.26}\atom{\x+.58}{\y}{rust}{O}{.26}}
\water{7.2}{6}{1.2}\water{8.65}{5.2}{1.2}\water{7.2}{4.45}{1.2}
\water{12.1}{6}{1.2}\water{13.8}{4.8}{1.2}
\draw[navy!45,line width=2pt] (13.6,6.1)--(14.15,6.1);\atom{13.6}{6.1}{rust}{O}{.25}\atom{14.15}{6.1}{rust}{O}{.25}
\draw[navy!45,line width=2pt] (11.8,4.55)--(12.35,4.55);\atom{11.8}{4.55}{rust}{O}{.25}\atom{12.35}{4.55}{rust}{O}{.25}
\note{.9}{3.95}{3.9}{\textbf{Syrgas, $\mathrm{O_2}$}\par Bara syreatomer. Atomer av samma slag kan bilda molekyler.}
\note{6.05}{3.95}{3.9}{\textbf{Rent vatten, $\mathrm{H_2O}$}\par Olika grundämnen är kemiskt bundna i samma ämne.}
\note{11.2}{3.95}{3.9}{\textbf{Vatten och syrgas}\par Flera ämnen finns tillsammans. De har inte blivit ett nytt ämne.}
''',
 'Partikelbilder jämför enbart O₂, enbart H₂O och en blandning av O₂ och H₂O. Bindningar och atomslag är tydligt färgkodade.',
 'Ett grundämne innehåller ett atomslag. En kemisk förening innehåller flera grundämnen som är kemiskt bundna.',
 'Vilken bild innehåller två ämnen, och hur kan du se det?')

diagram(2, 'modeller-utvecklas', 'Atommodellen ändras när nya spår upptäcks',
 'En modell är en förenklad förklaring. Den bedöms efter hur väl den kan förklara undersökningar.', r'''
\draw[arrow,line width=2pt] (1,3.9)--(15.1,3.9);
\foreach \x/\name/\date in {1.8/Dalton/1800-talets början,5.9/Thomson/1904,10/Rutherford/1911,14.1/Bohr/1913}{\node[label,font=\bfseries] at (\x,7.7){\name};\node[smalllabel] at (\x,7.2){\date};\fill[teal] (\x,3.9) circle(.10);}
\shade[ball color=gold!65] (1.8,5.7) circle(.64);
\shade[ball color=gold!35] (5.9,5.7) circle(.76);\foreach \a in {20,100,185,270}{\fill[teal] ($(5.9,5.7)+(\a:.43)$) circle(.11);}
\fill[rust] (10,5.7) circle(.13);\draw[teal,rotate around={25:(10,5.7)}] (10,5.7) ellipse(.9 and .4);\draw[teal,rotate around={-35:(10,5.7)}] (10,5.7) ellipse(.9 and .4);\fill[teal] (10.68,6.14) circle(.1);
\fill[rust] (14.1,5.7) circle(.13);\draw[teal] (14.1,5.7) circle(.45);\draw[teal] (14.1,5.7) circle(.85);\fill[teal] (14.55,5.7) circle(.09);\fill[teal] (13.25,5.7) circle(.09);
\note{.55}{3.2}{3.0}{\textbf{Hela kulor}\par Modellen visar inga delar inuti atomen.}
\note{4.55}{3.2}{3.0}{\textbf{Russinkaka}\par Negativa elektroner i utspridd positiv laddning.}
\note{8.65}{3.2}{3.0}{\textbf{Liten positiv kärna}\par Guldfolien gav nya ledtrådar.}
\note{12.65}{3.2}{2.85}{\textbf{Bestämda energier}\par Elektroner kan ha vissa energinivåer.}
\node[smalllabel,text width=14.2cm] at (8,1.0){I dag: elektronmoln visar var elektroner sannolikt kan finnas. Modellerna är inte i skala.};
''',
 'Tidslinje med Daltons kula, Thomsons russinkaka, Rutherfords kärnmodell och Bohrs energinivåer. Varje modell får en kort förklaring.',
 'Nya observationer kan visa att en tidigare modell inte räcker. Modellerna blir mer användbara för det som ska förklaras.',
 'Vilken ny del av atomen hjälper Thomsons modell oss att beskriva?')

diagram(2, 'rutherford-solsystem', 'Rutherfords atom: en solsystemsliknelse',
 'Liknelsen hjälper oss att se en liten mitt och ett stort område runt den. Den är inte en exakt bild av en atom.', r'''
\panel{.5}{2.4}{7.1}{5.7}\panel{8.1}{2.4}{7.4}{5.7}
\node[badge] at (4.05,7.6){SOLSYSTEM};\node[badge] at (11.8,7.6){FÖRENKLAD KÄRNMODELL}
\foreach \rx/\ry in {1/.48,1.9/.92,2.8/1.35}{\draw[gold!55] (4.05,5.2) ellipse[x radius=\rx cm,y radius=\ry cm];\draw[teal!45] (11.8,5.2) ellipse[x radius=\rx cm,y radius=\ry cm];}
\shade[ball color=gold] (4.05,5.2) circle(.38);\node[smalllabel] at (4.05,4.5){sol};
\fill[navy] (5.7,5.65) circle(.12);\fill[rust] (1.45,5.7) circle(.15);\fill[teal] (4.8,4.76) circle(.1);
\shade[ball color=rust] (11.8,5.2) circle(.22);\node[text=white,font=\bfseries] at (11.8,5.2){$+$};
\foreach \x/\y in {13.45/5.65,9.2/5.7,12.55/4.76}{\fill[teal] (\x,\y) circle(.12);\node[text=white,font=\tiny] at (\x,\y){$-$};}
\draw[goldarrow] (6.3,6.5)--(5.72,5.77);\node[smalllabel,text width=2cm] at (6.2,6.85){planeter};
\draw[arrow] (14.05,6.5)--(13.48,5.78);\node[smalllabel,text width=2.3cm] at (13.9,6.85){elektroner};
\note{.9}{3.65}{6.2}{\textbf{Gravitation} håller planeter i banor kring solen. Solen är mycket större än planeterna.}
\note{8.5}{3.65}{6.3}{\textbf{Elektrisk attraktion} verkar mellan positiv kärna och negativa elektroner. Kärnan är mycket liten.}
\node[label,text width=14.6cm,fill=palegold,rounded corners=4pt,inner sep=8pt] at (8,1.35){\textbf{Här tar liknelsen slut:} elektroner följer inte verkliga planetbanor. Dagens atommodell beskriver elektronmoln. Storlekar och avstånd här är inte i skala.};
''',
 'Två parallella paneler jämför solsystem med Rutherfords förenklade kärnmodell. Sol och positiv atomkärna är centrum, planeter och negativa elektroner finns omkring. En tydlig ruta förklarar liknelsens begränsningar.',
 'Liknelsen visar ett centrum och ett stort område omkring det. Kraften i atomen är elektrisk, och dagens modeller beskriver inga fasta planetbanor för elektroner.',
 'Nämn en sak som liknelsen hjälper dig att förstå och en sak där den inte stämmer.')

diagram(2, 'guldfolie-spridning', 'Guldfolieförsöket: vad berättar banorna?',
 'Positivt laddade alfapartiklar fungerar som små undersökande projektiler. De är inte elektroner.', r'''
\panel{.5}{2}{15}{6.1}
\fill[gold!30] (7.1,3.15) rectangle(7.55,7.25);\node[label] at (7.32,7.65){tunn guldfolie};
\foreach \y in {3.5,4.2,4.9,5.6,6.3,7}{\draw[arrow,teal!80] (1.3,\y)--(6.85,\y);\fill[teal] (1.2,\y) circle(.07);}
\foreach \y in {3.5,4.2,5.6,6.3}{\draw[arrow] (7.7,\y)--(14.5,\y);}
\draw[rustarrow,line width=1.6pt] (7.55,4.9).. controls (8.5,4.95) and (8.7,6.3)..(10.6,7.25);
\draw[rustarrow,line width=1.6pt] (7.1,7).. controls (7.7,6.8) and (7.5,5.7)..(5.45,6.1);
\node[label,text width=4cm] at (12,3){De flesta fortsätter nästan rakt fram.};
\node[label,text width=3cm,text=rust] at (12.2,7.2){Några böjs av kraftigt.};
\draw[dashed,navy!40] (7.32,4.8) circle(.52);\draw[dashed,navy!40] (7.8,4.5)--(9.2,2.15);
\fill[lightteal] (8.65,.85) rectangle(15.4,2.05);

\node[txt,text width=6.1cm] at (8.95,1.85){\textbf{Slutsats:} en liten positiv kärna. Nästan all atomens massa finns i kärnan.};
\node[txt,text width=7.1cm] at (.8,1.85){Det mesta av atomens volym är utrymme runt kärnan. Kärnan är kraftigt förstorad.};
''',
 'Parallella alfapartikelbanor träffar en tunn guldfolie. De flesta går vidare, några böjs av och en vänder tillbaka. En förstoringsruta kopplar observationen till en liten positiv kärna.',
 'Det viktiga är kombinationen: många nästan raka banor och några mycket kraftiga avböjningar.',
 'Varför var de få kraftigt avböjda partiklarna viktiga, trots att de flesta gick rakt fram?')

diagram(3, 'laddning-jon', 'En elektron kan ändra laddningen',
 'Antalet protoner bestämmer atomslaget. Elektroner påverkar laddningen och hur atomer kan reagera.', r'''
\panel{.5}{2}{6.3}{6.1}\panel{9.2}{2}{6.3}{6.1}
\node[badge] at (3.65,7.5){NEUTRAL NATRIUMATOM};\node[badge] at (12.35,7.5){POSITIV NATRIUMJON}
\foreach \cx in {3.65,12.35}{\foreach \r in {.7,1.15}{\draw[teal!50] (\cx,5.3) circle(\r);} \fill[rust!20] (\cx,5.3) circle(.42);\node[label,font=\bfseries] at (\cx,5.3){11 $+$};}
\foreach \a in {0,180}{\fill[teal] ($(3.65,5.3)+(\a:.7)$) circle(.08);\fill[teal] ($(12.35,5.3)+(\a:.7)$) circle(.08);}
\foreach \a in {0,45,...,315}{\fill[teal] ($(3.65,5.3)+(\a:1.15)$) circle(.08);\fill[teal] ($(12.35,5.3)+(\a:1.15)$) circle(.08);}
\draw[teal!40] (3.65,5.3) circle(1.65);\fill[gold] (5.3,5.3) circle(.11);
\draw[goldarrow,line width=2pt] (5.6,5.3)--(10.2,5.3);\node[badge,fill=palegold,text=gold] at (7.9,5.9){1 elektron lämnar};
\note{1.05}{3.25}{5.25}{11 protoner och 11 elektroner\par $11(+1)+11(-1)=0$\par Laddningarna tar ut varandra.}
\note{9.75}{3.25}{5.25}{11 protoner och 10 elektroner\par $11(+1)+10(-1)=+1$\par Jonen skrivs $\mathrm{Na^+}$.}
\node[smalllabel,text width=14cm] at (8,1.3){Skalbilden är en förenklad modell. Protonerna finns kvar: atomslaget är fortfarande natrium.};
''',
 'En neutral natriumatom med elva protoner och elva elektroner lämnar en elektron och blir natriumjon Na⁺ med tio elektroner. Protonerna är oförändrade.',
 'En positiv jon har färre elektroner än protoner. Jon betyder en partikel som har elektrisk laddning.',
 'Varför blir laddningen positiv när en negativ elektron lämnar atomen?')

diagram(3, 'jonbindning', 'Elektronöverföring och elektrisk attraktion',
 'Natrium och klor kan bilda joner. Motsatta laddningar dras till varandra.', r'''
\panel{.5}{2}{4.6}{6.1}\panel{5.7}{2}{4.6}{6.1}\panel{10.9}{2}{4.6}{6.1}
\node[badge] at (2.8,7.5){1. FÖRE};\node[badge] at (8,7.5){2. ELEKTRON FLYTTAS};\node[badge] at (13.2,7.5){3. JONER ATTRAHERAR}
\atom{1.8}{5.5}{gold}{Na}{.45}\atom{3.8}{5.5}{teal}{Cl}{.55}
\node[smalllabel,text width=1.8cm] at (1.8,4.6){1 elektron\\ytterst};\node[smalllabel,text width=1.8cm] at (3.8,4.6){7 elektroner\\ytterst};
\atom{6.95}{5.5}{gold}{Na}{.45}\atom{9.1}{5.5}{teal}{Cl}{.55}
\fill[navy] (7.5,5.5) circle(.07);\draw[arrow] (7.65,5.7).. controls(8,6.7) and (8.8,6.7)..(9.25,6.1);
\node[label,font=\footnotesize] at (8,4.5){$\mathrm{Na\longrightarrow Na^++e^-}$\\[3pt] $\mathrm{Cl+e^-\longrightarrow Cl^-}$};
\atom{12.25}{5.5}{gold}{$+$}{.45}\atom{14.1}{5.5}{teal}{$-$}{.58}
\draw[arrow] (12.85,5.5)--(13.35,5.5);\draw[arrow] (13.5,5.5)--(13.05,5.5);
\node[label] at (13.2,4.45){$\mathrm{Na^+\qquad Cl^-}$};
\note{.9}{3.7}{3.8}{Två neutrala atomer. Vi följer bara ytterelektronerna.}
\note{6.1}{3.7}{3.8}{Kloratomen tar upp elektronen. Båda partiklarna blir joner.}
\note{11.3}{3.7}{3.8}{I fast salt finns många joner i ett gitter, inte enskilda NaCl-molekyler.}
''',
 'Tre steg visar neutral natrium- och kloratom, överföring av en elektron och attraktion mellan Na⁺ och Cl⁻. Notisen förklarar att fast salt bildar ett jongitter.',
 'Elektronöverföringen bildar jonerna. Den elektriska attraktionen mellan jonerna håller samman saltet.',
 'Vilken atom lämnar en elektron och vilken tar upp den?')

diagram(3, 'reaktion-atomer-bevaras', 'En reaktion ordnar om atomerna',
 'Bindningar kan brytas och nya bindningar bildas. Följ varje atom genom reaktionen.', r'''
\panel{.5}{2}{6.1}{6.1}\panel{9.4}{2}{6.1}{6.1}
\node[badge] at (3.55,7.5){FÖRE REAKTIONEN};\node[badge] at (12.45,7.5){EFTER REAKTIONEN}
\foreach \y in {5,6.15}{\draw[navy!50,line width=3pt] (1.65,\y)--(2.35,\y);\atom{1.65}{\y}{teal}{H}{.3}\atom{2.35}{\y}{teal}{H}{.3}}
\draw[navy!50,line width=4pt] (4.5,5.6)--(5.3,5.6);\atom{4.5}{5.6}{rust}{O}{.39}\atom{5.3}{5.6}{rust}{O}{.39}
\water{11}{5.6}{2}\water{13.8}{5.6}{2}
\draw[arrow,line width=2pt] (6.95,5.65)--(9.05,5.65);
\node[label,font=\bfseries\large] at (8,4.4){$2\mathrm{H_2}+\mathrm{O_2}$\par $\longrightarrow 2\mathrm{H_2O}$};
\note{1.05}{3.7}{5.0}{\textbf{Räkna före}\par 4 H-atomer och 2 O-atomer\par Två ämnen: väte och syre.}
\note{9.95}{3.7}{5.0}{\textbf{Räkna efter}\par 4 H-atomer och 2 O-atomer\par Ett nytt ämne: vatten.}
\node[label,fill=palegold,rounded corners=4pt,inner sep=7pt,text width=13.7cm] at (8,1.2){Atomerna försvinner inte och byter inte atomslag i en vanlig kemisk reaktion. Använd inte detta som ett försöksrecept: blandningen kan reagera explosivt.};
''',
 'Två H₂-molekyler och en O₂-molekyl ombildas till två H₂O-molekyler. Före- och efterräkningen visar fyra väteatomer och två syreatomer.',
 'Det bildas ett nytt ämne, men samma antal atomer av varje slag finns före och efter.',
 'Varför räcker det inte med en H₂-molekyl för att bilda två vattenmolekyler?')

diagram(4, 'fysikalisk-kemisk', 'Byter partiklarna plats eller bildas nya ämnen?',
 'Jämför vad som händer på partikelnivå. Det avgör mer än om förändringen är lätt att se.', r'''
\panel{.5}{2}{7.2}{6.1}\panel{8.3}{2}{7.2}{6.1}
\node[badge] at (4.1,7.5){FYSIKALISK FÖRÄNDRING};\node[badge,fill=palerust,text=rust] at (11.9,7.5){KEMISK FÖRÄNDRING}
\foreach \x/\y in {1.7/5.3,2.5/5.3,1.7/6.1,2.5/6.1}{\water{\x}{\y}{.85}}
\foreach \x/\y in {5.2/5,6.4/5.4,5.45/6.3,6.6/6.2}{\water{\x}{\y}{.85}}
\draw[arrow] (3.15,5.65)--(4.65,5.65);\node[smalllabel] at (3.9,6.2){smälter};
\atom{9.35}{5.65}{navy}{C}{.34}\draw[navy!45,line width=2pt] (10.25,5.25)--(10.25,6.05);\atom{10.25}{5.25}{rust}{O}{.3}\atom{10.25}{6.05}{rust}{O}{.3}
\draw[rustarrow] (11.1,5.65)--(12.4,5.65);
\draw[navy!45,line width=3pt] (13.05,5.65)--(14.45,5.65);\atom{13.05}{5.65}{rust}{O}{.3}\atom{13.75}{5.65}{navy}{C}{.34}\atom{14.45}{5.65}{rust}{O}{.3}
\note{.95}{4.25}{6.3}{\textbf{Is blir flytande vatten}\par Vattenmolekylerna finns kvar. De rör sig och är ordnade på ett annat sätt. Inget nytt ämne bildas.}
\note{8.75}{4.25}{6.3}{\textbf{Kol reagerar med syrgas}\par Koldioxid bildas: $\mathrm{C+O_2\rightarrow CO_2}$. Samma atomer finns kvar, men de sitter ihop på ett nytt sätt.}
''',
 'Vänster panel visar oförändrade vattenmolekyler som ordnas om när is smälter. Höger panel visar en kolatom och en syremolekyl som bildar en koldioxidmolekyl med samma antal atomer.',
 'En fysikalisk förändring ger inget nytt ämne. Vid en kemisk förändring bildas minst ett nytt ämne.',
 'Vilken skillnad syns i partikelbilderna, även om du inte känner igen exemplen?')

diagram(4, 'undersok-tecken', 'Spår av en reaktion behöver undersökas',
 'Färg, gas och temperatur kan ge ledtrådar. En enda ledtråd bevisar inte alltid att ett nytt ämne har bildats.', r'''
\foreach \x in {.5,5.65,10.8}{\panel{\x}{2.25}{4.7}{5.85}}
\node[badge] at (2.85,7.5){BUBBLOR};\node[badge] at (8,7.5){FÄRG};\node[badge] at (13.15,7.5){TEMPERATUR}
\draw[navy,line width=1.5pt] (1.7,6.6)--(1.9,4.8)--(3.8,4.8)--(4,6.6);
\fill[teal!15] (1.86,5.35)--(3.85,5.35)--(3.8,4.85)--(1.92,4.85)--cycle;
\foreach \x/\y/\r in {2.3/5.7/.12,3.1/6/.17,2.6/6.4/.11,3.4/5.55/.09}{\draw[teal] (\x,\y) circle(\r);}
\fill[teal!30] (6.4,5) rectangle(7.4,6.4);\fill[rust!35] (8.6,5) rectangle(9.6,6.4);\draw[arrow] (7.65,5.7)--(8.35,5.7);
\draw[navy,line width=2pt,rounded corners=3pt] (12.7,5.2)--(12.7,6.75) arc(180:0:.17)--(13.04,5.2);\fill[rust] (12.87,5) circle(.35);\draw[rust,line width=3pt] (12.87,5.2)--(12.87,6.3);\foreach \y in {5.5,5.9,6.3,6.7}{\draw[navy!55] (13.2,\y)--(13.45,\y);}
\note{.95}{4.15}{3.8}{\textbf{Fråga:} bildas en ny gas?\par Kokande vatten ger också bubblor, men då är gasen vattenånga.}
\note{6.1}{4.15}{3.8}{\textbf{Fråga:} bildas ett nytt ämne?\par En färg kan också se annorlunda ut när något blandas eller späds.}
\note{11.25}{4.15}{3.8}{\textbf{Fråga:} varifrån kommer energin?\par Även en fasförändring kan ta upp eller avge energi.}
\node[label,text width=14cm] at (8,1.35){\textbf{Bra slutsats:} beskriv observationen först. Förklara sedan vad du tror händer med ämnena och vilka fler undersökningar som behövs.};
''',
 'Tre tydliga observationspaneler visar bubblor, färgförändring och termometer. Varje panel ger en kontrollfråga och ett motexempel.',
 'En naturvetenskaplig förklaring skiljer på vad du såg och hur du tolkar det.',
 'Varför är bubblor inte ensamt ett säkert bevis för en kemisk reaktion?')

diagram(4, 'slutet-system-massa', 'Massan finns kvar i ett slutet system',
 'Följ hela systemet: behållare, ämnen och eventuell gas. Då blir jämförelsen rättvis.', r'''
\panel{.5}{2}{6.3}{6.1}\panel{9.2}{2}{6.3}{6.1}
\node[badge] at (3.65,7.5){FÖRE};\node[badge] at (12.35,7.5){EFTER}
\foreach \cx in {3.65,12.35}{\draw[navy,line width=1.5pt,rounded corners=4pt] (\cx-.9,4.1) rectangle(\cx+.9,6.65);\fill[gold!55] (\cx-.94,6.65) rectangle(\cx+.94,6.85);\fill[teal!15] (\cx-.86,4.15) rectangle(\cx+.86,5);\fill[navy] (\cx-1.4,3.35) rectangle(\cx+1.4,3.85);\node[text=white,font=\bfseries] at (\cx,3.6){250,0 g};}
\foreach \x/\y in {3.2/4.5,3.65/4.5,4.1/4.5,3.2/4.8,3.65/4.8,4.1/4.8}{\fill[rust] (\x,\y) circle(.09);}
\foreach \x/\y in {11.9/4.6,12.35/5.4,12.8/6,11.85/6.2,12.7/4.7,12.8/5.6}{\fill[rust] (\x,\y) circle(.09);}
\draw[arrow,line width=2pt] (7.1,5.4)--(8.9,5.4);\node[smalllabel,text width=2cm] at (8,6.2){reaktion i stängd behållare};
\note{1}{3.1}{5.3}{Alla ämnen och behållaren vägs tillsammans. Locket är stängt.}
\note{9.7}{3.1}{5.3}{Även gasen är kvar i behållaren. Den totala massan är densamma.}
\node[label,text width=14cm] at (8,1.25){I ett öppet kärl kan gas lämna systemet. Då kan den uppmätta massan minska utan att några atomer har försvunnit.};
''',
 'Två slutna behållare på vågar visar samma totalmassa 250,0 g före och efter en reaktion. Partiklar sprids i gasutrymmet men stannar innanför locket.',
 'Väg samma system före och efter. Gas väger också och måste räknas med.',
 'Vad kan hända med vågens visning om locket öppnas och gas lämnar behållaren?')

diagram(5, 'egenskaper-material', 'Välj material efter egenskaper',
 'Samma egenskap kan vara en fördel i en situation och en nackdel i en annan.', r'''
\foreach \x in {.5,5.65,10.8}{\panel{\x}{2}{4.7}{6.1}}
\node[badge,align=center,text width=3.7cm,font=\bfseries\footnotesize] at (2.85,7.5){ELEKTRISK\\ LEDNINGSFÖRMÅGA};\node[badge] at (8,7.5){LÖSLIGHET};\node[badge,align=center,text width=3.7cm,font=\bfseries\footnotesize] at (13.15,7.5){VÄRME-\\ LEDNINGSFÖRMÅGA}
\draw[teal,line width=5pt] (1.4,5.7)--(4.25,5.7);\draw[rust,line width=10pt] (1.4,5.7)--(2.05,5.7);\draw[rust,line width=10pt] (3.6,5.7)--(4.25,5.7);\foreach \x in {2.2,2.7,3.2}{\draw[goldarrow] (\x,5.7)--++(.3,0);}
\node[smalllabel,text width=3.5cm] at (2.85,6.5){metalltråd + plastisolering};
\draw[navy,line width=1.3pt] (6.6,6.5)--(6.85,4.8)--(9.15,4.8)--(9.4,6.5);\fill[teal!12] (6.76,5.8)--(9.24,5.8)--(9.1,4.85)--(6.9,4.85)--cycle;\foreach \x/\y in {7.2/5.2,7.6/5.6,8.2/5.3,8.8/5.5}{\fill[gold] (\x,\y) circle(.08);}
\draw[navy,line width=4pt] (11.7,5.4)--(14.6,5.4);\draw[goldarrow] (11.9,5.8)--(14.3,5.8);\node[smalllabel] at (13.15,6.5){metallsked i varm soppa};
\note{.95}{4.25}{3.8}{Metallen leder ström. Plasten leder mycket sämre och skyddar runt ledaren.}
\note{6.1}{4.25}{3.8}{Salt kan lösa sig i vatten. Saltets partiklar sprids i vattnet; de försvinner inte.}
\note{11.25}{4.25}{3.8}{Metall leder värme bra. Ett handtag av trä eller plast kan bli varmt långsammare.}
''',
 'Tre materialval kopplas till elektrisk ledningsförmåga, löslighet och värmeledningsförmåga: kabel, saltlösning och sked.',
 'Ämnens och materials egenskaper hjälper oss att välja hur de kan användas.',
 'Vilken egenskap vill du ha i en kastrull och vilken vill du ha i handtaget?')

diagram(5, 'densitet', 'Densitet jämför massa med volym',
 'Densitet handlar om hur stor massa som finns i en viss volym. En stor sak har inte automatiskt hög densitet.', r'''
\panel{.5}{2}{7.1}{6.1}\panel{8.1}{2}{7.4}{6.1}
\node[badge] at (4.05,7.5){SAMMA VOLYM};\node[badge] at (11.8,7.5){RÄKNA OCH JÄMFÖR}
\foreach \x/\c/\m in {1.2/teal/100,4.6/gold/270}{\filldraw[draw=navy,fill=\c!20] (\x,4.7) rectangle++(1.8,1.8);\draw[navy] (\x,6.5)--++(.35,.35)--++(1.8,0)--++(0,-1.8)--++(-.35,-.35);\draw[navy] (\x+1.8,6.5)--++(.35,.35);\node[label,font=\bfseries] at (\x+.9,5.6){\m\ g};\node[smalllabel] at (\x+.9,4.25){$100\ \mathrm{cm^3}$};}
\node[label,font=\bfseries\Large] at (11.8,6.45){$\rho=\dfrac{m}{V}$};
\node[label,font=\large,text=teal] at (11.8,5.1){$\dfrac{100\ \mathrm{g}}{100\ \mathrm{cm^3}}=1,0\ \mathrm{g/cm^3}$};
\node[label,font=\large,text=gold] at (11.8,3.85){$\dfrac{270\ \mathrm{g}}{100\ \mathrm{cm^3}}=2,7\ \mathrm{g/cm^3}$};
\note{1}{3.55}{6.15}{Kubmodellerna har lika stor volym. Den högra har större massa och därför högre densitet. Exempelvärden.}
\node[label,text width=14cm] at (8,1.25){För att resonera om flyta och sjunka måste du jämföra föremålets \emph{medeldensitet} med vätskans. Form och luftfyllda hålrum kan påverka medeldensiteten.};
''',
 'Två kuber med samma volym 100 kubikcentimeter har massorna 100 g och 270 g. En separat beräkningspanel visar densiteterna 1,0 och 2,7 g/cm³.',
 'För samma volym innebär större massa högre densitet. Symbolen ρ uttalas rho.',
 'Om båda kuberna får dubbelt så stor volym av samma material, ändras deras densitet?')

diagram(5, 'separera-blandningar', 'Skilj en blandning med rätt egenskap',
 'Ett separationssätt fungerar när ämnena skiljer sig på en användbar egenskap.', r'''
\foreach \x in {.5,5.65,10.8}{\panel{\x}{2}{4.7}{6.1}}
\node[badge] at (2.85,7.5){FILTRERING};\node[badge] at (8,7.5){INDUNSTNING};\node[badge] at (13.15,7.5){MAGNETISM}
\draw[navy,line width=1.4pt] (1.5,6.5)--(4.2,6.5)--(3,5.1)--(3,4.7);\draw[teal,line width=1pt] (1.7,6.3)--(4,6.3);\foreach \x in {2.1,2.5,2.9,3.3}{\fill[gold] (\x,6.37) circle(.08);}\draw[arrow] (3,4.9)--(3,4.35);
\draw[navy,line width=1.5pt] (6.7,5.8)..controls(6.8,4.7)and(9.2,4.7)..(9.3,5.8);\fill[teal!15] (6.9,5.5)..controls(7.2,5)and(8.8,5)..(9.1,5.5)--cycle;\foreach \x in {7.2,8,8.8}{\draw[arrow,decorate,decoration={snake,amplitude=1pt,segment length=6pt}] (\x,5.9)--(\x,6.7);\fill[gold] (\x,5.05) circle(.07);}
\draw[rust,line width=8pt] (12.1,6.1)--(12.1,5.5) arc(180:360:.65)--(13.4,6.1);\draw[navy,line width=8pt] (12.1,6.1)--(12.1,6.5);\draw[gold,line width=8pt] (13.4,6.1)--(13.4,6.5);\foreach \x/\y in {12.1/6.85,12.6/6.7,13.2/6.8}{\draw[arrow,navy!60] (\x,\y+.3)--(\x,\y);}
\note{.95}{4.1}{3.8}{\textbf{Partikelstorlek}\par Fasta korn fastnar. Löst salt passerar ett vanligt filter med vattnet.}
\note{6.1}{4.1}{3.8}{\textbf{Flyktighet}\par Vattnet lämnar som vattenånga. Ett löst, icke-flyktigt salt kan bli kvar.}
\note{11.25}{4.1}{3.8}{\textbf{Magnetiska egenskaper}\par Järn fastnar på en magnet. Alla metaller är inte magnetiska.}
''',
 'Tre detaljerade principbilder visar filter med kvarhållna korn, avdunstning med kvarvarande salt och magnet som skiljer ut järn.',
 'Partikelstorlek, flyktighet och magnetiska egenskaper ger olika sätt att separera.',
 'Varför fungerar inte ett vanligt kaffefilter för att ta bort löst salt ur vatten?')

diagram(6, 'partiklar-faser', 'Samma molekyler i tre faser',
 'Det är avstånd, rörelse och ordning som förändras. Vattenmolekylerna blir inte större när vattnet värms.', r'''
\foreach \x in {.5,5.65,10.8}{\panel{\x}{2.2}{4.7}{5.9}}
\node[badge] at (2.85,7.5){FAST FORM};\node[badge] at (8,7.5){FLYTANDE FORM};\node[badge] at (13.15,7.5){GASFORM}
\foreach \x in {1.8,2.75,3.7}{\foreach \y in {5.1,6.3}{\water{\x}{\y}{.75}\draw[teal!45,<->] (\x-.18,\y-.25)--(\x+.18,\y-.25);}}
\foreach \x/\y in {6.9/5.1,7.75/5.3,8.65/5.05,7.1/5.9,8/6.1,8.9/5.9}{\water{\x}{\y}{.75}\draw[arrow,thin] (\x+.15,\y-.25)--++(.35,.1);}
\foreach \x/\y/\a in {11.5/4.9/20,13/5.2/110,14.6/4.85/160,11.7/6.7/315,13.3/6.45/235,14.55/6.65/275}{\water{\x}{\y}{.75}\draw[arrow] (\x+.1,\y-.25)--++(\a:.45);}
\note{.95}{4.05}{3.8}{Partiklarna har bestämda lägen och vibrerar. Fast ämne har bestämd form.}
\note{6.1}{4.05}{3.8}{Partiklarna är nära men kan röra sig förbi varandra. Vätskan följer kärlets form.}
\note{11.25}{4.05}{3.8}{Partiklarna rör sig fritt mellan kollisioner. Gasen sprider sig i hela kärlet.}
\node[smalllabel,text width=14cm] at (8,1.35){Principskiss: avstånd och rörelser är förenklade. För vatten är isens struktur öppnare än vätskans, vilket bidrar till att is flyter.};
''',
 'Tre lika stora paneler visar vattenmolekyler i ett ordnat fast mönster, oordnade nära varandra i vätska och glest med rörelsepilar i gas.',
 'En fasförändring ändrar hur molekylerna är ordnade och rör sig, men inte vilket ämne de är.',
 'Vad skiljer partiklarnas rörelse i fast form från rörelsen i flytande form?')

diagram(6, 'varmekurva', 'Värme kan ändra temperatur eller fas',
 'Kurvan visar en förenklad uppvärmning av rent vatten vid normalt lufttryck.', r'''
\panel{.5}{2}{15}{6.1}
\draw[arrow,navy] (1.7,2.9)--(14.7,2.9);\draw[arrow,navy] (1.7,2.9)--(1.7,7.6);
\node[smalllabel,rotate=90] at (.95,5.4){temperatur ($^\circ$C)};\node[smalllabel] at (12,2.55){tillförd energi $\longrightarrow$};
\draw[dashed,line] (1.7,4)--(14.3,4);\draw[dashed,line] (1.7,6.4)--(14.3,6.4);
\node[smalllabel,anchor=east] at (1.55,4){0};\node[smalllabel,anchor=east] at (1.55,6.4){100};
\draw[teal,line width=2.5pt] (2,3.3)--(3.1,4)--(5.4,4)--(8.7,6.4)--(12.2,6.4)--(14.1,7.3);
\foreach \x/\y/\n in {2.55/3.65/1,4.25/4/2,7/5.17/3,10.45/6.4/4,13.2/6.87/5}{\fill[teal] (\x,\y) circle(.12);\node[badge,inner sep=3pt] at (\x,\y+.5){\n};}
\node[smalllabel,text width=2cm] at (3,5.65){\textbf{1} Isen blir varmare.};
\node[smalllabel,text width=2.4cm] at (5.1,3.25){\textbf{2} Smältning: is och vatten.};
\node[smalllabel,text width=2.9cm] at (7.6,7.1){\textbf{3} Flytande vatten blir varmare.};
\node[smalllabel,text width=3.1cm] at (10.5,5.3){\textbf{4} Kokning: vatten och vattenånga.};
\node[smalllabel,text width=2.3cm] at (13.5,4.25){\textbf{5} Vattenångan blir varmare.};
\node[label,fill=palegold,rounded corners=4pt,inner sep=7pt,text width=14cm] at (8,1.15){På platåerna går energin till fasförändringen, inte till högre temperatur. Tider och kurvans lutningar är schematiska.};
''',
 'Temperaturkurva med lutande delar och platåer vid noll och hundra grader. Fem numrerade steg visar uppvärmning av is, smältning, uppvärmning av vatten, kokning och uppvärmning av ånga.',
 'Tillförd energi behöver inte alltid höja temperaturen. Under en fasövergång av ett rent ämne kan temperaturen vara konstant.',
 'Varför kan vi fortsätta värma medan termometern visar samma temperatur vid smältningen?')

diagram(6, 'fasovergangar', 'Sex namn för vägar mellan faserna',
 'Pilarna visar riktning. Följ både vad som ändras och om ämnet tar upp eller avger energi.', r'''
\node[fill=lightteal,draw=teal,rounded corners=5pt,minimum width=3.2cm,minimum height=1.3cm,font=\bfseries\large,text=navy] (solid) at (2.6,5.8){FAST};
\node[fill=palegold,draw=gold,rounded corners=5pt,minimum width=3.2cm,minimum height=1.3cm,font=\bfseries\large,text=navy] (liquid) at (8,5.8){FLYTANDE};
\node[fill=palerust,draw=rust,rounded corners=5pt,minimum width=3.2cm,minimum height=1.3cm,font=\bfseries\large,text=navy] (gas) at (13.4,5.8){GAS}
;
\draw[rustarrow] (4.3,6.15)--(6.3,6.15) node[midway,above,smalllabel]{smältning};
\draw[arrow] (6.3,5.45)--(4.3,5.45) node[midway,below,smalllabel]{stelning};
\draw[rustarrow] (9.7,6.15)--(11.7,6.15) node[midway,above,smalllabel]{förångning};
\draw[arrow] (11.7,5.45)--(9.7,5.45) node[midway,below,smalllabel]{kondensation};
\draw[rustarrow] (2.6,6.55)..controls(3.5,8.2)and(12.5,8.2)..(13.4,6.55) node[midway,above,smalllabel]{sublimering: fast direkt till gas};
\draw[arrow] (13.4,5.05)..controls(12,3)and(4,3)..(2.6,5.05) node[midway,below,smalllabel]{deposition: gas direkt till fast};
\node[label,text width=6.7cm,fill=palerust,rounded corners=4pt,inner sep=8pt] at (4.2,2.55){\textcolor{rust}{\textbf{Röda pilar}}: ämnet tar upp energi.};
\node[label,text width=6.7cm,fill=lightteal,rounded corners=4pt,inner sep=8pt] at (11.8,2.55){\textcolor{teal}{\textbf{Gröna pilar}}: ämnet avger energi.};
\node[smalllabel,text width=14cm] at (8,1.2){Förångning omfattar både avdunstning från ytan och kokning i hela vätskan. Kondensation ger till exempel vattendroppar på ett kallt glas.};
''',
 'Tre fasrutor med dubbelriktade pilar för smältning, stelning, förångning, kondensation, sublimering och deposition. Färgkodning anger energi in eller ut.',
 'Vardagssituationer blir lättare att beskriva när riktningen och namnet hör ihop.',
 'Vilken pil passar när vattenånga blir droppar på ett kallt fönster?')

diagram(7, 'fara-exponering-risk', 'Fara och exponering påverkar risken',
 'Ett ämnes farliga egenskaper är inte samma sak som risken i varje situation.', r'''
\panel{.5}{2}{4.6}{6.1}\panel{5.7}{2}{4.6}{6.1}\panel{10.9}{2}{4.6}{6.1}
\node[badge,fill=palerust,text=rust] at (2.8,7.5){FARA};\node[badge,fill=palegold,text=gold] at (8,7.5){EXPONERING};\node[badge] at (13.2,7.5){RISK}
\draw[rust,fill=palerust,line width=2pt] (2.8,6.65)--(3.8,5.65)--(2.8,4.65)--(1.8,5.65)--cycle;\node[text=rust,font=\bfseries\Huge] at (2.8,5.65){!};
\draw[navy,line width=2pt] (7.2,6.2)--(7.2,5.15)--(8.8,5.15)--(8.8,6.2);\fill[gold!35] (7.25,5.2) rectangle(8.75,5.7);\draw[goldarrow] (8,6.5)--(8,5.9);
\draw[teal,line width=9pt] (12.2,5.5) arc(180:0:1);\draw[gold,line width=9pt] (13.2,6.5) arc(90:45:1);\draw[rust,line width=9pt] (13.91,6.21) arc(45:0:1);\draw[navy,line width=2pt,-{Latex}] (13.2,5.5)--(13.75,6.05);
\note{.95}{4.15}{3.75}{Vad kan ämnet orsaka?\par Till exempel skada hud, vara giftigt eller påverka vattenlevande organismer.}
\note{6.15}{4.15}{3.75}{Hur mycket når oss eller miljön?\par Tänk på mängd, kontaktväg, tid och hur ofta kontakten sker.}
\note{11.35}{4.15}{3.75}{Hur sannolikt är det att skada uppstår i den här situationen?\par Minskad exponering kan minska risken.}
\node[smalllabel,text width=14cm] at (8,1.25){Riskbedömning behöver fakta om både ämnet och användningen. Bilden är ett resonemangsstöd, inte en matematisk riskformel.};
''',
 'Tre paneler skiljer farliga egenskaper, hur mycket någon exponeras och risken för skada. Symbolerna är ett utropstecken, kontakt med ett ämne och en riskmätare.',
 'Fara beskriver ämnets egenskaper. Exponering beskriver kontakten. Risk handlar om möjlig skada i en viss situation.',
 'Hur kan risken minska även om ämnet fortfarande har samma farliga egenskaper?')

diagram(7, 'naringskedja-anrikning', 'Svårnedbrytbara ämnen kan följa näringskedjan',
 'Vissa ämnen lämnar kroppen långsamt. Rovdjur kan då få i sig ämnen från många bytesdjur.', r'''
\panel{.5}{2.6}{15}{5.5}
\foreach \x/\title/\n in {2.2/PLANKTON/2,6.1/LITEN FISK/5,10/STÖRRE FISK/10,13.9/FÅGEL/16}{\node[smalllabel,font=\bfseries\footnotesize] at (\x,7.45){\title};\draw[fill=lightteal,draw=teal,rounded corners=4pt] (\x-1.25,4.25) rectangle(\x+1.25,6.9);\foreach \i in {1,...,\n}{\pgfmathsetmacro{\xx}{\x-1+mod(\i-1,4)*.6}\pgfmathsetmacro{\yy}{6.5-floor((\i-1)/4)*.57}\fill[rust] (\xx,\yy) circle(.095);} \node[smalllabel,text width=2.6cm] at (\x,3.65){samma mängd kroppsvävnad jämförs};}
\foreach \x in {3.6,7.5,11.4}{\draw[arrow,line width=2pt] (\x,5.6)--++(.95,0);}
\node[label,text width=14.4cm,fill=palerust,rounded corners=4pt,inner sep=8pt] at (8,1.6){\textbf{Röda punkter = ett tänkt svårnedbrytbart ämne.} Fler punkter per lika stor mängd vävnad visar högre halt. Bilden är schematisk; detta gäller vissa ämnen, inte alla föroreningar.};
''',
 'Näringskedja från plankton till småfisk, större fisk och fågel. Lika stora vävnadsrutor innehåller ökande antal röda punkter för ett svårnedbrytbart ämne.',
 'Bioackumulering betyder ansamling i en organism över tid. Biomagnifikation betyder att halten kan öka mellan nivåer i en näringskedja.',
 'Varför jämför bilden lika stor mängd vävnad i varje ruta?')

diagram(7, 'stoppa-spridning', 'Stoppa föroreningen nära källan',
 'Det är ofta lättare att förebygga utsläpp än att samla in ämnen när de redan har spridits.', r'''
\panel{.5}{2}{15}{6.1}
\foreach \x/\title in {2/KÄLLA,6/VÄG,10/MOTTAGARE,14/ÅTGÄRD}{\node[badge] at (\x,7.45){\title};}
\draw[navy,fill=gold!20,line width=1.4pt] (1.2,5.05) rectangle(2.8,6.55);\draw[navy,line width=1.4pt] (1.6,6.55)--(1.6,6.9)--(2.4,6.9)--(2.4,6.55);\node[label] at (2,5.7){produkt};
\draw[teal,line width=2pt] (4.8,5.15)..controls(5.4,5.6)and(6.1,4.75)..(7.3,5.2);\draw[teal,line width=1.2pt] (4.8,5.55)..controls(5.4,6)and(6.1,5.15)..(7.3,5.6);\foreach \x/\y in {5.4/5.3,6/5.1,6.65/5.35}{\fill[rust] (\x,\y) circle(.08);}
\draw[teal,fill=lightteal] (9.1,5.6)..controls(9.6,6.25)and(10.5,6.25)..(11,5.6)..controls(10.4,4.95)and(9.6,4.95)..(9.1,5.6);\draw[teal,fill=lightteal] (11,5.6)--(11.4,6)--(11.4,5.2)--cycle;\fill[navy] (9.5,5.75) circle(.06);
\draw[teal,line width=5pt] (13.15,5.6)--(13.75,5)--(14.85,6.4);
\foreach \x in {3.1,7.3,11.5}{\draw[arrow] (\x,5.7)--++(.95,0);}
\note{.85}{4.2}{2.8}{Välj mindre skadliga alternativ och använd rätt mängd.}
\note{4.85}{4.2}{2.8}{Ämnen kan följa luft, damm, vatten och avfall.}
\note{8.85}{4.2}{2.8}{Människor, djur och ekosystem kan exponeras.}
\note{12.85}{4.2}{2.3}{Lämna kemikalier och farligt avfall till rätt insamling.}
\node[label,text width=14cm] at (8,1.2){Avloppsrening och vattenrening tar bort många ämnen, men inte alla. Häll inte läkemedel, färgrester eller andra kemikalier i avloppet. Följ kommunens och apotekets anvisningar.};
''',
 'Fyra steg visar en produkt som källa, spridning med vatten, en fisk som mottagare och förebyggande åtgärder. Varje steg får en konkret förklaring.',
 'Giftfri miljö handlar bland annat om att minska skadliga ämnens spridning, välja bättre alternativ och lämna avfall rätt.',
 'Var på kedjan kan du göra störst skillnad innan ämnet har spridits?')

def tex_for(item):
    header = (r'\node[head] at (.6,9.4){' + item['title'] + '};\n'
              + r'\note{.6}{8.9}{14.8}{\textcolor{muted}{' + item['subtitle'] + '}}\n'
              + r'\draw[line] (.6,8.2)--(15.4,8.2);' + '\n')
    footer = (r'\node[anchor=west,text=muted,font=\scriptsize] at (.6,.38){Kemins grunder (i)\quad /\quad Område '
              + str(item['module']) + r'\quad /\quad Förklarande modell};' + '\n'
              + r'\node[anchor=east,text=muted,font=\scriptsize] at (15.4,.38){Inte i skala};' + '\n')
    body = '\n'.join(line + ';' if line.rstrip().endswith('}') and '\\node' in line and '\\foreach' not in line else line for line in item['body'].splitlines())
    return PREAMBLE + header + body + footer + r'\end{tikzpicture}\end{document}' + '\n'

def compile_one(item):
    name = item['id']
    source = ROOT / (name + '.tex')
    source.write_text(tex_for(item), encoding='utf-8')
    with tempfile.TemporaryDirectory(prefix='kemins-tikz-') as temp:
        args = ['latex', '-interaction=nonstopmode', '-halt-on-error', '-output-directory', temp, str(source)]
        result = subprocess.run(args, cwd=ROOT, capture_output=True, text=True)
        if result.returncode:
            log = Path(temp, name + '.log').read_text(errors='replace')
            raise RuntimeError(name + '\n' + log[-6000:])
        svg = DEST / (name + '.svg')
        result = subprocess.run(['dvisvgm', '--no-fonts', '--exact', '--bbox=papersize',
                                 '--output=' + str(svg), str(Path(temp, name + '.dvi'))],
                                cwd=ROOT, capture_output=True, text=True)
        if result.returncode:
            raise RuntimeError(name + '\n' + result.stderr)
    return name

def main():
    DEST.mkdir(parents=True, exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        for name in pool.map(compile_one, DIAGRAMS):
            print('built', name, flush=True)
    manifest = []
    for d in DIAGRAMS:
        manifest.append({k: d[k] for k in ['module', 'id', 'title', 'alt', 'caption', 'question']} | {
            'src': 'assets/diagrams-v2/' + d['id'] + '.svg',
            'source': 'latex/' + d['id'] + '.tex'
        })
    (DEST / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    print('Finished', len(manifest), 'diagrams')

if __name__ == '__main__':
    main()
