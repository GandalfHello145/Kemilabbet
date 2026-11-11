"""Original short films: persistent objects connect observations and conclusions.

Curriculum: Skolverket GRGRKEM01, particle models and the historical development
of explanatory models. Visual inspiration is the concrete-to-general reasoning,
colour continuity and linked transformations in public 3Blue1Brown lessons.
No 3Blue1Brown scene code or assets are copied.
"""
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from core import *


def chip(words,color=TEAL,size=29):
    label=tex(words,size,color)
    box=RoundedRectangle(width=label.width+.45,height=label.height+.30,
        corner_radius=.11,stroke_color=color,stroke_opacity=.5,fill_color=color,fill_opacity=.07)
    return VGroup(box,label)


def ring(mob,color=GOLD,buff=.16):
    return Circle(radius=max(mob.width,mob.height)/2+buff,color=color,stroke_width=2.4).move_to(mob)


def water(pos=ORIGIN,scale=1):
    o=dot_atom('O',OXYGEN,.36,[0,.26,0])
    h1=dot_atom('H',HYDROGEN,.25,[-.61,-.22,0])
    h2=dot_atom('H',HYDROGEN,.25,[.61,-.22,0])
    bonds=VGroup(Line(o.get_center(),h1.get_center(),color=TEAL,stroke_width=6),
                 Line(o.get_center(),h2.get_center(),color=TEAL,stroke_width=6))
    group=VGroup(bonds,o,h1,h2).scale(scale).move_to(pos)
    group.bonds=bonds;group.o=o;group.h1=h1;group.h2=h2
    return group


def oxygen(pos=ORIGIN,scale=1):
    a=dot_atom('O',OXYGEN,.34,[-.48,0,0]);b=dot_atom('O',OXYGEN,.34,[.48,0,0])
    bonds=VGroup(Line(a.get_center()+UP*.06,b.get_center()+UP*.06,color=TEAL,stroke_width=3),
                 Line(a.get_center()+DOWN*.06,b.get_center()+DOWN*.06,color=TEAL,stroke_width=3))
    return VGroup(bonds,a,b).scale(scale).move_to(pos)


def sway(scene,objects,seconds,amplitude=.08):
    starts=[m.get_center().copy() for m in objects]
    scene.play(*[UpdateFromAlphaFunc(m,lambda obj,a,i=i:obj.move_to(starts[i]+amplitude*np.array(
        [np.sin(TAU*a+i),np.sin(TAU*a*1.5+i*.7),0.]))) for i,m in enumerate(objects)],
        run_time=seconds,rate_func=linear)


class AtomMaster(MasterFilm):
    number=1;topic='Atomer och molekyler';slug='01-atomer';total_steps=7

    def construct(self):
        with self.beat('Från en droppe till en molekyl',
            'En vattendroppe innehåller många vattenmolekyler. Vi följer en molekyl och ser vilka byggstenar den består av. Varje färg följer samma atomslag.',seconds=14):
            drop=VMobject(color=BLUE,fill_color=BLUE,fill_opacity=.10,stroke_width=3)
            drop.set_points_smoothly([[0,2,0],[-.7,.8,0],[-1.1,-.2,0],[-.7,-1.1,0],
                                     [0,-1.35,0],[.7,-1.1,0],[1.1,-.2,0],[.7,.8,0],[0,2,0]])
            drop.move_to([-4.3,.2,0])
            seeds=VGroup(*[Dot([-4.9+(i%4)*.39,-.7+(i//4)*.35,0],radius=.047,color=BLUE) for i in range(16)])
            self.play(DrawBorderThenFill(drop),LaggedStart(*[FadeIn(d) for d in seeds],lag_ratio=.045),run_time=2)
            tracked=seeds[6];halo=ring(tracked,GOLD,.16)
            self.play(Create(halo),Indicate(tracked,color=GOLD,scale_factor=2),run_time=1.2)
            guide=DashedLine(tracked.get_center(),[1.7,.1,0],color=GOLD,stroke_opacity=.6)
            lens=Circle(radius=1.6,color=GOLD,stroke_opacity=.5).move_to([2.5,.1,0])
            self.play(Create(guide),Transform(halo,lens),run_time=2)
            mol=water([2.5,.1,0],1.9)
            self.play(GrowFromCenter(mol),FadeOut(halo),run_time=1.8)
            self.play(ShowPassingFlash(guide.copy().set_stroke(GOLD,7),time_width=.25),run_time=1.5)
            self.play(FadeOut(drop),FadeOut(seeds),FadeOut(guide),mol.animate.move_to(ORIGIN).scale(1.2),run_time=2)
            sway(self,[mol],2.5,.08)

        with self.beat('Tre atomer -- men två atomslag',
            'Här finns två väteatomer och en syreatom. Det blir tre atomer men bara två atomslag: väte och syre.',seconds=14):
            self.play(FadeOut(mol.bonds),mol.h1.animate.move_to([-3,0,0]),mol.o.animate.move_to([0,0,0]),mol.h2.animate.move_to([3,0,0]),run_time=2)
            numbers=VGroup(*[mathtex(str(i+1),33,GOLD).move_to([x,1.25,0]) for i,x in enumerate([-3,0,3])])
            self.play(LaggedStart(*[Write(n) for n in numbers],lag_ratio=.35),run_time=1.8)
            total=chip('3 atomer',GOLD,34).move_to([-2.3,-1.65,0])
            kinds=chip('2 atomslag',TEAL,34).move_to([2.3,-1.65,0])
            self.play(Write(total),run_time=1.2)
            hwords=tex('H = väte',30,HYDROGEN).move_to([-3,2.15,0])
            owords=tex('O = syre',30,OXYGEN).move_to([1.6,2.15,0])
            self.play(Write(hwords),Indicate(mol.h1,color=HYDROGEN),Indicate(mol.h2,color=HYDROGEN),run_time=2)
            self.play(Write(owords),Indicate(mol.o,color=OXYGEN),run_time=1.8)
            self.play(Write(kinds),run_time=1.3)
            self.play(Indicate(total,color=GOLD),Indicate(kinds,color=TEAL),run_time=2)

        with self.beat('Bindningarna håller ihop molekylen',
            'Två eller flera bundna atomer bildar en molekyl. I en vattenmolekyl sitter två väteatomer ihop med en syreatom.',seconds=14):
            self.play(FadeOut(numbers),FadeOut(hwords),FadeOut(owords),FadeOut(total),FadeOut(kinds),run_time=1)
            o_target=np.array([0,.6,0]);h1_target=np.array([-1.3,-.42,0]);h2_target=np.array([1.3,-.42,0])
            self.play(mol.o.animate.move_to(o_target),mol.h1.animate.move_to(h1_target),mol.h2.animate.move_to(h2_target),run_time=2.3)
            mol.bonds[0].put_start_and_end_on(o_target,h1_target);mol.bonds[1].put_start_and_end_on(o_target,h2_target)
            self.play(Create(mol.bonds[0]),Create(mol.bonds[1]),run_time=1.6)
            bondword=tex('kemiska bindningar',31,TEAL).move_to([0,2.1,0])
            pointers=VGroup(arrow([-1,1.8,0],[-.6,.1,0],TEAL),arrow([1,1.8,0],[.6,.1,0],TEAL))
            self.play(Write(bondword),GrowArrow(pointers[0]),GrowArrow(pointers[1]),run_time=1.8)
            boundary=RoundedRectangle(width=4.2,height=3.6,corner_radius=.25,color=GOLD).move_to([0,.05,0])
            one=chip('1 vattenmolekyl',GOLD,32).move_to([0,-2.35,0])
            self.play(Create(boundary),Write(one),run_time=1.8)
            self.play(Indicate(mol.h1,color=HYDROGEN),Indicate(mol.h2,color=HYDROGEN),Indicate(mol.o,color=OXYGEN),run_time=1.8)
            self.play(FadeOut(pointers),FadeOut(bondword),FadeOut(boundary),run_time=1.6)

        with self.beat('Formeln berättar samma sak som bilden',
            'Vattnets formel är H₂O. Den lilla tvåan hör till H. Den betyder två väteatomer i varje vattenmolekyl. O betyder en syreatom.',seconds=14):
            self.play(FadeOut(one),mol.animate.scale(.85).move_to([-3.3,.2,0]),run_time=1.5)
            f=mathtex(r'\mathrm{H}_2\mathrm{O}',74).move_to([2.7,.2,0])
            self.play(Write(f),run_time=1.8)
            hcount=mathtex(r'2\,\mathrm H',40,HYDROGEN).move_to([1.5,1.8,0])
            ocount=mathtex(r'1\,\mathrm O',40,OXYGEN).move_to([4.1,1.8,0])
            hglow=VGroup(ring(mol.h1,HYDROGEN,.08),ring(mol.h2,HYDROGEN,.08))
            self.play(Create(hglow),TransformFromCopy(VGroup(mol.h1,mol.h2),hcount),run_time=2)
            self.play(Create(ring(mol.o,OXYGEN,.08)),TransformFromCopy(mol.o,ocount),run_time=1.8)
            routes=VGroup(arrow([1.5,1.4,0],[2.8,.65,0],HYDROGEN),arrow([4.1,1.4,0],[3.45,.65,0],OXYGEN))
            self.play(LaggedStart(*[GrowArrow(a) for a in routes],lag_ratio=.4),run_time=1.8)
            read=tex('två H och en O',34,GOLD).move_to([2.7,-1.5,0])
            self.play(Write(read),Indicate(f,color=GOLD),run_time=1.7)
            self.play(FadeOut(hglow),FadeOut(hcount),FadeOut(ocount),FadeOut(routes),FadeOut(read),run_time=1.3)
            # The single oxygen ring is removed with the next visual transition.

        with self.beat('Siffran framför räknar hela molekyler',
            'Två H₂O betyder två vattenmolekyler. Tillsammans har de sex atomer, men fortfarande bara två atomslag. Båda molekylerna består av vatten.',seconds=14):
            extras=[m for m in list(self.mobjects) if isinstance(m,Circle) and m not in self._fixed]
            self.play(*[FadeOut(m) for m in extras],FadeOut(f),mol.animate.move_to([-2.8,.1,0]),run_time=1.3)
            second=mol.copy().move_to([2.8,.1,0])
            self.play(TransformFromCopy(mol,second,path_arc=-PI/3),run_time=2.3)
            f2=mathtex(r'2\,\mathrm{H}_2\mathrm O',57,GOLD).move_to([0,2.1,0])
            self.play(Write(f2),run_time=1.5)
            whole=VGroup(ring(mol,GOLD,.15),ring(second,GOLD,.15))
            self.play(LaggedStart(*[Create(r) for r in whole],lag_ratio=.4),run_time=1.8)
            counts=VGroup(chip('2 molekyler',GOLD),chip('6 atomer',INK),chip('2 atomslag',TEAL)).arrange(RIGHT,buff=.42).move_to([0,-2.1,0])
            self.play(Write(counts[0]),run_time=1.2)
            self.play(Indicate(VGroup(mol.o,mol.h1,mol.h2,second.o,second.h1,second.h2),color=GOLD),Write(counts[1]),run_time=1.8)
            self.play(Write(counts[2]),run_time=1.2)
            self.play(FadeOut(whole),FadeOut(f2),FadeOut(counts),run_time=1.2)

        with self.beat('Grundämne eller kemisk förening?',
            'Syrgas består bara av syreatomer och är ett grundämne. Vatten innehåller väte och syre som är bundna: en kemisk förening.',seconds=14):
            self.play(FadeOut(second),mol.animate.scale(.8).move_to([-3.5,.3,0]),run_time=1.2)
            ox=oxygen([3.4,.3,0],1.7)
            self.play(GrowFromCenter(ox),run_time=1.8)
            wf=mathtex(r'\mathrm H_2\mathrm O',44).move_to([-3.5,2,0]);of=mathtex(r'\mathrm O_2',44).move_to([3.4,2,0])
            self.play(Write(wf),Write(of),run_time=1.5)
            wlabel=tex('kemisk förening',32,TEAL).move_to([-3.5,-1.4,0])
            olabel=tex('grundämne',32,OXYGEN).move_to([3.4,-1.4,0])
            self.play(Indicate(ox[1],color=OXYGEN),Indicate(ox[2],color=OXYGEN),Write(olabel),run_time=2)
            self.play(Indicate(mol.h1,color=HYDROGEN),Indicate(mol.o,color=OXYGEN),Write(wlabel),run_time=2)
            rule1=tex('flera atomslag',28,TEAL).next_to(wlabel,DOWN,buff=.28)
            rule2=tex('ett atomslag',28,OXYGEN).next_to(olabel,DOWN,buff=.28)
            self.play(Write(rule1),Write(rule2),run_time=1.8)
            self.play(Indicate(wf,color=TEAL),Indicate(of,color=OXYGEN),run_time=1.8)

        with self.beat('Flera ämnen tillsammans blir en blandning',
            'Vattenmolekyler och syrgasmolekyler tillsammans är en blandning. Molekylerna behåller sina bindningar. Flera molekyler av bara vatten är däremot ett rent ämne.',seconds=14):
            self.play(FadeOut(wf),FadeOut(of),FadeOut(wlabel),FadeOut(olabel),FadeOut(rule1),FadeOut(rule2),run_time=1)
            vessel=RoundedRectangle(width=9.2,height=4.1,corner_radius=.3,color=BLUE,stroke_opacity=.7).move_to([0,-.05,0])
            self.play(Create(vessel),mol.animate.move_to([-2.6,.65,0]),ox.animate.scale(.72).move_to([1.8,.6,0]),run_time=2)
            water2=mol.copy().move_to([1.4,-.9,0]);ox2=ox.copy().move_to([-1.6,-.9,0])
            self.play(FadeIn(water2,shift=UP*.3),FadeIn(ox2,shift=DOWN*.3),run_time=1.5)
            mixture=chip('2 ämnen tillsammans',GOLD,32).move_to([0,2.4,0])
            self.play(Write(mixture),run_time=1.2)
            sway(self,[mol,ox,water2,ox2],4,.13)
            molecule_rings=VGroup(*[ring(m,TEAL,.11) for m in [mol,ox,water2,ox2]])
            self.play(LaggedStart(*[Create(r) for r in molecule_rings],lag_ratio=.15),run_time=1.8)
            self.play(FadeOut(molecule_rings),Indicate(mixture,color=GOLD),run_time=1.6)
        self.finish('Atomer bygger molekyler. Atomslag räknar sorterna. En formel beskriver byggstenarna. Ett ämne kan vara rent; flera ämnen tillsammans bildar en blandning.')


def scattering_points(model='rutherford',impact=.06):
    """Original dimensionless repulsive trajectory; no collision wall."""
    p=np.array([-3.8,impact],dtype=float);v=np.array([3.,0.]);points=[p.copy()]
    def acceleration(position):
        r=max(np.linalg.norm(position),1e-8)
        return .6*position/(1.25**3 if model=='thomson' and r<1.25 else r**3)
    for i in range(7000):
        r=max(np.linalg.norm(p),.0001)
        dt=min(.006,.025*r/max(np.linalg.norm(v),.01),.025*np.sqrt(r**3/.6))
        a=acceleration(p);p+=v*dt+.5*a*dt*dt;v+=.5*(a+acceleration(p))*dt
        if i%3==0:points.append(p.copy())
        if p[0]>3.8 or p[0]<-3.85 or abs(p[1])>2.4:break
    return [np.array([q[0],q[1],0.]) for q in points]


def beam_path(points,center=ORIGIN,scale=1,color=GOLD,width=2):
    return VMobject(color=color,stroke_width=width).set_points_smoothly([np.array(center)+p*scale for p in points])


def positive_cloud(center=ORIGIN,radius=1.25):
    sphere=Circle(radius=radius,color=TEAL,fill_color=TEAL,fill_opacity=.12,stroke_opacity=.4).move_to(center)
    pluses=VGroup(*[mathtex('+',23,TEAL).move_to(np.array(center)+np.array([np.cos(a),np.sin(a),0])*radius*.56) for a in np.linspace(0,TAU,6,endpoint=False)])
    return VGroup(sphere,pluses)


def light_wave(start,end,color=GOLD):
    a=np.array(start,dtype=float);b=np.array(end,dtype=float)
    normal=np.array([-(b-a)[1],(b-a)[0],0.]);normal/=max(np.linalg.norm(normal),.001)
    return ParametricFunction(lambda t:a+(b-a)*t+normal*.13*np.sin(TAU*7*t),t_range=[0,1],color=color,stroke_width=3)


class ModelMaster(MasterFilm):
    number=2;topic='Hur atommodeller utvecklas';slug='02-modeller';total_steps=7

    def construct(self):
        with self.beat('Dalton: atomer som hela kulor',
            'Dalton beskrev ämnen med olika atomslag. Ämnen förenas i bestämda antal atomer. Hans modell visade inga mindre delar inuti atomen.',seconds=13.5,clear=True):
            balls=VGroup(*[dot_atom('O' if i%3==0 else 'H',OXYGEN if i%3==0 else HYDROGEN,.30,
                       [-4.8+(i%5)*2.1,1-(i//5)*2,0]) for i in range(9)])
            self.play(LaggedStart(*[GrowFromCenter(a) for a in balls],lag_ratio=.12),run_time=2)
            targets=[]
            for x in [-4.2,0,4.2]:targets += [[x,.6,0],[x-.7,-.3,0],[x+.7,-.3,0]]
            self.play(*[a.animate.move_to(targets[i]) for i,a in enumerate(balls)],run_time=2.5)
            equal=VGroup(*[tex('samma antal',28,GOLD).move_to([x,-1.3,0]) for x in [-4.2,0,4.2]])
            self.play(Write(equal),run_time=1.4)
            self.play(LaggedStart(*[Indicate(VGroup(*balls[i:i+3]),color=GOLD) for i in [0,3,6]],lag_ratio=.22),run_time=2)
            ball=Circle(radius=1.25,color=BLUE,fill_color=BLUE,fill_opacity=.17)
            self.play(FadeOut(equal),*[FadeOut(a) for a in balls[1:]],ReplacementTransform(balls[0],ball),run_time=2)
            dalton=chip('en hel atom',BLUE,31).move_to([0,-2.1,0])
            self.play(Write(dalton),Indicate(ball,color=BLUE),run_time=2)

        with self.beat('Thomson: elektronen kräver en ny bild',
            'Elektronen upptäcktes. Atomen måste ha mindre delar. Thomson placerade negativa elektroner i en positiv laddning som var utspridd.',seconds=13.5):
            self.play(FadeOut(dalton),run_time=.7)
            electron=dot_atom('-',HYDROGEN,.19,[-.2,.1,0])
            self.play(GrowFromCenter(electron),run_time=1)
            trail=TracedPath(electron.get_center,stroke_color=HYDROGEN,stroke_width=3,dissipating_time=.9)
            self.add(trail)
            route=ArcBetweenPoints(electron.get_center(),[-4.6,.7,0],angle=-.35,color=BLUE)
            self.play(MoveAlongPath(electron,route),run_time=2.5)
            small=tex('negativ elektron',31,HYDROGEN).move_to([-4.5,1.8,0])
            self.play(Write(small),run_time=1)
            cloud=positive_cloud(ORIGIN,1.25)
            self.play(ReplacementTransform(ball,cloud),run_time=1.5)
            self.play(electron.animate.move_to([-.6,.3,0]),FadeOut(small),run_time=1.5)
            electrons=VGroup(electron,*[dot_atom('-',HYDROGEN,.18,p) for p in [[.55,.5,0],[.4,-.55,0],[-.45,-.55,0]]])
            self.play(LaggedStart(*[GrowFromCenter(e) for e in electrons[1:]],lag_ratio=.2),run_time=1.5)
            conclusion=chip('Atomen har mindre delar',GOLD,31).move_to([0,-2.2,0])
            self.play(Write(conclusion),run_time=1.2)
            self.play(Indicate(cloud,color=TEAL),Indicate(electrons,color=HYDROGEN),run_time=1.5)
            trail.clear_updaters();self.remove(trail)

        with self.beat('En partikel ger en ledtråd',
            'Rutherfords grupp skickade positiva alfapartiklar mot tunn guldfolie. De flesta gick igenom. Några ändrade riktning mycket. Det behövde förklaras.',seconds=13.5,clear=True):
            foil=Rectangle(width=.12,height=3.8,color=GOLD,fill_color=GOLD,fill_opacity=.3).move_to([-.4,0,0])
            foil_word=tex('guldfolie',29,GOLD).move_to([-.4,2.3,0])
            self.play(Create(foil),Write(foil_word),run_time=1.5)
            particle=dot_atom('+',GOLD,.16,[-5.6,-.3,0])
            source=tex('positiv alfapartikel',29,GOLD).move_to([-4.5,1.3,0])
            self.play(FadeIn(particle),Write(source),run_time=1.3)
            straight=Line([-5.6,-.3,0],[5.6,-.3,0],color=TEAL,stroke_width=2)
            trail=TracedPath(particle.get_center,stroke_color=TEAL,stroke_width=3)
            self.add(trail)
            self.play(MoveAlongPath(particle,straight),run_time=3)
            most=tex('de flesta går igenom',31,TEAL).move_to([3,-1.3,0])
            self.play(Write(most),FadeOut(particle),run_time=1)
            trail.clear_updaters()
            rare=dot_atom('+',GOLD,.16,[-5.6,.25,0])
            bent=VMobject().set_points_smoothly([[-5.6,.25,0],[-2,.25,0],[-.6,.3,0],[-1,1.35,0],[-4.6,2,0]])
            self.play(FadeIn(rare),run_time=.5)
            rtrail=TracedPath(rare.get_center,stroke_color=GOLD,stroke_width=3)
            self.add(rtrail)
            self.play(MoveAlongPath(rare,bent),run_time=3)
            change=tex('några böjer av mycket',31,GOLD).move_to([-2,-2.25,0])
            self.play(Write(change),run_time=1.4)
            rtrail.clear_updaters()

        with self.beat('Lika laddningar stöter bort varandra',
            'En positiv partikel böjs bort från en positiv kärna. Nära den lilla kärnan blir påverkan stark. Därför kan banan ändras mycket.',seconds=13.5,clear=True):
            origin=np.array([-2.6,0,0]);zoom_origin=np.array([4.1,0,0])
            nucleus=dot_atom('+',CORAL,.12,origin)
            atom_edge=Circle(radius=1.3,color=BLUE,stroke_opacity=.25).move_to(origin)
            window=RoundedRectangle(width=4.3,height=3.8,corner_radius=.18,color=BLUE,stroke_opacity=.5).move_to(zoom_origin)
            zoom_core=dot_atom('+',CORAL,.22,zoom_origin)
            close_label=tex('nära kärnan',30,BLUE).move_to([4.1,2.3,0])
            self.play(Create(atom_edge),GrowFromCenter(nucleus),Create(window),GrowFromCenter(zoom_core),Write(close_label),run_time=1.8)
            points=scattering_points('rutherford',.06)
            particle=dot_atom('+',GOLD,.14,origin+points[0]*.86)
            zoom_particle=particle.copy().scale(1.2)
            zoom_opacities=[(part,part.get_fill_opacity(),part.get_stroke_opacity())
                            for part in zoom_particle.family_members_with_points()]
            def zoom_update(obj):
                rel=(particle.get_center()-origin)/.86
                visibility=1 if abs(rel[0])<1.15 and abs(rel[1])<1.0 else 0
                obj.move_to(zoom_origin+rel*1.65)
                for part,fill,stroke in zoom_opacities:
                    part.set_fill(opacity=fill*visibility,family=False)
                    part.set_stroke(opacity=stroke*visibility,family=False)
            def zoom_visibility():
                rel=(particle.get_center()-origin)/.86
                return 1 if abs(rel[0])<1.15 and abs(rel[1])<1.0 else 0
            zoom_particle.add_updater(zoom_update)
            def force_at(center,point,factor=1):
                v=point-center;r=max(np.linalg.norm(v),.03)
                return arrow(point,point+v/r*min(.7,.12/r**2)*factor,CORAL,buff=0)
            force=always_redraw(lambda:force_at(origin,particle.get_center()))
            zoom_force=always_redraw(lambda:force_at(zoom_origin,zoom_particle.get_center(),1.2).set_opacity(zoom_visibility()))
            trail=TracedPath(particle.get_center,stroke_color=GOLD,stroke_width=3)
            self.add(particle,zoom_particle,force,zoom_force,trail)
            near=[i for i,p in enumerate(points) if np.linalg.norm(p)<1.25];first,last=near[0],near[-1]
            for part,seconds in [(points[:first+1],1.4),(points[first:last+1],3.8),(points[last:],1.4)]:
                self.play(MoveAlongPath(particle,beam_path(part,origin,.86)),run_time=seconds,rate_func=linear)
            for obj in [zoom_particle,force,zoom_force,trail]:obj.clear_updaters()
            self.play(FadeOut(force),FadeOut(zoom_force),run_time=.6)
            conclusion=chip('liten positiv kärna',GOLD,32).move_to([-.2,-2.25,0])
            self.play(Write(conclusion),run_time=1.3)
            self.play(Indicate(nucleus,color=CORAL,scale_factor=1.8),Indicate(zoom_core,color=CORAL),run_time=1.5)

        with self.beat('Samma start -- två olika förklaringar',
            'Utspridd laddning ger svag påverkan nära mitten. Samlad laddning kan böja banan kraftigt. De flesta passerar långt från den lilla kärnan.',seconds=13.5,clear=True):
            left=np.array([-3.55,.1,0]);right=np.array([3.55,.1,0])
            cloud=positive_cloud(left,.88);core=dot_atom('+',CORAL,.11,right)
            titles=VGroup(tex('Thomson: utspridd',30,TEAL).move_to([-3.55,2.3,0]),tex('Rutherford: samlad',30,GOLD).move_to([3.55,2.3,0]))
            self.play(FadeIn(cloud),GrowFromCenter(core),Write(titles),run_time=1.5)
            bs=[-2,-1.2,-.6,.018,1.2,2]
            left_paths=VGroup(*[beam_path(scattering_points('thomson',b),left,.57,TEAL,1.8) for b in bs])
            right_paths=VGroup(*[beam_path(scattering_points('rutherford',b),right,.57,GOLD,1.8) for b in bs])
            self.play(LaggedStart(*[Create(p) for p in left_paths],lag_ratio=.35),run_time=3.3)
            self.play(LaggedStart(*[Create(p) for p in right_paths],lag_ratio=.35),run_time=3.3)
            weak=tex('svag påverkan',30,TEAL).move_to([-3.55,-1.8,0])
            strong=tex('stark nära kärnan',30,GOLD).move_to([3.55,-1.8,0])
            self.play(Write(weak),Write(strong),run_time=1.4)
            space=chip('Mycket utrymme runt kärnan',BLUE,30).move_to([0,-2.55,0])
            self.play(Write(space),run_time=1.3)
            self.play(Indicate(right_paths[3],color=CORAL),run_time=1.5)

        with self.beat('Solsystemet är en liknelse',
            'Kärnan kan jämföras med solen och elektroner med planeter. Men elektriska krafter verkar i atomen. Elektroner följer inte kända planetbanor.',seconds=13.5,clear=True):
            sun=dot_atom('',GOLD,.46,[-3.5,0,0]);planet=dot_atom('',BLUE,.16,[-1.7,0,0])
            nucleus=dot_atom('+',CORAL,.22,[3.5,0,0]);electron=dot_atom('-',HYDROGEN,.14,[5.3,0,0])
            orbit1=Circle(radius=1.8,color=GOLD,stroke_opacity=.4).move_to([-3.5,0,0])
            orbit2=DashedVMobject(Circle(radius=1.8,color=BLUE),num_dashes=32).move_to([3.5,0,0])
            t1=tex('solsystem',31,GOLD).move_to([-3.5,2.3,0]);t2=tex('historisk atomliknelse',31,BLUE).move_to([3.5,2.3,0])
            self.play(FadeIn(sun),FadeIn(planet),FadeIn(nucleus),FadeIn(electron),Create(orbit1),Create(orbit2),Write(t1),Write(t2),run_time=2.2)
            self.play(Rotate(planet,angle=TAU*.75,about_point=[-3.5,0,0]),Rotate(electron,angle=TAU*.75,about_point=[3.5,0,0]),run_time=3.2,rate_func=linear)
            f1=tex('gravitation',30,GOLD).move_to([-3.5,-2.2,0]);f2=tex('elektrisk kraft',30,BLUE).move_to([3.5,-2.2,0])
            self.play(Write(f1),Write(f2),run_time=1.4)
            rng=np.random.default_rng(214)
            dots=VGroup(*[Dot([3.5+x,y,0],radius=.025,color=BLUE,fill_opacity=.25) for x,y in rng.normal(0,.7,(110,2)) if x*x+y*y<2.8])
            self.play(FadeOut(orbit2),FadeOut(electron),LaggedStart(*[FadeIn(d) for d in dots],lag_ratio=.01),run_time=2)
            limit=chip('Elektroner är inte planeter',INK,30).move_to([0,1.75,0])
            self.play(Write(limit),run_time=1.3)
            self.play(Indicate(dots,color=BLUE),run_time=1.8)

        with self.beat('Bohr: elektroner kan byta energi',
            'Bohr kopplade elektroner till bestämda energier. När elektronen byter energi kan ljus tas upp eller avges. Nya observationer förändrar modeller.',seconds=13.5,clear=True):
            low=Line([-4.5,-1,0],[-1.5,-1,0],color=BLUE,stroke_width=4)
            high=Line([-4.5,1,0],[-1.5,1,0],color=BLUE,stroke_width=4)
            levels=tex('bestämda energier',30,BLUE).move_to([-3,2.2,0])
            e=dot_atom('-',HYDROGEN,.19,[-3,-1,0])
            self.play(Create(low),Create(high),Write(levels),GrowFromCenter(e),run_time=1.5)
            photon=light_wave([5.7,-1,0],[-2.4,-1,0])
            absorb=tex('energi tas upp',32,GOLD).move_to([3.3,.1,0])
            self.play(Create(photon),Write(absorb),run_time=2)
            self.play(FadeOut(photon),e.animate.move_to([-3,1,0]),run_time=1.8)
            emit=tex('ljus avges',32,GOLD).move_to([3.3,.1,0])
            outgoing=light_wave([-2.4,-1,0],[5.7,-1,0])
            self.play(e.animate.move_to([-3,-1,0]),ReplacementTransform(absorb,emit),Create(outgoing),run_time=2)
            self.play(ShowPassingFlash(outgoing.copy().set_stroke(GOLD,7),time_width=.22),run_time=1.3)
            timeline=VGroup(*[tex(name,27,TEAL if i==3 else MUTED) for i,name in enumerate(['Dalton','Thomson','Rutherford','Bohr'])]).arrange(RIGHT,buff=.7).move_to([0,-2.4,0])
            self.play(LaggedStart(*[Write(t) for t in timeline],lag_ratio=.2),run_time=1.6)
            result=chip('Nya observationer ändrar modellerna',GOLD,30).move_to([2.1,2.2,0])
            self.play(Write(result),run_time=1.6)
        self.finish('Observationer ändrar atommodeller. Elektronen visade mindre delar, partikelbanor avslöjade kärnan och Bohr kopplade elektroner till bestämda energier.')
