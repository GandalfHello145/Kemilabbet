import { WaterModel, MODEL_CARD } from './water-model.js';
import { createTemperatureGraph } from './water-graph.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const number = (v, digits = 1) => Number(v).toLocaleString('sv-SE', { maximumFractionDigits: digits, minimumFractionDigits: digits, useGrouping: false });
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names = { solid: 'Is', melting: 'Is + flytande vatten', liquid: 'Flytande vatten', boiling: 'Vatten + vattenånga', gas: 'Vattenånga' };

export function mountWaterLab(host) {
  host.classList.add('water-lab-host');
  host.innerHTML = [
    '<section class="water-lab" data-tex-rendered="water-lab" aria-labelledby="wl-title">',
    '<header class="wl-header"><div><p class="wl-kicker"><span></span> ETT EXPERIMENT ATT STYRA</p><h2 id="wl-title">Vattenlabbet<span>.</span></h2><p>Värm, kyl och följ samma vattenmolekyler.</p></div><div class="wl-spec">RENT VATTEN<br><strong>50 g · normalt lufttryck</strong></div></header>',
    '<div class="wl-start"><span>Börja med</span><div class="wl-segment" aria-label="Välj provets starttillstånd"><button data-wl-preset="solid" aria-pressed="false">Is <small>−15 °C</small></button><button data-wl-preset="liquid" aria-pressed="true">Vatten <small>20 °C</small></button><button data-wl-preset="gas" aria-pressed="false">Vattenånga <small>110 °C</small></button></div><button class="wl-reset" data-wl="reset" aria-label="Nollställ hela Vattenlabbet">Börja om ↺</button></div>',
    '<div class="wl-stage"><div class="wl-sample"><p class="wl-panel-label">01 / VATTENPROVET</p><div class="wl-temperature"><output data-wl="temp">20,0</output><span>°C</span></div><p class="wl-phase" data-wl="phase">Flytande vatten</p>',
    '<svg class="wl-vessel" data-wl="vessel" viewBox="0 0 260 245" role="img" aria-label="Vattenprov med rörligt lock vid konstant tryck">',
    '<defs><linearGradient id="wl-water-fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#61dfeb" stop-opacity=".8"/><stop offset="1" stop-color="#2377a6" stop-opacity=".85"/></linearGradient><linearGradient id="wl-glass" x1="0" y1="0" x2="1" y2=".3"><stop stop-color="#b6e7ef" stop-opacity=".12"/><stop offset=".5" stop-color="#87c6da" stop-opacity=".01"/><stop offset="1" stop-color="#b6e7ef" stop-opacity=".18"/></linearGradient><clipPath id="wl-clip"><rect x="58" y="24" width="144" height="181" rx="9"/></clipPath></defs>',
    '<path d="M55 30V199Q55 212 69 212H191Q205 212 205 199V30" fill="url(#wl-glass)" stroke="#a6dce2" stroke-width="2"/>',
    '<g clip-path="url(#wl-clip)"><rect data-wl="liquid-fill" x="58" y="118" width="144" height="88" fill="url(#wl-water-fill)"/><g data-wl="ice-pieces"></g><g data-wl="steam-dots"></g><path data-wl="surface" d="M58 118Q94 112 130 118T202 118" fill="none" stroke="#c2faff" stroke-width="2"/></g>',
    '<g data-wl="lid"><rect x="51" y="90" width="158" height="8" rx="4" fill="#6b9aab" stroke="#c3e8e9"/><path d="M130 90V54" stroke="#90b4be" stroke-width="5"/><rect x="108" y="47" width="44" height="8" rx="4" fill="#9fbdc5"/></g>',
    '<g data-wl="heat-arrows" fill="none" stroke="#ffa66c" stroke-width="3" stroke-linecap="round"></g><path d="M43 221H217" stroke="#567784" stroke-width="5" stroke-linecap="round"/>',
    '</svg><p class="wl-vessel-note">Rörligt lock håller trycket konstant.<br>Volymen visas schematiskt.</p></div>',
    '<div class="wl-molecules"><div class="wl-scene-top"><p class="wl-panel-label">02 / ZOOMA IN PÅ MOLEKYLERNA</p><span class="wl-view-mode" data-wl="mode">Molekylmodell</span></div>',
    '<canvas class="wl-three" data-wl="scene" tabindex="0" aria-label="Roterbar molekylmodell. Dra för att vrida, använd plus och minus för zoom. Tryck Enter för att markera en molekyl."></canvas><canvas class="wl-fallback" data-wl="fallback" role="img" aria-label="Tvådimensionell molekylmodell"></canvas>',
    '<div class="wl-scene-hint" data-wl="scene-hint">Dra för att vrida · klicka på en molekyl</div><div class="wl-scene-tools"><button data-wl="follow" aria-pressed="false"><span class="wl-target">⊙</span> Följ en molekyl</button><button data-wl="camera" aria-label="Återställ molekylvyn">Återställ vy ↺</button><label>Zoom <input data-wl="zoom" type="range" min="0" max="100" value="35" aria-label="Zooma in på molekylerna"></label></div>',
    '<div class="wl-atom-key"><span><i class="wl-oxygen"></i> Syre, O</span><span><i class="wl-hydrogen"></i> Väte, H</span><span data-wl="selected-note">Varje H₂O har 1 O och 2 H.</span></div></div></div>',
    '<div class="wl-fractions" aria-label="Andel av vattenmängden i varje tillstånd"><div class="wl-fraction-bar"><span data-wl="ice-bar"></span><span data-wl="water-bar"></span><span data-wl="vapor-bar"></span></div><div class="wl-fraction-labels"><span><i></i> Is <output data-wl="ice-pct">0</output> %</span><span><i></i> Flytande <output data-wl="water-pct">100</output> %</span><span><i></i> Gas <output data-wl="vapor-pct">0</output> %</span></div></div>',
    '<div class="wl-controls"><div class="wl-energy-control"><div class="wl-control-title"><label for="wl-power">Energi till eller från provet</label><output data-wl="power-label">0 W</output></div><input id="wl-power" data-wl="power" type="range" min="-300" max="300" step="10" value="0" aria-label="Värmeeffekt, från kylning minus 300 till uppvärmning plus 300 watt"><div class="wl-power-ends"><span>← Ta bort energi</span><span>Tillför energi →</span></div><div class="wl-action-buttons"><button class="wl-cool" data-wl="cool">❄ Kyl</button><button class="wl-neutral" data-wl="zero">Ingen värme</button><button class="wl-heat" data-wl="heat">☀ Värm</button></div></div>',
    '<div class="wl-time-control"><button class="wl-play" data-wl="play" aria-pressed="false">▶ Starta</button><label for="wl-speed">Modellens hastighet <select id="wl-speed" data-wl="speed"><option value="1">1× · verklig tid</option><option value="10" selected>10× · snabbare</option><option value="30">30× · snabbast</option></select></label><p data-wl="speed-note">1 sekund här = 10 sekunder i modellen.</p></div></div>',
    '<div class="wl-insight"><span data-wl="insight-icon">↗</span><div><strong data-wl="insight-title">Vad händer om ni tillför energi?</strong><p data-wl="insight">Välj Värm eller Kyl. Följ temperaturen och hur molekylerna rör sig.</p></div></div>',
    '<div class="wl-chart"><div class="wl-chart-header"><div><p class="wl-kicker">03 / FÖLJ SAMBANDET</p><h3>Temperaturens väg</h3></div><div class="wl-chart-actions"><button data-wl="save-curve">Spara jämförelse</button><button data-wl="clear-curve" hidden>Ta bort jämförelse</button><button data-wl="csv">Ladda ned mätdata ↓</button></div></div><div class="wl-chart-metrics"><span>Modelltid <strong data-wl="time">0:00</strong></span><span>Nettoenergi <strong data-wl="energy">0,0 kJ</strong></span><span class="wl-reference" data-wl="reference" hidden>● Sparat försök</span><label class="wl-motion"><input type="checkbox" data-wl="motion"> Stilla molekylvy</label></div><svg data-wl="graph" class="wl-graph" role="img" aria-label="Temperaturkurva för ert försök"></svg><p class="wl-chart-readout" data-wl="graph-readout">Dra längs kurvan för att läsa av tid och temperatur.</p></div>',
    '<div class="wl-challenges"><p class="wl-kicker">UNDERSÖK TILLSAMMANS</p><div><p><b>1.</b> Börja med is. Varför stannar temperaturen vid 0 °C trots att ni värmer?</p><p><b>2.</b> Följ en molekyl. Vad förändras när vattnet kokar, och vad är kvar?</p><p><b>3.</b> Spara en kurva. Jämför sedan ett försök med lägre värmeeffekt.</p></div></div>',
    '<details class="wl-model"><summary>Så fungerar modellen · antaganden och källor</summary><p>Vi följer 50 g rent vatten i en idealiserad behållare med rörligt lock. Trycket hålls vid normalt lufttryck, 101,3 kPa. Samma vattenmängd finns kvar även när den blir gas.</p><p>Temperatur och fasandelar beräknas från tillförd eller bortförd energi. Under smältning och kokning går energin till fasövergången. Molekylbilden visar ett litet representativt utsnitt; 48 molekyler är inte hela provet.</p><p>Is har en öppnare struktur än flytande vatten. Molekylerna fortsätter röra sig och deras H–O-bindningar behålls. Storlekar, rörelsehastigheter och gasvolym visas inte i verklig skala.</p><p>Modellen förenklar till jämvikt utan värmeförluster, temperaturgradienter eller avdunstning under 100 °C. Den visar −30 till 120 °C.</p><p class="wl-equation">Energi = effekt × modelltid · Q = P · Δt</p><ul>' + MODEL_CARD.sources.map(s => '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.title) + '</a></li>').join('') + '</ul></details>',
    '<p class="sr-only" data-wl="status" role="status" aria-live="polite"></p></section>'
  ].join('');

  const $ = name => host.querySelector('[data-wl="' + name + '"]');
  const model = new WaterModel();
  let startEnergy = model.state.energyJ, history = [{timeSeconds: 0, temperature: 20}], reference = [];
  let active = true, inView = true, destroyed = false, running = false, power = 0, speed = 10;
  let frame = 0, last = 0, lastUI = 0, lastSample = 0, visualTime = 0, selected = false, scene = null;
  let motionOff = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let previousPhase = model.state.phase, inspectorUntil = 0;
  const graph = createTemperatureGraph($('graph'), { onInspect(point) {
    inspectorUntil = performance.now() + 1800;
    $('graph-readout').textContent = point ? 'Avläst: ' + number(point.timeSeconds / 60, 2) + ' min · ' + number(point.temperature) + ' °C' : 'Dra längs kurvan för att läsa av tid och temperatur.';
  } });
  $('motion').checked = motionOff;
  const ctx = $('fallback').getContext('2d');
  const particles = Array.from({length: 24}, (_, i) => ({x: ((i * 73) % 311) / 311, y: ((i * 131 + 41) % 277) / 277}));
  function announce(text) { $('status').textContent = text; }
  function recordCurrent() { const state=model.state, point={timeSeconds:state.timeSeconds,temperature:state.temperature}; if(Math.abs(history.at(-1).timeSeconds-point.timeSeconds)<1e-8)history[history.length-1]=point;else history.push(point); }
  function select(value) {
    selected = !!value;
    $('follow').setAttribute('aria-pressed', String(selected));
    $('selected-note').textContent = selected ? 'Markerad H₂O: samma 1 O och 2 H i alla tillstånd.' : 'Varje H₂O har 1 O och 2 H.';
    scene?.setSelected(selected);
  }
  function drawFallback(state) {
    if (!ctx || scene?.available) return;
    const canvas = $('fallback'), box = canvas.getBoundingClientRect();
    const w = Math.max(240, box.width), h = Math.max(210, box.height), dpr = Math.min(devicePixelRatio || 1, 1.5);
    if (canvas.width !== Math.round(w*dpr) || canvas.height !== Math.round(h*dpr)) { canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr); }
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
    const gas = state.vaporFraction, liquid = state.liquidFraction;
    particles.forEach((p,i) => {
      const isGas = i/particles.length < gas, isLiquid = i/particles.length < gas+liquid;
      const t = visualTime * (.2 + Math.sqrt(Math.max(1,state.temperature+273)/293) * .5);
      let x = w*.2 + (i%6)*w*.12, y = h*.32 + Math.floor(i/6)*h*.12;
      if (isGas) { x = 24 + ((p.x*w+t*(12+i)*((i%2)?1:-1)) % (w-48)+(w-48))%(w-48); y = 25+((p.y*h+t*(15-i/2))%(h-50)+(h-50))%(h-50); }
      else if (isLiquid) { x = w*.25+(i%6)*w*.09+Math.sin(t+i*3)*w*.035; y = h*.47+Math.floor(i/6)*h*.1+Math.cos(t*.7+i)*h*.05; }
      else { x += Math.sin(t*4+i)*2; y += Math.cos(t*4+i)*2; }
      ctx.save();ctx.translate(x,y);ctx.rotate(isGas||isLiquid?Math.sin(t+i)*1.2:.2);
      if (selected && i===0) { ctx.strokeStyle='#ffc967';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,21,0,Math.PI*2);ctx.stroke(); }
      ctx.strokeStyle='#adc0cf';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-10,8);ctx.moveTo(0,0);ctx.lineTo(10,8);ctx.stroke();
      ctx.fillStyle='#ed7b70';ctx.beginPath();ctx.arc(0,0,8,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e8f7ff';[-10,10].forEach(dx=>{ctx.beginPath();ctx.arc(dx,8,4.5,0,Math.PI*2);ctx.fill();});ctx.restore();
    });
  }
  function drawVessel(state) {
    const liquid = state.liquidFraction, ice = state.iceFraction, gas = state.vaporFraction;
    const condensed = liquid + ice;
    const surfaceY = 204 - 88*condensed - 10*ice;
    $('liquid-fill').setAttribute('y', surfaceY);
    $('liquid-fill').setAttribute('height', Math.max(0,204-surfaceY));
    $('liquid-fill').setAttribute('opacity', liquid > 0 ? '.9' : '.16');
    $('surface').setAttribute('d', 'M58 '+surfaceY+'Q94 '+(surfaceY-3*Math.sin(visualTime*2))+' 130 '+surfaceY+'T202 '+surfaceY);
    $('surface').setAttribute('opacity', liquid > .01 ? '1' : '0');
    $('ice-pieces').innerHTML = Array.from({length: Math.ceil(ice*8)}, (_,i) => '<rect x="'+(65+(i%4)*32)+'" y="'+(147+Math.floor(i/4)*27)+'" width="27" height="25" rx="5" fill="#b8f3fa" fill-opacity="'+(.4+ice*.4)+'" stroke="#d4faff" transform="rotate('+(i%2?6:-5)+' '+(79+(i%4)*32)+' '+(160+Math.floor(i/4)*27)+')"/>').join('');
    $('lid').setAttribute('transform','translate(0 '+(-gas*62-ice*8)+')');
    $('steam-dots').innerHTML = Array.from({length: Math.ceil(gas*20)},(_,i) => {
      const top=107-gas*62-ice*8, bottom=Math.max(top+1,surfaceY-10);
      const x=68+((i*41)%122),y=top+(((i*29+visualTime*9)%112)/112)*(bottom-top);
      return '<circle cx="'+x+'" cy="'+y+'" r="3" fill="#b1dbe7" opacity="'+(.25+gas*.4)+'"/>';
    }).join('');
    $('heat-arrows').setAttribute('stroke', power>0?'#ffa66c':'#77ccff');
    $('heat-arrows').innerHTML = power===0 ? '' : [85,130,175].map((x,i)=>{
      const dy=running?Math.sin(visualTime*4+i)*3:0;
      return power>0 ? '<path d="M'+x+' '+(242+dy)+'v-20m-5 5l5-5 5 5"/>' : '<path d="M'+x+' '+(222+dy)+'v20m-5-5l5 5 5-5"/>';
    }).join('');
    $('vessel').setAttribute('aria-label', names[state.phase]+', '+number(state.temperature)+' grader Celsius. Ett rörligt lock håller trycket konstant.');
  }
  function insight(state) {
    const heating = running && power > 0;
    const changing = running && power !== 0;
    if (!changing && state.phase === 'melting') return ['Is och flytande vatten vid 0 °C.', 'Provet innehåller båda faserna. Tillför energi för att smälta mer is, eller för bort energi för att frysa mer vatten.'];
    if (!changing && state.phase === 'boiling') return ['Flytande vatten och gas vid 100 °C.', 'Provet innehåller båda faserna. Tillför energi för att bilda mer gas, eller för bort energi så att mer gas kondenserar.'];
    if (state.phase === 'melting') return heating
      ? ['Temperaturen står stilla – men något händer.', 'Vid 0 °C används energin till att smälta is. Följ hur andelen flytande vatten ökar medan H₂O-molekylerna finns kvar.']
      : ['Vattnet fryser vid 0 °C.', 'Energi förs bort medan allt fler molekyler ordnas i isens öppna struktur. Temperaturen är oförändrad under fasövergången.'];
    if (state.phase === 'boiling') return heating
      ? ['100 °C: energin går till att bilda gas.', 'Andelen vattenånga ökar, men temperaturen stiger inte förrän hela provet har blivit gas. H₂O-molekylerna går inte sönder.']
      : ['Vattenångan kondenserar vid 100 °C.', 'När energi förs bort blir mer av gasen flytande vatten. Samma molekyler kommer närmare varandra.'];
    if (state.phase === 'solid') return ['Molekylerna rör sig även i is.', 'De vibrerar kring sina platser i en öppen struktur. När isen värms stiger temperaturen fram till smältningen vid 0 °C.'];
    if (state.phase === 'gas') return ['Gas är fortfarande H₂O.', 'Molekylerna är glest fördelade och rör sig fritt i modellen. Vid kylning sjunker temperaturen till 100 °C innan kondensationen börjar.'];
    return [!changing?'Vad händer om ni tillför energi?':heating?'Vattnet blir varmare.':'Vattnet blir kallare.', 'Temperatur visar inte hur mycket vatten ni har. Här följer ni samma 50 g: vid uppvärmning ökar molekylernas genomsnittliga rörelse.'];
  }
  function refresh() {
    const state = model.state;
    $('temp').textContent = number(state.temperature);
    $('phase').textContent = names[state.phase];
    $('phase').dataset.phase = state.phase;
    const rounded = [state.iceFraction,state.liquidFraction,state.vaporFraction].map(v=>Math.round(v*100));
    const sum = rounded.reduce((a,b)=>a+b,0); rounded[rounded.indexOf(Math.max(...rounded))] += 100-sum;
    ['ice','water','vapor'].forEach((key,i) => {
      $(key+'-pct').textContent=rounded[i]; $(key+'-bar').style.width=[state.iceFraction,state.liquidFraction,state.vaporFraction][i]*100+'%';
    });
    $('power-label').textContent = (power>0?'+':'')+power+' W';
    $('power-label').dataset.direction = power>0?'heat':power<0?'cool':'zero';
    $('play').textContent = running?'Ⅱ Pausa':'▶ Starta';
    $('play').setAttribute('aria-pressed', String(running));
    ['heat','cool','zero'].forEach(name=>$(name).setAttribute('aria-pressed',String(name==='heat'?power>0:name==='cool'?power<0:power===0)));
    const [title,text] = insight(state); $('insight-title').textContent=title; $('insight').textContent=text;
    const seconds = Math.floor(state.timeSeconds);
    $('time').textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
    const energy=(state.energyJ-startEnergy)/1000;
    $('energy').textContent=(energy>0?'+':'')+number(energy)+' kJ';
    drawVessel(state); const plotted=history.at(-1).timeSeconds<state.timeSeconds?[...history,{timeSeconds:state.timeSeconds,temperature:state.temperature}]:history; graph.update(plotted,reference);
    if (performance.now()>inspectorUntil) $('graph-readout').textContent=running?'Nu: '+number(state.temperature)+' °C efter '+number(state.timeSeconds/60,2)+' minuter i modellen.':'Pausad · dra längs kurvan för att läsa av ett tidigare värde.';
  }
  function setPower(value) { recordCurrent(); power = Number(value); $('power').value=power; running=true;last=0;refresh();kick(); }
  function preset(phase, clearReference=false) {
    const temperatures={solid:-15,liquid:20,gas:110};
    model.reset({temperature:temperatures[phase],phase});
    startEnergy=model.state.energyJ;history=[{timeSeconds:0,temperature:model.state.temperature}];lastSample=0;
    running=false;power=0;$('power').value=0;visualTime=0;previousPhase=model.state.phase;
    host.querySelectorAll('[data-wl-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.wlPreset===phase)));
    if(clearReference){reference=[];$('reference').hidden=true;$('clear-curve').hidden=true;}
    refresh();kick();announce('Nytt försök: '+names[phase]+', '+temperatures[phase]+' grader.');
  }
  function tick(now) {
    frame=0;if(destroyed||!active||!inView||document.hidden||!host.isConnected){last=0;return;}
    const dt = last ? Math.min(.08,(now-last)/1000) : 0;last=now;
    if(running&&dt>0){
      const before=model.state; const state=model.step(dt*speed,power);
      if(state.timeSeconds-lastSample>=.5){
        history.push({timeSeconds:state.timeSeconds,temperature:state.temperature});lastSample=state.timeSeconds;
        if(history.length>1800)history=history.filter((_,i)=>i%2===0||i===history.length-1);
      }
      if(power!==0&&Math.abs(state.energyJ-before.energyJ)<1e-7){
        running=false;recordCurrent();announce('Modellens temperaturgräns är nådd. Välj motsatt riktning för att fortsätta.');
      }
      if(state.phase!==previousPhase){previousPhase=state.phase;announce(names[state.phase]+', '+number(state.temperature)+' grader.');}
    }
    if(running&&!motionOff)visualTime+=dt;
    scene?.setMotion(!motionOff&&running);
    scene?.update(model.state, running&&!motionOff?dt:0);
    drawFallback(model.state);
    if(now-lastUI>100){refresh();lastUI=now;}
    frame=requestAnimationFrame(tick);
  }
  function kick(){if(!frame&&active&&inView&&!destroyed&&!document.hidden)frame=requestAnimationFrame(tick);}
  const onVisibility=()=>{last=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else kick();};
  document.addEventListener('visibilitychange',onVisibility);
  const observer = typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
    inView=entries[0].isIntersecting;last=0;if(inView)kick();else{cancelAnimationFrame(frame);frame=0;}
  },{rootMargin:'180px'}):null;
  observer?.observe(host);
  host.querySelectorAll('[data-wl-preset]').forEach(b=>b.onclick=()=>preset(b.dataset.wlPreset));
  $('heat').onclick=()=>setPower(300);$('cool').onclick=()=>setPower(-300);$('zero').onclick=()=>setPower(0);
  $('power').oninput=e=>setPower(e.target.value);
  $('play').onclick=()=>{running=!running;if(!running)recordCurrent();last=0;refresh();kick();};
  $('speed').onchange=e=>{speed=Number(e.target.value);$('speed-note').textContent='1 sekund här = '+speed+' sekund'+(speed===1?'':'er')+' i modellen.';};
  $('zoom').oninput=e=>scene?.setZoom(Number(e.target.value)/100);
  $('follow').onclick=()=>{select(!selected);kick();};
  $('camera').onclick=()=>{scene?.resetView();$('zoom').value=35;kick();};
  $('motion').onchange=e=>{motionOff=e.target.checked;scene?.setMotion(!motionOff&&running);kick();};
  $('reset').onclick=()=>{preset('liquid',true);select(false);scene?.resetView();$('zoom').value=35;};
  $('save-curve').onclick=()=>{
    recordCurrent();
    if(history.length<2){announce('Starta först ett försök för att kunna spara en kurva.');$('graph-readout').textContent='Värm eller kyl först. Sedan kan ni spara kurvan och jämföra ett nytt försök.';inspectorUntil=performance.now()+4000;return;}
    reference=history.map(p=>({...p}));$('reference').hidden=false;$('clear-curve').hidden=false;refresh();announce('Kurvan är sparad. Välj ett starttillstånd för ett nytt försök.');
  };
  $('clear-curve').onclick=()=>{reference=[];$('reference').hidden=true;$('clear-curve').hidden=true;refresh();};
  $('csv').onclick=()=>{
    recordCurrent();
    const rows=['modelltid_s;temperatur_C;forsok',...history.map(p=>number(p.timeSeconds,2)+';'+number(p.temperature,2)+';aktuellt'),...reference.map(p=>number(p.timeSeconds,2)+';'+number(p.temperature,2)+';sparat')];
    const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.join('\n')],{type:'text/csv;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='Vattenlabbet_matdata.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  import('./water-scene.js?v=20261109-water1').then(({createWaterScene})=>{
    if(destroyed)return;
    scene=createWaterScene($('scene'),{
      onReady(){if(destroyed)return;$('fallback').hidden=true;$('mode').textContent='3D · 48 H₂O';scene.setZoom(.35);refresh();kick();},
      onSelect(value){select(value.selected);},
      onError(){if(destroyed)return;$('scene').hidden=true;$('fallback').hidden=false;$('mode').textContent='2D · molekylmodell';$('scene-hint').textContent='Samma energimodell i en förenklad molekylvy.';$('camera').hidden=true;$('zoom').closest('label').hidden=true;kick();}
    });
    if(!scene.available){$('scene').hidden=true;$('fallback').hidden=false;}
  }).catch(()=>{
    if(destroyed)return;$('scene').hidden=true;$('fallback').hidden=false;$('mode').textContent='2D · molekylmodell';$('scene-hint').textContent='Samma energimodell i en förenklad molekylvy.';$('camera').hidden=true;$('zoom').closest('label').hidden=true;
  });
  refresh();kick();
  return {
    setActive(value){active=!!value;last=0;if(active)kick();else{cancelAnimationFrame(frame);frame=0;}},
    destroy(){destroyed=true;cancelAnimationFrame(frame);observer?.disconnect();document.removeEventListener('visibilitychange',onVisibility);scene?.destroy();graph.destroy();},
    get state(){return model.state;}
  };
}
