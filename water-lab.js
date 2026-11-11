import {WaterModel,WATER_CONSTANTS as C,MODEL_CARD,energyForState} from './water-model.js?v=20261110-labs3';
import {createTemperatureGraph} from './water-graph.js?v=20261111-water2';
import {attachLabTeX,installCanvasTeX} from './lab-tex.js?v=20261110-labs3';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const number=(v,digits=1)=>Number(v).toLocaleString('sv-SE',{maximumFractionDigits:digits,minimumFractionDigits:digits,useGrouping:false});
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={solid:'Is',melting:'Is och flytande vatten',liquid:'Flytande vatten',boiling:'Vatten och vattenånga',gas:'Vattenånga'};

/** Guided stops are enthalpy states; the ordinary WaterModel stays unchanged. */
export function waterGuideStages(massKg=.05){
  const fusion=massKg*C.fusion,boil=energyForState({massKg,temperature:100,phase:'liquid'}),liquid20=energyForState({massKg,temperature:20,phase:'liquid'});
  return [
    {title:'Börja med kall is',copy:'Provet är is vid −15 °C. Värm isen och följ temperaturen. Guiden stannar när isen når 0 °C.',action:'Värm isen till 0 °C',target:0,power:300,speed:2,group:0},
    {title:'Stanna och se: isen är 0 °C',copy:'Det är fortfarande is. Fortsätt tillföra energi och följ både temperaturkurvan och hur mycket is som finns kvar.',action:'Värm och smält en del av isen',target:fusion*.5,power:300,speed:10,group:1},
    {title:'0 °C: isen smälter',copy:'Halva provet är is och halva är flytande vatten. Temperaturen är kvar på 0 °C. Energin har gjort mer is till vatten. Se den plana delen av kurvan.',action:'Smält resten och värm vattnet',target:liquid20,power:300,speed:10,group:1},
    {title:'Nu är allt flytande vatten',copy:'Isen är borta och vattnet är 20 °C. Molekylerna kan glida förbi varandra. Värm vidare och följ när temperaturen börjar stanna igen.',action:'Värm tills vattnet kokar',target:boil+massKg*C.vaporization*.15,power:300,speed:10,group:2},
    {title:'100 °C: vatten blir vattenånga',copy:'Vattnet kokar och en del har blivit gas. Temperaturen stannar på 100 °C medan gasandelen ökar. Samma H₂O-molekyler finns kvar.',action:'Värm och bilda mer vattenånga',target:boil+massKg*C.vaporization*.5,power:300,speed:10,group:3},
    {title:'Fortfarande 100 °C — nu är halva provet gas',copy:'Mer tillförd energi har bildat mer vattenånga. Temperaturen har varit oförändrad. Kyl nu och följ hur gasen blir flytande vatten igen.',action:'Kyl vattenångan till flytande vatten',target:boil,power:-300,speed:10,group:3},
    {title:'100 °C: ångan har kondenserat',copy:'Hela provet är flytande igen. Temperaturen var 100 °C medan gasen kondenserade. Fortsätt kyla: nu kan temperaturen sjunka.',action:'Kyl vattnet till 20 °C',target:liquid20,power:-300,speed:10,group:4},
    {title:'Samma vatten genom hela övningen',copy:'Ni har följt is, flytande vatten och vattenånga. Vid 0 och 100 °C ändrades fasen utan att temperaturen ändrades. Hela tiden fanns samma 50 g vatten och samma H₂O-molekyler kvar.',action:'Gör guiden igen',group:4},
  ];
}

export function mountWaterLab(host){
  host.classList.add('water-lab-host');
  host.innerHTML=`<section class="water-lab" data-tex-rendered="water-lab" aria-labelledby="wl-title">
  <header class="wl-header"><div><p class="wl-kicker">FÖLJ TRE BILDER AV SAMMA VATTEN</p><h2 id="wl-title">Vattenlabbet</h2><p>50 g rent vatten · normalt lufttryck</p></div><button type="button" class="wl-focus-button" data-wl="focus" aria-expanded="false">Visa allt tillsammans</button></header>
  <ol class="wl-progress" aria-label="Vattnets väg"><li data-guide-group="0">Is</li><li data-guide-group="1">Smältning · 0 °C</li><li data-guide-group="2">Flytande vatten</li><li data-guide-group="3">Kokning · 100 °C</li><li data-guide-group="4">Kylning</li></ol>
  <div class="wl-guide" aria-labelledby="wl-guide-title"><p class="wl-guide-counter" data-wl="guide-counter">Steg 1 av 7</p><h3 id="wl-guide-title" data-wl="guide-title">Börja med kall is</h3><p data-wl="guide-copy">Värm isen och följ temperaturen.</p><div class="wl-main-actions"><button type="button" class="wl-primary" data-wl="next">Värm isen till 0 °C</button><button type="button" class="wl-pause" data-wl="pause" disabled>Pausa</button><button type="button" class="wl-reset" data-wl="reset">Börja om guiden ↺</button></div><div class="wl-action-state"><strong data-wl="run-state">Redo</strong><span data-wl="speed-note">Guiden pausar automatiskt så att ni kan se vad som händer.</span></div></div>
  <div class="wl-workbench"><div class="wl-stage">
    <div class="wl-sample"><p class="wl-panel-label">1 · PROVET</p><div class="wl-temperature"><output data-wl="temp">−15,0</output><span>°C</span></div><p class="wl-phase" data-wl="phase">Is</p>
<svg class="wl-vessel" data-wl="vessel" viewBox="0 0 260 245" role="img" aria-label="Vattenprov med rörligt lock vid konstant tryck"><defs><linearGradient id="wl-water-fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#61dfeb" stop-opacity=".8"/><stop offset="1" stop-color="#2377a6" stop-opacity=".85"/></linearGradient><linearGradient id="wl-glass" x1="0" y1="0" x2="1" y2=".3"><stop stop-color="#b6e7ef" stop-opacity=".12"/><stop offset=".5" stop-color="#87c6da" stop-opacity=".01"/><stop offset="1" stop-color="#b6e7ef" stop-opacity=".18"/></linearGradient><clipPath id="wl-clip"><rect x="58" y="24" width="144" height="181" rx="9"/></clipPath></defs><path d="M55 30V199Q55 212 69 212H191Q205 212 205 199V30" fill="url(#wl-glass)" stroke="#a6dce2" stroke-width="2"/><g clip-path="url(#wl-clip)"><rect data-wl="liquid-fill" x="58" y="118" width="144" height="88" fill="url(#wl-water-fill)"/><g data-wl="ice-pieces"></g><g data-wl="steam-dots"></g><path data-wl="surface" d="M58 118Q94 112 130 118T202 118" fill="none" stroke="#c2faff" stroke-width="2"/></g><g data-wl="lid"><rect x="51" y="90" width="158" height="8" rx="4" fill="#6b9aab" stroke="#c3e8e9"/><path d="M130 90V54" stroke="#90b4be" stroke-width="5"/><rect x="108" y="47" width="44" height="8" rx="4" fill="#9fbdc5"/></g><g data-wl="heat-arrows" fill="none" stroke="#ffa66c" stroke-width="3" stroke-linecap="round"></g><path d="M43 221H217" stroke="#567784" stroke-width="5" stroke-linecap="round"/></svg>
    </div><div class="wl-molecules"><div class="wl-scene-top"><p class="wl-panel-label">2 · MOLEKYLERNA</p><span data-wl="mode">Molekylvy</span></div><canvas class="wl-three" data-wl="scene" tabindex="0" aria-label="Molekylvy. Dra för att vrida. Plus och minus zoomar. Enter markerar en molekyl."></canvas><canvas class="wl-fallback" data-wl="fallback" role="img" aria-label="Molekylerna i provet"></canvas><div class="wl-scene-tools"><button type="button" data-wl="follow" aria-pressed="false">Följ en H₂O-molekyl</button><details class="wl-camera-details"><summary>Vrid och zooma</summary><div><p data-wl="scene-hint">Dra i bilden för att vrida.</p><label>Zooma <input data-wl="zoom" type="range" min="0" max="100" value="35" aria-label="Zooma molekylvyn"></label><button type="button" data-wl="camera">Återställ vy ↺</button><label><input type="checkbox" data-wl="motion"> Stilla molekylbild</label></div></details></div><p class="wl-atom-key" data-wl="selected-note">Varje H₂O: en O och två H. Bindningarna finns kvar.</p></div>
    <div class="wl-fractions" aria-label="Andel av hela vattenmängden"><div class="wl-fraction-bar"><span data-wl="ice-bar"></span><span data-wl="water-bar"></span><span data-wl="vapor-bar"></span></div><div class="wl-fraction-labels"><span>Is <output data-wl="ice-pct">100</output> %</span><span>Flytande <output data-wl="water-pct">0</output> %</span><span>Gas <output data-wl="vapor-pct">0</output> %</span></div></div>
  </div><div class="wl-chart"><div class="wl-chart-header"><div><p class="wl-panel-label">3 · TEMPERATURKURVAN</p><h3>Följ punkten på kurvan</h3></div><span class="wl-reference" data-wl="reference" hidden>Sparad jämförelse</span></div><p class="wl-chart-units">Temperatur i °C · provets tid i minuter</p><svg data-wl="graph" class="wl-graph" role="img" aria-label="Temperaturen i vattenprovet över tid"></svg><p class="wl-chart-readout" data-wl="graph-readout">Punkten visar provets temperatur just nu.</p></div></div>
  <details class="wl-advanced" data-wl="advanced"><summary>Egna försök, jämförelse och mätdata</summary><div class="wl-advanced-body"><p>Gör ett eget försök från det tillstånd ni ser nu, eller välj ett nytt startprov. Värm och Kyl startar handlingen direkt.</p><div class="wl-segment" aria-label="Välj ett eget startprov"><button type="button" data-wl-preset="solid">Is · −15 °C</button><button type="button" data-wl-preset="liquid">Vatten · 20 °C</button><button type="button" data-wl-preset="gas">Vattenånga · 110 °C</button></div><div class="wl-control-grid"><label class="wl-field" for="wl-power">Välj effekt för ett eget försök <output data-wl="power-label">300 W</output><input id="wl-power" data-wl="power" type="range" min="10" max="300" step="10" value="300"></label><label class="wl-field" for="wl-speed">Tidshastighet för eget försök<select id="wl-speed" data-wl="speed"><option value="1">1× · samma takt som klockan</option><option value="2">2× · snabbare</option><option value="10" selected>10× · snabbare</option><option value="30">30× · snabbast</option></select></label></div><div class="wl-action-buttons"><button type="button" class="wl-heat" data-wl="heat">Värm</button><button type="button" class="wl-cool" data-wl="cool">Kyl</button><button type="button" data-wl="zero">Följ utan värmeöverföring · 0 W</button></div><p class="wl-own-note" data-wl="own-note">Guiden är aktiv. Egna val startar ett fritt försök.</p><div class="wl-chart-actions"><button type="button" data-wl="save-curve">Spara kurvan som jämförelse</button><button type="button" data-wl="clear-curve" hidden>Ta bort jämförelsen</button><button type="button" data-wl="csv">Ladda ned mätdata ↓</button></div><p class="wl-data">Provets tid <strong data-wl="time">0:00</strong> · Nettoenergi <strong data-wl="energy">0,0 kJ</strong></p><button type="button" data-wl="back-guide">Tillbaka till guiden</button></div></details>
  <details class="wl-model"><summary>Om experimentet och källorna</summary><p>Vi följer 50 g rent vatten vid konstant normalt lufttryck, 101,3 kPa. Ett rörligt lock gör att samma vattenmängd kan finnas kvar när volymen ändras.</p><p>Temperatur och fasandelar beräknas från tillförd eller bortförd energi. Under smältning och kokning går energi till fasövergången. Bilden av molekyler visar ett litet utsnitt av hela provet.</p><p>Guiden pausar vid bestämda energitillstånd. Den första uppvärmningen visas i 2× hastighet; därefter används 10×. Provets tid på kurvan räknas alltid med samma fysikmodell. Vid paus står provets tid och energiöverföring stilla.</p><p>Isens öppnare struktur, rörelserna och ändrade avstånd hjälper er att följa tillstånden. H–O-bindningarna inne i varje H₂O-molekyl finns kvar. Modellen beräknar jämvikt utan värmeförluster, temperaturgradienter eller avdunstning under 100 °C, mellan −30 och 120 °C.</p><p>Energi = effekt × provets tid · Q = P · Δt</p><ul>${MODEL_CARD.sources.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.title)+'</a></li>').join('')}</ul></details><button type="button" class="wl-focus-exit" data-wl="close-focus" aria-label="Stäng förstoring">Stäng ×</button><p class="sr-only" data-wl="status" role="status" aria-live="polite"></p></section>`;
  const root=host.querySelector('.water-lab'),$=name=>root.querySelector('[data-wl="'+name+'"]');
  const model=new WaterModel({initialPhase:'solid',initialTemperature:-15}),guide=waterGuideStages(model.state.massKg);
  let mode='guide',guideIndex=0,goal=null,startEnergy=model.state.energyJ,history=[{timeSeconds:0,temperature:-15,milestone:true}],reference=[];
  let active=true,inView=true,destroyed=false,running=false,power=0,speed=2,manualSpeed=10,magnitude=300;
  let frame=0,last=0,lastUI=0,lastSample=0,visualTime=0,selected=false,scene=null,inspectorUntil=0;
  let motionOff=matchMedia('(prefers-reduced-motion: reduce)').matches,focused=false,previousOverflow='',focusReturn=null;
  const listeners=[],on=(target,event,handler)=>{const node=typeof target==='string'?$(target):target;node.addEventListener(event,handler);listeners.push(()=>node.removeEventListener(event,handler));};
  const graph=createTemperatureGraph($('graph'),{onInspect(point){inspectorUntil=performance.now()+2200;put('graph-readout','Avläst: '+number(point.timeSeconds/60,2)+' min · '+number(point.temperature)+' °C.');}});
  const ctx=$('fallback').getContext('2d'),restoreCanvasTeX=installCanvasTeX(ctx),restoreDOMTeX=attachLabTeX(host);
  const particles=Array.from({length:24},(_,i)=>({x:((i*73)%311)/311,y:((i*131+41)%277)/277}));
  $('motion').checked=motionOff;
  function put(name,value){const node=$(name),text=String(value);if(node.textContent!==text)node.textContent=text;}
  function announce(text){put('status',text);}
  function appendPoint(point){const previous=history.at(-1);if(Math.abs(previous.timeSeconds-point.timeSeconds)<1e-8)history[history.length-1]={...previous,...point,milestone:Boolean(previous.milestone||point.milestone)};else if(point.timeSeconds>previous.timeSeconds)history.push(point);}
  function recordCurrent(milestone=false){const s=model.state;appendPoint({timeSeconds:s.timeSeconds,temperature:s.temperature,milestone});}
  function select(value){selected=Boolean(value);$('follow').setAttribute('aria-pressed',String(selected));put('selected-note',selected?'Markerad H₂O: samma O och två H genom alla tillstånd.':'Varje H₂O: en O och två H. Bindningarna finns kvar.');scene?.setSelected(selected);}

  function drawFallback(state) {
    if (!ctx || scene?.available) return;
    const canvas = $('fallback'), box = canvas.getBoundingClientRect();
    const w = Math.max(160, box.width), h = Math.max(170, box.height), dpr = Math.min(devicePixelRatio || 1, 1.5);
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
    $('heat-arrows').innerHTML = !running||power===0 ? '' : [85,130,175].map((x,i)=>{
      const dy=running?Math.sin(visualTime*4+i)*3:0;
      return power>0 ? '<path d="M'+x+' '+(242+dy)+'v-20m-5 5l5-5 5 5"/>' : '<path d="M'+x+' '+(222+dy)+'v20m-5-5l5 5 5-5"/>';
    }).join('');
    $('vessel').setAttribute('aria-label', names[state.phase]+', '+number(state.temperature)+' grader Celsius. Ett rörligt lock håller trycket konstant.');
  }

  function stateExplanation(state){
    const heating=power>0,cooling=power<0,changing=running&&power!==0;
    if(running&&power===0)return 'Tiden går, men ingen energi förs till eller från provet. Temperaturen och andelarna är oförändrade.';
    if(!changing){
      if(state.phase==='melting')return 'Is och flytande vatten finns tillsammans vid 0 °C. Temperaturen ändras först när fasövergången är klar.';
      if(state.phase==='boiling')return 'Flytande vatten och vattenånga finns tillsammans vid 100 °C. Följ andelarna när ni värmer eller kyler.';
      if(state.phase==='solid')return 'Isens molekyler vibrerar kring sina platser. Samma H₂O-molekyler finns kvar.';
      if(state.phase==='gas')return 'Vattenångans molekyler är glest fördelade. Det är fortfarande H₂O.';
      return 'Flytande vattens molekyler ligger nära och kan röra sig förbi varandra.';
    }
    if(state.phase==='melting')return heating?'Energi till provet → mer is blir vatten → temperaturen är kvar på 0 °C. Se den plana kurvan och den minskande isandelen.':'Energi från provet → mer vatten fryser till is → temperaturen är kvar på 0 °C.';
    if(state.phase==='boiling')return heating?'Energi till provet → mer vatten blir gas → temperaturen är kvar på 100 °C. Samma H₂O-molekyler finns kvar.':'Energi från provet → vattenånga kondenserar → gasandelen minskar medan temperaturen är 100 °C.';
    if(heating)return 'Energi till provet → molekylernas genomsnittliga rörelse ökar → temperaturen stiger.';
    if(cooling)return 'Energi från provet → molekylernas genomsnittliga rörelse minskar → temperaturen sjunker.';
    return 'Tiden går, men ingen energi förs till eller från provet. Temperaturen är oförändrad.';
  }
  function stateTitle(state){
    if(!running)return 'Pausat vid '+number(state.temperature)+' °C';
    if(power===0)return 'Följ provet utan värmeöverföring';
    if(state.phase==='melting')return power>0?'0 °C: isen smälter':'0 °C: vattnet fryser';
    if(state.phase==='boiling')return power>0?'100 °C: vatten blir vattenånga':'100 °C: ångan kondenserar';
    return names[state.phase]+(power>0?' värms':' kyls');
  }
  function refresh(){
    const s=model.state,row=guide[guideIndex],band=Math.abs(s.temperature)<1e-7?'0':Math.abs(s.temperature-100)<1e-7?'100':'';
    root.dataset.temperatureBand=band;root.dataset.runDirection=running?(power>0?'heat':power<0?'cool':'zero'):'pause';
    put('temp',number(s.temperature));put('phase',names[s.phase]);
    const rounded=[s.iceFraction,s.liquidFraction,s.vaporFraction].map(v=>Math.round(v*100));rounded[rounded.indexOf(Math.max(...rounded))]+=100-rounded.reduce((a,b)=>a+b,0);
    ['ice','water','vapor'].forEach((key,i)=>{put(key+'-pct',rounded[i]);$(key+'-bar').style.width=[s.iceFraction,s.liquidFraction,s.vaporFraction][i]*100+'%';});
    put('guide-counter',mode==='guide'?(guideIndex<7?'Steg '+(guideIndex+1)+' av 7':'Guiden är klar'):'Eget försök');
    put('guide-title',mode==='guide'&&!running&&!goal?row.title:stateTitle(s));
    put('guide-copy',running||goal?stateExplanation(s):mode==='guide'?row.copy:stateExplanation(s));
    $('pause').disabled=!running;
    let action=mode==='guide'?row.action:power>0?'Värm vidare':power<0?'Kyl vidare':'Fortsätt utan värmeöverföring';
    if(goal&&!running)action=power>0?'Fortsätt värma':power<0?'Fortsätt kyla':action;
    put('next',running?(power>0?'Värmer…':power<0?'Kyler…':'Följer tiden…'):action);$('next').disabled=running;
    put('run-state',running?(power>0?'Uppvärmning pågår':power<0?'Kylning pågår':'0 W: tiden fortsätter'):'Pausat: tid och värmeöverföring står stilla');
    put('speed-note',mode==='guide'?'Guiden stannar automatiskt. Tiden visas '+(goal?speed:row.speed||10)+'× snabbare.':'Tiden visas '+speed+'× snabbare. Värm och Kyl startar direkt.');
    const group=mode==='guide'&&!running&&!goal?row.group:power<0?4:({solid:0,melting:1,liquid:2,boiling:3,gas:3}[s.phase]);
    root.querySelectorAll('[data-guide-group]').forEach(node=>{const index=Number(node.dataset.guideGroup);node.classList.toggle('wl-step-done',mode==='guide'&&index<group);if(index===group)node.setAttribute('aria-current','step');else node.removeAttribute('aria-current');});
    put('power-label',magnitude+' W');put('own-note',mode==='guide'?'Guiden är aktiv. Egna val startar ett fritt försök.':'Eget försök. Använd Värm eller Kyl, eller gå tillbaka till guiden.');
    const seconds=Math.floor(s.timeSeconds);put('time',Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0'));const energy=(s.energyJ-startEnergy)/1000;put('energy',(energy>0?'+':'')+number(energy)+' kJ');
    drawVessel(s);const plotted=history.at(-1).timeSeconds<s.timeSeconds?[...history,{timeSeconds:s.timeSeconds,temperature:s.temperature}]:history;graph.update(plotted,reference);
    if(performance.now()>inspectorUntil)put('graph-readout','Nu: '+number(s.temperature)+' °C · provets tid '+number(s.timeSeconds/60,2)+' min.'+(band?' Temperaturen ligger vid '+band+' °C.':''));
  }
  function pause(message='Pausat. Tid och värmeöverföring står stilla.'){running=false;last=0;recordCurrent(true);refresh();announce(message);}
  function nextAction(){
    if(running)return;
    if(mode==='guide'){
      if(guideIndex===7){resetGuide();return;}
      if(!goal){const row=guide[guideIndex];goal={energy:row.target,index:guideIndex};power=row.power;speed=row.speed;}
    }
    running=true;last=0;refresh();kick();announce(power>0?'Ni värmer provet.':power<0?'Ni kyler provet.':'Tiden går utan värmeöverföring.');
  }
  function manualAction(direction){recordCurrent(true);mode='manual';goal=null;speed=manualSpeed;power=direction*magnitude;running=true;last=0;refresh();kick();announce(direction>0?'Eget försök: uppvärmningen startar.':direction<0?'Eget försök: kylningen startar.':'Ingen energi förs till eller från provet. Tiden fortsätter.');}
  function resetState(phase,temperature){model.reset({phase,temperature});startEnergy=model.state.energyJ;history=[{timeSeconds:0,temperature:model.state.temperature,milestone:true}];lastSample=0;running=false;power=0;goal=null;visualTime=0;last=0;}
  function resetGuide(){mode='guide';guideIndex=0;speed=2;resetState('solid',-15);refresh();kick();announce('Guiden börjar med is vid minus15 grader. Tryck Värm isen.');}
  function preset(phase){mode='manual';speed=manualSpeed;resetState(phase,{solid:-15,liquid:20,gas:110}[phase]);refresh();kick();announce('Nytt eget prov: '+names[model.state.phase]+', '+number(model.state.temperature)+' grader.');}
  function finishGoal(){recordCurrent(true);running=false;goal=null;guideIndex=Math.min(7,guideIndex+1);last=0;refresh();announce(guide[guideIndex].title+'. Guiden har pausat.');}
  function advance(dt){
    const before=model.state;let seconds=dt*speed;
    if(power!==0){
      const boundary=goal?.energy??energyForState({massKg:before.massKg,temperature:power>0?120:-30,phase:power>0?'gas':'solid'});
      const remaining=(boundary-before.energyJ)/power;
      if(remaining<=1e-10){if(goal)finishGoal();else pause('Provet har nått modellens temperaturgräns. Välj motsatt riktning.');return;}
      seconds=Math.min(seconds,remaining);
    }
    if(seconds<=0)return;
    const after=model.step(seconds,power),fusion=before.massKg*C.fusion,boil=before.massKg*(C.fusion+100*C.cpLiquid),end=boil+before.massKg*C.vaporization;
    if(power!==0){const sign=Math.sign(power),crossings=[0,fusion,boil,end].filter(e=>(e-before.energyJ)*sign>1e-9&&(after.energyJ-e)*sign>=-1e-9).sort((a,b)=>(a-b)*sign);for(const e of crossings)appendPoint({timeSeconds:before.timeSeconds+(e-before.energyJ)/power,temperature:e<=fusion?0:100,milestone:true});}
    if(after.timeSeconds-lastSample>=.3){recordCurrent();lastSample=after.timeSeconds;}
    if(history.length>3600)history=history.filter((p,i)=>p.milestone||i%2===0||i===history.length-1);
    if(goal&&Math.abs(after.energyJ-goal.energy)<1e-6)finishGoal();
    else if(power!==0&&(after.temperature<=-30||after.temperature>=120))pause('Temperaturgränsen är nådd. Välj motsatt riktning för att fortsätta.');
  }
  function tick(now){
    frame=0;if(destroyed||!active||!inView||document.hidden||!root.isConnected){last=0;return;}
    const dt=last?Math.min(.08,Math.max(0,(now-last)/1000)):0;last=now;
    if(running&&dt>0)advance(dt);
    if(running&&!motionOff)visualTime+=dt;
    scene?.setMotion(running&&!motionOff);scene?.update(model.state,running&&!motionOff?dt:0);drawFallback(model.state);
    if(now-lastUI>100){refresh();lastUI=now;}
    if(!frame&&!destroyed&&active&&inView&&!document.hidden)frame=requestAnimationFrame(tick);
  }
  function kick(){if(!frame&&active&&inView&&!destroyed&&!document.hidden)frame=requestAnimationFrame(tick);}
  const visibility=()=>{last=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else kick();};document.addEventListener('visibilitychange',visibility);
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;last=0;if(inView)kick();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'180px'}):null;observer?.observe(root);
  function setFocus(value){
    if(focused===value)return;focused=value;root.classList.toggle('wl-focus',focused);$('focus').setAttribute('aria-expanded',String(focused));put('focus',focused?'Tillbaka till kemisidan':'Visa allt tillsammans');
    if(focused){focusReturn=document.activeElement;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.scrollTop=0;$('focus').focus();}
    else{document.body.style.overflow=previousOverflow;root.removeAttribute('role');root.removeAttribute('aria-modal');focusReturn?.focus?.({preventScroll:true});}
    inView=true;last=0;kick();
  }
  on('focus','click',()=>setFocus(!focused));on('close-focus','click',()=>setFocus(false));
  on(root,'keydown',e=>{if(!focused)return;if(e.key==='Escape'){e.preventDefault();setFocus(false);}if(e.key==='Tab'){const nodes=[...root.querySelectorAll('button,input,select,summary,canvas[tabindex],svg[tabindex],a[href]')].filter(n=>!n.disabled&&n.tabIndex>=0&&n.getClientRects().length);const first=nodes[0],final=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();final?.focus();}else if(!e.shiftKey&&document.activeElement===final){e.preventDefault();first?.focus();}}});
  on('next','click',nextAction);on('pause','click',()=>pause());on('reset','click',resetGuide);on('back-guide','click',()=>{resetGuide();$('advanced').open=false;$('next').focus({preventScroll:true});$('next').scrollIntoView({block:'center'});});
  root.querySelectorAll('[data-wl-preset]').forEach(button=>on(button,'click',()=>preset(button.dataset.wlPreset)));
  on('heat','click',()=>manualAction(1));on('cool','click',()=>manualAction(-1));on('zero','click',()=>manualAction(0));
  on('power','input',e=>{magnitude=Number(e.target.value);put('power-label',magnitude+' W');if(mode==='manual'&&power!==0){recordCurrent(true);power=Math.sign(power)*magnitude;}});
  on('speed','change',e=>{manualSpeed=Number(e.target.value);if(mode==='manual'){recordCurrent(true);speed=manualSpeed;refresh();}});
  on('zoom','input',e=>scene?.setZoom(Number(e.target.value)/100));on('follow','click',()=>{select(!selected);kick();});on('camera','click',()=>{scene?.resetView();$('zoom').value=35;scene?.setZoom(.35);kick();});
  on('motion','change',e=>{motionOff=e.target.checked;scene?.setMotion(running&&!motionOff);kick();});
  on('save-curve','click',()=>{recordCurrent(true);if(history.length<2){announce('Värm eller kyl först. Spara sedan kurvan.');return;}reference=history.map(p=>({...p}));$('reference').hidden=false;$('clear-curve').hidden=false;refresh();announce('Kurvan är sparad. Välj ett nytt startprov för att jämföra.');});
  on('clear-curve','click',()=>{reference=[];$('reference').hidden=true;$('clear-curve').hidden=true;refresh();});
  on('csv','click',()=>{recordCurrent(true);const rows=['modelltid_s;temperatur_C;forsok',...history.map(p=>number(p.timeSeconds,2)+';'+number(p.temperature,2)+';aktuellt'),...reference.map(p=>number(p.timeSeconds,2)+';'+number(p.temperature,2)+';sparat')];const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.join('\n')],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='Vattenlabbet_matdata.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  import('./water-scene.js?v=20261110-labs3').then(({createWaterScene})=>{if(destroyed)return;scene=createWaterScene($('scene'),{onReady(){if(destroyed)return;$('fallback').hidden=true;put('mode','3D · samma H₂O');scene.setZoom(.35);refresh();kick();},onSelect(value){select(value.selected);},onError(){if(destroyed)return;fallback();}});if(!scene.available)fallback();}).catch(()=>{if(!destroyed)fallback();});
  function fallback(){$('scene').hidden=true;$('fallback').hidden=false;put('mode','Molekylvy');put('scene-hint','Följ de hela vattenmolekylerna.');$('camera').hidden=true;$('zoom').closest('label').hidden=true;kick();}
  refresh();kick();
  return{setActive(value){active=Boolean(value);last=0;if(active)kick();else{if(focused)setFocus(false);cancelAnimationFrame(frame);frame=0;}},destroy(){if(destroyed)return;if(focused)setFocus(false);destroyed=true;cancelAnimationFrame(frame);observer?.disconnect();document.removeEventListener('visibilitychange',visibility);listeners.forEach(remove=>remove());restoreDOMTeX();restoreCanvasTeX();scene?.destroy();graph.destroy();},get state(){return model.state;}};
}
