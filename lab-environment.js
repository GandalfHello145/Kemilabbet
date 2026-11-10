import { createLab } from './lab-kit.js?v=20261110-labs3';
import { EnvironmentModel, ENVIRONMENT_CONSTANTS, compareEnvironmentAtTime } from './lab-environment-model.js?v=20261110-labs3';

const num=(v,d=1)=>Number(v).toLocaleString('sv-SE',{minimumFractionDigits:d,maximumFractionDigits:d,useGrouping:false});
const C=ENVIRONMENT_CONSTANTS;
const colors={ink:'#dceff2',muted:'#9dbdc7',water:'#69dce6',organisms:'#edc17a',source:'#d28b7b',safe:'#80c9a8',ground:'#c8ad86'};
const names={source:'Kvar i källan',land:'I marken',water:'I vattnet',organisms:'I organismer',collected:'Insamlat',outflow:'Ut ur området'};
const keys=Object.keys(names);
function text(ctx,value,x,y,size=20,color=colors.ink,align='left'){ctx.fillStyle=color;ctx.font=size+'px LMSans, Arial, sans-serif';ctx.textAlign=align;ctx.fillText(value,x,y);}
function line(ctx,points,color,width=3,dash=[]){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
function round(ctx,x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}}
function dot(ctx,x,y,r,color){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
function arrow(ctx,a,b,color){const ang=Math.atan2(b.y-a.y,b.x-a.x);ctx.save();ctx.translate(b.x,b.y);ctx.rotate(ang);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-12,-7);ctx.lineTo(-12,7);ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.restore();}
function flow(ctx,points,intensity,time,color){
 line(ctx,points,color+'55',3);const a=points.at(-2),b=points.at(-1);arrow(ctx,{x:a[0],y:a[1]},{x:b[0],y:b[1]},color+'99');
 if(intensity<.001)return;
 const n=Math.max(1,Math.min(18,Math.ceil(intensity*1.7)));
 const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1])),total=lengths.reduce((a,b)=>a+b,0);
 for(let i=0;i<n;i++){
  let dist=((i/n+time*.12)%1)*total;
  for(let j=0;j<lengths.length;j++){if(dist<=lengths[j]||j===lengths.length-1){const q=dist/lengths[j];dot(ctx,points[j][0]+(points[j+1][0]-points[j][0])*q,points[j][1]+(points[j+1][1]-points[j][1])*q,3.5,color);break;}dist-=lengths[j];}
 }
}
function fish(ctx,x,y,scale=1,color='#d9bc7b'){
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(0,0,28,13,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(-23,0);ctx.lineTo(-41,-16);ctx.lineTo(-41,16);ctx.closePath();ctx.fill();dot(ctx,15,-3,2.5,'#24434b');ctx.restore();
}
function chartHTML(){
 return '<svg id="environment-chart" class="cl-chart" viewBox="0 0 760 230" role="img" aria-label="Relativ halt i vatten och organismer över modelltid" style="display:block;width:100%;height:auto;min-height:150px;font-family:LMSans,Arial,sans-serif"><defs><clipPath id="environment-plot"><rect x="66" y="28" width="668" height="150"/></clipPath></defs><g id="environment-grid"></g><g clip-path="url(#environment-plot)"><path id="environment-fill" fill="#21b6c71f"/><path id="environment-ref" fill="none" stroke="#849a9e" stroke-dasharray="7 6" stroke-width="3"/><path id="environment-water-line" fill="none" stroke="#087f94" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><path id="environment-organism-line" fill="none" stroke="#ad781d" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><circle id="environment-current" r="4.5" fill="#087f94" stroke="white" stroke-width="2"/></g><g id="environment-ticks"></g><text x="20" y="105" transform="rotate(-90 20 105)" text-anchor="middle" fill="#496a75" font-size="18">Relativ halt</text><text x="399" y="225" text-anchor="middle" fill="#496a75" font-size="18">Försökstid (min)</text></svg>';
}
export function mountLab(host){
 const model=new EnvironmentModel();let history=[model.state],reference=[],speed=5,lastSample=0,lastDrawn=0,drag=null,armed=null,pointer={x:0,y:0},pointerStart=null,compact=false,placement=null,comparing=false,comparisonDone=false,referenceRate=8,stopAt=120,comparisonControlled=true,pulseTime=0;
 const controls=[
  '<p class="cl-task-hint">Uppdrag: få minst hälften så hög vattenhalt som i ert sparade före-försök.</p>',
  '<div class="cl-actions"><button id="environment-baseline" class="cl-primary">Gör ett före-försök ▶</button><button id="environment-save-control" class="cl-secondary">Spara före-försöket</button></div>',
  '<div class="cl-actions"><button data-environment-action="seal" class="cl-secondary">Välj skydd för källan</button><button data-environment-action="collect" class="cl-secondary">Välj insamling</button></div><button id="environment-place" class="cl-primary" disabled>Välj en åtgärd först</button>',
  '<p id="environment-action-hint" class="cl-task-hint">Dra ett åtgärdskort i bilden till den matchande ringen. Det går också att välja och placera med knapparna.</p>',
  '<label class="cl-field">Tidshastighet<select id="environment-speed"><option value="1">Lugn</option><option value="5" selected>Normal</option><option value="10">Snabb</option></select></label>',
  '<details><summary>Justera åtgärderna själv</summary><div class="cl-control-grid"><label class="cl-field">Möjligt utsläpp från källan <output id="environment-rate-label">8</output> relativa enheter/min<input id="environment-rate" type="range" min="0" max="20" value="8" step="1"></label><label class="cl-field">Täta källan <output id="environment-prevent-label">0</output> %<input id="environment-prevent" type="range" min="0" max="100" value="0" step="10"></label><label class="cl-field">Samla upp före marken <output id="environment-treat-label">0</output> %<input id="environment-treat" type="range" min="0" max="100" value="0" step="10"></label></div></details>',
  '<button id="environment-reset" class="cl-secondary">Gör om nuvarande försök ↺</button>'
 ].join('');
 const below=[
  '<section><div class="cl-control-grid"><div><h3>Följ halterna över tid</h3><p class="cl-note"><span style="color:#087f94">● Vatten</span> · <span style="color:#ad781d">● Organismer</span> · <span style="color:#849a9e">– Sparat försök: vatten</span></p></div><div class="cl-actions"><button id="environment-save" class="cl-secondary">Spara detta försök</button><button id="environment-clear" hidden>Rensa jämförelse</button><button id="environment-csv">Ladda ned mätdata ↓</button></div></div>',
  chartHTML(),'<p id="environment-time-label" class="cl-note">Starta försöket för att följa ämnets väg.</p></section>',
  '<section><h3>Vart har ämnet tagit vägen?</h3><p class="cl-note">Alla mängder nedan hör till samma startmängd på 1 000 relativa mängdenheter. Insamlat och utflöde finns kvar i bokföringen.</p><div style="overflow-x:auto"><table class="cl-table"><thead><tr><th>Plats</th><th>Relativ mängd</th><th>Andel av startmängden</th></tr></thead><tbody id="environment-ledger"></tbody><tfoot><tr><th>Summa</th><td id="environment-total">1 000,0</td><td>100 %</td></tr></tfoot></table></div><p id="environment-message" class="cl-note" role="status"></p></section>'
 ].join('');
 const lab=createLab(host,{
  id:'environment',title:'Miljölandskapet',subtitle:'Stoppa ämnet före vattnet. Jämför vad som når fisken.',badge:'FÖLJ UTSLÄPPET · PRÖVA EN ÅTGÄRD',
  controls,below,runLabel:'Starta spridningen',pauseLabel:'Pausa spridningen',
  objective:'Starta ett före-försök. Följ ämnet från källan till vattnet och fisken.',
  steps:[{title:'Följ utsläppet',text:'Se hur ämnet går från källa till vatten och organismer.'},{title:'Spara före-försöket',text:'Behåll kurvan för att kunna jämföra.'},{title:'Placera en åtgärd',text:'Täta källan eller samla upp ämnet.'},{title:'Jämför vid samma tid',text:'Kan ni minst halvera vattenhalten?'}],
  metrics:'<div><span>Halt i vatten</span><strong data-metric="water">0,00</strong></div><div><span>Halt i organismer</span><strong data-metric="organisms">0,00</strong></div><div><span>Insamlad mängd</span><strong data-metric="collected">0,0</strong></div><div><span>Bevarad mängd</span><strong data-metric="total">1 000,0</strong></div><div><span>Vattenhalt mot före-försök</span><strong data-metric="comparison">Spara först</strong></div>',
  explanationTitle:'Följ ämnet från källan.',
  explanation:'Starta ett före-försök. Prickarna följer flödet till marken, vattnet och organismerna. Spara kurvan innan ni placerar en åtgärd.',
  questions:['Varför kan halterna i vatten och organismer förändras olika snabbt?','Vad händer med ämnet som samlas upp? Har det upphört att finnas?','Vilka inställningar måste vara lika när ni jämför två åtgärder?'],
  canvasLabel:'Miljölandskap med källa, mark, vatten, organismer, insamling och utflöde. Dra Täta till källan eller Samla till uppsamlingen; samma åtgärder finns som knappar.',
  model:'<p>Detta är en påhittad modell av ett ämne som inte bryts ned under försöket. Startmängden är 1 000 relativa mängdenheter i källan. Inga inställningar, flödeshastigheter eller halter motsvarar en verklig kemikalie, plats eller riskgräns. Modellen är inte en prognos för PFAS eller för någon annan verklig förorening.</p><p>Att täta källan minskar andelen som släpps ut per minut; resten stannar kvar i källan. Insamlingen flyttar en andel av utsläppet till ett separat omhändertagande. Det som inte samlas upp går till marken och kan lakas till vattnet. Därifrån kan det tas upp av organismer, återföras från organismer till vatten eller rinna ut ur det visade området.</p><p>Alla förflyttningar bevarar mängden. Vi beräknar relativ halt som mängd delad med fast vattenvolym (100 relativa volymenheter) respektive fast organismmassa (5 relativa massenheter). Höjd halt i en organism över tid illustrerar upptag och kvarhållning; vi modellerar inte en näringskedja eller biomagnifikation.</p><p>Prickarna visar flödesriktningar, inte exakta antal molekyler. Risk beror även på ämnets farliga egenskaper, dos och exponering. En kurva här visar därför inte hur farligt vattnet eller en fisk är. Försöket stannar efter 120 modellminuter; värden visas avrundade.</p><ul><li><a href="https://www.kemi.se/ovrigt/ordlista" target="_blank" rel="noopener">Kemikalieinspektionen: ordlista, exponering och riskbedömning</a></li><li><a href="https://www.epa.gov/p2/learn-about-pollution-prevention" target="_blank" rel="noopener">US EPA: förebygg föroreningar vid källan</a></li></ul>'
 });
 const $=selector=>lab.$(selector);
 function record(){const s=model.state;if(Math.abs(history.at(-1).timeMinutes-s.timeMinutes)<1e-8)history[history.length-1]=s;else history.push(s);}
 function syncMission(){
  const state=model.state,comparison=comparing?compareEnvironmentAtTime(state,reference):null;
  let metric='Spara först';
  if(reference.length&&!comparing)metric='Placera åtgärd';
  if(comparison)metric=Math.abs(comparison.reductionPercent)<.05?'Lika':num(Math.abs(comparison.reductionPercent),0)+(comparison.reductionPercent>=0?' % lägre':' % högre');
  lab.setMetric('comparison',metric);
  if(!reference.length){
   lab.setStep?.(state.timeMinutes>=10?1:0);
   lab.setObjective?.(state.timeMinutes>=10?'Ni har ett före-försök. Spara kurvan innan ni placerar en åtgärd.':'Starta spridningen och följ ämnets väg från källan till vattnet och fisken.');
  }else if(!comparing){
   lab.setStep?.(2);lab.setObjective?.(armed?'Placera åtgärden i den lysande ringen.':'Dra ett åtgärdskort till källan eller insamlingen.');
  }else{
   lab.setStep?.(3);
   const success=comparisonDone&&comparisonControlled&&comparison&&comparison.reductionPercent>=50;
   lab.setObjective?.(success?'Målet är nått: vattenhalten är minst halverad vid samma tid. Förklara vart ämnet tog vägen.':!comparisonControlled?'Källans utsläpp ändrades också. Gör om med samma utsläpp för en rättvis jämförelse.':comparisonDone?'Jämför utfallet. Kan ni ändra åtgärden så att vattenhalten minst halveras?':'Följ de två försöken vid samma tid. Hur mycket ämne når vattnet nu?',Boolean(success));
  }
 }
 function explanation(){
  const state=model.state,comparison=comparing?compareEnvironmentAtTime(state,reference):null;
  if(armed){lab.setExplanation(drag&&hitTarget(drag,pointer)?'Släpp här – åtgärden snäpper på plats.':'Placera åtgärden i den lysande ringen.',armed==='seal'?'Skyddet hör till utsläppskällan till vänster.':'Insamlingen hör till flödet före marken.');return;}
  if(placement){lab.setExplanation('Åtgärden snäpper på plats.','Nu börjar ett nytt försök från samma startmängd. Följ hur flödet fördelas annorlunda.');return;}
  if(reference.length&&!comparing){lab.setExplanation('Före-försöket är sparat.','Dra ett åtgärdskort till källan eller insamlingen. Nästa försök börjar från samma mängd och jämförs vid samma tid.');return;}
  if(comparisonDone&&comparison){
   lab.setExplanation('Vattenhalten är '+num(Math.abs(comparison.reductionPercent),0)+(comparison.reductionPercent>=0?' procent lägre.':' procent högre.'),'Jämförelsen gäller samma tid: '+num(state.timeMinutes)+' minuter. Kontrollera bokföringen: mer kan finnas kvar i källan eller i insamlingen. Det insamlade ämnet har inte försvunnit.');return;
  }
  if(state.prevention>0)lab.setExplanation('Mindre ämne lämnar källan.','Skyddet håller kvar en del. Följ hur det påverkar vattnet och organismerna längre ned i kedjan.');
  else if(state.treatment>0)lab.setExplanation('En del leds till insamlingen.','Prickarna delar väg: det insamlade ämnet går till behållaren i stället för till marken och vattnet.');
  else if(state.timeMinutes>0)lab.setExplanation('Följ fördröjningen mellan platserna.','Ämnet går först till marken, sedan till vattnet. Organismer tar upp en del och kan lämna tillbaka en del till vattnet.');
  else lab.setExplanation('Var kan ni bryta ämnets väg?','Gör först ett försök utan åtgärd. Spara kurvan och placera sedan ett skydd eller en insamling.');
 }
 function drawChart(s){
  const all=history.at(-1).timeMinutes<s.timeMinutes?[...history,s]:history;
  const maxX=Math.max(20,Math.ceil(Math.max(all.at(-1)?.timeMinutes||0,reference.at(-1)?.timeMinutes||0)/20)*20);
  const maxObserved=Math.max(.1,...all.map(p=>p.waterConcentration),...all.map(p=>p.organismConcentration),...reference.map(p=>p.waterConcentration));
  const magnitude=10**Math.floor(Math.log10(maxObserved));const maxY=Math.ceil(maxObserved/magnitude/2)*magnitude*2;
  const x=t=>66+t/maxX*668,y=c=>178-c/maxY*150;
  const path=(data,key)=>data.map((p,i)=>(i?'L':'M')+x(p.timeMinutes).toFixed(2)+','+y(p[key]).toFixed(2)).join(' ');
  $('#environment-water-line').setAttribute('d',path(all,'waterConcentration'));
  $('#environment-organism-line').setAttribute('d',path(all,'organismConcentration'));
  $('#environment-ref').setAttribute('d',path(reference,'waterConcentration'));
  const waterPath=path(all,'waterConcentration');
  $('#environment-fill').setAttribute('d',waterPath+' L'+x(s.timeMinutes).toFixed(2)+',178 L66,178 Z');
  $('#environment-current').setAttribute('cx',x(s.timeMinutes));$('#environment-current').setAttribute('cy',y(s.waterConcentration));
  $('#environment-grid').innerHTML=Array.from({length:4},(_,i)=>{const value=maxY*i/3,yy=y(value);return '<line x1="66" x2="734" y1="'+yy+'" y2="'+yy+'" stroke="#dce7e7"/><text x="56" y="'+(yy+6)+'" fill="#58777f" font-size="18" text-anchor="end">'+num(value,maxY<1?2:1)+'</text>';}).join('')+'<path d="M66 28V178H734" fill="none" stroke="#93aeb2" stroke-width="1.4"/>';
  $('#environment-ticks').innerHTML=Array.from({length:5},(_,i)=>{const v=maxX*i/4;return '<text x="'+x(v)+'" y="202" fill="#58777f" font-size="18" text-anchor="middle">'+num(v,0)+'</text>';}).join('');
 }
 function update(){
  const s=model.state;
  $('#environment-rate-label').textContent=num(s.emissionRate,0);$('#environment-prevent-label').textContent=num(s.prevention*100,0);$('#environment-treat-label').textContent=num(s.treatment*100,0);
  lab.setMetric('water',num(s.waterConcentration,2));lab.setMetric('organisms',num(s.organismConcentration,2));lab.setMetric('collected',num(s.collected));lab.setMetric('total',num(s.total));
  $('#environment-ledger').innerHTML=keys.map(k=>'<tr><th scope="row">'+names[k]+'</th><td>'+num(s[k])+'</td><td><progress value="'+s[k]+'" max="1000" aria-label="'+names[k]+', '+num(s[k]/10)+' procent" style="width:100%;max-width:180px;accent-color:#1b9397"></progress> '+num(s[k]/10)+' %</td></tr>').join('');
  $('#environment-total').textContent=num(s.total);
  $('#environment-time-label').textContent='Tid i försöket: '+num(s.timeMinutes)+' min'+(comparing?' · jämförs med före-försöket vid samma tid.':'.');
  drawChart(s);explanation();syncMission();lab.root.querySelectorAll('[data-environment-action]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.environmentAction===armed)));lab.invalidate();
 }
 function params(){
  record();if(comparing&&Math.abs(Number($('#environment-rate').value)-referenceRate)>1e-8)comparisonControlled=false;model.configure({emissionRate:Number($('#environment-rate').value),prevention:Number($('#environment-prevent').value)/100,treatment:Number($('#environment-treat').value)/100});update();
 }
 function reset(){
  model.reset();history=[model.state];lastSample=0;comparing=reference.length>0;comparisonDone=false;comparisonControlled=!reference.length||Math.abs(model.emissionRate-referenceRate)<1e-8;stopAt=reference.length?reference.at(-1).timeMinutes:120;placement=null;armed=null;drag=null;$('#environment-place').disabled=true;$('#environment-place').textContent='Välj en åtgärd först';lab.setRunning(false);
  $('#environment-message').textContent='Försöket börjar från samma startmängd. Den sparade kurvan finns kvar.';update();
 }
 function startBaseline(){
  reference=[];comparing=false;comparisonDone=false;comparisonControlled=true;stopAt=120;armed=null;placement=null;
  $('#environment-prevent').value=0;$('#environment-treat').value=0;$('#environment-clear').hidden=true;
  model.configure({emissionRate:Number($('#environment-rate').value),prevention:0,treatment:0});model.reset();history=[model.state];lastSample=0;lab.setRunning(true);
  $('#environment-message').textContent='Före-försöket är igång. Följ ämnet till vattnet och organismerna.';update();
 }
 function saveReference(){
  record();if(model.state.timeMinutes<10){lab.setExplanation('Följ utsläppet en stund först.','Låt tiden nå minst 10 minuter så att ämnet hinner komma till vattnet. Spara sedan kurvan.');$('#environment-message').textContent='Låt försöket nå minst 10 minuter före sparning.';return;}
  if(model.state.waterConcentration<=1e-10){lab.setExplanation('Ingen halt att minska.','Starta ett före-försök utan åtgärd och med utsläpp större än noll. Då finns en vattenhalt att jämföra med.');$('#environment-message').textContent='Ingen halt att minska. Starta ett före-försök med utsläpp större än noll.';return;}
  reference=history.map(point=>({...point}));referenceRate=model.emissionRate;comparing=false;comparisonDone=false;lab.setRunning(false);$('#environment-clear').hidden=false;
  $('#environment-message').textContent='Före-försöket är sparat till '+num(reference.at(-1).timeMinutes)+' minuter. Placera nu en åtgärd.';
  lab.celebrate?.(450,70);update();
 }
 function armAction(id){
  armed=id;$('#environment-place').disabled=false;$('#environment-place').textContent=id==='seal'?'Placera skyddet på källan':'Placera insamlingen i flödet';
  $('#environment-action-hint').textContent=id==='seal'?'Släpp skyddet över utsläppskällan till vänster.':'Släpp insamlingen i ringen före marken.';
  lab.root.querySelectorAll('[data-environment-action]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.environmentAction===id)));
  lab.setExplanation('En åtgärd är vald.','Dra kortet till den lysande ringen, tryck i ringen eller använd knappen Placera.');syncMission();lab.invalidate();
 }
 function applyAction(id,from){
  const target=id==='seal'?{x:118,y:160}:{x:280,y:200};
  armed=null;drag=null;$('#environment-place').disabled=true;$('#environment-place').textContent='Välj en åtgärd först';
  $('#environment-prevent').value=id==='seal'?80:0;$('#environment-treat').value=id==='collect'?80:0;
  if(reference.length){$('#environment-rate').value=referenceRate;model.configure({emissionRate:referenceRate,prevention:id==='seal'?.8:0,treatment:id==='collect'?.8:0});model.reset();history=[model.state];lastSample=0;comparing=true;comparisonDone=false;comparisonControlled=true;stopAt=reference.at(-1).timeMinutes;}
  else model.configure({emissionRate:Number($('#environment-rate').value),prevention:id==='seal'?.8:0,treatment:id==='collect'?.8:0});
  placement={id,from:from||{x:id==='seal'?350:550,y:65},to:target,age:0};
  lab.setRunning(true);$('#environment-message').textContent=reference.length?'Nytt försök: samma startmängd, samma utsläpp och samma sluttid.':'Åtgärden är på plats. Sådant som redan spridits kan fortsätta förflyttas.';
  update();lab.announce(id==='seal'?'Skyddet tätar källan till 80 procent.':'Insamlingen tar hand om 80 procent av nytt utsläpp.');
 }
 ['#environment-rate','#environment-prevent','#environment-treat'].forEach(id=>lab.on(id,'input',params));
 lab.on('#environment-speed','change',e=>{speed=Number(e.target.value);});
 lab.on('#environment-baseline','click',startBaseline);
 lab.on('#environment-reset','click',reset);
 lab.on('#environment-save','click',saveReference);
 lab.on('#environment-save-control','click',saveReference);
 lab.root.querySelectorAll('[data-environment-action]').forEach(b=>lab.on(b,'click',()=>armAction(b.dataset.environmentAction)));
 lab.on('#environment-place','click',()=>{if(armed)applyAction(armed);});
 lab.on('#environment-clear','click',()=>{reference=[];comparing=false;comparisonDone=false;stopAt=120;$('#environment-clear').hidden=true;$('#environment-message').textContent='Jämförelsen är rensad. Ni kan spara ett nytt före-försök.';update();});
 lab.on('#environment-csv','click',()=>{
  record();const header='modelltid_min;kalla;mark;vatten;organismer;insamlat;utfloede;relativ_halt_vatten;relativ_halt_organismer;forsok';
  const values=(p,type)=>[p.timeMinutes,p.source,p.land,p.water,p.organisms,p.collected,p.outflow,p.waterConcentration,p.organismConcentration].map(v=>num(v,3)).join(';')+';'+type;
  const rows=[header,...history.map(p=>values(p,'aktuellt')),...reference.map(p=>values(p,'sparat'))];
  const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.join('\n')],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='Miljolandskapet_matdata.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
 const tools=[{id:'seal',x:350,y:65,label:'Täta',detail:'källan'},{id:'collect',x:550,y:65,label:'Samla',detail:'upp utsläpp'}];
 const targetFor=id=>id==='seal'?{x:118,y:195,r:92}:{x:280,y:204,r:76};
 const hitTarget=(id,p)=>{const t=targetFor(id);return Math.hypot(p.x-t.x,p.y-t.y)<t.r;};
 lab.canvas.style.touchAction='none';
 lab.on(lab.canvas,'pointerdown',e=>{
  const p=lab.point(e),tool=tools.find(t=>Math.abs(t.x-p.x)<91&&Math.abs(t.y-p.y)<43);
  if(tool){drag=tool.id;armed=tool.id;pointer=p;pointerStart=p;armAction(tool.id);lab.canvas.setPointerCapture?.(e.pointerId);e.preventDefault();}
  else if(armed&&hitTarget(armed,p)){applyAction(armed,p);e.preventDefault();}
 });
 lab.on(lab.canvas,'pointermove',e=>{
  const p=lab.point(e);
  if(drag){pointer=p;$('#environment-action-hint').textContent=hitTarget(drag,p)?'Släpp nu – åtgärden snäpper på plats.':'Flytta kortet till den lysande ringen.';lab.invalidate();}
  lab.canvas.style.cursor=drag?'grabbing':tools.some(t=>Math.abs(t.x-p.x)<91&&Math.abs(t.y-p.y)<43)||armed&&hitTarget(armed,p)?'grab':'default';
 });
 lab.on(lab.canvas,'pointerup',e=>{
  if(!drag)return;const p=lab.point(e),id=drag;drag=null;
  if(hitTarget(id,p))applyAction(id,p);
  else {$('#environment-action-hint').textContent='Tryck i målområdet eller dra kortet igen. Använd Placera-knappen om ni föredrar det.';lab.invalidate();}
 });
 lab.on(lab.canvas,'pointercancel',()=>{drag=null;lab.invalidate();});
 lab.setDraw(frame=>{
  const {ctx,dt,time,running,motion}=frame;compact=!!frame.compact;
  if(motion)pulseTime+=dt;
  if(placement){placement.age+=motion?dt:1;if(placement.age>=.65){const target=placement.to;placement=null;lab.celebrate?.(target.x,target.y);}}
  if(running&&!placement&&model.state.timeMinutes<stopAt){
   const remain=stopAt-model.state.timeMinutes;model.step(Math.min(remain,dt*speed));
   if(model.state.timeMinutes-lastSample>=.25){record();lastSample=model.state.timeMinutes;}
   if(model.state.timeMinutes>=stopAt-1e-8){record();comparisonDone=comparing;lab.setRunning(false);syncMission();explanation();const comparison=comparing?compareEnvironmentAtTime(model.state,reference):null;if(comparison&&comparison.reductionPercent>=50&&comparisonControlled)lab.celebrate?.(550,300);lab.announce('Försöket är klart. Jämför kurvorna vid samma tid.');}
  }
  if(time-lastDrawn>.12||!running){updateDOM(frame);lastDrawn=time;}
  const s=model.state,font=compact?29:24,flowTime=motion?s.timeMinutes*.22:0;
  const sourceOut=s.source>0?s.emissionRate*(1-s.prevention):0;
  text(ctx,'KÄLLA → VATTEN → ORGANISMER',28,26,compact?24:20,colors.muted);
  tools.forEach(t=>{
   const chosen=armed===t.id||drag===t.id;
   round(ctx,t.x-91,t.y-37,182,78,14,chosen?'#3d7a74':'#285b64',chosen?'#d5f5ce':'#9fdcd177',chosen?3:2);
   ctx.save();ctx.globalAlpha=drag===t.id?.25:1;text(ctx,t.label,t.x,t.y-2,27,'#d5f3e8','center');text(ctx,t.detail,t.x,t.y+25,22,'#b6d9cf','center');ctx.restore();
  });
  if(armed||drag){
   const target=targetFor(drag||armed),pulse=.5+.5*Math.sin(pulseTime*4);
   ctx.beginPath();ctx.arc(target.x,target.y,target.r+5*pulse,0,Math.PI*2);ctx.setLineDash([10,8]);ctx.strokeStyle=drag&&hitTarget(drag,pointer)?'#d4ffd0':'#83e3c9';ctx.lineWidth=3+pulse*2;ctx.stroke();ctx.setLineDash([]);
  }
  text(ctx,reference.length?'Placera en åtgärd':'Följ prickarnas väg',766,72,compact?25:21,colors.muted,'center');
  // Ground and water are schematic destinations, not an actual geographical map.
  ctx.beginPath();ctx.moveTo(0,333);ctx.bezierCurveTo(220,299,330,369,490,326);ctx.bezierCurveTo(660,285,770,326,960,313);ctx.lineTo(960,460);ctx.lineTo(0,460);ctx.closePath();ctx.fillStyle='#365d5544';ctx.fill();
  ctx.beginPath();ctx.moveTo(427,288);ctx.bezierCurveTo(520,255,600,301,691,291);ctx.bezierCurveTo(792,280,852,330,960,318);ctx.lineTo(960,402);ctx.bezierCurveTo(830,398,770,349,670,357);ctx.bezierCurveTo(546,365,503,319,427,350);ctx.closePath();ctx.fillStyle='#23647a77';ctx.fill();
  for(let i=0;i<8;i++){const x=470+i*60,y=322+Math.sin(i*2+flowTime*.5)*8;line(ctx,[[x,y],[x+30,y+2]],'#82b9cc33',2);}
  // Source: a sealed store, with a selectable prevention cover.
  round(ctx,65,142,106,114,10,'#526570','#a5b7bd');round(ctx,81,121,23,37,4,'#4c626e','#91a9b3');round(ctx,133,113,20,43,4,'#4c626e','#91a9b3');
  for(let i=0;i<6;i++)round(ctx,79+(i%3)*28,175+Math.floor(i/3)*30,14,15,2,'#b5cfcc66');
  if(s.prevention>0){line(ctx,[[57,140],[118,105],[180,140]],colors.safe,8);text(ctx,num(s.prevention*100,0)+' %',118,98,compact?25:19,colors.safe,'center');}
  text(ctx,'Utsläppskälla',118,286,font,colors.ink,'center');text(ctx,num(s.source,0),118,314,compact?27:24,colors.muted,'center');
  // Collection gate before the ground.
  round(ctx,246,157,67,83,9,'#3b6870','#91c8c9');for(let i=0;i<4;i++)line(ctx,[[255+i*13,170],[255+i*13,226]],'#a0d9cd77',3);
  text(ctx,'Insamling',280,135,compact?26:24,colors.safe,'center');
  flow(ctx,[[172,202],[243,202]],sourceOut,flowTime,colors.source);
  flow(ctx,[[313,202],[357,202],[357,300]],sourceOut*(1-s.treatment),flowTime,colors.ground);
  flow(ctx,[[280,240],[280,361]],sourceOut*s.treatment,flowTime,colors.safe);
  round(ctx,235,362,91,57,8,'#376b60','#9fcfc0');text(ctx,'Insamlat',280,444,compact?26:24,colors.safe,'center');
  // Ground and river compartments.
  round(ctx,332,297,92,51,14,'#99836166','#c7b28c66');text(ctx,'Mark',378,384,font,colors.ground,'center');
  flow(ctx,[[424,322],[515,322]],s.land*C.leachingPerMinute,flowTime,colors.ground);
  text(ctx,'Vatten',548,249,font,colors.water,'center');text(ctx,'relativ halt '+num(s.waterConcentration,2),548,278,compact?24:22,colors.muted,'center');
  flow(ctx,[[582,305],[664,270],[735,255]],s.water*C.uptakePerMinute,flowTime,colors.water);
  flow(ctx,[[735,280],[662,337],[592,340]],s.organisms*C.returnPerMinute,flowTime,colors.organisms);
  round(ctx,741,181,159,110,25,'#5c664d44','#c4b58244');
  fish(ctx,798+Math.sin(flowTime*.8)*8,218,1.1);fish(ctx,846+Math.sin(flowTime*.7+1)*7,263,.78,'#c5bb8c');
  text(ctx,'Organismer',819,159,font,colors.organisms,'center');
  text(ctx,'relativ halt '+num(s.organismConcentration,2),819,329,compact?24:22,colors.muted,'center');
  flow(ctx,[[604,357],[751,391],[909,391]],s.water*C.outflowPerMinute,flowTime,colors.water);
  text(ctx,'Ut ur området',810,438,compact?26:24,colors.water,'center');
  // Growing dots show material arriving, not a risk or illness score.
  for(let i=0;i<Math.min(34,Math.floor(s.water/4));i++){
   const x=462+((i*67+flowTime*26)%460),y=312+((i*17)%45);
   dot(ctx,x,y,4.2,'#ecb88f88');
  }
  for(let i=0;i<Math.min(12,Math.floor(s.organisms/4));i++)dot(ctx,784+(i%4)*10+Math.sin(flowTime*.8)*8,212+Math.floor(i/4)*6,2.7,'#8a6e4e');
  if(placement){
   const q=Math.min(1,placement.age/.65),eased=1-(1-q)**3;
   const x=placement.from.x+(placement.to.x-placement.from.x)*eased,y=placement.from.y+(placement.to.y-placement.from.y)*eased;
   round(ctx,x-54,y-29,108,58,14,'#4c9d80','#c5f3d0',3);text(ctx,placement.id==='seal'?'Skydd':'Insamling',x,y+8,25,'#f1fff0','center');
  }
  if(drag){const valid=hitTarget(drag,pointer);round(ctx,pointer.x-66,pointer.y-32,132,64,14,valid?'#4d9f7c':'#366c75',valid?'#dcffd0':'#a7e2d7',3);text(ctx,drag==='seal'?'Skydd':'Insamling',pointer.x,pointer.y+8,26,'#ecffee','center');if(valid)text(ctx,'Släpp här',pointer.x,pointer.y+68,28,'#dbffd1','center');}
 });
 function updateDOM(frame){
  const s=model.state;
  lab.setMetric('water',num(s.waterConcentration,2));lab.setMetric('organisms',num(s.organismConcentration,2));lab.setMetric('collected',num(s.collected));lab.setMetric('total',num(s.total));
  $('#environment-time-label').textContent='Tid i försöket: '+num(s.timeMinutes)+' min'+(comparing?' · jämförs med före-försöket vid samma tid.':'.');
  $('#environment-ledger').innerHTML=keys.map(k=>'<tr><th scope="row">'+names[k]+'</th><td>'+num(s[k])+'</td><td><progress value="'+s[k]+'" max="1000" aria-label="'+names[k]+', '+num(s[k]/10)+' procent" style="width:100%;max-width:180px;accent-color:#1b9397"></progress> '+num(s[k]/10)+' %</td></tr>').join('');
  $('#environment-total').textContent=num(s.total);drawChart(s);explanation();syncMission();
 }
 update();
 return {setActive:value=>{if(!value)record();lab.setActive(value);},destroy:()=>lab.destroy()};
}
