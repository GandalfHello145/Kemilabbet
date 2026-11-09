"""Kemilabbet: seven original explanatory Manim films.
All visible text is rendered by LaTeX (Tex/MathTex), never Manim Text.
Render: python -m manim -qm --fps 30 --disable_caching kemilabbet_films.py Atomer
"""
from pathlib import Path
import math
import numpy as np
from manim import *

BG = '#0B1726'
INK = '#F2F4ED'
MUTED = '#A9BAC5'
TEAL = '#4DE2C1'
BLUE = '#6CB7FF'
GOLD = '#F4C967'
CORAL = '#FA8A76'
OXYGEN = CORAL
HYDROGEN = BLUE
VIOLET = '#BEA2F6'

TEMPLATE = TexTemplate(preamble="")
TEMPLATE.add_to_preamble(r'\usepackage[T1]{fontenc}')
TEMPLATE.add_to_preamble(r'\usepackage[utf8]{inputenc}')
TEMPLATE.add_to_preamble(r'\usepackage[swedish]{babel}')
TEMPLATE.add_to_preamble(r'\usepackage{amsmath,amssymb}')
TEMPLATE.add_to_preamble(r'\usepackage{lmodern}')

FILENAMES = ['01-atomer','02-modeller','03-elektroner','04-forandringar',
             '05-egenskaper','06-faser','07-miljo']


def text(s, size=30, color=INK, width=None):
    t = Tex(s, tex_template=TEMPLATE, font_size=size, color=color)
    if width is not None and t.width > width:
        t.scale_to_fit_width(width)
    return t


def formula(s, size=40, color=INK):
    return MathTex(s, tex_template=TEMPLATE, font_size=size, color=color)


def dot_atom(symbol, color, radius=.35, position=ORIGIN):
    a = VGroup(Circle(radius=radius, stroke_color=color, stroke_width=2,
                      fill_color=color, fill_opacity=.18),
               text(symbol, size=30, color=color) if symbol else VGroup())
    a.move_to(position)
    return a


def molecule2d(position=ORIGIN, scale=1, labels=True):
    o = dot_atom('O' if labels else '', OXYGEN, .32)
    h1 = dot_atom('H' if labels else '', HYDROGEN, .23, [-.52,-.42,0])
    h2 = dot_atom('H' if labels else '', HYDROGEN, .23, [.52,-.42,0])
    bonds = VGroup(Line(o.get_center(),h1.get_center(),color=MUTED,stroke_width=5),
                   Line(o.get_center(),h2.get_center(),color=MUTED,stroke_width=5))
    return VGroup(bonds,o,h1,h2).scale(scale).move_to(position)


def sphere_atom(color, radius=.3, pos=ORIGIN):
    return Sphere(center=pos, radius=radius, resolution=(8,12),
                  checkerboard_colors=False, fill_color=color,
                  fill_opacity=1, stroke_width=0)


def molecule3d(pos=ORIGIN, scale=1):
    o = sphere_atom(OXYGEN,.37)
    h1 = sphere_atom(HYDROGEN,.25,[-.56,-.45,.12])
    h2 = sphere_atom(HYDROGEN,.25,[.56,-.45,-.12])
    bonds=VGroup(Line3D(o.get_center(),h1.get_center(),thickness=.055,color=INK),
                 Line3D(o.get_center(),h2.get_center(),thickness=.055,color=INK))
    return VGroup(bonds,o,h1,h2).scale(scale).move_to(pos)


def arrow(start,end,color=TEAL,**kwargs):
    return Arrow(start,end,buff=.12,color=color,stroke_width=3,**kwargs)


def panel_label(s, pos, color=INK, size=28):
    return text(s,size,color).move_to(pos)


def dashed_box(width,height,center,color=BLUE):
    return DashedVMobject(RoundedRectangle(width=width,height=height,
               corner_radius=.12,color=color,stroke_width=2),num_dashes=40).move_to(center)


def smooth_path(points,color=GOLD,width=3):
    return VMobject(color=color,stroke_width=width).set_points_smoothly(points)


class LabFilm(ThreeDScene):
    """Shared visual language, exact captions and accessible mathematical text."""
    number=1
    topic=''
    def setup(self):
        super().setup()
        self.camera.background_color=BG
        self.cues=[]
        self.active_cue=None
        self.overlay=[]
        self.caption=None
        self.set_camera_orientation(phi=0,theta=-90*DEGREES)
        n=text(f'{self.number:02d}',30,TEAL).to_corner(UL,buff=.45)
        topic=text(self.topic,27,INK,width=9.3).next_to(n,RIGHT,buff=.35)
        rule=Line(LEFT*6.65+UP*3.12,RIGHT*6.65+UP*3.12,color=MUTED,stroke_width=1).set_opacity(.25)
        brand=text(r'Kemins grunder (i)',15,MUTED).to_corner(UR,buff=.4)
        self.overlay=[n,topic,rule,brand]
        self.add_fixed_in_frame_mobjects(*self.overlay)
        self.play(FadeIn(n),FadeIn(topic,shift=RIGHT*.2),Create(rule),FadeIn(brand),run_time=1.4)

    def cue(self,spoken):
        if self.active_cue is not None:
            self.cues.append((self.active_cue[0],self.time,self.active_cue[1]))
        self.active_cue=(self.time,spoken)
        # Exact authored prose, typeset in LaTeX; captions are also saved as WebVTT.
        safe=spoken.replace('&',r'\&').replace('%',r'\%').replace('_',r'\_')
        new=text(r'\parbox{14.0cm}{\centering '+safe+'}',24,INK,width=12.35).move_to(DOWN*3.12)
        self.add_fixed_in_frame_mobjects(new)
        if self.caption is not None:
            self.remove(self.caption)
        self.caption=new
        if new not in self.overlay:self.overlay.append(new)

    def heading(self,s,color=TEAL):
        h=text(s,34,color,width=11.7).move_to(UP*2.45)
        self.add_fixed_in_frame_mobjects(h)
        self.play(FadeIn(h,shift=UP*.12),run_time=.65)
        return h

    def clear_stage(self):
        keep=set(self.overlay)
        content=[m for m in list(self.mobjects) if m not in keep]
        if content:self.play(*[FadeOut(m) for m in content],run_time=.8)
        self.set_camera_orientation(phi=0,theta=-90*DEGREES)

    def hold(self,seconds=2):
        self.wait(seconds)

    def finish(self,summary):
        self.clear_stage()
        self.cue(summary)
        check=Circle(radius=.6,color=TEAL,fill_color=TEAL,fill_opacity=.10)
        tick=VMobject(color=TEAL,stroke_width=6).set_points_as_corners([[-.28,0,0],[-.05,-.22,0],[.32,.25,0]])
        title=text('Nu förklarar ni.',46,INK).next_to(check,DOWN,buff=.5)
        prompt=text(r'Titta $\longrightarrow$ Förstå $\longrightarrow$ Svara',28,MUTED).next_to(title,DOWN,buff=.35)
        self.play(Create(check),Create(tick),FadeIn(title),run_time=1.4)
        self.play(Write(prompt),run_time=1.4)
        self.wait(5)
        self.cues.append((self.active_cue[0],self.time,self.active_cue[1]))
        out=Path(__file__).resolve().parent.parent/'assets'/'captions'/'v2'/f'{FILENAMES[self.number-1]}.vtt'
        out.parent.mkdir(parents=True,exist_ok=True)
        def stamp(t):
            ms=round(t*1000);return f'{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d}.{ms%1000:03d}'
        out.write_text('WEBVTT\n\n'+'\n\n'.join(f'{i}\n{stamp(a)} --> {stamp(b)}\n{s}' for i,(a,b,s) in enumerate(self.cues,1))+'\n')
        print(f'KEMILABBET_DURATION {FILENAMES[self.number-1]} {self.time:.3f}')


class Atomer(LabFilm):
    number=1
    topic='Atomer och molekyler'
    def construct(self):
        self.cue('En droppe vatten rymmer ofattbart många molekyler. Vi förstorar en modell för att se byggstenarna.')
        title=self.heading('Från en droppe till en molekyl')
        drop=Circle(radius=1.25,color=BLUE,fill_color=BLUE,fill_opacity=.12)
        sample=VGroup(*[Dot([x,y,0],radius=.035,color=BLUE) for x in np.linspace(-.8,.8,7) for y in np.linspace(-.8,.8,7) if x*x+y*y<.9])
        label=text('vatten',29,BLUE).next_to(drop,DOWN)
        self.play(DrawBorderThenFill(drop),LaggedStart(*[FadeIn(d) for d in sample],lag_ratio=.015),FadeIn(label),run_time=2)
        focus=Circle(radius=.16,color=GOLD).move_to(sample[20])
        self.play(Create(focus),run_time=1)
        self.play(VGroup(drop,sample,label).animate.scale(.65).to_edge(LEFT,buff=1.1),focus.animate.scale(3).move_to(RIGHT*2),run_time=2)
        mol=molecule2d(RIGHT*2,1.8)
        self.play(FadeOut(focus),FadeIn(mol,scale=.25),run_time=2)
        self.play(mol.animate.rotate(.25),rate_func=there_and_back,run_time=3)
        self.wait(2)
        self.clear_stage()

        self.cue('En atom är en mycket liten byggsten. H står för väte och O står för syre. Bokstaven visar atomslaget.')
        self.heading('Olika byggstenar -- olika atomslag')
        h=dot_atom('H',HYDROGEN,.6,LEFT*2)
        o=dot_atom('O',OXYGEN,.8,RIGHT*2)
        names=VGroup(text('väte',30,BLUE).next_to(h,DOWN,buff=.4),text('syre',30,CORAL).next_to(o,DOWN,buff=.4))
        self.play(GrowFromCenter(h),GrowFromCenter(o),Write(names),run_time=2)
        self.play(h.animate.shift(UP*.35),o.animate.shift(DOWN*.25),run_time=2,rate_func=there_and_back)
        atomslag=text('2 atomslag',39,GOLD).move_to(DOWN*1.8)
        self.play(Write(atomslag),run_time=1.5)
        self.wait(4)
        self.clear_stage()

        self.cue('Två väteatomer och en syreatom binds ihop. En molekyl består av atomer som sitter ihop med kemiska bindningar.')
        self.heading('Atomer binds ihop till en molekyl')
        h1=dot_atom('H',HYDROGEN,.4,[-3,-.3,0]);h2=dot_atom('H',HYDROGEN,.4,[3,-.3,0]);o=dot_atom('O',OXYGEN,.55,[0,1,0])
        self.play(FadeIn(h1),FadeIn(h2),FadeIn(o),run_time=1)
        self.play(h1.animate.move_to([-1,-.45,0]),h2.animate.move_to([1,-.45,0]),o.animate.move_to([0,.45,0]),run_time=2.6,rate_func=smooth)
        bonds=VGroup(Line(h1.get_center(),o.get_center(),color=TEAL,stroke_width=6),Line(h2.get_center(),o.get_center(),color=TEAL,stroke_width=6))
        self.play(Create(bonds),run_time=1.3)
        f=formula(r'\mathrm{H}_2\mathrm{O}',56).move_to(DOWN*1.75)
        self.play(Write(f),run_time=1.8)
        self.play(Indicate(h1,color=BLUE),Indicate(h2,color=BLUE),run_time=1.4)
        self.play(Indicate(o,color=CORAL),run_time=1)
        self.wait(3)
        self.clear_stage()

        self.cue('Modellen kan vridas i tre dimensioner. Kulorna och pinnarna hjälper oss att tänka; verkliga atomer har inga färgade kulskal.')
        self.heading('En modell visar något viktigt')
        mol3=molecule3d(ORIGIN,1.65)
        self.add(mol3)
        self.move_camera(phi=65*DEGREES,theta=-55*DEGREES,run_time=2.5)
        self.begin_ambient_camera_rotation(rate=.17)
        self.wait(8)
        self.stop_ambient_camera_rotation()
        self.move_camera(phi=0,theta=-90*DEGREES,run_time=2)
        self.wait(1)
        self.clear_stage()

        self.cue('Räkna på två sätt. En vattenmolekyl har tre atomer sammanlagt men bara två atomslag: väte och syre.')
        self.heading('Antal atomer är inte antal atomslag')
        mol=molecule2d(UP*.3,1.65)
        self.play(FadeIn(mol),run_time=1)
        atom_count=formula(r'2\,\mathrm{H}+1\,\mathrm{O}=3\ \text{atomer}',37).move_to(DOWN*1.15)
        types=text('H och O: 2 atomslag',34,GOLD).move_to(DOWN*1.95)
        self.play(Write(atom_count),run_time=2.3)
        self.play(Circumscribe(mol[2],color=BLUE),Circumscribe(mol[3],color=BLUE),run_time=2)
        self.play(Write(types),run_time=1.5)
        self.wait(4)
        self.clear_stage()

        self.cue('Syrgas, O två, är också en molekyl, men av ett enda atomslag. Vatten är en kemisk förening eftersom olika grundämnen är bundna till varandra.')
        self.heading('Två molekyler -- en viktig skillnad')
        oxygen=VGroup(dot_atom('O',OXYGEN,.43,[-3.5,0,0]),dot_atom('O',OXYGEN,.43,[-2.4,0,0]),Line([-3.1,0,0],[-2.8,0,0],color=TEAL,stroke_width=5))
        water=molecule2d([3,0,0],1.25)
        self.play(FadeIn(oxygen),FadeIn(water),run_time=1.4)
        left=VGroup(formula(r'\mathrm{O}_2',40),text('2 atomer / 1 atomslag',27),text('grundämne',29,CORAL)).arrange(DOWN,buff=.3).move_to([-3,-1.55,0])
        right=VGroup(formula(r'\mathrm{H}_2\mathrm{O}',40),text('3 atomer / 2 atomslag',27),text('kemisk förening',29,TEAL)).arrange(DOWN,buff=.3).move_to([3,-1.55,0])
        self.play(Write(left),Write(right),run_time=2.5)
        self.play(Indicate(oxygen),Indicate(water),run_time=1.8)
        self.wait(5)
        self.finish('Förklara skillnaden mellan atom, molekyl och atomslag. Räkna sedan atomer och atomslag i O två och H två O.')


class Atommodeller(LabFilm):
    number=2
    topic='Hur atommodellen har förändrats'
    def construct(self):
        self.cue('En vetenskaplig modell hjälper oss att förklara undersökningar. När ny kunskap kommer kan modellen behöva förändras.')
        self.heading('Nya försök förändrar vår bild')
        line=Line(LEFT*5.2,RIGHT*5.2,color=MUTED)
        years=['Dalton','Thomson','Rutherford','Bohr']
        dots=VGroup(*[Dot([-4.5+3*i,0,0],color=TEAL,radius=.08) for i in range(4)])
        labels=VGroup(*[text(y,25).next_to(d,DOWN,buff=.4) for y,d in zip(years,dots)])
        self.play(Create(line),LaggedStart(*[GrowFromCenter(d) for d in dots],lag_ratio=.2),run_time=2)
        self.play(LaggedStart(*[Write(l) for l in labels],lag_ratio=.2),run_time=2)
        idea=text(r'försök $\longrightarrow$ förklaring $\longrightarrow$ ny modell',31,GOLD).move_to(UP*1.35)
        self.play(Write(idea),run_time=2)
        self.wait(4)
        self.clear_stage()

        self.cue('Dalton beskrev atomen som en hel kula. Elektronens upptäckt krävde mindre delar. Thomsons modell har negativt laddade elektroner i utspridd positiv laddning.')
        self.heading('Från hel kula till delar inuti')
        dalton=Circle(radius=1,color=TEAL,fill_color=TEAL,fill_opacity=.2).move_to(LEFT*3)
        dlabel=text('Daltons kulmodell',29).next_to(dalton,DOWN,buff=.35)
        cake=Circle(radius=1.25,color=GOLD,fill_color=GOLD,fill_opacity=.15).move_to(RIGHT*2.8)
        electrons=VGroup(*[dot_atom('$-$',BLUE,.16,[2.8+x,y,0]) for x,y in [(-.7,.35),(-.4,-.65),(.55,-.4),(.55,.55),(0,.1)]])
        positive=VGroup(*[formula('+',25,GOLD).move_to([2.8+x,y,0]) for x,y in [(-.7,-.3),(0,.8),(.75,0),(0,-.8)]])
        tlabel=text('Thomson 1904',29).next_to(cake,DOWN,buff=.35)
        self.play(FadeIn(dalton),Write(dlabel),run_time=1.5)
        self.play(TransformFromCopy(dalton,cake),run_time=2)
        self.play(LaggedStart(*[FadeIn(e) for e in electrons],lag_ratio=.15),FadeIn(positive),Write(tlabel),run_time=2)
        self.play(Indicate(positive,color=GOLD),run_time=1.5)
        self.wait(5)
        self.clear_stage()

        self.cue('Rutherford lät positivt laddade alfapartiklar träffa tunn guldfolie. De flesta gick rakt igenom; några böjdes av kraftigt.')
        self.heading('Ett försök med guldfolie')
        foil=Rectangle(width=.13,height=3.4,color=GOLD,fill_color=GOLD,fill_opacity=.8)
        foilname=text('guldfolie',25,GOLD).next_to(foil,DOWN,buff=.2)
        source=RoundedRectangle(width=.8,height=1,color=MUTED,fill_color=MUTED,fill_opacity=.2).move_to(LEFT*5)
        plabel=text('positiva partiklar',24).move_to([-3.6,1.7,0])
        paths=[smooth_path([[-4.5,y,0],[-.2,y,0],[4.6,y,0]],GOLD) for y in [-1,-.5,.4,1]]
        paths.append(smooth_path([[-4.5,0,0],[-.45,0,0],[.2,.4,0],[1.8,2,0]],CORAL))
        paths.append(smooth_path([[-4.5,.15,0],[-.15,.15,0],[-.5,.85,0],[-2.5,1.5,0]],CORAL))
        self.play(FadeIn(source),Create(foil),Write(foilname),Write(plabel),run_time=1.4)
        for i,p in enumerate(paths):
            d=Dot(p.get_start(),color=GOLD,radius=.055)
            self.add(d)
            self.play(Create(p),MoveAlongPath(d,p),run_time=1.15)
            self.remove(d)
        observed=text('De flesta rakt fram. Några stora avböjningar.',28,GOLD).move_to(DOWN*2.1)
        self.play(Write(observed),run_time=1.8)
        self.wait(2)
        self.clear_stage()

        self.cue('Rutherfords kärnmodell från 1911 samlar den positiva laddningen i en mycket liten kärna. Det mesta av atomens volym finns runt kärnan.')
        self.heading('En liten, positiv kärna')
        boundary=Circle(radius=1.65,color=BLUE,stroke_opacity=.35)
        nucleus=dot_atom('+',CORAL,.22)
        e=dot_atom('$-$',BLUE,.12,[1.4,.6,0])
        self.play(Create(boundary),GrowFromCenter(nucleus),FadeIn(e),run_time=1.8)
        ptr=arrow([3.6,.8,0],[.3,.1,0],CORAL)
        name=text('positiv kärna',29,CORAL).move_to([4,1.25,0])
        space=text('stor volym runt kärnan',28,BLUE).move_to([-3.7,-1.5,0])
        self.play(GrowArrow(ptr),Write(name),Write(space),run_time=2)
        self.play(Indicate(nucleus,color=CORAL,scale_factor=1.7),run_time=1.4)
        caveat=text('Storlekar och avstånd är inte skalenliga.',22,MUTED).move_to(DOWN*2.15)
        self.play(FadeIn(caveat),run_time=1)
        self.wait(5)
        self.clear_stage()

        self.cue('En solsystemsliknelse kan hjälpa: kärnan motsvarar solen och elektronerna planeterna. Men elektroner är inte små planeter i bestämda banor; liknelsen har gränser.')
        self.heading('Solsystemet är en liknelse, inte verkligheten')
        sun=sphere_atom(GOLD,.42,LEFT*3)
        earth=sphere_atom(BLUE,.17,[-1.7,0,0])
        orbit=Circle(radius=1.3,color=GOLD,stroke_opacity=.5).move_to(LEFT*3)
        nucleus=sphere_atom(CORAL,.25,RIGHT*3)
        electron=sphere_atom(BLUE,.13,[4.3,0,0])
        orbit2=Circle(radius=1.3,color=BLUE,stroke_opacity=.5).move_to(RIGHT*3)
        self.play(FadeIn(sun),FadeIn(earth),Create(orbit),FadeIn(nucleus),FadeIn(electron),Create(orbit2),run_time=1.5)
        l=text('sol / planet',27,GOLD).move_to([-3,-1.9,0]);r=text('kärna / elektron',27,BLUE).move_to([3,-1.9,0])
        self.add_fixed_in_frame_mobjects(l,r)
        self.move_camera(phi=55*DEGREES,theta=-75*DEGREES,run_time=2)
        self.play(Rotate(earth,angle=TAU,about_point=LEFT*3),Rotate(electron,angle=TAU,about_point=RIGHT*3),run_time=5,rate_func=linear)
        self.move_camera(phi=0,theta=-90*DEGREES,run_time=1.5)
        cross=VGroup(Line([1.7,-1.35,0],[4.3,1.35,0],color=CORAL,stroke_width=4),Line([1.7,1.35,0],[4.3,-1.35,0],color=CORAL,stroke_width=4)).set_opacity(.65)
        self.play(Create(cross),run_time=1)
        self.wait(3)
        self.clear_stage()

        self.cue('Bohr lade 1913 till bestämda energinivåer. Skalen visar energier. Dagens elektronmoln visar i stället var elektronen sannolikt kan finnas.')
        self.heading('Bohr: bestämda energinivåer')
        rings=VGroup(*[Circle(radius=r,color=BLUE,stroke_opacity=.6) for r in [.7,1.3,1.9]]).shift(LEFT*2.8)
        core=dot_atom('+',CORAL,.16,LEFT*2.8)
        e=Dot([-2.1,0,0],color=BLUE,radius=.09)
        self.play(Create(rings),FadeIn(core),FadeIn(e),run_time=1.8)
        levels=VGroup(*[Line([1.3,y,0],[4.6,y,0],color=GOLD,stroke_width=3) for y in [-1.2,0,1.2]])
        labels=VGroup(*[formula(f'E_{i+1}',25,GOLD).next_to(levels[i],RIGHT) for i in range(3)])
        self.play(Create(levels),Write(labels),run_time=1.7)
        energy=arrow([3,-1.1,0],[3,-.1,0],TEAL)
        self.play(GrowArrow(energy),e.animate.move_to([-1.5,0,0]),run_time=1.5)
        cloud=VGroup(*[Dot([3+math.cos(i*2.4)*(i%11)/10,math.sin(i*2.4)*(i%11)/10,0],radius=.035,color=BLUE,fill_opacity=.5) for i in range(80)])
        self.play(FadeOut(levels),FadeOut(labels),FadeOut(energy),FadeIn(cloud),run_time=1.8)
        cloudlabel=text('elektronmoln: sannolikhet',25,BLUE).move_to([3,-1.8,0])
        self.play(Write(cloudlabel),run_time=1.3)
        self.wait(3)
        self.finish('Jämför Thomson, Rutherford och Bohr. Var finns den positiva laddningen, vad visar skalen och var slutar solsystemsliknelsen fungera?')


class Elektroner(LabFilm):
    number=3
    topic='Elektroner och kemiska reaktioner'
    def construct(self):
        self.cue('Kärnan är positiv och elektronen negativ. Motsatta laddningar dras till varandra. Vi följer delarna före och efter en bindning.')
        self.heading('Plus och minus påverkar varandra')
        p=dot_atom('+',CORAL,.55,LEFT*2.7);e=dot_atom('$-$',BLUE,.35,RIGHT*2.7)
        a1=arrow([-1.8,0,0],[-.7,0,0],CORAL);a2=arrow([1.8,0,0],[.7,0,0],BLUE)
        self.play(GrowFromCenter(p),GrowFromCenter(e),run_time=1.5)
        self.play(GrowArrow(a1),GrowArrow(a2),run_time=1.4)
        self.play(p.animate.shift(RIGHT*.65),e.animate.shift(LEFT*.65),run_time=2.4)
        label=text('motsatta laddningar attraherar',31,TEAL).move_to(DOWN*1.6)
        self.play(Write(label),run_time=1.5)
        self.wait(4)
        self.clear_stage()

        self.cue('En neutral väteatom har en proton och en elektron. Två väteatomer ger tillsammans två kärnor och två elektroner.')
        self.heading('Börja med två neutrala väteatomer')
        groups=[]
        for x in [-2.5,2.5]:
            core=dot_atom('+',CORAL,.25,[x,0,0]);ring=Circle(radius=.9,color=BLUE,stroke_opacity=.5).move_to([x,0,0]);el=Dot([x,.9,0],radius=.09,color=BLUE)
            groups.append(VGroup(core,ring,el))
        self.play(*[FadeIn(g) for g in groups],run_time=1.6)
        count=formula(r'2\ \text{kärnor}\quad+\quad2\ \text{elektroner}',36).move_to(DOWN*1.8)
        self.play(Write(count),run_time=1.7)
        self.play(*[Rotate(g[2],angle=TAU,about_point=g[0].get_center()) for g in groups],run_time=4,rate_func=linear)
        self.wait(3)
        self.clear_stage()

        self.cue('När H två bildas delas ett gemensamt elektronpar. De negativa elektronerna dras till båda positiva kärnorna och hjälper till att hålla ihop molekylen.')
        self.heading('En bindning genom delade elektroner')
        cores=VGroup(dot_atom('+',CORAL,.28,[-2.8,0,0]),dot_atom('+',CORAL,.28,[2.8,0,0]))
        electrons=VGroup(Dot([-2.8,.8,0],radius=.1,color=BLUE),Dot([2.8,-.8,0],radius=.1,color=BLUE))
        self.play(FadeIn(cores),FadeIn(electrons),run_time=1.4)
        self.play(cores[0].animate.move_to([-1.2,0,0]),cores[1].animate.move_to([1.2,0,0]),electrons[0].animate.move_to([0,.25,0]),electrons[1].animate.move_to([0,-.25,0]),run_time=3)
        cloud=Ellipse(width=4,height=1.8,color=BLUE,fill_color=BLUE,fill_opacity=.12)
        self.play(DrawBorderThenFill(cloud),run_time=1.7)
        lbl=text('gemensamt elektronpar',32,BLUE).move_to(DOWN*1.65)
        self.play(Write(lbl),run_time=1.5)
        self.play(electrons[0].animate.shift([.2,.15,0]),electrons[1].animate.shift([-.18,-.12,0]),run_time=2,rate_func=there_and_back)
        self.play(electrons[0].animate.shift([-.16,-.1,0]),electrons[1].animate.shift([.17,.14,0]),run_time=2,rate_func=there_and_back)
        self.wait(2)
        self.clear_stage()

        self.cue('I en tredimensionell modell ser vi samma två kärnor. Bindningen ändrar inte atomslaget. Väte är fortfarande väte.')
        self.heading('Kärnorna finns kvar')
        left=sphere_atom(BLUE,.57,[-.9,0,0]);right=sphere_atom(BLUE,.57,[.9,0,0]);bond=Line3D(left.get_center(),right.get_center(),thickness=.15,color=TEAL)
        mol=VGroup(bond,left,right)
        self.play(FadeIn(mol),run_time=1.2)
        self.move_camera(phi=65*DEGREES,theta=-55*DEGREES,run_time=2)
        self.begin_ambient_camera_rotation(rate=.22);self.wait(6);self.stop_ambient_camera_rotation()
        self.move_camera(phi=0,theta=-90*DEGREES,run_time=1.5)
        caption=formula(r'\mathrm{H}+\mathrm{H}\longrightarrow\mathrm{H}_2',41).move_to(DOWN*1.7)
        self.play(Write(caption),run_time=1.5)
        self.wait(2)
        self.clear_stage()

        self.cue('Elektroner kan också flyttas mellan atomer. Natrium lämnar en elektron till klor. Då bildas en positiv och en negativ jon.')
        self.heading('Ett annat sätt: en elektron flyttas')
        na=dot_atom('Na',GOLD,.65,[-3,0,0]);cl=dot_atom('Cl',TEAL,.75,[3,0,0]);el=Dot([-2,0,0],color=BLUE,radius=.12)
        self.play(FadeIn(na),FadeIn(cl),FadeIn(el),run_time=1.2)
        path=ArcBetweenPoints(el.get_center(),[2,0,0],angle=-PI/3,color=BLUE)
        self.play(Create(path),MoveAlongPath(el,path),run_time=3)
        nap=formula(r'\mathrm{Na}^{+}',40,GOLD).move_to(na);clm=formula(r'\mathrm{Cl}^{-}',40,TEAL).move_to(cl)
        self.play(FadeOut(na),FadeOut(cl),FadeOut(el),FadeOut(path),FadeIn(nap),FadeIn(clm),run_time=1.4)
        self.play(nap.animate.shift(RIGHT*.9),clm.animate.shift(LEFT*.9),run_time=2)
        attraction=text('motsatta joner attraherar',30,TEAL).move_to(DOWN*1.6)
        self.play(Write(attraction),run_time=1.5)
        self.wait(4)
        self.clear_stage()

        self.cue('Natrium har elva protoner. Efter att en elektron lämnat finns tio elektroner. Ett plus blir över. Kärnan har fortfarande elva protoner: atomslaget är natrium.')
        self.heading('Räkna laddningen -- följ samma kärna')
        core=dot_atom('Na',GOLD,.7,LEFT*3)
        before=formula(r'11(+)+11(-)=0',43).move_to([2.3,.7,0])
        after=formula(r'11(+)+10(-)=+1',43,TEAL).move_to([2.3,-.6,0])
        self.play(FadeIn(core),Write(before),run_time=2)
        self.play(Write(after),run_time=2)
        stable=text('11 protoner före och efter',31,GOLD).move_to(DOWN*1.9)
        self.play(Write(stable),Indicate(core,color=GOLD),run_time=1.6)
        self.wait(5)
        self.finish('Förklara både delning och överföring av elektroner. Vad ändras i bindningen, och vad finns kvar i atomkärnorna?')


class Forandringar(LabFilm):
    number=4
    topic='Kemisk eller fysikalisk förändring?'
    def construct(self):
        self.cue('Två förändringar kan se dramatiska ut men vara olika. Den avgörande frågan är: bildas nya ämnen?')
        self.heading('Samma fråga före och efter')
        before=RoundedRectangle(width=3.3,height=2.2,color=BLUE).move_to(LEFT*3.3)
        after=RoundedRectangle(width=3.3,height=2.2,color=TEAL).move_to(RIGHT*3.3)
        b=text('Före',34,BLUE).move_to(before);a=text('Efter',34,TEAL).move_to(after)
        ar=arrow(LEFT*1.3,RIGHT*1.3)
        self.play(Create(before),Create(after),Write(b),Write(a),GrowArrow(ar),run_time=2)
        q=text('Nytt ämne?',50,GOLD).move_to(DOWN*1.9)
        self.play(Write(q),run_time=1.5)
        self.play(Indicate(q,color=GOLD),run_time=1.6)
        self.wait(5)
        self.clear_stage()

        self.cue('När is smälter kan vattenmolekylerna röra sig förbi varandra. Molekylerna är fortfarande H två O. Ingen ny sorts molekyl har bildats.')
        self.heading('Is smälter: samma molekyler')
        mols=VGroup(*[molecule2d([x,y,0],.53,False) for x,y in [(-2,1),(0,1),(2,1),(-2,-.7),(0,-.7),(2,-.7)]])
        box=dashed_box(7,3.5,ORIGIN,BLUE)
        self.play(Create(box),LaggedStart(*[FadeIn(m) for m in mols],lag_ratio=.1),run_time=1.7)
        self.play(*[m.animate.shift(np.array([.22*(-1)**i,.10*(-1)**(i//2),0])) for i,m in enumerate(mols)],run_time=1.6,rate_func=there_and_back)
        destinations=[[-2.2,.6,0],[-.3,-.1,0],[1.7,.8,0],[-1.9,-.9,0],[.5,-1.1,0],[2.5,-.5,0]]
        self.play(*[m.animate.move_to(p) for m,p in zip(mols,destinations)],run_time=4)
        label=text('Fysikalisk förändring',34,BLUE).move_to(DOWN*2.2)
        self.play(Write(label),run_time=1.5)
        self.wait(3)
        self.clear_stage()

        self.cue('Vi vrider en vattenmolekyl i modellen. De två väteatomerna sitter kvar vid samma syreatom när vattnet byter tillstånd.')
        self.heading('Molekylens uppbyggnad finns kvar')
        m=molecule3d(ORIGIN,1.7)
        self.play(FadeIn(m),run_time=1)
        self.move_camera(phi=65*DEGREES,theta=-40*DEGREES,run_time=2)
        self.begin_ambient_camera_rotation(rate=.23);self.wait(6);self.stop_ambient_camera_rotation()
        self.move_camera(phi=0,theta=-90*DEGREES,run_time=1.5)
        h2o=formula(r'\mathrm{H}_2\mathrm{O}\longrightarrow\mathrm{H}_2\mathrm{O}',40).move_to(DOWN*1.8)
        self.play(Write(h2o),run_time=1.5)
        self.wait(2)
        self.clear_stage()

        self.cue('När järn rostar bildas järnföreningar med nya egenskaper. I ett förenklat räkneexempel följer vi järnoxiden Fe två O tre. Vatten behövs också vid vanlig rostbildning.')
        self.heading('Järn rostar: nya ämnen bildas')
        iron=VGroup(*[dot_atom('Fe',GOLD,.27,[-4+.8*(i%2),.6-1.2*(i//2),0]) for i in range(4)])
        oxygen=VGroup(*[dot_atom('O',CORAL,.22,[-.2+.65*(i%2),1.1-.8*(i//2),0]) for i in range(6)])
        o2bonds=VGroup(*[Line(oxygen[i].get_center(),oxygen[i+1].get_center(),color=CORAL,stroke_width=4) for i in range(0,6,2)])
        self.play(LaggedStart(*[FadeIn(x) for x in iron],lag_ratio=.1),LaggedStart(*[FadeIn(x) for x in oxygen],lag_ratio=.1),Create(o2bonds),run_time=1.8)
        self.play(FadeOut(o2bonds),run_time=.6)
        positions_fe=[[2,.7,0],[2,-.7,0],[4.6,.7,0],[4.6,-.7,0]]
        positions_o=[[1.4,0,0],[2.6,0,0],[2,1.4,0],[4,0,0],[5.2,0,0],[4.6,1.4,0]]
        self.play(*[x.animate.move_to(p) for x,p in zip(iron,positions_fe)],*[x.animate.move_to(p) for x,p in zip(oxygen,positions_o)],run_time=3)
        bonds=VGroup(*[Line(iron[j//3*2].get_center(),oxygen[j].get_center(),color=MUTED,stroke_width=2) for j in range(6)])
        self.play(Create(bonds),run_time=1.5)
        eq=formula(r'4\mathrm{Fe}+3\mathrm{O}_2\longrightarrow2\mathrm{Fe}_2\mathrm{O}_3',35).move_to(DOWN*1.7)
        self.play(Write(eq),run_time=2)
        note=text('Rost är mer sammansatt än denna räknebild.',22,MUTED).move_to(DOWN*2.35)
        self.play(FadeIn(note),run_time=.7)
        self.wait(3)
        self.clear_stage()

        self.cue('Räkna atomerna på båda sidor. Fyra järnatomer och sex syreatomer finns före och efter. Atomerna bevaras, men bindningarna och ämnena förändras.')
        self.heading('Nya bindningar -- samma atomantal')
        eq=formula(r'4\mathrm{Fe}+3\mathrm{O}_2\longrightarrow2\mathrm{Fe}_2\mathrm{O}_3',44).move_to(UP*.7)
        self.play(Write(eq),run_time=2)
        counts=VGroup(text('Före: 4 Fe och 6 O',32,GOLD),text('Efter: 4 Fe och 6 O',32,TEAL)).arrange(DOWN,buff=.55).move_to(DOWN*.7)
        self.play(Write(counts[0]),run_time=1.5)
        self.play(TransformFromCopy(counts[0],counts[1]),run_time=2)
        self.play(Circumscribe(eq,color=TEAL),run_time=2)
        self.wait(5)
        self.clear_stage()

        self.cue('Bubblor och färgändringar är ledtrådar. Kokande vatten bubblar ändå utan att bli ett nytt ämne. Förklara vilka ämnen som finns före och efter.')
        self.heading('En observation räcker inte ensam')
        pot=VGroup(Line([-3.5,-1,0],[-3.5,.8,0],color=BLUE),Line([-3.5,-1,0],[-.8,-1,0],color=BLUE),Line([-.8,-1,0],[-.8,.8,0],color=BLUE),Line([-3.5,.3,0],[-.8,.3,0],color=BLUE))
        bubbles=VGroup(*[Circle(radius=.09+.02*i,color=BLUE).move_to([-3+.45*i,-.7+.18*i,0]) for i in range(4)])
        label=text('vatten $\to$ vattenånga',28,BLUE).move_to([-2.2,-1.7,0])
        wood=Rectangle(width=2.5,height=.4,color=GOLD,fill_color=GOLD,fill_opacity=.3).move_to([3,-.8,0])
        flame=VGroup(*[Triangle(color=CORAL,fill_color=CORAL,fill_opacity=.25).scale(.35).move_to([2.4+.6*i,.05,0]) for i in range(3)])
        label2=text('ved + syre $\to$ nya ämnen',27,CORAL).move_to([3,-1.7,0])
        self.play(Create(pot),FadeIn(bubbles),Write(label),FadeIn(wood),FadeIn(flame),Write(label2),run_time=2)
        self.play(bubbles.animate.shift(UP*1.4).set_opacity(.1),flame.animate.stretch(1.25,1),run_time=3,rate_func=there_and_back)
        self.wait(4)
        self.finish('Sortera smältning, kokning, rost och förbränning. Motivera varje val med samma fråga: bildas nya ämnen?')


class Egenskaper(LabFilm):
    number=5
    topic='Olika ämnen har olika egenskaper'
    def construct(self):
        self.cue('Vilket material passar uppgiften? Vi börjar med egenskaper som går att undersöka: värmeledning, magnetism, löslighet och densitet.')
        self.heading('Från egenskap till ett bra materialval')
        words=['värmeledning','magnetism','löslighet','densitet']
        boxes=VGroup(*[RoundedRectangle(width=3.9,height=1,color=TEAL).move_to([(-1 if i%2==0 else 1)*2.5,1.1-(i//2)*1.8,0]) for i in range(4)])
        labels=VGroup(*[text(w,29).move_to(b) for w,b in zip(words,boxes)])
        self.play(LaggedStart(*[Create(b) for b in boxes],lag_ratio=.15),LaggedStart(*[Write(l) for l in labels],lag_ratio=.15),run_time=3)
        self.play(Indicate(boxes[0],color=GOLD),run_time=1.5)
        self.wait(5)
        self.clear_stage()

        self.cue('Kastrullens botten ska föra värme till maten. Handtaget ska överföra värme långsammare till handen. Olika delar har olika uppgifter.')
        self.heading('Samma föremål -- två uppgifter')
        pot=VGroup(Line([-2,-.8,0],[2,-.8,0],color=BLUE,stroke_width=8),Line([-2,-.8,0],[-2,1,0],color=BLUE,stroke_width=5),Line([2,-.8,0],[2,1,0],color=BLUE,stroke_width=5),Line([-2,1,0],[2,1,0],color=MUTED,stroke_width=2))
        handle=VGroup(Line([2,.5,0],[4,.5,0],color=GOLD,stroke_width=12),Line([2,-.05,0],[4,-.05,0],color=GOLD,stroke_width=12),Line([4,-.05,0],[4,.5,0],color=GOLD,stroke_width=12))
        heat=VGroup(*[arrow([x,-2,0],[x,-.9,0],CORAL) for x in [-1.5,0,1.5]])
        self.play(Create(pot),Create(handle),run_time=1.8)
        self.play(LaggedStart(*[GrowArrow(a) for a in heat],lag_ratio=.2),run_time=2)
        bottom=text('leda värme bra',29,BLUE).move_to([-3.3,-1.55,0]);hand=text('överföra värme långsamt',26,GOLD).move_to([3.7,1.4,0])
        self.play(Write(bottom),Write(hand),run_time=2)
        particles=VGroup(*[Dot([-.9+.6*i,-.5,0],color=CORAL,radius=.07) for i in range(4)])
        self.play(FadeIn(particles),run_time=.5)
        self.play(*[d.animate.shift(UP*.95) for d in particles],run_time=3,rate_func=there_and_back)
        self.wait(3)
        self.clear_stage()

        self.cue('Vi jämför lika långa materialbitar under samma villkor. Värme sprids snabbare genom koppar än genom trä. Pilarna visar en modell, inga exakta mätvärden.')
        self.heading('Jämför under samma villkor')
        copper=Rectangle(width=7,height=.55,color=CORAL,fill_color=CORAL,fill_opacity=.12).move_to([.3,.8,0])
        wood=Rectangle(width=7,height=.55,color=GOLD,fill_color=GOLD,fill_opacity=.12).move_to([.3,-.8,0])
        labels=VGroup(text('koppar',25,CORAL).next_to(copper,LEFT),text('trä',25,GOLD).next_to(wood,LEFT))
        self.play(Create(copper),Create(wood),Write(labels),run_time=1.8)
        dots1=VGroup(*[Dot([-3,.8,0],color=CORAL,radius=.08) for _ in range(5)])
        dots2=VGroup(*[Dot([-3,-.8,0],color=GOLD,radius=.08) for _ in range(5)])
        self.add(dots1,dots2)
        self.play(*[d.animate.move_to([-2+1.2*i,.8,0]) for i,d in enumerate(dots1)],*[d.animate.move_to([-2.8+.3*i,-.8,0]) for i,d in enumerate(dots2)],run_time=4)
        requirements=text('samma längd / samma start / samma uppvärmning',25,TEAL).move_to(DOWN*1.85)
        self.play(Write(requirements),run_time=1.8)
        self.wait(4)
        self.clear_stage()

        self.cue('Både järn och koppar leder elektricitet. Det testet skiljer inte dessa två åt. En vanlig magnet drar tydligt i järn, men inte i koppar.')
        self.heading('Välj ett test som visar en skillnad')
        fe=dot_atom('Fe',GOLD,.55,[-3.3,-.2,0]);cu=dot_atom('Cu',CORAL,.55,[3.3,-.2,0])
        self.play(FadeIn(fe),FadeIn(cu),run_time=1)
        elec=text('Båda leder elektricitet.',32,BLUE).move_to(UP*1.15)
        self.play(Write(elec),run_time=1.6)
        magnet=VGroup(Rectangle(width=.38,height=1.1,color=CORAL,fill_color=CORAL,fill_opacity=.7).move_to([-.3,0,0]),Rectangle(width=.38,height=1.1,color=BLUE,fill_color=BLUE,fill_opacity=.7).move_to([.3,0,0]),Arc(radius=.3,start_angle=PI,angle=PI,color=MUTED,stroke_width=12).shift(DOWN*.55))
        self.play(FadeIn(magnet),run_time=1)
        self.play(fe.animate.move_to([-1.1,-.2,0]),cu.animate.shift(RIGHT*.03),run_time=3)
        result=VGroup(text('järn dras till magneten',27,GOLD).move_to([-3,-1.6,0]),text('koppar dras inte tydligt',27,CORAL).move_to([3,-1.6,0]))
        self.play(Write(result),run_time=2)
        self.wait(4)
        self.clear_stage()

        self.cue('Densitet är massa per volym. Här har kuberna lika stor volym. Den kub som har större massa har högre densitet.')
        self.heading('Lika stor volym gör jämförelsen tydlig')
        cube1=Cube(side_length=1.45,fill_color=BLUE,fill_opacity=.6,stroke_width=1).move_to(LEFT*2.8)
        cube2=Cube(side_length=1.45,fill_color=GOLD,fill_opacity=.6,stroke_width=1).move_to(RIGHT*2.8)
        self.play(FadeIn(cube1),FadeIn(cube2),run_time=1)
        self.move_camera(phi=65*DEGREES,theta=-70*DEGREES,run_time=2)
        self.play(Rotate(cube1,angle=PI/3,axis=UP),Rotate(cube2,angle=PI/3,axis=UP),run_time=3)
        self.move_camera(phi=0,theta=-90*DEGREES,run_time=1.5)
        masses=VGroup(text('1 kg',34,BLUE).move_to([-2.8,-1.5,0]),text('3 kg',34,GOLD).move_to([2.8,-1.5,0]))
        self.play(Write(masses),run_time=1.4)
        eq=formula(r'\text{densitet}=\frac{\text{massa}}{\text{volym}}',33).move_to(DOWN*2.2)
        self.play(Write(eq),run_time=1.6)
        self.wait(3)
        self.clear_stage()

        self.cue('Ett handtag ska också tåla temperatur, hålla när vi lyfter och vara lätt att greppa. Ett materialval behöver ofta flera egenskaper samtidigt.')
        self.heading('Motivera valet i tre led')
        steps=VGroup(*[text(s,34,c) for s,c in [('uppgift',BLUE),('egenskap',GOLD),('följd',TEAL)]]).arrange(RIGHT,buff=1.1)
        self.play(LaggedStart(*[Write(s) for s in steps],lag_ratio=.25),run_time=2.4)
        arrows=VGroup(arrow(steps[0].get_right(),steps[1].get_left()),arrow(steps[1].get_right(),steps[2].get_left()))
        self.play(Create(arrows),run_time=1.1)
        answer=text(r'Botten ska värma maten.\quad Metallen leder värme bra.',28).move_to(DOWN*1.25)
        consequence=text('Därför kan värmen spridas till maten.',30,TEAL).move_to(DOWN*2)
        self.play(Write(answer),run_time=2)
        self.play(Write(consequence),run_time=1.8)
        self.wait(4)
        self.finish('Välj material till kastrullens botten och handtag. Koppla varje del till en egenskap och förklara varför egenskapen hjälper.')


class Faser(LabFilm):
    number=6
    topic='Värme, rörelse och fasförändringar'
    def construct(self):
        self.cue('Is, flytande vatten och vattenånga består av samma sorts molekyler. Vi följer samma sex vattenmolekyler genom alla tre tillstånden.')
        self.heading('Samma sex molekyler hela vägen')
        mols=VGroup(*[molecule2d([x,y,0],.55,False) for x,y in [(-2,1),(0,1),(2,1),(-2,-.7),(0,-.7),(2,-.7)]])
        self.play(LaggedStart(*[FadeIn(m) for m in mols],lag_ratio=.14),run_time=2)
        six=text('6 molekyler / varje molekyl är H$_2$O',34,GOLD).move_to(DOWN*2)
        self.play(Write(six),run_time=1.7)
        self.play(Indicate(mols[0],color=GOLD),run_time=1.5)
        self.wait(4)
        self.clear_stage()

        self.cue('I is vibrerar molekylerna kring bestämda platser i en öppen struktur. Molekylerna är inte helt stilla.')
        self.heading('Fast form: ordning och vibration')
        positions=[[-2.4,.9,0],[0,.9,0],[2.4,.9,0],[-1.2,-1.15,0],[1.2,-1.15,0],[3.6,-1.15,0]]
        mols=VGroup(*[molecule2d(p,.55,False) for p in positions])
        links=VGroup(*[DashedLine(mols[i].get_center(),mols[j].get_center(),color=BLUE,stroke_opacity=.4) for i,j in [(0,1),(1,2),(0,3),(1,3),(1,4),(2,4),(2,5)]])
        self.play(FadeIn(mols),Create(links),run_time=1.7)
        for _ in range(3):
            self.play(*[m.animate.shift([.08*(-1)**i,.06*(-1)**(i//2),0]) for i,m in enumerate(mols)],run_time=1,rate_func=there_and_back)
        l=text('Öppen struktur -- bestämda platser',30,BLUE).move_to(DOWN*2.25)
        self.play(Write(l),run_time=1.6)
        self.wait(3)
        self.clear_stage()

        self.cue('När isen smälter kan molekylerna röra sig förbi varandra. I flytande vatten ligger de tätare än i isens öppna struktur.')
        self.heading('Vätska: nära, men rörliga')
        start=[[-2.4,.9,0],[0,.9,0],[2.4,.9,0],[-1.2,-1.15,0],[1.2,-1.15,0],[3.6,-1.15,0]]
        end=[[-1.2,.7,0],[.1,.85,0],[1.4,.55,0],[-1.3,-.5,0],[0,-.55,0],[1.4,-.7,0]]
        mols=VGroup(*[molecule2d(p,.55,False) for p in start])
        self.play(FadeIn(mols),run_time=1)
        self.play(*[m.animate.move_to(p) for m,p in zip(mols,end)],run_time=3)
        self.play(mols[0].animate.move_to(end[1]),mols[1].animate.move_to(end[2]),mols[2].animate.move_to(end[5]),mols[5].animate.move_to(end[4]),mols[4].animate.move_to(end[3]),mols[3].animate.move_to(end[0]),run_time=4)
        label=text('Samma molekyler / nya grannar',31,TEAL).move_to(DOWN*2)
        self.play(Write(label),run_time=1.5)
        self.wait(3)
        self.clear_stage()

        self.cue('I vattenånga är avstånden mycket större. Molekylerna rör sig mellan kollisioner. Det är fortfarande H två O; molekylerna har inte blivit större eller delats.')
        self.heading('Gas: stora avstånd mellan molekyler')
        mols=VGroup(*[molecule2d(p,.55,False) for p in [[-1,.5,0],[0,.5,0],[1,.5,0],[-1,-.5,0],[0,-.5,0],[1,-.5,0]]])
        self.play(FadeIn(mols),run_time=1)
        dest=[[-4,1.4,0],[.3,1.8,0],[4.8,.7,0],[-4.8,-1.2,0],[-.7,-1.5,0],[3.5,-1.2,0]]
        self.play(*[m.animate.move_to(p) for m,p in zip(mols,dest)],run_time=3.5)
        self.play(*[m.animate.shift([.45*(-1)**i,.3*(-1)**(i//2),0]) for i,m in enumerate(mols)],run_time=3,rate_func=there_and_back)
        label=text('6 oförändrade H$_2$O-molekyler',31,GOLD).move_to(DOWN*2.2)
        self.play(Write(label),run_time=1.5)
        self.wait(3)
        self.clear_stage()

        self.cue('När vi tillför energi kan temperaturen stiga. Under en fasförändring kan energi gå till att ändra hur molekylerna hålls tillsammans. Kurvan visar ett förenklat exempel för rent vatten.')
        self.heading('Energi, temperatur och fasförändring')
        axes=Axes(x_range=[0,10,2],y_range=[0,5,1],x_length=9,y_length=3.6,axis_config={'include_tip':False,'color':MUTED}).shift(DOWN*.1)
        xlab=text('tillförd energi',25).next_to(axes,DOWN,buff=.25)
        ylab=text('temperatur',25).rotate(PI/2).next_to(axes,LEFT,buff=.25)
        points=[axes.c2p(0,.3),axes.c2p(2,1.2),axes.c2p(4,1.2),axes.c2p(6.5,3.3),axes.c2p(9,3.3),axes.c2p(10,4.5)]
        curve=VMobject(color=CORAL,stroke_width=4).set_points_as_corners(points)
        self.play(Create(axes),Write(xlab),Write(ylab),run_time=1.8)
        tracer=Dot(points[0],color=GOLD,radius=.08)
        self.add(tracer)
        self.play(Create(curve),MoveAlongPath(tracer,curve),run_time=5,rate_func=linear)
        melt=text('smältning',25,BLUE).move_to(axes.c2p(3,1.6))
        boil=text('kokning',25,TEAL).move_to(axes.c2p(7.8,3.75))
        self.play(Write(melt),Write(boil),run_time=1.6)
        self.wait(3)
        self.clear_stage()

        self.cue('Vattenånga är osynlig. Det vita molnet ovanför en kastrull består av små vattendroppar. När gas blir vätska kallas det kondensation.')
        self.heading('Kondensation: gas blir vätska')
        mol=molecule3d(LEFT*2.8,1.3)
        droplets=VGroup(*[Circle(radius=.07+.015*(i%3),color=BLUE,fill_color=BLUE,fill_opacity=.3).move_to([2+(i%5)*.4,-.8+(i//5)*.4,0]) for i in range(20)])
        self.play(FadeIn(mol),run_time=1)
        self.move_camera(phi=55*DEGREES,theta=-70*DEGREES,run_time=1.8)
        self.play(Rotate(mol,angle=PI/2,axis=UP),run_time=2)
        self.move_camera(phi=0,theta=-90*DEGREES,run_time=1.2)
        self.play(LaggedStart(*[FadeIn(d) for d in droplets],lag_ratio=.05),run_time=2)
        labels=VGroup(text('osynlig gas',27,BLUE).move_to([-2.8,-1.8,0]),text('små vätskedroppar',27,TEAL).move_to([2.8,-1.8,0]))
        self.play(Write(labels),run_time=1.8)
        self.wait(4)
        self.finish('Beskriv hur placering, avstånd och rörelse förändras mellan is, vatten och vattenånga. Vad är oförändrat i varje molekyl?')


class Miljo(LabFilm):
    number=7
    topic='Varför strävar vi efter en giftfri miljö?'
    def construct(self):
        self.cue('Ett skadat batteri ligger vid en bäck. Om det börjar läcka kan ämnen spridas med vatten. Vi följer ett möjligt förlopp, inte en exakt mätning.')
        self.heading('Följ en möjlig spridningsväg')
        land=Line(LEFT*6+DOWN*.8,RIGHT*6+DOWN*.8,color=TEAL,stroke_width=3)
        stream=smooth_path([[-6,-1.3,0],[-3,-1.05,0],[0,-1.6,0],[3,-1.1,0],[6,-1.5,0]],BLUE,12)
        battery=VGroup(RoundedRectangle(width=1.5,height=.8,corner_radius=.1,color=GOLD,fill_color=GOLD,fill_opacity=.2),Rectangle(width=.12,height=.3,color=GOLD).shift(RIGHT*.8),formula('+',25,GOLD).shift(RIGHT*.45)).move_to([-3,.2,0]).rotate(-.15)
        self.play(Create(land),Create(stream),FadeIn(battery),run_time=2)
        rain=VGroup(*[Line([x,1.7+.2*(i%2),0],[x-.1,1.2+.2*(i%2),0],color=BLUE,stroke_width=2) for i,x in enumerate(np.linspace(-4.8,0,10))])
        self.play(LaggedStart(*[Create(r) for r in rain],lag_ratio=.07),run_time=2)
        self.play(rain.animate.shift(DOWN*1.6).set_opacity(.1),run_time=2)
        leak=VGroup(*[Dot([-2.8+.13*i,-.2,0],color=VIOLET,radius=.055) for i in range(7)])
        self.play(FadeIn(leak),run_time=.6)
        self.play(*[d.animate.move_to([-2+.5*i,-1.35,0]) for i,d in enumerate(leak)],run_time=3)
        self.wait(2)
        self.clear_stage()

        self.cue('Börja med källan. Ämnen kan sedan följa mark och rinnande vatten till bäcken. Det är spridningsvägen som förklarar hur en organism kan nås.')
        self.heading(r'Källa $\longrightarrow$ spridningsväg')
        boxes=VGroup(*[RoundedRectangle(width=3,height=1.3,color=c,fill_color=c,fill_opacity=.06).move_to([x,0,0]) for x,c in [(-4.3,GOLD),(0,BLUE),(4.3,TEAL)]])
        labels=VGroup(*[text(s,28,c).move_to(b) for s,c,b in zip(['skadat batteri','mark och vatten','bäck'],[GOLD,BLUE,TEAL],boxes)])
        self.play(LaggedStart(*[Create(b) for b in boxes],lag_ratio=.15),Write(labels),run_time=2.3)
        arrows=VGroup(arrow(boxes[0].get_right(),boxes[1].get_left(),BLUE),arrow(boxes[1].get_right(),boxes[2].get_left(),BLUE))
        self.play(Create(arrows),run_time=1.3)
        dots=VGroup(*[Dot([-4.3+.12*i,0,0],color=VIOLET,radius=.055) for i in range(5)])
        self.add(dots)
        self.play(dots.animate.shift(RIGHT*8.6),run_time=5,rate_func=linear)
        self.wait(3)
        self.clear_stage()

        self.cue('Djur och växter kan komma i kontakt med ämnen genom vatten eller föda. Den kontakten kallas exponering. Här visar prickarna ett tänkt ämne i en modell.')
        self.heading('Kontakt med ämnet kallas exponering')
        water=RoundedRectangle(width=4.5,height=2.5,color=BLUE,fill_color=BLUE,fill_opacity=.07).move_to(LEFT*3.3)
        organism=VGroup(Ellipse(width=2,height=.9,color=TEAL,fill_color=TEAL,fill_opacity=.2),Triangle(color=TEAL,fill_color=TEAL,fill_opacity=.2).scale(.45).rotate(-PI/2).shift(LEFT*1.1),Dot([.6,.1,0],color=INK,radius=.04)).move_to(RIGHT*3.4)
        particles=VGroup(*[Dot([-4.7+.5*(i%4),.6-.6*(i//4),0],color=VIOLET,radius=.06) for i in range(12)])
        self.play(Create(water),FadeIn(organism),FadeIn(particles),run_time=1.7)
        a=arrow([-1,0,0],[1.8,0,0],VIOLET)
        self.play(GrowArrow(a),run_time=1)
        self.play(*[p.animate.move_to([3.1+.15*(i%3),.2-.15*(i//3),0]) for i,p in enumerate(particles[:6])],run_time=3.5)
        label=text(r'vatten eller föda $\longrightarrow$ organism',29,TEAL).move_to(DOWN*1.9)
        self.play(Write(label),run_time=1.7)
        self.wait(4)
        self.clear_stage()

        self.cue('I en näringskedja kan vissa svårnedbrytbara ämnen föras vidare med födan. För några ämnen kan halten öka uppåt i kedjan. Det gäller inte alla ämnen.')
        self.heading('Ett illustrativt exempel -- inte alla ämnen')
        names=['små organismer','småfisk','rovfisk']
        groups=VGroup()
        for i,(x,name,n) in enumerate(zip([-4.4,0,4.4],names,[2,4,8])):
            circle=Circle(radius=.85,color=TEAL,fill_color=TEAL,fill_opacity=.08).move_to([x,0,0])
            lab=text(name,25).move_to([x,-1.35,0])
            dots=VGroup(*[Dot([x+(.22*(j%3)-.22),.3-.22*(j//3),0],radius=.05,color=VIOLET) for j in range(n)])
            groups.add(VGroup(circle,lab,dots))
        self.play(LaggedStart(*[FadeIn(g) for g in groups],lag_ratio=.25),run_time=2.5)
        arrows=VGroup(arrow([-3.3,0,0],[-1.1,0,0],VIOLET),arrow([1.1,0,0],[3.3,0,0],VIOLET))
        self.play(LaggedStart(*[GrowArrow(a) for a in arrows],lag_ratio=.3),run_time=2)
        note=text('Prickarna visar principen, inte uppmätta halter.',23,MUTED).move_to(DOWN*2.15)
        self.play(Write(note),run_time=1.5)
        self.wait(5)
        self.clear_stage()

        self.cue('Risken beror bland annat på vilket ämne det är, mängden och hur organismen utsätts. En kemisk modell hjälper oss att ställa frågor, inte att gissa en exakt skada.')
        self.heading('Ämne, mängd och exponering spelar roll')
        molecule=VGroup(sphere_atom(VIOLET,.45,[-.5,0,0]),sphere_atom(VIOLET,.45,[.5,0,0]),sphere_atom(VIOLET,.45,[0,.6,0]),Line3D([-.5,0,0],[.5,0,0],thickness=.08,color=VIOLET),Line3D([0,.6,0],[.5,0,0],thickness=.08,color=VIOLET))
        unknown=text('schematisk, okänd partikel',25,VIOLET).move_to(DOWN*1.9)
        self.add_fixed_in_frame_mobjects(unknown)
        self.play(FadeIn(molecule),run_time=1)
        self.move_camera(phi=60*DEGREES,theta=-60*DEGREES,run_time=2)
        self.begin_ambient_camera_rotation(rate=.22);self.wait(4);self.stop_ambient_camera_rotation()
        self.move_camera(phi=0,theta=-90*DEGREES,run_time=1.5)
        self.play(FadeOut(molecule),run_time=.6)
        items=VGroup(text('vilket ämne?',34,VIOLET),text('hur stor mängd?',34,GOLD),text('vilken kontakt?',34,BLUE)).arrange(DOWN,buff=.45)
        self.play(LaggedStart(*[Write(i) for i in items],lag_ratio=.25),run_time=2.2)
        self.wait(3)
        self.clear_stage()

        self.cue('En åtgärd kan bryta spridningsvägen. Lämna batteriet till batteriinsamling. Då kan ämnen och material hanteras innan de sprids i naturen.')
        self.heading('Bryt kedjan innan ämnen sprids')
        battery=VGroup(RoundedRectangle(width=1.6,height=.85,color=GOLD,fill_color=GOLD,fill_opacity=.2),formula('+',27,GOLD).shift(RIGHT*.5)).move_to(LEFT*4)
        bin=VGroup(Rectangle(width=2,height=2.2,color=TEAL,fill_color=TEAL,fill_opacity=.07),Line([-1.2,1.2,0],[1.2,1.2,0],color=TEAL,stroke_width=5),text('insamling',24,TEAL).shift(DOWN*.25)).move_to(RIGHT*3)
        bad=arrow([-2.8,-1.5,0],[4,-1.5,0],VIOLET)
        cross=VGroup(Line([-.3,-1.9,0],[.3,-1.1,0],color=CORAL,stroke_width=5),Line([-.3,-1.1,0],[.3,-1.9,0],color=CORAL,stroke_width=5))
        self.play(FadeIn(battery),Create(bin),GrowArrow(bad),run_time=1.8)
        self.play(Create(cross),run_time=1)
        route=ArcBetweenPoints(battery.get_center(),bin.get_center()+UP*.3,angle=-PI/3,color=TEAL)
        self.play(MoveAlongPath(battery,route),run_time=3.3)
        self.play(battery.animate.scale(.5).shift(DOWN*.5),run_time=1.2)
        self.wait(4)
        self.finish('Förklara en möjlig kedja: källa, spridningsväg, organism och möjlig följd. Lägg sedan till en åtgärd och förklara hur den hjälper.')
