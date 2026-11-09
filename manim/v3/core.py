"""Original visual language for the longer chemistry films.

All typography is LaTeX. Scientific objects retain their identities and colours.
The camera can move through the model while captions remain fixed and readable.
"""
from contextlib import contextmanager
from pathlib import Path
import json
import math
import re
import warnings
import numpy as np
from manim import *

config.frame_width = 16
config.frame_height = 9

BG = '#091524'
INK = '#F1F4EE'
MUTED = '#A7BBC8'
TEAL = '#54E3C2'
BLUE = '#72B8FF'
GOLD = '#F5C866'
CORAL = '#F98D7C'
VIOLET = '#BEA3F6'
OXYGEN = CORAL
HYDROGEN = BLUE

TEMPLATE = TexTemplate(preamble=r'''
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage[swedish]{babel}
\usepackage{lmodern,amsmath,amssymb,mathtools,xcolor}
''')

ROOT = Path(__file__).resolve().parents[2]
FILENAMES = ['01-atomer','02-modeller','03-elektroner','04-forandringar',
             '05-egenskaper','06-faser','07-miljo']


def tex(s, size=32, color=INK, width=None):
    result = Tex(str(s), tex_template=TEMPLATE, font_size=size, color=color)
    if width and result.width > width:
        result.scale_to_fit_width(width)
    return result


text = tex


def mathtex(s, size=42, color=INK, width=None):
    result = MathTex(str(s), tex_template=TEMPLATE, font_size=size, color=color)
    if width and result.width > width:
        result.scale_to_fit_width(width)
    return result


formula = mathtex


def prose_tex(value):
    value = str(value)
    replacements = {'&':r'\&','%':r'\%','#':r'\#','_':r'\_',
                    '₂':r'$_2$','₃':r'$_3$','₄':r'$_4$','₁':r'$_1$',
                    '→':r'$\rightarrow$','−':'-','×':r'$\times$',
                    '²':r'$^2$','³':r'$^3$'}
    return ''.join(replacements.get(character,character) for character in value)


def dot_atom(symbol, color, radius=.35, position=ORIGIN):
    layers = VGroup()
    for scale, opacity in [(1.12,.035),(1.04,.07),(1,.17)]:
        layers.add(Circle(radius=radius*scale,stroke_width=0,
                          fill_color=color,fill_opacity=opacity))
    layers.add(Circle(radius=radius,color=color,stroke_width=2.2))
    if symbol:
        layers.add(mathtex(r'\mathrm{'+str(symbol)+'}',
                           size=max(19,35*radius/.35),color=color))
    return layers.move_to(position)


def sphere_atom(color, radius=.3, pos=ORIGIN):
    return Sphere(center=pos,radius=radius,resolution=(16,24),
                  checkerboard_colors=False,fill_color=color,
                  fill_opacity=1,stroke_width=0)


def molecule2d(pos=ORIGIN, scale=1, labels=True):
    oxygen = dot_atom('O' if labels else '',OXYGEN,.34)
    left = dot_atom('H' if labels else '',HYDROGEN,.23,[-.57,-.44,0])
    right = dot_atom('H' if labels else '',HYDROGEN,.23,[.57,-.44,0])
    bonds = VGroup(Line(oxygen.get_center(),left.get_center(),color=MUTED,stroke_width=5),
                   Line(oxygen.get_center(),right.get_center(),color=MUTED,stroke_width=5))
    return VGroup(bonds,oxygen,left,right).scale(scale).move_to(pos)


def molecule3d(pos=ORIGIN, scale=1):
    oxygen = sphere_atom(OXYGEN,.37)
    left = sphere_atom(HYDROGEN,.25,[-.57,-.44,.08])
    right = sphere_atom(HYDROGEN,.25,[.57,-.44,-.08])
    bonds = VGroup(Line3D(oxygen.get_center(),left.get_center(),thickness=.048,color=INK),
                   Line3D(oxygen.get_center(),right.get_center(),thickness=.048,color=INK))
    return VGroup(bonds,oxygen,left,right).scale(scale).move_to(pos)


def arrow(start,end,color=TEAL,**kwargs):
    return Arrow(start,end,buff=kwargs.pop('buff',.10),color=color,
                 stroke_width=kwargs.pop('stroke_width',3),**kwargs)


def glow_dot(pos=ORIGIN,color=TEAL,radius=.08):
    result = VGroup()
    for factor,alpha in [(4,.025),(3,.04),(2,.08),(1.4,.16)]:
        result.add(Dot(pos,radius=radius*factor,color=color,fill_opacity=alpha))
    result.add(Dot(pos,radius=radius,color=color))
    return result


class MasterFilm(ThreeDScene):
    number = 1
    topic = 'Kemins grunder'
    slug = ''
    enforce_duration = True

    def setup(self):
        super().setup()
        self.camera.background_color = BG
        self.set_camera_orientation(phi=0,theta=-PI/2)
        self.slug = self.slug or FILENAMES[self.number-1]
        self._fixed = []
        self._caption = None
        self._heading = None
        self._cue_start = None
        self._cue_plain = None
        self._cues = []
        self._beats = []
        self._played_seconds = 0
        self._wait_seconds = 0
        self._play_count = 0
        self._finished = False
        number = tex(f'{self.number:02d}',27,TEAL).move_to([-7.05,4.02,0])
        topic = tex(self.topic,29,INK,width=11.2).next_to(number,RIGHT,buff=.28)
        brand = tex('Kemins grunder (i)',17,MUTED).to_corner(UR,buff=.30)
        line = Line([-7.35,3.62,0],[7.35,3.62,0],color=MUTED,stroke_width=.8).set_opacity(.30)
        self._caption_background = Rectangle(width=16,height=1.40,stroke_width=0,
                    fill_color=BG,fill_opacity=.97).move_to([0,-3.82,0])
        self.fixed(number,topic,brand,line,self._caption_background)
        self.play(FadeIn(number),FadeIn(topic,shift=RIGHT*.15),
                  Create(line),FadeIn(brand),run_time=1.0)

    def fixed(self,*objects):
        self.add_fixed_in_frame_mobjects(*objects)
        for obj in objects:
            if obj not in self._fixed:
                self._fixed.append(obj)
        return objects[0] if len(objects)==1 else VGroup(*objects)

    def unfix(self,obj):
        if obj in self._fixed:
            self._fixed.remove(obj)
        self.remove_fixed_in_frame_mobjects(obj)
        self.remove(obj)

    def play(self,*animations,**kwargs):
        before = self.time
        result = super().play(*animations,**kwargs)
        elapsed = self.time-before
        if hasattr(self,'_played_seconds'):
            if animations and all(isinstance(a,Wait) for a in animations):
                self._wait_seconds += elapsed
            else:
                self._played_seconds += elapsed
                self._play_count += 1
        return result

    def cue(self,prose,plain=None):
        if self._cue_start is not None:
            self._cues.append((self._cue_start,self.time,self._cue_plain))
        self._cue_start = self.time
        self._cue_plain = plain if plain is not None else str(prose)
        display = str(prose) if plain is not None else prose_tex(prose)
        new = tex(r'\parbox{18.2cm}{\centering '+display+'}',
                  size=29,color=INK,width=14.4).move_to([0,-3.82,0])
        if new.height > 1.03:
            new.scale_to_fit_height(1.03)
        if self._caption is not None:
            self.unfix(self._caption)
        self._caption = new
        self.fixed(new)
        return new

    def heading(self,title):
        if self._heading is not None:
            self.unfix(self._heading)
        self._heading = tex(title,35,TEAL,width=14).move_to([0,3.08,0])
        self.fixed(self._heading)
        self.play(FadeIn(self._heading,shift=UP*.10),run_time=.45)
        return self._heading

    chapter = heading

    def clear_stage(self,reset_camera=True):
        fixed_ids = {id(obj) for obj in self._fixed}
        content = [obj for obj in list(self.mobjects) if id(obj) not in fixed_ids]
        for obj in content:
            obj.clear_updaters(recursive=True)
        if content:
            self.play(*[FadeOut(obj) for obj in content],run_time=.65)
        if reset_camera:
            self.set_camera_orientation(phi=0,theta=-PI/2,zoom=1,
                                        frame_center=ORIGIN)

    @contextmanager
    def beat(self,title,prose,seconds=16,clear=False):
        if clear:
            self.clear_stage()
        start = self.time
        play_start = self._played_seconds
        wait_start = self._wait_seconds
        self.cue(prose)
        self.heading(title)
        yield
        remaining = seconds-(self.time-start)
        if remaining > 3:
            warnings.warn(f'{self.slug}: beat {title!r} has {remaining:.1f}s reading hold')
        if remaining > 0:
            self.wait(remaining,frozen_frame=False)
        self._beats.append({'title':title,'start':start,'end':self.time,
                            'animation_seconds':self._played_seconds-play_start,
                            'wait_seconds':self._wait_seconds-wait_start,
                            'automatic_reading_hold':max(remaining,0)})

    def finish(self,summary):
        self.clear_stage()
        self.cue(summary)
        self.heading('Nu kan ni förklara sambanden')
        circle = Circle(radius=.55,color=TEAL,fill_color=TEAL,fill_opacity=.08)
        check = VMobject(color=TEAL,stroke_width=6).set_points_as_corners(
                    [[-.27,0,0],[-.04,-.23,0],[.34,.29,0]])
        title = tex('Titta. Förstå. Förklara.',46,INK).next_to(circle,DOWN,buff=.48)
        self.play(Create(circle),Create(check),Write(title),run_time=2.4)
        self.wait(4)
        self._finished = True
        if self.enforce_duration and not 180 <= self.time <= 300:
            raise ValueError(f'{self.slug} lasts {self.time:.1f}s; expected 180–300s')

    def tear_down(self):
        if self._cue_start is not None:
            self._cues.append((self._cue_start,self.time,self._cue_plain))
        if self._finished:
            target = ROOT/'assets'/'captions'/'v3'
            target.mkdir(parents=True,exist_ok=True)
            def stamp(value):
                total = round(value*1000)
                return f'{total//3600000:02}:{total//60000%60:02}:{total//1000%60:02}.{total%1000:03}'
            cues = ['WEBVTT','']
            for n,(start,end,plain) in enumerate(self._cues,1):
                if end > start:
                    cues += [str(n),f'{stamp(start)} --> {stamp(end)}',plain,'']
            (target/(self.slug+'.vtt')).write_text('\n'.join(cues),encoding='utf-8')
            analysis = ROOT/'manim'/'v3'/'timing'
            analysis.mkdir(parents=True,exist_ok=True)
            (analysis/(self.slug+'.json')).write_text(json.dumps({
                'duration':self.time,'animation_seconds':self._played_seconds,
                'wait_seconds':self._wait_seconds,'animation_calls':self._play_count,
                'beats':self._beats},ensure_ascii=False,indent=2))
        super().tear_down()
