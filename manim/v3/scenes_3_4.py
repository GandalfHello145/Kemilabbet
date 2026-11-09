"""Original, long-form chemistry choreography for films 3 and 4.

Visual-design research: 3b1b/videos _2023/optics_puzzles/adding_waves.py
and _2019/clacks/solution2/block_collision_scenes.py. No scene code or
third-party visual assets are copied. Persistent particles, following labels,
comparative views and dimensional transitions are adapted as general ideas.
"""
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from core import *


def line_label(words, position, color=MUTED, size=25, width=None):
    return tex(words, size, color, width=width).move_to(position)


def electron_dot(position, radius=.075):
    return Dot(position, radius=radius, color=VIOLET)


def charge_formula(value, position=ORIGIN, color=INK, size=42):
    return mathtex(value, size, color).move_to(position)


class ShellAtom(VGroup):
    """A labelled school shell model, explicitly not literal electron paths."""
    def __init__(self, symbol, z, counts, center=ORIGIN, color=GOLD, scale=1):
        super().__init__()
        self.symbol = symbol
        self.z = z
        self.counts = list(counts)
        radii = [.49, .96, 1.43]
        self.rings = VGroup(*[Circle(radius=radii[i], color=color,
                                    stroke_width=1.7,fill_opacity=0).set_stroke(opacity=.45)
                             for i in range(len(counts))])
        self.nucleus = VGroup(Circle(radius=.32, color=color, stroke_width=1.8,
                                   fill_color=color, fill_opacity=.16),
                             mathtex(str(z)+r'^{+}', 25, INK))
        self.electrons = VGroup()
        for shell, count in enumerate(counts):
            slots = 2 if shell == 0 else 8
            for k in range(count):
                angle = TAU*k/slots + (PI/2 if shell == 0 else 0)
                self.electrons.add(electron_dot(radii[shell]*np.array(
                    [math.cos(angle), math.sin(angle), 0])))
        self.add(self.rings, self.nucleus, self.electrons)
        self.scale(scale).move_to(center)


class ProjectedLattice(VGroup):
    """A rotating 3D lattice projected into the film plane.

    Depth scaling and persistent coordinates make the spatial structure visible
    without thousands of surface polygons. This is a schematic ion lattice.
    """
    def __init__(self, center=ORIGIN):
        super().__init__()
        self.center_position = np.array(center, dtype=float)
        self.angle = ValueTracker(0)
        self.coords = [np.array([x,y,z], dtype=float)*1.18
                       for z in [-.5,.5] for y in [-1,0,1] for x in [-1,0,1]]
        self.ions = VGroup()
        for n, p in enumerate(self.coords):
            parity = (round(p[0]/1.18)+round(p[1]/1.18)+(0 if p[2]<0 else 1)) % 2
            color = GOLD if parity == 0 else TEAL
            label = r'\mathrm{Na}^{+}' if parity == 0 else r'\mathrm{Cl}^{-}'
            body = VGroup(Circle(radius=.24, color=color, stroke_width=1.7,
                                 fill_color=color, fill_opacity=.22),
                          mathtex(label, 18, INK))
            body.depth_scale = 1
            self.ions.add(body)
        self.edges = VGroup()
        self.edge_pairs = []
        for a in range(len(self.coords)):
            for b in range(a+1,len(self.coords)):
                if np.isclose(np.linalg.norm(self.coords[a]-self.coords[b]),1.18):
                    self.edge_pairs.append((a,b))
                    self.edges.add(Line(ORIGIN,RIGHT*.1,color=MUTED,
                                        stroke_width=1.4).set_opacity(.25))
        self.add(self.edges, self.ions)
        self.add_updater(lambda _: self.project())
        self.project()

    def project(self):
        a = self.angle.get_value()
        cy, sy = math.cos(a), math.sin(a)
        cx, sx = math.cos(.45), math.sin(.45)
        rotation = np.array([[cy,0,sy],[sx*sy,cx,-sx*cy],[-cx*sy,sx,cx*cy]])
        positions = []
        for p, ion in zip(self.coords, self.ions):
            q = rotation @ p
            depth = 5.8/(5.8-q[2])
            screen = self.center_position + np.array([q[0]*depth,q[1]*depth,0])
            ion.scale(depth/ion.depth_scale).move_to(screen)
            ion.depth_scale = depth
            ion.set_opacity(.65+.35*(q[2]+2)/4)
            ion.set_z_index(10+q[2])
            positions.append(screen)
        for edge,(a,b) in zip(self.edges,self.edge_pairs):
            edge.put_start_and_end_on(positions[a],positions[b])
        return self


def pair_cloud(center=ORIGIN, width=2.6, height=.95):
    return VGroup(*[Ellipse(width=width*(1+i*.09),height=height*(1+i*.12),
                            stroke_width=0,fill_color=VIOLET,
                            fill_opacity=.035+.012*(5-i)).move_to(center)
                    for i in range(6)])


class ElectronMaster(MasterFilm):
    number = 3
    topic = 'Elektroner, laddning och bindningar'
    slug = '03-elektroner'

    def construct(self):
        # 1. Build the object before introducing symbolic bookkeeping.
        with self.beat('Hur kan en neutral atom bli laddad?',
            'En atom kan bli en jon om antalet elektroner ändras. Vi följer samma natriumatom hela vägen och räknar vad som händer.', seconds=16):
            atom = ShellAtom('Na',11,[2,8,1],center=LEFT*2.6,color=GOLD)
            self.play(Create(atom.rings),GrowFromCenter(atom.nucleus),run_time=2)
            self.play(LaggedStart(*[FadeIn(e,scale=.2) for e in atom.electrons],
                                 lag_ratio=.11),run_time=2.3)
            name = mathtex(r'\mathrm{Na}',52,GOLD).move_to([2.6,.6,0])
            question = tex('neutral atom',33,INK).next_to(name,DOWN,buff=.45)
            self.play(Write(name),FadeIn(question,shift=UP*.2),run_time=1.5)
            focus = Circle(radius=.22,color=VIOLET,stroke_width=3).move_to(atom.electrons[-1])
            link = arrow(focus.get_right(),[1.5,.7,0],VIOLET)
            self.play(Create(focus),GrowArrow(link),run_time=1.6)
            self.play(focus.animate.scale(1.25),atom.nucleus.animate.scale(1.10),
                      rate_func=there_and_back,run_time=3.2)
            hint = tex('Vad är det vi behöver räkna?',28,MUTED).move_to([2.6,-1.3,0])
            self.play(Write(hint),run_time=2)
            self.play(Indicate(atom.electrons[-1],color=VIOLET),run_time=1.4)

        # 2. The charge ledger travels out of the same atom.
        with self.beat('Plus och minus kan ta ut varandra',
            'Protonerna har positiv laddning och elektronerna negativ. I en neutral natriumatom finns elva protoner och elva elektroner. Då är den sammanlagda laddningen noll.', seconds=16,clear=True):
            atom = ShellAtom('Na',11,[2,8,1],center=LEFT*3.8,color=GOLD,scale=1.05)
            self.play(FadeIn(atom),run_time=1.3)
            p_label = tex('protoner',27,GOLD).move_to([1.2,1.55,0])
            e_label = tex('elektroner',27,VIOLET).move_to([4.5,1.55,0])
            plus = VGroup(*[Dot(radius=.065,color=GOLD).move_to([.3+(i%6)*.32,.85-(i//6)*.35,0]) for i in range(11)])
            minus = VGroup(*[Dot(radius=.065,color=VIOLET).move_to([3.5+(i%6)*.32,.85-(i//6)*.35,0]) for i in range(11)])
            self.play(Write(p_label),Write(e_label),LaggedStart(*[GrowFromCenter(x) for x in plus],lag_ratio=.06),run_time=2.3)
            self.play(LaggedStart(*[GrowFromCenter(x) for x in minus],lag_ratio=.06),run_time=2)
            p = mathtex('11',48,GOLD).move_to([1.2,-.25,0]);e = mathtex('11',48,VIOLET).move_to([4.5,-.25,0])
            self.play(TransformFromCopy(atom.nucleus[1],p),FadeIn(e),run_time=1.8)
            q = mathtex(r'q=11-11=0',46,INK).move_to([2.75,-1.45,0])
            self.play(Write(q),run_time=2.5)
            ties = VGroup(*[Line(a.get_center(),b.get_center(),color=MUTED,stroke_width=.7).set_opacity(.18) for a,b in zip(plus,minus)])
            self.play(LaggedStart(*[Create(x) for x in ties],lag_ratio=.045),run_time=1.8)
            self.play(Indicate(q[-1],color=TEAL),run_time=1.4)

        # 3. Treat a shell drawing as a diagram, not literal orbits.
        with self.beat('Skalen är en förenklad skolmodell',
            'Skalbilden hjälper oss att hålla reda på elektronerna. Den visar inte små planeter som går i bestämda banor. Natrium har fördelningen två, åtta och en.', seconds=16,clear=True):
            na = ShellAtom('Na',11,[2,8,1],center=[0,.15,0],color=GOLD,scale=1.3)
            self.play(Create(na.rings),FadeIn(na.nucleus),LaggedStart(*[FadeIn(x) for x in na.electrons],lag_ratio=.05),run_time=2.2)
            counts = VGroup(*[mathtex(str(n),38,INK).move_to([x,-2.20,0]) for x,n in zip([-2.5,0,2.5],[2,8,1])])
            self.play(LaggedStart(*[Write(x) for x in counts],lag_ratio=.3),run_time=2)
            labels=VGroup(*[tex(word,22,MUTED).next_to(n,DOWN,buff=.12) for word,n in zip(['inre skal','nästa skal','yttersta skal'],counts)])
            self.play(FadeIn(labels),run_time=1.2)
            self.move_camera(phi=38*DEGREES,theta=-65*DEGREES,zoom=1.03,run_time=3.5)
            self.move_camera(phi=0,theta=-90*DEGREES,zoom=1,run_time=2.5)
            outer = Circle(radius=.23,color=VIOLET).move_to(na.electrons[-1])
            self.play(Create(outer),Indicate(counts[-1],color=VIOLET),run_time=1.8)
            self.play(outer.animate.scale(1.25),rate_func=there_and_back,run_time=1.5)

        # 4. The tracked electron leaves, while the same nucleus stays.
        with self.beat('En elektron lämnar -- kärnan finns kvar',
            'Om natriumatomen lämnar ifrån sig en elektron finns fortfarande elva protoner kvar. Nu finns bara tio elektroner. Elva minus tio ger laddningen plus ett.', seconds=16,clear=True):
            na = ShellAtom('Na',11,[2,8,1],center=[-2.5,.2,0],color=GOLD,scale=1.05)
            electron = na.electrons[-1]
            formula0 = mathtex(r'q=11-11=0',42).move_to([2.9,.7,0])
            self.play(FadeIn(na),Write(formula0),run_time=1.8)
            marker = Circle(radius=.20,color=VIOLET).move_to(electron)
            self.play(Create(marker),run_time=1)
            trail = TracedPath(electron.get_center,stroke_color=VIOLET,stroke_width=4,dissipating_time=1.2)
            self.add(trail)
            path = CubicBezier(electron.get_center(),[-.3,2.2,0],[2.6,2.1,0],[4.7,1.6,0])
            self.play(FadeOut(marker),MoveAlongPath(electron,path),run_time=4.2,rate_func=smooth)
            formula1 = mathtex(r'q=11-10=+1',42).move_to(formula0)
            self.play(TransformMatchingTex(formula0,formula1),Indicate(na.nucleus,color=GOLD),run_time=2.1)
            ion = mathtex(r'\mathrm{Na}^{+}',58,GOLD).move_to([2.8,-.9,0])
            self.play(Write(ion),Flash(electron,color=VIOLET,flash_radius=.35),run_time=1.7)
            self.play(Indicate(na.rings[-1],color=GOLD),run_time=1.7)
            trail.clear_updaters();self.play(FadeOut(trail),run_time=.8)
            self.play(ion.animate.scale(1.05),rate_func=there_and_back,run_time=1.3)

        # 5. A distinct element gains an electron: atom identity does not change.
        with self.beat('En extra elektron ger negativ laddning',
            'En kloratom har sjutton protoner. När den tar upp en elektron får den arton elektroner. Kärnan är oförändrad, men jonen får laddningen minus ett.', seconds=16,clear=True):
            cl = ShellAtom('Cl',17,[2,8,7],center=[-2.6,.25,0],color=TEAL,scale=1.02)
            incoming = glow_dot([4.8,1.6,0],VIOLET,.085)
            self.play(FadeIn(cl),FadeIn(incoming),run_time=1.5)
            q0 = mathtex(r'q=17-17=0',42).move_to([3,.6,0])
            self.play(Write(q0),run_time=1.8)
            angle=7*TAU/8;target=cl.get_center()+1.43*1.02*np.array([math.cos(angle),math.sin(angle),0])
            path=CubicBezier(incoming.get_center(),[3.5,2.4,0],[.3,2.3,0],target)
            self.play(MoveAlongPath(incoming,path),run_time=4)
            self.play(Flash(target,color=VIOLET,flash_radius=.32),run_time=1.1)
            q1=mathtex(r'q=17-18=-1',42).move_to(q0)
            self.play(TransformMatchingTex(q0,q1),Indicate(cl.nucleus,color=TEAL),run_time=2.2)
            ion=mathtex(r'\mathrm{Cl}^{-}',58,TEAL).move_to([3,-1,0])
            self.play(Write(ion),run_time=1.6)
            same=tex('samma atomslag',28,MUTED).move_to([-2.6,-2,0])
            self.play(FadeIn(same),Indicate(cl.nucleus[1]),run_time=1.4)
            self.play(Indicate(q1[-2:],color=VIOLET),run_time=1.4)

        # 6. One continuous electron trajectory links the two earlier examples.
        with self.beat('Följ överföringen mellan två atomer',
            'Här följer vi en elektron från natrium till klor. Pilen är ett sätt att visa överföringen, inte en uppmätt elektronbana. Atomerna blir en positiv och en negativ jon.', seconds=16,clear=True):
            na=ShellAtom('Na',11,[2,8,1],[-3.8,.2,0],GOLD,.9)
            cl=ShellAtom('Cl',17,[2,8,7],[3.8,.2,0],TEAL,.9)
            self.play(FadeIn(na),FadeIn(cl),run_time=1.6)
            na_name=mathtex(r'\mathrm{Na}',38,GOLD).move_to([-3.8,-1.7,0])
            cl_name=mathtex(r'\mathrm{Cl}',38,TEAL).move_to([3.8,-1.7,0])
            self.play(Write(na_name),Write(cl_name),run_time=1.5)
            electron=na.electrons[-1]
            trace=TracedPath(electron.get_center,stroke_color=VIOLET,stroke_width=5,dissipating_time=1.4)
            self.add(trace)
            angle=7*TAU/8;target=cl.get_center()+1.43*.9*np.array([math.cos(angle),math.sin(angle),0])
            path=CubicBezier(electron.get_center(),[-.7,2.35,0],[1.5,2.35,0],target)
            guide=DashedVMobject(path.copy().set_color(VIOLET),num_dashes=35).set_opacity(.30)
            self.play(Create(guide),run_time=1.2)
            self.play(MoveAlongPath(electron,path),run_time=4.1,rate_func=smooth)
            self.play(TransformMatchingTex(na_name,mathtex(r'\mathrm{Na}^{+}',38,GOLD).move_to(na_name)),
                      TransformMatchingTex(cl_name,mathtex(r'\mathrm{Cl}^{-}',38,TEAL).move_to(cl_name)),run_time=1.7)
            conserved=mathtex(r'11+17=28\quad\text{protoner kvar}',32,INK).move_to([0,-2.35,0])
            self.play(Write(conserved),run_time=2)
            self.play(Indicate(na.nucleus),Indicate(cl.nucleus),run_time=1.4)
            trace.clear_updaters();self.play(FadeOut(trace),FadeOut(guide),run_time=.8)

        # 7. Forces are a qualitative causal picture, not decorative particles.
        with self.beat('Olika laddningar attraherar varandra',
            'Den positiva natriumjonen och den negativa kloridjonen dras till varandra. Den elektriska attraktionen är viktig för jonbindning. Två likadant laddade joner stöter i stället bort varandra.', seconds=16,clear=True):
            positive=dot_atom('Na',GOLD,.65,[-4,.4,0]);negative=dot_atom('Cl',TEAL,.65,[4,.4,0])
            signs=VGroup(mathtex('+',48,GOLD).next_to(positive,UP,buff=.15),mathtex('-',48,TEAL).next_to(negative,UP,buff=.15))
            self.play(GrowFromCenter(positive),GrowFromCenter(negative),Write(signs),run_time=1.6)
            field=VGroup(*[arrow([-2.8,y,0],[-1.0,y*.62+.15,0],GOLD,max_tip_length_to_length_ratio=.14).set_opacity(.22+abs(y)*.1)
                           for y in [-1.25,-.6,0,.6,1.25]],
                         *[arrow([2.8,y,0],[1.0,y*.62+.15,0],TEAL,max_tip_length_to_length_ratio=.14).set_opacity(.22+abs(y)*.1)
                           for y in [-1.25,-.6,0,.6,1.25]])
            self.play(LaggedStart(*[GrowArrow(a) for a in field],lag_ratio=.07),run_time=2.5)
            self.play(positive.animate.shift(RIGHT*2.25),negative.animate.shift(LEFT*2.25),
                      signs[0].animate.shift(RIGHT*2.25),signs[1].animate.shift(LEFT*2.25),run_time=3.2,rate_func=smooth)
            total=mathtex(r'(+1)+(-1)=0',42,INK).move_to([0,-1.8,0])
            self.play(FadeOut(field),Write(total),run_time=2)
            repulsion=VGroup(dot_atom('Na',GOLD,.38,[-.6,1.65,0]),dot_atom('Na',GOLD,.38,[.6,1.65,0]))
            self.play(FadeIn(repulsion),run_time=1)
            self.play(repulsion[0].animate.shift(LEFT*1.3),repulsion[1].animate.shift(RIGHT*1.3),run_time=2.2)
            self.play(Indicate(total,color=TEAL),run_time=1.5)

        # 8. A dimensional reveal replaces the misleading isolated NaCl molecule.
        with self.beat('I saltkristallen finns ett helt jongitter',
            'Fast natriumklorid består av många positiva och negativa joner i ett regelbundet mönster. En jon påverkas av flera grannar. Det är inte en samling fristående NaCl-molekyler.', seconds=16,clear=True):
            lattice=ProjectedLattice(center=[0,.1,0])
            self.play(LaggedStart(*[FadeIn(i,scale=.1) for i in lattice.ions],lag_ratio=.035),run_time=2.1)
            self.add(lattice)
            self.play(Create(lattice.edges),run_time=1.8)
            labels=VGroup(mathtex(r'\mathrm{Na}^{+}',30,GOLD).move_to([-4.5,1.6,0]),
                          mathtex(r'\mathrm{Cl}^{-}',30,TEAL).move_to([-4.5,.7,0]),
                          tex('förenklat jongitter',27,MUTED).move_to([0,-2.3,0]))
            self.play(FadeIn(labels),run_time=1.4)
            self.play(lattice.angle.animate.set_value(PI*.7),run_time=7.2,rate_func=linear)
            self.play(lattice.angle.animate.set_value(PI*.85),run_time=2.1,rate_func=smooth)
            lattice.clear_updaters()

        # 9. Charge is conserved across the whole crystal.
        with self.beat('Saltet är neutralt som helhet',
            'Varje natriumjon har laddningen plus ett och varje kloridjon minus ett. I vanligt natriumklorid finns lika många av båda. Då tar laddningarna ut varandra i kristallen som helhet.', seconds=16,clear=True):
            left=VGroup(*[dot_atom('Na',GOLD,.24,[-3.8+(i%3)*.8,.8-(i//3)*.8,0]) for i in range(6)])
            right=VGroup(*[dot_atom('Cl',TEAL,.24,[2.2+(i%3)*.8,.8-(i//3)*.8,0]) for i in range(6)])
            self.play(LaggedStart(*[FadeIn(x) for x in left],lag_ratio=.10),
                      LaggedStart(*[FadeIn(x) for x in right],lag_ratio=.10),run_time=2.3)
            p=mathtex(r'6\cdot(+1)',40,GOLD).move_to([-3,-1.6,0]);n=mathtex(r'6\cdot(-1)',40,TEAL).move_to([3,-1.6,0])
            self.play(Write(p),Write(n),run_time=2.3)
            pairs=VGroup(*[Line(a.get_center(),b.get_center(),color=MUTED,stroke_width=1.1).set_opacity(.25) for a,b in zip(left,right)])
            self.play(LaggedStart(*[Create(l) for l in pairs],lag_ratio=.12),run_time=2.1)
            total=mathtex(r'6-6=0',48,INK).move_to([0,1.8,0])
            self.play(TransformFromCopy(VGroup(p,n),total),run_time=2)
            self.play(left.animate.shift(RIGHT*.9),right.animate.shift(LEFT*.9),run_time=2.5)
            caption=tex('Laddningarna finns kvar -- summan är noll.',28,MUTED).move_to([0,-2.45,0])
            self.play(Write(caption),run_time=1.6)
            self.play(Indicate(total,color=TEAL),run_time=1.4)

        # 10. Switch mechanisms: two hydrogen atoms share rather than transfer.
        with self.beat('Atomer kan också dela på elektroner',
            'Jonbindning är inte det enda sättet att binda atomer. Två väteatomer kan i stället dela på ett elektronpar. Elektronerna bidrar då till att hålla de två atomkärnorna ihop.', seconds=16,clear=True):
            nuclei=VGroup(dot_atom('+',GOLD,.28,[-3,0,0]),dot_atom('+',GOLD,.28,[3,0,0]))
            outlines=VGroup(Circle(radius=.92,color=BLUE,stroke_width=2).move_to(nuclei[0]),
                            Circle(radius=.92,color=BLUE,stroke_width=2).move_to(nuclei[1]))
            electrons=VGroup(electron_dot([-2.08,0,0],.095),electron_dot([2.08,0,0],.095))
            self.play(FadeIn(nuclei),Create(outlines),FadeIn(electrons),run_time=2)
            labels=VGroup(mathtex(r'\mathrm H',42,BLUE).move_to([-3,-1.45,0]),
                          mathtex(r'\mathrm H',42,BLUE).move_to([3,-1.45,0]))
            self.play(Write(labels),run_time=1.3)
            self.play(nuclei[0].animate.move_to([-1.1,0,0]),nuclei[1].animate.move_to([1.1,0,0]),
                      outlines[0].animate.move_to([-1.1,0,0]),outlines[1].animate.move_to([1.1,0,0]),
                      electrons[0].animate.move_to([-.18,.12,0]),electrons[1].animate.move_to([.18,-.12,0]),
                      labels[0].animate.move_to([-1.1,-1.45,0]),labels[1].animate.move_to([1.1,-1.45,0]),run_time=4)
            cloud=pair_cloud(width=2.3,height=1.15)
            self.play(FadeIn(cloud),run_time=1.5)
            self.play(cloud.animate.stretch(1.08,1),rate_func=there_and_back,run_time=3)
            bond=mathtex(r'\mathrm H\!:\!\mathrm H',48,INK).move_to([0,1.7,0])
            self.play(Write(bond),run_time=1.5)
            self.play(Indicate(electrons,color=VIOLET),run_time=1.2)

        # 11. Only two heavy surfaces: a purposeful, short 3D model inspection.
        with self.beat('En bindning håller ihop en molekyl',
            'Vätgas består av H₂-molekyler. Kulorna är en modell av atomerna och pinnen visar en bindning. När modellen vrids följer vi fortfarande samma två väteatomer.', seconds=16,clear=True):
            a=sphere_atom(BLUE,.48,[-.88,0,0]);b=sphere_atom(BLUE,.48,[.88,0,0])
            stick=Line3D(a.get_center(),b.get_center(),thickness=.07,color=INK)
            model=VGroup(stick,a,b)
            self.play(FadeIn(model,scale=.35),run_time=2)
            label=mathtex(r'\mathrm H_2',48,INK).move_to([4.6,-1.0,0]);self.fixed(label)
            self.play(Write(label),run_time=1.4)
            self.move_camera(phi=65*DEGREES,theta=-45*DEGREES,zoom=1.05,run_time=3.5)
            self.play(Rotate(model,angle=PI*.75,axis=UP),run_time=4.3,rate_func=smooth)
            self.move_camera(phi=0,theta=-90*DEGREES,zoom=1,run_time=2.6)
            self.play(Indicate(label,color=BLUE),run_time=1.5)
            self.unfix(label)

        # 12. A qualitative potential landscape links separation and binding.
        with self.beat('Lagom avstånd i en stabil bindning',
            'I den här förenklade bilden visar kurvans dal ett stabilt avstånd. Atomerna kan röra sig kring det avståndet. Kurvan är en tankemodell, inte uppmätta värden för en viss molekyl.', seconds=16,clear=True):
            axes=Axes(x_range=[0,5,1],y_range=[-1,3,1],x_length=8.8,y_length=3.6,
                      axis_config={'color':MUTED,'include_ticks':False,'include_tip':True}).move_to([0,.1,0])
            curve=axes.plot(lambda x: .33*(x-2.15)**2-.5,x_range=[.2,4.6],color=TEAL)
            x=ValueTracker(4.5)
            marker=always_redraw(lambda:glow_dot(axes.c2p(x.get_value(),.33*(x.get_value()-2.15)**2-.5),GOLD,.08))
            self.play(Create(axes),Create(curve),run_time=2.3)
            labels=VGroup(tex('avstånd mellan atomer',26,MUTED).next_to(axes,DOWN,buff=.2),
                          tex('förenklad bild',24,MUTED).move_to([-4.5,2.3,0]))
            self.play(FadeIn(labels),FadeIn(marker),run_time=1.3)
            self.play(x.animate.set_value(2.15),run_time=3.2,rate_func=smooth)
            self.play(x.animate.set_value(1.75),run_time=1.4)
            self.play(x.animate.set_value(2.5),run_time=1.6)
            self.play(x.animate.set_value(1.9),run_time=1.6)
            self.play(x.animate.set_value(2.15),run_time=1.6)
            valley=tex('stabilt avstånd',28,TEAL).move_to([2.5,1.7,0])
            pointer=arrow(valley.get_left(),axes.c2p(2.15,-.5),TEAL)
            self.play(Write(valley),GrowArrow(pointer),run_time=1.8)
            marker.clear_updaters()

        # 13. A visual comparison prevents conflating the two mechanisms.
        with self.beat('Överföring och delning är olika modeller',
            'Vid jonbildning kan elektroner överföras och laddade joner bildas. I en elektronparbindning delar atomer på elektroner. I båda fallen deltar elektronerna; atomkärnornas protonantal ändras inte.', seconds=16,clear=True):
            divider=Line([0,2.15,0],[0,-2.3,0],color=MUTED,stroke_width=1).set_opacity(.35)
            titles=VGroup(tex('ÖVERFÖRING',29,GOLD).move_to([-3.8,2,0]),tex('DELNING',29,VIOLET).move_to([3.8,2,0]))
            self.play(Create(divider),FadeIn(titles),run_time=1.5)
            left=VGroup(dot_atom('Na',GOLD,.45,[-5,.2,0]),dot_atom('Cl',TEAL,.45,[-2.6,.2,0]))
            right=VGroup(dot_atom('H',BLUE,.38,[2.6,.2,0]),dot_atom('H',BLUE,.38,[5,.2,0]))
            e=electron_dot([-4.4,.6,0],.10);shared=VGroup(electron_dot([3.7,.35,0],.09),electron_dot([3.9,.05,0],.09))
            self.play(FadeIn(left),FadeIn(right),FadeIn(e),FadeIn(shared),run_time=1.8)
            transfer=ArcBetweenPoints(e.get_center(),[-3.05,.65,0],angle=-PI/3,color=VIOLET)
            self.play(MoveAlongPath(e,transfer),run_time=2.8)
            cloud=pair_cloud([3.8,.2,0],width=1.8,height=.85)
            self.play(FadeIn(cloud),right[0].animate.shift(RIGHT*.35),right[1].animate.shift(LEFT*.35),run_time=2.5)
            equations=VGroup(mathtex(r'\mathrm{Na}^{+}\quad\mathrm{Cl}^{-}',35,INK).move_to([-3.8,-1.1,0]),
                             mathtex(r'\mathrm H_2',42,INK).move_to([3.8,-1.1,0]))
            self.play(Write(equations),run_time=2)
            rule=tex('Protonantalet bestämmer atomslaget.',32,TEAL).move_to([0,-2.35,0])
            self.play(Write(rule),run_time=1.8)
            self.play(Indicate(rule,color=TEAL),run_time=1.7)

        # 14. Transfer the method to a new, explicitly supplied atom.
        with self.beat('Pröva resonemanget på en ny jon',
            'En partikel har tolv protoner och tio elektroner. Räkna plus och minus. Vad är laddningen? Förklara också varför elektronerna kan ändra laddningen utan att atomslaget byts.', seconds=16,clear=True):
            proton=mathtex(r'12\ \text{protoner}',38,GOLD).move_to([-3.5,1.3,0])
            electron=mathtex(r'10\ \text{elektroner}',38,VIOLET).move_to([3.5,1.3,0])
            self.play(Write(proton),Write(electron),run_time=2)
            pairs=VGroup(*[VGroup(Dot([-4+i*.38,0,0],radius=.07,color=GOLD),
                                 Dot([.6+i*.38,0,0],radius=.07,color=VIOLET)) for i in range(10)])
            extras=VGroup(Dot([-4,-.6,0],radius=.09,color=GOLD),Dot([-3.62,-.6,0],radius=.09,color=GOLD))
            self.play(LaggedStart(*[FadeIn(p) for p in pairs],lag_ratio=.11),FadeIn(extras),run_time=2.5)
            self.play(LaggedStart(*[Indicate(p,color=INK) for p in pairs],lag_ratio=.11),run_time=3.5)
            equation=mathtex(r'q=12-10=+2',52,INK).move_to([0,-1.6,0])
            self.play(Write(equation),run_time=2.4)
            self.play(Indicate(extras,color=GOLD),run_time=1.5)
            answer=tex('Två positiva laddningar blir över.',30,TEAL).move_to([0,-2.45,0])
            self.play(FadeIn(answer),run_time=1.5)
            self.play(Indicate(equation[-2:],color=GOLD),run_time=1.5)

        self.finish('Följ elektronerna och räkna laddningarna. Skilj mellan överföring och delning. Förklara sedan hur elektronerna hjälper atomer eller joner att hålla ihop.')


class MovingSample(VGroup):
    """A deterministic schematic gas with wall and pair collisions."""
    def __init__(self, models, bounds=(-5.1,5.1,-1.65,1.65), radius=.58,
                 velocities=None):
        super().__init__(*models)
        self.bounds=bounds
        self.radius=radius
        self.velocities=np.array(velocities if velocities is not None else
            [[1.7,.85,0],[-1.3,1.05,0],[1.4,-.75,0],[-1.7,-.9,0],[1.1,1.25,0],[-1.25,.7,0]],dtype=float)
        self.add_updater(self.advance)

    def advance(self, _, dt):
        if dt<=0:return self
        left,right,bottom,top=self.bounds
        positions=[m.get_center().copy() for m in self]
        for i,p in enumerate(positions):
            p += self.velocities[i]*dt
            for axis,low,high in [(0,left,right),(1,bottom,top)]:
                if p[axis] < low+self.radius:
                    p[axis]=low+self.radius;self.velocities[i,axis]=abs(self.velocities[i,axis])
                elif p[axis] > high-self.radius:
                    p[axis]=high-self.radius;self.velocities[i,axis]=-abs(self.velocities[i,axis])
        for a in range(len(positions)):
            for b in range(a+1,len(positions)):
                delta=positions[a]-positions[b]
                distance=np.linalg.norm(delta[:2])
                if .01<distance<2*self.radius:
                    normal=delta/distance
                    speed=np.dot(self.velocities[a]-self.velocities[b],normal)
                    if speed<0:
                        self.velocities[a]-=speed*normal
                        self.velocities[b]+=speed*normal
                    overlap=(2*self.radius-distance)/2
                    positions[a]+=normal*overlap;positions[b]-=normal*overlap
        for model,p in zip(self,positions):model.move_to(p)
        return self


def reaction_atoms():
    locations=[[-5,.8,0],[-3.9,.8,0],[-5,-.8,0],[-3.9,-.8,0],[2.7,.2,0],[3.8,.2,0]]
    atoms=VGroup(*[dot_atom('H' if i<4 else 'O',BLUE if i<4 else CORAL,
                          .30 if i<4 else .39,p) for i,p in enumerate(locations)])
    bonds=VGroup(Line(atoms[0].get_center(),atoms[1].get_center(),color=INK,stroke_width=4),
                 Line(atoms[2].get_center(),atoms[3].get_center(),color=INK,stroke_width=4),
                 Line(atoms[4].get_center()+UP*.055,atoms[5].get_center()+UP*.055,color=INK,stroke_width=3),
                 Line(atoms[4].get_center()+DOWN*.055,atoms[5].get_center()+DOWN*.055,color=INK,stroke_width=3))
    return atoms,bonds


def sample_flask():
    glass=VMobject(color=BLUE,stroke_width=3).set_points_as_corners([
        [-1.0,1.7,0],[-1.0,.95,0],[-2.0,-1.45,0],[2.0,-1.45,0],
        [1.0,.95,0],[1.0,1.7,0]])
    lid=Line([-1.15,1.75,0],[1.15,1.75,0],color=GOLD,stroke_width=7)
    base=RoundedRectangle(width=5.3,height=.58,corner_radius=.1,
                           color=MUTED,fill_color=MUTED,fill_opacity=.1).move_to([0,-2.1,0])
    return glass,lid,base


class ReactionMaster(MasterFilm):
    number = 4
    topic = 'Förändringar -- vad händer med atomerna?'
    slug = '04-forandringar'

    def construct(self):
        # 1. A mystery is resolved by changing scale, not by an arbitrary effect.
        with self.beat('Byter ämnet form, eller bildas ett nytt ämne?',
            'Is smälter, vatten kokar och kol kan reagera med syrgas. Allt förändras, men på olika sätt. Vi går från det vi kan se till en modell av partiklarna.', seconds=16):
            cards=VGroup(*[RoundedRectangle(width=3.6,height=3.5,corner_radius=.14,
                        color=MUTED,stroke_width=1.2,fill_color=MUTED,fill_opacity=.035).move_to([x,.05,0])
                           for x in [-4.8,0,4.8]])
            self.play(LaggedStart(*[DrawBorderThenFill(c) for c in cards],lag_ratio=.18),run_time=2)
            ice=VGroup(*[molecule2d([x,y,0],.40,False) for x in [-5.35,-4.3] for y in [.35,-.5]])
            boiling=VGroup(*[Circle(radius=.10+.025*i,color=BLUE,stroke_width=2).move_to([-.45+.28*(i%3),-.8+.4*(i//3),0]) for i in range(8)])
            carbon=dot_atom('C',MUTED,.35,[4.1,.15,0]);oxygen=VGroup(dot_atom('O',CORAL,.3,[5.1,.15,0]),dot_atom('O',CORAL,.3,[5.8,.15,0]))
            self.play(FadeIn(ice),LaggedStart(*[Create(b) for b in boiling],lag_ratio=.09),FadeIn(carbon),FadeIn(oxygen),run_time=2.2)
            labels=VGroup(*[tex(word,28,INK).move_to([x,1.2,0]) for x,word in zip([-4.8,0,4.8],['is smälter','vatten kokar','kol reagerar'])])
            self.play(Write(labels),run_time=2)
            self.play(ice.animate.arrange_in_grid(rows=2,cols=2,buff=.18).move_to([-4.8,0,0]),
                      boiling.animate.shift(UP*.65),oxygen.animate.shift(LEFT*.3),run_time=3)
            question=tex('Följ atomerna för att förstå skillnaden.',34,TEAL).move_to([0,-2.35,0])
            self.play(Write(question),run_time=2)
            self.play(Indicate(cards[0],color=BLUE),Indicate(cards[2],color=CORAL),run_time=2.2)
            self.play(boiling.animate.shift(DOWN*.4),rate_func=there_and_back,run_time=1.4)

        # 2. Persistent molecular objects make physical change unambiguous.
        with self.beat('Is och flytande vatten: samma molekyler',
            'Vi följer sex vattenmolekyler. I is har de bestämda platser och vibrerar. När isen smälter kan molekylerna röra sig förbi varandra. Vattenmolekylerna finns kvar.', seconds=16,clear=True):
            positions=[[-3,.95,0],[0,.95,0],[3,.95,0],[-3,-1.1,0],[0,-1.1,0],[3,-1.1,0]]
            water=VGroup(*[molecule2d(p,.65,True) for p in positions])
            self.play(LaggedStart(*[FadeIn(m,scale=.25) for m in water],lag_ratio=.12),run_time=2)
            grid=VGroup(*[DashedLine(water[a].get_center(),water[b].get_center(),color=BLUE,
                                    stroke_width=1.2,dash_length=.08).set_opacity(.30)
                         for a,b in [(0,1),(1,2),(3,4),(4,5),(0,3),(1,4),(2,5)]])
            self.play(Create(grid),run_time=1.5)
            self.play(*[Rotate(m,angle=.10*(-1 if i%2 else 1),about_point=m.get_center()) for i,m in enumerate(water)],
                      rate_func=there_and_back,run_time=3.5)
            targets=[[-1.7,.75,0],[0,.55,0],[1.65,.85,0],[-1.55,-.75,0],[.1,-.95,0],[1.8,-.65,0]]
            self.play(FadeOut(grid),*[m.animate.move_to(p) for m,p in zip(water,targets)],run_time=3)
            self.play(*[m.animate.shift(np.array([.25*(-1)**i,.14*(-1)**(i//2),0])) for i,m in enumerate(water)],
                      rate_func=there_and_back,run_time=3.2)
            count=mathtex(r'6\,\mathrm H_2\mathrm O\quad\longrightarrow\quad6\,\mathrm H_2\mathrm O',35,INK).move_to([0,-2.35,0])
            self.play(Write(count),run_time=1.5)

        # 3. A collision model follows the exact same six molecular groups.
        with self.beat('I gas finns större avstånd mellan molekylerna',
            'När vattnet blir gas kan molekylerna röra sig fritt och är i genomsnitt längre från varandra. Molekylerna blir inte större och delas inte upp till H- och O-atomer.', seconds=16,clear=True):
            positions=[[-3.5,.8,0],[0,.9,0],[3.5,.8,0],[-3.5,-.9,0],[0,-.9,0],[3.5,-.9,0]]
            models=[molecule2d(p,.65,True) for p in positions]
            frame=RoundedRectangle(width=11.4,height=4.15,corner_radius=.16,color=BLUE,
                                    stroke_width=1.5).move_to([0,.15,0])
            self.play(Create(frame),LaggedStart(*[FadeIn(m) for m in models],lag_ratio=.08),run_time=2)
            sample=MovingSample(models,bounds=(-5.6,5.6,-1.85,2.05),radius=.60)
            self.add(sample)
            trails=VGroup(*[TracedPath(m.get_center,stroke_color=BLUE,stroke_width=1.5,
                                       dissipating_time=.65).set_opacity(.18) for m in sample])
            self.add(trails)
            pace=ValueTracker(0)
            self.play(pace.animate.set_value(1),run_time=4,rate_func=linear)
            self.play(frame.animate.set_stroke(color=TEAL,width=2.4),run_time=1.4)
            self.play(pace.animate.set_value(2),run_time=4.5,rate_func=linear)
            label=tex('Samma storlek. Samma antal. Ny rörelse.',29,TEAL).move_to([0,-2.45,0])
            self.play(Write(label),run_time=1.7)
            self.play(pace.animate.set_value(3),run_time=1.7,rate_func=linear)
            sample.clear_updaters();trails.clear_updaters(recursive=True)

        # 4. A short spatial inspection separates internal and intermolecular change.
        with self.beat(r'Bindningarna inuti $\mathrm H_2\mathrm O$ finns kvar när is smälter',
            'Pinnarna i kulmodellen visar bindningar inuti vattenmolekylen. När is smälter är det främst ordningen och samspelet mellan molekyler som ändras, inte vilka atomer som bygger varje H₂O.', seconds=16,clear=True):
            first=molecule3d([-1.8,0,0],1.10);second=molecule3d([1.8,0,0],1.10)
            self.play(FadeIn(first,scale=.35),FadeIn(second,scale=.35),run_time=2)
            between=DashedLine(first.get_center(),second.get_center(),color=GOLD,
                               stroke_width=2,dash_length=.11).set_opacity(.45)
            self.play(Create(between),run_time=1.3)
            self.move_camera(phi=55*DEGREES,theta=-58*DEGREES,zoom=.95,run_time=3.2)
            self.play(Rotate(first,angle=.75,axis=UP),second.animate.rotate(-.6,axis=UP).shift(RIGHT*.7),
                      FadeOut(between),run_time=3.5)
            self.move_camera(phi=0,theta=-90*DEGREES,zoom=1,run_time=2.5)
            label=mathtex(r'\mathrm H_2\mathrm O\qquad\mathrm H_2\mathrm O',42,INK).move_to([0,-2.2,0])
            self.play(Write(label),run_time=1.7)
            self.play(Indicate(first,color=BLUE),Indicate(second,color=BLUE),run_time=1.4)

        # 5. Inventory the actual persistent atoms before changing bonds.
        with self.beat('En kemisk reaktion börjar med ämnen',
            'Här finns två vätemolekyler och en syrgasmolekyl. Modellen visar fyra H-atomer och två O-atomer. Nu ska vi hålla reda på varje atom när bindningarna förändras.', seconds=16,clear=True):
            atoms,bonds=reaction_atoms()
            self.play(Create(bonds),LaggedStart(*[GrowFromCenter(a) for a in atoms],lag_ratio=.12),run_time=2.2)
            names=VGroup(mathtex(r'2\mathrm H_2',43,BLUE).move_to([-4.5,1.9,0]),
                         mathtex(r'\mathrm O_2',43,CORAL).move_to([3.25,1.9,0]))
            self.play(Write(names),run_time=1.6)
            tags=VGroup(*[mathtex(str(i+1),20,MUTED).next_to(a,DOWN,buff=.12) for i,a in enumerate(atoms)])
            self.play(LaggedStart(*[FadeIn(t) for t in tags],lag_ratio=.13),run_time=2)
            ledger=VGroup(mathtex(r'\mathrm H:4',40,BLUE).move_to([-.7,-1.8,0]),
                          mathtex(r'\mathrm O:2',40,CORAL).move_to([2,-1.8,0]))
            self.play(TransformFromCopy(atoms[:4],ledger[0]),TransformFromCopy(atoms[4:],ledger[1]),run_time=2.3)
            self.play(LaggedStart(*[Indicate(a,color=BLUE) for a in atoms[:4]],lag_ratio=.18),run_time=2.4)
            self.play(LaggedStart(*[Indicate(a,color=CORAL) for a in atoms[4:]],lag_ratio=.18),run_time=1.8)
            note=tex('Kulorna följer med genom reaktionen.',28,MUTED).move_to([0,-2.55,0])
            self.play(Write(note),run_time=1.4)
            self.play(FadeOut(tags),FadeOut(names),FadeOut(ledger),FadeOut(note),run_time=1.1)

        # 6. No atoms are replaced, hidden or conjured during this transformation.
        with self.beat('Atomerna ordnas om till nya molekyler',
            'Bindningar bryts och andra bindningar bildas. Samma sex atomer ordnas här till två vattenmolekyler. Banorna är ritade för att hjälpa oss att följa atomerna; detta är ingen instruktion till ett försök.', seconds=16):
            pulses=VGroup(*[Circle(radius=.18,color=GOLD,stroke_width=3).move_to(b.get_center()) for b in bonds])
            self.play(LaggedStart(*[Create(p) for p in pulses],lag_ratio=.12),run_time=1.4)
            self.play(FadeOut(bonds),*[p.animate.scale(2.3).set_opacity(0) for p in pulses],run_time=1.4)
            targets=[[-2.85,-.55,0],[-1.15,-.55,0],[1.15,-.55,0],[2.85,-.55,0],[-2,.45,0],[2,.45,0]]
            controls=[([-5,1.7,0],[-3.8,1.4,0]),([-3.3,.3,0],[-1.6,.2,0]),
                      ([-4.0,-2.0,0],[.1,-2.0,0]),([-2.2,-2.2,0],[2.7,-1.8,0]),
                      ([1.8,2,0],[-1.0,2,0]),([4.5,1.8,0],[2.4,1.5,0])]
            paths=[CubicBezier(a.get_center(),np.array(c1),np.array(c2),np.array(p))
                   for a,(c1,c2),p in zip(atoms,controls,targets)]
            traces=VGroup(*[TracedPath(a.get_center,stroke_color=BLUE if i<4 else CORAL,
                          stroke_width=3,dissipating_time=1.1).set_opacity(.45) for i,a in enumerate(atoms)])
            self.add(traces)
            self.play(LaggedStart(*[MoveAlongPath(a,p) for a,p in zip(atoms,paths)],lag_ratio=.10),run_time=5.5,rate_func=smooth)
            new_bonds=VGroup(*[Line(atoms[o].get_center(),atoms[h].get_center(),color=INK,stroke_width=5)
                               for o,h in [(4,0),(4,1),(5,2),(5,3)]])
            self.play(Create(new_bonds),run_time=1.6)
            product=mathtex(r'2\mathrm H_2\mathrm O',50,TEAL).move_to([0,-1.9,0])
            self.play(Write(product),run_time=1.7)
            self.play(Indicate(atoms[0],color=BLUE),Indicate(atoms[4],color=CORAL),run_time=1.6)
            traces.clear_updaters(recursive=True);self.play(FadeOut(traces),run_time=.8)
            self.play(Indicate(product,color=TEAL),run_time=1.0)

        # 7. Match coefficients to molecules, subscripts to atoms per molecule.
        with self.beat('Reaktionsformeln måste stämma med atomerna',
            'Tvåan framför en formel räknar hela molekyler. Den lilla tvåan i H₂ räknar H-atomer i varje molekyl. På båda sidor måste antalet atomer av varje slag vara lika.', seconds=16,clear=True):
            equation=mathtex(r'2\mathrm H_2+\mathrm O_2\longrightarrow2\mathrm H_2\mathrm O',49,INK,width=13.6).move_to([0,1.25,0])
            self.play(Write(equation),run_time=2.6)
            left_h=VGroup(*[dot_atom('H',BLUE,.20,[-5.2+i*.65,-.15,0]) for i in range(4)])
            right_h=VGroup(*[dot_atom('H',BLUE,.20,[2.5+i*.65,-.15,0]) for i in range(4)])
            left_o=VGroup(*[dot_atom('O',CORAL,.24,[-4.55+i*.8,-1.3,0]) for i in range(2)])
            right_o=VGroup(*[dot_atom('O',CORAL,.24,[3.15+i*.8,-1.3,0]) for i in range(2)])
            self.play(LaggedStart(*[FadeIn(a) for a in left_h],lag_ratio=.14),
                      LaggedStart(*[FadeIn(a) for a in right_h],lag_ratio=.14),run_time=2.5)
            h_equal=mathtex(r'4=4',38,BLUE).move_to([0,-.15,0])
            self.play(Write(h_equal),run_time=1.5)
            self.play(LaggedStart(*[FadeIn(a) for a in left_o],lag_ratio=.18),
                      LaggedStart(*[FadeIn(a) for a in right_o],lag_ratio=.18),run_time=2)
            o_equal=mathtex(r'2=2',38,CORAL).move_to([0,-1.3,0])
            self.play(Write(o_equal),run_time=1.4)
            pairs=VGroup(*[Line(a.get_center(),b.get_center(),color=MUTED,stroke_width=.8).set_opacity(.2)
                           for a,b in zip([*left_h,*left_o],[*right_h,*right_o])])
            self.play(LaggedStart(*[Create(l) for l in pairs],lag_ratio=.12),run_time=2.4)
            self.play(Indicate(h_equal),Indicate(o_equal),run_time=1.5)
            self.play(Indicate(equation,color=TEAL),run_time=1.2)

        # 8. Apply the same reasoning to a visibly different reaction.
        with self.beat('Samma princip gäller när kol reagerar med syre',
            'Kol kan reagera med syrgas och bilda koldioxid. En C-atom och två O-atomer blir en CO₂-molekyl. Det nya ämnet har andra egenskaper, men atomslagen och atomantalet finns kvar.', seconds=16,clear=True):
            carbon=dot_atom('C',MUTED,.52,[-3.9,.25,0]);o1=dot_atom('O',CORAL,.40,[2.3,.25,0]);o2=dot_atom('O',CORAL,.40,[3.35,.25,0])
            oxygen_bond=VGroup(*[Line(o1.get_center()+UP*y,o2.get_center()+UP*y,color=INK,stroke_width=3) for y in [-.07,.07]])
            self.play(GrowFromCenter(carbon),FadeIn(o1),FadeIn(o2),Create(oxygen_bond),run_time=2)
            labels=VGroup(mathtex(r'\mathrm C',42,MUTED).move_to([-3.9,-1.3,0]),
                          mathtex(r'\mathrm O_2',42,CORAL).move_to([2.8,-1.3,0]))
            self.play(Write(labels),run_time=1.5)
            self.play(FadeOut(oxygen_bond),FadeOut(labels),run_time=1)
            self.play(carbon.animate.move_to([0,.3,0]),MoveAlongPath(o1,ArcBetweenPoints(o1.get_center(),[-1.5,.3,0],angle=PI/3)),
                      MoveAlongPath(o2,ArcBetweenPoints(o2.get_center(),[1.5,.3,0],angle=-PI/4)),run_time=4)
            bonds=VGroup(*[Line(a+UP*y,b+UP*y,color=INK,stroke_width=3)
                          for a,b in [([-1.5,.3,0],[0,.3,0]),([0,.3,0],[1.5,.3,0])] for y in [-.065,.065]])
            self.play(Create(bonds),run_time=1.4)
            equation=mathtex(r'\mathrm C+\mathrm O_2\longrightarrow\mathrm{CO}_2',47,INK).move_to([0,-1.5,0])
            self.play(Write(equation),run_time=2.2)
            self.play(Indicate(carbon,color=GOLD),Indicate(o1,color=CORAL),Indicate(o2,color=CORAL),run_time=2)
            self.play(VGroup(carbon,o1,o2,bonds).animate.shift(UP*.12),rate_func=there_and_back,run_time=1.1)

        # 9. A schematic reaction-energy landscape gives motion a causal purpose.
        with self.beat('En reaktion kan ta upp och ge ifrån sig energi',
            'När bindningar förändras deltar energi. I det här förenklade exemplet behöver reaktionen först komma i gång och ger sedan energi till omgivningen. Alla reaktioner har inte samma energiförändring.', seconds=16,clear=True):
            axes=Axes(x_range=[0,6,1],y_range=[0,4,1],x_length=10,y_length=3.7,
                      axis_config={'color':MUTED,'include_ticks':False}).move_to([0,.05,0])
            def energy(x):return 1.7+1.6*math.exp(-((x-2.1)/.85)**2)-.20*x
            curve=axes.plot(energy,x_range=[.1,5.8],color=GOLD)
            self.play(Create(axes),Create(curve),run_time=2.3)
            labels=VGroup(tex('energi i modellen',26,MUTED).rotate(PI/2).next_to(axes,LEFT,buff=.2),
                          tex('reaktionen går framåt',27,MUTED).next_to(axes,DOWN,buff=.22))
            self.play(FadeIn(labels),run_time=1.3)
            progress=ValueTracker(.1)
            particle=always_redraw(lambda:glow_dot(axes.c2p(progress.get_value(),energy(progress.get_value())),TEAL,.09))
            self.add(particle)
            self.play(progress.animate.set_value(2.1),run_time=3.6,rate_func=smooth)
            peak=tex('komma i gång',28,GOLD).move_to([2.7,2.15,0])
            self.play(Write(peak),run_time=1.3)
            self.play(progress.animate.set_value(5.75),run_time=3.8,rate_func=smooth)
            released=tex('energi till omgivningen',28,TEAL).move_to([2.8,-.25,0])
            drop=arrow(axes.c2p(5.75,1.7),axes.c2p(5.75,energy(5.75)),TEAL)
            self.play(Write(released),GrowArrow(drop),run_time=1.9)
            self.play(Indicate(released,color=TEAL),run_time=1.2)
            particle.clear_updaters()

        # 10. The system boundary becomes the key object.
        with self.beat('I ett slutet system finns all materia kvar',
            'Nu väger vi en stängd behållare tillsammans med allt innehåll. Partiklarna kan röra sig och ämnen kan reagera, men ingen materia passerar genom gränsen. Den totala massan är då densamma.', seconds=16,clear=True):
            glass,lid,scale=sample_flask();self.play(Create(glass),Create(lid),DrawBorderThenFill(scale),run_time=2)
            dots=[glow_dot([-1.15+(i%5)*.55,-.8+(i//5)*.65,0],TEAL,.065) for i in range(10)]
            particles=VGroup(*dots);self.play(LaggedStart(*[FadeIn(p) for p in particles],lag_ratio=.09),run_time=1.7)
            reading=mathtex(r'250{,}0\,\mathrm g',34,INK).move_to(scale)
            self.play(Write(reading),run_time=1.5)
            target=[np.array([-1.1+(i%5)*.53,.6-(i//5)*1.15,0]) for i in range(10)]
            self.play(*[MoveAlongPath(p,ArcBetweenPoints(p.get_center(),q,angle=(-1)**i*.8)) for i,(p,q) in enumerate(zip(particles,target))],run_time=3.4)
            boundary=DashedVMobject(RoundedRectangle(width=4.9,height=3.75,corner_radius=.2,color=GOLD),num_dashes=50).move_to([0,.22,0])
            self.play(Create(boundary),run_time=1.5)
            equal=mathtex(r'm_{\text{före}}=m_{\text{efter}}',36,TEAL).move_to([4.8,.3,0])
            note=tex('hela systemet',26,GOLD).move_to([-4.9,.3,0])
            self.play(Write(equal),FadeIn(note),run_time=1.8)
            self.play(*[p.animate.shift(UP*.15*(-1)**i) for i,p in enumerate(particles)],
                      rate_func=there_and_back,run_time=2.3)
            self.play(Indicate(reading,color=TEAL),run_time=1)

        # 11. Pull the camera back to recover the apparently missing mass.
        with self.beat('Öppna gränsen -- följ gasen som lämnar',
            'Om gas lämnar en öppen behållare kan vågen visa mindre massa. Materian har inte försvunnit; en del finns nu utanför det vi väger. Siffrorna är ett tänkt exempel, inte mätningar.', seconds=16,clear=True):
            glass,lid,scale=sample_flask();self.play(Create(glass),Create(lid),FadeIn(scale),run_time=1.2)
            inside=VGroup(*[glow_dot([-1.1+(i%5)*.53,-.75+(i//5)*.6,0],TEAL,.07) for i in range(10)])
            reading=mathtex(r'250{,}0\,\mathrm g',34,INK).move_to(scale)
            self.play(FadeIn(inside),Write(reading),run_time=1.4)
            self.play(lid.animate.shift(UP*.6+RIGHT*1.1).rotate(.35),run_time=1.6)
            departing=inside[-3:]
            destinations=[[-4.8,1.7,0],[4.5,1.9,0],[3.5,2.3,0]]
            paths=[CubicBezier(p.get_center(),[-.3,2.4,0],[d[0]*.7,2.5,0],np.array(d)) for p,d in zip(departing,destinations)]
            traces=VGroup(*[TracedPath(p.get_center,stroke_color=TEAL,stroke_width=2,dissipating_time=1).set_opacity(.3) for p in departing])
            self.add(traces)
            self.play(LaggedStart(*[MoveAlongPath(p,path) for p,path in zip(departing,paths)],lag_ratio=.20),run_time=4.2)
            new_reading=mathtex(r'248{,}0\,\mathrm g',34,INK).move_to(reading)
            self.play(TransformMatchingTex(reading,new_reading),run_time=1.5)
            outside=tex('Gasen finns utanför vågen.',27,TEAL).move_to([4.5,.85,0])
            self.play(Write(outside),run_time=1.4)
            sum_mass=mathtex(r'248{,}0+2{,}0=250{,}0\,\mathrm g',35,INK).move_to([0,-2.8,0])
            self.play(Write(sum_mass),run_time=1.9)
            traces.clear_updaters(recursive=True)
            self.play(Indicate(departing,color=TEAL),run_time=1.2)

        # 12. The same visible sign can come from different mechanisms.
        with self.beat('Bubblor är en ledtråd -- inte ensamma ett bevis',
            'Bubblor kan vara vattenånga när vatten kokar. Bubblor kan också vara en ny gas som bildas i en kemisk reaktion. För att avgöra vad som hänt måste vi undersöka vilka ämnen som finns.', seconds=16,clear=True):
            cards=VGroup(*[RoundedRectangle(width=5.8,height=4,corner_radius=.12,color=MUTED,stroke_width=1.2).move_to([x,.05,0]) for x in [-3.6,3.6]])
            self.play(Create(cards),run_time=1.4)
            titles=VGroup(tex('VATTEN KOKAR',28,BLUE).move_to([-3.6,1.65,0]),
                          tex('EN NY GAS BILDAS',28,CORAL).move_to([3.6,1.65,0]))
            self.play(Write(titles),run_time=1.6)
            basins=VGroup(*[VMobject(color=BLUE,stroke_width=3).set_points_as_corners([[x-1.4,.75,0],[x-1.2,-1.45,0],[x+1.2,-1.45,0],[x+1.4,.75,0]]) for x in [-3.6,3.6]])
            self.play(Create(basins),run_time=1.4)
            time=ValueTracker(0)
            bubbles=VGroup(*[Circle(radius=.08+.02*(i%3),color=color,stroke_width=2)
                            for center,color in [(-3.6,BLUE),(3.6,CORAL)] for i in range(8)])
            def move_bubbles(group):
                for j,b in enumerate(group):
                    i=j%8;center=-3.6 if j<8 else 3.6
                    progress=(time.get_value()+i*.31)%2.8
                    b.move_to([center+(i%3-1)*.48+.06*math.sin(progress*3+i),-1.2+progress*.63,0])
                    b.set_stroke(opacity=.9 if progress<2.3 else .9*(2.8-progress)/.5)
            bubbles.add_updater(move_bubbles);self.add(bubbles)
            self.play(time.animate.set_value(4.4),run_time=4.4,rate_func=linear)
            labels=VGroup(mathtex(r'\mathrm H_2\mathrm O(g)',30,BLUE).move_to([-3.6,-2.3,0]),
                          tex('vilken gas?',28,CORAL).move_to([3.6,-2.3,0]))
            self.play(FadeIn(labels),run_time=1.5)
            self.play(time.animate.set_value(8.2),run_time=3.8,rate_func=linear)
            bubbles.clear_updaters()
            self.play(Indicate(labels[1],color=GOLD),run_time=1.2)

        # 13. Mixing changes the macroscopic colour without changing the particles.
        with self.beat('Färg och temperatur behöver också förklaras',
            'En färg kan förändras när färgämnen blandas utan att nya ämnen bildas. Temperatur kan ändras både genom uppvärmning och genom reaktioner. Beskriv först vad ni ser och pröva sedan en förklaring.', seconds=16,clear=True):
            container=RoundedRectangle(width=7.3,height=3.6,corner_radius=.12,color=BLUE,stroke_width=2).move_to([-1.9,.05,0])
            colors=VGroup(*[Dot([-4.7+(i%4)*.45,.95-(i//4)*.65,0],radius=.085,color=BLUE) for i in range(12)],
                          *[Dot([-.6+(i%4)*.45,.95-(i//4)*.65,0],radius=.085,color=VIOLET) for i in range(12)])
            self.play(Create(container),LaggedStart(*[FadeIn(d) for d in colors],lag_ratio=.04),run_time=2.2)
            label=tex('blandning',29,INK).move_to([-1.9,2.1,0]);self.play(Write(label),run_time=1.1)
            mixed=[np.array([-4.6+(i%8)*.75,.9-(i//8)*.80,0]) for i in range(24)]
            order=[i//2+(12 if i%2 else 0) for i in range(24)]
            self.play(*[MoveAlongPath(colors[index],ArcBetweenPoints(colors[index].get_center(),mixed[k],angle=(-1)**k*.7))
                        for k,index in enumerate(order)],run_time=4.1)
            self.play(*[d.animate.shift(np.array([.10*(-1)**i,.12*(-1)**(i//2),0])) for i,d in enumerate(colors)],
                      rate_func=there_and_back,run_time=2.2)
            thermometer=VGroup(Line([4.3,-1.2,0],[4.3,1.5,0],color=MUTED,stroke_width=9),
                               Line([4.3,-1.2,0],[4.3,.1,0],color=CORAL,stroke_width=6),
                               Circle(radius=.19,color=CORAL,fill_color=CORAL,fill_opacity=1).move_to([4.3,-1.3,0]))
            self.play(Create(thermometer),run_time=1.6)
            self.play(thermometer[1].animate.put_start_and_end_on([4.3,-1.2,0],[4.3,1.1,0]),run_time=2)
            question=tex('Vilka ämnen finns före och efter?',29,TEAL).move_to([0,-2.55,0])
            self.play(Write(question),run_time=1.5)
            self.play(Indicate(colors,color=INK),run_time=1)

        # 14. Reconstruct an explanation from the atom inventory and system boundary.
        with self.beat('Bygg en förklaring som håller ihop',
            'Fråga om samma ämne finns kvar eller om nya ämnen har bildats. Följ atomerna och håll reda på systemets gräns. Förklara sedan skillnaden mellan en fysisk förändring och en kemisk reaktion.', seconds=16,clear=True):
            stages=VGroup(*[tex(word,30,color).move_to([x,1.4,0]) for x,word,color in
                          [(-5,'VAD SER VI?',BLUE),(0,'VILKA ÄMNEN?',GOLD),(5,'VAD FINNS KVAR?',TEAL)]])
            arrows=VGroup(arrow([-3.2,1.4,0],[-1.8,1.4,0]),arrow([1.9,1.4,0],[3.35,1.4,0]))
            self.play(LaggedStart(*[Write(t) for t in stages],lag_ratio=.25),run_time=2.3)
            self.play(GrowArrow(arrows[0]),GrowArrow(arrows[1]),run_time=1.3)
            equation=mathtex(r'2\mathrm H_2+\mathrm O_2\longrightarrow2\mathrm H_2\mathrm O',45,INK,width=13).move_to([0,-.1,0])
            self.play(Write(equation),run_time=2.4)
            counts=VGroup(mathtex(r'4\mathrm H=4\mathrm H',35,BLUE).move_to([-2.9,-1.4,0]),
                          mathtex(r'2\mathrm O=2\mathrm O',35,CORAL).move_to([2.9,-1.4,0]))
            self.play(Write(counts),run_time=2.2)
            chemical=tex('Nya bindningar -- nya ämnen.',31,TEAL).move_to([0,-2.35,0])
            self.play(Write(chemical),run_time=1.7)
            self.play(Indicate(stages[1],color=GOLD),run_time=1.5)
            self.play(Indicate(counts,color=TEAL),run_time=1.5)
            self.play(Indicate(equation,color=TEAL),run_time=1.5)
            self.play(chemical.animate.scale(1.04),rate_func=there_and_back,run_time=1)

        self.finish('Vid en fysisk förändring kan ordning, rörelse och avstånd ändras medan ämnet finns kvar. Vid en kemisk reaktion bildas nya ämnen. Atomerna och den totala massan bevaras när hela systemet följs.')

