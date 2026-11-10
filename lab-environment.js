import { createLab } from './lab-kit.js';
import { EnvironmentModel, ENVIRONMENT_CONSTANTS } from './lab-environment-model.js';

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
 return '<svg id="environment-chart" class="cl-chart" viewBox="0 0 760 230" role="img" aria-label="Relativ halt i vatten och organismer över modelltid" style="display:block;width:100%;height:auto;min-height:150px;font-family:LMSans,Arial,sans-serif"><defs><clipPath id="environment-plot"><rect x="66" y="28" width="668" height="150"/></clipPath></defs><g id="environment-grid"></g><g clip-path="url(#environment-plot)"><path id="environment-fill" fill="#21b6c71f"/><path id="environment-ref" fill="none" stroke="#849a9e" stroke-dasharray="7 6" stroke-width="3"/><path id="environment-water-line" fill="none" stroke="#087f94" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><path id="environment-organism-line" fill="none" stroke="#ad781d" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><circle id="environment-current" r="4.5" fill="#087f94" stroke="white" stroke-width="2"/></g><g id="environment-ticks"></g><text x="20" y="105" transform="rotate(-90 20 105)" text-anchor="middle" fill="#496a75" font-size="18">Relativ halt</text><text x="399" y="225" text-anchor="middle" fill="#496a75" font-size="18">Modelltid (min)</text></svg>';
}
export function mountLab(host){
 const model=new EnvironmentModel();let history=[model.state],reference=[],speed=5,lastSample=0,lastDrawn=0,drag=null,pointer={x:0,y:0},compact=false;
 const controls=[
  '<div class="cl-control-grid"><label class="cl-field">Källans möjliga utsläpp <output id="environment-rate-label">8</output> rel. enh./min<input id="environment-rate" type="range" min="0" max="20" value="8" step="1"></label><label class="cl-field">Täta källan <output id="environment-prevent-label">0</output> %<input id="environment-prevent" type="range" min="0" max="100" value="0" step="10"></label><label class="cl-field">Samla upp före marken <output id="environment-treat-label">0</output> %<input id="environment-treat" type="range" min="0" max="100" value="0" step="10"></label></div>',
  '<div class="cl-actions"><button data-environment-preset="none">Utan åtgärd</button><button data-environment-preset="seal">Täta källan 80 %</button><button data-environment-preset="collect">Samla upp 80 %</button><button id="environment-reset">Börja om ↺</button><label class="cl-field">Modellhastighet<select id="environment-speed"><option value="1">1 modellminut / sekund</option><option value="5" selected>5 modellminuter / sekund</option><option value="10">10 modellminuter / sekund</option></select></label></div><p class="cl-note">Dra en åtgärd till källan eller insamlingen i bilden. Reglagen går också att använda direkt under ett försök.</p>'
 ].join('');
 const below=[
  '<section><div class="cl-control-grid"><div><h3>Följ halterna över tid</h3><p class="cl-note"><span style="color:#087f94">● Vatten</span> · <span style="color:#ad781d">● Organismer</span> · <span style="color:#849a9e">– Sparat försök: vatten</span></p></div><div class="cl-actions"><button id="environment-save">Spara jämförelse</button><button id="environment-clear" hidden>Rensa jämförelse</button><button id="environment-csv">Ladda ned mätdata ↓</button></div></div>',
  chartHTML(),'<p id="environment-time-label" class="cl-note">Modelltid: 0,0 min. Starta för att följa ämnets väg.</p></section>',
  '<section><h3>Vart har ämnet tagit vägen?</h3><p class="cl-note">Alla mängder nedan hör till samma startmängd på 1 000 relativa mängdenheter. Insamlat och utflöde finns kvar i bokföringen.</p><div style="overflow-x:auto"><table class="cl-table"><thead><tr><th>Plats</th><th>Relativ mängd</th><th>Andel av startmängden</th></tr></thead><tbody id="environment-ledger"></tbody><tfoot><tr><th>Summa</th><td id="environment-total">1 000,0</td><td>100 %</td></tr></tfoot></table></div><p id="environment-message" class="cl-note" role="status"></p></section>'
 ].join('');
 const lab=createLab(host,{
  id:'environment',title:'Miljölandskapet',subtitle:'Följ ämnets väg och undersök var en åtgärd gör skillnad.',badge:'RELATIV MODELL · SAMMA STARTMÄNGD',
  controls,below,
  metrics:'<div><span>Halt i vatten</span><strong data-metric="water">0,00</strong></div><div><span>Halt i organismer</span><strong data-metric="organisms">0,00</strong></div><div><span>Insamlad mängd</span><strong data-metric="collected">0,0</strong></div><div><span>Bevarad mängd</span><strong data-metric="total">1 000,0</strong></div>',
  explanationTitle:'Var skulle ni sätta in en åtgärd?',
  explanation:'Börja utan åtgärd och spara kurvan. Jämför sedan med samma startmängd men tätare källa eller bättre insamling.',
  questions:['Varför kan halterna i vatten och organismer förändras olika snabbt?','Vad händer med ämnet som samlas upp? Har det upphört att finnas?','Vilka inställningar måste vara lika när ni jämför två åtgärder?'],
  canvasLabel:'Miljölandskap med källa, mark, vatten, organismer, insamling och utflöde. Dra Täta till källan eller Samla till uppsamlingen; samma åtgärder finns som knappar.',
  model:'<p>Detta är en påhittad modell av ett ämne som inte bryts ned under försöket. Startmängden är 1 000 relativa mängdenheter i källan. Inga inställningar, flödeshastigheter eller halter motsvarar en verklig kemikalie, plats eller riskgräns. Modellen är inte en prognos för PFAS eller för någon annan verklig förorening.</p><p>Att täta källan minskar andelen som släpps ut per minut; resten stannar kvar i källan. Insamlingen flyttar en andel av utsläppet till ett separat omhändertagande. Det som inte samlas upp går till marken och kan lakas till vattnet. Därifrån kan det tas upp av organismer, återföras från organismer till vatten eller rinna ut ur det visade området.</p><p>Alla förflyttningar bevarar mängden. Vi beräknar relativ halt som mängd delad med fast vattenvolym (100 relativa volymenheter) respektive fast organismmassa (5 relativa massenheter). Höjd halt i en organism över tid illustrerar upptag och kvarhållning; vi modellerar inte en näringskedja eller biomagnifikation.</p><p>Prickarna visar flödesriktningar, inte exakta antal molekyler. Risk beror även på ämnets farliga egenskaper, dos och exponering. En kurva här visar därför inte hur farligt vattnet eller en fisk är. Försöket stannar efter 120 modellminuter; värden visas avrundade.</p><ul><li><a href="https://www.kemi.se/ovrigt/ordlista" target="_blank" rel="noopener">Kemikalieinspektionen: ordlista, exponering och riskbedömning</a></li><li><a href="https://www.epa.gov/p2/learn-about-pollution-prevention" target="_blank" rel="noopener">US EPA: förebygg föroreningar vid källan</a></li></ul>'
 });
 const $=selector=>lab.$(selector);
 function record(){const s=model.state;if(Math.abs(history.at(-1).timeMinutes-s.timeMinutes)<1e-8)history[history.length-1]=s;else history.push(s);}
 function explanation(){
  const s=model.state;
  if(s.prevention===1)lab.setExplanation('Källan är helt tät i modellen.','Inget nytt ämne lämnar källan. Sådant som redan finns i marken, vattnet eller organismerna kan ändå fortsätta förflyttas.');
  else if(s.treatment===1)lab.setExplanation('Allt nytt utsläpp samlas upp.','Det lämnar källan men flyttas till Insamlat i stället för till marken. Ämnet har inte försvunnit.');
  else if(s.prevention>0)lab.setExplanation('Mindre lämnar källan.','Det tätade skyddet håller kvar en del av ämnet. Följ också gammalt utsläpp: en åtgärd vid källan tar inte genast bort det som redan har spridits.');
  else if(s.treatment>0)lab.setExplanation('En del flyttas till insamlingen.','Den delen når inte marken i modellen. Den insamlade mängden måste fortfarande hanteras, och det som passerar kan fortsätta spridas.');
  else lab.setExplanation('Följ fördröjningen mellan platserna.','Ämnet går först till marken, sedan till vattnet. Organismernas upptag och återföring gör att deras kurva kan fortsätta ändras även när utsläppet minskar.');
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
  $('#environment-time-label').textContent='Modelltid: '+num(s.timeMinutes)+' min · fast volym och organismmassa i modellen.';
  drawChart(s);explanation();lab.invalidate();
 }
 function params(){
  record();model.configure({emissionRate:Number($('#environment-rate').value),prevention:Number($('#environment-prevent').value)/100,treatment:Number($('#environment-treat').value)/100});update();
 }
 function reset(){model.reset();history=[model.state];lastSample=0;lab.setRunning(false);$('#environment-message').textContent='Samma startmängd: 1 000 relativa mängdenheter. Den sparade jämförelsen finns kvar.';update();}
 ['#environment-rate','#environment-prevent','#environment-treat'].forEach(id=>lab.on(id,'input',params));
 lab.on('#environment-speed','change',e=>{speed=Number(e.target.value);});
 lab.root.querySelectorAll('[data-environment-preset]').forEach(button=>lab.on(button,'click',()=>{
  const preset=button.dataset.environmentPreset;$('#environment-prevent').value=preset==='seal'?80:0;$('#environment-treat').value=preset==='collect'?80:0;params();reset();lab.announce('Nytt försök med samma startmängd. Välj Starta.');
 }));
 lab.on('#environment-reset','click',reset);
 lab.on('#environment-save','click',()=>{
  record();if(history.length<2){$('#environment-message').textContent='Starta ett försök och låt tiden gå innan ni sparar kurvan.';return;}
  reference=history.map(p=>({...p}));$('#environment-clear').hidden=false;$('#environment-message').textContent='Vattenkurvan är sparad som streckad jämförelse. Välj nu en annan åtgärd för ett nytt försök.';update();
 });
 lab.on('#environment-clear','click',()=>{reference=[];$('#environment-clear').hidden=true;$('#environment-message').textContent='Jämförelsen är rensad.';update();});
 lab.on('#environment-csv','click',()=>{
  record();const header='modelltid_min;kalla;mark;vatten;organismer;insamlat;utfloede;relativ_halt_vatten;relativ_halt_organismer;forsok';
  const values=(p,type)=>[p.timeMinutes,p.source,p.land,p.water,p.organisms,p.collected,p.outflow,p.waterConcentration,p.organismConcentration].map(v=>num(v,3)).join(';')+';'+type;
  const rows=[header,...history.map(p=>values(p,'aktuellt')),...reference.map(p=>values(p,'sparat'))];
  const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.join('\n')],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='Miljolandskapet_matdata.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
 const tools=[{id:'seal',x:350,y:65,label:'Täta'},{id:'collect',x:472,y:65,label:'Samla'}];
 lab.on(lab.canvas,'pointerdown',e=>{const p=lab.point(e);const t=tools.find(t=>Math.hypot(t.x-p.x,t.y-p.y)<35);if(t){drag=t;pointer=p;lab.canvas.setPointerCapture?.(e.pointerId);e.preventDefault();lab.invalidate();}});
 lab.on(lab.canvas,'pointermove',e=>{if(drag){pointer=lab.point(e);lab.invalidate();}});
 lab.on(lab.canvas,'pointerup',e=>{
  if(!drag)return;const p=lab.point(e),t=drag;drag=null;
  const hit=t.id==='seal'?Math.hypot(p.x-116,p.y-195)<95:Math.hypot(p.x-280,p.y-204)<85;
  if(hit){$(t.id==='seal'?'#environment-prevent':'#environment-treat').value=80;params();lab.announce(t.id==='seal'?'Källan är tätad till 80 procent.':'80 procent av nytt utsläpp samlas upp.');}
  lab.invalidate();
 });
 lab.on(lab.canvas,'pointercancel',()=>{drag=null;lab.invalidate();});
 lab.setDraw(frame=>{
  const {ctx,dt,time,running}=frame;compact=!!frame.compact;
  if(running&&model.state.timeMinutes<120){
   const remain=120-model.state.timeMinutes;model.step(Math.min(remain,dt*speed));
   if(model.state.timeMinutes-lastSample>=.25){record();lastSample=model.state.timeMinutes;}
   if(model.state.timeMinutes>=120){record();lab.setRunning(false);lab.announce('Försöket är klart efter 120 modellminuter. Spara kurvan och jämför ett nytt försök.');}
  }
  if(time-lastDrawn>.12||!running){updateDOM(frame);lastDrawn=time;}
  const s=model.state,font=compact?27:20;
  const sourceOut=s.source>0?s.emissionRate*(1-s.prevention):0;
  text(ctx,'FÖLJ ÄMNET GENOM LANDSKAPET',28,31,compact?23:15,colors.muted);
  tools.forEach(t=>{round(ctx,t.x-47,t.y-25,94,50,12,'#285b64','#9fdcd177');text(ctx,t.label,t.x,t.y+7,compact?24:18,'#d5f3e8','center');});
  text(ctx,'Dra en åtgärd till rätt plats',650,72,compact?23:16,colors.muted);
  // Ground and water are schematic destinations, not an actual geographical map.
  ctx.beginPath();ctx.moveTo(0,333);ctx.bezierCurveTo(220,299,330,369,490,326);ctx.bezierCurveTo(660,285,770,326,960,313);ctx.lineTo(960,460);ctx.lineTo(0,460);ctx.closePath();ctx.fillStyle='#365d5544';ctx.fill();
  ctx.beginPath();ctx.moveTo(427,288);ctx.bezierCurveTo(520,255,600,301,691,291);ctx.bezierCurveTo(792,280,852,330,960,318);ctx.lineTo(960,402);ctx.bezierCurveTo(830,398,770,349,670,357);ctx.bezierCurveTo(546,365,503,319,427,350);ctx.closePath();ctx.fillStyle='#23647a77';ctx.fill();
  for(let i=0;i<8;i++){const x=470+i*60,y=322+Math.sin(i*2+time*.5)*8;line(ctx,[[x,y],[x+30,y+2]],'#82b9cc33',2);}
  // Source: a sealed store, with a selectable prevention cover.
  round(ctx,65,142,106,114,10,'#526570','#a5b7bd');round(ctx,81,121,23,37,4,'#4c626e','#91a9b3');round(ctx,133,113,20,43,4,'#4c626e','#91a9b3');
  for(let i=0;i<6;i++)round(ctx,79+(i%3)*28,175+Math.floor(i/3)*30,14,15,2,'#b5cfcc66');
  if(s.prevention>0){line(ctx,[[57,140],[118,105],[180,140]],colors.safe,8);text(ctx,num(s.prevention*100,0)+' %',118,98,compact?25:19,colors.safe,'center');}
  text(ctx,'Källa',118,286,font,colors.ink,'center');text(ctx,num(s.source,0),118,314,compact?27:18,colors.muted,'center');
  // Collection gate before the ground.
  round(ctx,246,157,67,83,9,'#3b6870','#91c8c9');for(let i=0;i<4;i++)line(ctx,[[255+i*13,170],[255+i*13,226]],'#a0d9cd77',3);
  text(ctx,'Insamling',280,135,compact?24:17,colors.safe,'center');
  flow(ctx,[[172,202],[243,202]],sourceOut,time,colors.source);
  flow(ctx,[[313,202],[357,202],[357,300]],sourceOut*(1-s.treatment),time,colors.ground);
  flow(ctx,[[280,240],[280,361]],sourceOut*s.treatment,time,colors.safe);
  round(ctx,235,362,91,57,8,'#376b60','#9fcfc0');text(ctx,'Insamlat',280,444,compact?24:17,colors.safe,'center');
  // Ground and river compartments.
  round(ctx,332,297,92,51,14,'#99836166','#c7b28c66');text(ctx,'Mark',378,384,font,colors.ground,'center');
  flow(ctx,[[424,322],[515,322]],s.land*C.leachingPerMinute,time,colors.ground);
  text(ctx,'Vatten',548,249,font,colors.water,'center');text(ctx,'relativ halt '+num(s.waterConcentration,2),548,278,compact?22:16,colors.muted,'center');
  flow(ctx,[[582,305],[664,270],[735,255]],s.water*C.uptakePerMinute,time,colors.water);
  flow(ctx,[[735,280],[662,337],[592,340]],s.organisms*C.returnPerMinute,time,colors.organisms);
  round(ctx,741,181,159,110,25,'#5c664d44','#c4b58244');
  fish(ctx,798+Math.sin(time*.8)*8,218,1.1);fish(ctx,846+Math.sin(time*.7+1)*7,263,.78,'#c5bb8c');
  text(ctx,'Organismer',819,159,font,colors.organisms,'center');
  text(ctx,'relativ halt '+num(s.organismConcentration,2),819,329,compact?22:16,colors.muted,'center');
  flow(ctx,[[604,357],[751,391],[909,391]],s.water*C.outflowPerMinute,time,colors.water);
  text(ctx,'Ut ur området',810,438,compact?24:17,colors.water,'center');
  if(drag){const valid=drag.id==='seal'?Math.hypot(pointer.x-116,pointer.y-195)<95:Math.hypot(pointer.x-280,pointer.y-204)<85;round(ctx,pointer.x-49,pointer.y-27,98,54,13,valid?'#3c8d78':'#366c75','#a7e2d7');text(ctx,drag.label,pointer.x,pointer.y+8,24,'#e3f5e9','center');}
 });
 function updateDOM(frame){
  const s=model.state;
  lab.setMetric('water',num(s.waterConcentration,2));lab.setMetric('organisms',num(s.organismConcentration,2));lab.setMetric('collected',num(s.collected));lab.setMetric('total',num(s.total));
  $('#environment-time-label').textContent='Modelltid: '+num(s.timeMinutes)+' min · fast volym och organismmassa i modellen.';
  $('#environment-ledger').innerHTML=keys.map(k=>'<tr><th scope="row">'+names[k]+'</th><td>'+num(s[k])+'</td><td><progress value="'+s[k]+'" max="1000" aria-label="'+names[k]+', '+num(s[k]/10)+' procent" style="width:100%;max-width:180px;accent-color:#1b9397"></progress> '+num(s[k]/10)+' %</td></tr>').join('');
  $('#environment-total').textContent=num(s.total);drawChart(s);
 }
 update();
 return {setActive:value=>{if(!value)record();lab.setActive(value);},destroy:()=>lab.destroy()};
}
