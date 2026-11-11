"""New, five-step explanations for the first chemistry course in year seven.

Large TeX labels, conserved objects and slow, causal motion. These scenes use
original choreography, inspired by linked visual explanations in 3b1b/videos.
No third-party scene code is copied; there is no narration or sound call.
"""
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from shared import *


def charge(sign,color,pos,radius=.57):
    return VGroup(Circle(radius=radius*1.15,stroke_width=0,fill_color=color,fill_opacity=.04),
        Circle(radius=radius,color=color,stroke_width=2.5,fill_color=color,fill_opacity=.14),
        mathtex(sign,size=58*radius/.57,color=color)).move_to(pos)


def shared_region(pos,width=2.65,height=1.2):
    return VGroup(*[Ellipse(width=width*(1+i*.07),height=height*(1+i*.09),
        stroke_width=0,fill_color=BLUE,fill_opacity=.04+.006*(5-i)).move_to(pos)
        for i in range(6)]).set_z_index(-2)


class ElectronMaster(MasterFilm):
    number=3
    topic='Elektroner, laddning och bindning'
    slug='03-elektroner'

    def construct(self):
        with self.beat('Plus, minus och ingen laddning',
            'Protoner har plus. Elektroner har minus. Neutroner har ingen laddning.',seconds=16):
            p=charge('+',GOLD,[-4.5,.35,0],.72)
            e=charge('-',BLUE,[0,.35,0],.72)
            n=charge('0',MUTED,[4.5,.35,0],.72)
            names=VGroup(label('proton',[-4.5,-1.2,0],color=GOLD),
                label('elektron',[0,-1.2,0],color=BLUE),label('neutron',[4.5,-1.2,0],color=MUTED))
            self.play(LaggedStart(GrowFromCenter(p),GrowFromCenter(e),GrowFromCenter(n),lag_ratio=.25),run_time=2.1)
            self.play(LaggedStart(*[Write(t) for t in names],lag_ratio=.25),run_time=2)
            focus=SurroundingRectangle(p,buff=.23,color=GOLD,corner_radius=.2,stroke_width=2)
            self.play(Create(focus),run_time=1.4)
            self.play(Transform(focus,SurroundingRectangle(e,buff=.23,color=BLUE,corner_radius=.2,stroke_width=2)),run_time=3)
            self.play(Transform(focus,SurroundingRectangle(n,buff=.23,color=MUTED,corner_radius=.2,stroke_width=2)),run_time=3)
            no_charge=label('ingen laddning',[4.5,-2.05,0],size=40,color=MUTED)
            self.play(Write(no_charge),run_time=1.8)
            self.play(FadeOut(focus),run_time=1.2)

        with self.beat('En oladdad väteatom',
            'En proton och en elektron tar ut varandras laddningar. Atomen är neutral, alltså oladdad.',seconds=16):
            self.play(FadeOut(n),FadeOut(names),FadeOut(no_charge),run_time=1.1)
            self.play(p.animate.scale(.76).move_to([-3.5,.35,0]),
                      e.animate.scale(.46).move_to([-1.7,.35,0]),run_time=2.4)
            region=Circle(radius=1.8,color=BLUE,stroke_width=1.5,fill_opacity=0).set_stroke(opacity=.34).move_to([-3.5,.35,0])
            atom_name=label('väteatom',[-3.5,-2.1,0],size=47)
            self.play(Create(region),Write(atom_name),run_time=1.6)
            balance=formula(r'+1-1=0',[3.2,.5,0],size=72,color=TEAL)
            balance_word=label('neutral = oladdad',[3.2,-.8,0],size=43,color=TEAL)
            self.play(Write(balance),run_time=2.3)
            self.play(Write(balance_word),run_time=1.6)
            links=VGroup(arrow([-2.9,1.1,0],[1.5,.8,0],GOLD),arrow([-1.4,-.1,0],[1.5,.2,0],BLUE))
            self.play(GrowArrow(links[0]),GrowArrow(links[1]),run_time=1.8)
            self.play(Circumscribe(balance,color=TEAL,buff=.2),run_time=1.7)
            self.play(FadeOut(links),run_time=1)

        with self.beat('En laddad atom kallas jon',
            'När elektronen lämnar finns plus kvar. En laddad atom kallas jon.',seconds=16):
            self.play(FadeOut(balance),FadeOut(balance_word),run_time=1.1)
            target=np.array([4.4,.35,0])
            path=CubicBezier(e.get_center(),[-.7,2,0],[2.9,2,0],target)
            trail=TracedPath(e.get_center,stroke_color=BLUE,stroke_width=4,dissipating_time=.9)
            self.add(trail)
            self.play(MoveAlongPath(e,path),run_time=4.7,rate_func=smooth)
            trail.clear_updaters();self.play(FadeOut(trail),FadeOut(region),run_time=1)
            ion_name=label('vätejon',[-3.5,-2.1,0],size=47,color=GOLD)
            self.play(Transform(atom_name,ion_name),
                      Write(formula(r'\mathrm{H}^{+}',[-3.5,-.95,0],size=66,color=GOLD)),run_time=2.2)
            electron_word=label('elektronen finns kvar',[4.2,-1.15,0],size=40,color=BLUE,width=6)
            self.play(Write(electron_word),run_time=1.6)
            nucleus_word=label('Samma proton finns kvar.',[0,2.0,0],size=42,color=GOLD)
            self.play(Write(nucleus_word),Circumscribe(p,color=GOLD,buff=.2),run_time=2)
            self.play(Indicate(e,color=BLUE,scale_factor=1.1),run_time=1.5)

        with self.beat('Två atomer kan dela ett elektronpar',
            'Två väteatomer delar två elektroner. Paret dras till båda kärnorna och håller ihop atomerna.',seconds=16,clear=True):
            a=charge('+',GOLD,[-2.5,.35,0],.43);b=charge('+',GOLD,[2.5,.35,0],.43)
            ea=charge('-',BLUE,[-1.6,.35,0],.25);eb=charge('-',BLUE,[1.6,.35,0],.25)
            hnames=VGroup(formula(r'\mathrm H',[-2.5,1.65,0],size=55),formula(r'\mathrm H',[2.5,1.65,0],size=55))
            self.play(FadeIn(a),FadeIn(b),FadeIn(ea),FadeIn(eb),Write(hnames),run_time=1.9)
            self.play(a.animate.move_to([-.96,.35,0]),b.animate.move_to([.96,.35,0]),
                      hnames[0].animate.move_to([-.96,1.65,0]),hnames[1].animate.move_to([.96,1.65,0]),run_time=3)
            shared=shared_region([0,.35,0]);self.add(shared)
            self.play(LaggedStart(*[GrowFromCenter(c) for c in shared],lag_ratio=.12),
                      ea.animate.move_to([-.17,.55,0]),eb.animate.move_to([.17,.15,0]),run_time=3.2)
            brace=BraceBetweenPoints([-1.2,-.55,0],[1.2,-.55,0],direction=DOWN,color=BLUE)
            pair_word=label('två elektroner = ett par',[0,-1.5,0],size=43,color=BLUE)
            self.play(GrowFromCenter(brace),Write(pair_word),run_time=1.9)
            self.play(Circumscribe(VGroup(ea,eb),color=BLUE,buff=.2),run_time=2)
            molecule_name=formula(r'\mathrm H_2',[0,-2.35,0],size=58)
            self.play(Write(molecule_name),run_time=1.6)
            self.play(Indicate(VGroup(a,b),color=GOLD,scale_factor=1.06),run_time=1.2)

        with self.beat('Flytta en elektron -- eller dela ett par',
            'En elektron kan flyttas bort. Två atomer kan också dela ett elektronpar.',seconds=16,clear=True):
            panels=VGroup(panel(6.8,4.4,[-3.7,.1,0],GOLD),panel(6.8,4.4,[3.7,.1,0],BLUE))
            headings=VGroup(label('Jon',[-3.7,1.85,0],size=49,color=GOLD),
                            label('Molekyl', [3.7,1.85,0],size=49,color=BLUE))
            left_p=charge('+',GOLD,[-4.4,.25,0],.47);left_e=charge('-',BLUE,[-2.3,.25,0],.26)
            right_p=VGroup(charge('+',GOLD,[2.75,.25,0],.37),charge('+',GOLD,[4.65,.25,0],.37))
            pair=VGroup(charge('-',BLUE,[3.53,.43,0],.22),charge('-',BLUE,[3.87,.07,0],.22))
            shared=shared_region([3.7,.25,0],2.45,1.05)
            self.play(Create(panels),Write(headings),run_time=2.2)
            self.play(FadeIn(left_p),FadeIn(left_e),FadeIn(right_p),run_time=1.7)
            left_arrow=arrow([-3.65,.25,0],[-2.8,.25,0],BLUE)
            self.play(GrowArrow(left_arrow),FadeIn(shared),FadeIn(pair),run_time=2.3)
            left_word=label('elektron flyttad',[-3.7,-1.25,0],size=43)
            right_word=label('elektronpar delas',[3.7,-1.25,0],size=43)
            self.play(Write(left_word),Write(right_word),run_time=2.2)
            self.play(Circumscribe(left_e,color=BLUE,buff=.17),run_time=1.7)
            self.play(Circumscribe(pair,color=BLUE,buff=.17),run_time=1.7)
            self.play(Write(label('Kärnorna finns kvar.',[0,-2.45,0],size=42,color=GOLD)),run_time=1.5)
            self.play(Indicate(VGroup(left_p,right_p),color=GOLD,scale_factor=1.05),run_time=1.2)
        self.finish('En jon är laddad. I en vätemolekyl delar två atomer ett elektronpar.')


def atom_bond(a,b,order=1):
    pa,pb=a.get_center(),b.get_center()
    direction=pb-pa;length=np.linalg.norm(direction)
    normal=np.array([-direction[1],direction[0],0])/max(length,.001)
    return VGroup(*[Line(pa+normal*d,pb+normal*d,buff=.44,color=MUTED,
                      stroke_width=5).set_z_index(-1)
                  for d in ([0] if order==1 else [-.065,.065])])


class ReactionMaster(MasterFilm):
    number=4
    topic='Samma ämne eller ett nytt ämne?'
    slug='04-forandringar'

    def construct(self):
        with self.beat('Börja med en vattenmolekyl',
            'Is består av vattenmolekyler. Varje vattenmolekyl har två väteatomer och en syreatom.',seconds=16):
            ice=Polygon([-5,-.8,0],[-3.3,-1.15,0],[-2.0,-.2,0],[-2.15,1.35,0],[-3.85,1.65,0],[-5.1,.55,0],
                        color=BLUE,stroke_width=3,fill_color=BLUE,fill_opacity=.13)
            facets=VGroup(Line([-5,-.8,0],[-3.65,.25,0],color=BLUE),Line([-3.65,.25,0],[-2.15,1.35,0],color=BLUE),
                          Line([-3.65,.25,0],[-3.3,-1.15,0],color=BLUE)).set_stroke(opacity=.45)
            ice_word=label('is',[-3.6,-2.0,0],size=52,color=BLUE)
            self.play(DrawBorderThenFill(ice),Create(facets),Write(ice_word),run_time=2.4)
            zoom=Circle(radius=1.8,color=TEAL,stroke_width=2).move_to([3.65,.35,0])
            lead=water([3.65,.35,0],scale=1.85)
            self.play(Create(zoom),GrowArrow(arrow([-1.7,.35,0],[1.6,.35,0],TEAL)),run_time=2.1)
            self.play(GrowFromCenter(lead[1]),run_time=1.5)
            self.play(LaggedStart(GrowFromCenter(lead[2]),GrowFromCenter(lead[3]),lag_ratio=.3),Create(lead[0]),run_time=2)
            molecule_formula=formula(r'\mathrm H_2\mathrm O',[3.65,-2.1,0],size=65)
            self.play(Write(molecule_formula),run_time=1.9)
            self.play(Circumscribe(lead[1],color=OXYGEN,buff=.12),run_time=1.7)
            self.play(Circumscribe(VGroup(lead[2],lead[3]),color=HYDROGEN,buff=.12),run_time=1.8)

        with self.beat('Is smälter -- molekylerna finns kvar',
            'När is smälter flyttar molekylerna på sig. De är fortfarande samma vattenmolekyler.',seconds=16,clear=True):
            waters=VGroup(*[water([x,.45,0],scale=1.3) for x in [-3.8,0,3.8]])
            state_word=label('is',[0,2.0,0],size=52,color=BLUE)
            same_formula=formula(r'\mathrm H_2\mathrm O',[0,-2.1,0],size=65)
            self.play(LaggedStart(*[FadeIn(m,shift=UP*.15) for m in waters],lag_ratio=.15),Write(state_word),run_time=2.1)
            self.play(Write(same_formula),run_time=1.5)
            self.play(drift(waters,[[-3.8,.45,0],[0,.45,0],[3.8,.45,0]],seconds=2,amplitude=.055),run_time=2)
            liquid_positions=[[-4.0,.75,0],[0,-.10,0],[4.0,.6,0]]
            self.play(*[m.animate.move_to(p).rotate((i-1)*.2) for i,(m,p) in enumerate(zip(waters,liquid_positions))],
                      Transform(state_word,label('flytande vatten',[0,2.0,0],size=49,color=TEAL)),run_time=3.2)
            self.play(drift(waters,liquid_positions,seconds=3,amplitude=.20),run_time=3)
            self.play(Circumscribe(waters[1][0],color=TEAL,buff=.17),Indicate(same_formula,color=TEAL,scale_factor=1.05),run_time=2.1)

        with self.beat('Före en kemisk reaktion',
            'Före reaktionen finns två vätemolekyler och en syrgasmolekyl. Följ de blå och röda atomerna.',seconds=16,clear=True):
            positions=[[-5.8,.45,0],[-4.25,.45,0],[-2.5,.45,0],[-.95,.45,0],[2.3,.45,0],[3.85,.45,0]]
            elements=['H','H','H','H','O','O']
            atoms=[atom(symbol,HYDROGEN if symbol=='H' else OXYGEN,pos,radius=.44 if symbol=='H' else .54)
                   for symbol,pos in zip(elements,positions)]
            old_bonds=VGroup(atom_bond(atoms[0],atoms[1]),atom_bond(atoms[2],atoms[3]),atom_bond(atoms[4],atoms[5],2))
            names=VGroup(formula(r'\mathrm H_2',[-5.025,-.95,0],size=56,color=HYDROGEN),
                         formula(r'\mathrm H_2',[-1.725,-.95,0],size=56,color=HYDROGEN),
                         formula(r'\mathrm O_2',[3.075,-.95,0],size=56,color=OXYGEN))
            self.play(LaggedStart(*[GrowFromCenter(a) for a in atoms],lag_ratio=.15),run_time=2.5)
            self.play(LaggedStart(*[Create(b) for b in old_bonds],lag_ratio=.25),run_time=1.8)
            self.play(LaggedStart(*[Write(n) for n in names],lag_ratio=.18),run_time=2)
            counter=label(f'{elements.count("H")} väteatomer · {elements.count("O")} syreatomer',[0,-2.3,0],size=44)
            self.play(Write(counter),run_time=1.8)
            self.play(LaggedStart(*[Indicate(a,color=HYDROGEN,scale_factor=1.08) for a in atoms[:4]],lag_ratio=.16),run_time=2)
            self.play(LaggedStart(*[Indicate(a,color=OXYGEN,scale_factor=1.08) for a in atoms[4:]],lag_ratio=.25),run_time=1.7)
            follow=Circle(radius=.74,color=TEAL,stroke_width=2.2).move_to(atoms[4])
            follow.add_updater(lambda m:m.move_to(atoms[4]))
            self.play(Create(follow),run_time=1.4)

        with self.beat('Samma atomer binds på ett nytt sätt',
            'I en reaktion grupperas atomerna om. Nya bindningar ger två vattenmolekyler.',seconds=16):
            self.play(FadeOut(names),Uncreate(old_bonds),run_time=1.4)
            targets=[[-3.5,-.2,0],[-1.3,-.2,0],[1.3,-.2,0],[3.5,-.2,0],[-2.4,.7,0],[2.4,.7,0]]
            paths=[]
            for i,(a,target) in enumerate(zip(atoms,targets)):
                start=a.get_center();target=np.array(target);height=1.4 if i>=4 else -.75-.18*(i%2)
                paths.append(CubicBezier(start,start+UP*height,target+UP*height,target))
            trails=VGroup(*[TracedPath(a.get_center,stroke_color=HYDROGEN if i<4 else OXYGEN,
                        stroke_width=3,dissipating_time=.85) for i,a in enumerate(atoms)])
            self.add(trails)
            self.play(LaggedStart(*[MoveAlongPath(a,p) for a,p in zip(atoms,paths)],lag_ratio=.07),run_time=4.8,rate_func=smooth)
            trails.clear_updaters(recursive=True);self.play(FadeOut(trails),run_time=.8)
            new_bonds=VGroup(*[atom_bond(atoms[o],atoms[h]) for o,h in [(4,0),(4,1),(5,2),(5,3)]])
            self.play(LaggedStart(*[Create(b) for b in new_bonds],lag_ratio=.2),run_time=2.2)
            product_names=VGroup(formula(r'\mathrm H_2\mathrm O',[-2.4,-1.3,0],size=59),
                                 formula(r'\mathrm H_2\mathrm O',[2.4,-1.3,0],size=59))
            self.play(Write(product_names),run_time=1.8)
            self.play(Circumscribe(counter,color=TEAL,buff=.15),run_time=1.9)
            self.play(Indicate(atoms[4],color=TEAL,scale_factor=1.08),run_time=1.6)

        with self.beat('Samma ämne -- eller ett nytt ämne?',
            'Is blir flytande vatten. Väte och syre kan reagera och bilda vatten, ett nytt ämne.',seconds=16):
            follow.clear_updaters();self.play(FadeOut(follow),FadeOut(counter),FadeOut(product_names),run_time=.8)
            panels=VGroup(panel(6.8,4.8,[-3.7,.1,0],BLUE),panel(6.8,4.8,[3.7,.1,0],CORAL))
            headings=VGroup(label(r'is $\rightarrow$ flytande vatten',[-3.7,1.9,0],size=43,color=BLUE,width=6.15),
                            label(r'väte + syre $\rightarrow$ vatten',[3.7,1.9,0],size=43,color=CORAL,width=6.15))
            self.play(Create(panels),Write(headings),run_time=1.9)
            first=VGroup(new_bonds[0],new_bonds[1],atoms[4],atoms[0],atoms[1])
            second=VGroup(new_bonds[2],new_bonds[3],atoms[5],atoms[2],atoms[3])
            physical=water([-3.7,.45,0],scale=1.5)
            self.play(first.animate.scale(.72).move_to([2.1,.45,0]),second.animate.scale(.72).move_to([5.25,.45,0]),
                      FadeIn(physical,shift=UP*.2),run_time=2.8)
            explanations=VGroup(label('fortfarande vatten',[-3.7,-1.2,0],size=43,color=BLUE,width=6.1),
                                label('vatten är det nya ämnet',[3.7,-1.2,0],size=42,color=CORAL,width=6.1))
            self.play(Write(explanations),run_time=1.8)
            self.play(drift(VGroup(physical),[[-3.7,.45,0]],seconds=3,amplitude=.12),run_time=3)
            self.play(Circumscribe(physical[0],color=BLUE,buff=.18),run_time=1.8)
            self.play(Circumscribe(VGroup(first,second),color=CORAL,buff=.15),run_time=2)
            self.play(Indicate(headings[1],color=CORAL,scale_factor=1.04),run_time=1.1)
        self.finish('Is och vatten är samma ämne. Reaktioner bildar nya ämnen, men atomerna finns kvar.')
