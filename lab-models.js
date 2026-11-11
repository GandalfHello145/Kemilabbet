import { createLab, roundRect } from './lab-kit.js?v=20261111-clear8';
import { ATOM_RADIUS, createExperiment, advanceExperiment, forceAt, traceTrajectory,
  DETECTOR_STAGES,createDetectorLesson,observeDetectorLesson,nextDetectorStage,
  qualitativeScattering } from './lab-models-model.js?v=20261111-clear8';

export function mountLab(host){
  const COLORS={thomson:'#6fe2d4',rutherford:'#ffd77e'},CHARGE=40,SEED=20261111;
  let lesson=createDetectorLesson(),experiment=createExperiment({count:0}),impact=.12;
  let finished=false,dragging=false,focusId=0,wasRunning=false,preview={},slow=true,calm=false;
  const lab=createLab(host,{
    id:'models',title:'Atomdetektiven',badge:'SKICKA → TITTA → FÖRKLARA',
    subtitle:'Skicka en positiv partikel (+). Titta på vägen. Jämför två äldre idéer om atomen.',
    steps:[{title:'Thomson',text:'Plus utspritt i atomen.'},{title:'Rutherford',text:'Plus i en liten kärna.'},{title:'Jämför',text:'Samma start, två idéer.'}],
    objective:'Tryck på Skicka en partikel. Följ den turkosa punkten (+).',
    hideRun:true,running:false,tools:'Följ stegen med den stora knappen. Pausa om du vill titta närmare.',
    canvasLabel:'Följ den positiva partikeln som en färgad punkt med plus. Thomson och Rutherford visas först var för sig. I sista steget jämförs samma start. Knapparna Nära mitten och Längre från mitten ersätter dragning.',
    metrics:'<div class="cl-counter"><strong data-metric="model">Thomson</strong><span>idén vi provar</span></div><div class="cl-counter"><strong data-metric="effect">Följ punkten</strong><span>det vi ser</span></div><div class="cl-counter"><strong data-metric="clue">Plus utspritt</strong><span>vår förklaring</span></div>',
    controls:'<p class="cl-task-hint" data-hint>Följ den turkosa punkten med plus.</p><button type="button" class="cl-primary" data-next aria-label="Skicka en positiv partikel genom Thomsons atom">Skicka en partikel</button><button type="button" class="cl-secondary" data-replay hidden>Se samma väg igen</button><button type="button" data-pause hidden>Pausa rörelsen</button><details><summary>Fler verktyg</summary><label class="cl-note"><input type="checkbox" data-slow checked> Visa långsamt nära mitten</label><div data-explore hidden><p class="cl-task-hint">Flytta starten med det gula handtaget, eller använd en knapp.</p><div class="cl-buttons"><button type="button" class="cl-secondary" data-near aria-label="Skicka båda partiklarna nära atomens mitt">Nära mitten</button><button type="button" class="cl-secondary" data-far aria-label="Skicka båda partiklarna längre från atomens mitt">Längre från mitten</button></div></div><details><summary>En liknelse med solsystemet</summary><p>Kärnan liknas vid solen och elektronerna vid planeter. I atomen verkar elektriska krafter. Elektroner följer inte bestämda planetbanor i dagens atommodell.</p></details></details><button type="button" data-reset>Börja om med Thomson</button>',
    below:'<div class="cl-grid"><div><strong data-idea-title>Thomsons idé</strong><p data-idea>Plusladdningen är utspridd i atomen. Elektroner med minus finns inuti.</p></div><div><strong>Läs pilen</strong><p data-discovery>Pilen visar åt vilket håll den elektriska kraften verkar. Kraften påverkar partikelns rörelse.</p></div></div>',
    explanationTitle:'Börja med Thomsons idé.',
    explanation:'Plusladdningen är utspridd i atomen. Skicka partikeln och se om vägen ändras.',
    model:'<p>Här jämförs två äldre idéer om atomen. I Thomsons idé är plusladdningen utspridd. I Rutherfords idé är den samlad i en liten kärna. Elektronerna i Thomsonbilden visar var de tänktes finnas. Deras egna krafter räknas inte med.</p><p>Två plusladdningar stöter bort varandra med elektrisk kraft. Därför böjer partikeln av utan att träffa en hård vägg. Nära mitten av Thomsons atom är påverkan svag här. Samlad laddning i en kärna kan påverka partikeln mycket mer.</p><p>Det sista steget visar två alternativ ovanpå varandra för jämförelse. De är inte en gemensam atom. De får samma start. Långsam visning ändrar uppspelningen, inte beräkningen av kraften. Flera atomlager och energiförluster ingår inte.</p><p>Källor: <a href="https://web.mit.edu/8.13/8.13c/references-fall/rutherford/rutherford-scattering-of-alpha-and-beta-particles.pdf" target="_blank" rel="noopener">Rutherfords artikel om atomkärnan (1911)</a> och <a href="https://history.aip.org/exhibits/rutherford/sections/alpha-particles-atom.html" target="_blank" rel="noopener">American Institute of Physics: kärnans upptäckt</a>.</p>',
  });
  const spec=()=>DETECTOR_STAGES[lesson.stage];
  const visible=()=>spec().view==='both'?['thomson','rutherford']:[spec().view];
  const sx=x=>410+x*32,sy=y=>218-y*32;
  function refresh(){
    const stage=lesson.stage,observed=lesson.observed;
    lab.setStep?.(stage===0?0:stage===3?2:1);
    lab.setObjective?.(observed?['Partikeln gick nästan rakt.','Nära kärnan böjde partikeln av.','De flesta gick förbi kärnan.','Samma start gav olika vägar.'][stage]:
      ['Tryck på Skicka. Följ den turkosa punkten (+).','Tryck på Skicka. Följ punkten nära kärnan.','Skicka flera. Titta på var de flesta passerar.','Skicka i båda. Jämför de två spåren.'][stage],observed);
    lab.$('[data-next]').textContent=observed?
      ['Nästa: prova Rutherford','Nästa: prova flera','Nästa: jämför idéerna','Skicka i båda igen'][stage]:
      ['Skicka en partikel','Skicka nära kärnan','Skicka flera partiklar','Skicka i båda modellerna'][stage];
    lab.$('[data-next]').setAttribute('aria-label',observed&&stage<3?['Gå vidare till Rutherfords idé','Gå vidare till flera partiklar','Gå vidare till jämförelsen'][stage]:stage===3?'Skicka samma positiva partikel i båda atommodellerna':'Skicka positiva partiklar genom den visade atommodellen');
    lab.$('[data-next]').disabled=Boolean(experiment.count&&!finished);
    lab.$('[data-replay]').hidden=!observed||stage===3;
    lab.$('[data-hint]').textContent=['Följ den turkosa punkten med plus.','Nu är plusladdningen samlad i en liten kärna.','Titta först på de partiklar som går nästan rakt.','Gult är Rutherford. Turkos är Thomson.'][stage];
    lab.$('[data-explore]').hidden=stage!==3;
    lab.$('[data-pause]').hidden=!experiment.count||finished;
    lab.$('[data-pause]').textContent=lab.running?'Pausa rörelsen':'Fortsätt rörelsen';
    lab.setMetric('model',stage===0?'Thomson':stage===3?'Båda idéerna':'Rutherford');
    lab.setMetric('effect',!finished?'Följ punkten':stage===0?'Nästan rakt':stage===2?'Flest går förbi':stage===3?'Olika vägar':'Böjer av');
    lab.setMetric('clue',stage===0?'Plus utspritt':stage===2?'Liten kärna':stage===3?'Samma start':'Plus i kärnan');
    lab.$('[data-idea-title]').textContent=stage===0?'Thomsons idé':stage===3?'En rättvis jämförelse':'Rutherfords idé';
    lab.$('[data-idea]').textContent=stage===0?'Plusladdningen är utspridd i atomen. Elektroner med minus finns inuti.':
      stage===3?'Båda har lika mycket plusladdning. I den ena är den utspridd. I den andra finns den i kärnan.':
      'Plusladdningen och nästan hela atomens massa finns i en liten kärna. Runt kärnan finns mycket utrymme.';
    lab.invalidate();
  }
  function explainStage(){
    const text=[
      ['Börja med Thomsons idé.','Plusladdningen är utspridd i atomen. Skicka partikeln och se om vägen ändras.'],
      ['Prova Rutherfords idé.','Här finns en liten kärna med plusladdning. Partikeln är också positiv. Två plus stöter bort varandra.'],
      ['Prova flera partiklar.','Titta på de flesta först. Går de nära kärnan eller långt ifrån den?'],
      ['Jämför samma start.','Nu visas båda idéerna. Se vilket spår som böjer av mest nära mitten.'],
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
    lab.setExplanation(spec().count===1?'Följ punkten med plus.':'Titta på partiklarnas vägar.',
      lesson.stage===0?'Punkten passerar genom atomen. Titta på hur mycket vägen böjer.':
      lesson.stage===2?'De flesta går långt från kärnan. Följ också någon som kommer nära.':
      lesson.stage===3?'Gult är Rutherford. Turkos är Thomson. De startar på samma sätt.':
      'Pilen pekar bort från kärnan. En elektrisk kraft påverkar rörelsen: två plus stöter bort varandra.');
    lab.announce('Partikeln är skickad. Följ punkten och pilen.');
  }
  function complete(){
    if(!observeDetectorLesson(lesson,experiment))return;
    finished=true;lab.setRunning(false);
    const stage=lesson.stage;
    let title,text;
    if(stage===0){title='Partikeln gick nästan rakt.';text='Thomson tänkte att plusladdningen var utspridd i atomen. Här påverkas partikeln därför lite nära mitten.';}
    else if(stage===1){title='Partikeln böjde av nära kärnan.';text='Kärnan och partikeln är båda positiva. Två plus stöter bort varandra. Den lilla kärnan kan därför ändra partikelns väg mycket.';}
    else if(stage===2){const outcome=qualitativeScattering(experiment.models.rutherford);title='De flesta gick förbi kärnan.';text=outcome.mostPass?
      'De flesta kom långt från kärnan och gick nästan rakt. Några kom nära och böjde av mycket. Det passar med en liten kärna.':
      'Några kom nära kärnan och böjde av mycket. Andra gick längre ifrån den och påverkades mindre.';}
    else{title='Samma start gav olika vägar.';text=Math.abs(impact)<.5?
      'Det gula spåret böjer av mer nära mitten. En liten kärna förklarar stora böjningar bättre än utspridd plusladdning.':
      'Längre från mitten blir skillnaden mindre. Öppna Fler verktyg och välj Nära mitten för att jämföra igen.';}
    lab.setExplanation(title,text);lab.$('[data-discovery]').textContent=text;refresh();lab.celebrate?.(410,218);lab.announce(title+' '+text);
  }
  lab.on('[data-next]','click',()=>{
    if(experiment.count&&!finished)return;
    if(lesson.observed&&lesson.stage<3){nextDetectorStage(lesson);resetPicture();}
    else fire({custom:lesson.stage===3});
  });
  lab.on('[data-replay]','click',()=>fire());
  lab.on('[data-pause]','click',()=>{lab.setRunning(!lab.running);refresh();});
  lab.on('[data-slow]','change',e=>{slow=e.target.checked;lab.announce(slow?'Passagen visas långsamt nära mitten.':'Passagen visas med jämn uppspelningshastighet.');});
  lab.on('[data-near]','click',()=>{impact=.12;fire({custom:true});});
  lab.on('[data-far]','click',()=>{impact=1.2;fire({custom:true});});
  lab.on('[data-reset]','click',()=>{lesson=createDetectorLesson();resetPicture();});
  function aim(e){
    impact=Math.max(-2,Math.min(2,(218-lab.point(e).y)/32));experiment=createExperiment({count:0});finished=false;lab.setRunning(false);
    for(const model of ['thomson','rutherford'])preview[model]=traceTrajectory({model,charge:CHARGE,impact});
    lab.setExplanation('Släpp för att jämföra.','Handtaget flyttar starten i båda bilderna. Släpp så rör sig partiklarna.');lab.invalidate();
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
    const x=px(p.x),y=py(p.y),r=large?13:4;ctx.save();ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=calm?0:large?18:4;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    if(large){ctx.fillStyle='#173646';ctx.font='700 26px Arial,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('+',x,y);}
    ctx.restore();
  }
  lab.setDraw(({ctx,dt,running,calm:quiet,compact})=>{
    calm=Boolean(quiet);
    if(running&&experiment.count&&!finished){
      const names=visible();const close=experiment.count===1&&names.some(name=>experiment.models[name].particles.some(p=>!p.done&&Math.hypot(p.x,p.y)<1.7));
      advanceExperiment(experiment,dt,{rate:close&&slow?.5:experiment.count===1?2.2:1.6});
      if(names.every(name=>experiment.models[name].completed===experiment.count))complete();
    }
    if(wasRunning!==running){wasRunning=running;refresh();}
    const stage=lesson.stage,font=compact?32:29,names=visible(),count=experiment.count;
    ctx.save();ctx.textAlign='left';ctx.font=`600 ${font}px Arial,sans-serif`;ctx.fillStyle='#e4f5f3';ctx.fillText(stage===0?'Thomson':stage===3?'Samma start i båda modellerna':'Rutherford',38,43);
    ctx.textAlign='center';ctx.fillText('Se närmare',812,58);
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
    const line=stage===0?'Plusladdningen är utspridd':stage===1?'Två plus stöter bort varandra':stage===2?'De flesta passerar förbi kärnan':'Gult: Rutherford · Turkos: Thomson';
    ctx.fillText(line,38,414);
    ctx.fillStyle='#a8c7d0';ctx.font=`400 ${compact?30:26}px Arial,sans-serif`;ctx.fillText(stage===3?'Flytta starten med handtaget eller Fler verktyg.':'Titta på vägen. Läs sedan förklaringen ovanför.',38,452);
    ctx.restore();
  });
  resetPicture();
  return {setActive(value){lab.setActive(value);},destroy(){dragging=false;lab.destroy();}};
}
