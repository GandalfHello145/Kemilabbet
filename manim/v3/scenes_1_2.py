"""Original chemistry films 1–2: identity-preserving visual explanations.

Abstract visual inspiration: 3Blue1Brown's persistent colour/identity links,
updater-linked arrows and camera reframing (public optics/e_field.py), plus
the concrete-example-to-general-rule approach in Essence of Calculus.
No 3Blue1Brown scene code or assets are copied here.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from core import *


def badge(words, color=TEAL, size=27, width=None):
    label = tex(words, size, color, width=width)
    box = RoundedRectangle(width=label.width+.42, height=label.height+.28,
                           corner_radius=.10, stroke_color=color,
                           stroke_opacity=.5, fill_color=color, fill_opacity=.08)
    return VGroup(box, label)


def glow_ring(mob, color=GOLD, buff=.12):
    return Circle(radius=max(mob.width, mob.height)/2+buff,
                  color=color, stroke_width=2.5).move_to(mob)


def water(pos=ORIGIN, scale=1, labels=True):
    o = dot_atom('O' if labels else '', OXYGEN, .36, [.0,.22,0])
    h1 = dot_atom('H' if labels else '', HYDROGEN, .25, [-.57,-.22,0])
    h2 = dot_atom('H' if labels else '', HYDROGEN, .25, [.57,-.22,0])
    bonds = VGroup(Line(o.get_center(),h1.get_center(),color=TEAL,stroke_width=5),
                   Line(o.get_center(),h2.get_center(),color=TEAL,stroke_width=5))
    group = VGroup(bonds,o,h1,h2).scale(scale).move_to(pos)
    group.atoms = VGroup(o,h1,h2)
    return group


def oxygen(pos=ORIGIN, scale=1):
    a=dot_atom('O',OXYGEN,.35,[-.45,0,0])
    b=dot_atom('O',OXYGEN,.35,[.45,0,0])
    bonds=VGroup(Line(a.get_center()+UP*.065,b.get_center()+UP*.065,color=TEAL,stroke_width=3),
                  Line(a.get_center()+DOWN*.065,b.get_center()+DOWN*.065,color=TEAL,stroke_width=3))
    group=VGroup(bonds,a,b).scale(scale).move_to(pos)
    group.atoms=VGroup(a,b)
    return group


def wave_path(start,end,amp=.13,waves=5,color=GOLD):
    a=np.array(start,dtype=float);b=np.array(end,dtype=float)
    direction=b-a;normal=np.array([-direction[1],direction[0],0.])
    normal=normal/max(np.linalg.norm(normal),.001)
    return ParametricFunction(lambda t:a+t*direction+normal*amp*np.sin(TAU*waves*t),
                              t_range=[0,1],color=color,stroke_width=3)


def loop_motion(scene, mobs, centers, seconds, amplitude=.1):
    starts=[m.get_center().copy() for m in mobs]
    scene.play(*[UpdateFromAlphaFunc(m,lambda obj,a,i=i:
        obj.move_to(starts[i]+amplitude*np.array([np.sin(TAU*a+i),
                                                np.sin(2*TAU*a+i*.7),0.])))
                 for i,m in enumerate(mobs)],run_time=seconds,rate_func=linear)


class AtomMaster(MasterFilm):
    number=1
    topic='Atomer och molekyler'
    slug='01-atomer'

    def construct(self):
        with self.beat('Vad finns i en vattendroppe?',
            'Vattnet går att se och hälla. Men en enda droppe innehåller ofattbart många molekyler. Vi följer en markerad byggsten in i en förstorad modell.',16,clear=True):
            vessel=VGroup(Line([-5.9,1.4,0],[-5.9,-1.6,0]),
                          Arc(radius=1.5,start_angle=PI,angle=PI).move_to([-4.4,-1.6,0]),
                          Line([-2.9,-1.6,0],[-2.9,1.4,0])).set_color(BLUE)
            liquid=Rectangle(width=2.8,height=1.9,stroke_width=0,fill_color=BLUE,fill_opacity=.12).move_to([-4.4,-.65,0])
            dots=VGroup(*[Dot([-5.6+(i%7)*.4,-1.3+(i//7)*.4,0],radius=.045,color=BLUE) for i in range(35)])
            self.play(Create(vessel),FadeIn(liquid),LaggedStart(*[FadeIn(d) for d in dots],lag_ratio=.02),run_time=2.3)
            target=dots[17];ring=Circle(radius=.18,color=GOLD).move_to(target)
            self.play(Create(ring),Flash(target,color=GOLD),run_time=1.2)
            zoom=VGroup(*[Circle(radius=r,color=GOLD,stroke_opacity=.3) for r in [.35,.55,.75]]).move_to([2.5,0,0])
            bridge=DashedLine(target.get_center(),[2,0,0],color=GOLD)
            self.play(Create(bridge),ReplacementTransform(ring,zoom),run_time=2.5)
            molecule=water([2.5,0,0],1.8)
            self.play(FadeOut(zoom),GrowFromCenter(molecule),run_time=2.2)
            self.play(ShowPassingFlash(bridge.copy().set_stroke(GOLD,7),time_width=.2),run_time=2)
            loop_motion(self,[molecule],[molecule.get_center()],4,.12)

        with self.beat('Bokstaven visar vilken sorts atom',
            'En atom är en byggsten. Atomslag betyder sorten. H står för väte och O för syre. Färgerna är modellens hjälpmedel; bokstaven berättar vilken sort vi menar.',16,clear=True):
            atoms=VGroup(*[dot_atom('H' if i<4 else 'O',HYDROGEN if i<4 else OXYGEN,
                                   .40 if i<4 else .55,[-5.5+i*2.15,.6,0]) for i in range(6)])
            self.play(LaggedStart(*[GrowFromCenter(a) for a in atoms],lag_ratio=.15),run_time=2.5)
            hbox=RoundedRectangle(width=4.9,height=2.7,color=BLUE,fill_color=BLUE,fill_opacity=.04).move_to([-3.3,-.1,0])
            obox=RoundedRectangle(width=4.9,height=2.7,color=CORAL,fill_color=CORAL,fill_opacity=.04).move_to([3.3,-.1,0])
            self.play(Create(hbox),Create(obox),run_time=1.4)
            positions=[[-4.2,.2,0],[-2.5,.2,0],[-4.2,-.8,0],[-2.5,-.8,0],[2.3,.1,0],[4.0,.1,0]]
            self.play(*[a.animate.move_to(p) for a,p in zip(atoms,positions)],run_time=3,path_arc=PI/3)
            labels=VGroup(tex('väte: ett atomslag',31,BLUE).move_to([-3.3,1.75,0]),
                          tex('syre: ett annat atomslag',31,CORAL).move_to([3.3,1.75,0]))
            self.play(Write(labels),run_time=2)
            self.play(Indicate(atoms[0],color=BLUE),Indicate(atoms[-1],color=CORAL),run_time=1.6)
            count=badge('6 atomer, men bara 2 atomslag',GOLD,32).move_to([0,-2.1,0])
            self.play(FadeIn(count,shift=UP*.2),run_time=1.2)
            self.play(*[Indicate(a,scale_factor=1.08) for a in atoms],run_time=2)

        with self.beat('Tre atomer binds ihop till en molekyl',
            'Två väteatomer och en syreatom binds ihop till en vattenmolekyl. En molekyl är två eller flera atomer som sitter ihop med kemiska bindningar.',16,clear=True):
            h1=dot_atom('H',BLUE,.55,[-5,-.7,0]);h2=dot_atom('H',BLUE,.55,[5,-.7,0]);o=dot_atom('O',CORAL,.73,[0,1.6,0])
            self.play(GrowFromCenter(h1),GrowFromCenter(o),GrowFromCenter(h2),run_time=1.6)
            paths=[ArcBetweenPoints(h1.get_center(),[-1.15,-.6,0],angle=-PI/3),
                   ArcBetweenPoints(h2.get_center(),[1.15,-.6,0],angle=PI/3),
                   ArcBetweenPoints(o.get_center(),[0,.6,0],angle=.4)]
            traces=VGroup(*[TracedPath(a.get_center,stroke_color=c,stroke_width=2,dissipating_time=1.3)
                            for a,c in [(h1,BLUE),(h2,BLUE),(o,CORAL)]])
            self.add(traces)
            self.play(*[MoveAlongPath(a,p) for a,p in zip([h1,h2,o],paths)],run_time=3.4,rate_func=smooth)
            bonds=VGroup(Line(o.get_center(),h1.get_center(),buff=.62,color=TEAL,stroke_width=7),
                         Line(o.get_center(),h2.get_center(),buff=.62,color=TEAL,stroke_width=7))
            self.play(Create(bonds),run_time=1.5)
            formula_label=formula(r'\mathrm{H}_2\mathrm{O}',64).move_to([0,-2,0])
            self.play(Write(formula_label),run_time=1.8)
            molecule=VGroup(bonds,o,h1,h2)
            self.play(Rotate(molecule,angle=.18,about_point=[0,0,0]),run_time=2,rate_func=there_and_back)
            captions=VGroup(tex('atomer',29,BLUE).move_to([-4.5,.2,0]),tex('bindningar',29,TEAL).move_to([4.5,.2,0]))
            pointers=VGroup(arrow([-3.7,.2,0],h1.get_center(),BLUE),arrow([3.4,.2,0],[.55,0,0],TEAL))
            self.play(FadeIn(captions),GrowArrow(pointers[0]),GrowArrow(pointers[1]),run_time=2)
            self.play(Indicate(bonds,color=TEAL),run_time=1.5)

        with self.beat('Räkna atomer och atomslag var för sig',
            'Vi räknar först alla byggstenar: en, två, tre atomer. Sedan räknar vi sorterna: väte och syre, alltså två atomslag. Tre atomer betyder inte tre atomslag.',16,clear=True):
            mol=water([0,.4,0],2.2);self.play(FadeIn(mol),run_time=1)
            tally=VGroup(*[badge(str(i),GOLD,32).move_to([-3+i*1.5,-1.7,0]) for i in range(1,4)])
            for atom,t in zip(mol.atoms,tally):
                self.play(Create(glow_ring(atom,GOLD)),TransformFromCopy(atom,t),run_time=1.2)
            total=tex('3 atomer',42,GOLD).move_to([3.8,-1.7,0])
            self.play(Write(total),run_time=1.3)
            hs=VGroup(mol[2].copy(),mol[3].copy()).arrange(RIGHT,buff=.15).move_to([-3.7,.4,0])
            os=mol[1].copy().move_to([3.7,.4,0])
            self.play(TransformFromCopy(VGroup(mol[2],mol[3]),hs),TransformFromCopy(mol[1],os),run_time=2.4,path_arc=PI/3)
            family_labels=VGroup(tex('H: väte',30,BLUE).next_to(hs,DOWN,buff=.25),tex('O: syre',30,CORAL).next_to(os,DOWN,buff=.25))
            self.play(Write(family_labels),run_time=1.6)
            answer=badge('2 atomslag',TEAL,37).move_to([0,-2.5,0])
            self.play(FadeIn(answer),Indicate(hs,color=BLUE),Indicate(os,color=CORAL),run_time=2.1)
            self.play(Indicate(total),Indicate(answer),run_time=2)

        with self.beat('Den lilla tvåan hör till H',
            'Formeln är en kort beskrivning av bilden. Tvåan efter H betyder två väteatomer i varje molekyl. När O saknar en liten siffra betyder det en syreatom.',14,clear=True):
            mol=water([-3.8,.2,0],1.8)
            f=MathTex(r'\mathrm{H}',r'_2',r'\mathrm{O}',tex_template=TEMPLATE,font_size=95).move_to([2.4,.4,0])
            f[0].set_color(BLUE);f[1].set_color(BLUE);f[2].set_color(CORAL)
            self.play(FadeIn(mol),run_time=1)
            self.play(TransformFromCopy(VGroup(mol[2],mol[3]),f[0]),run_time=2)
            self.play(Write(f[1]),Flash(f[1].get_center(),color=GOLD),run_time=1.8)
            self.play(TransformFromCopy(mol[1],f[2]),run_time=2)
            links=VGroup(arrow([-1.9,-1.5,0],f[1].get_bottom(),BLUE),arrow([5,-1.5,0],f[2].get_bottom(),CORAL))
            labels=VGroup(tex('två H',32,BLUE).move_to([-2.2,-2,0]),tex('en O',32,CORAL).move_to([5,-2,0]))
            self.play(GrowArrow(links[0]),GrowArrow(links[1]),Write(labels),run_time=2)
            self.play(Indicate(f[1],scale_factor=1.25),Indicate(mol[2]),Indicate(mol[3]),run_time=2.6)
            self.play(Indicate(f[2],color=CORAL),run_time=1.2)

        with self.beat('Siffran framför räknar hela molekyler',
            'En stor siffra framför formeln gäller hela molekylen. Tre H2O betyder tre vattenmolekyler. Varje molekyl har två H och en O: tillsammans sex H och tre O.',18,clear=True):
            base=water([0,.65,0],1.55)
            count_formula=formula(r'\mathrm{H}_2\mathrm{O}',49).move_to([0,-1.1,0])
            self.play(FadeIn(base),Write(count_formula),run_time=1.5)
            pair=VGroup(base.copy(),base.copy()).arrange(RIGHT,buff=1.7).move_to([0,.65,0])
            self.play(ReplacementTransform(base,pair),run_time=2.3,path_arc=PI/2)
            pair_formula=formula(r'2\mathrm{H}_2\mathrm{O}',49,GOLD).move_to([0,-1.1,0])
            self.play(TransformMatchingTex(count_formula,pair_formula),run_time=1.4)
            trio=VGroup(*[water([x,.65,0],1.25) for x in [-4.3,0,4.3]])
            self.play(ReplacementTransform(pair,trio),run_time=2.6,path_arc=PI/3)
            f=formula(r'3\mathrm{H}_2\mathrm{O}',57,GOLD).move_to([0,-1.1,0])
            self.play(TransformMatchingTex(pair_formula,f),run_time=1.6)
            boxes=VGroup(*[SurroundingRectangle(m,buff=.3,color=GOLD,corner_radius=.1) for m in trio])
            self.play(LaggedStart(*[Create(b) for b in boxes],lag_ratio=.2),run_time=2)
            totals=VGroup(formula(r'3\cdot2=6\ \mathrm{H}',38,BLUE),formula(r'3\cdot1=3\ \mathrm{O}',38,CORAL)).arrange(RIGHT,buff=2).move_to([0,-2.3,0])
            self.play(Write(totals),run_time=2)
            self.play(*[Indicate(m[2],color=BLUE) for m in trio],run_time=1.1)
            self.play(*[Indicate(m[1],color=CORAL) for m in trio],run_time=1.1)

        with self.beat('En molekyl behöver inte vara en förening',
            'O2 är en molekyl med två bundna syreatomer. Syrgas är ett grundämne: bara ett atomslag. H2O är också en molekyl, men vatten är en kemisk förening eftersom två grundämnen är bundna.',20,clear=True):
            left=oxygen([-3.8,.3,0],2);right=water([3.8,.3,0],2)
            divider=Line([0,-2.5,0],[0,2.4,0],color=MUTED,stroke_opacity=.3)
            self.play(Create(divider),FadeIn(left,shift=RIGHT*.4),FadeIn(right,shift=LEFT*.4),run_time=2.1)
            fs=VGroup(formula(r'\mathrm{O}_2',50,CORAL).move_to([-3.8,1.9,0]),formula(r'\mathrm{H}_2\mathrm{O}',50).move_to([3.8,1.9,0]))
            self.play(Write(fs),run_time=1.7)
            counts=VGroup(tex('2 atomer, 1 atomslag',31,CORAL).move_to([-3.8,-1.25,0]),tex('3 atomer, 2 atomslag',31,TEAL).move_to([3.8,-1.25,0]))
            self.play(Indicate(left[1]),Indicate(left[2]),Write(counts[0]),run_time=2.6)
            self.play(*[Indicate(a) for a in right.atoms],Write(counts[1]),run_time=2.6)
            labels=VGroup(badge('grundämne',CORAL,32).move_to([-3.8,-2.2,0]),badge('kemisk förening',TEAL,32).move_to([3.8,-2.2,0]))
            self.play(FadeIn(labels[0]),run_time=1.4)
            self.play(FadeIn(labels[1]),run_time=1.4)
            self.play(ShowPassingFlash(left[0].copy().set_stroke(GOLD,7),time_width=.4),ShowPassingFlash(right[0].copy().set_stroke(GOLD,7),time_width=.4),run_time=2.4)
            shared=tex('Båda är molekyler.',35,GOLD).move_to([0,2.5,0])
            self.play(Write(shared),run_time=1.4)
            loop_motion(self,[left,right],[left.get_center(),right.get_center()],2.4,.08)

        with self.beat('Flera ämnen tillsammans blir en blandning',
            'I en blandning finns flera ämnen tillsammans. Vattenmolekyler och syrgasmolekyler kan finnas i samma prov utan att de byter bindningar. Vi följer samma molekyler när vi sorterar bilden.',18,clear=True):
            molecules=VGroup(water([-4.5,1,0],1),oxygen([-1.5,.9,0],1),water([1.6,1.1,0],1),oxygen([4.7,.9,0],1),water([-3,-1,0],1),oxygen([0,-1,0],1),water([3,-1,0],1))
            boundary=RoundedRectangle(width=13.7,height=4.8,corner_radius=.18,color=MUTED,stroke_opacity=.3)
            self.play(Create(boundary),LaggedStart(*[FadeIn(m) for m in molecules],lag_ratio=.12),run_time=2.6)
            loop_motion(self,molecules,[m.get_center() for m in molecules],4,.28)
            self.play(boundary.animate.set_stroke(opacity=.1),run_time=.6)
            positions=[[-4.7,1,0],[3,1,0],[-2.7,1,0],[5,1,0],[-4.7,-.8,0],[4,-.8,0],[-2.7,-.8,0]]
            self.play(*[m.animate.move_to(p) for m,p in zip(molecules,positions)],run_time=3.3,path_arc=PI/4)
            boxes=VGroup(RoundedRectangle(width=5.7,height=3.8,color=BLUE).move_to([-3.7,.1,0]),RoundedRectangle(width=5.7,height=3.8,color=CORAL).move_to([3.7,.1,0]))
            labels=VGroup(tex('vatten',31,BLUE).move_to([-3.7,-2.2,0]),tex('syrgas',31,CORAL).move_to([3.7,-2.2,0]))
            self.play(Create(boxes),Write(labels),run_time=2)
            self.play(*[Indicate(m[0],color=GOLD) for m in molecules],run_time=2.1)
            self.play(Write(badge('Två ämnen. Inga nya bindningar.',GOLD,28).move_to([0,2.5,0])),run_time=1.6)

        with self.beat('Ett rent ämne kan innehålla två atomslag',
            'Rent vatten är ett ämne, trots att varje molekyl innehåller både väte och syre. Frågan antal ämnen är därför inte samma fråga som antal atomslag.',16,clear=True):
            sample=VGroup(*[water([x,y,0],.85,False) for x in [-4,-1.3,1.3,4] for y in [-.6,1.1]])
            box=RoundedRectangle(width=12.8,height=3.7,color=BLUE,fill_color=BLUE,fill_opacity=.025)
            self.play(Create(box),LaggedStart(*[GrowFromCenter(m) for m in sample],lag_ratio=.09),run_time=2.2)
            focus=SurroundingRectangle(sample[3],color=GOLD,buff=.16)
            self.play(Create(focus),run_time=1)
            self.play(*[Indicate(m,color=BLUE,scale_factor=1.08) for m in sample],run_time=2.4)
            title=badge('Samma sorts molekyl överallt',TEAL,32).move_to([0,2.4,0])
            self.play(FadeIn(title),run_time=1.2)
            self.move_camera(zoom=1.18,frame_center=[-.4,.1,0],run_time=3)
            self.move_camera(zoom=1,frame_center=ORIGIN,run_time=2.6)
            result=tex(r'1 ämne\qquad 2 atomslag',38,GOLD).move_to([0,-2.4,0])
            self.play(Write(result),run_time=2)

        with self.beat('Samma modell kan vridas i tre dimensioner',
            'Den platta ritningen och den tredimensionella modellen visar samma vattenmolekyl. Färger och kulor hjälper oss att tänka. De hjälper oss att visa hur atomerna sitter ihop.',18,clear=True):
            mol=molecule3d(ORIGIN,2.2)
            self.play(FadeIn(mol,scale=.6),run_time=1.8)
            self.move_camera(phi=62*DEGREES,theta=-55*DEGREES,zoom=1.05,run_time=3)
            self.begin_ambient_camera_rotation(rate=.19)
            self.wait(6)
            self.stop_ambient_camera_rotation()
            self.move_camera(phi=0,theta=-90*DEGREES,zoom=1,run_time=2.7)
            label=badge('Modell: färger och storlekar är valda',GOLD,28).move_to([0,-2.2,0])
            self.play(FadeIn(label),run_time=1.2)
            self.play(Rotate(mol,angle=PI/2,axis=UP),run_time=2.2)

        with self.beat('Vattenmolekylerna byter inte identitet',
            'Is, flytande vatten och vattenånga består av samma sorts vattenmolekyler. När tillståndet ändras förändras bland annat rörelser och avstånd. Molekylerna blir inte större när vattnet värms.',16,clear=True):
            positions=[[-3,1,0],[0,1,0],[3,1,0],[-3,-.8,0],[0,-.8,0],[3,-.8,0]]
            six=VGroup(*[water(p,.9,False) for p in positions])
            phase=badge('fast form',BLUE,31).move_to([-5.8,2.4,0])
            self.play(FadeIn(six),FadeIn(phase),run_time=1.4)
            loop_motion(self,six,positions,3,.035)
            liquid=[[-2.5,.7,0],[-.1,1,0],[2.4,.7,0],[-2.1,-.8,0],[.3,-.7,0],[2.8,-.7,0]]
            self.play(*[m.animate.move_to(p) for m,p in zip(six,liquid)],Transform(phase,badge('flytande form',TEAL,31).move_to(phase)),run_time=2.6)
            loop_motion(self,six,liquid,3,.22)
            gas=[[-5,1.5,0],[.2,1.9,0],[5,1.2,0],[-4.6,-1.4,0],[0,-.7,0],[5.2,-1.5,0]]
            self.play(*[m.animate.move_to(p) for m,p in zip(six,gas)],Transform(phase,badge('gasform',GOLD,31).move_to(phase)),run_time=3)
            self.play(*[Indicate(m,scale_factor=1.04) for m in six],run_time=2)

        with self.beat('Samma atomer kan få nya grannar',
            'I en vanlig kemisk reaktion omordnas atomer. Här följer vi fyra väteatomer och två syreatomer. Antalet av varje atomslag är lika stort före och efter. Bilden är ingen laborationsinstruktion.',18,clear=True):
            h=[dot_atom('H',BLUE,.35,p) for p in [[-5,1,0],[-4,1,0],[-2,1,0],[-1,1,0]]]
            o=[dot_atom('O',CORAL,.5,p) for p in [[2.7,1,0],[4,1,0]]]
            old=VGroup(Line(h[0].get_center(),h[1].get_center(),color=TEAL),Line(h[2].get_center(),h[3].get_center(),color=TEAL),Line(o[0].get_center(),o[1].get_center(),color=TEAL))
            self.play(FadeIn(VGroup(*h,*o)),Create(old),run_time=1.8)
            f=formula(r'2\mathrm{H}_2+\mathrm{O}_2\longrightarrow2\mathrm{H}_2\mathrm{O}',45).move_to([0,-2.1,0])
            self.play(Write(f),run_time=2)
            trails=VGroup(*[TracedPath(a.get_center,stroke_color=BLUE if i<4 else CORAL,stroke_opacity=.5,dissipating_time=1.5) for i,a in enumerate(h+o)])
            self.add(trails);self.play(FadeOut(old),run_time=.7)
            targets=[[-3.5,-.5,0],[-2.2,-.5,0],[2.2,-.5,0],[3.5,-.5,0],[-2.85,.55,0],[2.85,.55,0]]
            self.play(*[a.animate.move_to(p) for a,p in zip(h+o,targets)],run_time=4,path_arc=PI/2)
            new=VGroup(*[Line(o[j].get_center(),h[k].get_center(),color=TEAL,stroke_width=5) for j,ks in [(0,[0,1]),(1,[2,3])] for k in ks])
            self.play(Create(new),run_time=1.5)
            count=badge('Före = efter: 4 H och 2 O',GOLD,32).move_to([0,2.2,0])
            self.play(FadeIn(count),run_time=1.2)
            self.play(*[Indicate(a,color=GOLD) for a in h],run_time=2)
            self.play(*[Indicate(a,color=GOLD) for a in o],run_time=2)

        with self.beat('Kan man flytta en siffra hur som helst?',
            'Nej. Fyra H2O betyder fyra hela vattenmolekyler: åtta H och fyra O. Skriver vi H4O säger symbolerna något annat. Siffrans plats ändrar betydelsen.',18,clear=True):
            four=VGroup(*[water([x,y,0],1) for x in [-3.6,-.6] for y in [1.2,-.5]])
            self.play(LaggedStart(*[FadeIn(m) for m in four],lag_ratio=.15),run_time=2)
            good=formula(r'4\mathrm{H}_2\mathrm{O}',57,GOLD).move_to([3.8,1.15,0])
            self.play(Write(good),run_time=1.6)
            sums=VGroup(formula(r'4\cdot2=8\ \mathrm{H}',37,BLUE),formula(r'4\cdot1=4\ \mathrm{O}',37,CORAL)).arrange(DOWN,buff=.3).move_to([3.8,-.35,0])
            self.play(Write(sums),run_time=2.2)
            wrong=formula(r'\mathrm{H}_4\mathrm{O}',48,MUTED).move_to([0,-2.25,0])
            cross=Cross(wrong,stroke_color=CORAL,stroke_width=5)
            self.play(Write(wrong),run_time=1.4)
            self.play(Create(cross),run_time=1)
            note=tex('inte samma betydelse',29,CORAL).next_to(wrong,RIGHT,buff=.5)
            self.play(Write(note),run_time=1.8)
            self.play(*[Create(SurroundingRectangle(m,color=GOLD,buff=.15)) for m in four],run_time=2)
            self.play(Indicate(good),Indicate(sums),run_time=2.7)

        with self.beat('Bild, formel och ord berättar samma sak',
            'Använd tre frågor när ni förklarar: Hur många molekyler? Hur många atomer i varje molekyl? Hur många atomslag? Peka i bilden och läs sedan samma information i formeln.',18,clear=True):
            mol=water([0,.8,0],1.7)
            f=formula(r'\mathrm{H}_2\mathrm{O}',59).move_to([-4.3,-.8,0])
            words=VGroup(tex('två väteatomer',31,BLUE),tex('en syreatom',31,CORAL)).arrange(DOWN,buff=.3).move_to([4.3,-.8,0])
            links=VGroup(arrow([-1.3,.1,0],[-3.2,-.5,0]),arrow([3.1,-.5,0],[1.3,.1,0]),arrow([-2.9,-1.1,0],[2.9,-1.1,0]))
            self.play(FadeIn(mol),run_time=1)
            self.play(Write(f),GrowArrow(links[0]),run_time=2)
            self.play(Write(words),GrowArrow(links[1]),run_time=2)
            self.play(GrowArrow(links[2]),run_time=1.2)
            answers=VGroup(badge('1 molekyl',TEAL,27),badge('3 atomer',GOLD,27),badge('2 atomslag',BLUE,27)).arrange(RIGHT,buff=.7).move_to([0,-2.35,0])
            self.play(LaggedStart(*[FadeIn(a,shift=UP*.15) for a in answers],lag_ratio=.4),run_time=3)
            self.play(Indicate(mol,color=TEAL),Indicate(answers[0]),run_time=2)
            self.play(*[Indicate(a,color=GOLD) for a in mol.atoms],Indicate(answers[1]),run_time=2)
            self.play(Indicate(f,color=BLUE),Indicate(answers[2]),run_time=2)
        self.finish('Nu kan ni förklara skillnaden mellan atom, molekyl och atomslag och läsa både små siffror och antalet hela molekyler i en kemisk formel.')


class ModelMaster(MasterFilm):
    number=2
    topic='Hur atommodellen har förändrats'
    slug='02-modeller'

    def construct(self):
        with self.beat('Hur undersöker vi något vi inte ser direkt?',
            'En vetenskaplig modell är en förklaring som vi kan pröva. Vi börjar med observationer, gör en modell och jämför sedan med nya försök. En modell kan behöva förändras.',15,clear=True):
            nodes=VGroup(badge('observation',BLUE,33),badge('modell',TEAL,33),badge('ny prövning',GOLD,33))
            for node,pos in zip(nodes,[[-4.5,.5,0],[0,.5,0],[4.5,.5,0]]):node.move_to(pos)
            arrows=VGroup(arrow([-3,.5,0],[-1.2,.5,0],BLUE),arrow([1.2,.5,0],[3,.5,0],TEAL))
            loop=ArcBetweenPoints([4.5,.5,0],[-4.5,.5,0],angle=-PI/2,color=GOLD)
            self.play(LaggedStart(*[FadeIn(n,shift=UP*.2) for n in nodes],lag_ratio=.3),run_time=2.6)
            self.play(GrowArrow(arrows[0]),GrowArrow(arrows[1]),run_time=1.8)
            pulse=glow_dot([-4.5,.5,0],GOLD,.09);self.add(pulse)
            self.play(MoveAlongPath(pulse,Line([-4.5,.5,0],[4.5,.5,0])),run_time=3)
            self.play(Create(loop),run_time=1.5)
            self.play(MoveAlongPath(pulse,loop),run_time=3)
            self.play(Indicate(nodes[1],color=GOLD),run_time=1.5)

        with self.beat('Dalton: atomer som hela kulor',
            'Daltons kulmodell hjälpte människor att tänka på olika grundämnen som olika atomslag. Men modellen visade inga mindre delar inuti atomen. Det blev en viktig begränsning.',15,clear=True):
            balls=VGroup(*[dot_atom('',BLUE if i%2 else CORAL,.5,[x,y,0]) for i,(x,y) in enumerate([(-4.5,.7),(-2,.7),(.5,.7),(3,.7),(-3,-1),(1.5,-1)])])
            self.play(LaggedStart(*[FadeIn(b,scale=.5) for b in balls],lag_ratio=.15),run_time=2.4)
            self.move_camera(zoom=1.15,frame_center=[-.7,.1,0],run_time=2.6)
            self.play(*[b.animate.move_to([(-4.2 if i%2 else 3.3),(i//2-1)*1.1,0]) for i,b in enumerate(balls)],run_time=3,path_arc=PI/3)
            self.move_camera(zoom=1,frame_center=ORIGIN,run_time=2)
            labels=VGroup(badge('olika atomslag',BLUE,29).move_to([-3,-2.2,0]),badge('ingen inre struktur i modellen',GOLD,27).move_to([3,-2.2,0]))
            self.play(FadeIn(labels),run_time=1.6)
            self.play(Indicate(balls[0],color=GOLD),run_time=1.8)

        with self.beat('Elektronen visar att atomen har mindre delar',
            'Undersökningar av elektriska strålar visade negativt laddade partiklar: elektroner. Då räckte bilden av en odelbar kula inte längre. Modellen behövde visa delar inuti atomen.',16,clear=True):
            tube=RoundedRectangle(width=12,height=2.8,corner_radius=.5,color=MUTED,stroke_opacity=.5)
            top=Line([-1,1.15,0],[3.6,1.15,0],color=CORAL,stroke_width=9)
            bottom=Line([-1,-1.15,0],[3.6,-1.15,0],color=BLUE,stroke_width=9)
            signs=VGroup(formula('+',44,CORAL).move_to([1.3,1.7,0]),formula('-',44,BLUE).move_to([1.3,-1.7,0]))
            self.play(Create(tube),Create(top),Create(bottom),Write(signs),run_time=2.2)
            beam=VMobject(color=BLUE,stroke_width=3).set_points_smoothly([[-5,0,0],[-2,0,0],[1,.15,0],[3,.65,0],[5,1.2,0]])
            self.play(Create(beam),run_time=1.5)
            particles=[glow_dot([-5,0,0],BLUE,.07) for _ in range(9)]
            self.add(*particles)
            self.play(LaggedStart(*[MoveAlongPath(p,beam) for p in particles],lag_ratio=.16),run_time=5.2,rate_func=linear)
            label=badge('negativ laddning',BLUE,34).move_to([0,-2.35,0])
            pointer=arrow([3.8,2,0],[4.9,1.2,0],GOLD)
            self.play(GrowArrow(pointer),FadeIn(label),run_time=1.5)
            self.play(ShowPassingFlash(beam.copy().set_stroke(GOLD,6),time_width=.3),run_time=2)
            self.play(Indicate(signs[0],color=GOLD),run_time=1.6)

        with self.beat('Thomson: russin i en positiv kaka',
            'I Thomsons modell är de negativa elektronerna som russin. Positiv laddning är utspridd genom hela atomen som smeten i kakan. Här finns ingen liten positiv kärna i mitten.',16,clear=True):
            disk=Circle(radius=1.75,color=CORAL,fill_color=CORAL,fill_opacity=.16).move_to([-2.4,0,0])
            plus=VGroup(*[formula('+',22,CORAL).move_to(p) for p in [[-3.35,1,0],[-1.65,.6,0],[-2.6,.15,0],[-3.4,-.85,0],[-1.65,-1,0]]])
            self.play(DrawBorderThenFill(disk),LaggedStart(*[FadeIn(p) for p in plus],lag_ratio=.02),run_time=2.2)
            electrons=VGroup(*[dot_atom('-',BLUE,.18,p) for p in [[-3.25,.7,0],[-2.1,.95,0],[-1.35,-.1,0],[-2.6,-.6,0],[-3.3,-.6,0]]])
            self.play(LaggedStart(*[GrowFromCenter(e) for e in electrons],lag_ratio=.15),run_time=2.2)
            labels=VGroup(tex('positiv laddning utspridd',31,CORAL,width=5.2).move_to([3.8,.8,0]),tex('negativa elektroner',31,BLUE).move_to([3.8,-.55,0]))
            links=VGroup(arrow([1.2,.8,0],[-1.7,.8,0],CORAL),arrow([1.2,-.55,0],[-1.3,-.1,0],BLUE))
            self.play(Write(labels),GrowArrow(links[0]),GrowArrow(links[1]),run_time=2.5)
            center=Circle(radius=.35,color=GOLD).move_to(disk)
            self.play(Create(center),run_time=1)
            self.play(Indicate(plus,color=CORAL),run_time=2)
            self.play(FadeOut(center),Write(badge('ingen liten kärna i denna modell',GOLD,29).move_to([0,-2.4,0])),run_time=2)
            self.play(Rotate(electrons,angle=.12,about_point=disk.get_center()),run_time=2,rate_func=there_and_back)

        with self.beat('Ett försök med tunn guldfolie',
            'Rutherfords grupp undersökte vad som hände när positivt laddade alfapartiklar träffade en mycket tunn guldfolie. En detektor visade i vilka riktningar partiklar kom ut. Alfapartiklarna är inte elektroner.',17,clear=True):
            source=VGroup(Rectangle(width=1.1,height=1.25,color=GOLD,fill_color=GOLD,fill_opacity=.15),formula('+',28,GOLD)).move_to([-5.7,0,0])
            foil=Rectangle(width=.12,height=4.1,color=GOLD,fill_color=GOLD,fill_opacity=.6).move_to([0,0,0])
            detector=Arc(radius=5,start_angle=-28*DEGREES,angle=56*DEGREES,color=TEAL,stroke_width=5)
            self.play(FadeIn(source),GrowFromCenter(foil),Create(detector),run_time=2.5)
            labels=VGroup(tex('alfapartiklar',29,GOLD).move_to([-4.4,-1.9,0]),tex('tunn guldfolie',29,GOLD).move_to([0,2.35,0]),tex('detektor',29,TEAL).move_to([5.4,2.25,0]))
            self.play(Write(labels),run_time=1.6)
            paths=[Line([-5.3,y,0],[4.8,y,0],color=GOLD,stroke_opacity=.3) for y in [-.8,-.4,0,.4,.8]]
            self.play(LaggedStart(*[Create(p) for p in paths],lag_ratio=.1),run_time=2)
            particles=[glow_dot(p.get_start(),GOLD,.065) for p in paths]
            self.add(*particles)
            self.play(LaggedStart(*[MoveAlongPath(d,p) for d,p in zip(particles,paths)],lag_ratio=.3),run_time=5.5,rate_func=linear)
            self.play(Indicate(foil,color=GOLD),run_time=1.5)
            self.play(ShowPassingFlash(detector.copy().set_stroke(TEAL,10),time_width=.18),run_time=2)

        with self.beat('De flesta gick rakt, några böjdes kraftigt',
            'De flesta alfapartiklar passerade nästan rakt genom folien. Ett fåtal böjdes av kraftigt och några kunde vända tillbaka. De stora avböjningarna var särskilt viktiga ledtrådar. Vi visar utvalda banor, inte rätt antal.',18,clear=True):
            foil=Rectangle(width=.10,height=4.5,color=GOLD,fill_color=GOLD,fill_opacity=.3)
            self.play(Create(foil),run_time=.8)
            straight=[Line([-6,y,0],[6,y,0],color=TEAL,stroke_width=1.5,stroke_opacity=.45) for y in np.linspace(-1.7,1.7,10)]
            bent=VMobject(color=CORAL,stroke_width=3).set_points_smoothly([[-6,.28,0],[-1,.28,0],[.3,.4,0],[1.4,1.1,0],[3,2.4,0]])
            back=VMobject(color=GOLD,stroke_width=3).set_points_smoothly([[-6,-.12,0],[-1,-.12,0],[.18,-.3,0],[-.6,-1.15,0],[-3,-2.1,0]])
            self.play(LaggedStart(*[Create(p) for p in straight],lag_ratio=.05),run_time=2.5)
            dots=[glow_dot(p.get_start(),TEAL,.055) for p in straight]
            self.add(*dots)
            self.play(LaggedStart(*[MoveAlongPath(d,p) for d,p in zip(dots,straight)],lag_ratio=.08),run_time=4.1,rate_func=linear)
            self.play(Create(bent),Create(back),run_time=1.8)
            d1=glow_dot(bent.get_start(),CORAL,.1);d2=glow_dot(back.get_start(),GOLD,.1);self.add(d1,d2)
            trails=VGroup(TracedPath(d1.get_center,stroke_color=CORAL,dissipating_time=1.2),TracedPath(d2.get_center,stroke_color=GOLD,dissipating_time=1.2));self.add(trails)
            self.play(MoveAlongPath(d1,bent),MoveAlongPath(d2,back),run_time=4.5,rate_func=linear)
            self.play(FadeIn(badge('Utvalda banor -- inte statistik',MUTED,27).move_to([0,2.5,0])),run_time=1.2)
            self.play(Indicate(d1,color=CORAL),Indicate(d2,color=GOLD),run_time=1.4)

        with self.beat('Positivt och positivt stöter bort varandra',
            'En positiv alfapartikel påverkas starkt om den passerar nära en liten positiv kärna. Positiva laddningar stöter bort varandra. En partikel som passerar långt från kärnan påverkas mindre.',17,clear=True):
            nucleus=dot_atom('+',CORAL,.48,[0,.4,0])
            field=VGroup(*[Arrow([0,.4,0],1.75*np.array([np.cos(a),np.sin(a),0])+[0,.4,0],color=CORAL,stroke_width=1.6,buff=.6,max_tip_length_to_length_ratio=.14).set_opacity(.35) for a in np.linspace(0,TAU,16,endpoint=False)])
            self.play(GrowFromCenter(nucleus),LaggedStart(*[GrowArrow(a) for a in field],lag_ratio=.04),run_time=2.3)
            path=VMobject(color=GOLD,stroke_width=2).set_points_smoothly([[-5,-.1,0],[-2,-.1,0],[-.7,-.3,0],[-.65,-.85,0],[-2,-1.65,0],[-4,-2,0]])
            alpha=dot_atom('+',GOLD,.23,path.get_start())
            trace=TracedPath(alpha.get_center,stroke_color=GOLD,stroke_width=5,dissipating_time=2)
            self.add(alpha,trace);self.play(Create(path),run_time=1.5)
            self.play(MoveAlongPath(alpha,path),run_time=6,rate_func=linear)
            far=Line([-5,2,0],[5,2,0],color=TEAL,stroke_opacity=.5)
            other=dot_atom('+',TEAL,.2,far.get_start());self.add(other)
            self.play(Create(far),MoveAlongPath(other,far),run_time=3.5,rate_func=linear)
            self.play(Write(badge('nära: stark påverkan',CORAL,27).move_to([3,-.4,0])),run_time=1.5)

        with self.beat('Slutsatsen: en mycket liten positiv kärna',
            'Rutherfords kärnmodell samlar den positiva laddningen och nästan hela atomens massa i en mycket liten kärna. Det mesta av atomens volym är området runt kärnan. Kärnan är förstorad i våra bilder.',18,clear=True):
            atom=Circle(radius=2.3,color=BLUE,stroke_opacity=.4)
            nucleus=dot_atom('+',CORAL,.15,ORIGIN)
            self.play(Create(atom),GrowFromCenter(nucleus),run_time=1.5)
            rays=VGroup(*[Line([-5,y,0],[5,y,0],color=TEAL,stroke_opacity=.28,stroke_width=1) for y in [-1.8,-1.2,-.6,.6,1.2,1.8]])
            self.play(LaggedStart(*[Create(p) for p in rays],lag_ratio=.08),run_time=2.2)
            label=tex('stort område runt en liten kärna',31,BLUE).move_to([0,-2.6,0])
            self.play(Write(label),run_time=1.5)
            self.move_camera(zoom=2.8,frame_center=ORIGIN,run_time=3.4)
            ring=glow_ring(nucleus,GOLD,.22);self.play(Create(ring),run_time=1)
            self.move_camera(zoom=1,frame_center=ORIGIN,run_time=3)
            note=badge('Kärnan samlar positiv laddning',GOLD,28).move_to([0,2.5,0])
            self.play(FadeIn(note),run_time=1.3)
            self.play(Indicate(nucleus,color=GOLD,scale_factor=1.35),run_time=2)

        with self.beat('En solsystemsliknelse -- som jämförelse',
            'I en historisk solsystemsliknelse motsvarar kärnan solen och elektronerna planeterna. Den hjälper oss att se en liten mitt och ett stort område omkring. Men den är inte en exakt beskrivning av en atom.',20,clear=True):
            sun=sphere_atom(GOLD,.58,[-3.6,0,0]);planet=sphere_atom(BLUE,.20,[-1.6,0,0])
            nucleus=sphere_atom(CORAL,.23,[3.6,0,0]);electron=sphere_atom(BLUE,.12,[5.6,0,0])
            orbit1=Circle(radius=2,color=GOLD,stroke_opacity=.5).move_to([-3.6,0,0])
            orbit2=Circle(radius=2,color=BLUE,stroke_opacity=.5).move_to([3.6,0,0])
            self.play(FadeIn(sun),FadeIn(planet),FadeIn(nucleus),FadeIn(electron),Create(orbit1),Create(orbit2),run_time=2.4)
            self.move_camera(phi=58*DEGREES,theta=-65*DEGREES,zoom=.94,run_time=3)
            theta=ValueTracker(0)
            planet.add_updater(lambda m:m.move_to([-3.6+2*np.cos(theta.get_value()),2*np.sin(theta.get_value()),0]))
            electron.add_updater(lambda m:m.move_to([3.6+2*np.cos(theta.get_value()),2*np.sin(theta.get_value()),0]))
            self.play(theta.animate.set_value(TAU*1.6),run_time=7.5,rate_func=linear)
            planet.clear_updaters();electron.clear_updaters()
            self.move_camera(phi=0,theta=-90*DEGREES,zoom=1,run_time=2.4)
            labels=VGroup(tex('sol och planet',30,GOLD).move_to([-3.6,-2.4,0]),tex('kärna och elektron',30,BLUE).move_to([3.6,-2.4,0]))
            self.play(Write(labels),run_time=1.5)
            self.play(Indicate(nucleus,color=CORAL),Indicate(sun,color=GOLD),run_time=2)

        with self.beat('Här slutar solsystemsliknelsen',
            'Gravitation håller planeter kring solen. I atomen verkar elektrisk attraktion mellan positiv kärna och negativa elektroner. Dagens atommodell beskriver inte elektroner som små planeter i bestämda banor.',16,clear=True):
            left=VGroup(sphere_atom(GOLD,.4,[-3.8,.8,0]),sphere_atom(BLUE,.17,[-1.8,.8,0]))
            right=VGroup(dot_atom('+',CORAL,.4,[2,.8,0]),dot_atom('-',BLUE,.25,[4.6,.8,0]))
            self.play(FadeIn(left),FadeIn(right),run_time=1.4)
            forces=VGroup(arrow([-2.1,.8,0],[-3.1,.8,0],GOLD),arrow([4.3,.8,0],[2.7,.8,0],TEAL))
            labels=VGroup(tex('gravitation',34,GOLD).move_to([-3,.0,0]),tex('elektrisk attraktion',34,TEAL).move_to([3.3,0,0]))
            self.play(GrowArrow(forces[0]),GrowArrow(forces[1]),Write(labels),run_time=2.4)
            old_orbit=Ellipse(width=3.8,height=1.3,color=MUTED).move_to([0,-1.45,0])
            words=tex('inte en känd planetbana',32,CORAL).move_to([0,-2.4,0])
            self.play(Create(old_orbit),run_time=1.4)
            cross=Cross(old_orbit,stroke_color=CORAL,stroke_width=4)
            self.play(Create(cross),Write(words),run_time=2)
            self.play(Indicate(right[0],color=CORAL),Indicate(right[1],color=BLUE),run_time=2)
            self.play(ShowPassingFlash(forces[1].copy().set_stroke(TEAL,7),time_width=.3),run_time=2)
            self.play(Indicate(words,color=GOLD),run_time=1.8)

        with self.beat('Bohr: elektronen kan ha bestämda energier',
            'Bohrs modell lade till bestämda energinivåer. En elektron kan ta upp energi och visas på en högre nivå i modellen. När den går till en lägre nivå kan ljus avges. Nivåerna är inte vanliga planetbanor.',18,clear=True):
            nucleus=dot_atom('+',CORAL,.28,[-3.4,0,0])
            rings=VGroup(*[Circle(radius=r,color=BLUE,stroke_opacity=.45).move_to(nucleus) for r in [.85,1.45,2.05]])
            energy=VGroup(*[Line([1.3,y,0],[6,y,0],color=BLUE,stroke_opacity=.6) for y in [-1.6,-.2,1.6]])
            labs=VGroup(*[tex(s,27,BLUE).move_to([6.1,y+.28,0]) for s,y in [('lägre',-1.6),('högre',1.6)]])
            self.play(FadeIn(nucleus),Create(rings),Create(energy),Write(labs),run_time=2)
            e=dot_atom('-',BLUE,.18,[-2.55,0,0]);dot=glow_dot([3.7,-1.6,0],BLUE,.10);self.add(e,dot)
            photon=wave_path([-6.3,1.8,0],e.get_center(),color=GOLD)
            self.play(ShowPassingFlash(photon,time_width=.4),run_time=2)
            self.play(e.animate.move_to([-1.35,0,0]),dot.animate.move_to([3.7,1.6,0]),run_time=2.5)
            self.play(Indicate(energy[2],color=GOLD),run_time=1)
            self.play(e.animate.move_to([-2.55,0,0]),dot.animate.move_to([3.7,-1.6,0]),run_time=2.5)
            outgoing=wave_path(e.get_center(),[-6.4,-1.9,0],color=GOLD)
            self.play(ShowPassingFlash(outgoing,time_width=.4),run_time=2.3)
            note=badge(r'energi in\qquad /\qquad ljus ut',GOLD,29).move_to([2.9,-2.45,0])
            self.play(FadeIn(note),run_time=1.3)
            self.play(Indicate(dot,color=GOLD),run_time=2)

        with self.beat('Elektronmolnet visar sannolikhet',
            'Dagens modell beskriver var en elektron sannolikt kan finnas. Prickarna bygger en sannolikhetsbild. De visar inte många elektroner samtidigt och inte en känd bana för en enda elektron. Molnet är inte rök.',19,clear=True):
            rng=np.random.default_rng(1202)
            nucleus=dot_atom('+',CORAL,.22,ORIGIN)
            pts=[]
            for _ in range(160):
                r=min(rng.gamma(2.1,.55),2.6);angle=rng.uniform(0,TAU)
                pts.append(Dot([r*np.cos(angle),r*np.sin(angle),0],radius=.025,color=BLUE).set_opacity(.35))
            self.play(GrowFromCenter(nucleus),run_time=.8)
            groups=[VGroup(*pts[i:i+20]) for i in range(0,160,20)]
            self.play(LaggedStart(*[FadeIn(g) for g in groups],lag_ratio=.24),run_time=5)
            rings=VGroup(*[Circle(radius=r,color=BLUE,stroke_opacity=.10) for r in [.6,1.1,1.6,2.1,2.6]])
            self.play(Create(rings),run_time=1.8)
            self.move_camera(zoom=1.25,frame_center=ORIGIN,run_time=2.4)
            self.move_camera(zoom=1,frame_center=ORIGIN,run_time=2.4)
            explain=VGroup(tex('tätare prickar: större sannolikhet',28,BLUE),tex('ingen ritad elektronbana',28,GOLD)).arrange(DOWN,buff=.35).move_to([4.4,0,0])
            self.play(VGroup(nucleus,*pts,rings).animate.shift(LEFT*2.7),Write(explain),run_time=2.5)
            self.play(Indicate(explain[1],color=GOLD),run_time=1.8)

        with self.beat('En modell måste passa det vi undersöker',
            'Varje modell lyfter fram något och förenklar annat. Kulmodellen visar atomslag. Thomson visar elektroner, Rutherford en liten kärna, Bohr energinivåer och elektronmolnet sannolikhet. Nya resultat kan kräva en ny modell.',17,clear=True):
            names=['Dalton','Thomson','Rutherford','Bohr','elektronmoln']
            positions=np.linspace(-5.8,5.8,5)
            line=Line([-6.5,.6,0],[6.5,.6,0],color=TEAL,stroke_width=3)
            self.play(Create(line),run_time=1.4)
            dots=VGroup(*[Dot([x,.6,0],color=TEAL,radius=.09) for x in positions])
            labels=VGroup(*[tex(n,25,INK,width=2.4).move_to([x,1.35,0]) for n,x in zip(names,positions)])
            clues=['atomslag','elektroner','liten kärna','energier','sannolikhet']
            below=VGroup(*[tex(n,24,c,width=2.4).move_to([x,-.3,0]) for n,x,c in zip(clues,positions,[BLUE,BLUE,CORAL,GOLD,BLUE])])
            self.play(LaggedStart(*[FadeIn(d) for d in dots],lag_ratio=.18),Write(labels),run_time=2.5)
            for i in range(5):
                self.play(FadeIn(below[i],shift=UP*.2),Flash(dots[i].get_center(),color=GOLD),run_time=1.4)
            result=badge('Nya observationer prövar våra förklaringar',GOLD,30).move_to([0,-2.2,0])
            self.play(FadeIn(result),run_time=1.6)
            self.play(ShowPassingFlash(line.copy().set_stroke(GOLD,7),time_width=.15),run_time=2.3)

        with self.beat('Kan ni förklara modellens förändring?',
            'Förklara vad guldfolieförsöket lärde oss. Beskriv sedan vad solsystemsliknelsen hjälper oss att se och var den slutar fungera. En bra förklaring kopplar modellen till observationer.',18,clear=True):
            questions=[('Var finns den positiva laddningen?','i en mycket liten kärna',CORAL),
                       ('Vad berättar de stora avböjningarna?','laddning och massa är koncentrerade',GOLD),
                       ('Är elektroner små planeter?','nej -- dagens modell visar sannolikhet',BLUE)]
            cards=VGroup()
            for i,(q,a,c) in enumerate(questions):
                y=1.8-i*1.75
                qlabel=tex(q,31,INK,width=12.5).move_to([0,y,0])
                answer=tex(a,28,c,width=12).move_to([0,y-.65,0])
                cards.add(VGroup(qlabel,answer))
                self.play(Write(qlabel),run_time=1.8)
                self.play(FadeIn(answer,shift=UP*.15),run_time=2)
                self.play(Indicate(answer,color=c,scale_factor=1.04),run_time=1.1)
            self.play(LaggedStart(*[Indicate(c[1],color=GOLD) for c in cards],lag_ratio=.2),run_time=2)
        self.finish('En vetenskaplig modell förändras när observationer kräver bättre förklaringar. Solsystemsliknelsen är en hjälp att jämföra, men dagens elektronmoln är ingen planetbana.')
