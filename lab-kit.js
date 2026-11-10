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
  host.innerHTML=[
    '<section class="chem-lab" data-tex-rendered="chem-lab" aria-labelledby="'+escapeHTML(id)+'-title">',
    '<header class="cl-header"><div><p class="cl-kicker"><i></i> ETT EXPERIMENT ATT STYRA</p><h2 id="'+escapeHTML(id)+'-title">'+escapeHTML(config.title)+'</h2><p>'+escapeHTML(config.subtitle||'')+'</p></div><span class="cl-badge">'+escapeHTML(config.badge||'UTFORSKA · FÖRKLARA')+'</span></header>',
    '<div class="cl-metrics" aria-label="Resultat från modellen">'+(config.metrics||'')+'</div>',
    '<div class="cl-stage"><div class="cl-stage-label">MODELLVY <span>Dra, prova och följ sambanden</span></div><canvas class="cl-canvas" tabindex="0" aria-label="'+escapeHTML(config.canvasLabel||config.title+'. Interaktiv modell med reglage nedanför.')+'"></canvas><div class="cl-view-tools"><button data-kit="run" aria-pressed="false">▶ Starta</button><button data-kit="view" aria-label="Återställ vyn">Återställ vy ↺</button><label class="cl-still"><input type="checkbox" data-kit="still"> Stilla rörelse</label><span class="cl-pan" data-kit="pan-tools" hidden><span>Flytta vyn</span><button type="button" data-pan="left" aria-label="Visa mer åt vänster">←</button><button type="button" data-pan="right" aria-label="Visa mer åt höger">→</button><button type="button" data-pan="up" aria-label="Visa mer uppåt">↑</button><button type="button" data-pan="down" aria-label="Visa mer nedåt">↓</button></span><label class="cl-zoom">Zoom <input type="range" min="70" max="180" value="100" step="5" data-kit="zoom" aria-label="Zooma modellvyn"></label></div></div>',
    '<div class="cl-controls">'+(config.controls||'')+'</div>',
    '<div class="cl-insight"><span>↗</span><div><strong data-kit="explanation-title">'+escapeHTML(config.explanationTitle||'Prova en förändring.')+'</strong><p data-kit="explanation">'+escapeHTML(config.explanation||'Följ vad som händer i modellen och förklara det tillsammans.')+'</p></div></div>',
    config.below?'<div class="cl-below">'+config.below+'</div>':'',
    '<div class="cl-questions"><p class="cl-kicker">UNDERSÖK TILLSAMMANS</p><ol>'+(config.questions||[]).map(q=>'<li>'+escapeHTML(q)+'</li>').join('')+'</ol></div>',
    '<details class="cl-model"><summary>Så fungerar modellen · antaganden och källor</summary>'+(config.model||'<p>En schematisk skolmodell. Avstånd, storlekar och tider är förenklade.</p>')+'</details><p class="sr-only" data-kit="status" role="status" aria-live="polite"></p></section>'
  ].join('');
  const root=host.querySelector('.chem-lab'),canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d');
  const $=selector=>root.querySelector(selector);
  const listeners=[];
  const on=(target,event,handler,options)=>{
    const element=typeof target==='string'?$(target):target;if(!element)return ()=>{};
    element.addEventListener(event,handler,options);const remove=()=>element.removeEventListener(event,handler,options);listeners.push(remove);return remove;
  };
  let active=true,inView=true,destroyed=false,draw=null,frame=0,last=0,time=0;
  let motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  let running=Boolean(config.running)&&motion,zoom=1,panX=0,panY=0,width=0,height=0,dpr=1;
  const logicalWidth=960,logicalHeight=460;
  function size() {
    const rect=canvas.getBoundingClientRect();const newWidth=Math.max(1,rect.width),newHeight=Math.max(1,rect.height),ratio=Math.min(devicePixelRatio||1,1.6);
    if(width!==newWidth||height!==newHeight||dpr!==ratio){width=newWidth;height=newHeight;dpr=ratio;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
  }
  function setRunning(value) {
    running=Boolean(value);if(running)motion=true;
    $('[data-kit="run"]').textContent=running?'Ⅱ Pausa':'▶ Starta';
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
      try {draw({ctx,width:logicalWidth,height:logicalHeight,dt,time,running,zoom,motion,compact:width<560});}
      catch(error){setRunning(false);$('[data-kit="status"]').textContent='Modellvyn kunde inte ritas. Börja om eller ladda om sidan.';console.error(error);draw=null;}
      ctx.restore();
    }
    if(!frame&&!destroyed&&active&&inView&&!document.hidden)frame=requestAnimationFrame(tick);
  }
  function invalidate(){if(!frame&&active&&inView&&!destroyed&&!document.hidden)frame=requestAnimationFrame(tick);}
  function setActive(value){active=Boolean(value);last=0;if(active)invalidate();else{cancelAnimationFrame(frame);frame=0;}}
  const visibility=()=>{last=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else invalidate();};
  document.addEventListener('visibilitychange',visibility);
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
    inView=entries[0].isIntersecting;last=0;if(inView)invalidate();else{cancelAnimationFrame(frame);frame=0;}
  },{rootMargin:'150px'}):null;
  observer?.observe(root);
  on('[data-kit="run"]','click',()=>setRunning(!running));
  on('[data-kit="still"]','change',e=>{motion=!e.target.checked;if(!motion)setRunning(false);invalidate();});
  function updateView(){const maxX=logicalWidth*Math.max(0,1-1/zoom)/2,maxY=logicalHeight*Math.max(0,1-1/zoom)/2;panX=Math.max(-maxX,Math.min(maxX,panX));panY=Math.max(-maxY,Math.min(maxY,panY));$('[data-kit="pan-tools"]').hidden=zoom<=1.01;$('[data-kit="zoom"]').value=Math.round(zoom*100);invalidate();}
  on('[data-kit="zoom"]','input',e=>{zoom=Number(e.target.value)/100;updateView();});
  root.querySelectorAll('[data-pan]').forEach(button=>on(button,'click',()=>{const direction=button.dataset.pan;if(direction==='left')panX+=60;if(direction==='right')panX-=60;if(direction==='up')panY+=45;if(direction==='down')panY-=45;updateView();}));
  on('[data-kit="view"]','click',()=>{zoom=1;panX=0;panY=0;updateView();});
  on(canvas,'keydown',e=>{
    if(e.key==='+'||e.key==='='||e.key==='-'){e.preventDefault();zoom=Math.max(.7,Math.min(1.8,zoom+(e.key==='-'?-.05:.05)));updateView();}
  });
  if(config.zoom===false){$('.cl-zoom').hidden=true;$('[data-kit="view"]').hidden=true;}
  setRunning(running);
  const controller={
    root,canvas,ctx,$,on,point,setRunning,setActive,invalidate,
    setDraw(fn){draw=fn;invalidate();},
    setMetric(key,value){const node=$('[data-metric="'+key+'"]');if(node&&node.textContent!==String(value))node.textContent=value;},
    setExplanation(title,text){const heading=$('[data-kit="explanation-title"]'),body=$('[data-kit="explanation"]');if(heading.textContent!==String(title))heading.textContent=title;if(body.textContent!==String(text))body.textContent=text;},
    announce(text){$('[data-kit="status"]').textContent=text;},
    get running(){return running;},get zoom(){return zoom;},
    destroy(){if(destroyed)return;destroyed=true;cancelAnimationFrame(frame);observer?.disconnect();document.removeEventListener('visibilitychange',visibility);listeners.forEach(remove=>remove());draw=null;}
  };
  return controller;
}
