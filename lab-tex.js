/**
 * Local TeX → SVG-path renderer shared by the chemistry experiments.
 * Visual glyphs are MathJax SVG, never a substitute font or CDN resource.
 * Source text remains unchanged for screen readers and textContent comparisons.
 */
const SVG_NS='http://www.w3.org/2000/svg';
const TEX_LIMIT=700,IMAGE_LIMIT=160;
const texCache=new Map(),imageCache=new Map(),canvasHooks=new WeakMap(),svgOwners=new WeakMap();
let engine=null,enginePromise=null,serial=0;
export const texStats={typeset:0,canvasDraws:0,domRuns:0,selects:0};

const accents={å:'\\mathring{\\mathrm{a}}',Å:'\\mathring{\\mathrm{A}}',ä:'\\ddot{\\mathrm{a}}',Ä:'\\ddot{\\mathrm{A}}',ö:'\\ddot{\\mathrm{o}}',Ö:'\\ddot{\\mathrm{O}}',é:'\\acute{\\mathrm{e}}',É:'\\acute{\\mathrm{E}}',ü:'\\ddot{\\mathrm{u}}'};
const symbols={'→':'\\rightarrow','←':'\\leftarrow','↗':'\\nearrow','↘':'\\searrow','↔':'\\leftrightarrow','↺':'\\circlearrowleft','↻':'\\circlearrowright','α':'\\alpha','β':'\\beta','Δ':'\\Delta','×':'\\times','·':'\\cdot','−':'-','–':'\\text{--}','—':'\\text{---}','≥':'\\geq','≤':'\\leq','≈':'\\approx','≠':'\\ne','±':'\\pm','°':'{}^{\\circ}','✓':'\\checkmark','✔':'\\checkmark','✕':'\\times','✦':'\\star','◎':'\\odot','⊙':'\\odot','⤢':'\\nearrow','▶':'\\blacktriangleright','Ⅱ':'\\parallel','❄':'\\ast','☀':'\\odot','ϟ':'\\mathrm{e}^{-}','▾':'\\blacktriangledown','…':'\\ldots','•':'\\bullet','●':'\\bullet','○':'\\circ','∶':':','\\':'\\backslash','^':'\\wedge','~':'\\sim','²':'{}^{2}','³':'{}^{3}'};
const subs={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
Object.assign(symbols,{'ⓘ':'\\mathrm{i}','＋':'+','↑':'\\uparrow','↓':'\\downarrow','↕':'\\updownarrow'});
const supers={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁺':'+','⁻':'-'};
function escapedText(value){return value.replace(/[\\{}%$&#_^~]/g,c=>({'\\':'\\textbackslash{}','{':'\\{','}':'\\}','%':'\\%','$':'\\$','&':'\\&','#':'\\#','_':'\\_','^':'\\textasciicircum{}','~':'\\textasciitilde{}'}[c]));}

/** Safe authored prose, Swedish accents, arrows and chemical indices to TeX. */
export function toTeX(value){
  const source=String(value??'');
  if(source.startsWith('\\(')&&source.endsWith('\\)'))return source.slice(2,-2);
  let result='',buffer='';
  const flush=()=>{if(buffer){result+='\\text{'+escapedText(buffer)+'}';buffer='';}};
  for(const c of source){
    if(c==='\ufe0f'||c==='\u200d')continue;
    if(accents[c]){flush();result+=accents[c];}
    else if(subs[c]!==undefined){flush();result+='{}_{'+subs[c]+'}';}
    else if(supers[c]!==undefined){flush();result+='{}^{'+supers[c]+'}';}
    else if(symbols[c]){flush();result+=symbols[c];}
    else if(c==='\u00a0')buffer+=' ';
    else buffer+=c;
  }
  flush();return result||'\\text{ }';
}

function remember(cache,key,value,limit){cache.delete(key);cache.set(key,value);while(cache.size>limit)cache.delete(cache.keys().next().value);return value;}
export function loadLabTeX(){
  if(enginePromise)return enginePromise;
  enginePromise=new Promise((resolve,reject)=>{
    if(globalThis.MathJax?.tex2svg&&globalThis.MathJax?.startup?.promise){globalThis.MathJax.startup.promise.then(()=>{engine=globalThis.MathJax;resolve(engine);},reject);return;}
    const base=new URL('./vendor/mathjax/',import.meta.url);
    globalThis.MathJax={
      loader:{paths:{mathjax:base.href.replace(/\/$/,'')}},
      startup:{typeset:false},
      tex:{packages:['base','ams','newcommand','textmacros','color','boldsymbol'],maxBuffer:24000},
      svg:{fontCache:'none',mtextInheritFont:false,internalSpeechTitles:false},
      options:{enableMenu:false,enableAssistiveMml:false,renderActions:{addMenu:[],assistiveMml:[]}},
    };
    const script=document.createElement('script');script.src=new URL('tex-svg-full.js?v=3.2.2-local',base).href;script.async=true;
    script.onload=()=>globalThis.MathJax.startup.promise.then(()=>{engine=globalThis.MathJax;resolve(engine);},reject);
    script.onerror=()=>reject(new Error('Den lokala TeX-renderaren kunde inte öppnas.'));
    document.head.append(script);
  });
  return enginePromise;
}

function entryFor(text,bold=false){
  const key=(bold?'b:':'n:')+text;
  if(texCache.has(key)){const entry=texCache.get(key);remember(texCache,key,entry,TEX_LIMIT);return entry;}
  if(!engine)return null;
  const source=toTeX(text),container=engine.tex2svg(bold?'\\boldsymbol{'+source+'}':source,{display:false,em:16,ex:8,containerWidth:100000});
  const svg=container.querySelector('svg');
  if(!svg||svg.querySelector('[data-mml-node="merror"]'))throw new Error('TeX kunde inte renderas: '+text);
  // No textual annotation may alter textContent or rely on a fallback font.
  svg.querySelectorAll('title,desc,metadata').forEach(node=>node.remove());
  if(svg.querySelector('text'))throw new Error('TeX saknar en vektorglyf: '+text);
  const box=svg.getAttribute('viewBox').trim().split(/\s+/).map(Number);
  svg.setAttribute('xmlns',SVG_NS);svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.removeAttribute('role');
  svg.style.cssText='overflow:visible;';
  const value={svg,width:box[2]/1000,height:box[3]/1000,ascent:-box[1]/1000,depth:(box[1]+box[3])/1000,tex:source};
  texStats.typeset+=1;return remember(texCache,key,value,TEX_LIMIT);
}

function svgClone(entry){
  const svg=entry.svg.cloneNode(true);
  svg.setAttribute('width',entry.width+'em');svg.setAttribute('height',entry.height+'em');
  svg.style.width=entry.width+'em';svg.style.height=entry.height+'em';
  svg.style.verticalAlign=(-entry.depth)+'em';
  return svg;
}

function canvasImage(entry,color,bold,text){
  const key=(bold?'b:':'n:')+color+'|'+text;
  if(imageCache.has(key)){const value=imageCache.get(key);remember(imageCache,key,value,IMAGE_LIMIT);return value;}
  const svg=entry.svg.cloneNode(true);svg.setAttribute('width',String(Math.max(1,entry.width*96)));svg.setAttribute('height',String(Math.max(1,entry.height*96)));svg.style.color=color;
  const image=new Image();const value={image,ready:false};
  image.onload=()=>{value.ready=true;};
  image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg));
  return remember(imageCache,key,value,IMAGE_LIMIT);
}

/** Install a bounded TeX image cache on one context; native drawing APIs stay intact. */
export function installCanvasTeX(ctx){
  if(!ctx)return()=>{};
  if(canvasHooks.has(ctx))return canvasHooks.get(ctx);
  const own={fillText:Object.getOwnPropertyDescriptor(ctx,'fillText'),strokeText:Object.getOwnPropertyDescriptor(ctx,'strokeText'),measureText:Object.getOwnPropertyDescriptor(ctx,'measureText')};
  const nativeMeasure=ctx.measureText.bind(ctx),nativeFill=ctx.fillText.bind(ctx),nativeStroke=ctx.strokeText.bind(ctx);
  const plainText=()=>globalThis.document?.body?.dataset.labText==='plain';
  const withReadableFont=callback=>{const before=ctx.font;ctx.font=before.replace(/(\d+(?:\.\d+)?px)\s+.+$/,'$1 '+(globalThis.document?.body?.dataset.readFont==='serif'?'Georgia':'Arial'));try{return callback();}finally{ctx.font=before;}};
  const style=()=>({size:Number(/([\d.]+)px/.exec(ctx.font)?.[1]||16),bold:/\b(?:bold|[6-9]00)\b/.test(ctx.font)});
  function draw(text,x,y,maxWidth,stroke=false){
    text=String(text);
    if(plainText())return withReadableFont(()=>{const native=stroke?nativeStroke:nativeFill;if(Number.isFinite(maxWidth)&&maxWidth>0)native(text,x,y,maxWidth);else native(text,x,y);});
    if(!engine)return;
    let entry;try{entry=entryFor(text,style().bold);}catch(error){console.error(error);return;}
    const {size,bold}=style(),color=typeof(stroke?ctx.strokeStyle:ctx.fillStyle)==='string'?(stroke?ctx.strokeStyle:ctx.fillStyle):'#000';
    const value=canvasImage(entry,color,bold,text);if(!value.ready)return;
    let width=entry.width*size,height=entry.height*size;
    if(Number.isFinite(maxWidth)&&maxWidth>0)width=Math.min(width,maxWidth);
    let left=x,top=y-entry.ascent*size;
    if(['center'].includes(ctx.textAlign))left-=width/2;
    else if(['right','end'].includes(ctx.textAlign))left-=width;
    if(['top','hanging'].includes(ctx.textBaseline))top=y;
    else if(ctx.textBaseline==='middle')top=y-height/2;
    else if(['bottom','ideographic'].includes(ctx.textBaseline))top=y-height;
    ctx.drawImage(value.image,left,top,width,height);texStats.canvasDraws+=1;
  }
  ctx.fillText=function(text,x,y,maxWidth){draw(text,x,y,maxWidth);};
  ctx.strokeText=function(text,x,y,maxWidth){draw(text,x,y,maxWidth,true);};
  ctx.measureText=function(text){if(plainText())return withReadableFont(()=>nativeMeasure(String(text)));const measured=nativeMeasure(String(text));if(!engine)return measured;const {size,bold}=style();let entry;try{entry=entryFor(String(text),bold);}catch{return measured;}return new Proxy(measured,{get(target,key){if(key==='width')return entry.width*size;if(key==='actualBoundingBoxAscent')return entry.ascent*size;if(key==='actualBoundingBoxDescent')return entry.depth*size;const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;}});};
  loadLabTeX().catch(console.error);
  const restore=()=>{for(const[name,descriptor]of Object.entries(own)){if(descriptor)Object.defineProperty(ctx,name,descriptor);else delete ctx[name];}canvasHooks.delete(ctx);};
  canvasHooks.set(ctx,restore);return restore;
}

/** One observer per experiment; only changed text nodes are typeset. */
export function attachLabTeX(root){
  let destroyed=false,queued=false,ready=false;
  const wrappers=new Set(),svgSources=new Map(),selects=new Map(),removers=[];
  function hasText(node){
    if(node.nodeType===3)return Boolean(node.nodeValue?.trim());
    if(node.nodeType!==1)return false;
    if(node.matches('.lab-tex-visual,[data-lab-tex="svg"],script,style,textarea'))return false;
    if(node.namespaceURI===SVG_NS)return node.localName==='text'||Boolean(node.querySelector('text'));
    return Boolean(node.textContent.trim())||node.matches('select,option');
  }
  function relevant(record){
    const target=record.target.nodeType===1?record.target:record.target.parentElement;
    if(target?.closest('.lab-tex-visual,.lab-tex-source,[data-lab-tex="svg"]'))return false;
    if(record.type==='attributes')return target?.matches('svg text,select,option');
    if(record.type==='characterData')return true;
    if(target?.matches('svg text,select,option'))return true;
    return [...record.addedNodes,...record.removedNodes].some(hasText);
  }
  const observer=new MutationObserver(records=>{if(records.some(relevant))schedule();});
  const watch=()=>{if(!destroyed)observer.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['x','y','transform','text-anchor','font-size','fill','selected','disabled','hidden']});};
  function schedule(){if(destroyed||!ready||queued)return;queued=true;queueMicrotask(()=>{queued=false;if(!destroyed)render();});}
  function listen(node,event,handler){node.addEventListener(event,handler);removers.push(()=>node.removeEventListener(event,handler));}

  function domRun(node){
    const plain=node.nodeValue;if(!plain.trim())return;
    const run=document.createElement('span');run.className='lab-tex-run';run.dataset.labTex='run';
    const source=document.createElement('span');source.className='lab-tex-source';source.textContent=plain;
    const visual=document.createElement('span');visual.className='lab-tex-visual';visual.setAttribute('aria-hidden','true');
    if(/^\s/.test(plain))visual.style.marginLeft='.25em';
    const bold=Number.parseInt(getComputedStyle(node.parentElement).fontWeight,10)>=600;
    const chunks=plain.match(/\S+\s*|^\s+/g)||[plain];
    if(/^\s/.test(plain))visual.append(document.createElement('wbr'));
    for(const chunk of chunks){const word=chunk.trim();if(!word)continue;const entry=entryFor(word,bold),item=document.createElement('span');item.className='lab-tex-word';item.append(svgClone(entry));if(/\s$/.test(chunk))item.style.marginRight='.25em';visual.append(item,document.createElement('wbr'));}
    run.append(source,visual);node.replaceWith(run);wrappers.add(run);texStats.domRuns+=1;
  }
  function svgText(node){
    const plain=node.textContent;if(!plain.trim()){svgSources.get(node)?.group.remove();return;}
    if(svgOwners.has(node)&&svgOwners.get(node)!==root)return;
    svgOwners.set(node,root);
    let state=svgSources.get(node);
    const signature=[plain,node.getAttribute('x'),node.getAttribute('y'),node.getAttribute('transform'),node.getAttribute('text-anchor'),node.getAttribute('fill'),node.getAttribute('font-size')].join('|');
    if(state?.signature===signature&&state.group.isConnected)return;
    if(!state){state={opacity:node.getAttribute('opacity'),group:document.createElementNS(SVG_NS,'g')};svgSources.set(node,state);}
    state.signature=signature;state.group.remove();state.group.replaceChildren();state.group.setAttribute('data-lab-tex','svg');state.group.setAttribute('aria-hidden','true');state.group.style.pointerEvents='none';
    const computed=getComputedStyle(node),size=Number.parseFloat(node.getAttribute('font-size')||computed.fontSize)||12,bold=Number.parseInt(computed.fontWeight,10)>=600,entry=entryFor(plain,bold);
    const x=Number.parseFloat(node.getAttribute('x'))||0,y=Number.parseFloat(node.getAttribute('y'))||0,anchor=node.getAttribute('text-anchor')||computed.textAnchor;
    const width=entry.width*size,height=entry.height*size,left=x-(anchor==='middle'?width/2:anchor==='end'?width:0);
    const svg=svgClone(entry);svg.setAttribute('x',String(left));svg.setAttribute('y',String(y-entry.ascent*size));svg.setAttribute('width',String(width));svg.setAttribute('height',String(height));svg.style.width=width+'px';svg.style.height=height+'px';svg.style.verticalAlign='';
    state.group.style.color=node.getAttribute('fill')||computed.fill||'currentColor';
    if(node.getAttribute('transform'))state.group.setAttribute('transform',node.getAttribute('transform'));else state.group.removeAttribute('transform');
    state.group.append(svg);node.setAttribute('opacity','0');node.after(state.group);
  }
  function selectedLabel(select){return select.selectedOptions[0]?.textContent||select.options[select.selectedIndex]?.textContent||'';}
  function nativeSelect(select){
    if(selects.has(select)){selects.get(select).sync();return;}
    const shell=document.createElement('span');shell.className='lab-tex-select';shell.dataset.labTex='select';
    const button=document.createElement('button');button.type='button';button.className='lab-tex-select-button';button.setAttribute('role','combobox');button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');
    const chosen=document.createElement('span'),arrow=document.createElement('span');arrow.className='lab-tex-select-arrow';arrow.textContent='▾';arrow.setAttribute('aria-hidden','true');button.append(chosen,arrow);
    const list=document.createElement('span');list.className='lab-tex-options';list.setAttribute('role','listbox');list.id='lab-tex-options-'+(++serial);list.hidden=true;button.setAttribute('aria-controls',list.id);
    const original={tabindex:select.getAttribute('tabindex'),aria:select.getAttribute('aria-hidden'),value:Object.getOwnPropertyDescriptor(select,'value'),index:Object.getOwnPropertyDescriptor(select,'selectedIndex'),focus:Object.getOwnPropertyDescriptor(select,'focus')};
    select.classList.add('lab-tex-native-select');select.setAttribute('aria-hidden','true');select.tabIndex=-1;select.after(shell);shell.append(button,list);
    let active=Math.max(0,select.selectedIndex),open=false,typed='',typedAt=0;
    const options=[];
    const label=()=>{const aria=select.getAttribute('aria-label');if(aria)return aria;return [...(select.labels||[])].map(node=>{const clone=node.cloneNode(true);clone.querySelectorAll('select,.lab-tex-select,input,button,output').forEach(n=>n.remove());return clone.textContent.trim();}).join(' ')||'Välj alternativ';};
    const close=()=>{open=false;list.hidden=true;button.setAttribute('aria-expanded','false');button.removeAttribute('aria-activedescendant');};
    function highlight(){options.forEach((item,index)=>{item.classList.toggle('lab-tex-option-active',index===active);item.setAttribute('aria-selected',String(index===select.selectedIndex));});if(options[active]){button.setAttribute('aria-activedescendant',options[active].id);options[active].scrollIntoView({block:'nearest'});}}
    function show(){if(select.disabled)return;open=true;list.hidden=false;button.setAttribute('aria-expanded','true');active=Math.max(0,select.selectedIndex);highlight();}
    function commit(index){const option=select.options[index];if(!option||option.disabled)return;select.value=option.value;close();select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));button.focus();}
    function sync(){button.disabled=select.disabled;const value=selectedLabel(select);if(chosen.textContent!==value)chosen.textContent=value;button.setAttribute('aria-label',label()+': '+value);options.forEach((item,index)=>{item.disabled=select.options[index]?.disabled||false;item.setAttribute('aria-selected',String(index===select.selectedIndex));});}
    [...select.options].forEach((option,index)=>{const item=document.createElement('button');item.type='button';item.className='lab-tex-option';item.setAttribute('role','option');item.tabIndex=-1;item.id=list.id+'-'+index;item.textContent=option.textContent;item.disabled=option.disabled;item.setAttribute('aria-selected',String(index===select.selectedIndex));list.append(item);options.push(item);listen(item,'click',event=>{event.preventDefault();event.stopPropagation();commit(index);});});
    listen(button,'click',event=>{event.preventDefault();event.stopPropagation();if(open)close();else show();schedule();});
    listen(button,'keydown',event=>{
      if(['ArrowDown','ArrowUp','Home','End','Enter',' ','Escape'].includes(event.key))event.preventDefault();
      if(event.key==='Escape'){event.stopPropagation();close();return;}
      if(event.key==='Tab'){close();return;}
      if(event.key==='Enter'||event.key===' '){if(open)commit(active);else show();return;}
      if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){if(!open)show();const direction=event.key==='ArrowUp'?-1:1;if(event.key==='Home')active=0;else if(event.key==='End')active=options.length-1;else active=Math.max(0,Math.min(options.length-1,active+direction));let guard=0;while(select.options[active]?.disabled&&guard++<options.length)active=Math.max(0,Math.min(options.length-1,active+direction));highlight();return;}
      if(event.key.length===1&&!event.ctrlKey&&!event.metaKey){if(performance.now()-typedAt>900)typed='';typed+=event.key.toLocaleLowerCase('sv');typedAt=performance.now();const index=[...select.options].findIndex(o=>!o.disabled&&o.textContent.trim().toLocaleLowerCase('sv').startsWith(typed));if(index>=0){if(!open)show();active=index;highlight();}}
    });
    listen(select,'change',()=>{sync();schedule();});
    for(const prop of ['value','selectedIndex']){const descriptor=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,prop);Object.defineProperty(select,prop,{configurable:true,get(){return descriptor.get.call(this);},set(value){descriptor.set.call(this,value);sync();schedule();}});}
    select.focus=options=>button.focus(options);
    for(const node of select.labels||[])listen(node,'click',event=>{if(event.target===node||(!shell.contains(event.target)&&event.target!==select)){event.preventDefault();button.focus();}});
    listen(root,'pointerdown',event=>{if(open&&!shell.contains(event.target))close();});
    const state={sync,destroy(){close();shell.remove();select.classList.remove('lab-tex-native-select');for(const[prop,value]of [['tabindex',original.tabindex],['aria-hidden',original.aria]]){if(value===null)select.removeAttribute(prop);else select.setAttribute(prop,value);}for(const[prop,descriptor]of [['value',original.value],['selectedIndex',original.index],['focus',original.focus]]){if(descriptor)Object.defineProperty(select,prop,descriptor);else delete select[prop];}}};
    selects.set(select,state);texStats.selects+=1;sync();
  }
  function render(){
    observer.disconnect();
    try{
      root.querySelectorAll('select').forEach(nativeSelect);
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){const p=node.parentElement;if(!p||!node.nodeValue.trim()||p.closest('.lab-tex-source,.lab-tex-visual,select,script,style,textarea,svg,[data-lab-tex="svg"]'))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});
      const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(domRun);
      root.querySelectorAll('svg text').forEach(node=>{if(!node.closest('[data-lab-tex="svg"]'))svgText(node);});
      for(const[node,state]of svgSources)if(!root.contains(node)){state.group.remove();svgSources.delete(node);svgOwners.delete(node);}
      for(const run of wrappers)if(!root.contains(run))wrappers.delete(run);
    }catch(error){console.error('LaTeX i experimentet:',error);}
    finally{watch();}
  }
  loadLabTeX().then(()=>{if(destroyed)return;ready=true;render();}).catch(console.error);
  return()=>{destroyed=true;observer.disconnect();removers.forEach(remove=>remove());for(const state of selects.values())state.destroy();for(const[node,state]of svgSources){state.group.remove();svgOwners.delete(node);if(state.opacity===null)node.removeAttribute('opacity');else node.setAttribute('opacity',state.opacity);}for(const run of wrappers)if(run.parentNode)run.replaceWith(document.createTextNode(run.querySelector('.lab-tex-source')?.textContent||''));};
}

export function labTeXCacheInfo(){return{tex:texCache.size,images:imageCache.size,texLimit:TEX_LIMIT,imageLimit:IMAGE_LIMIT,...texStats};}
