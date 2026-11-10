import { createLab, formatNumber, roundRect } from './lab-kit.js?v=20261110-labs2';
import { ATOM_RADIUS, createExperiment, advanceExperiment, forceAt, traceTrajectory,
  probeSummary, controlledCloserComparison } from './lab-models-model.js?v=20261110-labs2';

export function mountLab(host) {
  const DEFAULT_SEED=20261111,colors={rutherford:'#ffd77e',thomson:'#6fe2d4'};
  let seed=DEFAULT_SEED,charge=40,impact=1.2,view='both',mission=0,reference=null;
  let experiment=createExperiment({count:0}),prediction={},dragging=false,finished=false,metricClock=0,focusId=0;
  let seenProbe=null,visualTime=0,pauseState=false;
  const lab=createLab(host,{
    id:'models',title:'Atomdetektiven',badge:'SIKTA → FÖLJ → JÄMFÖR',
    subtitle:'Dra det gula handtaget och följ samma partikel i två olika atommodeller.',
    steps:[{title:'Passera på avstånd',text:'Följ en partikel förbi mitten.'},{title:'Sikta närmare',text:'Ändra avståndet, behåll laddningen.'},{title:'Pröva många',text:'Jämför 80 partiklars riktningar.'}],
    objective:'Skicka en testpartikel förbi mitten.',hideRun:true,running:false,
    tools:'Dra det gula handtaget. Släpp för att skicka en ny testpartikel.',
    canvasLabel:'Två överlagrade partikelbanor. Guld visar Rutherford, turkos Thomson. Dra det gula handtaget uppåt eller nedåt; samma läge kan väljas med reglaget.',
    metrics:'<div class="cl-counter"><strong data-metric="distance">1,2</strong><span>avstånd från mitten</span></div><div class="cl-counter"><strong data-metric="r-angle">—</strong><span>Rutherfords avböjning</span></div><div class="cl-counter"><strong data-metric="t-angle">—</strong><span>Thomsons avböjning</span></div><div class="cl-counter"><strong data-metric="back">0</strong><span>Rutherford · tillbaka över 90°</span></div>',
    controls:'<p class="cl-task-hint" data-hint>Skicka första partikeln. Följ guld och turkos från samma start.</p><button type="button" class="cl-primary" data-task>1. Testa på avstånd</button><button type="button" class="cl-secondary" data-probe>Skicka från mitt strålläge</button><button type="button" data-pause hidden>Pausa partiklarna</button><label class="cl-field">Rikta strålen · 0 är mitten <output data-impact-out>+1,2</output><input data-impact type="range" min="-2" max="2" step="0.05" value="1.2"></label><label class="cl-field">Positiv laddning <output data-charge-out>+40</output><input data-charge type="range" min="20" max="80" step="10" value="40"></label><div class="cl-field"><span>Välj vilka banor du vill följa</span><div class="cl-buttons"><button type="button" class="cl-secondary" data-view="both" aria-pressed="true">Jämför båda</button><button type="button" class="cl-secondary" data-view="rutherford" aria-pressed="false">Bara guld</button><button type="button" class="cl-secondary" data-view="thomson" aria-pressed="false">Bara turkos</button></div></div><details><summary>Gör egna försök</summary><div class="cl-buttons"><button type="button" data-many>Skicka 80 från mitt strålläge</button><button type="button" data-seed>Välj nya startlägen</button></div><p class="cl-note">Försöksnummer <output data-seed-out>20261111</output>. Samma nummer och inställningar ger samma stråle.</p></details><button type="button" data-reset>Börja om upptäckten</button>',
    below:'<div class="cl-grid"><div><strong>Färgerna följer förklaringarna</strong><p>Guldspåret visar laddning samlad i en liten kärna. Det turkosa visar samma positiva laddning utspridd i en sfär. De läggs ovanpå varandra för jämförelse och visar två alternativ.</p></div><div><strong>Vad upptäckte du?</strong><p data-discovery>På vilket avstånd börjar de två banorna skilja sig tydligt?</p></div></div><div style="overflow-x:auto"><table class="cl-table"><caption data-caption>Riktningar räknas när ett försök har startats.</caption><thead><tr><th scope="col">Modell</th><th scope="col">0–5°</th><th scope="col">5–20°</th><th scope="col">20–90°</th><th scope="col">90–180°</th></tr></thead><tbody><tr><th scope="row">Thomson · turkos</th><td data-bin="thomson-0">0</td><td data-bin="thomson-1">0</td><td data-bin="thomson-2">0</td><td data-bin="thomson-3">0</td></tr><tr><th scope="row">Rutherford · guld</th><td data-bin="rutherford-0">0</td><td data-bin="rutherford-1">0</td><td data-bin="rutherford-2">0</td><td data-bin="rutherford-3">0</td></tr></tbody></table></div><details><summary>Solsystemsliknelsen · vad hjälper den oss med?</summary><p>Kärnan motsvarar solen och elektronerna planeterna i den historiska liknelsen. Men planeter hålls av gravitation, medan elektriska krafter verkar i atomen. Dagens atommodell beskriver inte elektroner som små planeter i kända banor.</p></details>',
    explanationTitle:'Samma start, två olika förklaringar.',
    explanation:'Den gula banan går kring en koncentrerad positiv laddning. Den turkosa går genom en utspridd laddning. Skicka en partikel och följ var banorna börjar skilja sig.',
    questions:['Behåll laddningen men sikta närmare mitten. Vilken bana ändras mest?', 'Varför ger en liten laddningstät kärna större avböjningar nära mitten?', 'När 80 partiklar skickas: betyder några stora avböjningar att alla partiklar vänder tillbaka?'],
    model:'<p>Vi jämför den positiva laddningen som en jämnt laddad sfär (Thomson) eller en koncentrerad punkt (Rutherford). Utanför sfären ger lika stora laddningar samma kraft. Inuti sfären är kraften svagare nära mitten. Nära punktladdningen är den mycket starkare. De två alternativen överlagras ibland i bilden för jämförelse; de är inte en kombinerad atom.</p><p>Banorna beräknas från repulsiv elektrisk kraft med små tidssteg. Ingen hård yta vänder partikeln. Positiva laddningar stöter bort varandra. Kärnan och atomregionen visas förstorade. Laddning, massa, tid och avstånd använder anpassade modellenheter. Elektronernas detaljfält, flera atomlager och energiförluster förenklas bort. Negativa elektroner i Thomsonbilden visar modellens idé; deras enskilda krafter räknas inte här.</p><p>Testpartikeln visas långsammare nära mitten så att kraftverkan går att följa. Den bakomliggande kraftlagen ändras inte. Histogrammet innehåller beräknade modellutfall, inte historiska mätdata. Förhandsbanorna räknas inte som resultat. Försöksnumret bestämmer de slumpade avstånden och är gemensamt för båda modellerna.</p><p>Primärkälla: <a href="https://web.mit.edu/8.13/8.13c/references-fall/rutherford/rutherford-scattering-of-alpha-and-beta-particles.pdf" target="_blank" rel="noopener">Rutherford (1911), The scattering of α and β particles by matter and the structure of the atom</a>. <a href="https://history.aip.org/exhibits/rutherford/sections/alpha-particles-atom.html" target="_blank" rel="noopener">American Institute of Physics: kärnans upptäckt</a>.</p>',
  });
  const sx=x=>410+x*32,sy=y=>183-y*32;
  const show=model=>view==='both'||view===model;
  function predictions(){for(const model of ['thomson','rutherford'])prediction[model]=traceTrajectory({model,charge,impact});}
  function controls(){
    lab.$('[data-impact]').value=impact;lab.$('[data-impact-out]').textContent=(impact>=0?'+':'')+formatNumber(impact,2);
    lab.$('[data-charge]').value=charge;lab.$('[data-charge-out]').textContent='+'+charge;lab.$('[data-seed-out]').textContent=seed;
    lab.setMetric('distance',formatNumber(Math.abs(impact),2));
  }
  function guide(){
    lab.setStep?.(Math.min(mission,2));
    const prompts=['Skicka en partikel förbi mitten.','Sikta närmare mitten med samma laddning.','Skicka 80 och jämför riktningarna.','Du har följt hur en liten kärna påverkar strålen.'];
    lab.setObjective?.(prompts[mission],mission===3);
    lab.$('[data-task]').textContent=['1. Testa på avstånd','2. Testa nära kärnan','3. Skicka 80 och jämför','Upprepa samma 80'][mission];
    lab.$('[data-hint]').textContent=['Följ guld och turkos från samma start.','Dra handtaget mot mitten. Släpp för nästa test.','Nu prövar vi många startlägen med samma laddning.','Ändra ett reglage och undersök vidare.'][mission];
  }
  function metrics(){
    const report=probeSummary(experiment);
    lab.setMetric('r-angle',report?formatNumber(report.rutherford,1)+'°':'—');lab.setMetric('t-angle',report?formatNumber(report.thomson,1)+'°':'—');
    lab.setMetric('back',experiment.models.rutherford.bins[3]);
    for(const model of ['thomson','rutherford'])experiment.models[model].bins.forEach((n,i)=>lab.$(`[data-bin="${model}-${i}"]`).textContent=n);
    lab.$('[data-caption]').textContent=experiment.count?`${experiment.count} partiklar per modell · ${experiment.models.rutherford.completed} guldbanor och ${experiment.models.thomson.completed} turkosa banor klara`:'Inga mätresultat ännu. De streckade banorna visar vad inställningen ger.';
    lab.$('[data-pause]').hidden=!experiment.count||finished;
    lab.$('[data-pause]').textContent=lab.running?'Pausa partiklarna':'Fortsätt partiklarna';
  }
  function configure({start=false}={}){
    impact=Number(lab.$('[data-impact]').value);charge=Number(lab.$('[data-charge]').value);
    lab.setRunning(false);experiment=createExperiment({count:0});finished=false;seenProbe=null;controls();predictions();metrics();
    lab.setExplanation('Följ hur banorna ändras.', 'Det gula handtaget bestämmer strålens läge. Släpp handtaget eller reglaget för att skicka en partikel med just den inställningen.');
    lab.invalidate();if(start)fire(1);
  }
  function fire(count){
    experiment=createExperiment({seed,charge,impact,count,spread:count===1?0:1.65});finished=false;seenProbe=null;metricClock=0;
    focusId=experiment.impacts.reduce((best,b,i)=>Math.abs(b)<Math.abs(experiment.impacts[best])?i:best,0);
    lab.setRunning(true);metrics();
    lab.setExplanation(count===1?'Följ de två prickarna.':'Samma 80 startlägen i båda modellerna.',count===1?
      'Prickarna startar tillsammans. Nära mitten visas rörelsen långsammare. Pilen visar elektrisk kraft, spåret visar partikelns väg.':
      'Varje inkommande partikel får samma start i båda modellerna. Följ banorna och se vilka riktningar som räknas upp.');
    lab.announce(count===1?'En testpartikel skickad i båda modellerna.':'80 partiklar skickas per modell.');
  }
  function finishDiscovery(){
    const report=probeSummary(experiment);
    if(report){
      if(mission===0&&Math.abs(report.impact)>=.8){reference=report;mission=1;lab.celebrate?.(410,180);}
      else if(mission===1&&controlledCloserComparison(reference,report)){mission=2;lab.celebrate?.(410,180);}
      const compare=reference&&controlledCloserComparison(reference,report);
      const text=`Guld: ${formatNumber(report.rutherford,1)}°. Turkos: ${formatNumber(report.thomson,1)}°. ${compare?'Närmare mitten gav större avböjning med samma laddning.':Math.abs(report.impact)<.8?'Nära mitten märks skillnaden mellan utspridd och koncentrerad laddning.':'På avstånd blir avböjningen liten. Nu kan du pröva närmare mitten.'}`;
      lab.setExplanation(compare?'Du ändrade avståndet – banan ändrades.':'Läs av de båda banorna.',text);lab.$('[data-discovery]').textContent=text;
      if(mission===1&&reference&&report.charge!==reference.charge)lab.setExplanation('Behåll laddningen för en rättvis jämförelse.','Du ändrade både laddning och läge. Nästa uppdragsknapp behåller den tidigare laddningen och provar bara ett kortare avstånd.');
    }else if(experiment.count===80){
      const r=experiment.models.rutherford,t=experiment.models.thomson;
      const text=`Av 80 guldbanor vände ${r.bins[3]} tillbaka över 90°. I det turkosa alternativet gjorde ${t.bins[3]} det. ${r.bins[3]?'Några stora avböjningar kan avslöja en liten, laddningstät kärna. De flesta behöver inte vända tillbaka.':'Inga stora bakåtvinklar i just det här provet. Det utesluter inte sådana banor vid andra avstånd eller startlägen.'}`;
      lab.setExplanation('Många banor avslöjar mönstret.',text);lab.$('[data-discovery]').textContent=text;
      if(mission===2){mission=3;lab.celebrate?.();}
    }
    guide();metrics();
  }
  lab.on('[data-task]','click',()=>{
    if(mission===0){charge=40;impact=1.2;controls();predictions();fire(1);}
    else if(mission===1){charge=reference?.charge||40;impact=.12;controls();predictions();fire(1);}
    else{charge=40;impact=1.2;controls();predictions();fire(80);}
  });
  lab.on('[data-probe]','click',()=>fire(1));lab.on('[data-many]','click',()=>fire(80));
  lab.on('[data-pause]','click',()=>{lab.setRunning(!lab.running);metrics();});
  for(const key of ['impact','charge']){lab.on(`[data-${key}]`,'input',()=>configure());lab.on(`[data-${key}]`,'change',()=>fire(1));}
  for(const button of lab.root.querySelectorAll('[data-view]'))lab.on(button,'click',()=>{view=button.dataset.view;for(const other of lab.root.querySelectorAll('[data-view]'))other.setAttribute('aria-pressed',String(other===button));lab.invalidate();});
  lab.on('[data-seed]','click',()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;controls();lab.announce(`Nytt försöksnummer ${seed}. Samma nummer används i båda modellerna.`);});
  lab.on('[data-reset]','click',()=>{
    seed=DEFAULT_SEED;charge=40;impact=1.2;mission=0;reference=null;view='both';controls();configure();guide();
    for(const b of lab.root.querySelectorAll('[data-view]'))b.setAttribute('aria-pressed',String(b.dataset.view==='both'));
    lab.setExplanation('Samma start, två olika förklaringar.','Testa först på avstånd, sedan nära mitten. Följ båda prickarna för att se vad laddningens fördelning gör.');
  });
  function aim(e){
    impact=Math.max(-2,Math.min(2,Math.round((183-lab.point(e).y)/32*20)/20));lab.$('[data-impact]').value=impact;configure();
  }
  lab.canvas.style.touchAction='none';
  lab.on(lab.canvas,'pointerdown',e=>{const p=lab.point(e);if(p.x<200&&p.y>65&&p.y<325){dragging=true;lab.canvas.setPointerCapture(e.pointerId);aim(e);}});
  lab.on(lab.canvas,'pointermove',e=>{if(dragging)aim(e);});
  lab.on(lab.canvas,'pointerup',e=>{if(dragging){dragging=false;fire(1);}if(lab.canvas.hasPointerCapture(e.pointerId))lab.canvas.releasePointerCapture(e.pointerId);});
  lab.on(lab.canvas,'pointercancel',()=>{dragging=false;});
  function arrow(ctx,x,y,dx,dy,color,width=3){
    const length=Math.hypot(dx,dy)||1,ux=dx/length,uy=dy/length;ctx.strokeStyle=ctx.fillStyle=color;ctx.lineWidth=width;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.stroke();ctx.beginPath();ctx.moveTo(x+dx,y+dy);ctx.lineTo(x+dx-ux*10-uy*5,y+dy-uy*10+ux*5);ctx.lineTo(x+dx-ux*10+uy*5,y+dy-uy*10-ux*5);ctx.closePath();ctx.fill();
  }
  function path(ctx,particle,projectX,projectY,{dashed=false,alpha=.4,width=2,color='#fff'}={}){
    ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dashed?[10,8]:[]);ctx.beginPath();
    particle.path.forEach((p,i)=>{if(i)ctx.lineTo(projectX(p.x),projectY(p.y));else ctx.moveTo(projectX(p.x),projectY(p.y));});ctx.stroke();ctx.setLineDash([]);
    if(particle.done&&particle.path.length>2){const a=particle.path[particle.path.length-2],b=particle.path.at(-1),dx=projectX(b.x)-projectX(a.x),dy=projectY(b.y)-projectY(a.y),len=Math.hypot(dx,dy)||1;arrow(ctx,projectX(b.x)-dx/len*12,projectY(b.y)-dy/len*12,dx/len*12,dy/len*12,color,width);}
    ctx.restore();
  }
  function atomRegion(ctx,x,y,scale){
    if(show('thomson')){const r=ATOM_RADIUS*scale,g=ctx.createRadialGradient(x-r*.2,y-r*.2,2,x,y,r);g.addColorStop(0,'#6fe2d42c');g.addColorStop(1,'#6fe2d407');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.save();ctx.strokeStyle='#6fe2d45c';ctx.setLineDash([5,6]);ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();ctx.restore();
      if(view==='thomson'){ctx.fillStyle='#b9e5df';ctx.font='500 26px Arial,sans-serif';ctx.textAlign='center';for(let i=0;i<5;i++){const a=i*2.399;ctx.fillText('−',x+Math.cos(a)*r*.5,y+9+Math.sin(a)*r*.5);}}
    }
    if(show('rutherford')){const r=Math.min(20,scale*.35),g=ctx.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,'#ffd77ef0');g.addColorStop(1,'#ffd77e00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff1b4';ctx.beginPath();ctx.arc(x,y,2.7,0,Math.PI*2);ctx.fill();}
  }
  lab.setDraw(({ctx,dt,running,motion,compact})=>{
    if(motion&&running)visualTime+=dt;
    if(running&&experiment.count&&!finished){
      const close=experiment.count===1&&experiment.models.rutherford.particles.some(p=>!p.done&&Math.hypot(p.x,p.y)<1.7);
      finished=advanceExperiment(experiment,dt,{rate:close?.5:experiment.count===1?2.2:1.6});metricClock+=dt;
      if(metricClock>.1||finished){metrics();metricClock=0;}
      if(finished){lab.setRunning(false);finishDiscovery();}
    }
    if(pauseState!==running){pauseState=running;metrics();}
    const font=compact?32:27;
    ctx.save();ctx.textAlign='left';ctx.font=`600 ${font}px Arial,sans-serif`;
    ctx.fillStyle='#d9edf0';ctx.fillText(dragging?'Släpp → skicka':'Dra strålen ↕',35,39);
    ctx.fillStyle=colors.rutherford;ctx.fillText('Guld: kärna',350,39);
    ctx.fillStyle=colors.thomson;ctx.fillText('Turkos: utspritt',690,39);
    const beamY=sy(impact);
    ctx.strokeStyle='#a6d2db14';ctx.lineWidth=1;for(let x=185;x<675;x+=64){ctx.beginPath();ctx.moveTo(x,65);ctx.lineTo(x,320);ctx.stroke();}
    ctx.save();ctx.setLineDash([7,9]);ctx.strokeStyle='#ffd77e44';ctx.beginPath();ctx.moveTo(145,beamY);ctx.lineTo(665,beamY);ctx.stroke();ctx.restore();
    arrow(ctx,65,beamY,67,0,'#ffd77e',4);roundRect(ctx,132,beamY-23,28,46,9,'#ffd77e','#fff0bd');
    ctx.fillStyle='#183b48';ctx.font='700 32px Arial,sans-serif';ctx.textAlign='center';ctx.fillText('↕',146,beamY+11);
    ctx.save();ctx.setLineDash([3,5]);ctx.strokeStyle='#b7d6db88';ctx.beginPath();ctx.moveTo(215,beamY);ctx.lineTo(215,sy(0));ctx.stroke();ctx.restore();
    ctx.fillStyle='#d9edf0';ctx.textAlign='left';ctx.font=`500 ${font}px Arial,sans-serif`;ctx.fillText(formatNumber(Math.abs(impact),2),236,(beamY+sy(0))/2-8);
    atomRegion(ctx,410,183,32);
    const models=['thomson','rutherford'].filter(show);
    ctx.save();ctx.beginPath();ctx.rect(150,60,535,268);ctx.clip();
    for(const model of models){
      const particles=experiment.count?experiment.models[model].particles:[prediction[model]];
      for(const p of particles){const focus=p.id===focusId;
        path(ctx,p,sx,sy,{dashed:!experiment.count,alpha:!experiment.count?.52:p.done?.3:focus?.95:.35,width:focus?3.8:1.5,color:colors[model]});
        if(!p.done){ctx.save();ctx.fillStyle=colors[model];ctx.shadowColor=colors[model];ctx.shadowBlur=focus?17:5;ctx.beginPath();ctx.arc(sx(p.x),sy(p.y),focus?7:3.5,0,Math.PI*2);ctx.fill();ctx.restore();}
      }
    }ctx.restore();
    ctx.fillStyle='#adc9d2';ctx.font=`400 ${font}px Arial,sans-serif`;ctx.textAlign='left';
    ctx.fillText(experiment.count?`${experiment.models.rutherford.completed}/${experiment.count} guldbanor klara`:'Dra → se nya banor. Släpp → skicka.',35,350);
    // A persistent close-up makes the continuous force visible without moving the controls.
    roundRect(ctx,704,83,218,218,18,'#102e3edd','#799eac66');
    ctx.fillStyle='#d9edf0';ctx.textAlign='center';ctx.font=`500 ${font}px Arial,sans-serif`;ctx.fillText('Nära mitten',813,73);
    ctx.save();ctx.beginPath();ctx.rect(708,87,210,210);ctx.clip();atomRegion(ctx,813,192,102);
    const ix=x=>813+x*102,iy=y=>192-y*102;
    for(const model of models){
      const p=experiment.count?experiment.models[model].particles.find(p=>p.id===focusId):prediction[model];if(!p)continue;
      path(ctx,p,ix,iy,{dashed:!experiment.count,alpha:.68,width:3,color:colors[model]});
      if(!p.done&&Math.hypot(p.x,p.y)<1.8){
        ctx.fillStyle=colors[model];ctx.shadowColor=colors[model];ctx.shadowBlur=13;ctx.beginPath();ctx.arc(ix(p.x),iy(p.y),8,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
        const f=forceAt(model,charge,p.x,p.y),mag=Math.hypot(f.x,f.y)||1,length=Math.min(66,Math.max(18,mag*22));arrow(ctx,ix(p.x),iy(p.y),f.x/mag*length,-f.y/mag*length,'#ff9f76',3.5);
      }
    }ctx.restore();
    ctx.fillStyle='#ffbd99';ctx.font=`400 ${compact?30:26}px Arial,sans-serif`;ctx.fillText('Pil = kraft',813,332);
    const rb=experiment.models.rutherford.bins,tb=experiment.models.thomson.bins,max=Math.max(1,...rb,...tb),labels=['0–5°','5–20°','20–90°','90–180°'];
    ctx.textAlign='left';ctx.fillStyle='#d9edf0';ctx.font=`500 ${font}px Arial,sans-serif`;ctx.fillText('Riktningar',35,415);
    for(let i=0;i<4;i++){const x=274+i*160;
      for(const [j,model] of ['thomson','rutherford'].entries()){const n=experiment.models[model].bins[i],height=n/max*38;ctx.fillStyle=colors[model];ctx.globalAlpha=.82;ctx.fillRect(x+j*49,414-height,42,Math.max(2,height));ctx.globalAlpha=1;ctx.textAlign='center';ctx.font=`600 ${font}px Arial,sans-serif`;ctx.fillText(n,x+21+j*49,407-height);}
      ctx.fillStyle='#bcd9df';ctx.font=`400 ${font}px Arial,sans-serif`;ctx.fillText(labels[i],x+45,449);
    }
    ctx.restore();
  });
  controls();predictions();metrics();guide();
  return {setActive(value){lab.setActive(value);},destroy(){dragging=false;lab.destroy();}};
}
