import { createLab, drawAtom, drawBond, escapeHTML } from './lab-kit.js';
import { createWorkspace, addAtom, bindAtoms, breakBond, removeAtom, moveComponent, components,
  describeWorkspace, bondDecision } from './lab-atoms-model.js';

export function mountLab(host) {
  let state = createWorkspace(), selected = [], drag = null, ghost = null, ignoreClickUntil = 0;
  const lab = createLab(host, {
    id: 'atoms', title: 'Molekylverkstaden', badge: 'BYGG · RÄKNA · FÖRKLARA',
    subtitle: 'Samma atomer kan bilda olika ämnen. Välj två atomer och skapa bindningen själv.',
    canvasLabel: 'Molekylverkstaden. Flytta atomer med dragning. Välj och bind med knapparna nedanför.',
    running: true,
    metrics: '<div class="cl-counter"><strong data-metric="atoms">3</strong><span>atomer totalt</span></div><div class="cl-counter"><strong data-metric="types">2</strong><span>atomslag</span></div><div class="cl-counter"><strong data-metric="molecules">0</strong><span>molekyler · bundna grupper</span></div><div class="cl-counter"><strong data-metric="formula">Byggfas</strong><span>verkstadens målformler</span></div>',
    controls: '<div class="cl-row"><div class="cl-field"><span>Lägg till en byggsten · dra eller tryck</span><div class="cl-buttons"><button type="button" class="cl-chip" data-add="H" draggable="true">H · väte</button><button type="button" class="cl-chip" data-add="O" draggable="true">O · syre</button></div></div><div class="cl-buttons"><button type="button" class="cl-primary" data-bind disabled>Bind valda</button><button type="button" data-break disabled>Bryt vald bindning</button><button type="button" data-remove disabled>Ta bort valda</button><button type="button" data-reset>Börja om</button></div></div><p class="cl-note" data-selection>Välj två atomer i bilden. Bindningar skapas aldrig av enbart närhet.</p>',
    below: '<div class="cl-grid"><div><strong>Vad innehåller provet?</strong><p data-sample>Byggfas: atomerna är ännu inte bundna.</p></div><div><strong>Det här räknas var för sig</strong><p>Atomer är alla kulor. Atomslag är olika bokstäver. Två eller flera bundna atomer räknas som en molekyl. H₂, O₂ och H₂O är just den här verkstadens tre mål.</p></div></div><details><summary>Välj atomer med knappar i stället för i bilden</summary><div class="cl-buttons" data-atom-list></div></details>',
    explanationTitle: 'Tre atomer är inte tre atomslag.',
    explanation: 'Här finns två H och ett O. Det är tre atomer men två atomslag. Bind en H till O, välj sedan den andra H och samma O.',
    questions: ['Bygg H₂O. Varför blir det tre atomer men två atomslag?', 'Bygg ännu en vattenmolekyl. Blir vatten en blandning bara för att molekylerna är flera?', 'Lägg till två O och bind dem. Varför är provet nu en blandning, men O₂ för sig ett grundämne?'],
    model: '<p>Verkstaden tränar tre utvalda mål: H₂, O₂ och H₂O. H får en bindning och O två; O₂ visas med en dubbelbindning. Alla bundna grupper med minst två atomer räknas som molekyler. En grupp som OH är därför redan en molekyl, men ännu inte någon av övningens tre målmolekyler. Andra grupper och ämnen, till exempel väteperoxid H₂O₂, finns i verkligheten men ingår inte i byggreglerna här. Byggfas betyder att vårt valda prov ännu inte är klart, inte att andra molekyler är omöjliga. Provet klassificeras när alla delar motsvarar övningens mål.</p><p>Kulor, färger, avstånd och bindningsstreck är modeller. Vatten visas böjt, med ungefär 104,5° H–O–H-vinkel. Dragning flyttar en hel bunden grupp; den tänjer inte på bindningarna. Att bryta en bindning här är ett redigeringsverktyg. I verkligheten behövs energi.</p><p>Källa: <a href="https://www.acs.org/content/dam/acsorg/msc/downloads/chapter-5/ch5-student-reading.pdf" target="_blank" rel="noopener">American Chemical Society: vattenmolekylen och kemiska bindningar</a>.</p>',
  });
  const atomById = id => state.atoms.find(a => a.id === id);
  function reset() {
    state = createWorkspace(); selected = [];
    addAtom(state, 'H', 330, 245); addAtom(state, 'O', 480, 205); addAtom(state, 'H', 630, 245);
    lab.setExplanation('Bygg en vattenmolekyl.', 'Välj O och en H. Tryck Bind valda. Bind sedan den andra H till samma O. Närhet ensam skapar ingen bindning.');
    sync();
  }
  function sync() {
    selected = selected.filter(id => atomById(id));
    const info = describeWorkspace(state);
    lab.setMetric('atoms', info.atomCount); lab.setMetric('types', info.atomTypes);
    lab.setMetric('molecules', info.moleculeCount); lab.setMetric('formula', info.formula);
    lab.$('[data-sample]').textContent = info.classification === 'Byggfas' ?
      `Byggfas: ${info.freeAtoms} lösa atomer. ${info.targetMoleculeCount} av ${info.moleculeCount} molekyler motsvarar målen H₂, O₂ eller H₂O. Övriga bundna grupper är byggsteg i just den här övningen, inte kemiskt omöjliga grupper.` :
      `${info.classification}. ${info.species.length === 1 ? 'Alla molekyler i provet har samma formel.' : 'Flera olika ämnen finns tillsammans utan att få en gemensam ny formel.'}`;
    const decision = selected.length === 2 ? bondDecision(state, ...selected) : null;
    lab.$('[data-bind]').disabled = !decision?.ok;
    lab.$('[data-bind]').textContent = decision?.ok && decision.order === 2 ? 'Bind O=O · dubbelbindning' : 'Bind valda';
    const hasBond = selected.length === 2 && state.bonds.some(b => selected.includes(b.a) && selected.includes(b.b));
    lab.$('[data-break]').disabled = !hasBond;
    lab.$('[data-remove]').disabled = !selected.length;
    lab.$('[data-selection]').textContent = !selected.length ? 'Välj två atomer. Bindningar skapas aldrig av enbart närhet.' :
      selected.length === 1 ? `${atomById(selected[0]).symbol} nummer ${selected[0]} är vald. Välj en atom till.` :
      hasBond ? 'De valda atomerna är redan bundna. Du kan bryta just den bindningen.' : decision.message;
    lab.$('[data-atom-list]').innerHTML = state.atoms.map(a => `<button type="button" data-choose="${a.id}" aria-pressed="${selected.includes(a.id)}">${escapeHTML(a.symbol)} · atom ${a.id}</button>`).join('');
    lab.invalidate();
  }
  function choose(id) {
    if (selected.includes(id)) selected = selected.filter(x => x !== id);
    else selected = selected.length < 2 ? [...selected, id] : [id];
    sync();
  }
  function arrange(id) {
    const group = components(state).find(g => g.some(a => a.id === id));
    if (!group || group.length < 2) return;
    const oxygen = group.find(a => a.symbol === 'O');
    if (oxygen && group.some(a => a.symbol === 'H')) {
      const hydrogens = group.filter(a => a.symbol === 'H').sort((a,b) => a.id - b.id);
      hydrogens.forEach((h,i) => { const angle = (i ? 52.25 : -52.25) * Math.PI / 180;
        h.x = oxygen.x + Math.sin(angle) * 96; h.y = oxygen.y + Math.cos(angle) * 96; });
    } else {
      const cx = group.reduce((n,a) => n+a.x,0)/2, cy = group.reduce((n,a) => n+a.y,0)/2;
      group[0].x = cx - 53; group[1].x = cx + 53; group[0].y = group[1].y = cy;
    }
    boundGroup(id);
  }
  function boundGroup(id) {
    const group = components(state).find(g => g.some(a => a.id === id)); if (!group) return;
    const xs = group.map(a=>a.x),ys = group.map(a=>a.y);
    const dx = Math.min(...xs)<65 ? 65-Math.min(...xs) : Math.max(...xs)>895 ? 895-Math.max(...xs) : 0;
    const dy = Math.min(...ys)<100 ? 100-Math.min(...ys) : Math.max(...ys)>345 ? 345-Math.max(...ys) : 0;
    moveComponent(state,id,dx,dy);
  }
  function add(symbol, point) {
    if (state.atoms.length >= 18) { lab.announce('Byggytan rymmer 18 atomer. Ta bort några eller börja om.'); return; }
    const index = state.atoms.length;
    const a = addAtom(state,symbol,point?.x ?? 130+(index%6)*135,point?.y ?? 130+Math.floor(index/6)*105);
    boundGroup(a.id);selected=[a.id];sync();
    lab.announce(`${symbol} nummer ${a.id} tillagd.`);
  }
  function bond() {
    if (selected.length !== 2) return;
    const result = bindAtoms(state,...selected);
    if (result.ok) arrange(selected[0]);
    const info=describeWorkspace(state);
    lab.setExplanation(result.ok ? 'Bindningen är skapad.' : 'Den bindningen fungerar inte här.',
      result.ok ? `${result.message} Nu finns ${info.moleculeCount} molekyler, varav ${info.targetMoleculeCount} motsvarar verkstadens tre mål. ${info.classification === 'Byggfas' ? 'Bygg vidare mot H₂, O₂ eller H₂O.' : info.classification + '.'}` : result.message);
    lab.announce(result.message);sync();
  }
  lab.on('[data-bind]','click',bond);
  lab.on('[data-break]','click',()=>{
    if(selected.length===2&&breakBond(state,...selected))lab.setExplanation('En bindning är borttagen.', 'Atomerna finns kvar. Provet kan nu innehålla lösa atomer eller andra bundna grupper. Även en OH-grupp räknas som en molekyl, men är inte något av övningens tre mål. I verkligheten krävs energi för att bryta en kemisk bindning.');sync();
  });
  lab.on('[data-remove]','click',()=>{selected.forEach(id=>removeAtom(state,id));selected=[];sync();});
  lab.on('[data-reset]','click',reset);
  lab.on('[data-atom-list]','click',e=>{const button=e.target.closest('[data-choose]');if(button)choose(Number(button.dataset.choose));});
  for (const button of lab.root.querySelectorAll('[data-add]')) {
    lab.on(button,'click',()=>{if(Date.now()>ignoreClickUntil)add(button.dataset.add);});
    lab.on(button,'dragstart',e=>{e.dataTransfer.setData('text/plain',button.dataset.add);e.dataTransfer.effectAllowed='copy';});
    lab.on(button,'pointerdown',e=>{
      if(e.pointerType!=='touch')return;
      button.setPointerCapture(e.pointerId);button._start={x:e.clientX,y:e.clientY,moved:false};
    });
    lab.on(button,'pointermove',e=>{
      const start=button._start;if(!start)return;
      if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>10)start.moved=true;
      if(!start.moved)return;
      if(!ghost){ghost=document.createElement('span');ghost.textContent=button.dataset.add;ghost.setAttribute('aria-hidden','true');ghost.style.cssText='position:fixed;z-index:99;pointer-events:none;border-radius:50%;background:#e8faf5;color:#183d46;padding:14px;font:700 24px sans-serif;box-shadow:0 8px 28px #0004';lab.root.append(ghost);}
      ghost.style.left=e.clientX-25+'px';ghost.style.top=e.clientY-25+'px';
    });
    lab.on(button,'pointerup',e=>{
      const start=button._start;button._start=null;ghost?.remove();ghost=null;
      if(start?.moved){ignoreClickUntil=Date.now()+350;const r=lab.canvas.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)add(button.dataset.add,lab.point(e));}
    });
    lab.on(button,'pointercancel',()=>{button._start=null;ghost?.remove();ghost=null;});
  }
  lab.on(lab.canvas,'dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';});
  lab.on(lab.canvas,'drop',e=>{e.preventDefault();const symbol=e.dataTransfer.getData('text/plain');if(symbol==='H'||symbol==='O')add(symbol,lab.point(e));});
  const hit = p => [...state.atoms].reverse().find(a => Math.hypot(a.x-p.x,a.y-p.y) < (a.symbol==='O'?38:32));
  lab.canvas.style.touchAction='none';
  lab.on(lab.canvas,'pointerdown',e=>{
    const point=lab.point(e),a=hit(point);if(!a){selected=[];sync();return;}
    drag={id:a.id,start:point,last:point,moved:false};lab.canvas.setPointerCapture(e.pointerId);
  });
  lab.on(lab.canvas,'pointermove',e=>{
    if(!drag)return;const point=lab.point(e);
    if(Math.hypot(point.x-drag.start.x,point.y-drag.start.y)>6)drag.moved=true;
    if(drag.moved){moveComponent(state,drag.id,point.x-drag.last.x,point.y-drag.last.y);boundGroup(drag.id);lab.invalidate();}
    drag.last=point;
  });
  lab.on(lab.canvas,'pointerup',e=>{if(drag&&!drag.moved)choose(drag.id);drag=null;if(lab.canvas.hasPointerCapture(e.pointerId))lab.canvas.releasePointerCapture(e.pointerId);});
  lab.on(lab.canvas,'pointercancel',()=>{drag=null;});
  lab.on(lab.canvas,'keydown',e=>{if(e.key.toLowerCase()==='b'){e.preventDefault();bond();}if(e.key==='Escape'){selected=[];sync();}});
  lab.setDraw(({ctx,time,compact})=>{
    const info=describeWorkspace(state);
    ctx.save();ctx.strokeStyle='#bde7e20c';ctx.lineWidth=1;
    for(let x=60;x<960;x+=60){ctx.beginPath();ctx.moveTo(x,80);ctx.lineTo(x,390);ctx.stroke();}
    for(let y=90;y<400;y+=60){ctx.beginPath();ctx.moveTo(45,y);ctx.lineTo(915,y);ctx.stroke();}
    ctx.fillStyle='#d9edf0';ctx.font=`500 ${compact?32:26}px Arial,sans-serif`;ctx.textAlign='left';
    ctx.fillText(selected.length===2?'Två valda · skapa bindningen med knappen':'Välj två atomer · bind dem själv',45,48);
    for(const b of state.bonds)drawBond(ctx,atomById(b.a),atomById(b.b),b.order);
    if(selected.length===2&&!state.bonds.some(b=>selected.includes(b.a)&&selected.includes(b.b))){
      const a=atomById(selected[0]),b=atomById(selected[1]);ctx.save();ctx.setLineDash([8,9]);ctx.strokeStyle='#ffd77e88';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();
    }
    for(const a of state.atoms){
      const active=selected.includes(a.id),radius=a.symbol==='O'?31:25;
      if(active){ctx.save();ctx.shadowColor='#ffd77e';ctx.shadowBlur=14+3*Math.sin(time*2);ctx.strokeStyle='#ffd77e';ctx.lineWidth=3;ctx.beginPath();ctx.arc(a.x,a.y,radius+8,0,Math.PI*2);ctx.stroke();ctx.restore();}
      drawAtom(ctx,a.x,a.y,radius,a.symbol,{label:false});ctx.fillStyle=a.symbol==='H'?'#244451':'#ffffff';ctx.font='700 28px Arial,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(a.symbol,a.x,a.y+1);
    }
    ctx.textBaseline='alphabetic';ctx.font=`600 ${compact?32:26}px Arial,sans-serif`;ctx.fillStyle='#9bdcd2';
    for(const group of info.groups.filter(g=>g.complete)){
      const x=group.atoms.reduce((n,a)=>n+a.x,0)/group.atoms.length,y=Math.max(...group.atoms.map(a=>a.y))+53;
      ctx.fillText(group.formula,x,y);
    }
    if(!state.atoms.length){ctx.fillStyle='#d9edf0';ctx.textAlign='center';ctx.fillText('Lägg till H och O med knapparna.',480,235);}
    ctx.fillStyle='#a5bfca';ctx.textAlign='left';ctx.font=`400 ${compact?30:26}px Arial,sans-serif`;
    ctx.fillText(compact?'Kulor = atomer. Bundna grupper = molekyler.':'Flytta en hel molekyl genom att dra i en av dess atomer.',45,438);ctx.restore();
  });
  reset();
  return { setActive(value){lab.setActive(value);},destroy(){ghost?.remove();ghost=null;drag=null;lab.destroy();} };
}
