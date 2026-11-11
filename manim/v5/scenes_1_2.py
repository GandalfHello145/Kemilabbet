"""Atoms and models: a single visible change explains each new word."""
from shared import *


class AtomMaster(MasterFilm):
    number=1
    topic='Atomer och molekyler'
    slug='01-atomer'
    total_steps=5

    def construct(self):
        oxygen=atom('',OXYGEN,[0,.2,0],.75)
        with self.beat('En atom är en byggsten',
            'Alla ämnen består av små byggstenar. De kallas atomer.',seconds=16,clear=True):
            self.play(GrowFromCenter(oxygen),run_time=2)
            name=label('atom',[0,-1.5,0],54)
            self.play(FadeIn(name),run_time=1.5)
            ring=Circle(radius=1.15,color=TEAL,stroke_width=2).move_to(oxygen)
            self.play(Create(ring),run_time=2)
            self.wait(3)
            self.play(FadeOut(ring),run_time=1.5)
            self.wait(5)

        with self.beat('Atomer finns av olika slag',
            'Syre och väte är två atomslag. Här har de varsin färg.',seconds=16):
            hydrogen=atom('H',HYDROGEN,[-3,.2,0],.52)
            o_symbol=formula(r'\mathrm O',[3,.2,0],68,OXYGEN)
            self.play(FadeOut(name),oxygen.animate.move_to([3,.2,0]),run_time=2)
            self.play(FadeIn(hydrogen),FadeIn(o_symbol),run_time=2)
            oxygen.add(o_symbol)
            hname=label('väte',[-3,-1.4,0],48,HYDROGEN)
            oname=label('syre',[3,-1.4,0],48,OXYGEN)
            self.play(FadeIn(hname),run_time=1.5)
            self.wait(2)
            self.play(FadeIn(oname),run_time=1.5)
            self.wait(6)

        with self.beat('Atomer kan bilda en molekyl',
            'Två väteatomer och en syreatom sitter ihop. Gruppen kallas en vattenmolekyl.',seconds=16):
            second=atom('H',HYDROGEN,[-3,-1.4,0],.52)
            self.play(FadeOut(hname),FadeOut(oname),FadeIn(second),run_time=1.5)
            self.play(oxygen.animate.move_to([0,.65,0]),hydrogen.animate.move_to([-1.25,-.55,0]),
                second.animate.move_to([1.25,-.55,0]),run_time=3.5)
            links=VGroup(bond(oxygen,hydrogen),bond(oxygen,second))
            self.play(Create(links),run_time=2)
            molecule=VGroup(links,oxygen,hydrogen,second)
            self.add(molecule)
            molecule_name=label('vattenmolekyl',[0,-2.05,0],46,TEAL)
            self.play(FadeIn(molecule_name),run_time=1.5)
            self.wait(2)
            self.play(drift(VGroup(molecule),[molecule.get_center().copy()],5,.09),run_time=5)

        with self.beat('Formeln berättar vilka atomer som ingår',
            'Vatten är en kemisk förening: olika atomslag sitter ihop. Dess formel är H2O.',seconds=17):
            self.play(FadeOut(molecule_name),molecule.animate.shift(LEFT*3.3),run_time=2)
            water_formula=MathTex(r'\mathrm H_2',r'\mathrm O',tex_template=TEMPLATE,font_size=90).move_to([3.5,.9,0])
            water_formula[0].set_color(HYDROGEN);water_formula[1].set_color(OXYGEN)
            self.play(FadeIn(water_formula),run_time=2)
            two=label('2 väteatomer',[3.5,-.5,0],37,HYDROGEN)
            one=label('1 syreatom',[3.5,-1.5,0],37,OXYGEN)
            self.play(FadeIn(two),run_time=1.5)
            self.wait(2)
            self.play(FadeIn(one),run_time=1.5)
            self.play(Create(SurroundingRectangle(water_formula[0],buff=.13,color=HYDROGEN)),run_time=1.5)
            self.wait(5)

        with self.beat('En blandning innehåller flera ämnen',
            'Blandningen innehåller vatten och syrgas. De två ämnena finns tillsammans men är olika.',seconds=17,clear=True):
            frame=panel(11.8,4.0,[0,.1,0],MUTED)
            wm=water([-3.5,.4,0],1.1)
            oa=atom('O',OXYGEN,[2.5,.4,0],.43)
            ob=atom('O',OXYGEN,[3.6,.4,0],.43)
            oxygen_molecule=VGroup(bond(oa,ob),oa,ob)
            self.play(Create(frame),FadeIn(wm),run_time=2)
            self.play(FadeIn(label('vatten',[-3.5,-1.25,0],43,TEAL)),run_time=1.5)
            self.play(FadeIn(oxygen_molecule),run_time=2)
            self.play(FadeIn(label('syrgas',[3,-1.25,0],43,OXYGEN)),run_time=1.5)
            self.play(drift(VGroup(wm,oxygen_molecule),[[-3.5,.4,0],[3,.4,0]],7,.2),run_time=7)
            self.wait(2)
        self.finish('En atom är en byggsten. En molekyl består av atomer som sitter ihop.')


class ModelMaster(MasterFilm):
    number=2
    topic='Så ändrades bilden av atomen'
    slug='02-modeller'
    total_steps=5

    def construct(self):
        with self.beat('Thomson: elektroner inne i atomen',
            'Thomson tänkte sig en positiv klump med negativa elektroner inuti. Sedan kom nya försök.',seconds=17,clear=True):
            bulk=Circle(radius=1.65,color=GOLD,fill_color=GOLD,fill_opacity=.12)
            electrons=VGroup(*[atom('-',BLUE,p,.22) for p in [[-.75,.6,0],[.65,.8,0],[-.4,-.7,0],[.8,-.5,0]]])
            self.play(GrowFromCenter(bulk),run_time=2)
            self.play(FadeIn(label('positiv klump',[4,.6,0],40,GOLD)),run_time=1.5)
            self.play(LaggedStart(*[FadeIn(e) for e in electrons],lag_ratio=.3),run_time=3)
            self.play(FadeIn(label('elektroner',[4,-.7,0],40,BLUE)),run_time=1.5)
            self.wait(2)
            self.play(drift(electrons,[e.get_center().copy() for e in electrons],6,.07),run_time=6)

        with self.beat('Ett försök gav en ny ledtråd',
            'De flesta partiklar passerade guldfolien. Några studsade tillbaka. Vad kunde förklara det?',seconds=17,clear=True):
            foil=Rectangle(width=.13,height=3.8,color=GOLD,fill_color=GOLD,fill_opacity=.7)
            self.play(Create(foil),FadeIn(label('tunn guldfolie',[0,-2.5,0],37,GOLD)),run_time=2)
            incoming=VGroup(*[atom('+',GOLD,[-5,y,0],.16) for y in [1.0,0,-1.0]])
            self.play(FadeIn(incoming),run_time=1)
            straight=VGroup(Line([-5,1,0],[5,1,0],color=TEAL,stroke_opacity=.35),
                Line([-5,-1,0],[5,-1,0],color=TEAL,stroke_opacity=.35))
            bent=VMobject(color=CORAL,stroke_width=3).set_points_as_corners([[-5,0,0],[0,0,0],[-3.7,1.8,0]])
            self.play(Create(straight),MoveAlongPath(incoming[0],straight[0]),MoveAlongPath(incoming[2],straight[1]),run_time=4,rate_func=linear)
            self.play(Create(bent),MoveAlongPath(incoming[1],bent),run_time=4,rate_func=linear)
            self.play(FadeIn(label('några studsade tillbaka',[-3.8,2.3,0],33,CORAL)),run_time=1.5)
            self.wait(4)

        with self.beat('Rutherford: en liten kärna',
            'Positiva partiklar stöts bort av den positiva kärnan. De flesta passerar atomens tomrum.',seconds=17,clear=True):
            border=Circle(radius=2.0,color=MUTED,stroke_opacity=.55)
            nucleus=atom('+',GOLD,[0,0,0],.23)
            self.play(Create(border),run_time=2)
            self.play(GrowFromCenter(nucleus),run_time=2)
            pointer=arrow([3.0,1.0,0],[.4,.1,0],GOLD)
            self.play(GrowArrow(pointer),FadeIn(label('kärna',[4.1,1.25,0],46,GOLD)),run_time=2)
            self.play(FadeIn(label('mest tomrum',[3.9,-1.0,0],41,MUTED)),run_time=2)
            self.play(FadeIn(label(r'$+$ stöter bort $+$',[3.9,-2.05,0],36,GOLD)),run_time=1.5)
            self.wait(1.5)
            positive=atom('+',GOLD,[-4,-.2,0],.16)
            bounce=VMobject(color=GOLD,stroke_width=2).set_points_smoothly([[-4,-.2,0],[-.9,.2,0],[-3,1.5,0]])
            self.add(positive)
            self.play(Create(bounce),MoveAlongPath(positive,bounce),run_time=3)
            self.wait(2)

        with self.beat('Som ett litet solsystem?',
            'Kärnan liknar solen i bilden. Men elektroner följer inte bestämda banor som planeter.',seconds=17,clear=True):
            nucleus=atom('+',GOLD,ORIGIN,.35)
            orbit=Circle(radius=1.8,color=BLUE,stroke_opacity=.5)
            electron=atom('-',BLUE,[1.8,0,0],.22)
            self.play(GrowFromCenter(nucleus),Create(orbit),FadeIn(electron),run_time=2)
            self.play(FadeIn(label('en liknelse',[4,1,0],42)),run_time=1.5)
            self.play(MoveAlongPath(electron,orbit),run_time=5,rate_func=linear)
            cloud=Annulus(inner_radius=1.2,outer_radius=2.15,color=BLUE,fill_opacity=.07,stroke_width=0)
            self.play(FadeOut(orbit),FadeIn(cloud),run_time=2)
            self.play(FadeIn(label('ingen bestämd bana',[3.9,-.7,0],38,BLUE,width=6.3)),run_time=1.5)
            self.play(drift(VGroup(electron),[[1.8,0,0]],4,.3),run_time=4)
            self.wait(1)

        with self.beat('Bohr: en bild med elektronskal',
            'Bohr ritade skal runt kärnan. Skalmodellen hjälper oss att hålla reda på elektroner.',seconds=17,clear=True):
            nucleus=atom('+',GOLD,ORIGIN,.35)
            shell=Circle(radius=1.7,color=BLUE,stroke_width=2.5)
            electron=atom('-',BLUE,[1.7,0,0],.22)
            self.play(GrowFromCenter(nucleus),run_time=1.5)
            self.play(Create(shell),run_time=2)
            self.play(FadeIn(electron),run_time=1.5)
            a=arrow([3.6,1.1,0],[1.25,1.15,0],BLUE)
            self.play(GrowArrow(a),FadeIn(label('skal',[4.5,1.4,0],46,BLUE)),run_time=2)
            self.play(FadeIn(label('kärna',[0,-.85,0],35,GOLD)),run_time=1.5)
            self.wait(3)
            self.play(ShowPassingFlash(shell.copy().set_color(TEAL),time_width=.6),run_time=3)
            self.wait(2)
        self.finish('En modell hjälper oss att förstå. Nya försök kan ge bättre modeller.')
