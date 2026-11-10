import { createLab } from './lab-kit.js';
import { MaterialsModel, MATERIALS, TESTS } from './lab-materials-model.js';

const palette={ink:'#dceff3',muted:'#91b6c2',cyan:'#72dcd9',gold:'#efc981',line:'#6c9ba74a'};
function text(ctx,value,x,y,size=18,color=palette.ink,align='left'){if(ctx.canvas.clientWidth<560)size=Math.max(size,20);ctx.fillStyle=color;ctx.font=size+'px LMSans, Arial, sans-serif';ctx.textAlign=align;ctx.fillText(value,x,y);}
function circle(ctx,x,y,r,fill,stroke){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}}
function round(ctx,x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}}
function line(ctx,points,color,width=3,dash=[]){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
function hex(ctx,x,y,r,fill){ctx.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;const xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle='#fff4d355';ctx.lineWidth=1.5;ctx.stroke();}
function lamp(ctx,x,y,on,time){if(on){const glow=ctx.createRadialGradient(x,y,3,x,y,60);glow.addColorStop(0,'#f6d78866');glow.addColorStop(1,'#f6d78800');circle(ctx,x,y,60,glow);}
 circle(ctx,x,y,25,on?'#f7d479':'#344d5c','#a4bfca');line(ctx,[[x-10,y],[x-4,y+7],[x+4,y-7],[x+10,y]],on?'#fff9d8':'#8ba3ad',2);round(ctx,x-12,y+22,24,13,3,'#9bb0b9');if(on){for(let i=0;i<5;i++){const a=time*1.3+i*1.256;line(ctx,[[x+Math.cos(a)*35,y+Math.sin(a)*35],[x+Math.cos(a)*43,y+Math.sin(a)*43]],'#efd38e88',2);}}}
function magnet(ctx,x,y,size=1){ctx.save();ctx.translate(x,y);ctx.scale(size,size);ctx.lineWidth=16;ctx.strokeStyle='#cc756c';ctx.beginPath();ctx.moveTo(-18,-20);ctx.lineTo(-18,10);ctx.arc(0,10,18,Math.PI,0,true);ctx.lineTo(18,-20);ctx.stroke();ctx.lineWidth=8;ctx.strokeStyle='#d4e9f1';ctx.beginPath();ctx.moveTo(-18,-20);ctx.lineTo(-18,-7);ctx.moveTo(18,-20);ctx.lineTo(18,-7);ctx.stroke();ctx.restore();}
function beaker(ctx,x,y,w=155,h=145){ctx.save();ctx.translate(x,y);round(ctx,3,h*.34,w-6,h*.64,5,'#27748b80');line(ctx,[[0,0],[0,h-8],[8,h],[w-8,h],[w,h-8],[w,0]],'#b0d8e3',2.5);line(ctx,[[3,h*.34],[w-3,h*.34]],'#8fdee5',2);ctx.restore();}
const positions=Array.from({length:12},(_,i)=>({x:690+(i%4)*57,y:132+Math.floor(i/4)*67}));
const scatter=Array.from({length:12},(_,i)=>({x:684+((i*71)%226),y:125+((i*97)%222)}));

export function mountLab(host){
 const model=new MaterialsModel();
 const controls=[
  '<div class="cl-control-grid"><label class="cl-field">Välj prov<select id="materials-sample"><option value="iron">Järn</option><option value="copper">Koppar</option><option value="salt">Koksalt</option><option value="sugar">Socker (sackaros)</option><option value="unknown">Okänt prov</option></select></label><div class="cl-actions"><button id="materials-reset">Börja om ↺</button><button id="materials-unknown">Nytt okänt prov</button></div></div>',
  '<div class="cl-actions" aria-label="Välj undersökning">'+Object.values(TESTS).map(t=>'<button data-materials-test="'+t.id+'" aria-pressed="false">'+t.short+'</button>').join('')+'</div>',
  '<div id="materials-views" class="cl-actions" hidden><button data-materials-view="sample" aria-pressed="true">Provvy</button><button data-materials-view="particles" aria-pressed="false">Partikelvy</button></div>',
  '<p class="cl-note">Dra ett verktyg till provet i bilden, eller välj en testknapp. Samma prov används tills ni väljer ett nytt.</p>'
 ].join('');
 const below=[
  '<div class="cl-control-grid"><section><h3>Era observationer</h3><div style="overflow-x:auto"><table class="cl-table"><thead><tr><th>Test</th><th>Vad ser ni?</th></tr></thead><tbody id="materials-evidence"></tbody></table></div><p id="materials-candidates" class="cl-note"></p></section>',
  '<section id="materials-guess-panel" hidden><h3>Vad är det okända provet?</h3><label class="cl-field">Vårt förslag<select id="materials-guess">'+Object.values(MATERIALS).map(m=>'<option value="'+m.id+'">'+m.name+'</option>').join('')+'</select></label><button id="materials-check">Pröva vår slutsats</button><p id="materials-feedback" role="status"></p></section></div>'
 ].join('');
 const lab=createLab(host,{
  id:'materials',title:'Materialdetektiven',subtitle:'Välj ett test. Samla ledtrådar. Förklara vilket ämne som passar.',badge:'4 PROVER · 4 TESTER',
  controls,below,
  metrics:'<div><span>Prov</span><strong data-metric="sample">Järn</strong></div><div><span>Gjorda tester</span><strong data-metric="tested">0 / 4</strong></div><div><span>Prover som passar</span><strong data-metric="candidates">4</strong></div>',
  explanationTitle:'Vilket test skulle ni börja med?',
  explanation:'Olika ämnen kan dela en egenskap. Ett bra test hjälper er att skilja mellan möjliga förklaringar.',
  questions:['Kan samma test skilja järn från koppar och salt från socker?','Varför kan koksalt leda ström i lösning men inte som torr kristall?','Om två prov båda löses i vatten, vilket nytt test skulle hjälpa er?'],
  canvasLabel:'Materialdetektiven. Dra magnet, torrprovstest, vatten eller lösningstest från vänster till provet. Samma tester finns som knappar.',
  model:'<p>Fyra definierade, rena prover vid rumstemperatur: järn, koppar, natriumklorid och sackaros. Upplösningstestet avser en liten mängd, 2 g, i 100 ml avjoniserat vatten med omrörning. Vi jämför korta observationer, inte långsam korrosion eller kemisk analys av okända verkliga ämnen.</p><p>Strömtestet är kvalitativt. I metall kan elektroner röra sig; i saltlösning kan joner röra sig. Sockerlösning och avjoniserat vatten leder mycket svagt och tänder inte lampan i modellen. Metall som ligger kvar på bägarens botten räknas inte som en lösning och rör inte elektroderna.</p><p>Det förstorade utsnittet är schematiskt. Vattenmolekylerna visas inte, och sackaros visas som en sammanhållen neutral symbol. När socker löses hålls varje molekyl ihop. När salt löses skiljs joner som redan finns i kristallen från varandra.</p><ul><li><a href="https://www.acs.org/middleschoolchemistry/lessonplans/chapter5/lesson5.html" target="_blank" rel="noopener">ACS: Using Dissolving to Identify an Unknown</a></li><li><a href="https://sciencedemonstrations.fas.harvard.edu/presentations/conductivity-solutions" target="_blank" rel="noopener">Harvard: Conductivity of Solutions</a></li></ul>'
 });
 let activeTest=null,animAge=0,drag=null,pointer={x:0,y:0},smallCanvas=false,view='sample';
 const tools=[{id:'magnet',x:64,y:110,label:'Magnet'},{id:'dry',x:64,y:205,label:'Torrprov'},{id:'dissolve',x:64,y:300,label:'Vatten'},{id:'solution',x:64,y:395,label:'Lösning'}];
 const $=s=>lab.$(s);
 function update(){
  const s=model.state;
  lab.setMetric('sample',s.displayName);lab.setMetric('tested',Object.keys(s.evidence).length+' / 4');lab.setMetric('candidates',s.candidates.length);
  $('#materials-evidence').innerHTML=Object.values(TESTS).map(t=>'<tr><th scope="row">'+t.name+'</th><td>'+(s.evidence[t.id]?.short||'Inte undersökt än')+'</td></tr>').join('');
  $('#materials-candidates').textContent=Object.keys(s.evidence).length?'Prover som stämmer med alla era tester: '+s.candidates.map(id=>MATERIALS[id].name).join(', ')+'.':'Gör ett test för att börja samla belägg.';
  $('#materials-guess-panel').hidden=s.sample!=='unknown';
  lab.root.querySelectorAll('[data-materials-test]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.materialsTest===activeTest)));
  lab.invalidate();
 }
 function run(test){
  const result=model.test(test);activeTest=test;animAge=0;
  if(model.state.hidden)lab.setExplanation(result.label,'Vilka av de fyra möjliga proverna passar med den här observationen? Jämför också med testerna i tabellen.');
  else lab.setExplanation(result.label,result.explanation);
  lab.setRunning(true);update();lab.announce(TESTS[test].name+': '+result.label+'.');
 }
 function choose(value){model.choose(value);activeTest=null;animAge=0;$('#materials-feedback').textContent='';lab.setExplanation('Nytt prov – nya ledtrådar.','Välj ett test eller dra ett verktyg till provet. En observation kan passa flera ämnen.');update();}
 lab.on('#materials-sample','change',e=>choose(e.target.value));
 lab.on('#materials-reset','click',()=>choose($('#materials-sample').value));
 lab.on('#materials-unknown','click',()=>{model.newUnknown();$('#materials-sample').value='unknown';activeTest=null;$('#materials-feedback').textContent='';lab.setExplanation('Ett nytt okänt prov.','Välj tester som ger olika resultat för de möjliga ämnena.');update();});
 lab.root.querySelectorAll('[data-materials-test]').forEach(b=>lab.on(b,'click',()=>run(b.dataset.materialsTest)));
 lab.on('#materials-check','click',()=>{
  const result=model.guess($('#materials-guess').value);
  $('#materials-feedback').textContent=result.correct?'Det stämmer. Vilka observationer stödjer er slutsats?':'Det förslaget stämmer inte med provet. Granska tabellen och välj ett test som skiljer era möjliga ämnen åt.';
  if(result.correct){lab.setExplanation('Ni identifierade '+model.state.displayName.toLowerCase()+'.','En slutsats blir starkare när flera oberoende observationer pekar åt samma håll. Jämför resultatet med ett annat känt prov.');}
  update();
 });
 lab.root.querySelectorAll('[data-materials-view]').forEach(b=>lab.on(b,'click',()=>{view=b.dataset.materialsView;lab.root.querySelectorAll('[data-materials-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));lab.invalidate();}));
 lab.on(lab.canvas,'pointerdown',e=>{
  if(smallCanvas)return;
  const p=lab.point(e);const tool=tools.find(t=>Math.hypot(t.x-p.x,t.y-p.y)<39);
  if(!tool)return;drag=tool;pointer=p;lab.canvas.setPointerCapture?.(e.pointerId);e.preventDefault();lab.invalidate();
 });
 lab.on(lab.canvas,'pointermove',e=>{if(!drag)return;pointer=lab.point(e);lab.invalidate();});
 lab.on(lab.canvas,'pointerup',e=>{if(!drag)return;const p=lab.point(e);const tool=drag;drag=null;if(p.x>155&&p.x<615&&p.y>90&&p.y<390)run(tool.id);else lab.invalidate();});
 lab.on(lab.canvas,'pointercancel',()=>{drag=null;lab.invalidate();});

 lab.setDraw(({ctx,width,height,dt,time,running,compact})=>{
  smallCanvas=!!compact;$('#materials-views').hidden=!smallCanvas;
  if(running)animAge+=dt;
  const s=model.state,m=MATERIALS[s.materialId],result=activeTest?observe(activeTest):null;
  const solved=!s.hidden;
  if(!smallCanvas||view==='sample'){
  ctx.save();if(smallCanvas){ctx.translate(480-375*1.5,230-250*1.5);ctx.scale(1.5,1.5);}
  text(ctx,'PROV OCH VERKTYG',28,31,15,palette.muted);
  text(ctx,'Dra hit ett test →',145,71,16,palette.muted);
  round(ctx,145,90,465,300,20,'#153e4b42',drag?'#b1ece4':'#6c9ba72f');
  text(ctx,s.displayName,370,420,25,palette.ink,'center');
  if(!smallCanvas)tools.forEach(t=>{
   round(ctx,t.x-33,t.y-32,66,64,13,activeTest===t.id?'#306874':'#254856','#779ba665');
   if(t.id==='magnet')magnet(ctx,t.x,t.y,.6);
   else if(t.id==='dry'){circle(ctx,t.x,t.y,18,'#b59b54');text(ctx,'ϟ',t.x,t.y+8,25,'#fff2c0','center');}
   else if(t.id==='dissolve'){text(ctx,'H₂O',t.x,t.y+6,19,'#bdeff3','center');}
   else {line(ctx,[[t.x-14,t.y-18],[t.x-14,t.y+17],[t.x+14,t.y+17],[t.x+14,t.y-18]],'#bedce6',2);text(ctx,'±',t.x,t.y+5,20,'#9cdee5','center');}
   text(ctx,t.label,t.x,t.y+48,12,palette.muted,'center');
  });
  const eased=1-Math.exp(-animAge*3);
  const sampleColor=s.hidden?'#b8c3cd':m.color;
  function sample(x,y,small=false){
   const w=small?74:115,h=small?33:55;
   round(ctx,x-w/2,y-h/2,w,h,9,sampleColor,'#d9edf055');
   const g=ctx.createLinearGradient(x-w/2,y-h/2,x+w/2,y+h/2);g.addColorStop(0,'#ffffff33');g.addColorStop(1,'#00000022');round(ctx,x-w/2,y-h/2,w,h,9,g);
   text(ctx,s.hidden?'?':m.symbol,x,y+6,small?18:24,'#15343e','center');
  }
  if(!activeTest){sample(375,265);text(ctx,'Välj ett test för att undersöka provet.',375,346,16,palette.muted,'center');}
  if(activeTest==='magnet'){
   magnet(ctx,237,190,1.5);const shift=m.magnetic?eased*69:0;sample(396-shift,276-(m.magnetic?eased*15:0));
   for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(250,235,64+i*22,44+i*17,.35,-.6,2.2);ctx.strokeStyle='#bcdfe322';ctx.lineWidth=2;ctx.stroke();}
   text(ctx,result.label,375,350,16,result.code==='yes'?palette.gold:palette.muted,'center');
  }
  if(activeTest==='dry'){
   line(ctx,[[247,270],[207,270],[207,145],[352,145]],'#b2c2cc',4);line(ctx,[[477,270],[515,270],[515,145],[402,145]],'#b2c2cc',4);
   round(ctx,177,200,58,29,4,'#465f67','#b1cbd2');text(ctx,'+  −',206,220,17,'#d8edf0','center');
   lamp(ctx,377,145,result.code==='yes',time);sample(362,270);
   line(ctx,[[248,268],[306,268]],'#bfd9dd',5);line(ctx,[[418,268],[476,268]],'#bfd9dd',5);
   text(ctx,'Torrt, fast prov',375,345,17,palette.muted,'center');
  }
  if(activeTest==='dissolve'||activeTest==='solution'){
   beaker(ctx,285,174,175,164);
   if(!m.dissolves)sample(373,315,true);
   if(m.dissolves){for(let i=0;i<14;i++){const x=307+((i*47+time*(i%2?7:-5))%129+129)%129,y=244+((i*31+time*4)%75);circle(ctx,x,y,3.2,m.id==='salt'?(i%2?'#a9d3e8':'#e3d794'):'#edd9ad');}}
   if(activeTest==='solution'){
    line(ctx,[[315,260],[315,118],[351,118]],'#bccfd7',3);line(ctx,[[432,260],[432,118],[402,118]],'#bccfd7',3);
    lamp(ctx,377,117,result.code==='yes',time);text(ctx,'Elektroderna rör inte ett fast metallprov.',375,373,13,palette.muted,'center');
   }else text(ctx,m.dissolves?'Löst – men ämnet finns kvar.':'Metallprovet ligger kvar.',375,373,16,palette.muted,'center');
  }
  ctx.restore();
  }
  if(!smallCanvas||view==='particles'){
  ctx.save();if(smallCanvas){ctx.translate(480-787*1.35,230-230*1.35);ctx.scale(1.35,1.35);}
  round(ctx,640,65,294,330,18,'#1e4b5748',palette.line);text(ctx,'FÖRSTORAD SKOLMODELL',657,93,13,palette.muted);
  if(!solved){
   text(ctx,'?',787,218,82,'#a9ccd2','center');
   text(ctx,'Identifiera först provet.',787,300,17,palette.ink,'center');
   text(ctx,'Använd observationerna nedanför.',787,326,13,palette.muted,'center');
  }else{
   const dissolved=(activeTest==='dissolve'||activeTest==='solution')&&m.dissolves;
   positions.forEach((p,i)=>{
    const u=dissolved?eased:0;let x=p.x*(1-u)+scatter[i].x*u,y=p.y*(1-u)+scatter[i].y*u;
    if(dissolved){x+=Math.sin(time*.8+i)*5;y+=Math.cos(time*.7+i*2)*5;}
    if(m.id==='salt'){circle(ctx,x,y,17,i%2?'#88bada':'#d6c77e','#e2f1ee77');text(ctx,i%2?'Cl⁻':'Na⁺',x,y+5,13,'#193b47','center');}
    else if(m.id==='sugar'){hex(ctx,x,y,17,'#cfb78a');}
    else {circle(ctx,x,y,18,m.color,'#d9e5e966');text(ctx,'+',x,y+6,20,'#304d56','center');}
   });
   if(m.id==='iron'||m.id==='copper'){
    for(let i=0;i<9;i++){const t=time*(activeTest==='dry'?30:6);const x=681+((i*29+t)%226),y=145+((i*53)%165);circle(ctx,x,y,3.5,'#94e9ee');}
    text(ctx,'Rörliga elektroner i metallen',787,376,13,palette.muted,'center');
   }else text(ctx,m.id==='salt'?(dissolved?'Jonerna kan röra sig i lösningen.':'Jonerna är bundna i kristallen.'):(dissolved?'Neutrala sackarosmolekyler.':'Hela sackarosmolekyler i kristallen.'),787,376,13,palette.muted,'center');
  }
  ctx.restore();
  }
  if(drag){ctx.save();ctx.globalAlpha=.92;round(ctx,pointer.x-45,pointer.y-26,90,52,12,'#2c6a73','#9ee3df');text(ctx,drag.label,pointer.x,pointer.y+6,14,'#e4f9f3','center');ctx.restore();}
 });
 function observe(test){return model.state.evidence[test];}
 update();
 return {setActive:value=>lab.setActive(value),destroy:()=>lab.destroy()};
}
