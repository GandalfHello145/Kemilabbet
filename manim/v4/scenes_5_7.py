"""Six-step, silent chemistry explanations for year seven.

Original choreography: persistent particles, controlled comparisons and linked
diagrams inspired by the explanatory approach in the official 3b1b/videos repo.
All visible typography passes through LaTeX in core.py.
"""
import math
import numpy as np
from core import *


def lab(value, pos, size=31, color=INK, width=None):
    return tex(value, size=size, color=color, width=width).move_to(pos)


def eq(value, pos, size=38, color=INK):
    return mathtex(value, size=size, color=color).move_to(pos)


def card(w, h, pos, color=BLUE):
    return RoundedRectangle(width=w, height=h, corner_radius=.16,
        color=color, stroke_width=1.8, fill_color=color,
        fill_opacity=.045).move_to(pos)


def curve(points, color=TEAL, width=3):
    return VMobject(color=color, stroke_width=width).set_points_smoothly(points)


def water(positions, scale=.4):
    return VGroup(*[molecule2d(p, scale=scale, labels=False) for p in positions])


def flowing(group, origins, duration, amplitude=(.2,.15), rate=.8):
    origins=np.array(origins,dtype=float)
    def update(mobs, alpha):
        t=alpha*duration
        for i,(mob,p) in enumerate(zip(mobs,origins)):
            mob.move_to(p+[amplitude[0]*np.sin(t*rate+i*1.9),
                          amplitude[1]*np.sin(t*rate*1.3+i*2.1),0])
    return UpdateFromAlphaFunc(group,update,run_time=duration,rate_func=linear)


def fish(pos, scale=1, color=BLUE):
    body=Ellipse(width=1.25,height=.68,color=color,fill_color=color,fill_opacity=.12)
    tail=Polygon([.5,0,0],[.95,.4,0],[.95,-.4,0],
        color=color,fill_color=color,fill_opacity=.12)
    return VGroup(body,tail,Dot([-.35,.12,0],radius=.035,color=INK)).scale(scale).move_to(pos)


class MaterialMaster(MasterFilm):
    number=5
    topic='Egenskaper hjälper oss att välja material'
    slug='05-egenskaper'
    total_steps=6

    def construct(self):
        with self.beat('Jämför rättvist',
            'Två lika långa stavar värms lika mycket. Vi ändrar bara materialet. Då kan vi jämföra hur snabbt värmen sprids.',
            seconds=16,clear=True):
            rods=VGroup(*[RoundedRectangle(width=9,height=.52,corner_radius=.12,
                color=c,fill_color=c,fill_opacity=.15).move_to([.3,y,0])
                for y,c in [(1.0,CORAL),(-.8,GOLD)]])
            names=VGroup(lab('koppar',[-5.6,1,0],30,CORAL),lab('trä',[-5.6,-.8,0],30,GOLD))
            self.play(LaggedStart(*[DrawBorderThenFill(r) for r in rods],lag_ratio=.2),Write(names),run_time=2)
            braces=VGroup(Brace(rods[0],UP,color=MUTED),Brace(rods[1],DOWN,color=MUTED))
            same=VGroup(lab('samma längd',[.3,2.05,0],28),lab('samma tjocklek',[.3,-1.85,0],28))
            self.play(GrowFromCenter(braces),Write(same),run_time=2)
            heaters=VGroup(*[arrow([-4.15,y-.95,0],[-4.15,y-.35,0],CORAL)
                for y in [1,-.8]])
            self.play(LaggedStart(*[GrowArrow(a) for a in heaters],lag_ratio=.1),run_time=1.5)
            fronts=VGroup(*[glow_dot([-4.05,y,0],CORAL,.10) for y in [1,-.8]])
            self.play(FadeIn(fronts),run_time=.6)
            self.play(fronts[0].animate.shift(RIGHT*7.9),fronts[1].animate.shift(RIGHT*2.0),run_time=5.5,rate_func=linear)
            self.play(Write(lab('koppar leder värme snabbare',[.3,-2.6,0],32,TEAL)),run_time=1.7)
            self.wait(2.2)

        with self.beat('Energi sprids genom materialet',
            'När ena änden värms börjar delarna där röra sig mer. Energi förs vidare till grannarna. Materialet flyttar inte genom staven.',
            seconds=16,clear=True):
            positions=np.array([[-5.5+i*.73,y,0] for y in [-.65,.65] for i in range(16)])
            lattice=VGroup(*[dot_atom('',CORAL,.145,p) for p in positions])
            self.play(LaggedStart(*[GrowFromCenter(a) for a in lattice],lag_ratio=.015),run_time=1.8)
            wave=ValueTracker(-5.7)
            def vibrate(mobs):
                t=self.time
                for i,(m,p) in enumerate(zip(mobs,positions)):
                    strength=.025+.12*np.clip((wave.get_value()-p[0]+1.1)/2.2,0,1)
                    m.move_to(p+[strength*np.sin(t*13+i),strength*np.cos(t*11+i),0])
                    m.set_color(interpolate_color(BLUE,CORAL,np.clip((wave.get_value()-p[0]+1)/2,0,1)))
            lattice.add_updater(vibrate)
            energy=arrow([-6.7,0,0],[-5.8,0,0],GOLD)
            self.play(GrowArrow(energy),Write(lab('energi in',[-5.9,-1.9,0],28,GOLD)),run_time=1.5)
            front=Line([-5.5,-1.1,0],[-5.5,1.1,0],color=GOLD,stroke_width=2)
            front.add_updater(lambda m:m.set_x(wave.get_value()))
            self.add(front)
            self.play(wave.animate.set_value(5.5),run_time=8.0,rate_func=linear)
            self.play(Write(lab('granne till granne',[0,2.0,0],36,TEAL)),run_time=1.5)
            self.wait(2.5)
            lattice.clear_updaters();front.clear_updaters()

        with self.beat('Metall leder ström -- plast isolerar',
            'I metall kan elektroner röra sig genom materialet. En hel ledande väg behövs för ström. Plast runt sladden skyddar oss.',
            seconds=16,clear=True):
            route=RoundedRectangle(width=9,height=3.25,corner_radius=.55,color=CORAL,stroke_width=8).shift(DOWN*.15)
            coating=route.copy().set_stroke(GOLD,width=20,opacity=.2)
            self.play(Create(coating),Create(route),run_time=2)
            battery=VGroup(Line([-4.8,-.55,0],[-4.2,-.55,0],color=INK,stroke_width=4),
                Line([-4.95,-.15,0],[-4.05,-.15,0],color=INK,stroke_width=4))
            self.play(Create(battery),Write(lab('metall',[0,2.05,0],30,CORAL)),
                Write(lab('plast runt ledaren',[0,-2.4,0],28,GOLD)),run_time=1.5)
            charges=VGroup(*[glow_dot(route.point_from_proportion(i/15),BLUE,.047) for i in range(15)])
            self.play(FadeIn(charges),run_time=.5)
            def run(group,alpha):
                for i,d in enumerate(group):d.move_to(route.point_from_proportion((i/15+alpha*.32)%1))
            self.play(UpdateFromAlphaFunc(charges,run),run_time=4,rate_func=linear)
            gap=Rectangle(width=1.05,height=.52,color=BG,fill_color=BG,fill_opacity=1).move_to([1,1.475,0])
            stopped=lab('avbrott: ingen ström',[0,.15,0],34,VIOLET)
            self.play(FadeIn(gap),Write(stopped),run_time=1.5)
            self.play(Indicate(gap,color=VIOLET,scale_factor=1.2),run_time=1.5)
            self.wait(1.2)
            self.play(FadeOut(gap),FadeOut(stopped),run_time=.7)
            self.play(UpdateFromAlphaFunc(charges,run),run_time=2.5,rate_func=linear)

        with self.beat('Salt löser sig -- jonerna sprids',
            'Vatten kan lösa salt. Natriumjoner och kloridjoner lämnar kristallen och sprids i vattnet. Jonerna finns kvar även när saltet inte syns.',
            seconds=16,clear=True):
            vessel=VGroup(Line([-5.7,2,0],[-5.7,-1.6,0],color=BLUE),
                Line([-5.7,-1.6,0],[5.7,-1.6,0],color=BLUE),Line([5.7,-1.6,0],[5.7,2,0],color=BLUE),
                Line([-5.7,1.25,0],[5.7,1.25,0],color=BLUE,stroke_opacity=.35))
            ions=VGroup(*[dot_atom('+' if i%2==0 else '-',GOLD if i%2==0 else TEAL,.22,
                [-.95+(i%4)*.63,.6-(i//4)*.65,0]) for i in range(8)])
            self.play(Create(vessel),LaggedStart(*[GrowFromCenter(i) for i in ions],lag_ratio=.08),run_time=2)
            salt_title=VGroup(eq(r'\mathrm{NaCl}',[-1.4,2.2,0],38),
                lab('saltkristall',[1.3,2.2,0],30))
            self.play(Write(salt_title),run_time=1)
            dest=[[-4.5+i%4*3.0,.5-i//4*1.2,0] for i in range(8)]
            self.play(LaggedStart(*[ion.animate.move_to(p) for ion,p in zip(ions,dest)],lag_ratio=.08),run_time=5)
            self.play(Transform(salt_title,lab('joner i vattnet',[0,2.2,0],34,BLUE)),run_time=1)
            self.play(Write(eq(r'\mathrm{Na^+}+\mathrm{Cl^-}',[0,-2.4,0],36,TEAL)),run_time=1.7)
            self.play(flowing(ions,dest,4,(.22,.13)),run_time=4)

        with self.beat('Samma vatten -- olika löslighet',
            'Lika mycket salt och sand rörs i lika mycket vatten. Saltet löser sig. Sanden ligger kvar och kan fångas i ett filter.',
            seconds=16,clear=True):
            cups=VGroup(*[VGroup(Line([x-1.7,1.8,0],[x-1.7,-1,0],color=BLUE),
                Line([x-1.7,-1,0],[x+1.7,-1,0],color=BLUE),Line([x+1.7,-1,0],[x+1.7,1.8,0],color=BLUE),
                Line([x-1.7,1,0],[x+1.7,1,0],color=BLUE,stroke_opacity=.4)) for x in [-3.3,3.3]])
            self.play(Create(cups),Write(lab('salt',[-3.3,2.2,0],32,TEAL)),Write(lab('sand',[3.3,2.2,0],32,GOLD)),run_time=2)
            salt=VGroup(*[dot_atom('',TEAL,.065,[-3.8+i%4*.3,-.7+i//4*.2,0]) for i in range(8)])
            sand=VGroup(*[dot_atom('',GOLD,.065,[2.8+i%4*.3,-.7+i//4*.2,0]) for i in range(8)])
            self.play(FadeIn(salt),FadeIn(sand),run_time=.6)
            stirs=VGroup(*[Arc(radius=.55,start_angle=.2,angle=TAU*.85,color=MUTED).move_to([x,.2,0]).add_tip(tip_length=.16) for x in [-3.3,3.3]])
            self.play(Create(stirs),run_time=1)
            destinations=[[-4.5+i%4*.8,.65-i//4*1.0,0] for i in range(8)]
            self.play(LaggedStart(*[s.animate.move_to(p) for s,p in zip(salt,destinations)],lag_ratio=.06),
                Rotate(stirs[0],TAU),Rotate(stirs[1],TAU),run_time=4)
            self.play(FadeOut(cups[1]),FadeOut(stirs),run_time=1.4)
            paper=VMobject(color=INK,stroke_width=4).set_points_as_corners(
                [[1.7,-.15,0],[3.3,-1.25,0],[4.9,-.15,0]])
            self.play(Create(paper),Write(lab('sand stannar på filtret',[3.3,-2.65,0],26,GOLD)),run_time=2)
            self.play(*[s.animate.move_to([2.8+i%4*.3,-1.08+.55*abs(2.8+i%4*.3-3.3)+i//4*.16,0])
                for i,s in enumerate(sand)],run_time=1.8)
            drops=VGroup(*[glow_dot([3.3,-.2+i*.12,0],BLUE,.045) for i in range(5)])
            self.add(drops)
            self.play(flowing(salt,destinations,2.7,(.12,.1)),
                LaggedStart(*[d.animate.move_to([3.3,-2.15+i*.11,0]) for i,d in enumerate(drops)],lag_ratio=.16),
                Write(lab('vatten passerar',[5.65,-1.7,0],23,BLUE,width=2.7)),run_time=2.7)

        with self.beat('Välj egenskap efter uppgift',
            'Kastrullens botten ska sprida värme till maten. Handtaget ska skydda handen. Därför passar olika material till olika delar av samma produkt.',
            seconds=16,clear=True):
            pot=VGroup(Arc(radius=1.5,start_angle=PI,angle=PI,color=CORAL,stroke_width=7),
                Line([-1.5,0,0],[1.5,0,0],color=CORAL,stroke_width=5)).shift(LEFT*1.7+UP*.4)
            handle=RoundedRectangle(width=3.3,height=.34,corner_radius=.12,color=GOLD,fill_color=GOLD,fill_opacity=.2).next_to(pot,RIGHT,buff=0)
            self.play(Create(pot),GrowFromEdge(handle,LEFT),run_time=1.8)
            heat=VGroup(*[arrow([-2.85+i*.6,-2.15,0],[-2.85+i*.6,-1.2,0],CORAL) for i in range(5)])
            self.play(LaggedStart(*[GrowArrow(a) for a in heat],lag_ratio=.12),run_time=2)
            left=lab('metall: leder värme',[-3.2,2,0],34,CORAL)
            right=lab('trä: leder värme sämre',[3.25,2,0],31,GOLD,width=6.3)
            self.play(Write(left),Write(right),run_time=2)
            self.play(ShowPassingFlash(pot.copy().set_color(GOLD).set_stroke(width=10),time_width=.6),run_time=2.5)
            self.play(Indicate(handle,color=TEAL),run_time=1.8)
            chain=VGroup(lab('uppgift',[-4.9,-2.65,0],29,BLUE),lab('egenskap',[0,-2.65,0],29,GOLD),lab('materialval',[4.8,-2.65,0],29,TEAL))
            arrows=VGroup(arrow([-3.7,-2.65,0],[-1.4,-2.65,0]),arrow([1.4,-2.65,0],[3.3,-2.65,0]))
            self.play(Write(chain),LaggedStart(*[GrowArrow(a) for a in arrows],lag_ratio=.2),run_time=2.3)
            self.wait(3)
        self.finish('Jämför rättvist. Koppla materialets egenskaper till vad produkten behöver göra.')


class PhaseMaster(MasterFilm):
    number=6
    topic='Vatten byter form -- molekylerna finns kvar'
    slug='06-faser'
    total_steps=6

    def construct(self):
        ice=[[-2.3,.8,0],[-.75,1.2,0],[.8,.8,0],[-1.55,-.7,0],[0,-1.1,0],[1.55,-.7,0]]
        liquid=[[-1.5,.5,0],[-.25,.7,0],[1.05,.45,0],[-1.05,-.65,0],[.25,-.65,0],[1.5,-.6,0]]
        gas=[[-4.9,1.1,0],[-2.8,-1.3,0],[-.6,1.4,0],[1.3,-.8,0],[3.4,1,0],[5.2,-1.1,0]]
        mols=water(ice,.44)
        with self.beat('Fast form: molekylerna vibrerar',
            'Is består av vattenmolekyler. De har bestämda platser men vibrerar. Bindningarna inuti varje vattenmolekyl håller ihop samma syre och två väten.',
            seconds=16,clear=True):
            self.play(LaggedStart(*[FadeIn(m) for m in mols],lag_ratio=.13),run_time=2)
            bridges=VGroup(*[DashedLine(ice[i],ice[j],color=MUTED,dash_length=.08,stroke_opacity=.4)
                for i,j in [(0,1),(1,2),(0,3),(1,4),(2,5),(3,4),(4,5)]])
            molecule_label=eq(r'\mathrm{H_2O}',[4.8,.3,0],64,BLUE)
            solid_label=lab('bestämda platser',[0,2.25,0],34,TEAL)
            self.play(Create(bridges),Write(molecule_label),run_time=2)
            self.play(Write(solid_label),run_time=1.5)
            self.play(flowing(mols,ice,9.8,(.075,.065),rate=7),run_time=9.8)

        with self.beat('Flytande form: molekylerna glider förbi',
            'När isen smälter släpper det fasta mönstret. Vattenmolekylerna ligger fortfarande nära men kan byta plats. Det är fortfarande vatten.',
            seconds=16):
            self.play(FadeOut(bridges),FadeOut(molecule_label),FadeOut(solid_label),run_time=1.1)
            self.play(LaggedStart(*[m.animate.move_to(p) for m,p in zip(mols,liquid)],lag_ratio=.08),run_time=3)
            nearby=lab('nära varandra -- nya grannar',[0,2.25,0],34,TEAL)
            self.play(Write(nearby),run_time=1.5)
            starts=[m.get_center().copy() for m in mols]
            def slide(group,alpha):
                for i,(m,p) in enumerate(zip(group,starts)):
                    m.move_to(p+[.42*np.sin(alpha*TAU+i*2),.26*np.sin(alpha*TAU*1.4+i),0])
            self.play(UpdateFromAlphaFunc(mols,slide),run_time=9.8,rate_func=linear)

        with self.beat('Gas: molekylerna rör sig fritt',
            'I vattenånga är avstånden mellan molekylerna mycket större. Samma vattenmolekyler rör sig fritt. De växer inte och delas inte till atomer.',
            seconds=16):
            self.play(FadeOut(nearby),run_time=.6)
            self.play(LaggedStart(*[m.animate.move_to(p) for m,p in zip(mols,gas)],lag_ratio=.08),run_time=3)
            same=lab('samma molekyler, större avstånd',[0,2.3,0],34,GOLD)
            self.play(Write(same),run_time=1.4)
            traces=VGroup(*[TracedPath(m.get_center,dissipating_time=1.0,
                stroke_color=BLUE,stroke_width=2,stroke_opacity=[0,.4]) for m in mols])
            self.add(traces)
            self.play(flowing(mols,gas,10.3,(.48,.32),rate=1.25),run_time=10.3)
            traces.clear_updaters(recursive=True)

        with self.beat('Koppla rörelsen till uppvärmningskurvan',
            'När vatten värms ökar oftast temperaturen. Vid normalt lufttryck smälter is vid noll grader och vatten kokar vid hundra grader.',
            seconds=17):
            self.play(FadeOut(same),FadeOut(traces),run_time=.6)
            panel=card(4.1,4.2,[4.7,0,0],BLUE)
            axes=VGroup(arrow([-6.1,-2.05,0],[1.7,-2.05,0],MUTED),
                arrow([-6.1,-2.05,0],[-6.1,1.75,0],MUTED))
            # Energy per kilogram for ice -15 -> 0 C, fusion, liquid 0 -> 100 C,
            # vaporisation, then steam 100 -> 120 C at normal air pressure.
            energy_knots=np.r_[0,np.cumsum([31.5,334.0,418.0,2256.0,40.0])]
            def point(q,y):return np.array([-5.8+6.9*q/energy_knots[-1],-1.35+.023*y,0])
            points=[point(q,t) for q,t in zip(energy_knots,[-15,0,0,100,100,120])]
            graph=VMobject(color=GOLD,stroke_width=4).set_points_as_corners(points)
            guides=VGroup(*[DashedLine([-6.05,point(0,y)[1],0],[point(x,y)[0],point(x,y)[1],0],
                color=MUTED,stroke_opacity=.3,dash_length=.09)
                for x,y in [(energy_knots[2],0),(energy_knots[4],100)]])
            labels=VGroup(lab('Temperatur',[-5.05,2.05,0],27),lab('Tillförd energi',[-2.2,-2.6,0],27),
                eq(r'0^\circ\mathrm{C}',[-6.7,-1.35,0],25,BLUE),eq(r'100^\circ\mathrm{C}',[-6.7,.95,0],25,CORAL),
                lab('normalt lufttryck',[-2.2,1.85,0],22,MUTED))
            self.play(Create(panel),Create(axes),Create(guides),Write(labels),
                *[m.animate.move_to([3.5+i%3*1.15,.65-i//3*1.25,0]) for i,m in enumerate(mols)],run_time=2)
            self.play(Create(graph),run_time=1.6)
            progress=ValueTracker(0)
            cursor=glow_dot(points[0],GOLD,.06)
            ice_small=np.array([[3.5+i%3*1.15,.65-i//3*1.25,0] for i in range(6)])
            liquid_small=np.array([[3.7+i%3*.92,.35-i//3*.8,0] for i in range(6)])
            gas_small=np.array([[3.15+i%3*1.5,1.2-i//3*2.4,0] for i in range(6)])
            def track(_):
                value=min(progress.get_value(),4.9999);segment=int(value);f=value-segment
                cursor.move_to(interpolate(points[segment],points[segment+1],f))
                if value<1:targets=ice_small;amp=.035
                elif value<2:targets=interpolate(ice_small,liquid_small,value-1);amp=.08
                elif value<3:targets=liquid_small;amp=.12
                elif value<4:targets=interpolate(liquid_small,gas_small,value-3);amp=.18
                else:targets=gas_small;amp=.22
                for i,m in enumerate(mols):
                    m.move_to(targets[i]+[amp*np.sin(self.time*3+i),amp*.7*np.cos(self.time*4+i),0])
            cursor.add_updater(track);mols.add_updater(lambda _:None);self.add(cursor)
            self.play(progress.animate.set_value(4.9999),run_time=11.5,rate_func=linear)
            cursor.clear_updaters();mols.clear_updaters()
            graph_objects=VGroup(panel,axes,guides,labels,graph,cursor)

        with self.beat('En platå betyder att formen ändras',
            'Vid smältning och kokning ändras ordningen mellan molekylerna. Temperaturen står stilla under övergången. Molekylerna blir inte större.',
            seconds=16):
            plateaus=VGroup(Line(points[1],points[2],color=TEAL,stroke_width=8),
                Line(points[3],points[4],color=CORAL,stroke_width=8))
            self.play(Create(plateaus),FadeOut(cursor),run_time=1.5)
            notes=VGroup(lab('smältning',(points[1]+points[2])/2+DOWN*.43,25,TEAL),
                lab('kokning',(points[3]+points[4])/2+UP*.55,25,CORAL))
            self.play(Write(notes),run_time=1.8)
            energy=VGroup(*[arrow([2.1,-1.15+j*.6,0],[2.9,-1.15+j*.6,0],GOLD) for j in range(4)])
            self.play(LaggedStart(*[GrowArrow(a) for a in energy],lag_ratio=.12),run_time=1.5)
            fixedsize=lab('samma storlek',[4.7,2.45,0],28,BLUE)
            self.play(Write(fixedsize),run_time=1.2)
            self.play(flowing(mols,gas_small,7.0,(.23,.19),rate=1.4),
                ShowPassingFlash(plateaus[0].copy().set_color(GOLD),time_width=.7),
                ShowPassingFlash(plateaus[1].copy().set_color(GOLD),time_width=.7),run_time=7)
            self.play(Indicate(mols[0],color=BLUE,scale_factor=1),run_time=1.5)
            self.wait(1)
            graph_objects.add(plateaus,notes,energy,fixedsize)

        with self.beat('Kondensering: vattenånga blir vätska',
            'När vattenånga kyls kan molekylerna samlas till flytande vatten. Det kallas kondensering. Moln och imma består av små vattendroppar.',
            seconds=16):
            self.play(FadeOut(graph_objects),run_time=1)
            self.play(*[m.animate.move_to(p) for m,p in zip(mols,gas)],run_time=2)
            outward=arrow([0,1.1,0],[0,2.4,0],BLUE)
            self.play(GrowArrow(outward),Write(lab('energi till omgivningen',[3.3,2.15,0],28,BLUE)),run_time=1.5)
            self.play(LaggedStart(*[m.animate.move_to(p) for m,p in zip(mols,liquid)],lag_ratio=.1),run_time=4)
            drop=Circle(radius=2.25,color=BLUE,stroke_width=2.5,fill_color=BLUE,fill_opacity=.035).shift(DOWN*.05)
            self.play(Create(drop),Write(eq(r'\mathrm{H_2O}\longrightarrow\mathrm{H_2O}',[0,-2.65,0],34,TEAL)),run_time=1.8)
            self.play(flowing(mols,liquid,5,(.2,.12),rate=1.2),run_time=5)
        self.finish('Fast, flytande och gas: samma vattenmolekyler, olika rörelse och avstånd.')


class EnvironmentMaster(MasterFilm):
    number=7
    topic='Giftfri miljö: följ ämnet och bryt spridningen'
    slug='07-miljo'
    total_steps=6

    def construct(self):
        with self.beat('Ett utsläpp börjar vid en källa',
            'Färgrester i avloppet kan släppa ut ämnen som skadar vattenlevande organismer. Följ ett ämne från utsläpp till möjlig följd.',
            seconds=17,clear=True):
            can=VGroup(Rectangle(width=1.35,height=1.65,color=VIOLET,fill_color=VIOLET,fill_opacity=.15),
                Ellipse(width=1.35,height=.3,color=VIOLET).shift(UP*.82),
                lab('färg',[0,0,0],30,VIOLET)).move_to([-4.9,1.1,0])
            drain=VGroup(Rectangle(width=2.6,height=.45,color=MUTED,fill_color=MUTED,fill_opacity=.08),
                *[Line([x,-.2,0],[x,.2,0],color=MUTED) for x in np.linspace(-1.15,1.15,9)]).move_to([-1.5,-.4,0])
            pipe=curve([[-1.5,-.7,0],[-1.5,-1.8,0],[1,-1.8,0],[3.3,-.8,0],[5.5,-.8,0]],BLUE,4)
            self.play(Create(can),Create(drain),Create(pipe),run_time=2)
            self.play(Write(lab('avlopp',[-1.5,.4,0],29,MUTED)),Write(lab('vatten',[4.6,-1.7,0],30,BLUE)),run_time=1.5)
            pour=curve([[-4.55,.8,0],[-3.5,.4,0],[-2.5,-.1,0],[-1.5,-.4,0]],VIOLET,3)
            self.play(Rotate(can,-PI/6),Create(pour),run_time=1.5)
            tracers=VGroup(*[glow_dot(pour.get_start(),VIOLET,.055) for _ in range(12)])
            self.add(tracers)
            self.play(LaggedStart(*[MoveAlongPath(d,pour) for d in tracers],lag_ratio=.08),run_time=3)
            self.play(LaggedStart(*[MoveAlongPath(d,pipe) for d in tracers],lag_ratio=.07),run_time=5)
            self.play(Write(lab('källa',[0,2.2,0],34,VIOLET)),GrowArrow(arrow([1.2,2.2,0],[3,2.2,0],VIOLET)),
                Write(lab('spridning',[4.6,2.2,0],34,BLUE)),run_time=2)
            self.wait(1.5)

        with self.beat('Vatten transporterar lösta ämnen',
            'Ämnen kan lösas i vatten och följa med strömmen. Därför kan ett utsläpp påverka organismer en bit från själva källan.',
            seconds=17,clear=True):
            center=curve([[-6.4,.8,0],[-3.5,-.3,0],[-.2,.9,0],[3.3,-.4,0],[6.4,.1,0]],BLUE,2)
            banks=VGroup(center.copy().shift(UP*.8).set_stroke(BLUE,2,.35),
                center.copy().shift(DOWN*.8).set_stroke(BLUE,2,.35))
            waterlines=VGroup(*[center.copy().shift(UP*dy).set_stroke(BLUE,1,.16) for dy in [-.6,-.3,0,.3,.6]])
            self.play(Create(banks),Create(waterlines),run_time=2)
            particles=VGroup(*[glow_dot(center.point_from_proportion(i/20),VIOLET,.055) for i in range(16)])
            self.play(FadeIn(particles),Write(lab('löst ämne följer vattnet',[0,2.25,0],34,VIOLET)),run_time=1.5)
            paths=[center.copy().shift(UP*((i%3-1)*.22)) for i in range(16)]
            trails=VGroup(*[TracedPath(d.get_center,dissipating_time=.7,stroke_color=VIOLET,
                stroke_width=2,stroke_opacity=[0,.5]) for d in particles[::3]])
            self.add(trails)
            def advect(group,alpha):
                for i,d in enumerate(group):d.move_to(paths[i].point_from_proportion((i/20+alpha*.65)%1))
            smallfish=fish([4,-.1,0],.75)
            self.play(FadeIn(smallfish),UpdateFromAlphaFunc(particles,advect),run_time=10,rate_func=linear)
            self.play(Indicate(smallfish,color=GOLD),run_time=1.8)
            self.wait(1.2)
            trails.clear_updaters(recursive=True)

        with self.beat('Ämnet och mängden spelar roll',
            'Risken beror på ämnets egenskaper och hur mycket organismen utsätts för. Även tiden spelar roll. Alla kemiska ämnen är inte miljögifter.',
            seconds=17,clear=True):
            tanks=VGroup(card(5.1,3.0,[-3.35,.2,0],BLUE),card(5.1,3.0,[3.35,.2,0],BLUE))
            self.play(Create(tanks),Write(lab('samma mängd vatten',[0,2.3,0],32)),run_time=2)
            fs=VGroup(fish([-3.35,-.3,0],.7),fish([3.35,-.3,0],.7))
            self.play(FadeIn(fs),run_time=.8)
            low=VGroup(*[glow_dot([-4.2+i*.55,.85,0],VIOLET,.055) for i in range(3)])
            high=VGroup(*[glow_dot([1.65+i%6*.6,.55+i//6*.5,0],VIOLET,.055) for i in range(12)])
            self.play(LaggedStart(*[FadeIn(d) for d in low],lag_ratio=.1),
                LaggedStart(*[FadeIn(d) for d in high],lag_ratio=.04),run_time=2)
            labs=VGroup(lab('lägre halt',[-3.35,-1.8,0],30,TEAL),lab('högre halt',[3.35,-1.8,0],30,VIOLET))
            self.play(Write(labs),run_time=1.5)
            lowstart=[d.get_center().copy() for d in low];highstart=[d.get_center().copy() for d in high]
            self.play(flowing(low,lowstart,5,(.15,.16)),flowing(high,highstart,5,(.15,.16)),run_time=5)
            factors=VGroup(lab('vilket ämne?',[-4.7,-2.6,0],28,GOLD),
                lab('hur mycket?',[0,-2.6,0],28,VIOLET),lab('hur länge?',[4.7,-2.6,0],28,BLUE))
            self.play(LaggedStart(*[Write(t) for t in factors],lag_ratio=.2),run_time=2)
            self.play(Indicate(low,color=TEAL,scale_factor=1),Indicate(high,color=VIOLET,scale_factor=1),run_time=1.5)
            self.wait(1.7)

        with self.beat('Vissa ämnen kan anrikas i näringskedjan',
            'Vissa svårnedbrytbara ämnen stannar i organismer. När rovdjur äter många bytesdjur kan halten bli högre. Vi jämför lika stora vävnadsprov.',
            seconds=17,clear=True):
            plankton=VGroup(*[Circle(radius=.12,color=TEAL,fill_color=TEAL,fill_opacity=.15).move_to(
                [-4.8+(i%2)*.4,.7+(i//2)*.4,0]) for i in range(4)])
            animals=VGroup(plankton,fish([0,1.0,0],.85),fish([4.7,1,0],1.5))
            labels=VGroup(lab('plankton',[-4.6,2.2,0],30,TEAL),lab('småfisk',[0,2.2,0],30,BLUE),
                lab('rovfisk',[4.7,2.2,0],30,GOLD))
            self.play(FadeIn(animals),Write(labels),run_time=2)
            arrows=VGroup(arrow([-3.5,1,0],[-1.1,1,0],VIOLET),arrow([1.3,1,0],[3.2,1,0],VIOLET))
            self.play(LaggedStart(*[GrowArrow(a) for a in arrows],lag_ratio=.2),run_time=1.5)
            mover=glow_dot([-3.5,1,0],VIOLET,.07);self.add(mover)
            self.play(mover.animate.move_to([-1.1,1,0]),run_time=1.5)
            self.play(mover.animate.move_to([3.2,1,0]),run_time=1.5)
            samples=VGroup(*[card(2.3,1.7,[x,-1.35,0],MUTED) for x in [-4.6,0,4.7]])
            self.play(Create(samples),run_time=1)
            dots=VGroup(*[VGroup(*[glow_dot([x+(i%4-1.5)*.34,-1.35+(i//4-.5)*.34,0],VIOLET,.045)
                for i in range(count)]) for x,count in [(-4.6,1),(0,4),(4.7,10)]])
            self.play(LaggedStart(*[FadeIn(d) for d in dots],lag_ratio=.3),run_time=2.5)
            self.play(Write(lab('lika stora vävnadsprov',[0,-2.6,0],30,MUTED)),run_time=1.3)
            self.play(ShowPassingFlash(arrows[0].copy().set_color(GOLD),time_width=.8),
                ShowPassingFlash(arrows[1].copy().set_color(GOLD),time_width=.8),run_time=2)
            self.play(Indicate(samples[2],color=VIOLET),run_time=1.5)
            self.wait(1.2)

        with self.beat('Rening hjälper -- allt fångas inte',
            'Ett filter fångar fasta partiklar. Lösta ämnen kan passera. Rening hjälper, men alla föroreningar tas inte bort. Förebygg därför utsläpp.',
            seconds=17,clear=True):
            filter=VGroup(*[Line([-1.9,-1.4+i*.28,0],[-1.3,-1.4+i*.28,0],color=INK,stroke_width=2) for i in range(11)])
            treatment=card(3.3,3,[1.45,0,0],BLUE)
            pathline=Line([-6.1,0,0],[6.1,0,0],color=BLUE,stroke_width=2,stroke_opacity=.3)
            self.play(Create(pathline),Create(filter),Create(treatment),run_time=2)
            self.play(Write(lab('filter',[-1.6,2.05,0],30)),Write(lab('mer rening',[1.45,2.05,0],30,BLUE)),run_time=1.3)
            solids=VGroup(*[dot_atom('',GOLD,.10,[-5.8+i%3*.4,-.6+i//3*1.0,0]) for i in range(6)])
            dissolved=VGroup(*[glow_dot([-5.8+i%3*.4,-.25+i//3*.6,0],VIOLET,.045) for i in range(6)])
            self.play(FadeIn(solids),FadeIn(dissolved),run_time=.8)
            self.play(*[s.animate.move_to([-2.05,-1+i*.4,0]) for i,s in enumerate(solids)],
                *[d.animate.move_to([.5+i%3*.5,-.7+i//3*.7,0]) for i,d in enumerate(dissolved)],run_time=4)
            self.play(Indicate(solids,color=GOLD,scale_factor=1),run_time=1.3)
            self.play(*[d.animate.set_opacity(.25) for d in dissolved[:4]],
                *[d.animate.move_to([5.3,.25+j*.55,0]) for j,d in enumerate(dissolved[4:])],run_time=3.5)
            self.play(Write(lab('fångas',[-4.4,-2.3,0],29,GOLD)),
                Write(lab('en del finns kvar',[4.6,-2.3,0],28,VIOLET)),run_time=1.5)
            self.play(Indicate(dissolved[4:],color=VIOLET,scale_factor=1.15),run_time=1.5)
            self.wait(.6)

        with self.beat('Bryt spridningsvägen vid källan',
            'Lämna färgrester som farligt avfall. Då bryts spridningsvägen redan vid källan. Minska utsläpp innan ämnen når mark och vatten.',
            seconds=17,clear=True):
            can=VGroup(Rectangle(width=1.15,height=1.4,color=VIOLET,fill_color=VIOLET,fill_opacity=.15),
                lab('färg',[0,0,0],28,VIOLET)).move_to([-5,1,0])
            box=card(3.8,2.8,[4.5,.6,0],TEAL)
            good_label=lab('farligt avfall',[4.5,2.3,0],32,TEAL)
            drain=VGroup(Line([-5.7,-1.4,0],[-3.3,-1.4,0],color=MUTED),
                *[Line([x,-1.7,0],[x,-1.15,0],color=MUTED) for x in np.linspace(-5.5,-3.5,7)])
            self.play(Create(can),Create(box),Write(good_label),Create(drain),run_time=2)
            bad=arrow([-5,.1,0],[-4.6,-1.2,0],VIOLET)
            self.play(GrowArrow(bad),run_time=1)
            cross=VGroup(Line([-5.4,-1.1,0],[-4.1,.2,0],color=CORAL,stroke_width=5),
                Line([-5.4,.2,0],[-4.1,-1.1,0],color=CORAL,stroke_width=5))
            self.play(Create(cross),run_time=1)
            safe=curve([[-4.5,1.2,0],[-1.6,2,0],[1.2,1.7,0],[4.5,.8,0]],TEAL,4)
            self.play(Create(safe),run_time=1.4)
            self.play(MoveAlongPath(can,safe),run_time=4,rate_func=smooth)
            self.play(can.animate.scale(.75).move_to([4.5,.3,0]),run_time=1.2)
            consequence=VGroup(lab('rätt hantering',[-4.2,-2.45,0],31,TEAL),
                lab('mindre spridning',[3.6,-2.45,0],31,BLUE),arrow([-1.9,-2.45,0],[1.1,-2.45,0],TEAL))
            self.play(Write(consequence[:2]),GrowArrow(consequence[2]),run_time=2)
            self.play(ShowPassingFlash(safe.copy().set_stroke(width=7),time_width=.8),run_time=2)
            self.wait(1.8)
        self.finish('Följ ämnet från källa till följd. Rätt hantering kan bryta spridningen innan den börjar.')
