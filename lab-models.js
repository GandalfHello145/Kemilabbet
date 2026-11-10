import { createLab, roundRect } from './lab-kit.js?v=20261110-labs3';
import { ATOM_RADIUS, createExperiment, advanceExperiment, forceAt, traceTrajectory,
  DETECTOR_STAGES,createDetectorLesson,observeDetectorLesson,nextDetectorStage,
  qualitativeScattering } from './lab-models-model.js?v=20261110-labs3';

export function mountLab(host){
  const COLORS={thomson:'#6fe2d4',rutherford:'#ffd77e'},CHARGE=40,SEED=20261111;
  let lesson=createDetectorLesson(),experiment=createExperiment({count:0}),impact=.12;
  let finished=false,dragging=false,focusId=0,wasRunning=false,preview={};
  const lab=createLab(host,{
    id:'models',title:'Atomdetektiven',badge:'FÖLJ → UPPTÄCK → JÄMFÖR',
    subtitle:'Undersök en idé i taget. Varför ändrar en positiv partikel sin väg?',
    steps:[{title:'Thomson',text:'Positiv laddning utspridd.'},{title:'Rutherford',text:'Positiv laddning i en liten kärna.'},{title:'Jämför',text:'Samma start i båda modellerna.'}],
    objective:'Börja med Thomson. Följ en positiv partikel genom atomen.',
    hideRun:true,running:false,tools:'Följ stegen med den stora knappen. Pausa om du vill titta närmare.',
    canvasLabel:'En atommodell visas i taget: först Thomson, sedan Rutherford. En närbild visar kraften på en positiv partikel. I sista steget kan samma start jämföras i båda modellerna.',
    metrics:'<div class="cl-counter"><strong data-metric="model">Thomson</strong><span>idén vi undersöker</span></div><div class="cl-counter"><strong data-metric="effect">Följ partikeln</strong><span>det vi ser</span></div><div class="cl-counter"><strong data-metric="clue">Utspridd laddning</strong><span>det vi förklarar med</span></div>',
    controls:'<p class="cl-task-hint" data-hint>Följ först bara den turkosa partikeln.</p><button type="button" class="cl-primary" data-next>Skicka en partikel</button><button type="button" class="cl-secondary" data-replay hidden>Se samma passage igen</button><button type="button" data-pause hidden>Pausa partikeln</button><div data-explore hidden><p class="cl-task-hint">Nu kan du styra själv. Dra det gula handtaget och släpp, eller välj här:</p><div class="cl-buttons"><button type="button" class="cl-secondary" data-near>Pröva nära mitten</button><button type="button" class="cl-secondary" data-far>Pröva längre från mitten</button></div></div><button type="button" data-reset>Börja om med Thomson</button>',
    below:'<div class="cl-grid"><div><strong data-idea-title>Thomsons idé</strong><p data-idea>Positiv laddning är utspridd genom atomen. De negativa elektronerna finns inuti.</p></div><div><strong>Det här är ledtråden</strong><p data-discovery>Se vad som händer med den positiva partikeln. En pil visar vilken väg den elektriska kraften verkar.</p></div></div><details><summary>Solsystemsliknelsen · vad hjälper den oss med?</summary><p>I den historiska liknelsen motsvarar kärnan solen och elektronerna planeterna. Men planeter hålls av gravitation, medan elektriska krafter verkar i atomen. Dagens atommodell beskriver inte elektroner som små planeter i kända banor.</p></details>',
    explanationTitle:'Thomson: positiv laddning över hela atomen.',
    explanation:'Thomson tänkte sig negativt laddade elektroner inuti en utspridd positiv laddning. Skicka den positiva partikeln och följ hur vägen påverkas.',
    model:'<p>Här jämförs den positiva laddningen som en jämnt laddad sfär (Thomson) eller en koncentrerad punkt (Rutherford). De negativa elektronerna i Thomsonbilden visar modellens idé; deras enskilda krafter beräknas inte. Elektronernas detaljfält, flera atomlager och energiförluster förenklas bort.</p><p>Banorna beräknas från repulsiv elektrisk kraft. Ingen hård yta vänder partikeln. Utanför en jämnt laddad sfär är fältet detsamma som från lika stor punktladdning; inne i sfären är påverkan svag nära mitten. Laddning, massa, tid och avstånd använder anpassade modellenheter. Kärnan och atomregionen visas förstorade. Testpartikeln visas långsammare nära mitten utan att kraftlagen ändras.</p><p>I sista steget överlagras två alternativa modeller för jämförelse; de bildar inte en kombinerad atom. Båda får exakt samma inkommande partikel. De många partiklarnas startlägen är reproducerbara. Visningen förklarar försöksidén och återger inte historiska mätetal.</p><p>Primärkälla: <a href="https://web.mit.edu/8.13/8.13c/references-fall/rutherford/rutherford-scattering-of-alpha-and-beta-particles.pdf" target="_blank" rel="noopener">Rutherford (1911), The scattering of α and β particles by matter and the structure of the atom</a>. Historisk förklaring: <a href="https://history.aip.org/exhibits/rutherford/sections/alpha-particles-atom.html" target="_blank" rel="noopener">American Institute of Physics: kärnans upptäckt</a>.</p>',
  });
  const spec=()=>DETECTOR_STAGES[lesson.stage];
  const visible=()=>spec().view==='both'?['thomson','rutherford']:[spec().view];
  const sx=x=>410+x*32,sy=y=>218-y*32;
  function refresh(){
    const stage=lesson.stage,observed=lesson.observed;
    lab.setStep?.(stage===0?0:stage===3?2:1);
    lab.setObjective?.(observed?['Utspridd laddning gav svag påverkan.','En liten positiv kärna kan böja banan kraftigt.','De flesta går förbi kärnan. Runt den finns mycket utrymme.','Samma start, olika laddningsfördelning – olika väg.'][stage]:
      ['Följ en positiv partikel genom Thomsons atom.','Skicka samma positiva partikel nära Rutherfords kärna.','Följ många partiklar. Vad händer med de flesta?','Följ samma start i båda modellerna.'][stage],observed);
    lab.$('[data-next]').textContent=observed?
      ['Upptäck Rutherford','Pröva flera partiklar','Jämför modellerna','Skicka samma start igen'][stage]:
      ['Skicka en partikel','Skicka samma partikel','Skicka flera partiklar','Skicka i båda modellerna'][stage];
    lab.$('[data-next]').disabled=Boolean(experiment.count&&!finished);
    lab.$('[data-replay]').hidden=!observed||stage===3;
    lab.$('[data-hint]').textContent=['Börja med en enda idé och följ den turkosa partikeln.','Här är samma positiva laddning samlad i en liten kärna.','Titta både på vanliga passager och på dem som böjer av mycket.','Guld är Rutherford. Turkos är Thomson. De får samma start.'][stage];
    lab.$('[data-explore]').hidden=stage!==3;
    lab.$('[data-pause]').hidden=!experiment.count||finished;
    lab.$('[data-pause]').textContent=lab.running?'Pausa partiklarna':'Fortsätt partiklarna';
    lab.setMetric('model',stage===0?'Thomson':stage===3?'Båda idéerna':'Rutherford');
    lab.setMetric('effect',!finished?'Följ partikeln':stage===0?'Svag påverkan':stage===2?'Flest går förbi':stage===3?'Olika vägar':'Tydlig avböjning');
    lab.setMetric('clue',stage===0?'Utspridd laddning':stage===2?'Utrymme runt kärnan':stage===3?'Samma start':'Liten positiv kärna');
    lab.$('[data-idea-title]').textContent=stage===0?'Thomsons idé':stage===3?'En rättvis jämförelse':'Rutherfords idé';
    lab.$('[data-idea]').textContent=stage===0?'Positiv laddning är utspridd genom atomen. De negativa elektronerna finns inuti.':
      stage===3?'Positiv laddning är lika stor i båda alternativen, men fördelad på olika sätt. Samma strålstart gör skillnaden lättare att upptäcka.':
      'Den positiva laddningen och nästan hela atomens massa finns i en mycket liten kärna. Området runt kärnan tar upp det mesta av atomens volym.';
    lab.invalidate();
  }
  function explainStage(){
    const text=[
      ['Thomson: positiv laddning över hela atomen.','Thomson tänkte sig negativt laddade elektroner inuti en utspridd positiv laddning. Skicka den positiva partikeln och följ hur vägen påverkas.'],
      ['Rutherford: laddningen är samlad i en liten kärna.','Nu provar vi samma start nära en liten positiv kärna. Både kärnan och den inkommande partikeln är positiva. Lika laddningar stöter bort varandra.'],
      ['Vad händer med de flesta partiklarna?','Skicka flera genom samma område. Många passerar långt från den lilla kärnan. Följ också dem som kommer nära.'],
      ['Nu är du redo att jämföra.','Båda får samma positiva partikel från samma start. Titta på kraftpilen nära mitten: koncentrerad laddning kan ändra vägen mycket mer.'],
    ][lesson.stage];
    lab.setExplanation(...text);lab.$('[data-discovery]').textContent=text[1];
  }
  function resetPicture(){
    impact=spec().impact;experiment=createExperiment({count:0});finished=false;dragging=false;
    lab.setRunning(false);preview={};refresh();explainStage();
  }
  function fire({custom=false}={}){
    if(!custom)impact=spec().impact;
    experiment=createExperiment({seed:SEED,charge:CHARGE,impact,count:spec().count,spread:spec().count===1?0:1.65});
    focusId=experiment.impacts.reduce((best,b,i)=>Math.abs(b)<Math.abs(experiment.impacts[best])?i:best,0);
    finished=false;preview={};lab.setRunning(true);refresh();
    lab.setExplanation(spec().count===1?'Följ den positiva partikeln.':'Följ de många passagerna.',
      lesson.stage===0?'Den positiva laddningen är utspridd. Se hur lite partikelns väg ändras när den passerar nära mitten.':
      lesson.stage===2?'De flesta partiklar passerar utan att komma mycket nära kärnan. Några får starkare påverkan.':
      lesson.stage===3?'Samma start, två alternativ. Guld visar Rutherford och turkos Thomson. Kraften verkar bort från positiv laddning.':
      'Partikeln närmar sig en positiv kärna. Pilen pekar bort från kärnan: lika laddningar stöter bort varandra. Rörelsen visas långsamt här.');
    lab.announce('Partikeln är skickad. Följ rörelsen och kraftpilen.');
  }
  function complete(){
    if(!observeDetectorLesson(lesson,experiment))return;
    finished=true;lab.setRunning(false);
    const stage=lesson.stage;
    let title,text;
    if(stage===0){title='Utspridd laddning ger svag påverkan här.';text='Partikeln gick nästan rakt genom området. I Thomsons idé är den positiva laddningen utspridd, så kraften nära mitten är svag. Nästa steg provar en annan förklaring med samma start.';}
    else if(stage===1){title='En liten positiv kärna ändrar vägen mycket mer.';text='Nära den samlade positiva laddningen blir bortstötningen stark. Partikeln böjer av gradvis av elektrisk kraft. Den studsar inte mot någon vägg. Stora avböjningar blev en ledtråd till kärnan.';}
    else if(stage===2){const outcome=qualitativeScattering(experiment.models.rutherford);title='Den lilla kärnan lämnar mycket utrymme omkring sig.';text=outcome.mostPass?
      'De flesta gick förbi utan stark påverkan. Några som kom nära böjde av mycket, och några vände tillbaka. Tillsammans pekade observationerna mot en liten positiv kärna och mycket utrymme runt den. De stora avböjningarna var svåra att förklara med Thomsons modell. Rutherfords kärnmodell gav en bättre förklaring till försöket.':
      'Partiklarnas olika startlägen gav olika passager. De kraftigaste ändringarna kom nära den lilla positiva kärnan. Området runt kärnan tar upp det mesta av atomens volym.';}
    else{title='Samma start visar varför fördelningen spelar roll.';text=Math.abs(impact)<.5?
      'Nära mitten böjs guldspåret mycket mer än det turkosa. Den positiva laddningen är samlad i en liten kärna i Rutherfordmodellen, men utspridd i Thomsonmodellen. Lika laddningar stöter bort varandra i båda fallen.':
      'Längre från mitten blir skillnaden mindre. Det är särskilt de nära passagerna som kan avslöja att den positiva laddningen är samlad i en liten kärna. Pröva nära mitten igen.';}
    lab.setExplanation(title,text);lab.$('[data-discovery]').textContent=text;refresh();lab.celebrate?.(410,218);lab.announce(title+' '+text);
  }
  lab.on('[data-next]','click',()=>{
    if(experiment.count&&!finished)return;
    if(lesson.observed&&lesson.stage<3){nextDetectorStage(lesson);resetPicture();}
    else fire({custom:lesson.stage===3});
  });
  lab.on('[data-replay]','click',()=>fire());
  lab.on('[data-pause]','click',()=>{lab.setRunning(!lab.running);refresh();});
  lab.on('[data-near]','click',()=>{impact=.12;fire({custom:true});});
  lab.on('[data-far]','click',()=>{impact=1.2;fire({custom:true});});
  lab.on('[data-reset]','click',()=>{lesson=createDetectorLesson();resetPicture();});
  function aim(e){
    impact=Math.max(-2,Math.min(2,(218-lab.point(e).y)/32));experiment=createExperiment({count:0});finished=false;lab.setRunning(false);
    for(const model of ['thomson','rutherford'])preview[model]=traceTrajectory({model,charge:CHARGE,impact});
    lab.setExplanation('Släpp och jämför samma start.','Det gula handtaget flyttar startläget för båda partiklarna samtidigt. Släpp för att se dem röra sig.');lab.invalidate();
  }
  lab.canvas.style.touchAction='none';
  lab.on(lab.canvas,'pointerdown',e=>{const p=lab.point(e);if(lesson.stage===3&&p.x<190&&p.y>80&&p.y<335){dragging=true;lab.canvas.setPointerCapture(e.pointerId);aim(e);}});
  lab.on(lab.canvas,'pointermove',e=>{if(dragging)aim(e);});
  lab.on(lab.canvas,'pointerup',e=>{if(dragging){dragging=false;fire({custom:true});}if(lab.canvas.hasPointerCapture(e.pointerId))lab.canvas.releasePointerCapture(e.pointerId);});
  lab.on(lab.canvas,'pointercancel',()=>{dragging=false;preview={};lab.invalidate();});
  function arrow(ctx,x,y,dx,dy,color,width=3){
    const len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;ctx.strokeStyle=ctx.fillStyle=color;ctx.lineWidth=width;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.stroke();ctx.beginPath();ctx.moveTo(x+dx,y+dy);ctx.lineTo(x+dx-ux*11-uy*6,y+dy-uy*11+ux*6);ctx.lineTo(x+dx-ux*11+uy*6,y+dy-uy*11-ux*6);ctx.closePath();ctx.fill();
  }
  function path(ctx,p,px,py,color,alpha=.6,width=3,dashed=false){
    ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dashed?[11,8]:[]);ctx.beginPath();p.path.forEach((v,i)=>i?ctx.lineTo(px(v.x),py(v.y)):ctx.moveTo(px(v.x),py(v.y)));ctx.stroke();ctx.setLineDash([]);
    if(p.done&&p.path.length>2){const a=p.path.at(-2),b=p.path.at(-1),dx=px(b.x)-px(a.x),dy=py(b.y)-py(a.y),len=Math.hypot(dx,dy)||1;arrow(ctx,px(b.x)-dx/len*13,py(b.y)-dy/len*13,dx/len*13,dy/len*13,color,width);}ctx.restore();
  }
  function region(ctx,x,y,scale){
    const models=visible();
    if(models.includes('thomson')){
      const r=ATOM_RADIUS*scale,g=ctx.createRadialGradient(x-r*.2,y-r*.2,1,x,y,r);g.addColorStop(0,'#6fe2d45a');g.addColorStop(1,'#6fe2d411');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
      ctx.save();ctx.strokeStyle='#75ded588';ctx.lineWidth=2;ctx.setLineDash([5,6]);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();ctx.restore();
      if(spec().view==='thomson'){
        ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='500 26px Arial,sans-serif';
        for(let i=0;i<5;i++){const a=i*2.399;ctx.fillStyle='#96ecdf';ctx.fillText('+',x+Math.cos(a)*r*.48,y+Math.sin(a)*r*.48);}
        for(let i=0;i<3;i++){const a=i*2.094+.7;ctx.fillStyle='#142f45';ctx.beginPath();ctx.arc(x+Math.cos(a)*r*.77,y+Math.sin(a)*r*.77,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d8f5f2';ctx.fillText('−',x+Math.cos(a)*r*.77,y+Math.sin(a)*r*.77);}
        ctx.textBaseline='alphabetic';
      }
    }
    if(models.includes('rutherford')){
      const r=Math.min(22,scale*.4),g=ctx.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,'#ffd77ef0');g.addColorStop(1,'#ffd77e00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff0a3';ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();
    }
  }
  function bead(ctx,p,px,py,color,large){
    const x=px(p.x),y=py(p.y),r=large?13:4;ctx.save();ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=large?18:4;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    if(large){ctx.fillStyle='#173646';ctx.font='700 26px Arial,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('+',x,y);}
    ctx.restore();
  }
  lab.setDraw(({ctx,dt,running,compact})=>{
    if(running&&experiment.count&&!finished){
      const names=visible();const close=experiment.count===1&&names.some(name=>experiment.models[name].particles.some(p=>!p.done&&Math.hypot(p.x,p.y)<1.7));
      advanceExperiment(experiment,dt,{rate:close?.5:experiment.count===1?2.2:1.6});
      if(names.every(name=>experiment.models[name].completed===experiment.count))complete();
    }
    if(wasRunning!==running){wasRunning=running;refresh();}
    const stage=lesson.stage,font=compact?32:29,names=visible(),count=experiment.count;
    ctx.save();ctx.textAlign='left';ctx.font=`600 ${font}px Arial,sans-serif`;ctx.fillStyle='#e4f5f3';ctx.fillText(stage===0?'Thomson':stage===3?'Samma start i båda modellerna':'Rutherford',38,43);
    ctx.textAlign='center';ctx.fillText('Följ kraften',812,58);
    const beamY=sy(impact);
    ctx.save();ctx.setLineDash([7,10]);ctx.strokeStyle='#c3d9df33';ctx.beginPath();ctx.moveTo(145,beamY);ctx.lineTo(675,beamY);ctx.stroke();ctx.restore();
    arrow(ctx,65,beamY,64,0,'#ffd77e',4);roundRect(ctx,132,beamY-22,28,44,9,'#ffd77e','#fff0b5');
    ctx.fillStyle='#173646';ctx.textAlign='center';ctx.font='700 28px Arial,sans-serif';ctx.fillText(stage===3?'↕':'+',146,beamY+10);
    region(ctx,410,218,32);
    ctx.save();ctx.beginPath();ctx.rect(150,80,535,290);ctx.clip();
    for(const name of names){
      const particles=count?experiment.models[name].particles:preview[name]?[preview[name]]:[];
      for(const p of particles){const focus=p.id===focusId;path(ctx,p,sx,sy,COLORS[name],count?(focus?.88:p.done?.22:.35):.4,focus?3.8:1.6,!count);if(!p.done)bead(ctx,p,sx,sy,COLORS[name],focus&&count===1);}
    }ctx.restore();
    if(!count&&!preview.thomson){const p={x:-7.3,y:impact};bead(ctx,p,sx,sy,COLORS[names[0]],true);}
    roundRect(ctx,706,83,216,248,18,'#102e3edd','#799eac77');
    ctx.save();ctx.beginPath();ctx.rect(710,87,208,240);ctx.clip();region(ctx,814,207,102);
    const ix=x=>814+x*102,iy=y=>207-y*102;
    for(const name of names){
      const p=count?experiment.models[name].particles.find(p=>p.id===focusId):preview[name];if(!p)continue;
      path(ctx,p,ix,iy,COLORS[name],.75,3,!count);
      if(!p.done&&Math.hypot(p.x,p.y)<1.7){bead(ctx,p,ix,iy,COLORS[name],true);const f=forceAt(name,CHARGE,p.x,p.y),m=Math.hypot(f.x,f.y)||1,length=Math.min(68,Math.max(19,m*22));arrow(ctx,ix(p.x),iy(p.y),f.x/m*length,-f.y/m*length,'#ffaf89',4);}
    }ctx.restore();
    ctx.fillStyle='#ffbd9b';ctx.textAlign='center';ctx.font=`500 ${compact?30:27}px Arial,sans-serif`;ctx.fillText('Pil = kraft',814,365);
    ctx.textAlign='left';ctx.fillStyle='#d2eae9';ctx.font=`500 ${font}px Arial,sans-serif`;
    const line=stage===0?'Utspridd positiv laddning':stage===1?'Lika laddningar stöter bort varandra':stage===2?'De flesta passerar förbi kärnan':'Guld: Rutherford · Turkos: Thomson';
    ctx.fillText(line,38,414);
    ctx.fillStyle='#a8c7d0';ctx.font=`400 ${compact?30:26}px Arial,sans-serif`;ctx.fillText(stage===3?'Dra handtaget och släpp för en ny jämförelse.':'Följ partikeln. Läs sedan upptäckten ovanför bilden.',38,452);
    ctx.restore();
  });
  resetPicture();
  return {setActive(value){lab.setActive(value);},destroy(){dragging=false;lab.destroy();}};
}
