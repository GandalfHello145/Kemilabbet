import { createLab, drawAtom, drawBond, escapeHTML } from './lab-kit.js?v=20261110-labs2';
import { createWorkspace, addAtom, bindAtoms, breakBond, removeAtom, moveComponent, components,
  describeWorkspace, bondDecision, snapCandidate, missionComplete } from './lab-atoms-model.js?v=20261110-labs2';

export function mountLab(host) {
  let state=createWorkspace(),selected=[],mission=0,drag=null,preview=null,ghost=null,ignoreClickUntil=0;
  let visualTime=0;
  const displayed=new Map(),effects=[],celebrated=new Set();
  const titles=['Bygg en vattenmolekyl','Fler molekyler · samma ämne','Skapa en blandning'];
  const lab=createLab(host,{
    id:'atoms',title:'Molekylverkstaden',badge:'DRA → BIND → UPPTÄCK',
    subtitle:'Dra en atom mot en annan. När förbindelsen lyser: släpp och se molekylen ta form.',
    objective:'Dra en H till O. Släpp när bindningen lyser.',
    steps:[{title:'Bygg vatten',text:'Bind två H till en O.'},{title:'Bygg en till',text:'Fler molekyler behöver inte betyda fler ämnen.'},{title:'Blanda ämnen',text:'Lägg till O₂ och jämför.'}],
    tools:'Dra för att flytta eller binda. Knapparna fungerar också.',hideRun:true,running:true,
    canvasLabel:'Dra H till O och släpp på den lysande bindningen. Alternativ: välj två atomknappar och tryck Bind valda.',
    metrics:'<div class="cl-counter"><strong data-metric="atoms">3</strong><span>atomer</span></div><div class="cl-counter"><strong data-metric="types">2</strong><span>atomslag</span></div><div class="cl-counter"><strong data-metric="molecules">0</strong><span>molekyler · bundna grupper</span></div><div class="cl-counter"><strong data-metric="formula">H₂O är målet</strong><span>målformler i provet</span></div>',
    controls:'<p class="cl-task-hint" data-task-hint>Dra H till O. Släpp när förbindelsen lyser.</p><button type="button" class="cl-primary" data-next disabled>Nästa: bygg en till</button><div class="cl-field"><span>Lägg till en atom · dra eller tryck</span><div class="cl-buttons"><button type="button" class="cl-secondary" data-add="H" draggable="true">＋ H · väte</button><button type="button" class="cl-secondary" data-add="O" draggable="true">＋ O · syre</button></div></div><details><summary>Bygg med knappar i stället för dragning</summary><p class="cl-note">Välj två atomer nedan och skapa bindningen.</p><div class="cl-buttons" data-atom-list></div><button type="button" class="cl-secondary" data-bind disabled>Bind de två valda</button></details><details><summary>Ändra provet</summary><div class="cl-buttons"><button type="button" data-undo>Ångra senaste bindningen</button><button type="button" data-break disabled>Bryt mellan de två valda</button><button type="button" data-remove disabled>Ta bort valda atomer</button></div></details><button type="button" data-reset>Börja om upptäckten</button>',
    below:'<div class="cl-grid"><div><strong data-sample-title>Vad räknar vi?</strong><p data-sample>Tre atomer, två atomslag. Inga bindningar ännu.</p></div><div><strong>Följ bindningen</strong><p>När en atom binder ändras gruppen, men ingen atom försvinner. Dra sedan i en atom: hela molekylen följer med.</p></div></div>',
    explanationTitle:titles[0],explanation:'Dra en H nära O. Förhandsvisningen visar om de kan bindas. Släpp för att skapa bindningen.',
    questions:['Vad ändras efter första respektive andra H–O-bindningen?', 'Varför är två vattenmolekyler fortfarande ett rent ämne?', 'När du lägger till O₂: ändras antalet atomslag eller antalet ämnen?'],
    model:'<p>Verkstaden tränar tre mål: H₂, O₂ och H₂O. H får en bindning och O två; O₂ visas med en dubbelbindning. Alla bundna grupper med minst två atomer räknas som molekyler. OH räknas därför redan som en molekyl, men är ännu inte H₂O. Andra ämnen, till exempel H₂O₂, finns men ingår inte i byggreglerna här.</p><p>Att dra och släppa är ett sätt att redigera bindningarna, inte en beskrivning av hur en kemisk reaktion sätts igång. Bindningar skapas inte i verkligheten bara för att någon flyttar en kula. Vatten visas böjt med ungefär 104,5° H–O–H-vinkel. Färger och avstånd är hjälpmedel. Att bryta en bindning kräver energi i verkligheten.</p><p>Källa: <a href="https://www.acs.org/content/dam/acsorg/msc/downloads/chapter-5/ch5-student-reading.pdf" target="_blank" rel="noopener">American Chemical Society: vattenmolekylen och kemiska bindningar</a>.</p>',
  });
  const atom=id=>state.atoms.find(a=>a.id===id);
  const view=a=>displayed.get(a.id)||a;
  function add(symbol,x,y){const a=addAtom(state,symbol,x,y);displayed.set(a.id,{x,y});return a;}
  function groupFor(id){return components(state).find(g=>g.some(a=>a.id===id))||[];}
  function boundGroup(id){
    const g=groupFor(id);if(!g.length)return;
    const xs=g.map(a=>a.x),ys=g.map(a=>a.y);
    const dx=Math.min(...xs)<65?65-Math.min(...xs):Math.max(...xs)>895?895-Math.max(...xs):0;
    const dy=Math.min(...ys)<100?100-Math.min(...ys):Math.max(...ys)>335?335-Math.max(...ys):0;
    moveComponent(state,id,dx,dy);
  }
  function arrange(id){
    const g=groupFor(id),o=g.find(a=>a.symbol==='O');
    if(o&&g.some(a=>a.symbol==='H')){
      g.filter(a=>a.symbol==='H').sort((a,b)=>a.id-b.id).forEach((h,i)=>{const angle=(i?52.25:-52.25)*Math.PI/180;h.x=o.x+Math.sin(angle)*96;h.y=o.y+Math.cos(angle)*96;});
    }else if(g.length===2){const x=(g[0].x+g[1].x)/2,y=(g[0].y+g[1].y)/2;g[0].x=x-53;g[1].x=x+53;g[0].y=g[1].y=y;}
    boundGroup(id);
  }
  function nextAction(info,done){
    if(mission===3)return ['Bygg ett eget prov.','Skapa H₂, O₂ och H₂O. Läs hur antalet molekyler och provets ämnen ändras.'];
    if(done)return mission===0?['Vattenmolekylen är klar!','3 atomer · 2 atomslag · 1 molekyl. Två H sitter ihop med en O. Gå vidare och bygg en till.']:
      mission===1?['Två molekyler, fortfarande vatten.','Nu har du 6 atomer och 2 molekyler, men fortfarande bara 2 atomslag och ett rent ämne. Gå vidare och lägg till syrgas.']:
      ['Du har skapat en blandning.','H₂O och O₂ finns tillsammans. Antalet ämnen har ökat till två, medan atomslagen fortfarande är H och O.'];
    if(mission===2)return ['Bind de två nya O till varandra.','Dra en O mot den andra och släpp på den lysande dubbelbindningen. Nu undersöker vi vad ett nytt ämne gör med provet.'];
    const oh=info.groups.some(g=>!g.complete&&g.atoms.some(a=>a.symbol==='O')&&g.atoms.some(a=>a.symbol==='H'));
    return [mission===1?'Bygg en vattenmolekyl till.':titles[0],oh?'En H är redan bunden till O. Dra den andra H till samma O: syreatomen har plats för en bindning till.':'Dra en H mot O. När förbindelsen lyser kan du släppa. Bind sedan den andra H till samma O.'];
  }
  function sync(){
    selected=selected.filter(id=>atom(id));const info=describeWorkspace(state),done=missionComplete(state,mission);
    lab.setMetric('atoms',info.atomCount);lab.setMetric('types',info.atomTypes);lab.setMetric('molecules',info.moleculeCount);
    lab.setMetric('formula',info.targetMoleculeCount?info.formula:'H₂O är målet');
    lab.$('[data-sample-title]').textContent=info.classification==='Byggfas'?'Provet byggs just nu':info.classification;
    lab.$('[data-sample]').textContent=info.classification==='Byggfas'?`${info.freeAtoms} ${info.freeAtoms===1?'lös atom':'lösa atomer'} och ${info.moleculeCount} ${info.moleculeCount===1?'molekyl':'molekyler'}. ${info.targetMoleculeCount} ${info.targetMoleculeCount===1?'molekyl motsvarar':'molekyler motsvarar'} övningens mål H₂, O₂ eller H₂O. Även andra bundna grupper räknas som molekyler.`:
      `${info.formula}. ${info.species.length===1?'Alla molekyler i provet har samma formel.':'Två olika ämnen finns tillsammans; de får ingen gemensam ny molekylformel.'}`;
    const [title,text]=nextAction(info,done);lab.setExplanation(title,text);lab.setObjective?.(done?title:mission===2?'Bind de två O till en syrgasmolekyl.':mission===1?'Bind två H till den nya O.':'Dra en H till O. Släpp när bindningen lyser.',done);
    lab.setStep?.(Math.min(mission,2));lab.$('[data-task-hint]').textContent=done?'Läs upptäckten ovanför bilden och gå vidare.':'Dra i bilden. Grönt ljus visar var du kan släppa.';
    const next=lab.$('[data-next]');next.hidden=mission===3;next.disabled=!done;
    next.textContent=['Nästa: bygg en till','Nästa: gör en blandning','Fortsätt bygga fritt'][mission]||'Fortsätt';
    const decision=selected.length===2?bondDecision(state,...selected):null;
    lab.$('[data-bind]').disabled=!decision?.ok;lab.$('[data-bind]').textContent=decision?.ok&&decision.order===2?'Bind O=O · två streck':'Bind de två valda';
    lab.$('[data-break]').disabled=!(selected.length===2&&state.bonds.some(b=>selected.includes(b.a)&&selected.includes(b.b)));
    lab.$('[data-remove]').disabled=!selected.length;lab.$('[data-undo]').disabled=!state.bonds.length;
    lab.$('[data-atom-list]').innerHTML=state.atoms.map(a=>`<button type="button" data-choose="${a.id}" aria-pressed="${selected.includes(a.id)}">${escapeHTML(a.symbol)} · ${a.id}</button>`).join('');
    if(done&&!celebrated.has(mission)){celebrated.add(mission);lab.celebrate?.();lab.announce(title+' '+text);}
    lab.invalidate();
  }
  function commit(a,b){
    const decision=bindAtoms(state,a,b);if(!decision.ok){lab.announce(decision.message);return;}
    arrange(a);selected=[];effects.push({a,b,age:0});preview=null;sync();
    lab.announce(decision.order===2?'Två O har bundits med en dubbelbindning.':`${atom(a).symbol} och ${atom(b).symbol} är nu bundna.`);
  }
  function reset(){
    state=createWorkspace();selected=[];mission=0;drag=null;preview=null;displayed.clear();effects.length=0;celebrated.clear();
    add('O',480,185);add('H',260,270);add('H',700,270);sync();
  }
  function choose(id){selected=selected.includes(id)?selected.filter(x=>x!==id):selected.length<2?[...selected,id]:[id];sync();}
  function addLoose(symbol,point){
    if(state.atoms.length>=18){lab.announce('Ta bort några atomer eller börja om innan du lägger till fler.');return;}
    const n=state.atoms.length,a=add(symbol,point?.x??150+(n%6)*130,point?.y??110+Math.floor(n/6)*85);boundGroup(a.id);selected=[a.id];sync();
  }
  lab.on('[data-next]','click',()=>{
    if(!missionComplete(state,mission))return;mission++;
    if(mission===1){const g=components(state).find(g=>g.length===3&&g.some(a=>a.symbol==='O'));if(g){const o=g.find(a=>a.symbol==='O');moveComponent(state,o.id,250-o.x,195-o.y);}add('O',710,195);add('H',565,305);add('H',855,305);}
    if(mission===2){add('O',410,110);add('O',570,110);}
    selected=[];sync();
  });
  lab.on('[data-bind]','click',()=>{if(selected.length===2)commit(...selected);});
  lab.on('[data-undo]','click',()=>{state.bonds.pop();selected=[];sync();});
  lab.on('[data-break]','click',()=>{if(selected.length===2)breakBond(state,...selected);sync();});
  lab.on('[data-remove]','click',()=>{selected.forEach(id=>{removeAtom(state,id);displayed.delete(id);});selected=[];sync();});
  lab.on('[data-reset]','click',reset);
  lab.on('[data-atom-list]','click',e=>{const b=e.target.closest('[data-choose]');if(b)choose(Number(b.dataset.choose));});
  for(const button of lab.root.querySelectorAll('[data-add]')){
    lab.on(button,'click',()=>{if(Date.now()>ignoreClickUntil)addLoose(button.dataset.add);});
    lab.on(button,'dragstart',e=>{e.dataTransfer.setData('text/plain',button.dataset.add);e.dataTransfer.effectAllowed='copy';});
    lab.on(button,'pointerdown',e=>{if(e.pointerType!=='touch')return;button.setPointerCapture(e.pointerId);button._start={x:e.clientX,y:e.clientY,moved:false};});
    lab.on(button,'pointermove',e=>{const start=button._start;if(!start)return;if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>10)start.moved=true;if(!start.moved)return;
      if(!ghost){ghost=document.createElement('span');ghost.textContent=button.dataset.add;ghost.setAttribute('aria-hidden','true');ghost.style.cssText='position:fixed;z-index:99;pointer-events:none;border-radius:50%;background:#e8faf5;color:#183d46;padding:14px;font:700 24px sans-serif;box-shadow:0 8px 28px #0004';lab.root.append(ghost);}ghost.style.left=e.clientX-25+'px';ghost.style.top=e.clientY-25+'px';});
    lab.on(button,'pointerup',e=>{const start=button._start;button._start=null;ghost?.remove();ghost=null;if(start?.moved){ignoreClickUntil=Date.now()+350;const r=lab.canvas.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)addLoose(button.dataset.add,lab.point(e));}});
    lab.on(button,'pointercancel',()=>{button._start=null;ghost?.remove();ghost=null;});
  }
  lab.on(lab.canvas,'dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';});
  lab.on(lab.canvas,'drop',e=>{e.preventDefault();const s=e.dataTransfer.getData('text/plain');if(s==='H'||s==='O')addLoose(s,lab.point(e));});
  const hit=p=>[...state.atoms].reverse().find(a=>Math.hypot(view(a).x-p.x,view(a).y-p.y)<(a.symbol==='O'?45:39));
  lab.canvas.style.touchAction='none';
  lab.on(lab.canvas,'pointerdown',e=>{
    const p=lab.point(e),a=hit(p);if(!a){selected=[];sync();return;}
    for(const member of groupFor(a.id)){const v=view(member);member.x=v.x;member.y=v.y;}
    drag={id:a.id,start:p,last:p,moved:false,before:[...selected]};selected=[a.id];lab.canvas.setPointerCapture(e.pointerId);lab.invalidate();
  });
  lab.on(lab.canvas,'pointermove',e=>{
    if(!drag)return;const p=lab.point(e);if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)>6)drag.moved=true;
    if(drag.moved){moveComponent(state,drag.id,p.x-drag.last.x,p.y-drag.last.y);boundGroup(drag.id);for(const a of groupFor(drag.id))displayed.set(a.id,{x:a.x,y:a.y});
      preview=snapCandidate(state,drag.id);
      if(preview){const a=atom(preview.a),b=atom(preview.b);lab.setExplanation(`Släpp för att binda ${a.symbol}–${b.symbol}.`,preview.order===2?'Två streck visar O₂:s dubbelbindning. Släpp nu för att skapa den.':'Den lysande förbindelsen visar en möjlig bindning. Släpp nu; atomernas antal kommer att vara oförändrat.');lab.setObjective?.('Släpp nu för att skapa den lysande bindningen.');}
      else{lab.setExplanation('Flytta närmare en ledig atom.','Förbindelsen lyser när en tillåten bindning kan skapas. En redan fullbunden atom får inga extra bindningar i verkstaden.');}
    }drag.last=p;lab.invalidate();
  });
  lab.on(lab.canvas,'pointerup',e=>{
    if(drag){const candidate=drag.moved?snapCandidate(state,drag.id):null;if(candidate)commit(candidate.a,candidate.b);else if(!drag.moved){selected=drag.before;choose(drag.id);}else sync();}
    drag=null;preview=null;if(lab.canvas.hasPointerCapture(e.pointerId))lab.canvas.releasePointerCapture(e.pointerId);lab.invalidate();
  });
  lab.on(lab.canvas,'pointercancel',()=>{drag=null;preview=null;sync();});
  lab.on(lab.canvas,'keydown',e=>{if(e.key.toLowerCase()==='b'&&selected.length===2){e.preventDefault();commit(...selected);}if(e.key==='Escape'){selected=[];sync();}});
  lab.setDraw(({ctx,dt,motion,compact})=>{
    if(motion)visualTime+=dt;
    for(const a of state.atoms){const v=displayed.get(a.id)||{x:a.x,y:a.y};const ease=motion?1-Math.exp(-dt*13):1;v.x+=(a.x-v.x)*ease;v.y+=(a.y-v.y)*ease;displayed.set(a.id,v);}
    ctx.save();ctx.strokeStyle='#bde7e20c';ctx.lineWidth=1;
    for(let x=60;x<960;x+=60){ctx.beginPath();ctx.moveTo(x,80);ctx.lineTo(x,395);ctx.stroke();}
    for(let y=95;y<400;y+=60){ctx.beginPath();ctx.moveTo(45,y);ctx.lineTo(915,y);ctx.stroke();}
    ctx.font=`600 ${compact?32:28}px Arial,sans-serif`;ctx.fillStyle='#d9edf0';ctx.textAlign='left';ctx.fillText(mission<3?`${mission+1}. ${titles[mission]}`:'Bygg ett eget prov',42,48);
    for(const b of state.bonds)drawBond(ctx,view(atom(b.a)),view(atom(b.b)),b.order);
    if(preview){
      const a=view(atom(preview.a)),b=view(atom(preview.b));ctx.save();ctx.shadowColor='#8af0d7';ctx.shadowBlur=18;ctx.setLineDash([12,7]);drawBond(ctx,a,b,preview.order,'#8af0d7');ctx.restore();
      ctx.strokeStyle='#8af0d7';ctx.lineWidth=4;ctx.beginPath();ctx.arc(b.x,b.y,44+3*Math.sin(visualTime*4),0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#c7fff0';ctx.textAlign='center';ctx.font=`600 ${compact?32:27}px Arial,sans-serif`;ctx.fillText('SLÄPP FÖR ATT BINDA',(a.x+b.x)/2,Math.max(88,Math.min(a.y,b.y)-48));
    }
    for(const effect of effects){effect.age+=motion?dt:1;if(effect.age>.75)continue;const a=atom(effect.a),b=atom(effect.b);if(!a||!b)continue;const va=view(a),vb=view(b),p=effect.age/.75;
      ctx.save();ctx.globalAlpha=(1-p)*.85;ctx.strokeStyle='#b5ffdf';ctx.lineWidth=5*(1-p)+1;ctx.beginPath();ctx.arc((va.x+vb.x)/2,(va.y+vb.y)/2,20+p*105,0,Math.PI*2);ctx.stroke();ctx.restore();}
    while(effects.length&&effects[0].age>.75)effects.shift();
    for(const a of state.atoms){const v=view(a),r=a.symbol==='O'?34:28;drawAtom(ctx,v.x,v.y,r,a.symbol,{selected:selected.includes(a.id),label:false});ctx.fillStyle=a.symbol==='H'?'#244451':'#fff';ctx.font='700 30px Arial,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(a.symbol,v.x,v.y+1);}
    ctx.textBaseline='alphabetic';ctx.font=`600 ${compact?32:28}px Arial,sans-serif`;ctx.fillStyle='#9bdcd2';
    for(const g of describeWorkspace(state).groups.filter(g=>g.complete)){const points=g.atoms.map(view);ctx.fillText(g.formula,points.reduce((n,a)=>n+a.x,0)/points.length,Math.max(...points.map(a=>a.y))+54);}
    ctx.fillStyle='#aec9d2';ctx.textAlign='left';ctx.font=`400 ${compact?30:26}px Arial,sans-serif`;ctx.fillText(preview?'Den lysande bindningen skapas när du släpper.':'Dra ihop → släpp på ljuset → följ hela molekylen.',42,438);ctx.restore();
  });
  reset();
  return {setActive(value){lab.setActive(value);},destroy(){ghost?.remove();ghost=null;drag=null;preview=null;lab.destroy();}};
}
