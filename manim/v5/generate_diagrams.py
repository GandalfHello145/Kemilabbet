"""Six editable, labelled SVG teaching images, with matching text alternatives."""
from pathlib import Path
from html import escape
import json

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets/diagrams-v5'
BG='#091524';INK='#F1F4EE';MUTED='#A7BBC8';BLUE='#72B8FF'
CORAL='#F98D7C';GOLD='#F5C866';TEAL='#54E3C2';VIOLET='#BEA3F6'

def text(value,x,y,size=32,color=INK,anchor='middle'):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" text-anchor="{anchor}">{escape(value)}</text>'

def line(x1,y1,x2,y2,color=MUTED,width=4,dash=None):
    extra=f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"{extra}/>'

def arrow(x1,y1,x2,y2,color=TEAL):
    return f'<path d="M{x1},{y1} L{x2},{y2}" fill="none" stroke="{color}" stroke-width="4" marker-end="url(#arrow)"/>'

def circle(x,y,r,color,symbol='',width=3):
    result=f'<circle cx="{x}" cy="{y}" r="{r}" fill="{BG}"/>'
    result+=f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}" fill-opacity=".14" stroke="{color}" stroke-width="{width}"/>'
    if symbol:result+=text(symbol,x,y+r*.36,r*1.18,INK)
    return result

def water(x,y,scale=1):
    content=line(0,-20,-36,25)+line(0,-20,36,25)
    content+=circle(0,-20,24,CORAL,'O')+circle(-36,25,17,BLUE,'H')+circle(36,25,17,BLUE,'H')
    return f'<g transform="translate({x} {y}) scale({scale})">{content}</g>'

def pair(x,y,color=CORAL,symbol='O',scale=1):
    content=line(-28,0,28,0)+circle(-28,0,21,color,symbol)+circle(28,0,21,color,symbol)
    return f'<g transform="translate({x} {y}) scale({scale})">{content}</g>'

def rect(x,y,w,h,color=MUTED,r=16):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{color}" fill-opacity=".025" stroke="{color}" stroke-opacity=".5" stroke-width="2"/>'

def beaker(x,y,w=120,h=160):
    return f'<path d="M{x-w/2},{y-h/2} V{y+h/2} H{x+w/2} V{y-h/2}" fill="none" stroke="{BLUE}" stroke-width="4"/>'+line(x-w/2,y-h*.17,x+w/2,y-h*.17,BLUE,2)

def frame(title,description,body,panels=3):
    borders=''.join(rect(20+i*395,120,370,470) for i in range(3)) if panels==3 else rect(20,120,570,470)+rect(610,120,570,470)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="620" viewBox="0 0 1200 620" role="img" aria-labelledby="title description" lang="sv" xml:lang="sv">
<title id="title">{escape(title)}</title><desc id="description">{escape(description)}</desc>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="{TEAL}"/></marker></defs>
<style>text{{font-family:Arial,Helvetica,sans-serif;font-weight:500}}line,path{{stroke-linecap:round;stroke-linejoin:round}}</style>
<rect width="1200" height="620" rx="20" fill="{BG}"/>{text(title,600,72,44)}{borders}{body}</svg>'''

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    drawings=[]

    title='Atom, molekyl och blandning'
    alt='En syreatom visas som en röd cirkel med O. Två blå H-atomer och en röd O-atom sitter ihop i en vattenmolekyl. Vatten och syrgas tillsammans är en blandning av två ämnen.'
    body=text('Atom',205,175,38)+text('Molekyl',600,175,38)+text('Blandning',995,175,38)
    body+=circle(205,305,57,CORAL,'O')+text('syreatom',205,450,31,CORAL)
    water_text=text('vatten',555,450,31,TEAL)+text('H',635,450,31,TEAL)
    water_text+=text('2',655,458,22,TEAL)+text('O',675,450,31,TEAL)
    body+=water(600,300,1.5)+water_text+text('olika atomslag sitter ihop',600,510,25)
    body+=rect(835,220,320,190,BLUE)+water(915,305,.9)+pair(1070,300,scale=.9)
    body+=text('vatten + syrgas',995,450,31)+text('två ämnen tillsammans',995,510,25)
    drawings.append(('01-atomer.svg',title,alt,frame(title,alt,body)))

    title='Tre bilder av atomen'
    alt='Thomsons modell visar elektroner inne i en positiv klump. Rutherfords modell har en liten kärna och mycket tomrum. Bohrs skalmodell visar en kärna med elektroner i skal.'
    body=text('Thomson',205,175,38)+text('Rutherford',600,175,38)+text('Bohr',995,175,38)
    body+=circle(205,310,94,GOLD)
    for x,y in [(165,270),(245,285),(190,350)]:body+=circle(x,y,16,BLUE,'−')
    body+=text('elektroner i en klump',205,480,27)
    body+=f'<circle cx="600" cy="310" r="106" fill="none" stroke="{MUTED}" stroke-width="3"/>'+circle(600,310,12,GOLD,'+')
    body+=arrow(740,240,620,303)+text('liten kärna',600,480,31,GOLD)+text('mest tomrum',600,530,28,MUTED)
    body+=f'<circle cx="995" cy="310" r="92" fill="none" stroke="{BLUE}" stroke-width="3"/>'+circle(995,310,17,GOLD,'+')+circle(1087,310,16,BLUE,'−')
    body+=text('elektronskal',995,480,31,BLUE)
    drawings.append(('02-modeller.svg',title,alt,frame(title,alt,body)))

    title='Laddning och elektroner'
    alt='En neutral väteatom har en positiv proton och en negativ elektron. När elektronen lämnar blir det en positiv jon. Två väteatomer kan i stället dela på två elektroner.'
    body=text('Neutral atom',205,175,36)+text('Positiv jon',600,175,36)+text('Dela elektroner',995,175,34)
    body+=f'<circle cx="205" cy="310" r="85" fill="none" stroke="{MUTED}" stroke-width="2"/>'+circle(205,310,27,GOLD,'+')+circle(290,310,20,BLUE,'−')
    body+=text('lika många + och −',205,490,28)
    body+=circle(580,310,27,GOLD,'+')+arrow(623,305,710,250)+circle(730,240,20,BLUE,'−')
    body+=text('en elektron lämnar',600,490,28,BLUE)
    body+=f'<ellipse cx="995" cy="310" rx="142" ry="80" fill="none" stroke="{MUTED}" stroke-width="2"/>'
    body+=circle(920,310,25,GOLD,'+')+circle(1070,310,25,GOLD,'+')+circle(985,285,13,BLUE,'−')+circle(1005,335,13,BLUE,'−')
    body+=text('två väteatomer',995,465,28)+text('delar på två elektroner',995,515,25,BLUE)
    drawings.append(('03-elektroner.svg',title,alt,frame(title,alt,body)))

    title='Smältning eller kemisk reaktion?'
    alt='Vid smältning finns samma två vattenmolekyler kvar, men deras platser ändras. Vid reaktionen ordnas fyra väteatomer och två syreatomer om från väte och syre till två vattenmolekyler. Atomerna finns kvar.'
    body=text('Smältning',305,175,38)+text('Kemisk reaktion',895,175,38)
    body+=water(135,270,.9)+water(135,390,.9)+arrow(235,330,335,330)+water(445,285,.9)+water(470,395,.9)
    body+=text('samma molekyler',305,510,32,TEAL)
    body+=pair(695,260,BLUE,'H',.72)+pair(695,395,BLUE,'H',.72)+pair(795,330,CORAL,'O',.72)
    body+=arrow(865,330,950,330)+water(1060,270,.9)+water(1060,395,.9)
    body+=text('atomerna får nya grannar',895,510,30,TEAL)
    drawings.append(('04-forandringar.svg',title,alt,frame(title,alt,body,panels=2)))

    title='Egenskapen hjälper oss att välja'
    alt='Lika stora stavar jämförs. Värme sprids snabbare genom koppar än genom trä. Salt sprids som joner i vatten, medan sand ligger kvar. En kastrull kan ha metall som leder värme och ett trähandtag som skyddar handen.'
    body=text('Värme',205,175,38)+text('Löslighet',600,175,38)+text('Materialval',995,175,36)
    body+=text('koppar',205,245,31,CORAL)+rect(60,270,290,36,CORAL,7)+line(70,288,325,288,CORAL,8)
    body+=text('trä',205,355,31,GOLD)+rect(60,380,290,36,GOLD,7)+line(70,398,135,398,CORAL,8)
    body+=text('lika stora stavar',205,500,28)
    body+=beaker(515,330,110,170)+beaker(680,330,110,170)
    for x,y,s,c in [(490,310,'+',GOLD),(540,340,'−',TEAL),(500,380,'−',TEAL),(545,375,'+',GOLD)]:body+=circle(x,y,11,c,s)
    for x,y in [(655,390),(680,395),(703,388)]:body+=circle(x,y,10,GOLD)
    body+=text('salt',515,455,30,TEAL)+text('sand',680,455,30,GOLD)
    body+=text('löser sig',515,505,24,TEAL)+text('ligger kvar',680,505,24,GOLD)
    body+=f'<path d="M855,300 H1005 Q1005,400 930,400 Q855,400 855,300" fill="none" stroke="{CORAL}" stroke-width="6"/>'
    body+=rect(1008,303,145,27,GOLD,10)+text('metall',902,250,30,CORAL)+text('trä',1090,250,30,GOLD)
    body+=arrow(905,260,920,292)+arrow(1090,260,1090,294)
    body+=text('värme till maten',995,470,28)+text('skydd för handen',995,515,28)
    drawings.append(('05-egenskaper.svg',title,alt,frame(title,alt,body)))

    title='Samma vattenmolekyler i tre former'
    alt='Fyra likadana vattenmolekyler visas i varje form. I is har de bestämda platser. I flytande vatten ligger de nära och kan röra sig förbi varandra. I gas finns större avstånd mellan dem. Molekylerna blir inte större.'
    body=text('Fast',205,175,38,BLUE)+text('Flytande',600,175,38,TEAL)+text('Gas',995,175,38,GOLD)
    ice=[(145,265),(265,265),(145,385),(265,385)]
    liquid=[(550,290),(650,290),(550,380),(650,380)]
    gas=[(900,240),(1090,260),(890,415),(1085,420)]
    for a,b in [(0,1),(0,2),(1,3),(2,3)]:body+=line(*ice[a],*ice[b],MUTED,2,'7 7')
    for x,y in ice+liquid+gas:body+=water(x,y,.8)
    body+=text('bestämda platser',205,515,27)+text('kan byta plats',600,515,27)+text('större avstånd',995,515,27)
    drawings.append(('06-faser.svg',title,alt,frame(title,alt,body)))

    panel_specs={
        '01-atomer.svg':[
            ('Atom','En enda röd O-kula visar en syreatom.'),
            ('Molekyl','Två blå H-atomer och en röd O-atom sitter ihop i vatten, H2O.'),
            ('Blandning','Vatten och syrgas visas tillsammans. De är två olika ämnen.')],
        '02-modeller.svg':[
            ('Thomson','Negativa elektroner finns inne i en positiv klump.'),
            ('Rutherford','En liten kärna finns i mitten. Runt kärnan finns mycket tomrum.'),
            ('Bohr','En elektron visas i ett skal runt kärnan.')],
        '03-elektroner.svg':[
            ('Neutral atom','En positiv proton och en negativ elektron ger tillsammans laddningen noll.'),
            ('Positiv jon','En negativ elektron lämnar. Då finns positiv laddning kvar.'),
            ('Dela elektroner','Två väteatomer delar på två elektroner mellan sina kärnor.')],
        '04-forandringar.svg':[
            ('Smältning','Samma två vattenmolekyler finns kvar. Bara deras platser ändras.'),
            ('Kemisk reaktion','Fyra H-atomer och två O-atomer får nya grannar och bildar två vattenmolekyler.')],
        '05-egenskaper.svg':[
            ('Värme','Lika stora stavar jämförs. Värmen sprids längre genom koppar än genom trä.'),
            ('Löslighet','Saltets joner sprids i vattnet. Sanden ligger kvar på botten.'),
            ('Materialval','Metallen för värme till maten. Trähandtaget skyddar handen.')],
        '06-faser.svg':[
            ('Fast','Fyra vattenmolekyler har bestämda platser i is.'),
            ('Flytande','Fyra likadana vattenmolekyler ligger nära och kan byta plats.'),
            ('Gas','Fyra likadana vattenmolekyler ligger längre från varandra.')]
    }
    metadata=[]
    for filename,title,alt,svg in drawings:
        (OUT/filename).write_text(svg+'\n',encoding='utf-8')
        panels=[]
        specs=panel_specs[filename]
        for i,(panel_title,panel_alt) in enumerate(specs):
            panels.append({'title':panel_title,'x':20+i*(395 if len(specs)==3 else 590),
                'y':120,'width':370 if len(specs)==3 else 570,'height':470,'panelAlt':panel_alt})
        metadata.append({'id':filename[:2],'src':'assets/diagrams-v5/'+filename,'title':title,'alt':alt,'format':'svg','width':1200,'height':620,'panels':panels})
    (OUT/'index.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(metadata,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
