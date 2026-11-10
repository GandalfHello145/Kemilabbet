import {createLab, drawAtom, drawBond, roundRect} from './lab-kit.js';
import {ReactionsModel} from './lab-reactions-model.js';

const COLORS = {ink: '#e5f4f4', muted: '#9dbcc8', teal: '#70e2d8', gold: '#ffd081'};
const smooth = value => value * value * (3 - 2 * value);
const lerp = (a, b, value) => a + (b - a) * value;

export function mountLab(host) {
  const model = new ReactionsModel();
  let prediction = '';
  let followed = false;
  let progress = 1;
  let from = new Map();
  let positions = new Map();
  let oldMolecules = [];
  let compact = false;
  let allowMotion = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lab = createLab(host, {
    id: 'reaction', title: 'Reaktionslabbet', subtitle: 'Förutsäg resultatet och följ varje atom till dess nya grannar.',
    badge: 'SAMMA ATOMER · NYA MOLEKYLER', running: false,
    canvasLabel: 'Atommodell för två vätemolekyler och en syremolekyl som ger två vattenmolekyler. Provet och dess omgivning visas samtidigt.',
    controls: '<div class="cl-control-grid"><label class="cl-field" for="reaction-hydrogen"><span class="cl-slider-label">Vätemolekyler, H₂ <output data-reaction="h-count">4</output></span><input id="reaction-hydrogen" type="range" min="0" max="8" value="4" step="1"></label>'
      + '<label class="cl-field" for="reaction-oxygen"><span class="cl-slider-label">Syremolekyler, O₂ <output data-reaction="o-count">2</output></span><input id="reaction-oxygen" type="range" min="0" max="8" value="2" step="1"></label></div>'
      + '<p class="cl-formula">2 H₂ + O₂ → 2 H₂O</p><div class="cl-row"><label class="cl-field" for="reaction-prediction">Hur många H₂O kan bildas?<select id="reaction-prediction"><option value="">Gissa först</option>'
      + Array.from({length: 9}, (_, i) => `<option value="${i}">${i} vattenmolekyler</option>`).join('')
      + '</select></label><button type="button" class="cl-primary" data-reaction="react">Visa omgrupperingen →</button><button type="button" data-reaction="reset">Börja om ↺</button></div>'
      + '<fieldset><legend>Provet och omgivningen</legend><div class="cl-actions"><label><input type="radio" name="reaction-system" value="closed" checked> Slutet prov</label><label><input type="radio" name="reaction-system" value="open"> Öppet prov</label><button type="button" data-reaction="release" disabled>Följ en gasmolekyl ut →</button><button type="button" data-reaction="follow" aria-pressed="false">Markera samma O-atom</button></div></fieldset>'
      + '<p class="cl-note">Vi räknar små grupper: två H₂ och en O₂ behövs för varje omgruppering. Animationen är en bokföringsbild, inte en verklig reaktionsmekanism eller instruktion för ett experiment.</p>',
    metrics: '<div><span>H₂O i hela översikten</span><strong data-metric="water">0</strong></div><div><span>Kvar efter omgrupperingen</span><strong data-metric="excess">—</strong></div><div><span>Atomer före och efter</span><strong data-metric="atoms">8 H · 4 O</strong></div><div><span>Provmassa / omgivning*</span><strong data-metric="mass">72 / 0</strong></div>',
    below: '<p data-reaction="result" role="status">Välj mängder och förutsäg antalet vattenmolekyler. Det är atomerna som bevaras, inte antalet molekyler.</p>'
      + '<p class="cl-note">Jämför med en fysikalisk förändring i <a href="?lab=alla#omrade-6">Vattenlabbet</a>: där finns samma H₂O-molekyler kvar när is smälter. Här bildas ett nytt ämne genom nya bindningar.</p>'
      + '<table class="cl-table"><caption>Atomernas bokföring i provet och omgivningen tillsammans</caption><thead><tr><th scope="col">Atomslag</th><th scope="col">Före</th><th scope="col">Efter / nu</th></tr></thead><tbody><tr><th scope="row">Väte, H</th><td data-reaction="before-h">8</td><td data-reaction="after-h">8</td></tr><tr><th scope="row">Syre, O</th><td data-reaction="before-o">4</td><td data-reaction="after-o">4</td></tr></tbody></table>'
      + '<p data-reaction="system-note">Ett slutet prov behåller alla molekyler. Ingen massa går över till omgivningen.</p><p class="cl-note">* Förenklad relativ massa: H räknas som 1 och O som 16. Värdena visar massans bokföring, inte gram i en verklig laboration. Gul ring markerar O-atomen med samma identitet genom hela bilden.</p>',
    explanationTitle: 'Vad räcker molekylerna till?',
    explanation: 'Varje grupp behöver två H₂ och en O₂. Förutsäg hur många vattenmolekyler ni kan bygga. Alla väte- och syreatomer måste finnas kvar, även om något ämne blir över.',
    questions: ['Varför kan ett ämne bli över även om det andra tar slut?', 'Hur kan antalet molekyler ändras när både atomer och massa bevaras?', 'Var finns massan om en gas lämnar ett öppet prov?'],
    model: '<p>Vi visar endast atom- och massbokföringen i 2 H₂ + O₂ → 2 H₂O. Samma atom-ID följs från start till mål. Den verkliga reaktionen har fler steg; de bågformade rörelserna och övergången mellan bindningar visar ingen verklig reaktionsmekanism eller reaktionstid.</p>'
      + '<p>Modellen räknar hela molekyler, högst åtta av vardera utgångsämnet. En ofullständig grupp reagerar inte vidare här. Ingen kinetik, jämvikt, aktiveringsenergi, temperatur eller tryck beräknas. Alla möjliga hela grupper omgrupperas i den idealiserade slutbilden.</p>'
      + '<p>För att följa ett öppet system visar vi produkten som vattenånga i just denna modell. En vald gasmolekyl kan lämna provet och stannar då synlig i omgivningen. Att stänga provet hämtar inte tillbaka molekyler. I verkligheten beror vattnets tillstånd på temperatur och tryck.</p>'
      + '<p>H=1 och O=16 är avrundade relativa massor för bokföringen. Vanliga kemiska reaktioner bevarar antalet av varje atomslag. Provmassan kan ändras när materia passerar provets gräns.</p>'
      + '<p>Detta är en digital förklaringsmodell. Blandning och antändning av väte och syre kan vara farligt; animationen innehåller inga laborationsanvisningar.</p>'
      + '<p>Källa: <a href="https://www.acs.org/middleschoolchemistry/lessonplans/chapter6/lesson1.html" target="_blank" rel="noopener">ACS: kemiska reaktioner och massans bevarande</a>.</p>',
  });
  const $ = key => lab.$(`[data-reaction="${key}"]`);

  function layout(molecules) {
    const result = new Map();
    let inside = 0, outside = 0;
    for (const molecule of molecules) {
      const external = molecule.location === 'surroundings';
      const index = external ? outside++ : inside++;
      const center = external
        ? {x: 700 + index % 3 * 92, y: 128 + Math.floor(index / 3) * 73}
        : {x: 105 + index % 4 * 132, y: 128 + Math.floor(index / 4) * 73};
      molecule.atoms.forEach((atom, i) => {
        let dx, dy;
        if (molecule.formula === 'H₂O') {dx = i === 0 ? 0 : i === 1 ? -23 : 23; dy = i === 0 ? -5 : 15;}
        else {dx = i === 0 ? -16 : 16; dy = 0;}
        result.set(atom.id, {...atom, x: center.x + dx, y: center.y + dy, molecule: molecule.id});
      });
    }
    return result;
  }

  function resetPositions() {
    const state = model.state;
    positions = layout(state.molecules);
    from = new Map(positions);
    progress = 1;
    oldMolecules = [];
  }

  function beginTransition(action) {
    from = new Map([...positions].map(([id, p]) => [id, {...p}]));
    oldMolecules = model.state.molecules;
    const result = action();
    progress = allowMotion ? 0 : 1;
    if (allowMotion) lab.setRunning(true);
    refresh();
    return result;
  }

  function resultText(state) {
    if (!state.reacted) return 'Gissa först. Två H₂ och en O₂ behövs till varje grupp som ger två H₂O. Samma atomer måste räcka till alla produkter.';
    const correct = Number(prediction) === state.counts.water;
    const opening = correct ? 'Er förutsägelse stämde.' : `Ni gissade ${prediction}; bokföringen ger ${state.counts.water} H₂O.`;
    if (!state.extent) return `${opening} Här finns ingen fullständig grupp med två H₂ och en O₂. Inga vattenmolekyler bildas i modellen.`;
    const remaining = `Kvar finns ${state.counts.hydrogen} H₂ och ${state.counts.oxygen} O₂.`;
    const limit = state.limiting === 'balanced' ? 'Mängderna passar precis i förhållandet 2:1.'
      : state.limiting === 'hydrogen' ? 'Väte begränsar antalet möjliga reaktionsgrupper.' : 'Syre begränsar antalet möjliga reaktionsgrupper.';
    return `${opening} ${state.extent} hela grupper ger ${state.counts.water} H₂O. ${remaining} ${limit}`;
  }

  function refresh(message) {
    const state = model.state;
    $('h-count').textContent = state.hydrogen;
    $('o-count').textContent = state.oxygen;
    lab.setMetric('water', state.counts.water);
    lab.setMetric('excess', state.reacted ? `${state.counts.hydrogen} H₂ · ${state.counts.oxygen} O₂` : 'Gissa först');
    lab.setMetric('atoms', `${state.beforeAtoms.H} H · ${state.beforeAtoms.O} O`);
    lab.setMetric('mass', `${state.sampleMass} / ${state.surroundingsMass}`);
    for (const element of ['h', 'o']) {
      $(`before-${element}`).textContent = state.beforeAtoms[element.toUpperCase()];
      $(`after-${element}`).textContent = state.afterAtoms[element.toUpperCase()];
    }
    $('react').disabled = state.reacted;
    $('release').disabled = !state.reacted || state.system !== 'open' || state.sampleMass === 0;
    $('follow').disabled = state.beforeAtoms.O === 0;
    $('follow').setAttribute('aria-pressed', String(followed));
    $('follow').textContent = followed ? 'O-atomen är markerad' : 'Markera samma O-atom';
    $('result').textContent = resultText(state);
    $('system-note').textContent = state.surroundingsMass > 0
      ? `Provet innehåller relativ massa ${state.sampleMass}; omgivningen ${state.surroundingsMass}. Tillsammans ${state.totalMass}, samma som från början. Att stänga provet hämtar inte tillbaka gasen.`
      : state.system === 'open' ? 'Öppningen i sig tar inte bort några atomer. Efter omgrupperingen kan ni följa en gasmolekyl ut till omgivningen.'
        : 'Ett slutet prov behåller alla molekyler. Ingen massa går över till omgivningen.';
    if (!state.reacted) lab.setExplanation('Vad räcker molekylerna till?', 'Välj mängder, gissa antalet H₂O och starta omgrupperingen. Två H₂ och en O₂ ger två H₂O. Det är antalet atomer, inte molekyler, som måste vara lika före och efter.');
    else if (state.surroundingsMass > 0) lab.setExplanation('Massan byter plats – den försvinner inte.', 'Jämför massan i provet med massan i hela översikten. Gasen som lämnade provet är kvar i omgivningen och räknas fortfarande med i atomtabellen.');
    else lab.setExplanation(state.extent ? 'Samma atomer har fått nya grannar.' : 'Det saknas en fullständig reaktionsgrupp.', resultText(state));
    if (message) lab.announce(message);
    lab.invalidate();
  }

  function newAmounts() {
    model.setAmounts(Number(lab.$('#reaction-hydrogen').value), Number(lab.$('#reaction-oxygen').value));
    prediction = ''; lab.$('#reaction-prediction').value = '';
    resetPositions(); lab.setRunning(false); refresh('Ett nytt prov är valt. Gör en ny förutsägelse.');
  }
  lab.on('#reaction-hydrogen', 'input', newAmounts);
  lab.on('#reaction-oxygen', 'input', newAmounts);
  lab.on('#reaction-prediction', 'change', event => {prediction = event.target.value; lab.invalidate();});
  lab.on($('react'), 'click', () => {
    if (prediction === '') {
      lab.setExplanation('Gör först en förutsägelse.', 'Välj hur många vattenmolekyler ni tror kan bildas. Använd förhållandet två H₂ och en O₂. Det går bra att gissa och sedan jämföra.');
      lab.announce('Välj först antalet vattenmolekyler ni tror kan bildas.');
      lab.$('#reaction-prediction').focus();
      return;
    }
    beginTransition(() => model.react());
    lab.announce(resultText(model.state));
  });
  lab.root.querySelectorAll('[name="reaction-system"]').forEach(input => lab.on(input, 'change', event => {
    if (event.target.checked) {model.setSystem(event.target.value); refresh();}
  }));
  lab.on($('release'), 'click', () => {
    const id = beginTransition(() => model.releaseGas());
    if (id) lab.announce('En gasmolekyl lämnar provet. Alla dess atomer finns kvar i omgivningen.');
  });
  lab.on($('follow'), 'click', () => {followed = !followed; refresh(followed ? 'En syreatom är markerad. Samma atom följs före och efter.' : 'Markeringen är borttagen.');});
  lab.on($('reset'), 'click', () => {
    model.reset();
    prediction = ''; followed = false; lab.$('#reaction-prediction').value = '';
    lab.root.querySelectorAll('[name="reaction-system"]').forEach(input => {input.checked = input.value === 'closed';});
    resetPositions(); lab.setRunning(false); refresh('Tillbaka till utgångsmolekylerna med samma valda mängder.');
  });

  function label(ctx, text, x, y, size = 22, color = COLORS.ink, align = 'center') {
    ctx.font = `${size >= 23 ? 650 : 500} ${compact ? Math.max(26, size) : size}px system-ui, sans-serif`;
    ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(text, x, y);
  }
  function bonds(ctx, molecules, alpha) {
    if (alpha <= .01) return;
    ctx.save(); ctx.globalAlpha = alpha;
    for (const molecule of molecules) {
      const atoms = molecule.atoms.map(atom => positions.get(atom.id));
      if (!atoms.every(Boolean)) continue;
      if (molecule.formula === 'H₂O') {
        drawBond(ctx, atoms[0], atoms[1]); drawBond(ctx, atoms[0], atoms[2]);
      } else drawBond(ctx, atoms[0], atoms[1], molecule.formula === 'O₂' ? 2 : 1);
    }
    ctx.restore();
  }
  lab.setDraw(({ctx, dt, running, time, motion, compact: small}) => {
    compact = small;
    allowMotion = motion;
    const state = model.state;
    if (progress < 1 && running) progress = motion ? Math.min(1, progress + dt / 2.8) : 1;
    // Reduced-motion users get the final bookkeeping picture immediately.
    if (progress < 1 && !motion) progress = 1;
    const target = layout(state.molecules);
    const t = smooth(progress);
    const next = new Map();
    for (const [id, end] of target) {
      const start = from.get(id) || end;
      const arc = Math.sin(Math.PI * t) * (28 + Number(id.split('-')[1]) % 4 * 8);
      next.set(id, {...end, x: lerp(start.x, end.x, t), y: lerp(start.y, end.y, t) - arc});
    }
    positions = next;
    roundRect(ctx, 27, 75, 585, 309, 18, 'rgba(22,63,78,.50)', '#648d9e');
    roundRect(ctx, 650, 75, 285, 309, 18, 'rgba(22,51,68,.35)', '#426e82');
    label(ctx, state.system === 'open' ? 'PROVET · ÖPPET' : 'PROVET · SLUTET', 319, 48, 23, COLORS.teal);
    label(ctx, 'OMGIVNING', 791, 48, 23, COLORS.muted);
    if (state.system === 'open') {
      ctx.clearRect(600, 185, 24, 65);
      ctx.strokeStyle = COLORS.gold; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(605, 216); ctx.lineTo(645, 216); ctx.lineTo(635, 208); ctx.moveTo(645, 216); ctx.lineTo(635, 224); ctx.stroke();
    }
    if (progress < 1) bonds(ctx, oldMolecules, Math.max(0, 1 - progress * 2.5));
    bonds(ctx, state.molecules, progress < 1 ? Math.max(0, (progress - .55) / .45) : 1);
    for (const [id, atom] of positions) {
      drawAtom(ctx, atom.x, atom.y, atom.element === 'O' ? (compact ? 22 : 17) : (compact ? 19 : 13), atom.element, {selected: followed && id === 'O-0', label: !compact});
      if (compact) label(ctx, atom.element, atom.x, atom.y + 8, 26, atom.element === 'H' ? '#163b47' : '#ffffff');
    }
    const total = state.totalMass || 1;
    roundRect(ctx, 198, 401, 240, 9, 4, '#244759');
    roundRect(ctx, 198, 401, 240 * state.sampleMass / total, 9, 4, COLORS.teal);
    roundRect(ctx, 672, 401, 240, 9, 4, '#244759');
    if (state.surroundingsMass) roundRect(ctx, 672, 401, 240 * state.surroundingsMass / total, 9, 4, COLORS.gold);
    label(ctx, `Relativ massa: ${state.sampleMass}`, 318, 440, 22, COLORS.teal);
    label(ctx, `Massa: ${state.surroundingsMass}`, 792, 440, 22, COLORS.gold);
    if (!positions.size) label(ctx, 'Välj molekyler med reglagen.', 319, 232, 23, COLORS.muted);
    if (!state.molecules.some(m => m.location === 'surroundings')) label(ctx, 'Här följer vi gas', 792, 195, 18, COLORS.muted);
    if (!state.molecules.some(m => m.location === 'surroundings')) label(ctx, 'som lämnar provet.', 792, 231, 18, COLORS.muted);
  });
  resetPositions(); refresh();
  return {setActive: value => lab.setActive(value), destroy: () => lab.destroy()};
}
