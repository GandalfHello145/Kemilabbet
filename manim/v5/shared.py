"""Small, legible building blocks; every label is LaTeX."""
from core import *


def label(value, pos, size=43, color=INK, width=None):
    return tex(value,size=size,color=color,width=width).move_to(pos)


def formula(value, pos, size=68, color=INK):
    return mathtex(value,size=size,color=color).move_to(pos)


def atom(symbol, color, pos=ORIGIN, radius=.52):
    return dot_atom(symbol,color,radius,position=pos)


def water(pos=ORIGIN, scale=1.0):
    return molecule2d(pos,scale=scale,labels=True)


def panel(width,height,pos,color=BLUE):
    return RoundedRectangle(width=width,height=height,corner_radius=.2,
        color=color,stroke_width=2,fill_color=color,fill_opacity=.035).move_to(pos)


def bond(a,b,color=MUTED,width=7):
    return Line(a.get_center(),b.get_center(),color=color,stroke_width=width).set_z_index(-1)


def drift(group,positions,seconds=5,amplitude=.10,speed=1.0):
    origins=np.array(positions,dtype=float)
    def update(mobs,alpha):
        for i,(m,p) in enumerate(zip(mobs,origins)):
            m.move_to(p+[amplitude*np.sin(alpha*seconds*speed+i*2.1),
                amplitude*.7*np.cos(alpha*seconds*speed*1.2+i*1.8),0])
    return UpdateFromAlphaFunc(group,update,run_time=seconds,rate_func=linear)


def move_label(scene,mob,text_value,pos,color=INK,run_time=1.5):
    text_mob=label(text_value,pos,color=color)
    scene.play(FadeIn(text_mob),run_time=run_time)
    return text_mob


def gentle(scene,mob,seconds=5,color=TEAL):
    """An attention ring moves around the existing object without recolouring it."""
    ring=SurroundingRectangle(mob,buff=.2,color=color,corner_radius=.2,stroke_width=2)
    scene.play(Create(ring),run_time=1)
    scene.wait(max(0,seconds-2))
    scene.play(FadeOut(ring),run_time=1)
