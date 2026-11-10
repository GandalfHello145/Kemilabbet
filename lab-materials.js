import { createLab } from './lab-kit.js?v=20261110-labs2';
import { MaterialsModel, MATERIALS, TESTS, observeMaterial } from './lab-materials-model.js?v=20261110-labs2';

const P={ink:'#e6f5f6',muted:'#9fc0c8',cyan:'#8be6dc',gold:'#f1ca7e',line:'#8cbdc855'};
function text(ctx,value,x,y,size=26,color=P.ink,align='left'){ctx.fillStyle=color;ctx.font=size+'px LMSans,Arial,sans-serif';ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.fillText(value,x,y);}
function circle(ctx,x,y,r,fill,stroke,width=2){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function round(ctx,x,y,w,h,r,fill,stroke,width=2){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function line(ctx,points,color,width=3,dash=[]){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
function hex(ctx,x,y,r,fill){ctx.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3,xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle='#fff4d377';ctx.lineWidth=2;ctx.stroke();}
function glow(ctx,x,y,r,color='#7bdddc'){const g=ctx.createRadialGradient(x,y,2,x,y,r);g.addColorStop(0,color+'35');g.addColorStop(1,color+'00');circle(ctx,x,y,r,g);}
function magnet(ctx,x,y,size=1){ctx.save();ctx.translate(x,y);ctx.scale(size,size);ctx.lineWidth=17;ctx.strokeStyle='#dd7f73';ctx.lineCap='butt';ctx.beginPath();ctx.moveTo(-20,-23);ctx.lineTo(-20,10);ctx.arc(0,10,20,Math.PI,0,true);ctx.lineTo(20,-23);ctx.stroke();ctx.lineWidth=9;ctx.strokeStyle='#dbf1f5';ctx.beginPath();ctx.moveTo(-20,-23);ctx.lineTo(-20,-8);ctx.moveTo(20,-23);ctx.lineTo(20,-8);ctx.stroke();ctx.restore();}
function lamp(ctx,x,y,on,time,amount=1){if(on)glow(ctx,x,y,71,'#f2ce74');circle(ctx,x,y,28,on?'#efd17f':'#344d5d','#aec6cd',2);line(ctx,[[x-12,y],[x-5,y+8],[x+5,y-8],[x+12,y]],on?'#fff8d5':'#859eaa',3);round(ctx,x-13,y+26,26,13,3,'#a4b6bd');if(on){for(let i=0;i<6;i++){const a=i*Math.PI/3+time*.3;line(ctx,[[x+Math.cos(a)*42,y+Math.sin(a)*42],[x+Math.cos(a)*54,y+Math.sin(a)*54]],'#f4d88488',3);}}}
function beaker(ctx,x,y,w=198,h=182){ctx.save();ctx.translate(x,y);const g=ctx.createLinearGradient(0,h*.3,0,h);g.addColorStop(0,'#51bbc878');g.addColorStop(1,'#216f8eaa');round(ctx,4,h*.28,w-8,h*.7,8,g);line(ctx,[[0,0],[0,h-10],[10,h],[w-10,h],[w,h-10],[w,0]],'#c1e7ec',3);line(ctx,[[4,h*.28],[w-4,h*.28]],'#a9eaf0',2);ctx.restore();}
function charges(ctx,points,time,on){if(!on)return;const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1])),total=lengths.reduce((a,b)=>a+b,0);for(let i=0;i<17;i++){let d=((time*.16+i/17)%1)*total;for(let j=0;j<lengths.length;j++){if(d<=lengths[j]){const q=d/lengths[j];glow(ctx,points[j][0]+(points[j+1][0]-points[j][0])*q,points[j][1]+(points[j+1][1]-points[j][1])*q,12,'#82e5ea');circle(ctx,points[j][0]+(points[j+1][0]-points[j][0])*q,points[j][1]+(points[j+1][1]-points[j][1])*q,4.2,'#b1fbf5');break;}d-=lengths[j];}}}
const tools=[{id:'magnet',x:135,y:66,label:'Magnet',verb:'Använd magneten',color:'#d99183'},{id:'dry',x:365,y:66,label:'Torrprov',verb:'Slut kretsen',color:'#eed38b'},{id:'dissolve',x:595,y:66,label:'Vatten',verb:'Häll i vatten',color:'#8adce7'},{id:'solution',x:825,y:66,label:'Lösning',verb:'Sänk elektroderna',color:'#b6dca9'}];
const actionLabels={magnet:'Testa med magnet',dry:'Testa ström i torrt prov',dissolve:'Lös upp i vatten',solution:'Testa ström i lösningen'};
const durations={magnet:2.5,dry:2.8,dissolve:3.5,solution:3.2};
const particleStart=Array.from({length:12},(_,i)=>({x:330+(i%4)*100,y:155+Math.floor(i/4)*78}));
const particleEnd=Array.from({length:12},(_,i)=>({x:180+((i*137)%610),y:140+((i*91)%230)}));
export function mountLab(host){
 const model=new MaterialsModel({sample:'unknown',seed:1});
 const controls=[
  '<p class="cl-task-hint">Uppdrag: ta reda på vilket ämne det okända provet är. Samla minst två olika testbelägg.</p>',
  '<div class="cl-actions" aria-label="Välj verktyg">'+tools.map(t=>'<button class="cl-secondary" data-materials-tool="'+t.id+'" aria-pressed="false">'+actionLabels[t.id]+'</button>').join('')+'</div>',
  '<button id="materials-apply" class="cl-primary" disabled>Välj ett verktyg först</button><button id="materials-resume" class="cl-secondary" hidden>Fortsätt testet ▶</button>',
  '<div class="cl-actions" aria-label="Välj vy"><button class="cl-secondary" data-materials-view="sample" aria-pressed="true">Se provet</button><button class="cl-secondary" data-materials-view="particles" aria-pressed="false" disabled>Följ partiklarna</button></div>',
  '<section id="materials-guess-panel"><label class="cl-field">Vår slutsats<select id="materials-guess">'+Object.values(MATERIALS).map(m=>'<option value="'+m.id+'">'+m.name+'</option>').join('')+'</select></label><button id="materials-check" class="cl-primary">Bekräfta slutsatsen</button><p id="materials-feedback" role="status"></p></section>',
  '<details><summary>Välj ett känt prov att öva med</summary><label class="cl-field">Prov<select id="materials-sample"><option value="unknown" selected>Okänt prov</option><option value="iron">Järn</option><option value="copper">Koppar</option><option value="salt">Koksalt</option><option value="sugar">Socker (sackaros)</option></select></label></details>',
  '<div class="cl-actions"><button id="materials-reset" class="cl-secondary">Gör om samma prov ↺</button><button id="materials-unknown" class="cl-secondary">Ge oss ett nytt prov →</button></div>'
 ].join('');
 const below='<section><h3>Era belägg</h3><p id="materials-candidates" class="cl-task-hint"></p><div style="overflow-x:auto"><table class="cl-table"><thead><tr><th>Undersökning</th><th>Vad såg ni?</th></tr></thead><tbody id="materials-evidence"></tbody></table></div></section>';
 const lab=createLab(host,{
  id:'materials',title:'Materialdetektiven',subtitle:'Dra ett verktyg till provet. Låt observationerna avslöja ämnet.',badge:'ETT OKÄNT PROV · FYRA MÖJLIGA ÄMNEN',
  controls,below,hideRun:true,running:true,
  objective:'Välj ett verktyg och dra det till provringen.',
  steps:[{title:'Välj verktyg',text:'Bestäm vilken egenskap ni vill undersöka.'},{title:'Samla belägg',text:'Gör minst två olika tester och jämför observationerna.'},{title:'Dra en slutsats',text:'Identifiera provet och förklara vad testerna visade.'},{title:'Följ partiklarna',text:'Se varför egenskaperna skiljer sig åt.'}],
  metrics:'<div><span>Prov</span><strong data-metric="sample">Okänt prov</strong></div><div><span>Färdiga testbelägg</span><strong data-metric="tested">0 / 4</strong></div><div><span>Möjliga ämnen</span><strong data-metric="candidates">4</strong></div>',
  explanationTitle:'Vad vill ni undersöka först?',
  explanation:'Ta ett verktyg från facket och släpp det i ringen runt provet. Ni kan också välja ett verktyg med knapparna och sedan trycka Använd.',
  questions:['Vilka två observationer stödjer er slutsats?','Varför kan koksalt leda ström i vatten men inte som torr kristall?','Vad är kvar när salt eller socker har lösts upp?'],
  canvasLabel:'Materialdetektiven. Fyra dragbara verktyg ligger högst upp. Dra ett till den lysande ringen runt provet. Alternativt välj verktyg och Använd på provet i reglagen.',
  model:'<p>Fyra rena prover vid rumstemperatur: järn, koppar, natriumklorid och sackaros. Upplösning avser 2 g i 100 ml avjoniserat vatten med omrörning. Vi jämför korta observationer, inte långsam korrosion eller fullständig kemisk analys.</p><p>Strömtestet är kvalitativt. I metall rör sig elektroner; i saltlösning rör sig joner. Sockerlösning och avjoniserat vatten leder mycket svagt och tänder inte lampan i detta test. Elektroderna rör inte ett metallprov som ligger på botten.</p><p>Partikelbilden är ett schematiskt utsnitt. Vattenmolekylerna utelämnas. En neutral hexagon betecknar en hel sackarosmolekyl, inte svavel eller en enskild atom. Saltets joner finns redan i kristallen och skiljs åt vid upplösning. Föremål, rörelser och tider visas inte i verklig skala.</p><ul><li><a href="https://www.acs.org/middleschoolchemistry/lessonplans/chapter5/lesson5.html" target="_blank" rel="noopener">ACS: Using Dissolving to Identify an Unknown</a></li><li><a href="https://sciencedemonstrations.fas.harvard.edu/presentations/conductivity-solutions" target="_blank" rel="noopener">Harvard: Conductivity of Solutions</a></li></ul>'
 });
 const $=s=>lab.$(s);
 let armed=null,drag=null,pointer={x:0,y:0},startPoint=null,activeTest=null,pending=null,age=0,view='sample',small=false,lastAnnouncement='',testCountAtStart=0;
 lab.canvas.style.touchAction='none';
 function mission(){
  const s=model.state,count=Object.keys(s.evidence).length;
  if(!s.hidden){lab.setStep?.(3);lab.setObjective?.(s.sample==='unknown'?'Ämnet är identifierat. Följ partiklarna och förklara testresultatet.':'Prova egenskaperna och följ det som händer med partiklarna.',true);return;}
  if(pending){lab.setStep?.(1);lab.setObjective?.('Följ testet. Observationen sparas när förloppet är klart.');return;}
  if(count>=2&&s.candidates.length===1){lab.setStep?.(2);lab.setObjective?.('Era belägg pekar på ett ämne. Bekräfta er slutsats.');return;}
  lab.setStep?.(count?1:0);lab.setObjective?.(armed?'Släpp '+tools.find(t=>t.id===armed).label.toLowerCase()+' i provringen.':count?'Gör ett annat test. Vilken egenskap skiljer de kvarvarande ämnena åt?':'Dra ett verktyg från facket till provringen.');
 }
 function update(){
  const s=model.state;
  lab.setMetric('sample',s.displayName);lab.setMetric('tested',Object.keys(s.evidence).length+' / 4');lab.setMetric('candidates',s.candidates.length);
  $('#materials-evidence').innerHTML=Object.values(TESTS).map(t=>'<tr><th scope="row">'+t.name+'</th><td>'+(s.evidence[t.id]?'✓ '+s.evidence[t.id].label:pending&&activeTest===t.id?'Testet pågår …':'Inte undersökt än')+'</td></tr>').join('');
  $('#materials-candidates').textContent=Object.keys(s.evidence).length?'Ämnen som stämmer med alla färdiga tester: '+s.candidates.map(id=>MATERIALS[id].name).join(', ')+'.':'Fyra ämnen är möjliga: järn, koppar, koksalt och socker.';
  $('#materials-guess-panel').hidden=s.sample!=='unknown'||s.revealed;
  lab.root.querySelectorAll('[data-materials-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.materialsTool===armed)));
  lab.root.querySelectorAll('[data-materials-view]').forEach(b=>{b.disabled=b.dataset.materialsView==='particles'&&s.hidden;b.setAttribute('aria-pressed',String(b.dataset.materialsView===view));});
  $('#materials-apply').disabled=!armed;$('#materials-resume').hidden=!(pending&&!lab.running);
  $('#materials-apply').textContent=armed?actionLabels[armed]:'Välj ett verktyg först';
  mission();lab.invalidate();
 }
 function arm(id){
  armed=id;view='sample';update();
  lab.setExplanation('Ett verktyg är valt.','Flytta '+tools.find(t=>t.id===id).label.toLowerCase()+' till den lysande ringen. På pekskärm går det också att trycka på verktyget och sedan på provet.');
 }
 function begin(id){
  activeTest=id;pending=observeMaterial(model.materialId,id);age=0;armed=null;drag=null;view='sample';testCountAtStart=Object.keys(model.state.evidence).length;
  lab.setRunning(true);lab.setExplanation('Testet börjar.','Följ verktyget och provet. Vilken förändring väntar ni er?');lastAnnouncement='';update();
 }
 function finish(){
  if(!pending)return;
  const result=model.test(activeTest);pending=null;
  if(model.state.hidden)lab.setExplanation(result.label,'Vilka ämnen passar med den här observationen? Kombinera den med ett annat test innan ni drar er slutsats.');
  else lab.setExplanation(result.label,result.explanation);
  if(Object.keys(model.state.evidence).length>testCountAtStart)lab.celebrate?.(480,285);
  lab.announce(TESTS[activeTest].name+': '+result.label+'. Observationen är sparad.');update();
 }
 function choose(sample){
  model.choose(sample);$('#materials-sample').value=sample;armed=null;activeTest=null;pending=null;age=0;view='sample';$('#materials-feedback').textContent='';
  lab.setExplanation('Ett nytt försök.','Välj ett verktyg och dra det till provringen. Provet byts inte mellan testerna.');update();
 }
 lab.root.querySelectorAll('[data-materials-tool]').forEach(b=>lab.on(b,'click',()=>arm(b.dataset.materialsTool)));
 lab.on('#materials-apply','click',()=>{if(armed)begin(armed);});
 lab.on('#materials-resume','click',()=>{lab.setRunning(true);update();});
 lab.on('#materials-sample','change',e=>choose(e.target.value));
 lab.on('#materials-reset','click',()=>choose($('#materials-sample').value));
 lab.on('#materials-unknown','click',()=>{model.newUnknown();$('#materials-sample').value='unknown';armed=null;activeTest=null;pending=null;age=0;view='sample';$('#materials-feedback').textContent='';lab.setExplanation('Nästa prov väntar.','Vilket test ger er mest information den här gången?');update();});
 lab.on('#materials-check','click',()=>{
  const result=model.guess($('#materials-guess').value);
  if(result.needsEvidence){$('#materials-feedback').textContent='Samla minst två olika testbelägg och skilj mellan de möjliga ämnena först.';lab.setExplanation('Ni behöver fler belägg.','En gissning kan råka vara rätt. Gör ett nytt test så att er slutsats går att motivera.');}
  else if(result.correct){$('#materials-feedback').textContent='Rätt! Nu kan ni visa varför egenskaperna ser ut som de gör.';lab.setExplanation('Ni identifierade '+model.state.displayName.toLowerCase()+'.','Välj Följ partiklarna. Koppla de rörliga laddningarna eller de hela molekylerna till det ni såg i testet.');lab.celebrate?.(480,265);}
  else {$('#materials-feedback').textContent='Det stämmer inte med era belägg. Jämför förslaget med observationerna.';lab.setExplanation('Granska er slutsats.','Vilket resultat i tabellen motsäger det valda ämnet?');}
  update();
 });
 lab.root.querySelectorAll('[data-materials-view]').forEach(b=>lab.on(b,'click',()=>{if(b.dataset.materialsView==='particles'&&model.state.hidden)return;view=b.dataset.materialsView;if(view==='particles'){lab.setStep?.(3);const r=activeTest?observeMaterial(model.materialId,activeTest):null;lab.setExplanation('Följ delarna i '+model.state.displayName.toLowerCase()+'.',r?r.explanation:'Välj ett test för att koppla en observerad egenskap till partiklarna.');}update();}));
 const inTarget=p=>Math.hypot(p.x-480,p.y-292)<136;
 lab.on(lab.canvas,'pointerdown',e=>{
  if(view==='particles')return;
  const p=lab.point(e),tool=tools.find(t=>Math.abs(p.x-t.x)<87&&Math.abs(p.y-t.y)<49);
  if(tool){armed=tool.id;drag=tool.id;pointer=p;startPoint=p;lab.canvas.setPointerCapture?.(e.pointerId);e.preventDefault();view='sample';lab.setExplanation('Flytta verktyget till provet.','Släpp i den lysande ringen. Verktyget snäpper på plats och testet börjar.');update();return;}
  if(armed&&inTarget(p)&&view==='sample'){begin(armed);e.preventDefault();}
 });
 lab.on(lab.canvas,'pointermove',e=>{
  const p=lab.point(e);
  if(drag){pointer=p;const key=inTarget(p)?'ready':'moving';if(key!==lastAnnouncement){lastAnnouncement=key;lab.setExplanation(inTarget(p)?'Släpp här för att starta testet.':'Flytta verktyget mot provringen.',inTarget(p)?'Verktyget är över rätt plats. Släpp för att se hur provet reagerar.':'Den lysande ringen visar var verktyget ska användas.');}lab.invalidate();}
  lab.canvas.style.cursor=drag?'grabbing':tools.some(t=>Math.abs(p.x-t.x)<87&&Math.abs(p.y-t.y)<49)||armed&&inTarget(p)?'grab':'default';
 });
 lab.on(lab.canvas,'pointerup',e=>{
  if(!drag)return;const p=lab.point(e),id=drag,moved=startPoint?Math.hypot(p.x-startPoint.x,p.y-startPoint.y):0;drag=null;
  if(inTarget(p))begin(id);
  else if(moved>12){lab.setExplanation('Verktyget behöver vara över provet.','Dra igen, eller tryck i provringen när verktyget är valt.');update();}
  else {arm(id);}
 });
 lab.on(lab.canvas,'pointercancel',()=>{drag=null;update();});
 function drawTool(ctx,id,x,y,scale=1){
  if(id==='magnet')magnet(ctx,x,y,scale);
  if(id==='dry'){circle(ctx,x,y,24*scale,'#cfb365','#f4e0ab');text(ctx,'ϟ',x,y+10*scale,35*scale,'#263f48','center');}
  if(id==='dissolve'){beaker(ctx,x-24*scale,y-24*scale,48*scale,48*scale);text(ctx,'H₂O',x,y+8*scale,20*scale,'#d7fbff','center');}
  if(id==='solution'){line(ctx,[[x-18*scale,y-24*scale],[x-18*scale,y+22*scale],[x+18*scale,y+22*scale],[x+18*scale,y-24*scale]],'#c6e9ee',3*scale);text(ctx,'±',x,y+8*scale,28*scale,'#a3e7df','center');}
 }
 function sample(ctx,x,y,amount=1,size=1){
  const s=model.state,m=MATERIALS[s.materialId],w=134*size,h=61*size;
  const g=ctx.createLinearGradient(x-w/2,y-h/2,x+w/2,y+h/2);g.addColorStop(0,s.hidden?'#dce2df':m.color);g.addColorStop(1,s.hidden?'#7d959c':m.color+'aa');
  round(ctx,x-w/2,y-h/2,w,h,10,g,'#d7eef088',2);text(ctx,s.hidden?'?':m.symbol,x,y+11*size,s.hidden?44*size:25*size,'#203e48','center');
 }
 function mainScene(ctx,time){
  const s=model.state,m=MATERIALS[s.materialId],r=pending||(activeTest?s.evidence[activeTest]:null),u=activeTest?Math.min(1,age/durations[activeTest]):0;
  const pulse=.5+.5*Math.sin(time*3.2),target=!!armed||!!drag||!activeTest;
  if(target){glow(ctx,480,292,168,'#6edbd5');ctx.beginPath();ctx.arc(480,292,124+pulse*5,0,Math.PI*2);ctx.setLineDash([10,9]);ctx.strokeStyle=drag&&inTarget(pointer)?'#d5ffd5':'#8ee2d7';ctx.lineWidth=3+pulse*2;ctx.stroke();ctx.setLineDash([]);}
  if(!activeTest){sample(ctx,480,292);text(ctx,armed?'Släpp verktyget i ringen':'Dra ett verktyg hit',480,410,29,P.cyan,'center');return;}
  const approaching=Math.min(1,u*3),settle=1-Math.exp(-Math.max(0,u-.25)*7);
  if(activeTest==='magnet'){
   const mx=700-(700-348)*approaching,my=210+(268-210)*approaching;
   magnet(ctx,mx,my,1.85);
   const shift=m.magnetic?settle*89:0;sample(ctx,515-shift,302-(m.magnetic?settle*10:0));
   for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(mx+13,274,67+i*24,43+i*17,.35,-.5,2.0);ctx.strokeStyle='#c1e8e6'+(i%2?'35':'22');ctx.lineWidth=2;ctx.stroke();}
   if(u>.5)text(ctx,m.magnetic?'Provet följer magneten':'Provet ligger kvar',480,411,29,m.magnetic?P.gold:P.ink,'center');
  }
  if(activeTest==='dry'){
   const wire=[[389,308],[274,308],[274,182],[454,182],[506,182],[666,182],[666,308],[530,308]];
   line(ctx,wire,'#bad0d6',4);round(ctx,248,240,52,35,5,'#5b7780','#c3d9df');text(ctx,'+  −',274,266,22,P.ink,'center');
   sample(ctx,460,308);line(ctx,[[388,305],[395,305]],'#dceef0',7);line(ctx,[[528,305],[544,305]],'#dceef0',7);
   const on=r?.code==='yes'&&u>.32;lamp(ctx,480,182,on,time);charges(ctx,wire,time,on);
   if(u>.6)text(ctx,on?'Laddning överförs genom provet':'Ingen märkbar ström genom provet',480,410,27,on?P.gold:P.ink,'center');
  }
  if(activeTest==='dissolve'||activeTest==='solution'){
   beaker(ctx,378,201,208,190);
   if(!m.dissolves)sample(ctx,482,366-Math.max(0,.3-u)*150,1,.62);
   else{
    const spread=clamp((u-.18)/.68,0,1);
    for(let i=0;i<18;i++){const sx=460+(i%6)*8,sy=194+Math.floor(i/6)*7,tx=395+((i*47)%176)+Math.sin(time+i)*5,ty=274+((i*31)%96)+Math.cos(time*.6+i)*4;
     const x=sx*(1-spread)+tx*spread,y=sy*(1-spread)+ty*spread;
     if(s.hidden)circle(ctx,x,y,5,'#d5e5df');else if(m.id==='salt')circle(ctx,x,y,5,i%2?'#9dc8e6':'#e4d492');else hex(ctx,x,y,5,'#e8cfa0');
    }
    if(u<.7){ctx.beginPath();ctx.ellipse(484,320,72,35,-.25,time*2,time*2+3.5);ctx.strokeStyle='#b1edf399';ctx.lineWidth=3;ctx.stroke();}
   }
   if(activeTest==='solution'){
    const dip=clamp((u-.1)/.3,0,1),end=220+dip*79;
    const wire=[[418,end],[418,163],[454,163],[506,163],[546,163],[546,end]];
    line(ctx,wire,'#bfd4dd',4);const on=r?.code==='yes'&&u>.42;lamp(ctx,480,163,on,time);charges(ctx,wire,time,on);
    if(u>.65)text(ctx,r?.code==='not-applicable'?'Metallen ligger kvar, elektroderna är i vattnet':on?'Rörliga joner överför laddning':'Lampan är släckt',480,437,25,on?P.gold:P.ink,'center');
   }else if(u>.7)text(ctx,m.dissolves?'Ämnet är kvar, utspritt i vattnet':'Provet finns kvar på botten',480,437,27,P.ink,'center');
  }
  if(pending){round(ctx,286,123,388,8,4,'#46697655');round(ctx,286,123,388*u,8,4,P.cyan);}
 }
 function particles(ctx,time){
  const s=model.state,m=MATERIALS[s.materialId],dissolved=(activeTest==='dissolve'||activeTest==='solution')&&m.dissolves;
  text(ctx,'Följ delarna i '+m.name.toLowerCase(),480,46,34,P.ink,'center');
  particleStart.forEach((p,i)=>{
   const spread=dissolved?clamp(age/durations[activeTest],0,1):0;
   let x=p.x*(1-spread)+particleEnd[i].x*spread,y=p.y*(1-spread)+particleEnd[i].y*spread;
   if(dissolved){x+=Math.sin(time+i*1.4)*13;y+=Math.cos(time*.8+i*2)*10;}
   if(m.id==='salt'){circle(ctx,x,y,28,i%2?'#87b9dc':'#ddcc80','#d8f3ef77');text(ctx,i%2?'Cl⁻':'Na⁺',x,y+9,26,'#183c48','center');}
   else if(m.id==='sugar')hex(ctx,x,y,27,'#d9bd8b');
   else{circle(ctx,x,y,28,m.color,'#e2f0f155');text(ctx,'+',x,y+10,34,'#284c56','center');}
  });
  if(m.id==='iron'||m.id==='copper'){
   for(let i=0;i<16;i++){const x=258+((i*73+time*(activeTest==='dry'?48:11))%450),y=145+((i*53)%212);glow(ctx,x,y,14,'#71e6eb');circle(ctx,x,y,5,'#b7f9fa');}
   text(ctx,'Rörliga elektroner kan överföra laddning',480,423,29,P.cyan,'center');
  }else text(ctx,m.id==='salt'?(dissolved?'Jonerna kan röra sig mellan elektroderna':'Jonerna hålls på plats i kristallen'):'Varje sackarosmolekyl är hel och neutral',480,423,29,P.ink,'center');
 }
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 lab.setDraw(({ctx,dt,time,running,compact,motion})=>{
  small=!!compact;$('#materials-resume').hidden=!(pending&&!running);
  if(pending&&!motion){age=durations[activeTest];finish();}
  else if(pending&&running){age+=dt;if(age>=durations[activeTest])finish();}
  const visibleTime=motion?time:0;
  if(view==='particles'&&!model.state.hidden){particles(ctx,visibleTime);return;}
  text(ctx,'VÄLJ ETT VERKTYG',30,19,18,P.muted);
  tools.forEach(t=>{
   const chosen=armed===t.id||pending&&activeTest===t.id;
   if(chosen)glow(ctx,t.x,t.y,96,t.color);
   round(ctx,t.x-91,t.y-39,182,82,15,chosen?'#386b72':'#214653',chosen?'#c6f1e7':'#638b984f',chosen?3:1.5);
   ctx.save();ctx.globalAlpha=drag===t.id?.25:1;drawTool(ctx,t.id,t.x-61,t.y-.5,.68);text(ctx,t.label,t.x+23,t.y+8,24,t.color,'center');ctx.restore();
  });
  mainScene(ctx,visibleTime);
  if(drag){glow(ctx,pointer.x,pointer.y,76,inTarget(pointer)?'#bcecb0':'#8ccdd3');drawTool(ctx,drag,pointer.x,pointer.y,1.45);if(inTarget(pointer))text(ctx,'Släpp här',pointer.x,pointer.y+67,30,'#c7f6ce','center');}
 });
 update();
 return {setActive:value=>lab.setActive(value),destroy:()=>lab.destroy()};
}
