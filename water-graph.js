/** Temperature history for Vattenlabbet. Values come from the energy model. */
const NS = 'http://www.w3.org/2000/svg';
let graphSerial = 0;

export function createTemperatureGraph(svg, {onInspect} = {}) {
  if (!svg || svg.namespaceURI !== NS || svg.localName !== 'svg') {
    throw new TypeError('createTemperatureGraph needs an SVG element');
  }

  const W = 760;
  // A tall plot remains legible beside the molecule view at narrow widths.
  // Preserve one uniform SVG scale so TeX glyphs keep their proportions.
  let H = 440;
  const LEFT = 70;
  const RIGHT = 736;
  const TOP = 24;
  let BOTTOM = H - 60;
  const INK = '#243e4b';
  const MUTED = '#516b78';
  const CYAN = '#00788e';
  const GOLD = '#a86b00';
  const originalAttributes = new Map(['viewBox', 'preserveAspectRatio', 'tabindex', 'role', 'aria-label']
    .map(name => [name, svg.getAttribute(name)]));
  const originalStyle = svg.getAttribute('style');
  const baseLabel = 'Temperatur över modelltid. Använd vänster och höger pil för att undersöka kurvan. Escape avslutar.';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('tabindex', '0');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', baseLabel);
  svg.style.width = '100%';
  svg.style.height = 'auto';
  svg.style.display = 'block';
  svg.style.touchAction = 'pan-y';

  function node(tag, attributes = {}, parent, label) {
    const element = svg.ownerDocument.createElementNS(NS, tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
    if (label !== undefined) element.textContent = label;
    if (parent) parent.append(element);
    return element;
  }

  const root = node('g', {
    'font-family': 'system-ui, -apple-system, sans-serif',
    'font-size': 12,
    fill: INK,
  });
  svg.append(root);
  node('title', {}, root, 'Vattnets temperatur över tid');
  node('desc', {}, root, 'Den blå kurvan visar aktuellt försök och en eventuell gul kurva visar ett sparat försök. Streckade linjer markerar 0 och 100 grader Celsius.');
  const background = node('rect', {x: 0, y: 0, width: W, height: H, rx: 12, fill: '#ffffff'}, root);
  const defs = node('defs', {}, root);
  const clipId = `water-temperature-clip-${++graphSerial}`;
  const clip = node('clipPath', {id: clipId}, defs);
  const clipRect = node('rect', {x: LEFT - 20, y: TOP - 20, width: RIGHT - LEFT + 40, height: BOTTOM - TOP + 40}, clip);
  const grid = node('g', {'pointer-events': 'none'}, root);
  const xTicks = node('g', {'pointer-events': 'none'}, root);
  const plot = node('g', {'clip-path': `url(#${clipId})`, 'pointer-events': 'none'}, root);
  const fill = node('path', {fill: '#20c4d6', 'fill-opacity': 0.17, stroke: 'none'}, plot);
  const referenceLine = node('path', {
    fill: 'none', stroke: GOLD, 'stroke-width': 2.7,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  }, plot);
  const historyLine = node('path', {
    fill: 'none', stroke: CYAN, 'stroke-width': 3.1,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  }, plot);
  const currentDot = node('circle', {'class': 'wl-graph-current', r: 4.5, fill: CYAN, stroke: '#fff', 'stroke-width': 2, visibility: 'hidden'}, plot);
  const inspection = node('g', {visibility: 'hidden', 'pointer-events': 'none'}, plot);
  const guide = node('line', {y1: TOP, y2: BOTTOM, stroke: INK, 'stroke-width': 1.2, 'stroke-dasharray': '3 4'}, inspection);
  const inspectionDot = node('circle', {r: 5.5, fill: CYAN, stroke: '#fff', 'stroke-width': 2}, inspection);

  const y = temperature => BOTTOM - (temperature + 30) / 150 * (BOTTOM - TOP);
  const temperatureLabels = [], horizontalLines = [];
  for (const temperature of [-30, 0, 30, 60, 90, 120]) {
    const yy = y(temperature);
    if (temperature !== 0) horizontalLines.push({temperature,line:node('line', {x1: LEFT, x2: RIGHT, y1: yy, y2: yy, stroke: '#e1e9ed', 'stroke-width': 1}, grid)});
    const group = node('g', {}, grid);
    const text = node('text', {x: LEFT - 12, y: yy + 4, 'text-anchor': 'end', fill: MUTED}, group,
      temperature < 0 ? `−${Math.abs(temperature)}` : String(temperature));
    temperatureLabels.push({temperature, group, text});
  }
  let boilingLabel;
  for (const temperature of [0, 100]) {
    const yy = y(temperature);
    horizontalLines.push({temperature,line:node('line', {x1: LEFT, x2: RIGHT, y1: yy, y2: yy, stroke: '#77929e', 'stroke-width': 1.1, 'stroke-dasharray': '5 5'}, grid)});
    if (temperature === 100) boilingLabel = node('text', {
      x: RIGHT - 5, y: yy - 6, 'text-anchor': 'end', fill: MUTED,
      stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', 'font-size': 11,
    }, grid, '100 °C');
  }
  const axes = node('path', {d: `M${LEFT},${TOP}V${BOTTOM}H${RIGHT}`, fill: 'none', stroke: '#8ca3ad', 'stroke-width': 1.2}, grid);
  const titles = node('g', {}, root);
  const yTitle = node('text', {x: 18, y: (TOP + BOTTOM) / 2, 'text-anchor': 'middle', transform: `rotate(-90 18 ${(TOP + BOTTOM) / 2})`, 'font-size': 12.5}, titles, 'Temperatur (°C)');
  const xTitle = node('text', {x: (LEFT + RIGHT) / 2, y: H - 6, 'text-anchor': 'middle', 'font-size': 12.5}, titles, 'Modelltid (min)');
  const legend = node('g', {'class':'wl-graph-legend', 'font-size': 11, 'pointer-events': 'none'}, root);
  node('line', {x1: LEFT, x2: LEFT + 18, y1: 10, y2: 10, stroke: CYAN, 'stroke-width': 3, 'stroke-linecap': 'round'}, legend);
  node('text', {x: LEFT + 25, y: 14}, legend, 'Ditt försök');
  const referenceLegend = node('g', {visibility: 'hidden'}, legend);
  node('line', {x1: LEFT + 128, x2: LEFT + 146, y1: 10, y2: 10, stroke: GOLD, 'stroke-width': 3, 'stroke-linecap': 'round'}, referenceLegend);
  node('text', {x: LEFT + 153, y: 14}, referenceLegend, 'Sparat försök');

  let points = [];
  let referencePoints = [];
  let maxTime = 120;
  let selectedIndex = -1;
  let destroyed = false;
  let compact = false;
  let textSize = 16;
  let lastTickMax = -1;
  let lastWidth = 0;
  const minuteFormatter = new Intl.NumberFormat('sv-SE', {maximumFractionDigits: 2});
  const valueFormatter = new Intl.NumberFormat('sv-SE', {maximumFractionDigits: 1});
  const x = seconds => LEFT + seconds / maxTime * (RIGHT - LEFT);
  const inspectable = () => points.length ? points : referencePoints;

  function updateTicks() {
    xTicks.replaceChildren();
    const count = compact ? 2 : 4;
    for (let index = 0; index <= count; index += 1) {
      const time = maxTime * index / count;
      const xx = x(time);
      node('line', {x1: xx, x2: xx, y1: BOTTOM, y2: BOTTOM + 5, stroke: '#8ca3ad'}, xTicks);
      node('text', {x: xx, y: BOTTOM + textSize + 7, 'font-size': textSize, 'text-anchor': index===count?'end':index===0?'start':'middle', fill: MUTED}, xTicks, minuteFormatter.format(time / 60));
    }
    lastTickMax = maxTime;
  }

  function resize() {
    if (destroyed) return;
    const width = svg.getBoundingClientRect().width || 760;
    const nextCompact = width < 520;
    const nextSize = Math.min(38, Math.max(14, Math.round(13 * W / width)));
    const nextHeight = Math.max(230,Math.min(440,Math.ceil(84+138*W/width)));
    if (compact === nextCompact && textSize === nextSize && H === nextHeight && width === lastWidth && lastTickMax >= 0) return;
    lastWidth = width;
    compact = nextCompact;
    textSize = nextSize;
    H = nextHeight;
    BOTTOM = H - 60;
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    background.setAttribute('height',H);
    clipRect.setAttribute('height',BOTTOM-TOP+40);
    guide.setAttribute('y2',BOTTOM);
    axes.setAttribute('d',`M${LEFT},${TOP}V${BOTTOM}H${RIGHT}`);
    for(const {temperature,line} of horizontalLines){line.setAttribute('y1',y(temperature));line.setAttribute('y2',y(temperature));}
    boilingLabel.setAttribute('y',y(100)-6);
    yTitle.setAttribute('y',(TOP+BOTTOM)/2);
    yTitle.setAttribute('transform',`rotate(-90 18 ${(TOP+BOTTOM)/2})`);
    xTitle.setAttribute('y',H-6);
    const pixelScale=W/width;
    currentDot.setAttribute('r',4.6*pixelScale);
    currentDot.setAttribute('stroke-width',1.8*pixelScale);
    inspectionDot.setAttribute('r',5.2*pixelScale);
    inspectionDot.setAttribute('stroke-width',1.8*pixelScale);
    historyLine.setAttribute('stroke-width',2*pixelScale);
    referenceLine.setAttribute('stroke-width',1.8*pixelScale);
    // Hide the whole group, including TeX's sibling paths. The units also appear
    // as ordinary accessible text directly above the compact chart.
    titles.setAttribute('visibility', compact ? 'hidden' : 'visible');
    legend.setAttribute('visibility', compact ? 'hidden' : 'visible');
    for (const {temperature, group, text} of temperatureLabels) {
      group.setAttribute('visibility', compact && temperature !== 0 ? 'hidden' : 'visible');
      text.setAttribute('font-size', textSize);
      text.setAttribute('x', compact ? LEFT + 10 : LEFT - 12);
      text.setAttribute('y', y(temperature) + (compact ? -8 : 5));
      text.setAttribute('text-anchor', compact ? 'start' : 'end');
      const label = temperature === 0 && compact ? '0 °C' : temperature < 0 ? `−${Math.abs(temperature)}` : String(temperature);
      if (text.textContent !== label) text.textContent = label;
    }
    boilingLabel.setAttribute('font-size', textSize);
    for (const title of titles.children) title.setAttribute('font-size', Math.min(18, textSize));
    updateTicks();
    update(points,referencePoints);
  }
  const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(svg);

  function clean(input) {
    if (!Array.isArray(input)) return [];
    return input.filter(point => point && Number.isFinite(point.timeSeconds)
      && point.timeSeconds >= 0 && Number.isFinite(point.temperature))
      .map(({timeSeconds, temperature}) => ({timeSeconds, temperature}))
      .sort((a, b) => a.timeSeconds - b.timeSeconds);
  }

  function niceCeiling(value) {
    const scale = 10 ** Math.floor(Math.log10(value));
    const normalized = value / scale;
    return (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * scale;
  }

  function path(data) {
    // Deliberately linear: spline smoothing would invent overshoot near plateaus.
    return data.map((point, index) => `${index ? 'L' : 'M'}${x(point.timeSeconds).toFixed(2)},${y(point.temperature).toFixed(2)}`).join(' ');
  }

  function nearestIndex(timeSeconds) {
    const data = inspectable();
    if (!data.length) return -1;
    let low = 0;
    let high = data.length - 1;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (data[mid].timeSeconds < timeSeconds) low = mid + 1;
      else high = mid;
    }
    if (low > 0 && Math.abs(data[low - 1].timeSeconds - timeSeconds)
      <= Math.abs(data[low].timeSeconds - timeSeconds)) return low - 1;
    return low;
  }

  function showInspection(index, notify = true) {
    const data = inspectable();
    if (index < 0 || !data.length) return clearInspection();
    selectedIndex = Math.min(index, data.length - 1);
    const point = data[selectedIndex];
    const xx = x(point.timeSeconds);
    const yy = y(point.temperature);
    guide.setAttribute('x1', xx);
    guide.setAttribute('x2', xx);
    inspectionDot.setAttribute('cx', xx);
    inspectionDot.setAttribute('cy', yy);
    inspectionDot.setAttribute('fill', points.length ? CYAN : GOLD);
    inspection.setAttribute('visibility', 'visible');
    svg.setAttribute('aria-label', `${baseLabel} Vald punkt: ${valueFormatter.format(point.timeSeconds / 60)} minuter, ${valueFormatter.format(point.temperature)} grader Celsius.`);
    if (notify && typeof onInspect === 'function') onInspect({...point});
  }

  function clearInspection() {
    selectedIndex = -1;
    inspection.setAttribute('visibility', 'hidden');
    svg.setAttribute('aria-label', baseLabel);
  }

  function pointer(event) {
    if (destroyed) return;
    const bounds = svg.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    // Honor responsive SVG letterboxing rather than equating CSS px to viewBox px.
    const scale = Math.min(bounds.width / W, bounds.height / H);
    const renderedWidth = W * scale;
    const offsetX = (bounds.width - renderedWidth) / 2;
    const xx = (event.clientX - bounds.left - offsetX) / scale;
    if (xx < LEFT || xx > RIGHT) return clearInspection();
    showInspection(nearestIndex((xx - LEFT) / (RIGHT - LEFT) * maxTime));
  }

  function pointerDown(event) {
    svg.focus({preventScroll: true});
    pointer(event);
  }

  function keydown(event) {
    const data = inspectable();
    if (event.key === 'Escape') {
      event.preventDefault();
      clearInspection();
      return;
    }
    if (!data.length) return;
    let index;
    if (event.key === 'ArrowLeft') index = selectedIndex < 0 ? data.length - 1 : Math.max(0, selectedIndex - 1);
    else if (event.key === 'ArrowRight') index = selectedIndex < 0 ? 0 : Math.min(data.length - 1, selectedIndex + 1);
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = data.length - 1;
    else return;
    event.preventDefault();
    showInspection(index);
  }

  const listeners = [
    ['pointermove', pointer], ['pointerdown', pointerDown],
    ['pointerleave', clearInspection], ['pointercancel', clearInspection], ['keydown', keydown],
  ];
  for (const [name, listener] of listeners) svg.addEventListener(name, listener);

  function update(history, reference = []) {
    if (destroyed) return;
    const selectedTime = selectedIndex >= 0 ? inspectable()[selectedIndex]?.timeSeconds : undefined;
    points = clean(history);
    referencePoints = clean(reference);
    const lastTime = Math.max(points.at(-1)?.timeSeconds || 0, referencePoints.at(-1)?.timeSeconds || 0);
    maxTime = Math.max(120, niceCeiling(Math.max(2, lastTime / 60)) * 60);
    const line = path(points);
    historyLine.setAttribute('d', line);
    referenceLine.setAttribute('d', path(referencePoints));
    referenceLegend.setAttribute('visibility', referencePoints.length ? 'visible' : 'hidden');
    fill.setAttribute('d', points.length
      ? `${line} L${x(points.at(-1).timeSeconds).toFixed(2)},${BOTTOM} L${x(points[0].timeSeconds).toFixed(2)},${BOTTOM} Z` : '');
    if (points.length) {
      currentDot.setAttribute('cx', x(points.at(-1).timeSeconds));
      currentDot.setAttribute('cy', y(points.at(-1).temperature));
      currentDot.setAttribute('visibility', 'visible');
    } else currentDot.setAttribute('visibility', 'hidden');

    if (lastTickMax !== maxTime) updateTicks();
    if (selectedTime !== undefined && inspectable().length) showInspection(nearestIndex(selectedTime), false);
    else clearInspection();
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    resizeObserver?.disconnect();
    for (const [name, listener] of listeners) svg.removeEventListener(name, listener);
    root.remove();
    for (const [name, value] of originalAttributes) {
      if (value === null) svg.removeAttribute(name);
      else svg.setAttribute(name, value);
    }
    if (originalStyle === null) svg.removeAttribute('style');
    else svg.setAttribute('style', originalStyle);
    points = [];
    referencePoints = [];
  }

  resize();
  update([]);
  return {update, destroy};
}
