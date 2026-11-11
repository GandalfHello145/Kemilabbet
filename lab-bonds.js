import {createLab, roundRect} from './lab-kit.js?v=20261111-clear8';
import {BondsModel} from './lab-bonds-model.js?v=20261111-clear8';

const TAU=Math.PI*2,C={ink:'#e8f7f6',muted:'#a0c0cd',teal:'#6ce6d9',gold:'#ffd27c',blue:'#9ebfff'};
const clamp=value=>Math.max(0,Math.min(1,value)),mix=(a,b,t)=>a+(b-a)*t;

export function mountLab(host){
  const model=new BondsModel();model.setMode('covalent');
  let view='atoms',guessed=false,mastered=false,transferProgress=0,overlapProgress=0,pairProgress=0;
  let drag=null,marker={x:320,y:211},compact=false,animationTime=0,calm=false,slow=false,showCounts=false;
  const lab=createLab(host,{
    id:'bonds',title:'Bindningslabbet',subtitle:'En bindning håller ihop atomer. Börja med två väteatomer.',badge:'GÖR → TITTA → FÖRKLARA',running:true,hideRun:true,
    objective:'Tryck på För atomerna närmare.',
    steps:[{title:'För närmare',text:'Följ de gula elektronerna.'},{title:'Dela',text:'Ett par håller ihop atomerna.'},{title:'Förklara',text:'Räkna elektronerna.'}],
    canvasLabel:'Två väteatomer. Dra en H-atom mot den andra eller använd knappen För atomerna närmare. Alla draghandlingar har knappar.',
    controls:'<div data-bonds="covalent-controls"><p class="cl-task-hint" data-bonds="overlap-hint">H betyder väte. Varje atom har en gul elektron med minusladdning.</p><button type="button" class="cl-primary" data-bonds="closer">För atomerna närmare →</button><button type="button" class="cl-primary" data-bonds="share" hidden>Dela de två elektronerna</button></div>'
      +'<div data-bonds="ionic-controls" hidden><div data-bonds="prediction"><p class="cl-task-hint">En minusladdad elektron ska lämna Na. Vilken laddning tror du att Na får?</p><div class="cl-actions"><button type="button" class="cl-secondary" data-bonds="guess-plus">Plus, +</button><button type="button" class="cl-secondary" data-bonds="guess-minus">Minus, −</button></div></div><button type="button" class="cl-primary" data-bonds="transfer" hidden>Flytta minus-elektronen till Cl →</button></div>'
      +'<fieldset data-bonds="check-panel" hidden><legend data-bonds="check-question">Hur många elektroner delar atomerna?</legend><div class="cl-actions"><button type="button" class="cl-secondary" data-bonds="check-right">Två</button><button type="button" class="cl-secondary" data-bonds="check-wrong">Fyra</button></div></fieldset><button type="button" class="cl-primary" data-bonds="next" hidden>Prova plus och minus →</button><p data-bonds="feedback" class="cl-note" role="status">Börja med den stora knappen.</p>'
      +'<details data-bonds="tools"><summary>Fler verktyg</summary><label class="cl-field" for="bonds-mode">Välj ett nytt försök<select id="bonds-mode"><option value="covalent">Dela elektroner · väte</option><option value="ionic">Flytta en elektron · natrium och klor</option></select></label><div data-bonds="hydrogen-tools"><label class="cl-field" for="bonds-overlap">Flytta väteatomerna närmare eller längre från varandra<input id="bonds-overlap" type="range" min="0" max="100" value="0" step="1"></label><button type="button" data-bonds="separate">Visa två lösa väteatomer</button></div><div data-bonds="ion-tools" hidden><button type="button" data-bonds="return" disabled>Flytta elektronen tillbaka till Na</button><button type="button" data-bonds="lattice" disabled>Visa många joner i salt</button></div><label><input type="checkbox" data-bonds="slow"> Visa förändringen långsamt</label><p class="cl-note">Protoner har plusladdning. Elektroner har minusladdning. En atom med lika många av varje är oladdad.</p><p data-bonds="ledger" class="cl-note"></p></details><button type="button" class="cl-secondary" data-bonds="reset">Börja om försöket ↺</button>',
    metrics:'<div><span data-bonds="left-label">Väteatomer</span><strong data-metric="left">2</strong></div><div><span data-bonds="right-label">Elektroner</span><strong data-metric="right">2</strong></div><div><span data-bonds="total-label">Elektronparet</span><strong data-metric="total">Inte delat</strong></div>',
    below:'<p>En elektron är en liten del av en atom. I bilden är elektronerna gula och märkta med minus.</p>',
    explanationTitle:'Två väteatomer',explanation:'H betyder väte. Varje atom har en elektron. För atomerna närmare och följ de gula elektronerna.',
    model:'<p>Försöket visar hur atomer kan dela elektronpar. Det visar också hur plus- och minusladdade joner dras till varandra. En jon är en laddad atom. I vätemolekylen bidrar varje atom med en elektron. Två elektroner bildar ett gemensamt par.</p><p>Reglaget för närmande ordnar uppgiftens steg. Det beräknar inte ett uppmätt atomavstånd eller hur mycket energi som krävs för en bindning. Området runt atomerna visar var elektronerna kan finnas.</p><p>I försöket med natrium och klor räknar vi elektroner före och efter en överföring. Antalet protoner ändras inte. Verklig tillverkning av salt från natriummetall och klorgas sker i fler steg. Saltvyn visar ett större utsnitt med många joner, inte en enda NaCl-molekyl.</p><p>Källor: <a href="https://www.acs.org/middleschoolchemistry/lessonplans/chapter4/lesson5.html" target="_blank" rel="noopener">ACS: jonbindning</a> · <a href="https://www.acs.org/middleschoolchemistry/lessonplans/chapter4/lesson4.html" target="_blank" rel="noopener">ACS: elektronpar</a>.</p>'
  });
  const $=key=>lab.$(`[data-bonds="${key}"]`);
  function feedback(message){$('feedback').textContent=message;lab.announce(message);}
  function refresh(){
    const s=model.state,ionic=s.mode==='ionic',ready=ionic?s.transferred:s.shared,near=s.hydrogen.overlap>=.7;
    const steps=ionic?[['Gissa','Plus eller minus?'],['Flytta','Följ en elektron.'],['Förklara','Vad är en jon?']]:[['För närmare','Följ elektronerna.'],['Dela','Ett par håller ihop atomerna.'],['Förklara','Räkna elektronerna.']];
    steps.forEach(([title,text],i)=>{const node=lab.$(`[data-step="${i}"]`);for(const [part,value] of [['strong',title],['small',text]])if(node.querySelector(part).textContent!==value)node.querySelector(part).textContent=value;});
    lab.canvas.setAttribute('aria-label',ionic?'Flytta den gula minus-elektronen från Na till Cl. Använd Flytta-knappen eller tryck Enter när bilden har fokus.':'För två väteatomer närmare och dela elektroner. Använd knapparna. Enter i bilden gör nästa handling.');
    $('ionic-controls').hidden=!ionic;$('covalent-controls').hidden=ionic;$('check-panel').hidden=!ready||mastered||view==='lattice';
    $('prediction').hidden=guessed||ready;$('transfer').hidden=!guessed||ready;$('transfer').disabled=ready;
    $('return').disabled=!s.transferred;$('lattice').disabled=!s.transferred;$('lattice').textContent=view==='lattice'?'Visa elektronflytten igen':'Visa många joner i salt';
    $('lattice').setAttribute('aria-pressed',String(view==='lattice'));
    $('closer').hidden=near||s.shared;$('share').hidden=!near||s.shared;$('share').disabled=s.shared||!near;
    $('hydrogen-tools').hidden=ionic;$('ion-tools').hidden=!ionic;lab.$('#bonds-overlap').value=Math.round(s.hydrogen.overlap*100);lab.$('#bonds-mode').value=s.mode;
    $('overlap-hint').textContent=s.shared?'Två atomer sitter nu ihop i en molekyl.':near?'Atomerna är nära. Dela nu de två elektronerna.':'H betyder väte. Varje atom har en elektron med minusladdning.';
    $('left-label').textContent=ionic?'Na: laddning':'Väteatomer';$('right-label').textContent=ionic?'Cl: laddning':'Elektroner';$('total-label').textContent=ionic?'Den flyttade elektronen':'Elektronparet';
    lab.setMetric('left',ionic?(s.transferred?'+':'0'):'2');lab.setMetric('right',ionic?(s.transferred?'−':'0'):'2');lab.setMetric('total',ionic?(s.transferred?'hos Cl':'hos Na'):s.shared?'Delas':'Inte delat');
    $('check-question').textContent=ionic?'Varför är Na nu positivt?':'Hur många elektroner delar atomerna?';$('check-right').textContent=ionic?'En minus-elektron lämnade':'Två';$('check-wrong').textContent=ionic?'En proton lades till':'Fyra';
    $('ledger').textContent=ionic?`Na: 11 protoner och ${s.sodium.electrons} elektroner. Cl: 17 protoner och ${s.chlorine.electrons} elektroner. Tillsammans finns samma 28 elektroner kvar.`:'Två väteatomer har tillsammans två protoner och två elektroner. Att dela elektroner skapar inga nya elektroner.';
    lab.setStep?.(mastered||ready?2:ionic?(guessed?1:0):near?1:0);
    const next=$('next');next.hidden=!mastered;next.textContent=ionic?(view==='lattice'?'Tillbaka till väte →':'Visa jonerna i salt →'):'Prova plus och minus →';
    lab.setObjective?.(mastered?(ionic?'Se hur många joner håller ihop i salt.':'Du har byggt en vätemolekyl. Prova nästa försök när du vill.'):ready?'Välj en förklaring med knapparna.':ionic?(guessed?'Flytta minus-elektronen till Cl.':'Gissa om Na får plus eller minus.'):near?'Tryck på Dela de två elektronerna.':'Tryck på För atomerna närmare.',mastered);
    if(ionic&&view==='lattice'){lab.setExplanation('Salt består av många joner.','En jon är en laddad atom. Positiva och negativa joner dras till varandra och håller ihop saltet.');lab.setObjective?.('Se hur plus och minus turas om i saltet.',true);}
    else if(ionic&&ready)lab.setExplanation('Na är positivt. Cl är negativt.','Na har förlorat en minus-elektron. Cl har fått den. En laddad atom kallas jon. Olika laddningar dras till varandra.');
    else if(ionic&&guessed)lab.setExplanation('Pröva din gissning.','Flytta den gula elektronen från Na till Cl. Titta på plus och minus ovanför atomerna.');
    else if(ionic)lab.setExplanation('Elektronen har minusladdning.','Na betyder natrium. Cl betyder klor. Atomerna är oladdade från början. Gissa vad som händer när Na lämnar en elektron.');
    else if(ready)lab.setExplanation('Två atomer bildar en molekyl.','Atomerna delar två elektroner. Två elektroner tillsammans kallas ett elektronpar. Det delade paret håller ihop vätemolekylen H₂.');
    else if(near)lab.setExplanation('Atomerna är nära varandra.','Dela de två elektronerna. Följ hur paret hamnar mellan atomerna.');
    else lab.setExplanation('Börja med två väteatomer.','H betyder väte. Varje atom har en elektron. För atomerna närmare och följ de gula elektronerna.');lab.invalidate();
  }
  function changeMode(mode){model.setMode(mode);model.reset();view='atoms';mastered=false;guessed=false;drag=null;transferProgress=0;overlapProgress=0;pairProgress=0;feedback(mode==='ionic'?'Gissa först. Flytta sedan en minus-elektron.':'Börja med den stora knappen.');refresh();}
  function transfer(target){const was=model.state.transferred;model.transfer(target);view='atoms';mastered=false;if(target==='Cl'&&!was){lab.celebrate?.(600,211);feedback('Elektronen finns nu hos Cl. Na visar plus och Cl visar minus.');}else if(target==='Na')feedback('Elektronen är tillbaka. Båda atomerna är oladdade igen.');refresh();}
  function approach(value){model.setOverlap(value);mastered=false;refresh();}
  lab.on('#bonds-mode','change',e=>changeMode(e.target.value));
  lab.on($('guess-plus'),'click',()=>{guessed=true;feedback('Din gissning: plus. Flytta elektronen och se.');refresh();});
  lab.on($('guess-minus'),'click',()=>{guessed=true;feedback('Din gissning: minus. Flytta elektronen och se.');refresh();});
  lab.on($('transfer'),'click',()=>transfer('Cl'));lab.on($('return'),'click',()=>transfer('Na'));lab.on($('lattice'),'click',()=>{view=view==='lattice'?'atoms':'lattice';refresh();});
  lab.on($('next'),'click',()=>{if(model.state.mode==='covalent')changeMode('ionic');else if(view==='lattice')changeMode('covalent');else{view='lattice';refresh();}});
  lab.on('#bonds-overlap','input',e=>approach(Number(e.target.value)/100));lab.on($('closer'),'click',()=>approach(1));
  lab.on($('share'),'click',()=>{model.share(true);lab.celebrate?.(480,211);feedback('En elektron från varje atom. Nu delar atomerna paret.');refresh();});
  lab.on($('separate'),'click',()=>{model.share(false);mastered=false;feedback('Två lösa väteatomer igen. Varje atom har en elektron.');refresh();});
  lab.on($('check-right'),'click',()=>{mastered=true;feedback(model.state.mode==='ionic'?'Ja. En minus-elektron lämnade Na. Då blev Na positivt.':'Ja. Två elektroner delas. De räknas bara en gång.');lab.celebrate?.();refresh();});
  lab.on($('check-wrong'),'click',()=>feedback(model.state.mode==='ionic'?'Protonerna finns kvar. Titta på den minusladdade elektronen som flyttades.':'Räkna de gula elektronerna. Två atomer delar samma två elektroner.'));
  lab.on($('reset'),'click',()=>changeMode(model.state.mode));
  lab.on($('slow'),'change',e=>{slow=e.target.checked;lab.invalidate();});
  lab.on($('tools'),'toggle',()=>{showCounts=$('tools').open;lab.invalidate();});
  lab.on(lab.canvas,'keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();const s=model.state;if(s.mode==='covalent'){if(!s.shared){if(s.hydrogen.overlap<.7)approach(1);else{model.share(true);feedback('Atomerna delar nu två elektroner.');refresh();}}}else if(view==='atoms'&&!s.transferred){guessed=true;transfer('Cl');}}});
  lab.on(lab.canvas,'pointerdown',e=>{const p=lab.point(e),s=model.state;if(s.mode==='ionic'&&view==='atoms'&&Math.hypot(p.x-marker.x,p.y-marker.y)<43)drag={id:e.pointerId,kind:'electron',point:p};else if(s.mode==='covalent'&&!s.shared){const left=mix(270,420,overlapProgress),right=mix(690,540,overlapProgress);if(Math.hypot(p.x-left,p.y-211)<48)drag={id:e.pointerId,kind:'left',point:p};else if(Math.hypot(p.x-right,p.y-211)<48)drag={id:e.pointerId,kind:'right',point:p};}if(drag){lab.canvas.setPointerCapture?.(e.pointerId);if(e.cancelable)e.preventDefault();lab.invalidate();}});
  lab.on(lab.canvas,'pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;drag.point=lab.point(e);if(drag.kind!=='electron')approach(drag.kind==='right'?(690-drag.point.x)/150:(drag.point.x-270)/150);if(e.cancelable)e.preventDefault();lab.invalidate();});
  function endDrag(e,cancelled=false){if(!drag||drag.id!==e.pointerId)return;const d=drag,p=lab.point(e);drag=null;if(lab.canvas.hasPointerCapture?.(e.pointerId))lab.canvas.releasePointerCapture(e.pointerId);if(d.kind==='electron'&&!cancelled){if(Math.hypot(p.x-600,p.y-211)<90){transferProgress=1;transfer('Cl');}else if(Math.hypot(p.x-320,p.y-211)<90){transferProgress=0;transfer('Na');}else feedback('Flytta den gula elektronen till den markerade platsen vid Cl.');}refresh();}
  lab.on(lab.canvas,'pointerup',e=>endDrag(e));lab.on(lab.canvas,'pointercancel',e=>endDrag(e,true));

  function text(ctx,value,x,y,size=24,color=C.ink){ctx.font=`600 ${compact?Math.max(27,size):size}px system-ui,sans-serif`;ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(value,x,y);}
  function circle(ctx,x,y,r,fill,stroke,w=2){ctx.beginPath();ctx.arc(x,y,r,0,TAU);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=w;ctx.stroke();}}
  function eDot(ctx,x,y,r=6,color=C.teal){ctx.save();ctx.shadowColor=color;ctx.shadowBlur=calm?0:r>10?24:7;circle(ctx,x,y,r,color,'#153641');ctx.restore();if(r>10)text(ctx,'−',x,y+9,29,'#163745');}
  function arrow(ctx,a,b,color){const angle=Math.atan2(b.y-a.y,b.x-a.x);ctx.strokeStyle=color;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-Math.cos(angle-.5)*15,b.y-Math.sin(angle-.5)*15);ctx.lineTo(b.x-Math.cos(angle+.5)*15,b.y-Math.sin(angle+.5)*15);ctx.closePath();ctx.fillStyle=color;ctx.fill();}
  function atom(ctx,x,symbol,protons,isNa){
    const radii=showCounts?[38,65,105]:[105];
    radii.forEach(r=>{ctx.save();ctx.globalAlpha=isNa&&r===105?1-transferProgress:1;circle(ctx,x,211,r,null,'#709ead66');ctx.restore();});
    if(showCounts){for(let i=0;i<2;i++)eDot(ctx,x+Math.cos(i*Math.PI)*38,211+Math.sin(i*Math.PI)*38);for(let i=0;i<8;i++){const a=i/8*TAU+.2;eDot(ctx,x+Math.cos(a)*65,211+Math.sin(a)*65);}}
    if(!isNa)for(let i=0;i<7;i++){const a=-Math.PI+(i+1)/8*TAU;eDot(ctx,x+Math.cos(a)*105,211+Math.sin(a)*105);}
    circle(ctx,x,211,31,isNa?'#174d58':'#353f6c',isNa?C.teal:C.blue);text(ctx,symbol,x,220,28);
    if(showCounts)text(ctx,`${protons} protoner`,x,370,25,C.muted);
  }
  function ionic(ctx,time){
    const s=model.state,pulse=.5+.5*Math.sin(time*3);text(ctx,s.transferred?'PLUS OCH MINUS DRAS TILL VARANDRA':'FLYTTA MINUS-ELEKTRONEN TILL Cl',480,39,27);
    if(s.transferred){ctx.save();ctx.globalAlpha=.3+pulse*.22;for(let i=-2;i<=2;i++){ctx.strokeStyle=C.gold;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(305,211+i*12);ctx.bezierCurveTo(390,211+i*39,520,211+i*39,610,211+i*12);ctx.stroke();}ctx.restore();arrow(ctx,{x:357,y:320},{x:439,y:320},C.gold);arrow(ctx,{x:563,y:320},{x:481,y:320},C.gold);}
    atom(ctx,215,'Na',11,true);atom(ctx,705,'Cl',17,false);roundRect(ctx,155,63,120,45,13,s.transferred?'#326b60':'#234b56',C.teal);text(ctx,s.transferred?'Na⁺':'Na',215,95,32,C.teal);roundRect(ctx,645,63,120,45,13,s.transferred?'#4a4e7b':'#293f5d',C.blue);text(ctx,s.transferred?'Cl⁻':'Cl',705,95,32,C.blue);
    if(!s.transferred||drag){ctx.save();ctx.setLineDash([8,7]);circle(ctx,600,211,31+pulse*6,'#ffd27c15',C.gold,3);ctx.setLineDash([]);text(ctx,'SLÄPP HÄR',600,271,22,C.gold);ctx.restore();}
    const t=transferProgress;marker=drag?.kind==='electron'?drag.point:{x:mix(320,600,t),y:211-Math.sin(Math.PI*t)*68};if(!s.transferred&&!drag){ctx.save();ctx.globalAlpha=.18+pulse*.12;circle(ctx,marker.x,marker.y,37,null,C.gold,5);ctx.restore();}eDot(ctx,marker.x,marker.y,19,C.gold);
    if(showCounts){text(ctx,`${s.sodium.electrons} elektroner`,215,335,27,C.teal);text(ctx,`${s.chlorine.electrons} elektroner`,705,335,27,C.blue);text(ctx,s.transferred?'Na: 2,8     ·     Cl: 2,8,8':'Na: 2,8,1     ·     Cl: 2,8,7',480,415,26);}else{text(ctx,s.transferred?'+':'0',215,340,52,C.gold);text(ctx,s.transferred?'−':'0',705,340,52,C.blue);}text(ctx,s.transferred?'En laddad atom kallas jon.':'Na = natrium · Cl = klor · 0 = oladdad',480,449,27,C.muted);
  }
  function lattice(ctx,time){text(ctx,'MÅNGA JONER HÅLLER IHOP SALTET',480,39,26);for(let layer=2;layer>=0;layer--){ctx.save();ctx.globalAlpha=1-layer*.23;for(let row=0;row<4;row++)for(let col=0;col<4;col++){const positive=(row+col+layer)%2===0,x=297+col*106+layer*27,y=119+row*68-layer*16+Math.sin(time*2+row+col)*1.6;circle(ctx,x,y,positive?24:29,positive?'#1c555c':'#303e70',positive?C.teal:C.blue);text(ctx,positive?'Na⁺':'Cl⁻',x,y+8,23,positive?C.teal:C.blue);}ctx.restore();}text(ctx,showCounts?'24 Na⁺ + 24 Cl⁻ · lika många av varje':'Plus och minus turas om',480,414,29,C.gold);text(ctx,'En jon är en laddad atom.',480,449,26,C.muted);}
  function covalent(ctx,time){
    const s=model.state,o=overlapProgress,p=pairProgress,left=mix(270,420,o),right=mix(690,540,o),pulse=.5+.5*Math.sin(time*2);text(ctx,s.shared?'H₂ · TVÅ ATOMER DELAR ELEKTRONER':'FÖR TVÅ VÄTEATOMER NÄRMARE',480,40,27);
    for(let ring=12;ring>=1;ring--){ctx.fillStyle=`rgba(103,228,216,${.012+(13-ring)*.001})`;for(const x of[left,right]){ctx.beginPath();ctx.ellipse(x,211,45+ring*6,45+ring*6,0,0,TAU);ctx.fill();}}
    if(o>.4){ctx.save();ctx.globalAlpha=(o-.4)/.6*(.65+pulse*.2);const g=ctx.createRadialGradient(480,211,5,480,211,125);g.addColorStop(0,p>.5?'#ffd27c77':'#6ce6d977');g.addColorStop(1,'#6ce6d900');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(480,211,115,100,0,0,TAU);ctx.fill();ctx.restore();}
    if(p>.1){ctx.save();ctx.globalAlpha=p;ctx.shadowColor=C.gold;ctx.shadowBlur=20;ctx.lineWidth=8;ctx.strokeStyle=C.gold;ctx.beginPath();ctx.moveTo(left+30,211);ctx.lineTo(right-30,211);ctx.stroke();ctx.restore();}
    for(const x of[left,right]){circle(ctx,x,211,32,'#2a4b5d',C.blue,3);text(ctx,'H',x,222,30);}eDot(ctx,mix(left+74,464,p),mix(180,183,p),18,C.gold);eDot(ctx,mix(right-74,496,p),mix(242,239,p),18,C.gold);
    if(!s.shared){arrow(ctx,{x:335,y:352},{x:420,y:352},C.teal);arrow(ctx,{x:625,y:352},{x:540,y:352},C.teal);text(ctx,o>=.7?'Dela nu de två elektronerna.':'Dra en H-atom eller tryck För närmare.',480,402,25);}else{text(ctx,'En elektron från varje H-atom',480,354,29,C.teal);text(ctx,'Ett elektronpar = två elektroner',480,404,25);}text(ctx,showCounts?'2 protoner · 2 elektroner · laddning 0':'H₂ är två väteatomer som sitter ihop.',480,449,27,C.muted);
  }
  lab.setDraw(({ctx,dt,motion,calm:gentle,compact:small})=>{compact=small;calm=Boolean(gentle);if(motion&&!calm)animationTime+=dt;const s=model.state,k=motion?1-Math.exp(-Math.max(dt,.001)*(slow||calm?2.5:8)):1;transferProgress+=((s.transferred?1:0)-transferProgress)*k;overlapProgress+=(s.hydrogen.overlap-overlapProgress)*k;pairProgress+=((s.shared?1:0)-pairProgress)*k;if(s.mode==='covalent')covalent(ctx,animationTime);else if(view==='lattice')lattice(ctx,animationTime);else ionic(ctx,animationTime);});
  refresh();return{setActive:value=>lab.setActive(value),destroy:()=>lab.destroy()};
}
