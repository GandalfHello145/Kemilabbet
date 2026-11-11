"""Everyday comparisons, the same water molecules, and one waste pathway."""
from shared import *


def cup(x,width=3.6):
    return VGroup(Line([x-width/2,1.6,0],[x-width/2,-1.6,0],color=BLUE,stroke_width=3),
        Line([x-width/2,-1.6,0],[x+width/2,-1.6,0],color=BLUE,stroke_width=3),
        Line([x+width/2,-1.6,0],[x+width/2,1.6,0],color=BLUE,stroke_width=3),
        Line([x-width/2,.8,0],[x+width/2,.8,0],color=BLUE,stroke_opacity=.4))


class MaterialMaster(MasterFilm):
    number=5
    topic='Vad passar materialet till?'
    slug='05-egenskaper'
    total_steps=5

    def construct(self):
        with self.beat('Jämför två material rättvist',
            'Vi värmer två lika långa stavar lika mycket. Bara materialet är olika.',seconds=17,clear=True):
            rods=VGroup(*[RoundedRectangle(width=8.7,height=.65,corner_radius=.1,
                color=c,fill_color=c,fill_opacity=.12).move_to([.6,y,0])
                for y,c in [(1.0,CORAL),(-.9,GOLD)]])
            self.play(Create(rods),run_time=2)
            names=VGroup(label('koppar',[-5.6,1,0],39,CORAL),label('trä',[-5.6,-.9,0],39,GOLD))
            self.play(FadeIn(names),run_time=2)
            braces=VGroup(Brace(rods[0],UP,color=MUTED),Brace(rods[1],DOWN,color=MUTED))
            self.play(GrowFromCenter(braces),FadeIn(label('lika långa',[.6,2.25,0],38)),run_time=2)
            heat=VGroup(*[arrow([-3.55,y-.95,0],[-3.55,y-.4,0],CORAL) for y in [1,-.9]])
            self.play(LaggedStart(*[GrowArrow(a) for a in heat],lag_ratio=.2),run_time=2)
            self.wait(8)

        with self.beat('Koppar leder värme snabbare',
            'Värmen sprids snabbare genom koppar än genom trä. Det är en materialegenskap.',seconds=17):
            fronts=VGroup(*[glow_dot([-3.5,y,0],CORAL,.13) for y in [1,-.9]])
            self.play(FadeIn(fronts),run_time=1)
            tracks=VGroup(*[TracedPath(d.get_center,stroke_color=CORAL,stroke_width=7,
                stroke_opacity=.7) for d in fronts])
            self.add(tracks)
            self.play(fronts[0].animate.shift(RIGHT*7.8),fronts[1].animate.shift(RIGHT*2.0),
                run_time=7,rate_func=linear)
            self.play(FadeIn(label('värme sprids',[.6,-2.45,0],43,TEAL)),run_time=2)
            self.wait(6)
            tracks.clear_updaters(recursive=True)

        with self.beat('Salt och sand beter sig olika',
            'Salt löser sig i vatten. Sanden ligger kvar på botten.',seconds=17,clear=True):
            cups=VGroup(cup(-3.25),cup(3.25))
            self.play(Create(cups),FadeIn(label('salt',[-3.25,2.25,0],44,TEAL)),
                FadeIn(label('sand',[3.25,2.25,0],44,GOLD)),run_time=2)
            salt=VGroup(*[atom('+' if i%2==0 else '-',GOLD if i%2==0 else TEAL,
                [-3.8+i%3*.5,-.5+i//3*.5,0],.13) for i in range(6)])
            sand=VGroup(*[Circle(radius=.10,color=GOLD,fill_color=GOLD,fill_opacity=.25).move_to(
                [2.7+i%3*.5,-.5+i//3*.5,0]) for i in range(6)])
            self.play(FadeIn(salt),FadeIn(sand),run_time=1.5)
            targets=[[-4.3+i%3*1.05,.2-i//3*1.15,0] for i in range(6)]
            self.play(*[s.animate.move_to(p) for s,p in zip(salt,targets)],
                sand.animate.shift(DOWN*.8),run_time=5)
            self.play(FadeIn(label('löser sig',[-3.25,-2.35,0],38,TEAL)),
                FadeIn(label('ligger kvar',[3.25,-2.35,0],38,GOLD)),run_time=2)
            self.play(drift(salt,targets,6,.08),run_time=6)

        with self.beat('Saltet har inte försvunnit',
            'Saltets joner sprids i vattnet. Saltet finns kvar även när du inte ser det.',seconds=17,clear=True):
            vessel=cup(0,10)
            ions=VGroup(*[atom('+' if i%2==0 else '-',GOLD if i%2==0 else TEAL,
                [-.65+i%3*.65,.2-i//3*.65,0],.24) for i in range(6)])
            self.play(Create(vessel),FadeIn(ions),run_time=2)
            names=label('joner',[0,2.25,0],46)
            self.play(FadeIn(names),run_time=1.5)
            positions=[[-3.4+i%3*3.4,.2-i//3*1.25,0] for i in range(6)]
            self.play(LaggedStart(*[ion.animate.move_to(p) for ion,p in zip(ions,positions)],lag_ratio=.12),run_time=5)
            self.play(drift(ions,positions,7,.13),run_time=7)
            self.wait(1)

        with self.beat('Välj material efter uppgiften',
            'Kastrullens botten ska leda värme. Handtaget ska skydda handen från värmen.',seconds=17,clear=True):
            pot=VGroup(Arc(radius=1.6,start_angle=PI,angle=PI,color=CORAL,stroke_width=8),
                Line([-1.6,0,0],[1.6,0,0],color=CORAL,stroke_width=5)).shift(LEFT*1.7+UP*.4)
            handle=RoundedRectangle(width=3.7,height=.45,corner_radius=.15,color=GOLD,
                fill_color=GOLD,fill_opacity=.15).next_to(pot,RIGHT,buff=0)
            self.play(Create(pot),GrowFromEdge(handle,LEFT),run_time=2)
            self.play(FadeIn(label('metall',[-3.6,2.2,0],45,CORAL)),run_time=1.5)
            heats=VGroup(*[arrow([-2.7+i*.65,-2.3,0],[-2.7+i*.65,-1.3,0],CORAL) for i in range(4)])
            self.play(LaggedStart(*[GrowArrow(a) for a in heats],lag_ratio=.15),run_time=3)
            self.play(ShowPassingFlash(pot.copy().set_color(GOLD),time_width=.8),run_time=3)
            self.play(FadeIn(label('trä',[3.5,2.2,0],45,GOLD)),run_time=1.5)
            self.play(Create(SurroundingRectangle(handle,buff=.18,color=TEAL)),run_time=2)
            self.wait(3)
        self.finish('Ett material passar bra när dess egenskaper hjälper produkten att fungera.')


class PhaseMaster(MasterFilm):
    number=6
    topic='Samma vatten -- tre former'
    slug='06-faser'
    total_steps=5

    def construct(self):
        ice=np.array([[-1.6,.95,0],[1.6,.95,0],[-1.6,-.95,0],[1.6,-.95,0]])
        liquid=np.array([[-.95,.65,0],[.95,.65,0],[-.95,-.65,0],[.95,-.65,0]])
        gas=np.array([[-4.4,1.05,0],[3.8,1.3,0],[-3.2,-1.3,0],[4.6,-1.15,0]])
        molecules=VGroup(*[water(p,.9) for p in ice])
        with self.beat('Is: molekylerna har bestämda platser',
            'I is sitter vattenmolekylerna på bestämda platser. De står inte stilla, utan vibrerar.',seconds=17,clear=True):
            self.play(FadeIn(molecules),run_time=2)
            joins=VGroup(*[DashedLine(ice[a],ice[b],color=MUTED,dash_length=.12,stroke_opacity=.4)
                for a,b in [(0,1),(0,2),(1,3),(2,3)]])
            self.play(Create(joins),run_time=2)
            state=label('fast form',[0,2.3,0],45,BLUE)
            self.play(FadeIn(state),run_time=1.5)
            self.play(drift(molecules,ice,10.5,.065,speed=7),run_time=10.5)

        with self.beat('Vätska: molekylerna kan byta plats',
            'När is smälter kan molekylerna röra sig förbi varandra. Det är fortfarande vatten.',seconds=17):
            self.play(FadeOut(joins),FadeOut(state),run_time=1)
            self.play(*[m.animate.move_to(p) for m,p in zip(molecules,liquid)],run_time=3)
            state=label('flytande form',[0,2.3,0],45,TEAL)
            self.play(FadeIn(state),run_time=1.5)
            def exchange(group,alpha):
                for i,(m,p) in enumerate(zip(group,liquid)):
                    m.move_to(p+[.38*np.sin(alpha*TAU+i*PI/2),.18*np.sin(alpha*TAU*1.5+i),0])
            self.play(UpdateFromAlphaFunc(molecules,exchange),run_time=10.5,rate_func=linear)

        with self.beat('Gas: längre mellan molekylerna',
            'I vattenånga rör sig molekylerna fritt. Avstånden är större, men molekylerna är lika stora.',seconds=17):
            self.play(FadeOut(state),run_time=1)
            self.play(*[m.animate.move_to(p) for m,p in zip(molecules,gas)],run_time=3.5)
            state=label('gasform',[0,2.3,0],45,GOLD)
            self.play(FadeIn(state),run_time=1.5)
            trails=VGroup(*[TracedPath(m.get_center,dissipating_time=.8,stroke_color=BLUE,
                stroke_width=2,stroke_opacity=[0,.35]) for m in molecules])
            self.add(trails)
            self.play(drift(molecules,gas,10,.35,speed=1.4),run_time=10)
            trails.clear_updaters(recursive=True)

        with self.beat('Värm vattnet -- följ kurvan',
            'Is smälter vid 0 grader. Vatten kokar vid 100 grader, vid vanligt lufttryck.',seconds=20):
            self.play(FadeOut(state),FadeOut(trails),run_time=.7)
            frame=panel(4.7,4.25,[4.6,0,0],BLUE)
            energy=np.r_[0,np.cumsum([31.5,334,418,2256,40])]
            def pt(q,t):return np.array([-5.7+6.6*q/energy[-1],-1.25+.023*t,0])
            points=[pt(q,t) for q,t in zip(energy,[-15,0,0,100,100,120])]
            graph=VMobject(color=GOLD,stroke_width=4).set_points_as_corners(points)
            axes=VGroup(arrow([-6,-2.15,0],[1.5,-2.15,0],MUTED),
                arrow([-6,-2.15,0],[-6,1.7,0],MUTED))
            guides=VGroup(*[DashedLine([-5.95,pt(0,t)[1],0],pt(q,t),color=MUTED,
                dash_length=.1,stroke_opacity=.3) for q,t in [(energy[2],0),(energy[4],100)]])
            labels=VGroup(label('temperatur',[-4.7,2.1,0],34),label('tillförd värme',[-2.1,-2.55,0],32),
                formula(r'0^\circ\mathrm C',[-6.75,-1.25,0],31,BLUE),
                formula(r'100^\circ\mathrm C',[-6.75,1.05,0],31,CORAL))
            small_ice=np.array([[3.45,1,0],[5.65,1,0],[3.45,-1,0],[5.65,-1,0]])
            small_liquid=np.array([[3.7,.65,0],[5.4,.65,0],[3.7,-.65,0],[5.4,-.65,0]])
            small_gas=np.array([[3.25,1.2,0],[5.85,1.2,0],[3.25,-1.2,0],[5.85,-1.2,0]])
            self.play(Create(frame),Create(axes),Create(guides),FadeIn(labels),
                *[m.animate.move_to(p) for m,p in zip(molecules,small_ice)],run_time=2)
            self.play(Create(graph),run_time=2)
            step=ValueTracker(0);cursor=glow_dot(points[0],GOLD,.065)
            def tracking(_):
                v=min(step.get_value(),4.9999);part=int(v);f=v-part
                cursor.move_to(interpolate(points[part],points[part+1],f))
                if v<1:positions=small_ice;a=.025
                elif v<2:positions=interpolate(small_ice,small_liquid,v-1);a=.06
                elif v<3:positions=small_liquid;a=.09
                elif v<4:positions=interpolate(small_liquid,small_gas,v-3);a=.12
                else:positions=small_gas;a=.14
                for i,(m,p) in enumerate(zip(molecules,positions)):
                    m.move_to(p+[a*np.sin(self.time*4+i),a*.5*np.cos(self.time*5+i),0])
            cursor.add_updater(tracking);molecules.add_updater(lambda _:None);self.add(cursor)
            self.play(step.animate.set_value(4.9999),run_time=10,rate_func=linear)
            cursor.clear_updaters();molecules.clear_updaters()
            self.cue('Kurvan är platt när is smälter eller vatten kokar.')
            plateaus=VGroup(Line(points[1],points[2],color=TEAL,stroke_width=7),
                Line(points[3],points[4],color=CORAL,stroke_width=7))
            self.play(Create(plateaus),run_time=1.5)
            self.wait(3)
            graph_objects=VGroup(frame,axes,guides,labels,graph,cursor,plateaus)

        with self.beat('Vattenånga kan bli vätska igen',
            'Vattenånga som kyls blir flytande vatten. Det heter kondensering.',seconds=17):
            self.play(FadeOut(graph_objects),run_time=1)
            self.play(*[m.animate.move_to(p) for m,p in zip(molecules,gas)],run_time=2)
            cool=label('kyls',[0,2.3,0],46,BLUE)
            self.play(FadeIn(cool),run_time=1.5)
            self.play(*[m.animate.move_to(p) for m,p in zip(molecules,liquid)],run_time=4)
            self.play(FadeIn(label('flytande vatten',[0,-2.3,0],42,TEAL)),run_time=1.5)
            self.play(drift(molecules,liquid,6,.13),run_time=6)
        self.finish('Vatten byter form. Samma vattenmolekyler finns kvar hela tiden.')


class EnvironmentMaster(MasterFilm):
    number=7
    topic='Färgrester och livet i vattnet'
    slug='07-miljo'
    total_steps=4

    def construct(self):
        with self.beat('Häll inte färgrester i avloppet',
            'Färgrester ska inte hällas i avloppet. Vissa ämnen kan skada livet i vatten.',seconds=20,clear=True):
            paint=VGroup(Rectangle(width=1.4,height=1.8,color=VIOLET,fill_color=VIOLET,fill_opacity=.15),
                label('färg',[0,0,0],35,VIOLET)).move_to([-4.5,1,0])
            drain=VGroup(Line([-2.7,-.6,0],[.3,-.6,0],color=MUTED,stroke_width=4),
                *[Line([x,-.85,0],[x,-.3,0],color=MUTED,stroke_width=3) for x in np.linspace(-2.5,.1,8)])
            pipe=VMobject(color=BLUE,stroke_width=4).set_points_smoothly([[-1.2,-.9,0],[-1.2,-1.8,0],[2,-1.8,0],[5.5,-.2,0]])
            self.play(Create(paint),Create(drain),Create(pipe),run_time=2)
            self.play(FadeIn(label('avlopp',[-1.2,.2,0],40)),run_time=1.5)
            stream=VMobject(color=VIOLET,stroke_width=3).set_points_smoothly([[-4,.8,0],[-2.7,.4,0],[-1.2,-.6,0]])
            self.play(Rotate(paint,-PI/6),Create(stream),run_time=2)
            dots=VGroup(*[glow_dot(stream.get_start(),VIOLET,.09) for _ in range(5)])
            self.add(dots)
            self.play(LaggedStart(*[MoveAlongPath(d,stream) for d in dots],lag_ratio=.2),run_time=4)
            self.play(LaggedStart(*[MoveAlongPath(d,pipe) for d in dots],lag_ratio=.2),run_time=5)
            self.play(FadeIn(label('kan nå vatten',[4.3,1.2,0],38,BLUE)),run_time=1.5)
            self.wait(3)

        with self.beat('Vattnet kan föra ämnen vidare',
            'Vissa ämnen följer med vattnet. De kan spridas långt från platsen där utsläppet började.',seconds=20,clear=True):
            route=VMobject(color=BLUE,stroke_width=3).set_points_smoothly([[-6,.4,0],[-3,-.4,0],[0,.5,0],[3,-.3,0],[6,.4,0]])
            banks=VGroup(route.copy().shift(UP*.9).set_stroke(opacity=.5),route.copy().shift(DOWN*.9).set_stroke(opacity=.5))
            self.play(Create(banks),Create(route.copy().set_stroke(opacity=.2)),run_time=2)
            dots=VGroup(*[glow_dot(route.point_from_proportion(i*.09),VIOLET,.085) for i in range(5)])
            self.play(FadeIn(dots),FadeIn(label('ämnen följer vattnet',[0,2.2,0],42,VIOLET)),run_time=2)
            self.play(LaggedStart(*[MoveAlongPath(d,route) for d in dots],lag_ratio=.1),run_time=10,rate_func=linear)
            self.play(FadeIn(label('spridning',[4.5,-2.25,0],43,BLUE)),run_time=1.5)
            self.wait(4)

        with self.beat('Vissa ämnen kan skada fiskar',
            'Vissa ämnen kan skada fiskar. Risken beror på ämnet och mängden.',seconds=20,clear=True):
            body=Ellipse(width=2.7,height=1.25,color=BLUE,fill_color=BLUE,fill_opacity=.08)
            tail=Polygon([1.1,0,0],[2.0,.85,0],[2.0,-.85,0],color=BLUE,fill_color=BLUE,fill_opacity=.08)
            fish=VGroup(body,tail,Dot([-.8,.2,0],color=INK,radius=.06)).move_to([2.6,0,0])
            self.play(FadeIn(fish),run_time=2)
            dots=VGroup(*[glow_dot([-5,.75-i*.55,0],VIOLET,.085) for i in range(4)])
            self.play(FadeIn(dots),FadeIn(label('ämne',[-4.9,2.1,0],43,VIOLET)),run_time=2)
            self.play(dots.animate.shift(RIGHT*4.0),run_time=4,rate_func=linear)
            a=arrow([-.2,.5,0],[1.1,.5,0],VIOLET)
            self.play(GrowArrow(a),FadeIn(label('kan skada',[1.0,1.8,0],40,VIOLET)),run_time=2)
            self.play(FadeIn(label('vilket ämne?',[-3.1,-2.3,0],39)),run_time=1.5)
            self.play(FadeIn(label('hur mycket?',[3.1,-2.3,0],39)),run_time=1.5)
            self.wait(6)

        with self.beat('Lämna färgrester på rätt ställe',
            'Lämna färgrester som farligt avfall. Då kan ämnena tas om hand på rätt sätt.',seconds=20,clear=True):
            paint=VGroup(Rectangle(width=1.4,height=1.8,color=VIOLET,fill_color=VIOLET,fill_opacity=.15),
                label('färg',[0,0,0],35,VIOLET)).move_to([-4.5,.5,0])
            collection=panel(4.0,3.0,[4.0,.4,0],TEAL)
            self.play(Create(paint),Create(collection),run_time=2)
            self.play(FadeIn(label('farligt avfall',[4,2.45,0],39,TEAL)),run_time=2)
            path=VMobject(color=TEAL,stroke_width=4).set_points_smoothly([[-4,.8,0],[-1,1.5,0],[1.5,1.5,0],[4,.4,0]])
            self.play(Create(path),run_time=2)
            self.play(MoveAlongPath(paint,path),run_time=5,rate_func=smooth)
            self.play(FadeIn(label('mindre spridning',[0,-2.15,0],46,BLUE)),run_time=2)
            self.play(ShowPassingFlash(path.copy().set_stroke(width=7),time_width=.6),run_time=3)
            self.wait(3)
        self.finish('Rätt avfallshantering kan hindra skadliga ämnen från att nå vattnet.')
