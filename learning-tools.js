/** Optional reading and writing supports. Preferences never contain answers. */
const KEY = 'kemilabbet-reading-tools-v1';
const DEFAULTS = {scale:1,font:'sans',spacing:'normal',theme:'paper',plainLabs:false,calmMotion:true,focus:false,ruler:false,rate:.9};
let preferences = {...DEFAULTS};
try { preferences = {...DEFAULTS,...JSON.parse(localStorage.getItem(KEY)||'{}')}; } catch {}
preferences.scale = [1,1.15,1.3,1.5].includes(Number(preferences.scale)) ? Number(preferences.scale) : 1;
preferences.font = ['sans','serif'].includes(preferences.font) ? preferences.font : 'sans';
preferences.spacing = ['normal','wide'].includes(preferences.spacing) ? preferences.spacing : 'normal';
preferences.theme = ['paper','cream','contrast'].includes(preferences.theme) ? preferences.theme : 'paper';
preferences.rate = [.7,.9,1,1.1].includes(Number(preferences.rate)) ? Number(preferences.rate) : .9;
let toolbar, settings, glossary, currentModule, currentParts=[], partIndex=0;
let speechBlocks=[], speechIndex=0, reading=false, paused=false, activeBlock=null, focusKey='';
let rulerY=0, lastOpener=null, recognition=null, speakingToken=0;
const esc = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const supportedSpeech = () => 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
const visible = node => node?.isConnected && Boolean(node.getClientRects().length) && !node.closest('[hidden],.study-focus-hidden,details:not([open])>:not(summary)');

export function spokenChemistry(text) {
  return String(text).replace(/H₂O|H2O/g,'H två O').replace(/CO₂|CO2/g,'C O två')
    .replace(/O₂|O2/g,'O två').replace(/H₂|H2/g,'H två').replace(/Na⁺/g,'natriumjon plus')
    .replace(/Cl⁻/g,'kloridjon minus').replace(/°\s*C/g,' grader Celsius')
    .replace(/→/g,' blir ').replace(/\s+/g,' ').trim();
}

function textOf(node) {
  if(node.matches('textarea,input')) return node.value;
  const copy=node.cloneNode(true);
  copy.querySelectorAll('button,input,textarea,select,svg,canvas,.lab-tex-visual,[aria-hidden="true"],[hidden],.study-focus-hidden').forEach(n=>n.remove());
  copy.querySelectorAll('details:not([open])').forEach(n=>n.remove());
  copy.querySelectorAll('dt,dd,p,li,h2,h3').forEach(n=>n.append(document.createTextNode(' ')));
  return copy.textContent.replace(/\s+/g,' ').trim();
}

function status(message) {
  const node=document.querySelector('#reading-status');
  if(node) node.textContent=message;
}

function speechButtons() {
  const play=document.querySelector('#read-page');
  if(play) {play.textContent=reading?'Börja om att lyssna':'Lyssna på texten';play.setAttribute('aria-pressed',String(reading));}
  const pause=document.querySelector('#pause-reading');
  if(pause) {pause.disabled=!reading;pause.textContent=paused?'Fortsätt lyssna':'Pausa uppläsning';}
  const stop=document.querySelector('#stop-reading');if(stop)stop.disabled=!reading;
}

export function stopReading(message='Uppläsningen är stoppad.') {
  speakingToken++;
  if(supportedSpeech()) speechSynthesis.cancel();
  activeBlock?.classList.remove('reading-active');activeBlock=null;reading=false;paused=false;
  speechButtons();status(message);
}

function speakNext(token) {
  if(token!==speakingToken||!reading)return;
  activeBlock?.classList.remove('reading-active');
  if(speechIndex>=speechBlocks.length){stopReading('Texten är färdigläst.');return;}
  const item=speechBlocks[speechIndex++];activeBlock=item.node;
  activeBlock?.classList.add('reading-active');
  if(activeBlock&&!activeBlock.matches('textarea')) {
    const r=activeBlock.getBoundingClientRect();
    if(r.top<100||r.bottom>innerHeight-60)activeBlock.scrollIntoView({block:'center',behavior:preferences.calmMotion?'auto':'smooth'});
  }
  const utterance=new SpeechSynthesisUtterance(spokenChemistry(item.text));
  utterance.lang='sv-SE';utterance.rate=preferences.rate;
  const voices=speechSynthesis.getVoices();
  const swedish=voices.find(v=>/^sv(?:-|_)/i.test(v.lang))||voices.find(v=>/^sv/i.test(v.lang));
  if(swedish)utterance.voice=swedish;
  utterance.onend=()=>speakNext(token);
  utterance.onerror=e=>{if(token!==speakingToken||['interrupted','canceled'].includes(e.error))return;stopReading('Uppläsningen kunde inte fortsätta. Prova igen eller använd enhetens lässtöd.');};
  speechSynthesis.speak(utterance);
  status(`Läser del ${speechIndex} av ${speechBlocks.length}. Textstycket är markerat.`);
}

function startReading(blocks) {
  stopReading('');
  if(!supportedSpeech()){status('Den här webbläsaren saknar uppläsning. Texten fungerar med enhetens egna läsverktyg.');return;}
  speechBlocks=blocks.map(node=>({node,text:textOf(node)})).filter(x=>x.text);
  if(!speechBlocks.length){status('Här finns ingen text att läsa just nu. Öppna en förklaring eller skriv ett svar.');return;}
  document.querySelectorAll('video').forEach(v=>v.pause());
  speechIndex=0;reading=true;paused=false;speechButtons();speakNext(speakingToken);
}

function pageBlocks() {
  const selection=window.getSelection();
  if(selection?.toString().trim()&&document.querySelector('#main')?.contains(selection.anchorNode)) {
    const node=document.createElement('p');node.textContent=selection.toString();return [node];
  }
  const scope=document.querySelector('.lesson-stage:not([hidden])')||document.querySelector('#main');
  if(!scope)return [];
  const selectors='[data-read-block],.learning-words dl>div,.learning-step p,.learning-start p,.learning-summary p,.diagram-reading p,.source-exercise p,.source-exercise li,.film-aside p,.film-transcript[open] p,.film-transcript[open] li,.cl-explanation p,[data-wl="guide-copy"],.answer-instruction,.answer-desk>label,.summary-module .answer-text';
  const result=[...scope.querySelectorAll(selectors)].filter(visible);
  return result.filter(n=>!result.some(parent=>parent!==n&&parent.contains(n)));
}

function applyPreferences(persist=true) {
  const body=document.body;
  body.dataset.readFont=preferences.font;body.dataset.readSpacing=preferences.spacing;body.dataset.readTheme=preferences.theme;
  body.dataset.labText=preferences.plainLabs?'plain':'tex';body.dataset.motion=preferences.calmMotion?'calm':'full';
  body.dataset.readFocus=String(preferences.focus);body.dataset.readRuler=String(preferences.ruler);
  body.style.setProperty('--read-scale',String(preferences.scale));
  window.chemistryPreferences={...preferences};
  if(persist)try{localStorage.setItem(KEY,JSON.stringify(preferences));}catch{status('Inställningarna gäller här, men kunde inte sparas på enheten.');}
  document.querySelector('#reading-ruler')?.toggleAttribute('hidden',!preferences.ruler);
  document.querySelector('#ruler-controls')?.toggleAttribute('hidden',!preferences.ruler);
  document.querySelector('#toggle-ruler')?.setAttribute('aria-pressed',String(preferences.ruler));
  document.querySelector('#toggle-focus')?.setAttribute('aria-pressed',String(preferences.focus));
  for(const input of settings?.querySelectorAll('[data-pref]')||[]){let value=preferences[input.dataset.pref];if(input.type==='checkbox')input.checked=Boolean(value);else input.value=String(value);}
  applyFocus(false);
  window.dispatchEvent(new CustomEvent('chemistry:preferences',{detail:{...preferences}}));
}

function setRuler(y) {
  rulerY=Math.max(65,Math.min(innerHeight-35,y));
  document.documentElement.style.setProperty('--ruler-y',rulerY+'px');
}

function applyFocus(scroll=false) {
  currentParts.forEach((p,i)=>p.classList.toggle('study-focus-hidden',preferences.focus&&i!==partIndex));
  const navigation=document.querySelector('#focus-navigation');
  if(navigation)navigation.hidden=!preferences.focus||currentParts.length<2;
  const count=document.querySelector('#focus-position');if(count)count.textContent=`Del ${partIndex+1} av ${currentParts.length||1}`;
  const prev=document.querySelector('#focus-previous'),next=document.querySelector('#focus-next');
  if(prev)prev.disabled=partIndex===0;if(next)next.disabled=partIndex>=currentParts.length-1;
  if(scroll&&preferences.focus)currentParts[partIndex]?.scrollIntoView({block:'start',behavior:preferences.calmMotion?'auto':'smooth'});
  window.dispatchEvent(new CustomEvent('chemistry:focus',{detail:{enabled:preferences.focus,index:partIndex}}));
}

function openDialog(dialog,opener) {
  stopReading('');lastOpener=opener;
  dialog.showModal();dialog.querySelector('button,select,input')?.focus();
}

function writingTools(root) {
  root.querySelectorAll('textarea').forEach(area=>{area.spellcheck=true;area.lang='sv';
    if(area.readOnly||area.disabled)return;
    if(area.dataset.writingTools)return;
    area.dataset.writingTools='true';
    const controls=document.createElement('div');controls.className='writing-tools';
    const listen=document.createElement('button');listen.type='button';listen.textContent='Lyssna på mitt svar';
    listen.addEventListener('click',()=>startReading([area]));controls.append(listen);
    const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(Recognition){
      const dictation=document.createElement('button');dictation.type='button';dictation.textContent='Tala in text';dictation.setAttribute('aria-pressed','false');
      const notice=document.createElement('span');notice.className='writing-note';notice.textContent='Tal till text kan använda webbläsarens internettjänst. Du väljer själv om du vill använda den.';
      dictation.addEventListener('click',()=>{
        if(recognition){recognition.stop();return;}
        stopReading('');const r=new Recognition();recognition=r;r.lang='sv-SE';r.interimResults=false;r.continuous=false;
        dictation.textContent='Stoppa inspelning';dictation.setAttribute('aria-pressed','true');
        r.onresult=e=>{if(!area.isConnected)return;const text=[...e.results].map(x=>x[0].transcript).join(' ');const addition=(area.value&&!/\s$/.test(area.value)?' ':'')+text;const room=area.maxLength>0?Math.max(0,area.maxLength-area.value.length):addition.length;area.value+=addition.slice(0,room);area.dispatchEvent(new Event('input',{bubbles:true}));area.focus();area.setSelectionRange(area.value.length,area.value.length);};
        r.onerror=()=>status('Det gick inte att skriva från tal. Kontrollera mikrofonen eller skriv med tangentbordet.');
        r.onend=()=>{recognition=null;dictation.textContent='Tala in text';dictation.setAttribute('aria-pressed','false');};
        try{r.start();}catch{recognition=null;dictation.textContent='Tala in text';dictation.setAttribute('aria-pressed','false');status('Tal till text kunde inte starta.');}
      });controls.append(dictation,notice);
    }else{
      const note=document.createElement('span');note.className='writing-note';note.textContent='Du kan också använda tangentbordets diktering om din enhet har det.';controls.append(note);
    }
    area.insertAdjacentElement('afterend',controls);
  });
}

export function refreshLearningTools(root=document.querySelector('#main'),module=undefined) {
  if(!root)return;
  if(module!==undefined)currentModule=module;
  const glossaryButton=document.querySelector('#open-glossary');if(glossaryButton)glossaryButton.disabled=!currentModule;
  stopReading('');recognition?.stop();
  root.querySelectorAll('.study-focus-hidden').forEach(n=>n.classList.remove('study-focus-hidden'));
  const scope=root.querySelector('.lesson-stage:not([hidden])')||root;
  const nextKey=location.hash+'|'+scope.id;
  if(nextKey!==focusKey){partIndex=0;focusKey=nextKey;}
  currentParts=[...scope.querySelectorAll('[data-focus-part]')].filter(n=>!n.parentElement.closest('[data-focus-part]')&&visible(n));
  partIndex=Math.min(partIndex,Math.max(0,currentParts.length-1));
  writingTools(root);applyFocus(false);
  root.querySelectorAll('[data-answer-starter]').forEach(button=>{if(button.dataset.connected)return;button.dataset.connected='true';button.addEventListener('click',()=>{const area=root.querySelector('#final-answer');if(!area)return;const prefix=area.value.trim()?'\n':'';area.value+=prefix+button.dataset.answerStarter;area.dispatchEvent(new Event('input',{bubbles:true}));area.focus();area.setSelectionRange(area.value.length,area.value.length);});});
}

export function renderAnswerSupport(module) {
  const starters=module.learning?.answerStarters||[];
  if(!starters.length)return '';
  return `<details class="answer-support"><summary>Hjälp att börja skriva</summary><p>Välj en början. Skriv färdigt med dina egna ord.</p><div>${starters.map(s=>`<button type="button" data-answer-starter="${esc(s)}">${esc(s)}</button>`).join('')}</div><p>Kontrollera sedan: Har du sagt vad som händer och varför?</p></details>`;
}

export function initLearningTools() {
  toolbar=document.createElement('aside');toolbar.id='learning-tools';toolbar.className='learning-tools';toolbar.setAttribute('aria-label','Läs- och skrivstöd');
  toolbar.innerHTML=`<div class="learning-tools-row"><strong>Lässtöd</strong><button type="button" id="read-page">Lyssna på texten</button><button type="button" id="pause-reading" disabled>Pausa uppläsning</button><button type="button" id="stop-reading" disabled>Stoppa</button><button type="button" id="toggle-ruler" aria-pressed="false">Läsrad</button><button type="button" id="toggle-focus" aria-pressed="false">En del i taget</button><button type="button" id="open-glossary" aria-haspopup="dialog">Ordlista</button><button type="button" id="open-reading-settings" aria-haspopup="dialog">Text och färg</button></div><div id="focus-navigation" class="focus-navigation" hidden><button type="button" id="focus-previous">Föregående del</button><span id="focus-position" aria-live="polite"></span><button type="button" id="focus-next">Nästa del</button></div><div id="ruler-controls" class="ruler-controls" hidden><span>Flytta läsraden med musen eller knapparna.</span><button type="button" id="ruler-up" aria-label="Flytta läsraden uppåt">Upp</button><button type="button" id="ruler-down" aria-label="Flytta läsraden nedåt">Ned</button></div><p id="reading-status" class="reading-status" role="status" aria-live="polite"></p>`;
  document.querySelector('.topbar').insertAdjacentElement('afterend',toolbar);
  settings=document.createElement('dialog');settings.id='reading-settings';settings.className='reading-dialog';settings.setAttribute('aria-labelledby','reading-settings-title');
  settings.innerHTML=`<div class="reading-dialog-heading"><h2 id="reading-settings-title">Text och färg</h2><button type="button" data-close>Stäng</button></div><p>Välj det som hjälper dig att läsa. Inställningarna sparas på den här enheten.</p><div class="reading-settings-grid"><label>Textstorlek<select data-pref="scale"><option value="1">Vanlig</option><option value="1.15">Lite större</option><option value="1.3">Stor</option><option value="1.5">Extra stor</option></select></label><label>Typsnitt<select data-pref="font"><option value="sans">Raka bokstäver</option><option value="serif">Bokstäver med klackar</option></select></label><label>Avstånd<select data-pref="spacing"><option value="normal">Vanligt</option><option value="wide">Mer mellan ord och rader</option></select></label><label>Färg<select data-pref="theme"><option value="paper">Ljus</option><option value="cream">Varm bakgrund</option><option value="contrast">Hög kontrast</option></select></label><label>Uppläsningens fart<select data-pref="rate"><option value="0.7">Långsam</option><option value="0.9">Lite långsammare</option><option value="1">Vanlig</option><option value="1.1">Lite snabbare</option></select></label></div><label class="reading-check"><input type="checkbox" data-pref="plainLabs">Vanliga bokstäver i labbens knappar och texter</label><p class="writing-note">Då fungerar ditt val av typsnitt och avstånd även i labbarna. Formler och bilder finns kvar.</p><label class="reading-check"><input type="checkbox" data-pref="calmMotion">Lugnare rörelser</label><p class="writing-note">Färre pulser och övergångar. Rörelser som förklarar kemin finns kvar.</p><div class="reading-settings-actions"><button type="button" id="reading-comfort">Större och luftigare text</button><button type="button" id="reset-reading">Återställ lässtödet</button></div><p class="writing-note">Du behöver ingen diagnos för att använda verktygen. Välj själv det som passar dig.</p>`;
  glossary=document.createElement('dialog');glossary.className='reading-dialog';glossary.setAttribute('aria-label','Ordlista för området');
  document.body.append(settings,glossary);
  const ruler=document.createElement('div');ruler.id='reading-ruler';ruler.hidden=true;ruler.setAttribute('aria-hidden','true');ruler.innerHTML='<div class="ruler-shade ruler-shade-top"></div><div class="ruler-band"></div><div class="ruler-shade ruler-shade-bottom"></div>';document.body.append(ruler);setRuler(innerHeight/2);
  document.querySelector('#read-page').onclick=()=>startReading(pageBlocks());
  document.querySelector('#pause-reading').onclick=()=>{if(!reading)return;paused=!paused;if(paused)speechSynthesis.pause();else speechSynthesis.resume();speechButtons();status(paused?'Uppläsningen är pausad.':'Uppläsningen fortsätter.');};
  document.querySelector('#stop-reading').onclick=()=>stopReading();
  document.querySelector('#toggle-ruler').onclick=()=>{preferences.ruler=!preferences.ruler;applyPreferences();};
  document.querySelector('#toggle-focus').onclick=()=>{stopReading('');preferences.focus=!preferences.focus;applyPreferences();};
  document.querySelector('#focus-previous').onclick=()=>{stopReading('');partIndex=Math.max(0,partIndex-1);applyFocus(true);};
  document.querySelector('#focus-next').onclick=()=>{stopReading('');partIndex=Math.min(currentParts.length-1,partIndex+1);applyFocus(true);};
  document.querySelector('#ruler-up').onclick=()=>setRuler(rulerY-45);document.querySelector('#ruler-down').onclick=()=>setRuler(rulerY+45);
  document.querySelector('#open-reading-settings').onclick=e=>openDialog(settings,e.currentTarget);
  document.querySelector('#open-glossary').onclick=e=>{glossary.innerHTML=`<div class="reading-dialog-heading"><h2>Ord i det här området</h2><button type="button" data-close>Stäng</button></div><dl>${(currentModule?.learning?.keyWords||[]).map(x=>`<div><dt>${esc(x.word)}</dt><dd>${esc(x.meaning)}</dd></div>`).join('')}</dl><button type="button" data-listen-glossary>Lyssna på orden</button>`;glossary.querySelector('[data-close]').onclick=()=>glossary.close();glossary.querySelector('[data-listen-glossary]').onclick=()=>startReading([...glossary.querySelectorAll('dt,dd')]);openDialog(glossary,e.currentTarget);};
  for(const dialog of [settings,glossary])dialog.addEventListener('close',()=>{stopReading('');lastOpener?.isConnected&&lastOpener.focus();});
  settings.querySelector('[data-close]').onclick=()=>settings.close();
  settings.querySelectorAll('[data-pref]').forEach(input=>input.addEventListener('change',()=>{const key=input.dataset.pref;preferences[key]=input.type==='checkbox'?input.checked:['scale','rate'].includes(key)?Number(input.value):input.value;applyPreferences();}));
  document.querySelector('#reading-comfort').onclick=()=>{preferences={...preferences,scale:1.15,font:'sans',spacing:'wide',theme:'cream',plainLabs:true,calmMotion:true};applyPreferences();status('Texten är nu större och luftigare.');};
  document.querySelector('#reset-reading').onclick=()=>{stopReading('');preferences={...DEFAULTS};partIndex=0;applyPreferences();};
  document.addEventListener('pointermove',e=>{if(preferences.ruler&&e.pointerType!=='touch')setRuler(e.clientY);},{passive:true});
  window.addEventListener('resize',()=>setRuler(rulerY));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&reading)stopReading();});
  window.addEventListener('hashchange',()=>{stopReading('');recognition?.stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopReading('');recognition?.stop();}});
  applyPreferences(false);speechButtons();
}
