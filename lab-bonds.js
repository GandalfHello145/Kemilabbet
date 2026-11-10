import {createLab} from './lab-kit.js';
import {BondsModel} from './lab-bonds-model.js';

const TAU = Math.PI * 2;
const C = {ink: '#e4f3f4', muted: '#95b7c4', teal: '#64e3da', gold: '#ffd07c', blue: '#8eb9ff', coral: '#ff9c8c'};
const mix = (a, b, t) => a + (b - a) * t;

export function mountLab(host) {
  const model = new BondsModel();
  let view = 'atoms';
  let cloud = true;
  let transferProgress = 0;
  let shareProgress = 0;
  let drag = null;
  let pointerId = null;
  let marker = {x: 338, y: 218};
  let compact = false;
  const lab = createLab(host, {
    id: 'bonds', title: 'Bindningslabbet', subtitle: 'Flytta en elektron. Jämför med ett delat elektronpar.',
    badge: 'ELEKTRONER OCH BINDNINGAR', running: false,
    canvasLabel: 'Skalmodell för natrium och klor, eller delat elektronpar i H₂. Alla handlingar finns också som knappar.',
    controls: '<div class="cl-field"><label for="bonds-mode">Undersök <select id="bonds-mode"><option value="ionic">Jonbindning · Na och Cl</option><option value="covalent">Elektronpar · H₂</option></select></label></div>'
      + '<div data-bonds="ionic-controls" class="cl-actions"><button type="button" data-bonds="transfer">Flytta e⁻ från Na till Cl →</button><button type="button" data-bonds="return" disabled>← Flytta tillbaka e⁻</button><button type="button" data-bonds="lattice" disabled aria-pressed="false">Se kristallens mönster</button></div>'
      + '<div data-bonds="covalent-controls" class="cl-actions" hidden><button type="button" data-bonds="share">Visa ett delat elektronpar</button><button type="button" data-bonds="separate">Visa två H-atomer</button><button type="button" data-bonds="cloud" aria-pressed="true">Molnvy på</button></div>'
      + '<button type="button" data-bonds="reset">Börja om ↺</button>',
    metrics: '<div><span data-bonds="left-label">Na: protoner / elektroner</span><strong data-metric="left">11 / 11</strong></div>'
      + '<div><span data-bonds="right-label">Cl: protoner / elektroner</span><strong data-metric="right">17 / 17</strong></div>'
      + '<div><span data-bonds="total-label">Elektroner i de två atomerna</span><strong data-metric="total">28</strong></div>'
      + '<div><span>Sammanlagd nettoladdning</span><strong data-metric="charge">0</strong></div>',
    below: '<p data-bonds="ledger" role="status">Na: 11 p⁺ − 11 e⁻ = 0. Cl: 17 p⁺ − 17 e⁻ = 0.</p><p>Den gula punkten är den elektron som går att flytta. Dra den till den andra atomen eller använd knapparna. Punkterna räknar elektroner; de visar inga verkliga banor.</p>',
    explanationTitle: 'Vad ändras om en atom förlorar en elektron?',
    explanation: 'Börja med två neutrala atomer. Na har 11 protoner och 11 elektroner. Cl har 17 av varje. Flytta den gula elektronen och jämför laddningarna.',
    questions: ['Varför blir Na positivt när en negativ elektron lämnar atomen?', 'Hur kan båda jonerna vara laddade när deras sammanlagda laddning är noll?', 'Vad är skillnaden mellan att flytta en elektron och att dela ett elektronpar?'],
    model: '<p>Skal, avstånd, färger och elektronpunkter är schematiska. Elektroner kretsar inte som små planeter på de ritade cirklarna. Kärnorna ändras inte när joner bildas.</p>'
      + '<p>Vi visar fristående Na- och Cl-atomer för att förklara elektronbokföringen. Verklig framställning av natriumklorid utgår från bland annat natriummetall och Cl₂ och är mer komplicerad. Detta är ingen laborationsinstruktion.</p>'
      + '<p>Gittervyn är ett annat utsnitt med många joner i förhållandet 1:1. Den är inte en förstoring av bara de två atomerna. Kristallen är en utsträckt struktur, inte en samling NaCl-molekyler.</p>'
      + '<p>H₂-vyn visar ett delat elektronpar. Molnet visar endast idén om elektroner kring båda kärnorna; det är inte en beräknad sannolikhetsfördelning. Att växla bild är inte ett experiment som tillför eller mäter bindningsenergi.</p>'
      + '<p>Källor: <a href="https://www.acs.org/middleschoolchemistry/lessonplans/chapter4/lesson5.html" target="_blank" rel="noopener">ACS: jonbindning</a> · <a href="https://www.acs.org/middleschoolchemistry/lessonplans/chapter4/lesson4.html" target="_blank" rel="noopener">ACS: elektronpar och kovalent bindning</a>.</p>',
  });
  const $ = key => lab.$(`[data-bonds="${key}"]`);

  function refresh(message) {
    const state = model.state;
    const ionic = state.mode === 'ionic';
    $('ionic-controls').hidden = !ionic;
    $('covalent-controls').hidden = ionic;
    $('transfer').disabled = state.transferred;
    $('return').disabled = !state.transferred;
    $('lattice').disabled = !state.transferred;
    $('lattice').setAttribute('aria-pressed', String(view === 'lattice'));
    $('lattice').textContent = view === 'lattice' ? 'Tillbaka till elektronflytten' : 'Se kristallens mönster';
    $('share').disabled = state.shared;
    $('separate').disabled = !state.shared;
    $('cloud').setAttribute('aria-pressed', String(cloud));
    $('cloud').textContent = cloud ? 'Molnvy på' : 'Visa molnvy';
    $('left-label').textContent = ionic ? 'Na: protoner / elektroner' : 'Vänster vätekärna';
    $('right-label').textContent = ionic ? 'Cl: protoner / elektroner' : 'Höger vätekärna';
    $('total-label').textContent = ionic ? 'Elektroner i de två atomerna' : 'Elektroner i hela H₂-vyn';
    lab.setMetric('left', ionic ? `11 / ${state.sodium.electrons}` : '1 proton');
    lab.setMetric('right', ionic ? `17 / ${state.chlorine.electrons}` : '1 proton');
    lab.setMetric('total', ionic ? '28 · samma före och efter' : '2 · ett par');
    lab.setMetric('charge', '0');
    if (ionic) {
      $('ledger').textContent = `Na: 11 p⁺ − ${state.sodium.electrons} e⁻ = ${state.sodium.charge ? '+1' : '0'}. Cl: 17 p⁺ − ${state.chlorine.electrons} e⁻ = ${state.chlorine.charge ? '−1' : '0'}. Protonerna är oförändrade.`;
      if (view === 'lattice') lab.setExplanation('En kristall har många joner – inte små NaCl-molekyler.', 'Här ser ni ett separat utsnitt av ett jongitter. Na⁺ och Cl⁻ återkommer i förhållandet 1:1. Positiva och negativa joner attraherar varandra i hela strukturen. Räknarna ovan gäller de två atomerna i elektronflytten.');
      else if (state.transferred) lab.setExplanation('En elektron flyttades. Kärnorna ändrades inte.', 'Na har nu 11 protoner men 10 elektroner: Na⁺. Cl har 17 protoner och 18 elektroner: Cl⁻. Jonerna har motsatta laddningar och attraherar varandra. Totalt finns fortfarande 28 elektroner.');
      else lab.setExplanation('Två neutrala atomer: vad händer när en elektron flyttas?', 'Na har 11 protoner och 11 elektroner. Cl har 17 av varje. Dra den gula ytterelektronen till Cl eller använd knappen. Jämför sedan protoner, elektroner och nettoladdning.');
    } else {
      $('ledger').textContent = state.shared ? 'H₂: två protoner och två delade elektroner. Hela molekylen är neutral. Elektronerna räknas inte dubbelt.' : 'Två H-atomer: vardera en proton och en elektron. Tillsammans två protoner och två elektroner.';
      lab.setExplanation(state.shared ? 'Två elektroner delas av två kärnor.' : 'En elektron från varje väteatom.', state.shared ? 'I en H₂-molekyl är elektronparet gemensamt för båda vätekärnorna. Det finns två elektroner sammanlagt. De fördubblas inte när vi beskriver att båda atomerna delar paret. Bildväxlingen är en förklaringsmodell, inte reaktionens verkliga förlopp.' : 'Jämför två separata väteatomer med en H₂-molekyl. Varje atom bidrar med en elektron till det delade paret. Inga elektroner eller protoner skapas.');
    }
    if (message) lab.announce(message);
    lab.invalidate();
  }

  function transfer(target) {
    view = 'atoms';
    model.transfer(target);
    refresh(target === 'Cl' ? 'Elektronen flyttades till Cl. Na är plus ett, Cl är minus ett. 28 elektroner finns kvar.' : 'Elektronen flyttades tillbaka. Båda atomerna är neutrala igen.');
  }
  lab.on('#bonds-mode', 'change', event => { model.setMode(event.target.value); view = 'atoms'; drag = null; refresh(); });
  lab.on($('transfer'), 'click', () => transfer('Cl'));
  lab.on($('return'), 'click', () => transfer('Na'));
  lab.on($('lattice'), 'click', () => { view = view === 'lattice' ? 'atoms' : 'lattice'; refresh(); });
  lab.on($('share'), 'click', () => { model.share(true); refresh('Två elektroner bildar det gemensamma paret.'); });
  lab.on($('separate'), 'click', () => { model.share(false); refresh('Åter till bilden av två separata väteatomer.'); });
  lab.on($('cloud'), 'click', () => { cloud = !cloud; refresh(); });
  lab.on($('reset'), 'click', () => { model.reset(); view = 'atoms'; drag = null; refresh('Elektronbokföringen är återställd.'); });
  lab.on(lab.canvas, 'pointerdown', event => {
    if (model.state.mode !== 'ionic' || view !== 'atoms') return;
    const point = lab.point(event);
    if (Math.hypot(point.x - marker.x, point.y - marker.y) > 28) return;
    drag = point; pointerId = event.pointerId;
    lab.canvas.setPointerCapture?.(event.pointerId);
    if (event.cancelable) event.preventDefault();
    lab.invalidate();
  });
  lab.on(lab.canvas, 'pointermove', event => {
    if (!drag || event.pointerId !== pointerId) return;
    drag = lab.point(event);
    if (event.cancelable) event.preventDefault();
    lab.invalidate();
  });
  function endDrag(event, cancelled = false) {
    if (!drag || event.pointerId !== pointerId) return;
    const drop = lab.point(event);
    drag = null;
    if (lab.canvas.hasPointerCapture?.(event.pointerId)) lab.canvas.releasePointerCapture(event.pointerId);
    pointerId = null;
    if (!cancelled && Math.hypot(drop.x - 650, drop.y - 218) < 132) transfer('Cl');
    else if (!cancelled && Math.hypot(drop.x - 230, drop.y - 218) < 132) transfer('Na');
    else { lab.announce('Elektronen stannade där den var. Släpp inom den andra atomens skal eller använd knappen.'); lab.invalidate(); }
  }
  lab.on(lab.canvas, 'pointerup', event => endDrag(event));
  lab.on(lab.canvas, 'pointercancel', event => endDrag(event, true));

  function label(ctx, text, x, y, size = 20, color = C.ink, align = 'center') {
    if (compact) size = Math.max(26, size);
    ctx.font = `${size >= 22 ? 650 : 500} ${size}px system-ui, sans-serif`;
    ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(text, x, y);
  }
  function circle(ctx, x, y, radius, fill, stroke, width = 1.5) {
    ctx.beginPath(); ctx.arc(x, y, radius, 0, TAU);
    if (fill) {ctx.fillStyle = fill; ctx.fill();}
    if (stroke) {ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke();}
  }
  function electron(ctx, x, y, color = C.teal, large = false) {
    ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = large ? 19 : 6;
    circle(ctx, x, y, large ? 10 : 5.3, color, '#082632', 1.5); ctx.restore();
    if (large) label(ctx, '−', x, y + 5, 17, '#163341');
  }
  function shellAtom(ctx, x, symbol, protons, outer, sodium) {
    const yy = 218;
    [43, 75, 108].forEach(radius => circle(ctx, x, yy, radius, null, 'rgba(151,195,212,.3)'));
    [0, Math.PI].forEach(angle => electron(ctx, x + Math.cos(angle) * 43, yy + Math.sin(angle) * 43));
    for (let i = 0; i < 8; i += 1) {
      const angle = i / 8 * TAU + .2;
      electron(ctx, x + Math.cos(angle) * 75, yy + Math.sin(angle) * 75);
    }
    if (!sodium) for (let i = 0; i < outer; i += 1) {
      const angle = -Math.PI + (i + 1) / 8 * TAU;
      electron(ctx, x + Math.cos(angle) * 108, yy + Math.sin(angle) * 108);
    }
    circle(ctx, x, yy, 30, sodium ? '#1e5763' : '#3b416f', sodium ? C.teal : C.blue, 2);
    label(ctx, symbol, x, yy + 2, 24);
    if (!compact) label(ctx, `${protons} p⁺`, x, yy + 20, 12, C.muted);
  }
  function drawIonic(ctx, time) {
    const state = model.state;
    label(ctx, 'EN ELEKTRON BYTER ÄGARE', 480, 40, 17, C.muted);
    label(ctx, state.transferred ? 'Na⁺' : 'Na', 230, 88, 31, C.teal);
    label(ctx, state.transferred ? 'Cl⁻' : 'Cl', 650, 88, 31, C.blue);
    shellAtom(ctx, 230, 'Na', 11, 1, true);
    // The eighth outer slot is always the separately tracked yellow electron.
    shellAtom(ctx, 650, 'Cl', 17, 7, false);
    const target = state.transferred ? 1 : 0;
    const xx = mix(338, 542, transferProgress);
    const yy = 218 - Math.sin(Math.PI * transferProgress) * 65;
    marker = drag || {x: xx, y: yy};
    ctx.strokeStyle = 'rgba(255,208,124,.42)'; ctx.lineWidth = 2; ctx.setLineDash([5, 7]);
    ctx.beginPath(); ctx.moveTo(352, 214); ctx.quadraticCurveTo(440, 140, 528, 214); ctx.stroke(); ctx.setLineDash([]);
    electron(ctx, marker.x, marker.y, C.gold, true);
    label(ctx, target ? '10 e⁻ · nettoladdning +1' : '11 e⁻ · nettoladdning 0', 230, 365, 19, C.teal);
    label(ctx, target ? '18 e⁻ · nettoladdning −1' : '17 e⁻ · nettoladdning 0', 650, 365, 19, C.blue);
    label(ctx, 'Kärnorna är låsta: 11 p⁺ och 17 p⁺.', 480, 409, 19, C.ink);
    label(ctx, 'Räknepunkter och skal — inte verkliga elektronbanor.', 480, 438, 15, C.muted);
  }
  function drawLattice(ctx, time) {
    label(ctx, 'ETT ANNAT UTSNITT: EN STÖRRE KRISTALL', 480, 36, 17, C.muted);
    for (let layer = 2; layer >= 0; layer -= 1) {
      ctx.save(); ctx.globalAlpha = 1 - layer * .22;
      for (let row = 0; row < 4; row += 1) for (let column = 0; column < 4; column += 1) {
        const positive = (row + column + layer) % 2 === 0;
        const xx = 297 + column * 106 + layer * 29;
        const yy = 112 + row * 72 - layer * 17 + Math.sin(time * 2 + row + column) * 1.1;
        circle(ctx, xx, yy, positive ? 24 : 29, positive ? '#184e58' : '#2f3e6a', positive ? C.teal : C.blue, 2);
        label(ctx, positive ? 'Na⁺' : 'Cl⁻', xx, yy + 6, 19, positive ? C.teal : C.blue);
      }
      ctx.restore();
    }
    label(ctx, '24 Na⁺ + 24 Cl⁻ · förhållandet 1 : 1', 480, 402, 22, C.gold);
    label(ctx, 'Ett utsträckt jongitter — inga avgränsade NaCl-molekyler.', 480, 437, 17, C.ink);
  }
  function drawCovalent(ctx, time) {
    const s = shareProgress;
    const left = mix(280, 418, s), right = mix(680, 542, s), yy = 219;
    label(ctx, s > .95 ? 'H₂ · ETT GEMENSAMT ELEKTRONPAR' : 'TVÅ H-ATOMER · TVÅ ELEKTRONER', 480, 43, 20, C.ink);
    if (cloud) {
      ctx.save();
      for (let ring = 10; ring >= 1; ring -= 1) {
        ctx.fillStyle = `rgba(100,227,218,${.012 + (11 - ring) * .002})`;
        if (s > .05) {
          ctx.beginPath(); ctx.ellipse(480, yy, 105 + ring * 9 + (1 - s) * 130, 35 + ring * 6, 0, 0, TAU); ctx.globalAlpha = s; ctx.fill();
        }
        ctx.globalAlpha = 1 - s;
        for (const xx of [left, right]) {ctx.beginPath(); ctx.ellipse(xx, yy, 35 + ring * 8, 35 + ring * 8, 0, 0, TAU); ctx.fill();}
      }
      ctx.restore();
    }
    if (!cloud || s < .95) {
      ctx.save(); ctx.globalAlpha = 1 - s;
      circle(ctx, left, yy, 88, null, '#4c8796'); circle(ctx, right, yy, 88, null, '#4c8796'); ctx.restore();
    }
    if (s > .2) {
      ctx.strokeStyle = `rgba(228,243,244,${s * .55})`; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(left + 22, yy); ctx.lineTo(right - 22, yy); ctx.stroke();
    }
    [left, right].forEach(xx => {circle(ctx, xx, yy, 29, '#2c4558', C.blue, 2); label(ctx, 'H', xx, yy + 2, 24); if (!compact) label(ctx, '1 p⁺', xx, yy + 20, 12, C.muted);});
    electron(ctx, mix(left + 88, 468, s), mix(yy - 2, yy - 28, s), C.gold, true);
    electron(ctx, mix(right - 88, 492, s), mix(yy + 2, yy + 28, s), C.gold, true);
    label(ctx, s > .95 ? 'Två elektroner delas av båda kärnorna.' : 'Varje atom bidrar med en elektron.', 480, 366, 23, C.teal);
    label(ctx, '2 protoner + 2 elektroner · total laddning 0', 480, 402, 19, C.ink);
    label(ctx, 'Molnet är en schematisk förklaring, inte ett fotografi.', 480, 438, 16, C.muted);
  }
  lab.setDraw(({ctx, dt, time, motion, compact: small}) => {
    compact = small;
    const state = model.state;
    const speed = motion === false ? 1 : 1 - Math.exp(-Math.max(dt, .001) * 7);
    transferProgress += ((state.transferred ? 1 : 0) - transferProgress) * speed;
    shareProgress += ((state.shared ? 1 : 0) - shareProgress) * speed;
    if (Math.abs(transferProgress - (state.transferred ? 1 : 0)) < .001) transferProgress = state.transferred ? 1 : 0;
    if (Math.abs(shareProgress - (state.shared ? 1 : 0)) < .001) shareProgress = state.shared ? 1 : 0;
    if (state.mode === 'covalent') drawCovalent(ctx, time);
    else if (view === 'lattice') drawLattice(ctx, time);
    else drawIonic(ctx, time);
  });
  refresh();
  return {setActive: value => lab.setActive(value), destroy: () => lab.destroy()};
}
