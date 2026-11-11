"""Original 1080p short-film choreography: charges/bonds and changes.

General visual research: 3b1b/videos, especially persistent-object tracking and
linked representations. No third-party scene code or artwork is copied.
Curriculum: Skolverket GRGRKEM01, central content for years 7–9.
"""
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from core import *


def label(words, point, color=INK, size=29, width=None):
    return tex(words, size=size, color=color, width=width).move_to(point)


def signed_particle(sign, color, point=ORIGIN, radius=.43):
    body = VGroup(*[Circle(radius=radius*k, stroke_width=0,
                           fill_color=color, fill_opacity=alpha)
                    for k, alpha in [(1.35,.035),(1.12,.08),(1,.20)]])
    body.add(Circle(radius=radius, color=color, stroke_width=2.4),
             mathtex(sign, 45*radius/.43, color))
    return body.move_to(point)


def electron(point=ORIGIN, radius=.085):
    return glow_dot(point, VIOLET, radius)


class Shell(VGroup):
    def __init__(self, z, counts, position=ORIGIN, color=GOLD):
        super().__init__()
        self.z = z
        self.radii = [.44,.86,1.28]
        self.rings = VGroup(*[Circle(radius=self.radii[i], color=color,
                            stroke_width=1.6,fill_opacity=0).set_stroke(opacity=.42)
                            for i in range(len(counts))])
        self.nucleus = signed_particle(str(z)+r'^{+}',color,radius=.29)
        self.electrons = VGroup()
        self.by_shell = []
        for i, count in enumerate(counts):
            dots = VGroup()
            slots = 2 if i == 0 else 8
            for k in range(count):
                angle = TAU*k/slots + (PI/2 if i == 0 else 0)
                dots.add(electron(self.radii[i]*np.array([math.cos(angle),math.sin(angle),0]),.052))
            self.electrons.add(*dots)
            self.by_shell.append(dots)
        self.add(self.rings,self.nucleus,self.electrons)
        self.shift(position)


def ion(symbol, sign, color, position=ORIGIN, radius=.47):
    result = dot_atom('',color,radius,position)
    result.add(mathtex(r'\mathrm{'+symbol+'}^{'+sign+'}',29,color).move_to(position))
    return result


def cloud(center=ORIGIN, width=2.4, height=1.1):
    return VGroup(*[Ellipse(width=width*(1+.07*i),height=height*(1+.09*i),
                    stroke_width=0,fill_color=VIOLET,fill_opacity=.035+.008*(6-i))
                    .move_to(center) for i in range(7)])


class ElectronMaster(MasterFilm):
    number = 3
    topic = 'Elektroner och bindningar'
    slug = '03-elektroner'

    def construct(self):
        with self.beat('Tre partiklar, tre laddningar',
            'Protonen är positiv, elektronen negativ och neutronen oladdad. Protoner och neutroner finns i kärnan. Elektroner finns utanför kärnan.',seconds=14):
            points=[[-4.5,.55,0],[0,.55,0],[4.5,.55,0]]
            colors=[GOLD,VIOLET,BLUE]
            particles=VGroup(*[signed_particle(s,c,p,.63) for s,c,p in zip(['+','-','0'],colors,points)])
            names=VGroup(*[label(w,[p[0],1.85,0],c,35) for w,p,c in zip(['proton','elektron','neutron'],points,colors)])
            self.play(LaggedStart(*[GrowFromCenter(p) for p in particles],lag_ratio=.25),
                      LaggedStart(*[Write(n) for n in names],lag_ratio=.25),run_time=2.6)
            key=VGroup(*[label(w,[p[0],-1.0,0],INK,28) for w,p in zip(['positiv laddning','negativ laddning','ingen laddning'],points)])
            self.play(LaggedStart(*[FadeIn(t,shift=UP*.15) for t in key],lag_ratio=.25),run_time=2)
            core_box=RoundedRectangle(width=5.6,height=1.1,corner_radius=.18,color=BLUE,stroke_width=1.6).move_to([0,-2.15,0])
            core_text=label('Kärnan: protoner och neutroner',[0,-2.15,0],BLUE,30)
            self.play(Create(core_box),Write(core_text),run_time=1.8)
            for index in [0,2,1]:
                self.play(Indicate(particles[index],color=colors[index],scale_factor=1.17),
                          Circumscribe(key[index],color=colors[index],buff=.12),run_time=1.8)

        with self.beat('En neutral atom har lika många plus och minus',
            'En neutral natriumatom har elva protoner och elva elektroner. Lika mycket positiv och negativ laddning ger tillsammans laddningen noll.',seconds=14,clear=True):
            na=Shell(11,[2,8,1],[-3.9,.15,0])
            self.play(Create(na.rings),GrowFromCenter(na.nucleus),run_time=1.5)
            self.play(LaggedStart(*[FadeIn(e,scale=.1) for e in na.electrons],lag_ratio=.08),run_time=2)
            na_name=mathtex(r'\mathrm{Na}',42,GOLD).move_to([-3.9,2.1,0])
            self.play(Write(na_name),run_time=.8)
            plus=VGroup(*[signed_particle('+',GOLD,[.25+(i%6)*.72,1.15-(i//6)*.68,0],.19) for i in range(11)])
            minus=VGroup(*[signed_particle('-',VIOLET,[.25+(i%6)*.72,-.55-(i//6)*.68,0],.19) for i in range(11)])
            self.play(LaggedStart(*[GrowFromCenter(p) for p in plus],lag_ratio=.06),
                      Write(label('11 protoner',[2.05,1.95,0],GOLD,29)),run_time=1.6)
            self.play(LaggedStart(*[GrowFromCenter(p) for p in minus],lag_ratio=.06),
                      Write(label('11 elektroner',[2.05,-1.85,0],VIOLET,29)),run_time=1.6)
            links=VGroup(*[Line(p.get_center(),m.get_center(),color=MUTED,stroke_width=1).set_opacity(.24) for p,m in zip(plus,minus)])
            self.play(LaggedStart(*[Create(link) for link in links],lag_ratio=.08),run_time=1.6)
            balance=mathtex(r'11-11=0',42,TEAL).move_to([-3.9,-1.85,0])
            self.play(Write(balance),run_time=1.4)
            self.play(Indicate(balance,color=TEAL),na.nucleus.animate.scale(1.08),rate_func=there_and_back,run_time=2)

        with self.beat('Följ elektronen längst ut',
            'Natriums elektroner är fördelade två, åtta och en. Vi markerar den yttersta elektronen. Den får huvudrollen när natrium bildar en jon.',seconds=14):
            self.clear_stage()
            na=Shell(11,[2,8,1],[-3.9,.15,0]);self.add(na)
            na_name=mathtex(r'\mathrm{Na}',42,GOLD).move_to([-3.9,2.1,0]);self.add(na_name)
            counts=VGroup(*[mathtex(str(n),44,c).move_to([x,.55,0]) for n,x,c in zip([2,8,1],[.25,2.2,4.15],[MUTED,MUTED,VIOLET])])
            words=VGroup(*[label(w,[x,-.25,0],c,25) for w,x,c in zip(['innerst','nästa skal','ytterst'],[.25,2.2,4.15],[MUTED,MUTED,VIOLET])])
            self.play(LaggedStart(*[Write(t) for t in counts],lag_ratio=.24),FadeIn(words),run_time=2.4)
            for i in range(3):
                self.play(Indicate(na.by_shell[i],color=VIOLET),Indicate(counts[i],color=VIOLET),run_time=1.7)
            tracked=na.electrons[-1]
            focus=Circle(radius=.19,color=VIOLET,stroke_width=3).move_to(tracked)
            link=arrow(focus.get_right(),[.2,-1.3,0],VIOLET)
            caption=label('En elektron kan flyttas',[2.3,-1.3,0],VIOLET,31)
            self.play(Create(focus),GrowArrow(link),Write(caption),run_time=2)
            same=label('Kärnans 11 protoner finns kvar',[-2.15,-2.2,0],GOLD,29)
            self.play(Write(same),Circumscribe(na.nucleus,color=GOLD),run_time=1.8)

        with self.beat('En elektron flyttar: två joner bildas',
            'Natrium lämnar en elektron till klor. Natrium får laddningen plus ett och klor minus ett. Antalet protoner ändras inte.',seconds=14):
            self.play(FadeOut(counts),FadeOut(words),FadeOut(focus),FadeOut(link),FadeOut(caption),FadeOut(same),run_time=.7)
            cl=Shell(17,[2,8,7],[3.9,.15,0],TEAL)
            cl_name=mathtex(r'\mathrm{Cl}',42,TEAL).move_to([3.9,2.1,0])
            left_count=mathtex(r'11p^{+}\quad11e^{-}',31,INK).move_to([-3.9,-1.65,0])
            right_count=mathtex(r'17p^{+}\quad17e^{-}',31,INK).move_to([3.9,-1.65,0])
            self.play(FadeIn(cl),Write(cl_name),Write(left_count),Write(right_count),run_time=1.9)
            moving=na.electrons[-1]
            target=cl.get_center()+1.28*np.array([math.cos(7*TAU/8),math.sin(7*TAU/8),0])
            path=CubicBezier(moving.get_center(),[-1.5,2.5,0],[1.25,2.5,0],target)
            trace=TracedPath(moving.get_center,stroke_color=VIOLET,stroke_width=4,dissipating_time=.9)
            moving_tag=mathtex(r'e^{-}',29,VIOLET).next_to(moving,UP,buff=.13)
            moving_tag.add_updater(lambda m:m.next_to(moving,UP,buff=.13))
            self.add(trace,moving_tag)
            self.play(MoveAlongPath(moving,path),run_time=4,rate_func=smooth)
            moving_tag.clear_updaters();trace.clear_updaters()
            self.play(FadeOut(moving_tag),FadeOut(trace),
                TransformMatchingTex(left_count,mathtex(r'11p^{+}\quad10e^{-}',31).move_to(left_count)),
                TransformMatchingTex(right_count,mathtex(r'17p^{+}\quad18e^{-}',31).move_to(right_count)),run_time=1.6)
            self.play(TransformMatchingTex(na_name,mathtex(r'\mathrm{Na}^{+}',46,GOLD).move_to(na_name)),
                      TransformMatchingTex(cl_name,mathtex(r'\mathrm{Cl}^{-}',46,TEAL).move_to(cl_name)),run_time=1.4)
            total=label('Samma protoner. Samma totala antal elektroner.',[0,-2.35,0],INK,28)
            self.play(Write(total),Indicate(na.nucleus,color=GOLD),Indicate(cl.nucleus,color=TEAL),run_time=1.8)
            self.play(Circumscribe(na_name,color=GOLD),Circumscribe(cl_name,color=TEAL),run_time=1.1)

        with self.beat('Olika laddningar håller ihop en jonkristall',
            'Positiva och negativa joner attraherar varandra. I vanligt salt finns många natriumjoner och kloridjoner i ett sammanhängande gitter.',seconds=14,clear=True):
            a=ion('Na','+',GOLD,[-3,.4,0],.65);b=ion('Cl','-',TEAL,[3,.4,0],.65)
            self.play(GrowFromCenter(a),GrowFromCenter(b),run_time=1.3)
            arrows=VGroup(arrow([-2.1,.4,0],[-.55,.4,0],GOLD),arrow([2.1,.4,0],[.55,.4,0],TEAL))
            self.play(GrowArrow(arrows[0]),GrowArrow(arrows[1]),run_time=1.4)
            self.play(a.animate.move_to([-1,.4,0]),b.animate.move_to([1,.4,0]),FadeOut(arrows),run_time=2.2)
            self.play(FadeOut(a),FadeOut(b),run_time=.5)
            lattice=VGroup();targets=[]
            for row in range(3):
                for col in range(4):
                    positive=(row+col)%2==0
                    pos=np.array([(col-1.5)*1.5+(row-1)*.28,(row-1)*1.02+.25,0])
                    targets.append(pos)
                    lattice.add(ion('Na' if positive else 'Cl','+' if positive else '-',GOLD if positive else TEAL,
                                    pos+np.array([.15*math.sin(col+row),.28*math.cos(2*col-row),0]),.39))
            self.play(LaggedStart(*[FadeIn(p,scale=.4) for p in lattice],lag_ratio=.06),run_time=1.8)
            self.play(*[p.animate.move_to(target) for p,target in zip(lattice,targets)],run_time=2.1)
            edges=VGroup()
            for row in range(3):
                for col in range(4):
                    index=row*4+col
                    for other in ([index+1] if col<3 else [])+([index+4] if row<2 else []):
                        edges.add(Line(targets[index],targets[other],color=MUTED,stroke_width=1.5).set_opacity(.28))
            edges.set_z_index(-1)
            self.play(LaggedStart(*[Create(e) for e in edges],lag_ratio=.04),Write(label('NaCl: en jonkristall',[0,-2.0,0],INK,35)),run_time=1.7)
            self.play(Indicate(lattice[5],color=GOLD),Indicate(VGroup(lattice[1],lattice[4],lattice[6],lattice[9]),color=TEAL),run_time=1.5)

        with self.beat('Två väteatomer kan dela ett elektronpar',
            'Två väteatomer kan dela sina elektroner. Det delade elektronparet håller samman väteatomerna i en molekyl. En vätemolekyl skrivs H₂.',seconds=14,clear=True):
            left=signed_particle('+',GOLD,[-2,.45,0],.36);right=signed_particle('+',GOLD,[2,.45,0],.36)
            e1=electron([-1.3,.45,0],.10);e2=electron([1.3,.45,0],.10)
            hlabels=VGroup(mathtex(r'\mathrm H',37).move_to([-2,1.45,0]),mathtex(r'\mathrm H',37).move_to([2,1.45,0]))
            self.play(FadeIn(left),FadeIn(right),FadeIn(e1),FadeIn(e2),Write(hlabels),run_time=1.8)
            self.play(left.animate.move_to([-.85,.45,0]),right.animate.move_to([.85,.45,0]),
                      hlabels[0].animate.move_to([-.85,1.45,0]),hlabels[1].animate.move_to([.85,1.45,0]),run_time=2.1)
            shared=cloud([0,.45,0],2.5,1.05);shared.set_z_index(-1)
            self.play(LaggedStart(*[GrowFromCenter(c) for c in shared],lag_ratio=.09),
                      e1.animate.move_to([-.14,.61,0]),e2.animate.move_to([.14,.29,0]),run_time=2.4)
            brace=BraceBetweenPoints([-1.15,-.4,0],[1.15,-.4,0],direction=DOWN,color=VIOLET)
            shared_label=label('delat elektronpar',[0,-1.23,0],VIOLET,34)
            self.play(GrowFromCenter(brace),Write(shared_label),run_time=1.7)
            self.play(Indicate(VGroup(e1,e2),color=VIOLET),Indicate(left,color=GOLD),Indicate(right,color=GOLD),run_time=1.8)
            h2=mathtex(r'\mathrm{H}_2',48,INK).move_to([0,-2.15,0])
            self.play(TransformFromCopy(hlabels,h2),run_time=1.4)
            self.play(shared.animate.set_opacity(.65),rate_func=there_and_back,run_time=1.6)

        with self.beat('Överföra eller dela -- två sätt att binda',
            'Vid jonbindning attraherar olika laddningar varandra. Vid elektronparbindning delas elektroner. Elektronerna är viktiga för bindningen, medan atomkärnorna finns kvar.',seconds=14,clear=True):
            divider=Line([0,2.1,0],[0,-2.35,0],color=MUTED,stroke_width=1).set_opacity(.4)
            self.play(Create(divider),Write(label('Jonbindning',[-3.6,1.9,0],GOLD,36)),
                      Write(label('Elektronparbindning',[3.6,1.9,0],VIOLET,36)),run_time=1.6)
            pair=VGroup(ion('Na','+',GOLD,[-4.5,.35,0],.55),ion('Cl','-',TEAL,[-2.6,.35,0],.55))
            hpair=VGroup(dot_atom('H',HYDROGEN,.43,[2.7,.35,0]),dot_atom('H',HYDROGEN,.43,[4.5,.35,0]))
            shared=cloud([3.6,.35,0],2.2,.9);shared.set_z_index(-1)
            electrons=VGroup(electron([3.47,.5,0]),electron([3.73,.2,0]))
            self.play(LaggedStart(*[GrowFromCenter(p) for p in pair],lag_ratio=.25),
                      LaggedStart(*[GrowFromCenter(p) for p in hpair],lag_ratio=.25),run_time=2)
            self.play(FadeIn(shared),FadeIn(electrons),
                      GrowArrow(arrow([-3.88,.35,0],[-3.3,.35,0],GOLD)),
                      GrowArrow(arrow([-3.22,.35,0],[-3.8,.35,0],TEAL)),run_time=1.8)
            a=label('olika laddningar',[-3.6,-.95,0],INK,32)
            b=label('ett par delas',[3.6,-.95,0],INK,32)
            self.play(Write(a),Write(b),run_time=1.5)
            self.play(Circumscribe(pair,color=GOLD),Circumscribe(electrons,color=VIOLET),run_time=2)
            conclusion=label('Elektroner flyttas eller delas. Kärnorna finns kvar.',[0,-2.25,0],TEAL,32)
            self.play(Write(conclusion),run_time=2)
            self.play(Indicate(conclusion,color=TEAL),run_time=1.5)
        self.finish('En jon har olika många protoner och elektroner. Joner hålls ihop av olika laddningar. Atomer kan dela elektronpar.')


def tracked_atom(element, identity, point, radius=None):
    color = HYDROGEN if element == 'H' else OXYGEN
    radius = radius or (.36 if element == 'H' else .44)
    result = dot_atom('',color,radius,point)
    result.add(mathtex(r'\mathrm{'+element+r'}',30,color).move_to(point))
    badge_position=np.array(point)+np.array([radius*.88,radius+.17,0])
    badge=VGroup(Circle(radius=.17,color=color,fill_color=BG,fill_opacity=1,stroke_width=1.5),
                 mathtex(str(identity),20,INK)).move_to(badge_position)
    result.add(badge,Circle(radius=radius+.38,stroke_opacity=0,fill_opacity=0).move_to(point))
    result.atom_identity=(element,identity)
    # An invisible symmetric bound keeps move_to/bond centres on the atom,
    # rather than on the off-centre identification badge.
    return result


def bond(a,b,color=MUTED,width=4,buff=.36):
    return Line(a.get_center(),b.get_center(),buff=buff,color=color,stroke_width=width).set_z_index(-2)


class ReactionMaster(MasterFilm):
    number = 4
    topic = 'Fysikaliska och kemiska förändringar'
    slug = '04-forandringar'

    def construct(self):
        with self.beat('En förändring syns -- men vad ändras?',
            'När is smälter ändras vattnets tillstånd. Vid en kemisk reaktion bildas nya ämnen. Molekylerna hjälper oss att se skillnaden.',seconds=14):
            ice=Polygon([-4.8,-.8,0],[-3.2,-1.2,0],[-1.9,-.2,0],[-2.1,1.4,0],[-3.8,1.7,0],[-5, .6,0],
                        color=BLUE,fill_color=BLUE,fill_opacity=.18,stroke_width=3)
            facet=VGroup(Line([-4.8,-.8,0],[-3.6,.3,0],color=BLUE),Line([-3.6,.3,0],[-2.1,1.4,0],color=BLUE),
                         Line([-3.6,.3,0],[-3.2,-1.2,0],color=BLUE)).set_opacity(.45)
            ice_caption=label('is',[-3.5,-1.9,0],BLUE,37)
            self.play(DrawBorderThenFill(ice),Create(facet),Write(ice_caption),run_time=2)
            water=molecule2d([3.7,.35,0],scale=1.55)
            zoom=Circle(radius=1.55,color=TEAL,stroke_width=2.5).move_to([3.7,.3,0])
            self.play(Create(zoom),GrowArrow(arrow([-1.6,.35,0],[1.9,.35,0],TEAL)),run_time=1.8)
            self.play(LaggedStart(*[GrowFromCenter(part) for part in water[1:]],lag_ratio=.2),Create(water[0]),run_time=2)
            formula_h2o=mathtex(r'\mathrm{H}_2\mathrm O',46,INK).move_to([3.7,-1.9,0])
            self.play(Write(formula_h2o),run_time=1.2)
            self.play(Circumscribe(water[1],color=OXYGEN),Circumscribe(VGroup(water[2],water[3]),color=HYDROGEN),run_time=2)
            self.play(ice.animate.stretch(.38,1).shift(DOWN*.55),FadeOut(facet),
                      Transform(ice_caption,label('flytande vatten',[-3.5,-1.9,0],TEAL,33)),run_time=1.7)
            unchanged=label('Samma vattenmolekyl',[0,-2.55,0],TEAL,34)
            self.play(Write(unchanged),Indicate(water[0],color=TEAL),run_time=1.7)

        with self.beat(r'Is, flytande vatten och gas -- fortfarande H$_2$O',
            'Vid ett fasbyte finns samma vattenmolekyler kvar. Molekylernas rörelse och placering ändras. Bindningarna inne i varje vattenmolekyl finns kvar.',seconds=14,clear=True):
            molecules=VGroup(*[molecule2d([-3.6+(i%3)*1.2,.85-(i//3)*1.4,0],.64) for i in range(6)])
            phase=label('is',[3.6,.4,0],BLUE,47)
            constant=mathtex(r'6\,\mathrm{H}_2\mathrm O',39,INK).move_to([3.6,-1,0])
            self.play(LaggedStart(*[FadeIn(m,scale=.5) for m in molecules],lag_ratio=.09),Write(phase),Write(constant),run_time=1.8)
            self.play(*[m.animate.shift(UP*.07 if i%2 else DOWN*.07) for i,m in enumerate(molecules)],rate_func=there_and_back,run_time=1.7)
            liquid_positions=[[-4,.8,0],[-2.4,.45,0],[-.8,.9,0],[-3.5,-.7,0],[-1.9,-.9,0],[-.45,-.5,0]]
            self.play(*[m.animate.move_to(p).rotate((i%3-1)*.24) for i,(m,p) in enumerate(zip(molecules,liquid_positions))],
                Transform(phase,label('flytande vatten',[3.6,.4,0],TEAL,38)),run_time=2.4)
            self.play(molecules[1].animate.shift([.25,-.15,0]),molecules[4].animate.shift([-.25,.15,0]),run_time=1.4)
            gas_positions=[[-5.5,1.45,0],[-2.65,1.6,0],[.1,1.5,0],[-5.15,-1.15,0],[-2.15,-1.35,0],[.5,-1.0,0]]
            self.play(*[m.animate.move_to(p).rotate((i%2*2-1)*.8) for i,(m,p) in enumerate(zip(molecules,gas_positions))],
                Transform(phase,label('vattenånga',[3.6,.4,0],CORAL,40)),run_time=2.5)
            self.play(Circumscribe(molecules[1][0],color=TEAL),Indicate(constant,color=TEAL),run_time=1.8)
            self.play(Write(label('Inga nya ämnen',[2.8,-2.35,0],TEAL,34)),run_time=1.5)

        with self.beat('Före reaktionen: identifiera varje atom',
            'Här finns två vätemolekyler och en syrgasmolekyl. Vi ger varje atom ett nummer, så att samma atomer kan följas genom förändringen.',seconds=14,clear=True):
            points=[[-5.4,.45,0],[-4.1,.45,0],[-2.3,.45,0],[-1,.45,0],[2.4,.45,0],[3.8,.45,0]]
            atoms=[tracked_atom('H',i+1,p) for i,p in enumerate(points[:4])]+[tracked_atom('O',i+1,p) for i,p in enumerate(points[4:])]
            old_bonds=VGroup(bond(atoms[0],atoms[1]),bond(atoms[2],atoms[3]),bond(atoms[4],atoms[5],buff=.44))
            self.play(LaggedStart(*[GrowFromCenter(a) for a in atoms],lag_ratio=.15),run_time=2.4)
            self.play(LaggedStart(*[Create(b) for b in old_bonds],lag_ratio=.24),run_time=1.5)
            molecule_names=VGroup(mathtex(r'\mathrm H_2',38,HYDROGEN).move_to([-4.75,-.65,0]),
                mathtex(r'\mathrm H_2',38,HYDROGEN).move_to([-1.65,-.65,0]),
                mathtex(r'\mathrm O_2',38,OXYGEN).move_to([3.1,-.65,0]))
            self.play(LaggedStart(*[Write(n) for n in molecule_names],lag_ratio=.25),run_time=1.5)
            count=mathtex(r'\mathrm H:4\qquad\mathrm O:2\qquad\text{atomer: }6',35,INK).move_to([0,-2.25,0])
            molecule_count=label('Före: tre molekyler',[0,2.2,0],TEAL,35)
            identity_hint=label('Numret hjälper oss följa atomen',[0,1.62,0],MUTED,26)
            self.play(Write(molecule_count),Write(identity_hint),Write(count),run_time=1.8)
            self.play(LaggedStart(*[Indicate(a,color=HYDROGEN) for a in atoms[:4]],lag_ratio=.18),run_time=2)
            self.play(LaggedStart(*[Indicate(a,color=OXYGEN) for a in atoms[4:]],lag_ratio=.3),run_time=1.6)
            self.play(Circumscribe(count,color=TEAL),run_time=1.5)

        with self.beat('Samma atomer får nya grannar',
            'Atomerna försvinner inte. De grupperas om när gamla bindningar ersätts av nya. Varje syreatom binds nu till två väteatomer.',seconds=14):
            self.play(FadeOut(molecule_names),FadeOut(molecule_count),FadeOut(identity_hint),Uncreate(old_bonds),run_time=1.2)
            targets=[[-3.4,-.15,0],[-1.4,-.15,0],[1.4,-.15,0],[3.4,-.15,0],[-2.4,.65,0],[2.4,.65,0]]
            paths=[]
            for i,(a,target) in enumerate(zip(atoms,targets)):
                origin=a.get_center();target=np.array(target)
                arc=1.45 if i>=4 else -.75-(i%2)*.35
                paths.append(CubicBezier(origin,origin+UP*arc,target+UP*arc,target))
            traces=VGroup(*[TracedPath(a.get_center,stroke_color=HYDROGEN if i<4 else OXYGEN,
                       stroke_width=3.2,dissipating_time=.75) for i,a in enumerate(atoms)])
            self.add(traces)
            self.play(LaggedStart(*[MoveAlongPath(a,p) for a,p in zip(atoms,paths)],lag_ratio=.06),run_time=4.6,rate_func=smooth)
            traces.clear_updaters(recursive=True);self.play(FadeOut(traces),run_time=.5)
            new_bonds=VGroup(*[bond(atoms[o],atoms[h],buff=.39) for o,h in [(4,0),(4,1),(5,2),(5,3)]])
            self.play(LaggedStart(*[Create(b) for b in new_bonds],lag_ratio=.2),run_time=2)
            water_names=VGroup(mathtex(r'\mathrm H_2\mathrm O',39).move_to([-2.4,-1.1,0]),
                               mathtex(r'\mathrm H_2\mathrm O',39).move_to([2.4,-1.1,0]))
            molecule_count=label('Efter: två vattenmolekyler',[0,1.9,0],TEAL,35)
            self.play(Write(water_names),Write(molecule_count),run_time=1.5)
            self.play(Indicate(VGroup(atoms[4],atoms[0],atoms[1]),color=TEAL),
                      Indicate(VGroup(atoms[5],atoms[2],atoms[3]),color=TEAL),run_time=1.8)
            self.play(Circumscribe(count,color=TEAL),run_time=1.5)

        with self.beat('Reaktionsformeln berättar samma sak',
            'Två vätemolekyler och en syrgasmolekyl ger två vattenmolekyler. Före och efter finns fyra väteatomer och två syreatomer. Atomerna bevaras.',seconds=14):
            self.play(FadeOut(molecule_count),FadeOut(count),run_time=.6)
            equation=MathTex(r'2\mathrm H_2', '+',r'\mathrm O_2',r'\longrightarrow',r'2\mathrm H_2\mathrm O',
                             tex_template=TEMPLATE,font_size=45,color=INK).move_to([0,2.05,0])
            equation[0].set_color(HYDROGEN);equation[2].set_color(OXYGEN)
            self.play(LaggedStart(*[Write(part) for part in equation],lag_ratio=.18),run_time=2.5)
            before_label=label('Före',[-4.6,-1.5,0],MUTED,27);after_label=label('Efter',[4.6,-1.5,0],MUTED,27)
            before=mathtex(r'\mathrm H:4\quad\mathrm O:2',34).move_to([-4.6,-2.15,0])
            after=mathtex(r'\mathrm H:4\quad\mathrm O:2',34).move_to([4.6,-2.15,0])
            equals=mathtex('=',48,TEAL).move_to([0,-2.15,0])
            self.play(Write(before_label),Write(before),run_time=1.3)
            self.play(LaggedStart(*[Indicate(a,color=HYDROGEN) for a in atoms[:4]],lag_ratio=.17),run_time=2)
            self.play(LaggedStart(*[Indicate(a,color=OXYGEN) for a in atoms[4:]],lag_ratio=.3),run_time=1.5)
            self.play(Write(after_label),TransformFromCopy(before,after),Write(equals),run_time=1.6)
            self.play(Circumscribe(VGroup(before,equals,after),color=TEAL),run_time=1.8)
            self.play(Indicate(equation[-1],color=TEAL),Indicate(water_names,color=TEAL),run_time=1.6)

        with self.beat('Två vardagsexempel visar skillnaden',
            'När is smälter är ämnet fortfarande vatten. När kol förbränns reagerar kol med syrgas och bildar ett nytt ämne: koldioxid.',seconds=14,clear=True):
            divider=Line([0,2.0,0],[0,-2.5,0],color=MUTED,stroke_width=1).set_opacity(.35)
            left_title=label('Is smälter',[-3.7,1.95,0],BLUE,35)
            right_title=label('Kol förbränns',[3.7,1.95,0],CORAL,35)
            waters=VGroup(*[molecule2d([-4.4+(i%2)*1.45,.75-(i//2)*1.25,0],.58) for i in range(4)])
            carbon=dot_atom('C',GOLD,.4,[1.6,.3,0]);oa=dot_atom('O',OXYGEN,.4,[4.1,.3,0]);ob=dot_atom('O',OXYGEN,.4,[5.3,.3,0])
            oxygen_bond=bond(oa,ob,buff=.4)
            self.play(Create(divider),Write(left_title),Write(right_title),FadeIn(waters),
                      GrowFromCenter(carbon),GrowFromCenter(oa),GrowFromCenter(ob),Create(oxygen_bond),run_time=2)
            physical=label('Fysikalisk förändring',[-3.7,-1.85,0],BLUE,30)
            chemical=label('Kemisk reaktion',[3.7,-1.85,0],CORAL,30)
            self.play(Write(physical),Write(chemical),run_time=1.5)
            self.play(*[m.animate.shift([(.18 if i%2 else -.18),(.15 if i<2 else -.15),0]).rotate((i%2*2-1)*.25) for i,m in enumerate(waters)],
                      Uncreate(oxygen_bond),run_time=2.2)
            self.play(carbon.animate.move_to([3.7,.3,0]),oa.animate.move_to([2.5,.3,0]),ob.animate.move_to([4.9,.3,0]),run_time=2.3)
            co_bonds=VGroup(*[Line(a.get_center()+UP*d,b.get_center()+UP*d,buff=.4,color=MUTED,stroke_width=3).set_z_index(-2)
                       for a,b in [(oa,carbon),(carbon,ob)] for d in [-.075,.075]])
            self.play(LaggedStart(*[Create(b) for b in co_bonds],lag_ratio=.17),run_time=1.6)
            final_formula=mathtex(r'\mathrm{CO}_2',40,INK).move_to([3.7,-.8,0])
            self.play(Write(final_formula),Write(label(r'H$_2$O finns kvar',[-3.7,-2.5,0],TEAL,27)),run_time=1.3)
            self.play(Flash(carbon.get_center(),color=GOLD,flash_radius=.65),
                      Circumscribe(waters[0][0],color=TEAL),run_time=1.6)

        with self.beat('Fråga vad som finns kvar och vad som ändras',
            'Vid fasbyte är molekylerna oförändrade. Vid kemiska reaktioner bildas nya ämnen genom att atomer omgrupperas. Atomerna finns kvar i båda fallen.',seconds=14):
            same=label('samma ämne',[-3.7,-1.15,0],TEAL,32)
            new=label('nytt ämne',[3.7,1.15,0],TEAL,32)
            self.play(waters.animate.scale(.8).shift(UP*.35),FadeIn(same,shift=UP*.2),Write(new),run_time=1.9)
            self.play(LaggedStart(*[Indicate(m[0],color=TEAL) for m in waters],lag_ratio=.2),run_time=2.1)
            self.play(Indicate(carbon,color=GOLD),Indicate(VGroup(oa,ob),color=OXYGEN),run_time=2)
            self.play(Circumscribe(physical,color=BLUE),Circumscribe(chemical,color=CORAL),run_time=1.8)
            self.play(FadeOut(same),FadeOut(new),FadeOut(physical),FadeOut(chemical),run_time=.7)
            takeaway=label('Atomerna bevaras',[0,-1.85,0],TEAL,43)
            self.play(Write(takeaway),run_time=1.8)
            self.play(Circumscribe(takeaway,color=TEAL),
                      Indicate(waters,color=BLUE),Indicate(VGroup(carbon,oa,ob),color=CORAL),run_time=2)
        self.finish('Fasbyte ändrar tillstånd. En kemisk reaktion bildar nya ämnen. Följ atomerna: de försvinner inte när molekylerna förändras.')
