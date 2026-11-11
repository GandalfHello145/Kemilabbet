import {attachLabTeX,installCanvasTeX} from './lab-tex.js?v=20261111-clear8';
/** Shared, local-only interface and lifecycle for the chemistry experiments. */
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const formatNumber = (value, digits=1) => Number(value).toLocaleString('sv-SE',{maximumFractionDigits:digits,useGrouping:false});
export function roundRect(ctx,x,y,w,h,r=10,fill,stroke) {
  ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}
}
const PALETTE={H:['#ffffff','#b6d2df'],O:['#ffb3a1','#d45f58'],Na:['#c2b5f8','#7864b0'],Cl:['#b3e9b0','#4f995e'],C:['#a1afb9','#3a4d60'],N:['#9acbff','#3d76ba'],Fe:['#b9c7d0','#586d7e'],Cu:['#f0b18b','#b3744c']};
export function drawAtom(ctx,x,y,r,element,{selected=false,label=true}={}) {
  ctx.save();if(selected){ctx.strokeStyle='#ffd77e';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r+7,0,Math.PI*2);ctx.stroke();}
  const colors=PALETTE[element]||['#b5e8e4','#3e969a'];
  const gradient=ctx.createRadialGradient(x-r*.36,y-r*.4,r*.08,x,y,r);gradient.addColorStop(0,colors[0]);gradient.addColorStop(1,colors[1]);
  ctx.fillStyle=gradient;ctx.shadowColor='#0005';ctx.shadowBlur=10;ctx.shadowOffsetY=4;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowColor='transparent';
  if(label){ctx.fillStyle=element==='H'?'#244451':'#f9ffff';ctx.font='600 '+Math.max(15,r*.82)+'px Arial,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(element,x,y+1);}
  ctx.restore();
}
export function drawBond(ctx,a,b,order=1,color='#b1d4dc') {
  ctx.save();ctx.strokeStyle=color;ctx.lineCap='round';ctx.lineWidth=7;
  const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1;
  for(let i=0;i<order;i++){const offset=(i-(order-1)/2)*12;ctx.beginPath();ctx.moveTo(a.x-dy/length*offset,a.y+dx/length*offset);ctx.lineTo(b.x-dy/length*offset,b.y+dx/length*offset);ctx.stroke();}ctx.restore();
}

export function createLab(host, config) {
  const id=config.id||'chemistry';
  host.classList.add('chem-lab-host');
  const steps=config.steps||[];
  host.innerHTML=[
    '<section class="chem-lab" data-tex-rendered="chem-lab" aria-labelledby="'+escapeHTML(id)+'-title">',
    '<header class="cl-header"><div><p class="cl-kicker"><i></i> PROVA SJÄLV</p><h2 id="'+escapeHTML(id)+'-title">'+escapeHTML(config.title)+'</h2><p>'+escapeHTML(config.subtitle||'')+'</p></div><button type="button" class="cl-focus-button" data-kit="focus" aria-expanded="false">⤢ Öppna större</button></header>',
    steps.length?'<ol class="cl-steps" aria-label="Experimentets steg">'+steps.map((s,i)=>'<li data-step="'+i+'"'+(i===0?' aria-current="step"':'')+'><span class="cl-step-number">'+(i+1)+'</span><div><strong>'+escapeHTML(s.title)+'</strong><small>'+escapeHTML(s.text||'')+'</small></div></li>').join('')+'</ol>':'',
    '<div class="cl-objective" data-kit="objective-box"><span data-kit="objective-icon">◎</span><div><span class="cl-objective-caption">GÖR SÅ HÄR</span><strong data-kit="objective">'+escapeHTML(config.objective||'Välj ett verktyg och undersök vad som förändras.')+'</strong></div></div>',
    '<div class="cl-workbench"><div class="cl-scene-column">',
    '<div class="cl-insight" role="status" aria-live="polite" aria-atomic="true"><span>↗</span><div><strong data-kit="explanation-title">'+escapeHTML(config.explanationTitle||'Börja med första steget.')+'</strong><p data-kit="explanation">'+escapeHTML(config.explanation||'Styr direkt i bilden eller använd verktygsknapparna. Följ sedan resultatet.')+'</p></div></div>',
    '<div class="cl-stage"><canvas class="cl-canvas" tabindex="0" aria-label="'+escapeHTML(config.canvasLabel||config.title+'. Styr i bilden eller med verktygsknapparna.')+'"></canvas><div class="cl-view-tools"><button type="button" class="cl-tools-shortcut" data-kit="tools">✦ Visa knapparna ↓</button><button data-kit="run" aria-pressed="false"'+(config.hideRun?' hidden':'')+'></button><details class="cl-view-options"><summary>Fler bildverktyg</summary><div><button data-kit="view" aria-label="Återställ vyn">Återställ vy ↺</button><label class="cl-still"><input type="checkbox" data-kit="still"> Stilla bildrörelser</label><span class="cl-pan" data-kit="pan-tools" hidden><span>Flytta vyn</span><button type="button" data-pan="left" aria-label="Visa mer åt vänster">←</button><button type="button" data-pan="right" aria-label="Visa mer åt höger">→</button><button type="button" data-pan="up" aria-label="Visa mer uppåt">↑</button><button type="button" data-pan="down" aria-label="Visa mer nedåt">↓</button></span><label class="cl-zoom">Zoom <input type="range" min="70" max="180" value="100" step="5" data-kit="zoom" aria-label="Zooma experimentet"></label></div></details></div></div>',
    '<div class="cl-metrics" aria-label="Ditt resultat">'+(config.metrics||'')+'</div></div>',
    '<aside class="cl-controls-panel" aria-label="Verktyg och reglage"><div class="cl-tool-heading"><span>DINA KNAPPAR</span><small>Använd knapparna eller dra i bilden</small></div><div class="cl-controls">'+(config.controls||'')+'</div></aside></div>',
    '<button type="button" class="cl-focus-exit" data-kit="close-focus" aria-label="Stäng det stora labbet">✕</button>',
    config.below?'<div class="cl-below">'+config.below+'</div>':'',
    '<details class="cl-model"><summary>ⓘ Om försöket och källorna</summary>'+(config.model||'<p>Storlekar, avstånd och tider har valts för att sambanden ska gå att undersöka.</p>')+'</details><p class="sr-only" data-kit="status" role="status" aria-live="polite"></p></section>'
  ].join('');
  const root=host.querySelector('.chem-lab'),canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d');
  const restoreCanvasTeX=installCanvasTeX(ctx);
  const $=selector=>root.querySelector(selector);
  const listeners=[];
  const on=(target,event,handler,options)=>{
    const element=typeof target==='string'?$(target):target;if(!element)return ()=>{};
    element.addEventListener(event,handler,options);const remove=()=>element.removeEventListener(event,handler,options);listeners.push(remove);return remove;
  };
  let active=true,inView=true,destroyed=false,draw=null,frame=0,last=0,time=0;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const readCalm=()=>Boolean(window.chemistryPreferences?.calmMotion??(document.body.dataset.motion==='calm'||reducedMotion.matches));
  let motion=true,calm=readCalm();
  let running=Boolean(config.running),zoom=1,panX=0,panY=0,width=0,height=0,dpr=1;
  let focused=false,previousOverflow='',focusReturn=null;const bursts=[];
  const logicalWidth=960,logicalHeight=460;
  function size() {
    const rect=canvas.getBoundingClientRect();const newWidth=Math.max(1,rect.width),newHeight=Math.max(1,rect.height),ratio=Math.min(devicePixelRatio||1,1.6);
    if(width!==newWidth||height!==newHeight||dpr!==ratio){width=newWidth;height=newHeight;dpr=ratio;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
  }
  function setRunning(value) {
    running=Boolean(value);
    $('[data-kit="run"]').textContent=running?'Ⅱ '+(config.pauseLabel||'Pausa experimentet'):'▶ '+(config.runLabel||'Starta experimentet');
    $('[data-kit="run"]').setAttribute('aria-pressed',String(running));
    $('[data-kit="still"]').checked=!motion;
    last=0;invalidate();
  }
  function point(event) {
    const bounds=canvas.getBoundingClientRect();
    const scale=Math.min(bounds.width/logicalWidth,bounds.height/logicalHeight);
    const offsetX=(bounds.width-logicalWidth*scale)/2,offsetY=(bounds.height-logicalHeight*scale)/2;
    return{x:(((event.clientX-bounds.left-offsetX)/scale)-logicalWidth/2)/zoom+logicalWidth/2-panX,y:(((event.clientY-bounds.top-offsetY)/scale)-logicalHeight/2)/zoom+logicalHeight/2-panY};
  }
  function tick(now) {
    frame=0;if(destroyed||!active||!inView||document.hidden||!root.isConnected){last=0;return;}
    const dt=last?Math.min(.06,Math.max(0,(now-last)/1000)):0;last=now;if(running)time+=dt;
    if(ctx&&draw){
      size();ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
      const scale=Math.min(width/logicalWidth,height/logicalHeight),offsetX=(width-logicalWidth*scale)/2,offsetY=(height-logicalHeight*scale)/2;
      ctx.save();ctx.translate(offsetX,offsetY);ctx.scale(scale,scale);ctx.translate(logicalWidth/2,logicalHeight/2);ctx.scale(zoom,zoom);ctx.translate(-logicalWidth/2+panX,-logicalHeight/2+panY);
      try {draw({ctx,width:logicalWidth,height:logicalHeight,dt,time,running,zoom,motion,calm,compact:width<560});
        for(let i=bursts.length-1;i>=0;i--){const b=bursts[i];b.age+=motion?dt:1;const t=b.age/1.05;if(t>=1){bursts.splice(i,1);continue;}ctx.save();ctx.globalAlpha=(1-t)*.9;ctx.strokeStyle='#7ce5cc';ctx.lineWidth=3*(1-t);ctx.beginPath();ctx.arc(b.x,b.y,20+100*t,0,Math.PI*2);ctx.stroke();for(let k=0;k<12;k++){const a=k*Math.PI/6;ctx.fillStyle=k%2?'#ffe093':'#7ce5cc';ctx.beginPath();ctx.arc(b.x+Math.cos(a)*(20+110*t),b.y+Math.sin(a)*(20+110*t),3*(1-t),0,Math.PI*2);ctx.fill();}ctx.restore();}
      }
      catch(error){setRunning(false);$('[data-kit="status"]').textContent='Experimentet kunde inte ritas. Börja om eller ladda om sidan.';console.error(error);draw=null;}
      ctx.restore();
    }
    if(!frame&&!destroyed&&active&&inView&&!document.hidden)frame=requestAnimationFrame(tick);
  }
  function invalidate(){if(!frame&&active&&inView&&!destroyed&&!document.hidden)frame=requestAnimationFrame(tick);}
  function setActive(value){active=Boolean(value);last=0;if(active)invalidate();else{if(focused)setFocus(false);cancelAnimationFrame(frame);frame=0;}}
  const visibility=()=>{last=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else invalidate();};
  document.addEventListener('visibilitychange',visibility);
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
    inView=entries[0].isIntersecting;last=0;if(inView)invalidate();else{cancelAnimationFrame(frame);frame=0;}
  },{rootMargin:'150px'}):null;
  observer?.observe(root);
  on('[data-kit="run"]','click',()=>setRunning(!running));
  on('[data-kit="still"]','change',e=>{motion=!e.target.checked;invalidate();});
  const syncPreferences=()=>{calm=readCalm();bursts.length=0;invalidate();};
  on(window,'chemistry:preferences',syncPreferences);
  if(reducedMotion.addEventListener)on(reducedMotion,'change',syncPreferences);
  function updateView(){const maxX=logicalWidth*Math.max(0,1-1/zoom)/2,maxY=logicalHeight*Math.max(0,1-1/zoom)/2;panX=Math.max(-maxX,Math.min(maxX,panX));panY=Math.max(-maxY,Math.min(maxY,panY));$('[data-kit="pan-tools"]').hidden=zoom<=1.01;$('[data-kit="zoom"]').value=Math.round(zoom*100);invalidate();}
  on('[data-kit="zoom"]','input',e=>{zoom=Number(e.target.value)/100;updateView();});
  root.querySelectorAll('[data-pan]').forEach(button=>on(button,'click',()=>{const direction=button.dataset.pan;if(direction==='left')panX+=60;if(direction==='right')panX-=60;if(direction==='up')panY+=45;if(direction==='down')panY-=45;updateView();}));
  on('[data-kit="view"]','click',()=>{zoom=1;panX=0;panY=0;updateView();});
  on(canvas,'keydown',e=>{
    if(e.key==='+'||e.key==='='||e.key==='-'){e.preventDefault();zoom=Math.max(.7,Math.min(1.8,zoom+(e.key==='-'?-.05:.05)));updateView();}
  });
  if(config.zoom===false){$('.cl-zoom').hidden=true;$('[data-kit="view"]').hidden=true;}
  function setFocus(value){
    if(focused===value)return;focused=value;
    if(!focused)showTools(false);
    root.classList.toggle('cl-focus',focused);$('[data-kit="focus"]').textContent=focused?'✕ Tillbaka till kemisidan':'⤢ Öppna större';$('[data-kit="focus"]').setAttribute('aria-expanded',String(focused));
    if(focused){focusReturn=document.activeElement;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.scrollTop=0;$('[data-kit="focus"]').focus();}
    else{document.body.style.overflow=previousOverflow;root.removeAttribute('role');root.removeAttribute('aria-modal');focusReturn?.focus?.({preventScroll:true});}
    inView=true;last=0;invalidate();
  }
  function showTools(value){
    root.classList.toggle('cl-tools-open',value);$('[data-kit="tools"]').textContent=value?'✕ Dölj knapparna':'✦ Visa knapparna ↓';$('[data-kit="tools"]').setAttribute('aria-expanded',String(value));
    if(value){if(root.clientHeight<550){$('.cl-controls-panel').scrollIntoView({block:'start',behavior:'instant'});}else{const scene=$('.cl-scene-column');root.scrollTop+=scene.getBoundingClientRect().top-root.getBoundingClientRect().top;}}
  }
  on('[data-kit="tools"]','click',()=>showTools(!root.classList.contains('cl-tools-open')));
  on(root,'focusin',e=>{if(focused&&root.clientWidth<900&&$('.cl-controls-panel').contains(e.target)&&!root.classList.contains('cl-tools-open'))showTools(true);});
  on('[data-kit="close-focus"]','click',()=>setFocus(false));
  on(root,'scroll',()=>root.classList.toggle('cl-scrolled',root.scrollTop>40),{passive:true});
  on('[data-kit="focus"]','click',()=>setFocus(!focused));
  on(root,'keydown',e=>{
    if(!focused)return;
    if(e.key==='Escape'){e.preventDefault();setFocus(false);}
    if(e.key==='Tab'){const nodes=[...root.querySelectorAll('button,input,select,summary,canvas[tabindex],a[href]')].filter(n=>!n.disabled&&n.tabIndex>=0&&n.getClientRects().length);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
  });
  setRunning(running);
  const restoreDOMTeX=attachLabTeX(root);
  const controller={
    root,canvas,ctx,$,on,point,setRunning,setActive,invalidate,
    setStep(index){root.querySelectorAll('[data-step]').forEach((node,i)=>{node.classList.toggle('cl-step-done',i<index);if(i===index)node.setAttribute('aria-current','step');else node.removeAttribute('aria-current');});},
    setObjective(text,success=false){const node=$('[data-kit="objective"]');if(node.textContent!==String(text))node.textContent=text;$('[data-kit="objective-box"]').classList.toggle('cl-objective-done',success);$('[data-kit="objective-icon"]').textContent=success?'✓':'◎';},
    celebrate(x=480,y=230){if(motion&&!calm){bursts.push({x,y,age:0});invalidate();}},
    setDraw(fn){draw=fn;invalidate();},
    setMetric(key,value){const node=$('[data-metric="'+key+'"]');if(node&&node.textContent!==String(value))node.textContent=value;},
    setExplanation(title,text){const heading=$('[data-kit="explanation-title"]'),body=$('[data-kit="explanation"]');if(heading.textContent!==String(title))heading.textContent=title;if(body.textContent!==String(text))body.textContent=text;},
    announce(text){$('[data-kit="status"]').textContent=text;},
    get running(){return running;},get zoom(){return zoom;},
    destroy(){if(destroyed)return;if(focused)setFocus(false);destroyed=true;cancelAnimationFrame(frame);observer?.disconnect();document.removeEventListener('visibilitychange',visibility);listeners.forEach(remove=>remove());restoreDOMTeX();restoreCanvasTeX();draw=null;}
  };
  return controller;
}
