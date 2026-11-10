"""Three original long-form chemistry films, ages 12–14.

Visual inspiration: identity-preserving geometric explanation and coordinated
fields/particles in 3b1b/videos (_2017/eoc/chapter1.py; _2018/div_curl.py).
No scene code, recordings, music or artwork is copied from that repository.
"""
from pathlib import Path
import math
import numpy as np
from core import *

ROOT = Path(__file__).resolve().parents[2]


def label(s, pos, size=27, color=INK, width=None):
    return tex(s, size=size, color=color, width=width).move_to(pos)


def equation(s, pos, size=40, color=INK):
    return mathtex(s, size=size, color=color).move_to(pos)


def box(w, h, pos=ORIGIN, color=BLUE, opacity=.045):
    return RoundedRectangle(width=w, height=h, corner_radius=.15,
        color=color, stroke_width=1.5, fill_color=color,
        fill_opacity=opacity).move_to(pos)


def path(points, color=TEAL, width=3):
    return VMobject(stroke_color=color, stroke_width=width).set_points_smoothly(
        [np.array(p, dtype=float) for p in points])


def photon(pos, color=GOLD, radius=.055):
    return glow_dot(np.array(pos, dtype=float), color=color, radius=radius)


def bead_cloud(center, counts, color=VIOLET, radius=.06, gap=.25):
    cx, cy, cz = center
    return VGroup(*[photon([cx + (i % 5 - 2) * gap,
                          cy + (i // 5 - (counts-1)//5/2) * gap, cz],
                          color, radius) for i in range(counts)])


def make_water_group(positions, scale=.43):
    return VGroup(*[molecule2d(np.array(p), scale=scale, labels=False)
                   for p in positions])


def moving_water(molecules, starts, amplitudes, duration, phase=.0):
    """Same molecule identities and dimensions; only positions change."""
    starts = np.array(starts, dtype=float)
    def update(group, alpha):
        t = alpha * duration
        for i, (mol, origin) in enumerate(zip(group, starts)):
            ax, ay = amplitudes
            delta = np.array([ax * math.sin(t * .7 + i * 1.7 + phase),
                              ay * math.sin(t * .93 + i * 2.1), 0])
            mol.move_to(origin + delta)
    return UpdateFromAlphaFunc(molecules, update, run_time=duration, rate_func=linear)


def simple_fish(pos, scale=1, color=BLUE):
    body = Ellipse(width=1.4, height=.7, color=color, fill_color=color,
                   fill_opacity=.13)
    tail = Polygon([.6,0,0],[1,.45,0],[1,-.45,0],
                   color=color, fill_color=color, fill_opacity=.13)
    eye = Dot([-.42,.1,0], radius=.035, color=INK)
    return VGroup(body, tail, eye).scale(scale).move_to(pos)


def unknown_cluster(pos=ORIGIN, scale=1):
    dots = VGroup(*[sphere_atom(c, .18, p) for c,p in [
        (VIOLET,[-.34,0,0]),(GOLD,[0,.24,.12]),(VIOLET,[.35,0,0]),
        (CORAL,[0,-.25,-.12])]])
    links = VGroup(Line3D([-.34,0,0],[0,.24,.12],color=MUTED,thickness=.035),
                   Line3D([0,.24,.12],[.35,0,0],color=MUTED,thickness=.035),
                   Line3D([.35,0,0],[0,-.25,-.12],color=MUTED,thickness=.035))
    return VGroup(links,dots).scale(scale).move_to(pos)


class MaterialMaster(MasterFilm):
    number = 5
    topic = 'Ämnens egenskaper och kloka materialval'
    slug = '05-egenskaper'

    def construct(self):
        with self.beat('Varför fungerar olika material på olika sätt?',
            'Ett kastrullhandtag och kastrullens botten har olika uppgifter. '
            'Vi följer värme, laddning och partiklar för att förstå hur en egenskap '
            'kan göra ett material lämpligt. Modellerna är förenklade, inte mätdata.',
            seconds=18, clear=True):
            bowl=VGroup(Arc(radius=1.4,start_angle=PI,angle=PI,color=BLUE,stroke_width=6),
                       Line([-1.4,0,0],[1.4,0,0],color=BLUE,stroke_width=5)).shift(LEFT*2+UP*.25)
            handle=RoundedRectangle(width=2.9,height=.28,color=GOLD,fill_color=GOLD,
                         fill_opacity=.25).next_to(bowl,RIGHT,buff=0)
            self.play(Create(bowl),GrowFromEdge(handle,LEFT),run_time=2.4)
            heat=VGroup(*[Arrow([-2.9+j*.6,-2.0,0],[-2.9+j*.6,-.9,0],
                      color=CORAL,buff=0,stroke_width=3) for j in range(4)])
            hot=label('botten: värmen ska spridas',[-2,-2.45,0],26,CORAL)
            cool=label('handtag: greppet ska skyddas',[3.1,1.4,0],26,GOLD,width=6.4)
            self.play(LaggedStart(*[GrowArrow(a) for a in heat],lag_ratio=.15),
                      FadeIn(hot),run_time=2.8)
            self.play(ShowPassingFlash(handle.copy().set_color(TEAL),time_width=.7),
                      Write(cool),run_time=2.4)
            tasks=VGroup(label('uppgift',[-4.8,2.05,0],28,BLUE),
                         label('egenskap',[0,2.05,0],28,GOLD),
                         label('följd',[4.8,2.05,0],28,TEAL))
            connectors=VGroup(arrow([-3.6,2.05,0],[-1.25,2.05,0]),
                              arrow([1.2,2.05,0],[3.8,2.05,0]))
            self.play(Write(tasks),LaggedStart(*[GrowArrow(a) for a in connectors],lag_ratio=.2),run_time=3)
            self.play(Indicate(bowl,color=CORAL),Indicate(handle,color=TEAL),run_time=2.4)
            self.wait(3)

        with self.beat('Ett rättvist test håller annat lika',
            'Vi jämför lika långa stavar vid samma starttemperatur. De värms på samma sätt. '
            'Om vi samtidigt ändrar längd, tjocklek och material blir det svårt att veta '
            'vilken förändring som förklarar resultatet.',
            seconds=18, clear=True):
            self.bars=VGroup(*[Rectangle(width=8.9,height=.5,color=c,fill_color=c,
                fill_opacity=.13).move_to([.4,y,0]) for y,c in [(1.05,CORAL),(-.7,GOLD)]])
            names=VGroup(label('koppar',[-5.7,1.05,0],29,CORAL),
                         label('trä',[-5.7,-.7,0],29,GOLD))
            self.play(DrawBorderThenFill(self.bars),Write(names),run_time=2.7)
            braces=VGroup(Brace(self.bars[0],UP,color=MUTED),
                          Brace(self.bars[1],DOWN,color=MUTED))
            equal=VGroup(label('samma längd',[.4,1.95,0],25,TEAL),
                         label('samma tjocklek',[.4,-1.55,0],25,TEAL))
            self.play(GrowFromCenter(braces),Write(equal),run_time=2.7)
            starts=VGroup(*[Dot([-3.8,y,0],radius=.13,color=GOLD) for y in [1.05,-.7]])
            arrows=VGroup(*[arrow([-5,y,0],[-4.1,y,0],CORAL) for y in [1.05,-.7]])
            self.play(FadeIn(starts),LaggedStart(*[GrowArrow(a) for a in arrows],lag_ratio=.2),run_time=2.5)
            time=equation(r'T_{\mathrm{start,A}}=T_{\mathrm{start,B}}',[.3,-2.2,0],36)
            self.play(Write(time),run_time=2)
            self.play(Indicate(self.bars[0],color=TEAL),Indicate(self.bars[1],color=TEAL),run_time=3)
            self.wait(2.8)

        with self.beat('Följ värmen genom materialet',
            'I det här schemat sprids energi snabbare genom koppar än genom trä. '
            'Punkterna och pilarna visar en idé om värmeledning. Vi mäter inte '
            'en viss temperatur eller en exakt hastighet i den här animationen.',
            seconds=18, clear=True):
            beamA=Rectangle(width=10,height=.65,color=CORAL,fill_color=CORAL,fill_opacity=.08).shift(UP)
            beamB=beamA.copy().set_color(GOLD).shift(DOWN*1.7)
            atomsA=VGroup(*[Circle(radius=.11,color=CORAL,fill_color=CORAL,fill_opacity=.4)
                          .move_to([-4.3+i*.61,1,0]) for i in range(15)])
            atomsB=VGroup(*[Circle(radius=.11,color=GOLD,fill_color=GOLD,fill_opacity=.4)
                          .move_to([-4.3+i*.61,-.7,0]) for i in range(15)])
            labs=VGroup(label('koppar',[-5.85,1,0],25,CORAL),label('trä',[-5.85,-.7,0],25,GOLD))
            self.play(Create(beamA),Create(beamB),FadeIn(atomsA),FadeIn(atomsB),Write(labs),run_time=2)
            energyA=VGroup(*[photon([-4.5+i*.2,1,0]) for i in range(9)])
            energyB=VGroup(*[photon([-4.5+i*.2,-.7,0]) for i in range(9)])
            self.play(FadeIn(energyA),FadeIn(energyB),run_time=.7)
            self.play(energyA.animate.shift(RIGHT*7),energyB.animate.shift(RIGHT*1.8),
                      LaggedStart(*[Indicate(a,scale_factor=1.8,color=GOLD)
                                 for a in atomsA],lag_ratio=.11),run_time=6.5,rate_func=linear)
            self.play(ShowPassingFlash(Line([-4.8,1,0],[4.8,1,0],color=GOLD,stroke_width=9),
                                      time_width=.3),
                      ShowPassingFlash(Line([-4.8,-.7,0],[-2.2,-.7,0],color=GOLD,stroke_width=9),
                                      time_width=.7),run_time=2.6)
            self.play(Write(label('energi sprids -- materialet stannar kvar',[0,-2,0],30,TEAL)),run_time=2)
            self.wait(3.3)

        with self.beat('Zooma in: ordnade delar och rörliga elektroner',
            'Metaller har elektroner som kan röra sig genom materialet. Det hjälper oss '
            'att förklara både elektrisk ledningsförmåga och en del av värmeledningen. '
            'Punkterna hjälper oss att följa hur energi sprids genom metallen.',
            seconds=19, clear=True):
            lattice=VGroup(*[dot_atom('',CORAL,.19,[x,y,0])
                       for x in np.linspace(-4.3,4.3,9) for y in [-1.15,0,1.15]])
            self.play(LaggedStart(*[GrowFromCenter(a) for a in lattice],lag_ratio=.025),run_time=2.7)
            electrons=VGroup(*[photon([-4.8+i*.55,(-1 if i%2 else 1)*.53,0],BLUE,.055)
                               for i in range(18)])
            self.play(FadeIn(electrons),run_time=1)
            origins=[d.get_center().copy() for d in electrons]
            def drift(group,alpha):
                for i,d in enumerate(group):
                    x=-5+(origins[i][0]+5+alpha*9)%10
                    y=origins[i][1]+.16*np.sin(alpha*TAU*3+i)
                    d.move_to([x,y,0])
            trails=VGroup(*[TracedPath(d.get_center,dissipating_time=.75,
                         stroke_color=BLUE,stroke_width=2,stroke_opacity=[0,.65]) for d in electrons[::3]])
            self.add(trails)
            self.play(UpdateFromAlphaFunc(electrons,drift),run_time=7,rate_func=linear)
            self.play(Write(label('rörliga elektroner',[0,2,0],29,BLUE)),
                      Write(label('schematisk metallmodell',[0,-2.15,0],25,MUTED)),run_time=2)
            self.play(UpdateFromAlphaFunc(electrons,drift),run_time=5,rate_func=linear)
            for tr in trails:tr.clear_updaters()

        with self.beat('En elektrisk ledare skapar en sluten väg',
            'Ström kan gå när det finns en sammanhängande ledande väg. Metall leder ström, '
            'medan många plaster isolerar. Isoleringen runt en sladd skyddar kontakten '
            'med den ledande metallen. Modellen visar långsam nettodrift, inte elektronernas verkliga hastighet.',
            seconds=19, clear=True):
            outer=RoundedRectangle(width=10,height=1.6,corner_radius=.45,color=GOLD,
                fill_color=GOLD,fill_opacity=.12)
            inner=RoundedRectangle(width=10,height=.65,corner_radius=.2,color=CORAL,
                fill_color=CORAL,fill_opacity=.14)
            self.play(DrawBorderThenFill(outer),DrawBorderThenFill(inner),run_time=2.5)
            labs=VGroup(label('plast: isolering',[0,1.55,0],27,GOLD),
                         label('metall: ledare',[0,-1.55,0],27,CORAL))
            self.play(Write(labs),run_time=2)
            packets=VGroup(*[photon([-4.6+i*.65,0,0],BLUE,.065) for i in range(15)])
            self.play(FadeIn(packets),run_time=.6)
            self.play(packets.animate.shift(RIGHT*.45),rate_func=linear,run_time=3)
            gap=Rectangle(width=.75,height=.8,fill_color=BG,fill_opacity=1,stroke_width=0)
            self.play(FadeIn(gap),run_time=.7)
            stopped=label('ett avbrott bryter vägen',[0,2.1,0],30,VIOLET)
            self.play(Write(stopped),packets.animate.shift(LEFT*.2),run_time=2.4)
            self.play(FadeOut(gap),FadeOut(stopped),run_time=1)
            self.play(packets.animate.shift(RIGHT*.7),run_time=3.3,rate_func=linear)
            self.wait(2.5)

        with self.beat('Löslighet: följ vad som lämnar kristallen',
            'När natriumklorid löser sig i vatten sprids natriumjoner och kloridjoner. '
            'Det är inte små saltmolekyler som glider isär. Jonerna finns kvar, '
            'men de lämnar kristallens ordnade mönster och omges av vatten.',
            seconds=19, clear=True):
            ions=VGroup(*[dot_atom('' if i>3 else ('+' if i%2==0 else '-'),
                    GOLD if i%2==0 else TEAL,.21,[-1.1+(i%4)*.73,.85-(i//4)*.73,0])
                   for i in range(12)])
            self.play(LaggedStart(*[GrowFromCenter(d) for d in ions],lag_ratio=.05),run_time=2.5)
            formulaNa=equation(r'\mathrm{NaCl(s)}',[0,2.15,0],40,GOLD)
            self.play(Write(formulaNa),run_time=1.5)
            waters=make_water_group([[-4,1.2,0],[-4,-1.2,0],[4,1.2,0],[4,-1.2,0]],.65)
            self.play(FadeIn(waters),run_time=1)
            targets=[[-4.8+(i%6)*1.9, .9-(i//6)*1.6,0] for i in range(12)]
            self.play(LaggedStart(*[a.animate.move_to(targets[i]) for i,a in enumerate(ions)],
                                lag_ratio=.06),
                      waters.animate.scale(.8).shift(UP*.15),run_time=5)
            eq=equation(r'\mathrm{NaCl(s)}\longrightarrow\mathrm{Na^+(aq)}+\mathrm{Cl^-(aq)}',
                        [0,-2.2,0],34)
            self.play(TransformMatchingTex(formulaNa.copy(),eq),run_time=2.4)
            self.play(LaggedStart(*[Indicate(d,color=BLUE,scale_factor=1.25) for d in ions],
                                  lag_ratio=.07),run_time=2.5)
            self.wait(3.5)

        with self.beat('Vattenmolekyler omger jonerna',
            'Vattenmolekylen har en ojämn fördelning av laddning. I den här förstorade '
            'modellen vänder sig syresidan mot en positiv jon, och vätesidan mot en negativ jon. '
            'Vattenmolekylerna byter inte identitet när de omger jonerna.',
            seconds=19, clear=True):
            na=dot_atom('+',GOLD,.5,LEFT*3.1)
            cl=dot_atom('-',TEAL,.55,RIGHT*3.1)
            self.play(GrowFromCenter(na),GrowFromCenter(cl),run_time=1.8)
            labs=VGroup(equation(r'\mathrm{Na^+}',[-3.1,2.1,0],34,GOLD),
                         equation(r'\mathrm{Cl^-}',[3.1,2.1,0],34,TEAL))
            self.play(Write(labs),run_time=1.6)
            waters=VGroup()
            for center, reverse in [(-3.1,False),(3.1,True)]:
                for angle in [0,TAU/3,2*TAU/3]:
                    w=molecule2d(scale=.65,labels=False)
                    # H tips point toward Cl-, oxygen face points toward Na+.
                    w.rotate(angle+PI/2+(PI if reverse else 0))
                    w.move_to([center+1.35*np.cos(angle),1.35*np.sin(angle)-.2,0])
                    waters.add(w)
            self.play(LaggedStart(*[FadeIn(w,shift=.3*(w.get_center()-na.get_center())/3)
                                    for w in waters],lag_ratio=.1),run_time=3)
            rings=VGroup(*[DashedVMobject(Circle(radius=1.45,color=BLUE),num_dashes=22)
                                  .move_to([x,-.2,0]) for x in [-3.1,3.1]])
            self.play(Create(rings),run_time=2)
            charge=VGroup(equation(r'\delta^-',[0,1.2,0],36,CORAL),
                          equation(r'\delta^+',[0,-.3,0],36,BLUE))
            self.play(Write(charge),run_time=2)
            self.play(Rotate(waters[0],.18),Rotate(waters[3],-.18),rate_func=there_and_back,run_time=3)
            self.play(Write(label('Partiklarna sprids i vattnet',[0,-2.35,0],24,MUTED)),
                      run_time=1.5)
            self.wait(2)

        with self.beat('Densitet jämför massa med volym',
            'Två lika stora kuber kan ha olika massa. Därför är storlek inte samma sak som '
            'densitet. Här håller vi volymen lika och jämför massan. Båda kuberna har volymen '
            'hundra kubikcentimeter, men deras massor är hundra respektive tvåhundrasjuttio gram.',
            seconds=19, clear=True):
            cubes=VGroup(Cube(side_length=1.55,fill_color=BLUE,fill_opacity=.5,
                             stroke_color=BLUE,stroke_width=1.5).move_to(LEFT*2.8),
                         Cube(side_length=1.55,fill_color=GOLD,fill_opacity=.5,
                             stroke_color=GOLD,stroke_width=1.5).move_to(RIGHT*2.8))
            self.play(FadeIn(cubes,shift=UP*.3),run_time=2)
            self.move_camera(phi=62*DEGREES,theta=-55*DEGREES,zoom=1.05,run_time=3)
            self.begin_ambient_camera_rotation(rate=.13)
            self.wait(4)
            self.stop_ambient_camera_rotation()
            self.move_camera(phi=0,theta=-90*DEGREES,zoom=1,run_time=3)
            masses=VGroup(equation(r'100\,\mathrm{g}',[-2.8,-1.5,0],38,BLUE),
                         equation(r'270\,\mathrm{g}',[2.8,-1.5,0],38,GOLD))
            volumes=VGroup(equation(r'100\,\mathrm{cm^3}',[-2.8,1.6,0],32),
                          equation(r'100\,\mathrm{cm^3}',[2.8,1.6,0],32))
            self.play(Write(masses),Write(volumes),run_time=2)
            self.play(Indicate(cubes[0],color=BLUE),Indicate(cubes[1],color=GOLD),run_time=2)
            self.wait(2)

        with self.beat('Räkna samma jämförelse i två steg',
            'Densitet är massa delad med volym. Första kuben ger ett gram per '
            'kubikcentimeter. Den andra ger två komma sju gram per kubikcentimeter. '
            'Den andra har större massa per samma volym och därför högre densitet.',
            seconds=18, clear=True):
            top=equation(r'\rho=\frac{m}{V}',[0,1.75,0],58)
            self.play(Write(top),run_time=2.3)
            left=equation(r'\rho_A=\frac{100\,\mathrm{g}}{100\,\mathrm{cm^3}}',
                          [-3.3,.1,0],40,BLUE)
            right=equation(r'\rho_B=\frac{270\,\mathrm{g}}{100\,\mathrm{cm^3}}',
                           [3.3,.1,0],40,GOLD)
            self.play(TransformFromCopy(top,left),TransformFromCopy(top,right),run_time=3)
            a=equation(r'1{,}0\,\mathrm{g/cm^3}',[-3.3,-1.5,0],43,BLUE)
            b=equation(r'2{,}7\,\mathrm{g/cm^3}',[3.3,-1.5,0],43,GOLD)
            self.play(Write(a),Write(b),run_time=2.5)
            bars=VGroup(Rectangle(width=.45,height=.8,color=BLUE,fill_color=BLUE,fill_opacity=.4)
                    .move_to([-3.3,-.7,0]),
                    Rectangle(width=.45,height=2.16,color=GOLD,fill_color=GOLD,fill_opacity=.4)
                    .move_to([3.3,-.02,0]))
            # Bars deliberately appear briefly in their own comparison area.
            self.play(a.animate.shift(LEFT*.5),b.animate.shift(RIGHT*.5),
                      FadeIn(label('samma volym',[0,-2.45,0],29,TEAL)),run_time=2)
            self.play(Indicate(left,color=TEAL),Indicate(right,color=TEAL),run_time=2)
            self.play(Circumscribe(a,color=BLUE),Circumscribe(b,color=GOLD),run_time=2.2)
            self.wait(3.5)

        with self.beat('Ett föremåls form kan ändra medeldensiteten',
            'För att förstå om ett föremål flyter jämför vi också med vätskan. '
            'En kompakt metallbit och en ihålig metallbåt kan bete sig olika. '
            'Båten rymmer luft och får en lägre medeldensitet för hela sin yttre volym.',
            seconds=19, clear=True):
            water=Rectangle(width=11.5,height=2.2,color=BLUE,fill_color=BLUE,fill_opacity=.09).shift(DOWN*.95)
            surface=Line([-5.75,.15,0],[5.75,.15,0],color=BLUE,stroke_width=3)
            block=Square(side_length=.7,color=GOLD,fill_color=GOLD,fill_opacity=.5).move_to([-3.2,1.7,0])
            boat=Polygon([-1.4,.25,0],[1.4,.25,0],[.95,-.4,0],[-.95,-.4,0],
                         color=GOLD,stroke_width=5).move_to([2.8,1.7,0])
            self.play(Create(water),Create(surface),FadeIn(block),Create(boat),run_time=2)
            self.play(block.animate.move_to([-3.2,-1.55,0]),
                      boat.animate.move_to([2.8,.28,0]),run_time=3.3,rate_func=smooth)
            arrows=VGroup(arrow([-3.2,-.4,0],[-3.2,-1.2,0],GOLD),
                         arrow([2.8,-.7,0],[2.8,.0,0],TEAL))
            self.play(LaggedStart(*[GrowArrow(a) for a in arrows],lag_ratio=.25),run_time=2)
            self.play(Write(label('kompakt metall',[-3.2,1.4,0],27,GOLD)),
                      Write(label('metall + luft',[2.8,1.4,0],27,TEAL)),run_time=2)
            air=VGroup(*[Circle(radius=.045,color=MUTED).move_to([2.1+i*.3,.35,0]) for i in range(5)])
            self.play(FadeIn(air),Indicate(boat,color=TEAL),run_time=2)
            self.play(Write(label('hela föremålet måste räknas med',[0,-2.4,0],29,TEAL)),run_time=2)
            self.wait(4)

        with self.beat('Skilj en blandning med rätt egenskap',
            'Vi kan skilja ämnen åt när de skiljer sig i någon användbar egenskap. '
            'Filtrering använder partikelstorlek. En magnet kan dra till sig järn. '
            'Vid indunstning lämnar vatten lösningen som gas, medan ett löst, icke flyktigt salt kan bli kvar.',
            seconds=20, clear=True):
            panels=VGroup(*[box(4.25,4.5,[x,0,0],TEAL) for x in [-4.75,0,4.75]])
            titles=VGroup(label('filtrering',[-4.75,1.8,0],29,TEAL),
                          label('magnetism',[0,1.8,0],29,TEAL),
                          label('indunstning',[4.75,1.8,0],29,TEAL))
            self.play(Create(panels),Write(titles),run_time=2)
            filterline=Line([-6.4,.25,0],[-3.1,.25,0],color=INK,stroke_width=4)
            sand=VGroup(*[Dot([-6+i*.43,1,0],radius=.07,color=GOLD) for i in range(6)])
            dissolved=VGroup(*[photon([-6+i*.43,.7,0],BLUE,.04) for i in range(6)])
            self.play(Create(filterline),FadeIn(sand),FadeIn(dissolved),run_time=1.4)
            self.play(dissolved.animate.shift(DOWN*1.6),sand.animate.shift(DOWN*.65),run_time=3)
            magnet=VGroup(Arc(radius=.65,start_angle=PI,angle=PI,color=CORAL,stroke_width=12),
                          Line([-.65,0,0],[-.65,.65,0],color=CORAL,stroke_width=12),
                          Line([.65,0,0],[.65,.65,0],color=BLUE,stroke_width=12)).shift(UP*.1)
            grains=VGroup(*[Dot([-.9+i*.35,-1.3,0],radius=.065,color=INK) for i in range(6)])
            self.play(Create(magnet),FadeIn(grains),run_time=1.5)
            self.play(LaggedStart(*[d.animate.shift(UP*1.25) for d in grains[::2]],lag_ratio=.2),run_time=2.5)
            dish=Arc(radius=1.2,start_angle=PI,angle=PI,color=BLUE,stroke_width=4).move_to([4.75,-.7,0])
            drops=VGroup(*[photon([4.1+i*.3,-.65,0],BLUE,.045) for i in range(5)])
            salt=VGroup(*[Dot([4.2+i*.28,-1.15,0],radius=.06,color=GOLD) for i in range(5)])
            self.play(Create(dish),FadeIn(drops),FadeIn(salt),run_time=1.5)
            self.play(drops.animate.shift(UP*1.6).set_opacity(0),run_time=2.5)
            self.play(Write(label('egenskap styr val av metod',[0,-2.55,0],28,GOLD)),run_time=1.5)
            self.wait(3)

        with self.beat('En bra förklaring kopplar ihop flera led',
            'Ett material är inte bäst till allt. Förklara uppgiften, välj en viktig '
            'egenskap och beskriv följden. Kastrullens botten ska sprida värme till maten. '
            'Ett handtag ska samtidigt ge ett säkrare grepp.',
            seconds=18, clear=True):
            stages=VGroup(*[box(3.4,1.2,[x,.65,0],c)
                    for x,c in [(-4.8,BLUE),(0,GOLD),(4.8,TEAL)]])
            texts=VGroup(label('uppgift',[-4.8,.65,0],36,BLUE),
                         label('egenskap',[0,.65,0],36,GOLD),
                         label('följd',[4.8,.65,0],36,TEAL))
            self.play(LaggedStart(*[Create(b) for b in stages],lag_ratio=.15),
                      Write(texts),run_time=2.5)
            arr=VGroup(arrow([-3,.65,0],[-1.8,.65,0]),arrow([1.8,.65,0],[3,.65,0]))
            self.play(LaggedStart(*[GrowArrow(a) for a in arr],lag_ratio=.25),run_time=2)
            explanation=VGroup(label('värma maten',[-4.8,-1.0,0],29,BLUE),
                label('leder värme',[0,-1.0,0],29,GOLD),
                label('värme sprids',[4.8,-1.0,0],29,TEAL))
            self.play(LaggedStart(*[Write(t) for t in explanation],lag_ratio=.2),run_time=3)
            self.play(ShowPassingFlash(arr[0].copy().set_color(GOLD),time_width=.7),
                      ShowPassingFlash(arr[1].copy().set_color(GOLD),time_width=.7),run_time=3)
            self.play(Write(label('Vilket annat krav behöver också uppfyllas?',[0,-2.2,0],32,VIOLET)),run_time=2.3)
            self.wait(4)

        with self.beat('Pröva själv: förklara ett genomtänkt val',
            'Välj en vardagsprodukt. Beskriv minst två material i produkten och '
            'hur deras egenskaper hjälper till. Använd orden eftersom och därför. '
            'Tänk också på om ett enkelt test skulle kunna stödja din förklaring.',
            seconds=17, clear=True):
            items=VGroup(label('en sladd',[-4.8,1.2,0],36,BLUE),
                         label('en kastrull',[0,1.2,0],36,GOLD),
                         label('en regnjacka',[4.8,1.2,0],36,TEAL))
            self.play(LaggedStart(*[Write(t) for t in items],lag_ratio=.25),run_time=3)
            frame=box(13.1,2.3,[0,-.8,0],VIOLET)
            steps=VGroup(label('Vad ska den göra?',[0,-.1,0],31),
                         label('Vilken egenskap behövs?',[0,-.8,0],31),
                         label('Hur skulle ni undersöka det?',[0,-1.5,0],31))
            self.play(Create(frame),run_time=1)
            self.play(LaggedStart(*[Write(t) for t in steps],lag_ratio=.25),run_time=4)
            self.play(Indicate(items[1],color=GOLD),run_time=2)
            self.play(Circumscribe(frame,color=VIOLET),run_time=2)
            self.wait(4)
        self.finish('En utvecklad materialförklaring binder ihop uppgift, egenskap och följd. '
                    'Jämför rättvist och använd densitet, ledningsförmåga och löslighet när de är relevanta.')


class PhaseMaster(MasterFilm):
    number = 6
    topic = 'Värme, rörelse och fasförändringar'
    slug = '06-faser'

    def construct(self):
        positions=[[-3.0+(i%4)*2,.9-(i//4)*1.25,0] for i in range(12)]
        with self.beat('Följ samma tolv vattenmolekyler',
            'Vi följer samma tolv vattenmolekyler genom fast form, vätska och gas. '
            'Varje vattenmolekyl har två väteatomer och en syreatom. '
            'Molekylerna byter inte storlek eller atomslag när vattnet värms.',
            seconds=18, clear=True):
            self.water=make_water_group(positions,.47)
            self.play(LaggedStart(*[GrowFromCenter(m) for m in self.water],lag_ratio=.08),run_time=3.2)
            self.play(Write(equation(r'12\,\mathrm{H_2O}',[0,2.1,0],43,BLUE)),run_time=2)
            for index in [0,5,10]:
                self.play(Indicate(self.water[index],color=GOLD,scale_factor=1.3),run_time=1.2)
            counts=equation(r'24\,\mathrm{H}+12\,\mathrm{O}=36\ \text{atomer}',[0,-2.45,0],35)
            self.play(Write(counts),run_time=2.8)
            self.play(moving_water(self.water,positions,(.04,.04),4),run_time=4)
            self.wait(2)

        with self.beat('Fast form: lägen som håller ihop',
            'I is ligger molekylerna i en ordnad struktur. De är inte helt stilla: '
            'de kan vibrera kring sina lägen. Vi visar bara en liten och förenklad '
            'del av isens öppna struktur. Det finns mycket utrymme mellan molekylerna.',
            seconds=18, clear=True):
            self.ice_positions=[[-3.6+(i%4)*2.4,1.1-(i//4)*1.35,0] for i in range(12)]
            self.water=make_water_group(self.ice_positions,.47)
            links=VGroup()
            for i,p in enumerate(self.ice_positions):
                for j,q in enumerate(self.ice_positions):
                    if i<j and (abs(i-j)==1 and i//4==j//4 or abs(i-j)==4):
                        links.add(DashedLine(p,q,color=BLUE,stroke_width=1.2,dash_length=.07))
            self.play(LaggedStart(*[FadeIn(m) for m in self.water],lag_ratio=.05),run_time=2)
            self.play(Create(links),run_time=2)
            self.play(moving_water(self.water,self.ice_positions,(.045,.045),6),run_time=6)
            note=label('vibrerar kring bestämda lägen',[0,2.15,0],31,BLUE)
            self.play(Write(note),run_time=2)
            self.play(moving_water(self.water,self.ice_positions,(.06,.06),4),run_time=4)
            self.wait(2)

        with self.beat('Smältning: strukturen släpper fram rörelse',
            'När is smälter försvinner den fasta ordningen. Molekylerna kan nu röra sig '
            'förbi varandra. Det är fortfarande vattenmolekyler. Vi bevarar alla tolv '
            'och ändrar deras lägen och rörelser, inte deras storlek.',
            seconds=18, clear=True):
            starts=self.ice_positions
            self.water=make_water_group(starts,.47)
            self.play(FadeIn(self.water),run_time=1.3)
            liquid=[[-2.65+(i%4)*1.75 + .18*(i%2),.75-(i//4)*.9,0] for i in range(12)]
            lattice=VGroup(*[DashedLine(starts[i],starts[i+1],color=BLUE,stroke_width=1)
                for i in range(11) if i//4==(i+1)//4])
            self.play(Create(lattice),run_time=1.5)
            energy=VGroup(*[photon([-4.8+i*.45,-2.2,0]) for i in range(10)])
            self.play(FadeIn(energy),energy.animate.shift(UP*.45),run_time=2)
            self.play(FadeOut(lattice),
                LaggedStart(*[m.animate.move_to(liquid[i]) for i,m in enumerate(self.water)],lag_ratio=.04),
                energy.animate.shift(UP*.6).set_opacity(0),run_time=4)
            self.play(moving_water(self.water,liquid,(.22,.15),5),run_time=5)
            self.play(Write(label('samma molekyler -- nya grannar',[0,2.15,0],31,TEAL)),run_time=1.8)
            self.wait(2.4)

        with self.beat('Flytande vatten: nära men rörliga',
            'I flytande vatten är molekylerna nära varandra, men grannarna kan ändras. '
            'Vatten fyller därför en behållares form. För just vatten är vätskans '
            'struktur tätare än isens öppna struktur, vilket bidrar till att is flyter.',
            seconds=19, clear=True):
            frame=box(10.5,3.5,[0,-.05,0],BLUE)
            starts=[[-3.4+(i%4)*2.2,.85-(i//4)*.9,0] for i in range(12)]
            molecules=make_water_group(starts,.47)
            self.play(Create(frame),FadeIn(molecules),run_time=2)
            self.play(moving_water(molecules,starts,(.32,.2),6),run_time=6)
            new=[[-2.5+(i%4)*1.6,.65-(i//4)*.75,0] for i in range(12)]
            self.play(*[m.animate.move_to(new[i]) for i,m in enumerate(molecules)],run_time=3)
            self.play(Write(label('Tätare förpackning är inte större molekyler.',[0,2.2,0],30,TEAL)),run_time=2)
            self.play(moving_water(molecules,new,(.25,.17),4),run_time=4)
            self.wait(2)

        with self.beat('Gas: stora avstånd och fria vägar',
            'I gasform är vattenmolekylerna i genomsnitt långt ifrån varandra och rör sig '
            'fritt mellan kollisionerna. De har inte svällt. När en gas får mer utrymme '
            'kan samma antal molekyler spridas över en större volym.',
            seconds=19, clear=True):
            starts=[[-2.5+(i%4)*1.6,.65-(i//4)*.75,0] for i in range(12)]
            molecules=make_water_group(starts,.47)
            container=box(12.7,4.25,[0,-.15,0],BLUE)
            self.play(Create(container),FadeIn(molecules),run_time=2)
            ends=[[-5.4+(i%4)*3.6 +.12*(i%2),1.45-(i//4)*1.55,0] for i in range(12)]
            trails=VGroup(*[TracedPath(m.get_center,dissipating_time=1.2,
                stroke_color=BLUE,stroke_width=1.8,stroke_opacity=[0,.5]) for m in molecules[::3]])
            self.add(trails)
            self.play(*[m.animate.move_to(ends[i]) for i,m in enumerate(molecules)],run_time=4)
            self.play(moving_water(molecules,ends,(.48,.33),7),run_time=7)
            self.play(Write(label('12 molekyler före och efter',[0,2.25,0],31,GOLD)),run_time=2)
            self.play(moving_water(molecules,ends,(.38,.3),4),run_time=4)
            for tr in trails:tr.clear_updaters()

        with self.beat('Temperatur visar något om rörelsen',
            'Högre temperatur hänger ihop med mer rörelse hos partiklarna. '
            'I den här jämförelsen använder vi samma antal och samma storlek. '
            'Snabbare rörelser får därför inte misstolkas som att molekylerna '
            'blir större eller att nya vattenmolekyler bildas.',
            seconds=18, clear=True):
            frames=VGroup(box(5.8,3.8,[-3.5,-.1,0],BLUE),box(5.8,3.8,[3.5,-.1,0],CORAL))
            astarts=[[-5.2+(i%3)*1.7,.65-(i//3)*1.3,0] for i in range(6)]
            bstarts=[[1.8+(i%3)*1.7,.65-(i//3)*1.3,0] for i in range(6)]
            a=make_water_group(astarts,.47);b=make_water_group(bstarts,.47)
            self.play(Create(frames),FadeIn(a),FadeIn(b),run_time=2)
            self.play(Write(label('lägre temperatur',[-3.5,2.25,0],30,BLUE)),
                      Write(label('högre temperatur',[3.5,2.25,0],30,CORAL)),run_time=2)
            def motion(group,origins,alpha,speed):
                for i,m in enumerate(group):
                    m.move_to(np.array(origins[i])+np.array([.35*np.sin(alpha*TAU*speed+i),
                                                        .28*np.sin(alpha*TAU*speed*1.3+i),0]))
            self.play(UpdateFromAlphaFunc(a,lambda g,t:motion(g,astarts,t,1.5)),
                      UpdateFromAlphaFunc(b,lambda g,t:motion(g,bstarts,t,5)),run_time=9,rate_func=linear)
            self.play(Write(label('samma molekyler -- olika rörelse',[0,-2.45,0],31,TEAL)),run_time=2)
            self.wait(3)

        with self.beat('Energikurvan kopplar ihop två bilder',
            'Vi tillför energi till rent vatten vid normalt lufttryck. I vissa delar '
            'stiger temperaturen. Under smältning och kokning kan energin i stället '
            'ändra hur molekylerna hålls tillsammans. Då kan temperaturen vara ungefär konstant.',
            seconds=20, clear=True):
            axes=Axes(x_range=[0,10,2],y_range=[0,7,1],x_length=9,y_length=3.75,
                      axis_config={'include_tip':True,'stroke_color':MUTED,
                                   'include_numbers':False}).shift(LEFT*.8+DOWN*.1)
            xl=label('tillförd energi',[1.3,-2.45,0],27)
            yl=label('temperatur',[-6.4,.5,0],25).rotate(PI/2)
            points=[(0,.5),(2,2),(3.7,2),(6,4.8),(8.3,4.8),(10,6.3)]
            segments=VGroup(*[Line(axes.c2p(*a),axes.c2p(*b),color=TEAL,stroke_width=5)
                              for a,b in zip(points,points[1:])])
            self.play(Create(axes),Write(xl),Write(yl),run_time=2.5)
            self.play(LaggedStart(*[Create(s) for s in segments],lag_ratio=.35),run_time=5)
            names=VGroup(label('is värms',axes.c2p(1,2.5),24,BLUE),
                         label('smältning',axes.c2p(2.85,1.2),24,GOLD),
                         label('vatten värms',axes.c2p(5,4.2),24,BLUE),
                         label('kokning',axes.c2p(7.25,5.5),24,GOLD))
            self.play(LaggedStart(*[Write(n) for n in names],lag_ratio=.2),run_time=3)
            dot=glow_dot(axes.c2p(0,.5),GOLD,.075)
            self.add(dot)
            for segment in segments:
                self.play(MoveAlongPath(dot,segment),run_time=1.15,rate_func=linear)
            self.wait(3)

        with self.beat('En platå betyder inte att uppvärmningen har slutat',
            'Vid en fasövergång kan energi fortsätta att tillföras utan att '
            'temperaturen stiger. Energin bidrar då till att ändra samspelet mellan molekylerna. '
            'Vi skiljer därför på tillförd energi, temperatur och vilket tillstånd ämnet befinner sig i.',
            seconds=18, clear=True):
            curve=Axes(x_range=[0,6,1],y_range=[0,4,1],x_length=5.2,y_length=3.1,
                       axis_config={'include_numbers':False,'stroke_color':MUTED}).shift(LEFT*3.45+DOWN*.15)
            line=VGroup(Line(curve.c2p(0,.4),curve.c2p(1.7,2),color=TEAL,stroke_width=5),
                        Line(curve.c2p(1.7,2),curve.c2p(4.3,2),color=GOLD,stroke_width=5),
                        Line(curve.c2p(4.3,2),curve.c2p(6,3.6),color=TEAL,stroke_width=5))
            self.play(Create(curve),Create(line),run_time=2.5)
            points=[[1.5+(i%3)*1.55,.7-(i//3)*1.35,0] for i in range(6)]
            mols=make_water_group(points,.43)
            connections=VGroup(*[DashedLine(points[i],points[i+1],color=BLUE,stroke_width=1.2)
                                  for i in range(5)])
            self.play(FadeIn(mols),Create(connections),run_time=2)
            cursor=glow_dot(curve.c2p(1.7,2),GOLD,.075);self.add(cursor)
            self.play(MoveAlongPath(cursor,line[1]),LaggedStart(*[FadeOut(l) for l in connections],
                                 lag_ratio=.18),
                      *[m.animate.shift([.18*(-1)**i,.13*(i%2),0]) for i,m in enumerate(mols)],run_time=5)
            energy=VGroup(*[arrow([.5,-2.1,0],[1.6+i*.4,-1.65,0],GOLD) for i in range(4)])
            self.play(LaggedStart(*[GrowArrow(a) for a in energy],lag_ratio=.2),run_time=2.5)
            self.play(Write(label('energi tillförs',[2.6,-2.4,0],29,GOLD)),
                      Write(label('temperaturen ligger kvar',[-3.6,2.2,0],27,GOLD)),run_time=2)
            self.play(moving_water(mols,[m.get_center() for m in mols],(.15,.12),4),run_time=4)

        with self.beat('Avdunstning sker vid ytan',
            'Vatten kan avdunsta även när det inte kokar. En del molekyler kan lämna '
            'vätskans yta och bli gas. Därför kan en blöt tröja torka i ett rum '
            'utan att vattnet i tröjan kokar.',
            seconds=18, clear=True):
            vessel=VGroup(Line([-4.9,1.2,0],[-4.9,-1.7,0],color=BLUE),
                          Line([-4.9,-1.7,0],[4.9,-1.7,0],color=BLUE),
                          Line([4.9,-1.7,0],[4.9,1.2,0],color=BLUE))
            surface=Line([-4.9,.4,0],[4.9,.4,0],color=BLUE,stroke_width=2)
            positions=[[-3.9+(i%6)*1.55,.0-(i//6)*1.05,0] for i in range(12)]
            mols=make_water_group(positions,.43)
            self.play(Create(vessel),Create(surface),FadeIn(mols),run_time=2)
            self.play(moving_water(mols,positions,(.13,.1),3),run_time=3)
            escaping=[mols[i] for i in [1,4,2]]
            for j,m in enumerate(escaping):
                p=m.get_center()
                route=path([p,p+UP*.7,p+UP*1.65+RIGHT*(j-1)*.5],GOLD)
                self.play(MoveAlongPath(m,route),ShowPassingFlash(route.copy(),time_width=.5),
                          run_time=2.3,rate_func=smooth)
            self.play(Write(label('molekyler lämnar ytan',[0,2.3,0],31,GOLD)),run_time=2)
            self.play(moving_water(VGroup(*[m for m in mols if m not in escaping]),
                         [m.get_center() for m in mols if m not in escaping],(.15,.1),3),run_time=3)
            self.wait(1.1)

        with self.beat('Kokning sker i hela vätskan',
            'När vatten kokar bildas vattenånga även inne i vätskan. Bubblor med gas '
            'kan växa och stiga upp. Det är en viktig skillnad mot avdunstning, '
            'som sker från ytan. Kokpunkten beror också på trycket omkring vattnet.',
            seconds=18, clear=True):
            water=Rectangle(width=9.8,height=3.3,color=BLUE,fill_color=BLUE,fill_opacity=.08).shift(DOWN*.3)
            self.play(Create(water),run_time=1.5)
            molecules=make_water_group([[-3.9+(i%6)*1.55,.3-(i//6)*1.1,0] for i in range(12)],.43)
            self.play(FadeIn(molecules),run_time=1)
            bubbles=VGroup(*[Circle(radius=.14+.04*(i%3),color=BLUE,stroke_width=2)
                                .move_to([-3.4+(i%4)*2.2,-1.5,0]) for i in range(8)])
            self.play(LaggedStart(*[GrowFromCenter(b) for b in bubbles],lag_ratio=.08),run_time=2)
            self.play(LaggedStart(*[b.animate.shift(UP*(2.0+.2*(i%3))).scale(1.7)
                                  for i,b in enumerate(bubbles)],lag_ratio=.08),run_time=5)
            self.play(Write(label('gasbubblor bildas inne i vätskan',[0,2.2,0],30,BLUE)),run_time=2)
            self.play(bubbles.animate.shift(UP*.65).set_opacity(0),run_time=2)
            self.play(Write(label('trycket påverkar kokpunkten',[0,-2.45,0],29,GOLD)),run_time=1.7)
            self.wait(2.8)

        with self.beat('Osynlig ånga och synliga små droppar',
            'Vattenånga är en osynlig gas. Det vita molnet ovanför en kastrull består '
            'av mycket små vätskedroppar som bildats när gas kylts och kondenserat. '
            'Det synliga molnet är därför inte samma sak som själva vattenångan.',
            seconds=20, clear=True):
            molecule=molecule3d(scale=1.45).move_to(LEFT*3.2)
            self.play(FadeIn(molecule),run_time=1.3)
            self.move_camera(phi=65*DEGREES,theta=-55*DEGREES,run_time=2)
            self.begin_ambient_camera_rotation(rate=.18)
            self.wait(2)
            self.stop_ambient_camera_rotation()
            self.move_camera(phi=0,theta=-90*DEGREES,run_time=2)
            self.play(FadeOut(molecule),run_time=.6)
            gas_positions=[[-5.3+(i%4)*1.0,.95-(i//4)*.95,0] for i in range(12)]
            sample=make_water_group(gas_positions,.28)
            self.play(FadeIn(sample),Write(label('gas: åtskilda molekyler',[-3.8,-1.9,0],27,BLUE)),run_time=1.2)
            centers=[[1.55,0,0],[3.4,0,0],[5.25,0,0]]
            targets=[]
            for cx,cy,cz in centers:
                targets += [[cx-.24,cy+.25,0],[cx+.24,cy+.25,0],
                            [cx-.24,cy-.22,0],[cx+.24,cy-.22,0]]
            self.play(LaggedStart(*[m.animate.move_to(targets[i]) for i,m in enumerate(sample)],
                                 lag_ratio=.035),run_time=3.2)
            droplets=VGroup(*[Circle(radius=.7,color=BLUE,fill_color=BLUE,fill_opacity=.07)
                              .move_to(c) for c in centers])
            self.play(LaggedStart(*[Create(d) for d in droplets],lag_ratio=.15),run_time=1.5)
            self.play(Write(label('vätskedroppar: molekyler nära',[3.35,-1.9,0],27,BLUE,width=6.5)),run_time=1.2)
            self.play(Write(label('några molekyler visas i en starkt förstorad principmodell',
                                 [0,2.25,0],25,TEAL,width=13.4)),run_time=1.5)
            self.play(sample.animate.shift(UP*.05),rate_func=there_and_back,run_time=1.5)
            self.wait(1)

        with self.beat('Sex vägar mellan tre tillstånd',
            'Smältning och stelning går mellan fast form och vätska. Förångning och '
            'kondensation går mellan vätska och gas. Sublimering och deposition går '
            'direkt mellan fast form och gas. Pilarna visar riktning, inte hur snabbt det går.',
            seconds=20, clear=True):
            stages=VGroup(box(3.1,1.1,[-5.2,0,0],BLUE),
                          box(3.1,1.1,[0,0,0],TEAL),
                          box(3.1,1.1,[5.2,0,0],GOLD))
            labs=VGroup(label('FAST',[-5.2,0,0],35,BLUE),
                        label('VÄTSKA',[0,0,0],35,TEAL),
                        label('GAS',[5.2,0,0],35,GOLD))
            self.play(Create(stages),Write(labs),run_time=2)
            arrows=VGroup(arrow([-3.5,.33,0],[-1.65,.33,0],CORAL),
                arrow([-1.65,-.33,0],[-3.5,-.33,0],TEAL),
                arrow([1.65,.33,0],[3.5,.33,0],CORAL),
                arrow([3.5,-.33,0],[1.65,-.33,0],TEAL))
            names=VGroup(label('smältning',[-2.6,.9,0],25,CORAL),
                         label('stelning',[-2.6,-.9,0],25,TEAL),
                         label('förångning',[2.6,.9,0],25,CORAL),
                         label('kondensation',[2.6,-.9,0],25,TEAL))
            self.play(LaggedStart(*[GrowArrow(a) for a in arrows],lag_ratio=.2),Write(names),run_time=4)
            upper=ArcBetweenPoints([-5.2,1.0,0],[5.2,1.0,0],angle=-PI/4,color=CORAL).add_tip(tip_length=.18)
            lower=ArcBetweenPoints([5.2,-1.05,0],[-5.2,-1.05,0],angle=-PI/4,color=TEAL).add_tip(tip_length=.18)
            self.play(Create(upper),Create(lower),run_time=3)
            self.play(Write(label('sublimering',[0,2.4,0],26,CORAL)),
                      Write(label('deposition',[0,-2.4,0],26,TEAL)),run_time=2)
            self.play(ShowPassingFlash(upper.copy().set_stroke(width=7),time_width=.35),
                      ShowPassingFlash(lower.copy().set_stroke(width=7),time_width=.35),run_time=3)
            self.wait(6)

        with self.beat('Pröva en förklaring som bevarar byggstenarna',
            'Förklara vad som ändras när is blir vatten och sedan gas. Ta med '
            'avstånd, ordning, rörelse och energi. Berätta också vad som är oförändrat: '
            'samma vattenmolekyler och samma atomer finns kvar i vår modell.',
            seconds=18, clear=True):
            words=VGroup(*[label(t,[x,1.25,0],29,c) for t,x,c in [
                ('avstånd',-5.2,BLUE),('ordning',-1.7,TEAL),('rörelse',1.7,GOLD),('energi',5.2,CORAL)]])
            self.play(LaggedStart(*[Write(w) for w in words],lag_ratio=.2),run_time=3)
            mols=make_water_group([[-3,0,0],[0,0,0],[3,0,0]],.8)
            self.play(LaggedStart(*[FadeIn(m) for m in mols],lag_ratio=.25),run_time=2)
            routes=VGroup(arrow([-2,0,0],[-.9,0,0],TEAL),arrow([.9,0,0],[2,0,0],TEAL))
            self.play(LaggedStart(*[GrowArrow(a) for a in routes],lag_ratio=.2),run_time=2)
            self.play(*[Rotate(m,.15*(-1)**i) for i,m in enumerate(mols)],
                      rate_func=there_and_back,run_time=3)
            self.play(Write(label('Vad ändras? Vad bevaras?',[0,-1.8,0],38,VIOLET)),run_time=2.5)
            self.play(Indicate(mols,color=BLUE),run_time=2)
            self.wait(3.5)
        self.finish('Vid en fasförändring ändras hur vattenmolekylerna ordnas och rör sig. '
                    'Följ energin, skilj temperatur från tillförd energi och bevara molekylernas identitet.')


class EnvironmentMaster(MasterFilm):
    number = 7
    topic = 'Giftfri miljö: följ ämnet och bryt spridningen'
    slug = '07-miljo'

    def construct(self):
        with self.beat('Giftfri miljö är inte en värld utan kemi',
            'Vatten, luft, trä och våra kroppar består av kemiska ämnen. '
            'En giftfri miljö handlar om att förebygga skadlig påverkan av farliga ämnen. '
            'Vi behöver därför undersöka både ämnets egenskaper och hur människor eller andra organismer utsätts.',
            seconds=18, clear=True):
            items=VGroup(label('vatten',[-5,1.2,0],36,BLUE),label('luft',[0,1.2,0],36,TEAL),
                         label('levande organismer',[4.9,1.2,0],31,GOLD,width=4.4))
            self.play(LaggedStart(*[Write(t) for t in items],lag_ratio=.25),run_time=3)
            dots=VGroup(*[photon([-5.8+(i%12)*1.05,.2-(i//12)*.55,0],
                [BLUE,TEAL,GOLD][i%3],.065) for i in range(36)])
            self.play(LaggedStart(*[GrowFromCenter(d) for d in dots],lag_ratio=.018),run_time=2)
            frame=box(13,1.25,[0,-1.8,0],VIOLET)
            main=label('vilket ämne + vilken kontakt?',[0,-1.8,0],38,VIOLET)
            self.play(Create(frame),Write(main),run_time=2)
            self.play(dots.animate.shift(UP*.1),rate_func=there_and_back,run_time=3)
            self.play(Indicate(items[0],color=BLUE),Indicate(items[2],color=GOLD),run_time=2)
            self.play(Circumscribe(main,color=VIOLET),run_time=2)
            self.wait(4)

        with self.beat('Skilj en fara från en risk',
            'Fara beskriver att ett ämne kan orsaka skada. Risk handlar också om '
            'om en organism kan utsättas, hur mycket, på vilket sätt och hur länge. '
            'Samma ämne kan därför innebära olika risk i olika situationer.',
            seconds=19, clear=True):
            hazard=Polygon([0,1.0,0],[1,0,0],[0,-1,0],[-1,0,0],
                       color=CORAL,stroke_width=5).move_to(LEFT*4.8)
            mark=equation('!',[-4.8,0,0],62,CORAL)
            contact=VGroup(Rectangle(width=2.1,height=1.2,color=GOLD),
                            Line([-.9,-.25,0],[.9,-.25,0],color=BLUE,stroke_width=6)).move_to(ORIGIN)
            gauge=Arc(radius=1,start_angle=0,angle=PI,color=TEAL,stroke_width=14).move_to([4.8,.1,0])
            needle=Line([4.8,-.4,0],[4.2,.35,0],color=INK,stroke_width=5)
            labs=VGroup(label('fara',[-4.8,1.9,0],34,CORAL),
                         label('exponering',[0,1.9,0],34,GOLD),label('risk',[4.8,1.9,0],34,TEAL))
            self.play(Create(hazard),Write(mark),Create(contact),Create(gauge),Create(needle),Write(labs),run_time=3)
            conn=VGroup(arrow([-3.5,0,0],[-1.4,0,0],GOLD),arrow([1.4,0,0],[3.5,0,0],TEAL))
            self.play(LaggedStart(*[GrowArrow(a) for a in conn],lag_ratio=.25),run_time=2)
            quantities=VGroup(label('mängd',[-1.8,-1.6,0],28,GOLD),
                              label('väg',[0,-1.6,0],28,GOLD),label('tid',[1.8,-1.6,0],28,GOLD))
            self.play(LaggedStart(*[Write(t) for t in quantities],lag_ratio=.25),run_time=3)
            self.play(Rotate(needle,-.6,about_point=[4.8,-.4,0]),run_time=2,rate_func=there_and_back)
            self.play(Write(label('en principbild -- ingen beräknad sannolikhet',[0,-2.45,0],25,MUTED)),run_time=2)
            self.wait(7)

        with self.beat('En möjlig källa: ett skadat batteri',
            'Vi använder ett skadat batteri som exempel på en möjlig källa. '
            'Om det läcker kan ämnen nå marken. Regn kan sedan föra en del vidare. '
            'Det är ett tänkt spridningsförlopp, inte något som sker likadant med alla batterier eller ämnen.',
            seconds=19, clear=True):
            battery=VGroup(RoundedRectangle(width=1.5,height=2.2,corner_radius=.18,
                         color=GOLD,fill_color=GOLD,fill_opacity=.15),
                          Rectangle(width=.55,height=.18,color=GOLD).shift(UP*1.15),
                          equation('+',[0,.6,0],38,GOLD)).move_to([-4.8,.6,0])
            ground=Line([-6.6,-1.15,0],[6.6,-1.15,0],color=CORAL,stroke_width=3)
            self.play(DrawBorderThenFill(battery),Create(ground),run_time=2.5)
            crack=VMobject(color=VIOLET,stroke_width=4).set_points_as_corners(
                          [[-4.6,1.1,0],[-4.9,.6,0],[-4.55,.3,0],[-4.85,-.35,0]])
            self.play(Create(crack),run_time=1.5)
            pollution=VGroup(*[photon([-4.7+i*.12,-.65,0],VIOLET,.055) for i in range(16)])
            self.play(FadeIn(pollution),run_time=.8)
            rain=VGroup(*[Line([x,2.2,0],[x-.2,1.8,0],color=BLUE,stroke_width=2)
                          for x in np.linspace(-5.8,5.8,18)])
            self.play(LaggedStart(*[Create(r) for r in rain],lag_ratio=.03),run_time=2)
            self.play(pollution.animate.shift(RIGHT*4.6+DOWN*.75),
                      rain.animate.shift(DOWN*2.1).set_opacity(.15),run_time=5)
            self.play(Write(label('källa',[-4.8,2.15,0],30,GOLD)),
                      Write(label('mark och vatten',[1.7,-2.2,0],31,VIOLET)),run_time=2)
            self.wait(4.2)

        with self.beat('Följ rörelsen genom ett vattendrag',
            'Ett ämne kan transporteras med vatten och spridas över ett större område. '
            'De lila punkterna visar här ett tänkt löst ämne. Flödets form avgör '
            'vilken väg punkterna tar. Vi visar principen, inte en prognos för en verklig bäck.',
            seconds=20, clear=True):
            stream=VGroup(path([[-6.7,1.2,0],[-3.8,.8,0],[-1.5,1.4,0],[1.3,.8,0],[3.5,.2,0],[6.7,.8,0]],BLUE,4),
                          path([[-6.7,-.9,0],[-3.8,-1.2,0],[-1.5,-.6,0],[1.3,-1.2,0],[3.5,-1.8,0],[6.7,-1.2,0]],BLUE,4))
            self.play(Create(stream),run_time=2)
            curves=VGroup(*[path([[-6.4,y,0],[-3.8,y-.25,0],[-1.4,y+.35,0],
                     [1.2,y-.2,0],[3.5,y-.75,0],[6.4,y-.2,0]],TEAL,1.4)
                           for y in np.linspace(-.6,.9,7)])
            self.play(LaggedStart(*[Create(c) for c in curves],lag_ratio=.07),run_time=2)
            particles=VGroup(*[photon([-6.3,.15,0],VIOLET,.045) for _ in range(28)])
            self.add(particles)
            def flow(group,alpha):
                for i,d in enumerate(group):
                    fraction=(alpha*1.3+i/28)%1
                    d.move_to(curves[i%7].point_from_proportion(fraction))
            trails=VGroup(*[TracedPath(d.get_center,dissipating_time=1.2,stroke_color=VIOLET,
                    stroke_width=2,stroke_opacity=[0,.8]) for d in particles[::4]])
            self.add(trails)
            self.play(UpdateFromAlphaFunc(particles,flow),run_time=9,rate_func=linear)
            self.play(Write(label('spridning är en rörelse genom en miljö',[0,2.2,0],31,TEAL)),run_time=2)
            self.play(UpdateFromAlphaFunc(particles,flow),run_time=5,rate_func=linear)
            for tr in trails:tr.clear_updaters()

        with self.beat('Kontakt är inte samma sak som upptag',
            'En organism kan komma i kontakt med ett ämne via vatten, luft eller föda. '
            'En del av ämnet kan tas upp, medan annat kan passera eller lämna kroppen. '
            'Därför behöver vi veta mer än att ämnet finns någonstans i miljön.',
            seconds=19, clear=True):
            fish=simple_fish([0,0,0],2.2)
            self.play(Create(fish),run_time=2)
            water=VGroup(*[photon([-5.5+i*.5,.8*np.sin(i),0],VIOLET,.055) for i in range(9)])
            food=VGroup(*[Dot([-4.9+i*.4,-1.7,0],radius=.08,color=GOLD) for i in range(4)])
            self.play(FadeIn(water),FadeIn(food),run_time=1)
            self.play(LaggedStart(*[d.animate.move_to([-.3+.3*(i%3),.3-.3*(i//3),0])
                    for i,d in enumerate(water[:5])],lag_ratio=.12),run_time=3)
            self.play(*[d.animate.shift(RIGHT*8).set_opacity(.2) for d in water[5:]],run_time=3)
            self.play(LaggedStart(*[f.animate.move_to([-1+.2*i,-.3,0]) for i,f in enumerate(food)],
                                  lag_ratio=.1),run_time=2)
            out=VGroup(arrow([1.7,.3,0],[4.2,.8,0],TEAL),label('kan lämna kroppen',[4.6,1.45,0],27,TEAL))
            self.play(GrowArrow(out[0]),Write(out[1]),run_time=2)
            self.play(water[0].animate.move_to([4.1,.85,0]).set_opacity(.2),run_time=2)
            self.play(Write(label('kontakt -- upptag -- utsöndring',[0,-2.4,0],30,GOLD)),run_time=2)
            self.wait(2)

        with self.beat('Bioackumulering följer samma organism över tid',
            'Om ett ämne tas upp snabbare än det lämnar kroppen kan mängden '
            'i organismen öka med tiden. Det kallas bioackumulering. '
            'Vi följer nu samma fisk och samma vävnadsmängd, så att jämförelsen blir tydlig.',
            seconds=20, clear=True):
            fish=simple_fish([-3.8,.1,0],1.8)
            body=box(3,2.5,[-3.8,.1,0],BLUE)
            self.play(Create(fish),Create(body),run_time=2)
            axes=Axes(x_range=[0,10,2],y_range=[0,6,1],x_length=5.2,y_length=3,
                    axis_config={'include_numbers':False,'stroke_color':MUTED}).shift(RIGHT*3.1+DOWN*.15)
            labs=VGroup(label('tid',[4.5,-2.15,0],27),label('mängd i samma fisk',[3,2.15,0],27,VIOLET))
            self.play(Create(axes),Write(labs),run_time=2)
            curve=axes.plot(lambda x:5*(1-np.exp(-x/4)),x_range=[0,10],color=VIOLET,stroke_width=5)
            dots=bead_cloud([-3.8,.1,0],12,VIOLET,.055,.32)
            self.play(Create(curve),LaggedStart(*[GrowFromCenter(d) for d in dots],lag_ratio=.28),run_time=6)
            incoming=arrow([-6.2,-1.8,0],[-4.8,-.7,0],VIOLET)
            outgoing=arrow([-2.6,-.6,0],[-1.5,-1.4,0],TEAL)
            self.play(GrowArrow(incoming),GrowArrow(outgoing),run_time=2)
            self.play(Write(label('upptag större än utsöndring',[0,-2.55,0],30,GOLD)),run_time=2)
            self.play(Indicate(curve,color=GOLD),Indicate(dots,color=VIOLET),run_time=2)
            self.wait(4)

        with self.beat('Biomagnifikation jämför olika led i en näringskedja',
            'Vissa svårnedbrytbara ämnen kan få högre halt längre upp i en näringskedja. '
            'Ett rovdjur äter många byten. Vi jämför lika stora mängder kroppsvävnad '
            'för att visa halten, inte bara större kroppar. Det här gäller vissa ämnen, inte alla.',
            seconds=21, clear=True):
            centers=[-5.1,-1.7,1.7,5.1]
            boxes=VGroup(*[box(2.55,2.6,[x,0,0],TEAL) for x in centers])
            names=VGroup(*[label(t,[x,1.85,0],26,TEAL) for x,t in zip(centers,
                          ['plankton','liten fisk','större fisk','fågel'])])
            arrows=VGroup(*[arrow([x+1.35,0,0],[x+2.05,0,0],TEAL) for x in centers[:-1]])
            self.play(Create(boxes),Write(names),run_time=2.5)
            self.play(LaggedStart(*[GrowArrow(a) for a in arrows],lag_ratio=.25),run_time=2)
            clouds=VGroup(*[bead_cloud([x,0,0],n,VIOLET,.052,.3)
                               for x,n in zip(centers,[2,5,10,16])])
            self.play(LaggedStart(*[FadeIn(c,scale=.6) for c in clouds],lag_ratio=.3),run_time=4)
            marks=VGroup(*[label('samma mängd vävnad',[x,-1.9,0],21,MUTED,width=2.9) for x in centers])
            self.play(Write(marks),run_time=2)
            for i,a in enumerate(arrows):
                self.play(ShowPassingFlash(a.copy().set_color(VIOLET).set_stroke(width=8),
                                          time_width=.7),Indicate(clouds[i+1],color=GOLD),run_time=1.4)
            self.play(Write(label('schematiska punkter -- inga uppmätta halter',[0,-2.55,0],25,GOLD)),run_time=1.5)
            self.wait(4.8)

        with self.beat('Två olika jämförelser ger två olika begrepp',
            'Bioackumulering jämför samma organism vid olika tider. Biomagnifikation '
            'jämför halten mellan olika led i en näringskedja. '
            'Båda kan vara viktiga, men de beskriver inte samma fråga.',
            seconds=19, clear=True):
            a=box(6.3,4.1,[-3.55,-.05,0],BLUE);b=box(6.3,4.1,[3.55,-.05,0],TEAL)
            self.play(Create(a),Create(b),run_time=2)
            titles=VGroup(label('samma fisk -- senare tid',[-3.55,1.7,0],29,BLUE),
                          label('flera led -- samma vävnadsmängd',[3.55,1.7,0],27,TEAL,width=6))
            self.play(Write(titles),run_time=2.2)
            fis1=simple_fish([-4.9,.1,0],.8);fis2=simple_fish([-2.2,.1,0],.8)
            c1=bead_cloud([-4.9,.1,0],2,VIOLET,.04,.16);c2=bead_cloud([-2.2,.1,0],8,VIOLET,.04,.16)
            self.play(Create(fis1),Create(fis2),FadeIn(c1),FadeIn(c2),
                      GrowArrow(arrow([-4,.1,0],[-3.1,.1,0],BLUE)),run_time=2.5)
            small=box(1.4,1.4,[2.1,.1,0],TEAL);large=box(1.4,1.4,[4.9,.1,0],TEAL)
            self.play(Create(small),Create(large),FadeIn(bead_cloud([2.1,.1,0],3,VIOLET,.04,.16)),
                FadeIn(bead_cloud([4.9,.1,0],10,VIOLET,.04,.16)),
                GrowArrow(arrow([2.9,.1,0],[4,.1,0],TEAL)),run_time=2.5)
            self.play(Write(label('bioackumulering',[-3.55,-1.4,0],31,BLUE)),
                      Write(label('biomagnifikation',[3.55,-1.4,0],31,TEAL)),run_time=2)
            self.play(Indicate(c2,color=GOLD),Indicate(large,color=GOLD),run_time=2)
            self.wait(5.8)

        with self.beat('Klart vatten kan behöva undersökas',
            'Ett fotografi kan inte avslöja alla ämnen i ett vattenprov. '
            'Många lösta ämnen syns inte med ögonen. Därför samlar forskare in '
            'prover och analyserar dem. Det behövs information om ämnet och halten för att bedöma problemet.',
            seconds=19, clear=True):
            photo=ImageMobject(str(ROOT/'assets/environment/vattenprov.jpg')).set_height(3.8).shift(LEFT*3.8)
            frame=box(5.2,4.1,[-3.8,0,0],BLUE)
            self.play(FadeIn(photo),Create(frame),run_time=2)
            self.play(Write(label('Foto: USGS, public domain',[-3.8,-2.45,0],20,MUTED)),run_time=1.5)
            vial=VGroup(Rectangle(width=1.7,height=2.5,color=BLUE,fill_color=BLUE,fill_opacity=.08),
                        Rectangle(width=2.0,height=.18,color=GOLD,fill_color=GOLD,fill_opacity=.5)
                        .shift(UP*1.35)).move_to([3.2,.25,0])
            hidden=bead_cloud([3.2,.25,0],14,VIOLET,.035,.23)
            self.play(Create(vial),run_time=2)
            self.play(FadeIn(hidden),run_time=2.5)
            scan=Line([2.1,-1.2,0],[4.3,-1.2,0],color=GOLD,stroke_width=4)
            self.play(Create(scan),scan.animate.shift(UP*2.8),run_time=3.5)
            self.play(Write(label('analys ger information',[3.2,2.25,0],30,GOLD)),run_time=2)
            self.play(Indicate(hidden,color=VIOLET),run_time=2)
            self.wait(3.5)

        with self.beat('Rening hjälper -- men tar inte bort allt',
            'Avloppsrening kan minska många föroreningar, men olika ämnen kräver olika '
            'behandling. Ett vanligt reningsverk är inte byggt för att avlägsna alla '
            'mikroföroreningar. Därför behöver vi också minska oönskade ämnens utsläpp redan från början.',
            seconds=20, clear=True):
            tanks=VGroup(*[box(2.5,2.5,[x,0,0],BLUE) for x in [-4.5,0,4.5]])
            titles=VGroup(label('avskiljning',[-4.5,1.8,0],27,BLUE),
                         label('behandling',[0,1.8,0],27,BLUE),
                         label('utgående vatten',[4.5,1.8,0],27,BLUE,width=3.6))
            self.play(Create(tanks),Write(titles),run_time=2.5)
            flow=VGroup(arrow([-3.05,0,0],[-1.4,0,0],TEAL),arrow([1.4,0,0],[3.05,0,0],TEAL))
            self.play(LaggedStart(*[GrowArrow(a) for a in flow],lag_ratio=.2),run_time=2)
            dirt=VGroup(*[Dot([-4.5+(i%3-.9)*.4,(i//3-1)*.4,0],radius=.08,color=GOLD) for i in range(9)])
            dissolved=bead_cloud([-4.5,0,0],6,VIOLET,.045,.3)
            self.play(FadeIn(dirt),FadeIn(dissolved),run_time=1.2)
            self.play(dirt.animate.shift(DOWN*1.45),dissolved.animate.move_to([0,0,0]),run_time=3)
            self.play(dissolved[:3].animate.shift(DOWN*1.5).set_opacity(.2),
                      dissolved[3:].animate.move_to([4.5,0,0]),run_time=3)
            self.play(Write(label('ämne och teknik avgör vad som avlägsnas',[0,-2.5,0],29,GOLD)),run_time=2)
            self.play(Indicate(dissolved[3:],color=VIOLET),run_time=2)
            self.wait(4.3)

        with self.beat('Bryt spridningsvägen vid källan',
            'Det är ofta lättare att förebygga spridning än att samla in ett ämne '
            'när det redan spridits i en sjö. Batterier lämnas till batteriinsamling. '
            'Då kan ämnen och material hanteras innan de riskerar att läcka till mark och vatten.',
            seconds=20, clear=True):
            battery=VGroup(RoundedRectangle(width=1.3,height=2,color=GOLD,fill_color=GOLD,fill_opacity=.15),
                          equation('+',[0,.45,0],38,GOLD)).move_to([-5.5,.1,0])
            bin=VGroup(Rectangle(width=2.0,height=2.2,color=TEAL,fill_color=TEAL,fill_opacity=.08),
                       Line([-1.2,1.2,0],[1.2,1.2,0],color=TEAL,stroke_width=5),
                       label('insamling',[0,-.25,0],28,TEAL)).move_to([4.9,.3,0])
            stream=path([[-4.4,-1.6,0],[-1.5,-2,0],[1.2,-1.5,0],[4.4,-1.8,0]],VIOLET,4)
            self.play(Create(battery),Create(bin),Create(stream),run_time=2)
            bad=arrow([-4.4,-.4,0],[-2.8,-1.7,0],VIOLET)
            self.play(GrowArrow(bad),run_time=1.3)
            cross=VGroup(Line([-3.7,-1.5,0],[-3.1,-.9,0],color=CORAL,stroke_width=5),
                         Line([-3.7,-.9,0],[-3.1,-1.5,0],color=CORAL,stroke_width=5))
            self.play(Create(cross),run_time=1.2)
            good=ArcBetweenPoints([-4.7,.8,0],[4.2,1.2,0],angle=-PI/3,color=TEAL)
            self.play(Create(good),run_time=1.5)
            self.play(MoveAlongPath(battery,good),run_time=4,rate_func=smooth)
            self.play(battery.animate.scale(.45).move_to([4.9,.1,0]),run_time=1.5)
            self.play(Write(label('en åtgärd bryter en möjlig kedja',[0,2.4,0],31,TEAL)),run_time=2)
            self.play(ShowPassingFlash(good.copy().set_stroke(width=7),time_width=.5),run_time=2)
            self.wait(4.5)

        with self.beat('Riskbedömning behöver flera frågor',
            'Ett ämnes namn räcker inte för att förstå hela risken. '
            'Fråga vilket ämne det är, om det kan orsaka skada, hur mycket en organism '
            'utsätts för och på vilket sätt. Naturligt betyder inte automatiskt ofarligt.',
            seconds=20, clear=True):
            cluster=unknown_cluster(scale=1.8)
            self.play(FadeIn(cluster),run_time=1.5)
            self.move_camera(phi=60*DEGREES,theta=-55*DEGREES,run_time=2.5)
            self.begin_ambient_camera_rotation(rate=.16);self.wait(4)
            self.stop_ambient_camera_rotation()
            self.move_camera(phi=0,theta=-90*DEGREES,run_time=2.5)
            self.play(cluster.animate.scale(.7).shift(LEFT*4.5),run_time=2)
            questions=VGroup(label('Vilket ämne?',[2.5,1.25,0],35,VIOLET),
                label('Vilken mängd?',[2.5,.2,0],35,GOLD),
                label('Vilken kontakt och tid?',[2.5,-.85,0],31,BLUE))
            self.play(LaggedStart(*[Write(t) for t in questions],lag_ratio=.22),run_time=3)
            self.play(Write(label('tänkt partikelmodell -- inte en vattenmolekyl',[0,-2.5,0],25,MUTED)),run_time=1.5)
            self.wait(3)

        with self.beat('Bygg ett svar där varje pil förklaras',
            'Ett utvecklat svar följer ett ämne från källa till möjlig följd och åtgärd. '
            'Beskriv också villkoren: om ämnet kan spridas, om en organism kan utsättas '
            'och vad åtgärden förändrar. Använd orden om, kan och därför.',
            seconds=19, clear=True):
            names=['källa','spridningsväg','organism','möjlig följd','åtgärd']
            xs=np.linspace(-5.8,5.8,5)
            cards=VGroup(*[box(2.3,1.15,[x,.8,0],[GOLD,VIOLET,BLUE,CORAL,TEAL][i])
                           for i,x in enumerate(xs)])
            texts=VGroup(*[label(t,[x,.8,0],25,[GOLD,VIOLET,BLUE,CORAL,TEAL][i],width=2.05)
                           for i,(t,x) in enumerate(zip(names,xs))])
            self.play(LaggedStart(*[Create(c) for c in cards],lag_ratio=.1),Write(texts),run_time=3)
            lines=VGroup(*[arrow([x+1.2,.8,0],[x+1.65,.8,0],TEAL) for x in xs[:-1]])
            self.play(LaggedStart(*[GrowArrow(a) for a in lines],lag_ratio=.2),run_time=2)
            conditions=VGroup(label('om',[-3.7,-.8,0],48,GOLD),
                              label('kan',[0,-.8,0],48,VIOLET),
                              label('därför',[3.7,-.8,0],48,TEAL))
            self.play(LaggedStart(*[Write(c) for c in conditions],lag_ratio=.2),run_time=3)
            for i in [0,2,4]:
                self.play(Indicate(cards[i],color=GOLD,scale_factor=1.08),run_time=1.3)
            self.play(Write(label('Förklara sambandet, inte bara namnen.',[0,-2.4,0],33,TEAL)),run_time=2)
            self.wait(5.1)
        self.finish('Följ ämnet, skilj fara från risk och skilj bioackumulering från biomagnifikation. '
                    'Förklara hur en åtgärd kan bryta en möjlig spridningsväg innan skadan uppstår.')

