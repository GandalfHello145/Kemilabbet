import { createLab, formatNumber } from './lab-kit.js';
import { ATOM_RADIUS, createExperiment, advanceExperiment, createParticle, advanceParticle, forceAt } from './lab-models-model.js';

export function mountLab(host) {
  const DEFAULT_SEED=20261111;
  let seed=DEFAULT_SEED,charge=40,impact=1.2,view='rutherford',experiment=createExperiment({count:0}),preview={},dragging=false;
  let finished=false,metricClock=0;
  const lab=createLab(host,{
    id:'models',title:'Atomdetektiven',badge:'SKICKA · JÄMFÖR · DRA SLUTSATSER',
    subtitle:'Samma positiva laddning, olika fördelning. Vad kan partiklarnas riktningar avslöja?',
    canvasLabel:'Alfapartikelbanor genom Thomson- eller Rutherfordmodellen. Dra strålen uppåt eller nedåt, eller använd avståndsreglaget.',
    running:false,
    metrics:'<div class="cl-counter"><strong data-metric="sent">0</strong><span>skickade per modell</span></div><div class="cl-counter"><strong data-metric="straight">0</strong><span>nästan rakt · under 5°</span></div><div class="cl-counter"><strong data-metric="bent">0</strong><span>avböjda · 5–90°</span></div><div class="cl-counter"><strong data-metric="back">0</strong><span>tillbaka · över 90°</span></div>',
    controls:'<div class="cl-row"><label class="cl-field">Visa modell<select data-model><option value="rutherford">Rutherford · liten kärna</option><option value="thomson">Thomson · utspridd laddning</option></select></label><label class="cl-field">Positiv laddning <output data-charge-out>+40</output><input data-charge type="range" min="20" max="80" step="10" value="40"></label><label class="cl-field">Strålens läge från mitten <output data-impact-out>1,2</output><input data-impact type="range" min="-2" max="2" step="0.1" value="1.2"></label></div><div class="cl-buttons"><button type="button" class="cl-primary" data-fire>Skicka 80 per modell</button><button type="button" data-one>Följ en partikel</button><button type="button" data-seed>Nya startlägen</button><button type="button" data-reset>Börja om</button></div><p class="cl-note">Pil = elektrisk kraft. Spår = rörelse. Samma stråle skickas genom båda modellerna. Försöksnummer: <output data-seed-out>20261111</output>.</p>',
    below:'<div style="overflow-x:auto"><table class="cl-table"><caption>Färdiga banor i samma försök · antal per vinkelintervall</caption><thead><tr><th scope="col">Modell</th><th scope="col">0–5°</th><th scope="col">5–20°</th><th scope="col">20–90°</th><th scope="col">90–180°</th></tr></thead><tbody><tr><th scope="row">Thomson</th><td data-bin="thomson-0">0</td><td data-bin="thomson-1">0</td><td data-bin="thomson-2">0</td><td data-bin="thomson-3">0</td></tr><tr><th scope="row">Rutherford</th><td data-bin="rutherford-0">0</td><td data-bin="rutherford-1">0</td><td data-bin="rutherford-2">0</td><td data-bin="rutherford-3">0</td></tr></tbody></table></div><div class="cl-grid"><div><strong>En kraft, ingen hård vägg</strong><p>Positiva laddningar stöter bort varandra. Partikeln böjer av gradvis. Den studsar inte mot ett atomskal eller en ritad kärnyta.</p></div><div><strong>Solsystemet är en historisk liknelse</strong><p>Kärnan motsvarar solen och elektronerna planeterna. Men planeter hålls av gravitation; i atomen verkar elektriska krafter. Dagens modell beskriver inte elektroner som små planeter i kända banor.</p></div></div>',
    explanationTitle:'Gör en rättvis jämförelse.',
    explanation:'Skicka samma 80 partiklar genom båda modellerna. Växla modellbild medan försöket pågår. Ändra sedan en inställning och gör om med samma försöksnummer.',
    questions:['Vad händer med avböjningen när strålen passerar närmare mitten?', 'Vad händer om lika mycket positiv laddning samlas på en liten plats i stället för att spridas ut?', 'Håll stråle och laddning lika. Vilken modell kan ge riktigt stora avböjningar, och vad berättar det om kärnan?'],
    model:'<p>Vi jämför den positiva laddningen som en jämnt laddad sfär (Thomson) eller en koncentrerad punkt (Rutherford). Utanför sfären ger lika stora laddningar samma kraft. Inuti sfären är kraften svagare nära mitten; nära punktladdningen blir den mycket starkare.</p><p>Banorna integreras från den repulsiva elektriska kraften med små tidssteg. Ingen kollisionsyta vänder partikeln. Laddning, massa, tid och avstånd använder anpassade modellenheter. Kärnan, atomregionen och strålens bredd är förstorade; histogrammet är modellutfall, inte historiska mätdata. Elektronernas detaljfält, flera atomlager och energiförluster förenklas bort. Det här är ett digitalt experiment, ingen laborationsinstruktion med strålning.</p><p>Nya startlägen ändrar vilka avstånd partiklarna får. Samma försöksnummer och samma inställningar ger samma inkommande stråle, gemensam för de båda modellerna. De tre bleka förhandsbanorna är utvalda exempel och räknas inte i resultatet.</p><p>Primärkälla: <a href="https://web.mit.edu/8.13/8.13c/references-fall/rutherford/rutherford-scattering-of-alpha-and-beta-particles.pdf" target="_blank" rel="noopener">Rutherford (1911), The scattering of α and β particles by matter and the structure of the atom</a>. Historisk kontext: <a href="https://history.aip.org/exhibits/rutherford/sections/alpha-particles-atom.html" target="_blank" rel="noopener">American Institute of Physics</a>.</p>',
  });
  const sx=x=>480+x*36,sy=y=>181-y*36;
  function makePreview(){
    preview={};
    for(const model of ['thomson','rutherford']){
      preview[model]=[impact-1.2,impact,impact+1.2].map((b,id)=>{
        const p=createParticle({model,charge,impact:b,id});
        for(let i=0;i<1500&&!p.done;i++)advanceParticle(p,.02);
        return p;
      });
    }
  }
  function metrics(){
    const r=experiment.models[view];
    lab.setMetric('sent',experiment.launched);lab.setMetric('straight',r.bins[0]);
    lab.setMetric('bent',r.bins[1]+r.bins[2]);lab.setMetric('back',r.bins[3]);
    for(const model of ['thomson','rutherford'])experiment.models[model].bins.forEach((n,i)=>{lab.$(`[data-bin="${model}-${i}"]`).textContent=n;});
    lab.$('[data-seed-out]').textContent=seed;
  }
  function clearResults(){
    experiment=createExperiment({seed,charge,impact,count:0});finished=false;lab.setRunning(false);
    makePreview();metrics();lab.invalidate();
  }
  function configure(){
    charge=Number(lab.$('[data-charge]').value);impact=Number(lab.$('[data-impact]').value);
    lab.$('[data-charge-out]').textContent='+'+charge;
    lab.$('[data-impact-out]').textContent=formatNumber(impact,1);
    clearResults();lab.setExplanation('En ändring, en ny jämförelse.',
      'Skicka en ny stråle. Försöksnumret är kvar, så de båda modellerna får samma startlägen. Värdena är anpassade modellenheter.');
  }
  function fire(count){
    experiment=createExperiment({seed,charge,impact,count,spread:count===1?0:1.65});finished=false;
    metrics();lab.setRunning(true);
    lab.setExplanation(count===1?'Följ en och samma ingång.':'Samma stråle, två förklaringar.',
      count===1?'En partikel skickas på det valda avståndet genom vardera modellen. Växla modellbild och följ hur spåret böjer av.' :
      '80 partiklar skickas genom vardera modellen. Växla bild utan att ändra försöket. Riktningarna räknas när varje bana lämnar bilden.');
    lab.announce(`${count} partiklar skickas per modell.`);
  }
  lab.on('[data-model]','change',e=>{view=e.target.value;metrics();lab.invalidate();});
  lab.on('[data-charge]','input',configure);lab.on('[data-impact]','input',configure);
  lab.on('[data-fire]','click',()=>fire(80));lab.on('[data-one]','click',()=>fire(1));
  lab.on('[data-seed]','click',()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;clearResults();lab.announce(`Nytt försöksnummer ${seed}. Skicka ett nytt försök.`);});
  lab.on('[data-reset]','click',()=>{
    seed=DEFAULT_SEED;charge=40;impact=1.2;view='rutherford';
    lab.$('[data-charge]').value=charge;lab.$('[data-impact]').value=impact;lab.$('[data-model]').value=view;configure();
  });
  function dragBeam(e){
    const p=lab.point(e);impact=Math.max(-2,Math.min(2,Math.round((181-p.y)/36*10)/10));
    lab.$('[data-impact]').value=impact;configure();
  }
  lab.on(lab.canvas,'pointerdown',e=>{
    const p=lab.point(e);if(p.x<245&&p.y>55&&p.y<325){dragging=true;lab.canvas.setPointerCapture(e.pointerId);dragBeam(e);}
  });
  lab.on(lab.canvas,'pointermove',e=>{if(dragging)dragBeam(e);});
  lab.on(lab.canvas,'pointerup',e=>{dragging=false;if(lab.canvas.hasPointerCapture(e.pointerId))lab.canvas.releasePointerCapture(e.pointerId);});
  lab.on(lab.canvas,'pointercancel',()=>{dragging=false;});
  function arrow(ctx,x,y,dx,dy,color){
    const length=Math.hypot(dx,dy)||1,ux=dx/length,uy=dy/length;
    ctx.strokeStyle=ctx.fillStyle=color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x+dx,y+dy);ctx.lineTo(x+dx-ux*11-uy*6,y+dy-uy*11+ux*6);ctx.lineTo(x+dx-ux*11+uy*6,y+dy-uy*11-ux*6);ctx.closePath();ctx.fill();
  }
  lab.setDraw(({ctx,dt,running,compact})=>{
    if(running&&experiment.count&&!finished){
      finished=advanceExperiment(experiment,dt);metricClock+=dt;
      if(metricClock>.12||finished){metrics();metricClock=0;}
      if(finished){lab.setRunning(false);lab.announce('Försöket är färdigt. Jämför riktningarna i tabellen.');
        lab.setExplanation('Vilken modell förklarar de stora vinklarna?', 'En koncentrerad positiv laddning kan ge stark avböjning nära mitten. Ett större avstånd ger vanligen svagare avböjning. Jämför samma stråle i tabellen.');}
    }
    const r=experiment.models[view],color=view==='rutherford'?'#ffd77e':'#72ded4',font=compact?32:26;
    ctx.save();ctx.font=`500 ${font}px Arial,sans-serif`;ctx.fillStyle='#d9edf0';ctx.textAlign='left';
    ctx.fillText(view==='rutherford'?'Rutherford · laddning i en liten kärna':'Thomson · laddning genom hela sfären',38,37);
    ctx.strokeStyle='#97c7d21c';ctx.lineWidth=1;
    for(let x=192;x<=768;x+=72){ctx.beginPath();ctx.moveTo(x,65);ctx.lineTo(x,325);ctx.stroke();}
    ctx.save();ctx.setLineDash([6,7]);ctx.strokeStyle='#aad8dd55';ctx.beginPath();ctx.arc(480,181,ATOM_RADIUS*36,0,Math.PI*2);ctx.stroke();ctx.restore();
    if(view==='thomson'){
      const gradient=ctx.createRadialGradient(465,163,4,480,181,ATOM_RADIUS*36);
      gradient.addColorStop(0,'#84d8c85c');gradient.addColorStop(1,'#55b9bd13');ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(480,181,ATOM_RADIUS*36,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#c2e8e0';ctx.textAlign='center';ctx.font='600 26px Arial,sans-serif';
      for(let i=0;i<5;i++){const a=i*2.399,radius=i%2?31:21;ctx.fillText('−',480+Math.cos(a)*radius,190+Math.sin(a)*radius);}
    }else{
      const gradient=ctx.createRadialGradient(480,181,1,480,181,21);gradient.addColorStop(0,'#ffd77eee');gradient.addColorStop(1,'#ffd77e00');ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(480,181,21,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ffdeb0';ctx.beginPath();ctx.arc(480,181,3,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e9f5f3';ctx.textAlign='left';ctx.font=`500 ${font}px Arial,sans-serif`;ctx.fillText('+'+charge,511,166);
    }
    const beamY=sy(impact);ctx.fillStyle='#ffd77e';ctx.fillRect(152,beamY-14,26,28);
    arrow(ctx,83,beamY,60,0,'#ffd77e');ctx.fillStyle='#d9edf0';ctx.textAlign='left';ctx.font=`500 ${font}px Arial,sans-serif`;ctx.fillText('α',88,beamY-19);
    ctx.save();ctx.setLineDash([6,9]);ctx.strokeStyle='#ffd77e35';ctx.beginPath();ctx.moveTo(180,beamY);ctx.lineTo(830,beamY);ctx.stroke();ctx.restore();
    const particles=experiment.count?r.particles:preview[view];
    ctx.save();ctx.beginPath();ctx.rect(180,55,610,273);ctx.clip();
    for(const p of particles){
      ctx.strokeStyle=color;ctx.globalAlpha=experiment.count?(p.done?.24:.58):.34;ctx.lineWidth=p.id===0?3:1.7;
      ctx.beginPath();p.path.forEach((point,i)=>{if(i)ctx.lineTo(sx(point.x),sy(point.y));else ctx.moveTo(sx(point.x),sy(point.y));});ctx.stroke();
      if(!p.done){ctx.globalAlpha=1;ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=9;ctx.beginPath();ctx.arc(sx(p.x),sy(p.y),p.id===0?6:4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
    }
    ctx.globalAlpha=1;
    const nearby=particles.filter(p=>!p.done&&Math.hypot(p.x,p.y)<2.1).sort((a,b)=>Math.hypot(a.x,a.y)-Math.hypot(b.x,b.y))[0];
    if(nearby){const force=forceAt(view,charge,nearby.x,nearby.y),length=Math.hypot(force.x,force.y)||1,scale=Math.min(48,Math.max(20,length*90));arrow(ctx,sx(nearby.x),sy(nearby.y),force.x/length*scale,-force.y/length*scale,'#ff9f76');}
    ctx.restore();
    ctx.strokeStyle='#85c6ce55';ctx.lineWidth=4;
    for(const x of [182,790]){ctx.beginPath();ctx.moveTo(x,62);ctx.lineTo(x,324);ctx.stroke();}
    ctx.fillStyle='#a5bfca';ctx.textAlign='left';ctx.font=`400 ${font}px Arial,sans-serif`;
    ctx.fillText(experiment.count?`${r.completed} av ${experiment.count} banor klara`:'Tre utvalda förhandsbanor · inga resultat ännu',38,354);
    const max=Math.max(1,...r.bins),labels=['0–5°','5–20°','20–90°','90–180°'];
    ctx.fillStyle='#d9edf0';ctx.font=`500 ${font}px Arial,sans-serif`;ctx.fillText('Riktningar',38,413);
    for(let i=0;i<4;i++){
      const x=277+i*160,barHeight=r.bins[i]/max*43;ctx.fillStyle=color;ctx.globalAlpha=.8;ctx.fillRect(x,413-barHeight,105,Math.max(2,barHeight));ctx.globalAlpha=1;
      ctx.textAlign='center';ctx.fillStyle='#edf9f6';ctx.font=`600 ${font}px Arial,sans-serif`;ctx.fillText(r.bins[i],x+52,405-barHeight);
      ctx.fillStyle='#bcd9df';ctx.font=`400 ${font}px Arial,sans-serif`;ctx.fillText(labels[i],x+52,448);
    }
    ctx.restore();
  });
  makePreview();metrics();
  return {setActive(value){lab.setActive(value);},destroy(){dragging=false;lab.destroy();}};
}
