/** The workshop supports H₂, O₂ and H₂O; free atoms are building pieces. */
export const SYMBOLS = Object.freeze({ H: { valence: 1, name: 'väte' }, O: { valence: 2, name: 'syre' } });
export function createWorkspace() { return { atoms: [], bonds: [], nextId: 1 }; }
export function addAtom(state, symbol, x = 480, y = 220) {
  if (!SYMBOLS[symbol]) throw new RangeError('Välj H eller O.');
  if (!Number.isFinite(x) || !Number.isFinite(y)) throw new TypeError('Atomens läge måste vara ändligt.');
  const atom = { id: state.nextId++, symbol, x, y };
  state.atoms.push(atom); return atom;
}
export function components(state) {
  const remaining = new Set(state.atoms.map(a => a.id)), groups = [];
  while (remaining.size) {
    const ids = [remaining.values().next().value]; remaining.delete(ids[0]);
    for (let i = 0; i < ids.length; i++) for (const bond of state.bonds) {
      const other = bond.a === ids[i] ? bond.b : bond.b === ids[i] ? bond.a : null;
      if (remaining.delete(other)) ids.push(other);
    }
    groups.push(ids.map(id => state.atoms.find(a => a.id === id)));
  }
  return groups;
}
const usedValence = (state, id) => state.bonds.reduce((n, b) => n + (b.a === id || b.b === id ? b.order : 0), 0);
export function bondDecision(state, aId, bId) {
  const a = state.atoms.find(x => x.id === aId), b = state.atoms.find(x => x.id === bId);
  if (!a || !b || a === b) return { ok: false, message: 'Välj två olika atomer.' };
  if (state.bonds.some(x => x.a === aId && x.b === bId || x.a === bId && x.b === aId))
    return { ok: false, message: 'De valda atomerna är redan bundna.' };
  const order = a.symbol === 'O' && b.symbol === 'O' ? 2 : 1;
  if (usedValence(state, a.id) + order > SYMBOLS[a.symbol].valence ||
      usedValence(state, b.id) + order > SYMBOLS[b.symbol].valence)
    return { ok: false, message: 'Det blir för många bindningar. H har en och O två bindningar i den här modellen.' };
  return { ok: true, order, message: order === 2 ? 'Två syreatomer får en dubbelbindning.' : 'En enkelbindning kan bildas.' };
}
export function bindAtoms(state, a, b) {
  const decision = bondDecision(state, a, b);
  if (decision.ok) state.bonds.push({ a, b, order: decision.order });
  return decision;
}
export function breakBond(state, a, b) {
  const before = state.bonds.length;
  state.bonds = state.bonds.filter(x => !(x.a === a && x.b === b || x.a === b && x.b === a));
  return state.bonds.length < before;
}
export function removeAtom(state, id) {
  state.atoms = state.atoms.filter(a => a.id !== id);
  state.bonds = state.bonds.filter(b => b.a !== id && b.b !== id);
}
export function moveComponent(state, id, dx, dy) {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
  const group = components(state).find(g => g.some(a => a.id === id));
  for (const atom of group || []) { atom.x += dx; atom.y += dy; }
}
/** Suggest a valid bond for a dragged group. The caller commits on release. */
export function snapCandidate(state, movingId, reach = 112) {
  const moving = components(state).find(g => g.some(a => a.id === movingId));
  if (!moving) return null;
  const ids = new Set(moving.map(a => a.id));
  let best = null;
  for (const a of moving) for (const b of state.atoms) {
    if (ids.has(b.id)) continue;
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    if (distance > reach || (best && distance >= best.distance)) continue;
    const decision = bondDecision(state, a.id, b.id);
    if (decision.ok) best = { a: a.id, b: b.id, distance, order: decision.order };
  }
  return best;
}
export function missionComplete(state, mission) {
  const info = describeWorkspace(state);
  const water = info.groups.filter(g => g.formula === 'H₂O').length;
  if (mission === 0) return water >= 1;
  if (mission === 1) return water >= 2 && info.classification === 'Rent ämne · kemisk förening';
  if (mission === 2) return water >= 2 && info.species.includes('O₂') && info.classification === 'Blandning';
  return false;
}
export function describeWorkspace(state) {
  const groups = components(state).map(atoms => {
    const h = atoms.filter(a => a.symbol === 'H').length, o = atoms.length - h;
    const complete = atoms.length > 1 && atoms.every(a => usedValence(state, a.id) === SYMBOLS[a.symbol].valence);
    const formula = complete ? h === 2 && o === 1 ? 'H₂O' : h === 2 && !o ? 'H₂' : o === 2 && !h ? 'O₂' : null : null;
    return { atoms, complete: Boolean(formula), formula, compound: Boolean(h && o) };
  });
  const molecules = groups.filter(g => g.complete);
  const unfinished = groups.filter(g => !g.complete);
  const species = [...new Set(molecules.map(g => g.formula))];
  const formula = species.map(f => {
    const count = molecules.filter(g => g.formula === f).length;
    return `${count > 1 ? count + ' ' : ''}${f}`;
  }).join(' + ') || 'Ingen målmolekyl ännu';
  let classification = 'Byggfas';
  if (!unfinished.length && molecules.length) classification = species.length > 1 ? 'Blandning' :
    molecules[0].compound ? 'Rent ämne · kemisk förening' : 'Rent ämne · grundämne';
  return { atomCount: state.atoms.length, atomTypes: new Set(state.atoms.map(a => a.symbol)).size,
    moleculeCount: groups.filter(g => g.atoms.length > 1).length,
    targetMoleculeCount: molecules.length, groups, species, formula, classification,
    freeAtoms: unfinished.filter(g => g.atoms.length === 1).length,
    unfinishedGroups: unfinished.filter(g => g.atoms.length > 1).length };
}
