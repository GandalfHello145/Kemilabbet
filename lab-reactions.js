import {createLab,drawAtom,drawBond,roundRect} from './lab-kit.js?v=20261110-labs3';
import {ReactionsModel} from './lab-reactions-model.js?v=20261110-labs3';

const C={ink:'#e5f5f4',muted:'#a1c0cc',teal:'#71e7d8',gold:'#ffd482',coral:'#ffac98'};
const lerp=(a,b,t)=>a+(b-a)*t,smooth=t=>t*t*(3-2*t);

export function mountLab(host){
  const model=new ReactionsModel();
  let prediction='',mastered=false,followed=true,compact=false,drag=null;
  let positions=new Map(),from=new Map(),oldMolecules=[],progress=1,duration=.6,busy=false,kind='move',movingIds=new Set(),allowMotion=true;
  const lab=createLab(host,{
    id:'reaction',title:'Reaktionslabbet',subtitle:'Välj molekyler, bygg en reaktionsgrupp och följ varje atom.',badge:'VÄLJ · GRUPPERA · OMGRUPPERA',running:true,hideRun:true,
    objective:'Gruppera två H₂ och en O₂. Följ hur samma sex atomer blir två H₂O.',
    steps:[{title:'Förutsäg',text:'Hur många H₂O kan bildas?'},{title:'Välj en grupp',text:'Två H₂ och en O₂.'},{title:'Omgruppera',text:'Följ samma atomer.'},{title:'Förklara',text:'Vad bevaras? Vad blir över?'}],
    canvasLabel:'Välj eller dra två H₂ och en O₂ från förrådet till reaktionszonen. Tryck sedan Omgruppera gruppen. Samma handlingar finns som elevknappar.',
    controls:'<div class="cl-control-grid"><label class="cl-field" for="reaction-hydrogen"><span class="cl-slider-label">H₂ från början <output data-reaction="h-count">4</output></span><input id="reaction-hydrogen" type="range" min="0" max="8" value="4" step="1"></label><label class="cl-field" for="reaction-oxygen"><span class="cl-slider-label">O₂ från början <output data-reaction="o-count">2</output></span><input id="reaction-oxygen" type="range" min="0" max="8" value="2" step="1"></label></div>'
      +'<label class="cl-field" for="reaction-prediction">1. Hur många H₂O tror ni kan bildas totalt?<select id="reaction-prediction"><option value="">Välj er förutsägelse</option>'+Array.from({length:9},(_,i)=>`<option value="${i}">${i} vattenmolekyler</option>`).join('')+'</select></label>'
      +'<p class="cl-task-hint">2. Klicka på eller dra molekyler in i reaktionszonen. Knapparna gör samma sak.</p><div class="cl-actions"><button type="button" class="cl-primary" data-reaction="add-h">Välj en H₂ +</button><button type="button" class="cl-primary" data-reaction="add-o">Välj en O₂ +</button><button type="button" class="cl-secondary" data-reaction="clear">Töm gruppen</button></div><p class="cl-task-hint" data-reaction="selection" role="status">Valt: 0 av 2 H₂ och 0 av 1 O₂.</p>'
      +'<button type="button" class="cl-primary" data-reaction="react">3. Omgruppera gruppen →</button><button type="button" class="cl-secondary" data-reaction="next" hidden>Fyll nästa grupp: 2 H₂ + 1 O₂</button>'
      +'<fieldset data-reaction="check-panel" hidden><legend>4. Vad måste vara lika före och efter?</legend><div class="cl-actions"><button type="button" class="cl-primary" data-reaction="check-right">Atomerna och hela massan</button><button type="button" class="cl-secondary" data-reaction="check-wrong">Antalet molekyler</button></div></fieldset>'
      +'<fieldset><legend>Följ massan vidare</legend><div class="cl-actions"><label><input type="radio" name="reaction-system" value="closed" checked> Slutet prov</label><label><input type="radio" name="reaction-system" value="open"> Öppet prov</label><button type="button" class="cl-secondary" data-reaction="release" disabled>Följ en gasmolekyl ut →</button><button type="button" class="cl-secondary" data-reaction="follow" aria-pressed="true">O-atomen är markerad</button></div><p class="cl-task-hint">Slutför först reaktionsgrupperna. Öppna sedan provet och se var gasens massa hamnar.</p></fieldset>'
      +'<p class="cl-task-hint" data-reaction="feedback" role="status">Börja med en förutsägelse. Bygg sedan den första gruppen.</p><button type="button" class="cl-secondary" data-reaction="reset">Börja om med samma mängder ↺</button>',
    metrics:'<div><span>Bildade H₂O</span><strong data-metric="water">0</strong></div><div><span>H₂ / O₂ kvar</span><strong data-metric="excess">4 / 2</strong></div><div><span>Atomer i hela översikten</span><strong data-metric="atoms">8 H · 4 O</strong></div><div><span>Provmassa / omgivning*</span><strong data-metric="mass">72 / 0</strong></div>',
    below:'<p class="cl-formula">2 H₂ + O₂ → 2 H₂O</p><p data-reaction="result">Varje grupp använder fyra H-atomer och två O-atomer. Samma atomer finns kvar i de två vattenmolekylerna.</p><table class="cl-table"><caption>Räkna atomer i provet och omgivningen tillsammans</caption><thead><tr><th>Atomslag</th><th>Före</th><th>Nu</th></tr></thead><tbody><tr><th>H</th><td data-reaction="before-h">8</td><td data-reaction="after-h">8</td></tr><tr><th>O</th><td data-reaction="before-o">4</td><td data-reaction="after-o">4</td></tr></tbody></table><p data-reaction="system-note">Alla molekyler är kvar i provet.</p><p>Jämför med <a href="?lab=alla#omrade-6">Vattenlabbet</a>: där är H₂O kvar när is smälter. Här bildas vatten genom att atomer får nya grannar.</p>',
    explanationTitle:'Bygg en grupp som atomerna räcker till.',explanation:'Gissa först hur många H₂O ni kan bilda. Välj sedan två H₂ och en O₂ med knapparna eller direkt i bilden.',
    questions:['Varför behövs två H₂ för varje O₂?','Vilket ämne hindrar er från att göra ytterligare en grupp?','Var finns massan när en gas har lämnat provet?'],
    model:'<p>Animationen visar atom- och massbokföringen i 2 H₂ + O₂ → 2 H₂O, inte reaktionens verkliga mekanism eller tidsförlopp. Bara de molekyler som eleven väljer omgrupperas, en hel grupp i taget. Alla atom-ID bevaras.</p><p>Avstånd, dragzoner, ljusspår och bindningsövergångar är undervisningshjälpmedel. Ingen kinetik, aktiveringsenergi, temperatur, tryck eller jämvikt beräknas. Att dra ihop molekyler eller trycka på knappen är inte en verklig metod för att starta reaktionen.</p><p>Vatten visas som gas i detta försök för att kunna följa ett öppet prov. I verkligheten beror tillståndet på temperatur och tryck. Gas som lämnar provet finns kvar i omgivningen. Stängning hämtar inte tillbaka den.</p><p>* Massorna är avrundade relativa enheter, H=1 och O=16, inte gram i en verklig laboration. Sammanlagd massa gäller hela översikten. Blandning och antändning av väte och syre kan vara farlig; inga laborationsanvisningar ges här.</p><p>Källa: <a href="https://www.acs.org/middleschoolchemistry/lessonplans/chapter6/lesson1.html" target="_blank" rel="noopener">ACS: kemiska reaktioner och massans bevarande</a>.</p>'
  });
  const $=key=>lab.$(`[data-reaction="${key}"]`);
  function feedback(message){$('feedback').textContent=message;lab.announce(message);}
  function layout(state){
    const result=new Map();let h=0,o=0,outside=0;
    for(const molecule of state.molecules){
      let center;
      if(molecule.location==='surroundings'){const index=outside++;center={x:332+(index%6)*105,y:379+Math.floor(index/6)*39};}
      else if(molecule.formula==='H₂O'){const index=Number(molecule.id.split('-')[1]);center={x:745+(index%2)*126,y:111+Math.floor(index/2)*65};}
      else if(state.selectedIds.includes(molecule.id)){
        if(molecule.formula==='H₂')center={x:h++===0?372:575,y:158};else center={x:474,y:275+o++*30};
      }else{const index=Number(molecule.id.split('-')[1]);center={x:molecule.formula==='H₂'?87:202,y:104+index*37};}
      molecule.atoms.forEach((atom,index)=>{
        const water=molecule.formula==='H₂O',dx=water?(index===0?0:index===1?-24:24):(index===0?-15:15),dy=water?(index===0?-7:13):0;
        result.set(atom.id,{...atom,x:center.x+dx,y:center.y+dy,molecule:molecule.id});
      });
    }
    return result;
  }
  function resetPositions(){positions=layout(model.state);from=new Map(positions);progress=1;busy=false;oldMolecules=[];movingIds.clear();}
  function transition(action,type='move'){
    from=new Map([...positions].map(([id,p])=>[id,{...p}]));oldMolecules=model.state.molecules;
    const result=action();kind=type;duration=type==='react'?2.65:type==='release'?1.8:.5;busy=type!=='move';progress=allowMotion?0:1;
    movingIds=type==='react'?new Set(model.state.lastBatchAtomIds):new Set();
    if(progress===1)busy=false;refresh();return result;
  }
  function summary(s){
    if(!s.completedBatches)return 'Varje grupp behöver 2 H₂ och 1 O₂ och ger 2 H₂O. Räkna fyra H-atomer och två O-atomer på båda sidor.';
    if(!s.complete)return `${s.completedBatches} grupp är klar: ${s.counts.water} H₂O har bildats. Det finns fortfarande molekyler till en ny grupp.`;
    const answer=Number(prediction)===s.counts.water?'Er förutsägelse stämde.':`Ni gissade ${prediction}; det blev ${s.counts.water} H₂O.`;
    return `${answer} Kvar: ${s.counts.hydrogen} H₂ och ${s.counts.oxygen} O₂. Nu går det inte att samla ytterligare 2 H₂ och 1 O₂. Alla ${s.beforeAtoms.H} H-atomer och ${s.beforeAtoms.O} O-atomer finns kvar.`;
  }
  function refresh(){
    const s=model.state,chosen=prediction!=='';
    $('h-count').textContent=s.hydrogen;$('o-count').textContent=s.oxygen;lab.setMetric('water',s.counts.water);lab.setMetric('excess',`${s.counts.hydrogen} / ${s.counts.oxygen}`);lab.setMetric('atoms',`${s.beforeAtoms.H} H · ${s.beforeAtoms.O} O`);lab.setMetric('mass',`${s.sampleMass} / ${s.surroundingsMass}`);
    for(const element of['h','o']){$(`before-${element}`).textContent=s.beforeAtoms[element.toUpperCase()];$(`after-${element}`).textContent=s.afterAtoms[element.toUpperCase()];}
    const availableH=s.molecules.filter(m=>m.location==='sample'&&m.formula==='H₂'&&!s.selectedIds.includes(m.id)).length,availableO=s.molecules.filter(m=>m.location==='sample'&&m.formula==='O₂'&&!s.selectedIds.includes(m.id)).length;
    $('add-h').disabled=!chosen||busy||s.selectedH>=2||!availableH;$('add-o').disabled=!chosen||busy||s.selectedO>=1||!availableO;$('clear').disabled=busy||!s.selectedIds.length;$('react').disabled=busy||(s.complete&&s.reacted);$('next').hidden=!s.completedBatches||s.complete;$('next').disabled=busy;
    $('selection').textContent=`Valt: ${s.selectedH} av 2 H₂ och ${s.selectedO} av 1 O₂.${s.canReact?' Gruppen är redo!':''}`;
    $('check-panel').hidden=!chosen||!s.complete||busy;$('release').disabled=busy||!s.complete||!s.reacted||s.system!=='open'||s.sampleMass===0;$('follow').disabled=s.beforeAtoms.O===0;$('follow').setAttribute('aria-pressed',String(followed));$('follow').textContent=followed?'O-atomen är markerad':'Markera samma O-atom';
    $('result').textContent=summary(s);$('system-note').textContent=s.surroundingsMass?`Provet har massa ${s.sampleMass}; omgivningen ${s.surroundingsMass}. Tillsammans ${s.totalMass}, samma som från början.`:s.system==='open'?'Provet är öppet. En gas som lämnar provet kommer att synas i omgivningen.':'Alla molekyler är kvar i det slutna provet.';
    lab.setStep?.(mastered?3:busy&&kind==='react'?2:chosen?(s.complete?3:1):0);lab.setObjective?.(mastered?'Ni har visat att atomer och hela massan bevaras.':s.complete&&chosen?'Förklara varför det inte går att göra en grupp till.':'Välj 2 H₂ och 1 O₂. Bygg två H₂O med samma sex atomer.',mastered);
    if(busy&&kind==='react')lab.setExplanation('Följ de fyra H-atomerna och de två O-atomerna.','De valda molekylerna omgrupperas till två H₂O. Den markerade syreatomen behåller sin identitet när den får nya grannar.');
    else if(s.surroundingsMass)lab.setExplanation('Massan har flyttat till omgivningen.','Provmassan minskar när gas lämnar provet. Räkna också med omgivningen: då är alla atomer och hela massan kvar.');
    else if(s.complete&&chosen)lab.setExplanation(s.completedBatches?'Vad hindrar nästa grupp?':'Det räcker inte till en hel grupp.',summary(s));
    else if(s.canReact)lab.setExplanation('Gruppen är redo: fyra H-atomer och två O-atomer.','Tryck Omgruppera gruppen. Följ samma sex atomer till två H₂O och se att atomräknarna står kvar.');
    else lab.setExplanation(chosen?'Välj två H₂ och en O₂.':'Gissa hur många vattenmolekyler ni kan bilda.',chosen?'Tryck på molekylerna, dra dem till mitten eller använd Välj-knapparna. En gul ram visar vilka som ingår i gruppen.':'Välj er förutsägelse i listan. Bygg sedan en grupp i taget och jämför resultatet med er gissning.');lab.invalidate();
  }
  function choose(id){
    if(busy)return;
    const s=model.state,molecule=s.molecules.find(m=>m.id===id);
    if(prediction===''){feedback('Välj först er förutsägelse. Sedan kan ni välja molekyler.');lab.$('#reaction-prediction').focus();return;}
    if(!molecule||molecule.location!=='sample'||molecule.formula==='H₂O')return;
    const already=s.selectedIds.includes(id),full=molecule.formula==='H₂'?s.selectedH>=2:s.selectedO>=1;
    if(!already&&full){feedback(molecule.formula==='H₂'?'Två H₂ är redan valda. Den här gruppen behöver nu en O₂.':'En O₂ är redan vald. Gruppen behöver två H₂.');return;}
    transition(()=>model.select(id));feedback(model.state.canReact?'Precis rätt grupp! Tryck Omgruppera gruppen.':`Valt ${model.state.selectedH} H₂ och ${model.state.selectedO} O₂. Samla 2 H₂ och 1 O₂.`);
  }
  function add(formula){const s=model.state,molecule=s.molecules.find(m=>m.formula===formula&&m.location==='sample'&&!s.selectedIds.includes(m.id));if(molecule)choose(molecule.id);}
  function newAmounts(){model.setAmounts(Number(lab.$('#reaction-hydrogen').value),Number(lab.$('#reaction-oxygen').value));prediction='';mastered=false;lab.$('#reaction-prediction').value='';resetPositions();feedback('Nya startmängder. Gör en ny förutsägelse och bygg en grupp.');refresh();}
  lab.on('#reaction-hydrogen','input',newAmounts);lab.on('#reaction-oxygen','input',newAmounts);lab.on('#reaction-prediction','change',e=>{prediction=e.target.value;mastered=false;refresh();});
  lab.on($('add-h'),'click',()=>add('H₂'));lab.on($('add-o'),'click',()=>add('O₂'));lab.on($('clear'),'click',()=>{transition(()=>model.clearSelection());feedback('Gruppen är tömd. Välj molekyler igen.');});
  lab.on($('next'),'click',()=>{if(busy)return;transition(()=>{model.clearSelection();model.selectNext('H₂');model.selectNext('H₂');model.selectNext('O₂');});feedback('Nästa grupp innehåller samma förhållande: 2 H₂ och 1 O₂. Omgruppera den.');});
  lab.on($('react'),'click',()=>{
    if(busy)return;const s=model.state;
    if(prediction===''){feedback('Välj först hur många H₂O ni tror kan bildas.');lab.$('#reaction-prediction').focus();return;}
    if(!s.availableGroups){model.react();refresh();feedback('Det finns inte tillräckligt med H₂ och O₂ till en ny hel grupp. Förklara vad som saknas.');return;}
    if(!s.canReact){feedback(`Just nu har ni valt ${s.selectedH} H₂ och ${s.selectedO} O₂. Gruppen måste ha exakt 2 H₂ och 1 O₂.`);return;}
    transition(()=>model.reactSelection(),'react');feedback('Följ samma sex atomer. Fyra H och två O omgrupperas till två H₂O.');
  });
  lab.root.querySelectorAll('[name="reaction-system"]').forEach(input=>lab.on(input,'change',e=>{if(e.target.checked){model.setSystem(e.target.value);refresh();}}));
  lab.on($('release'),'click',()=>{if(busy)return;transition(()=>model.releaseGas(),'release');feedback('Följ gasen till omgivningen. Hela översiktens massa är oförändrad.');});
  lab.on($('follow'),'click',()=>{followed=!followed;refresh();});
  lab.on($('check-right'),'click',()=>{mastered=true;const s=model.state;feedback(`Rätt! ${s.hydrogen+s.oxygen} molekyler från början blev ${s.molecules.length}, men varje H-atom och O-atom finns kvar. Hela massan är ${s.totalMass}.`);lab.celebrate?.();refresh();});
  lab.on($('check-wrong'),'click',()=>feedback('Räkna molekylerna i en grupp: tre molekyler blir två. Räkna sedan atomerna: fyra H och två O finns på båda sidor.'));
  lab.on($('reset'),'click',()=>{model.reset();prediction='';mastered=false;lab.$('#reaction-prediction').value='';lab.root.querySelectorAll('[name="reaction-system"]').forEach(input=>{input.checked=input.value==='closed';});resetPositions();feedback('Samma startmängder igen. Prova en ny förutsägelse.');refresh();});
  function center(molecule){const atoms=molecule.atoms.map(a=>positions.get(a.id)).filter(Boolean);return atoms.length?{x:atoms.reduce((n,p)=>n+p.x,0)/atoms.length,y:atoms.reduce((n,p)=>n+p.y,0)/atoms.length}:null;}
  function hit(point){return model.state.molecules.filter(m=>m.location==='sample'&&m.formula!=='H₂O').find(m=>{const p=center(m);return p&&Math.hypot(point.x-p.x,point.y-p.y)<30;});}
  lab.on(lab.canvas,'pointerdown',e=>{if(busy)return;const p=lab.point(e),m=hit(p);if(!m)return;drag={id:e.pointerId,molecule:m.id,start:p,point:p,moved:false};lab.canvas.setPointerCapture?.(e.pointerId);if(e.cancelable)e.preventDefault();lab.invalidate();});
  lab.on(lab.canvas,'pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;drag.point=lab.point(e);if(Math.hypot(drag.point.x-drag.start.x,drag.point.y-drag.start.y)>10)drag.moved=true;if(e.cancelable)e.preventDefault();lab.invalidate();});
  function drop(e,cancelled=false){if(!drag||e.pointerId!==drag.id)return;const d=drag,p=lab.point(e);drag=null;if(lab.canvas.hasPointerCapture?.(e.pointerId))lab.canvas.releasePointerCapture(e.pointerId);if(cancelled){lab.invalidate();return;}const selected=model.state.selectedIds.includes(d.molecule),inside=p.x>283&&p.x<670&&p.y>80&&p.y<330;if(!d.moved||(!selected&&inside)||(selected&&!inside))choose(d.molecule);else{feedback('Släpp molekylen i mitten, i reaktionszonen.');lab.invalidate();}}
  lab.on(lab.canvas,'pointerup',e=>drop(e));lab.on(lab.canvas,'pointercancel',e=>drop(e,true));

  function text(ctx,value,x,y,size=24,color=C.ink){ctx.font=`600 ${compact?Math.max(27,size):size}px system-ui,sans-serif`;ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(value,x,y);}
  function bondLines(ctx,molecules,alpha){if(alpha<=0)return;ctx.save();ctx.globalAlpha=alpha;for(const m of molecules){let p=m.atoms.map(a=>positions.get(a.id));if(!p.every(Boolean))continue;if(drag?.molecule===m.id)p=p.map(a=>({...a,x:a.x+drag.point.x-drag.start.x,y:a.y+drag.point.y-drag.start.y}));if(m.formula==='H₂O'){drawBond(ctx,p[0],p[1]);drawBond(ctx,p[0],p[2]);}else drawBond(ctx,p[0],p[1],m.formula==='O₂'?2:1);}ctx.restore();}
  lab.setDraw(({ctx,dt,motion,compact:small})=>{
    compact=small;allowMotion=motion;const s=model.state;
    if(progress<1){progress=motion?Math.min(1,progress+dt/duration):1;if(progress===1&&busy){busy=false;if(kind==='react')lab.celebrate?.(809,195);refresh();}}
    const target=layout(s),t=smooth(progress),next=new Map();
    for(const[id,end]of target){const start=from.get(id)||end,move=Math.hypot(end.x-start.x,end.y-start.y),arc=kind==='react'&&movingIds.has(id)?Math.sin(Math.PI*t)*(38+Number(id.split('-')[1])%3*16):kind==='release'&&move>1?Math.sin(Math.PI*t)*26:0;next.set(id,{...end,x:lerp(start.x,end.x,t),y:lerp(start.y,end.y,t)-arc});}
    positions=next;
    roundRect(ctx,27,82,232,311,15,'#173c4c88','#608d9d');roundRect(ctx,284,82,383,246,20,s.canReact?'#28655555':'#173c4c44',s.canReact?C.teal:'#547b8b');roundRect(ctx,690,82,243,246,15,'#194b4855','#619d91');roundRect(ctx,284,355,649,79,12,'#203f5680','#628095');
    text(ctx,'VÄLJ MOLEKYLER',143,38,23,C.muted);text(ctx,'H₂',87,76,25,C.ink);text(ctx,'O₂',202,76,25,C.coral);text(ctx,s.canReact?'GRUPPEN ÄR REDO':'REAKTIONSZON',476,44,27,s.canReact?C.teal:C.ink);text(ctx,'H₂O I PROVET',812,44,24,C.teal);text(ctx,'OMGIVNING',608,349,22,C.muted);
    if(s.availableGroups||s.selectedIds.length){ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle=s.canReact?C.teal:'#8db1bd66';ctx.lineWidth=2;for(const slot of[{x:372,y:158,label:'H₂'},{x:575,y:158,label:'H₂'},{x:474,y:275,label:'O₂'}]){ctx.beginPath();ctx.arc(slot.x,slot.y,41,0,Math.PI*2);ctx.stroke();}ctx.restore();}
    if(!s.selectedIds.length&&!busy){text(ctx,s.complete&&prediction!==''?'Går en grupp till?':'2 H₂ + 1 O₂',476,178,31,C.gold);text(ctx,s.complete&&prediction!==''?'Vad saknas?':'Välj eller dra till mitten',476,221,25,C.muted);}
    if(kind==='react'&&progress<1&&motion){ctx.save();ctx.globalAlpha=.25;ctx.strokeStyle=C.teal;ctx.lineWidth=2;for(const id of movingIds){const a=from.get(id),b=target.get(id);if(!a||!b)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+b.x)/2,Math.min(a.y,b.y)-60,b.x,b.y);ctx.stroke();}ctx.restore();}
    if(progress<1&&kind==='react')bondLines(ctx,oldMolecules,Math.max(0,1-progress*3));bondLines(ctx,s.molecules,kind==='react'&&progress<1?Math.max(0,(progress-.5)*2):1);
    for(const m of s.molecules){
      const c=center(m);if(!c)continue;if(drag?.molecule===m.id){c.x+=drag.point.x-drag.start.x;c.y+=drag.point.y-drag.start.y;}const isSelected=s.selectedIds.includes(m.id);if(isSelected){ctx.save();ctx.strokeStyle=C.gold;ctx.lineWidth=3;ctx.setLineDash([5,4]);ctx.beginPath();ctx.ellipse(c.x,c.y,48,30,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
      for(const atom of m.atoms){const p=positions.get(atom.id);if(!p)continue;let x=p.x,y=p.y;if(drag?.molecule===m.id){x+=drag.point.x-drag.start.x;y+=drag.point.y-drag.start.y;}drawAtom(ctx,x,y,atom.element==='O'?15:11,atom.element,{selected:followed&&atom.id==='O-0',label:false});text(ctx,atom.element,x,y+7,20,atom.element==='H'?'#1b414d':'#fff');}
    }
    if(!s.surroundingsMass){text(ctx,s.system==='open'?'Följ en gasmolekyl ut efter grupperingen':'Öppna provet för att följa gas ut',608,405,23,C.muted);}
    text(ctx,`Provet ${s.sampleMass} + omgivningen ${s.surroundingsMass} = ${s.totalMass}`,480,451,25,C.gold);
  });
  resetPositions();refresh();return{setActive:value=>lab.setActive(value),destroy:()=>lab.destroy()};
}
