/**
 * Stoichiometric bookkeeping for 2 H₂ + O₂ → 2 H₂O.
 * H=1 and O=16 are rounded relative masses for a conservation diagram.
 * Atom mapping does not claim to reproduce the real reaction mechanism.
 */
export const MAX_MOLECULES = 8;
export const RELATIVE_MASS = Object.freeze({H: 1, O: 16});

function count(value) {
  if (!Number.isFinite(value)) throw new TypeError('Molecule count must be finite');
  return Math.max(0, Math.min(MAX_MOLECULES, Math.floor(value)));
}

function mass(molecule) {
  return molecule.atoms.reduce((sum, atom) => sum + RELATIVE_MASS[atom.element], 0);
}

export class ReactionsModel {
  #hydrogen;
  #oxygen;
  #reacted = false;
  #system = 'closed';
  #molecules = [];

  constructor({hydrogen = 4, oxygen = 2} = {}) {
    this.setAmounts(hydrogen, oxygen);
  }

  setAmounts(hydrogen, oxygen) {
    const nextH = count(hydrogen);
    const nextO = count(oxygen);
    this.#hydrogen = nextH;
    this.#oxygen = nextO;
    this.#reacted = false;
    this.#molecules = [];
    for (let i = 0; i < nextH; i += 1) this.#molecules.push({
      id: `hydrogen-${i}`, formula: 'H₂', location: 'sample',
      atoms: [{id: `H-${2*i}`, element: 'H'}, {id: `H-${2*i+1}`, element: 'H'}],
    });
    for (let i = 0; i < nextO; i += 1) this.#molecules.push({
      id: `oxygen-${i}`, formula: 'O₂', location: 'sample',
      atoms: [{id: `O-${2*i}`, element: 'O'}, {id: `O-${2*i+1}`, element: 'O'}],
    });
    return this.state;
  }

  setSystem(system) {
    if (!['closed', 'open'].includes(system)) throw new RangeError('Unknown system');
    this.#system = system;
    return this.state;
  }

  react() {
    if (this.#reacted) return this.state;
    const extent = Math.min(Math.floor(this.#hydrogen / 2), this.#oxygen);
    const water = extent * 2;
    this.#molecules = [];
    for (let i = 0; i < water; i += 1) this.#molecules.push({
      id: `water-${i}`, formula: 'H₂O', location: 'sample',
      atoms: [{id: `O-${i}`, element: 'O'}, {id: `H-${2*i}`, element: 'H'}, {id: `H-${2*i+1}`, element: 'H'}],
    });
    for (let i = water; i < this.#hydrogen; i += 1) this.#molecules.push({
      id: `hydrogen-${i}`, formula: 'H₂', location: 'sample',
      atoms: [{id: `H-${2*i}`, element: 'H'}, {id: `H-${2*i+1}`, element: 'H'}],
    });
    for (let i = extent; i < this.#oxygen; i += 1) this.#molecules.push({
      id: `oxygen-${i}`, formula: 'O₂', location: 'sample',
      atoms: [{id: `O-${2*i}`, element: 'O'}, {id: `O-${2*i+1}`, element: 'O'}],
    });
    this.#reacted = true;
    return this.state;
  }

  /** A closing lid never retrieves a molecule that has already left the sample. */
  releaseGas() {
    if (this.#system !== 'open' || !this.#reacted) return null;
    const molecule = this.#molecules.find(m => m.location === 'sample' && m.formula !== 'H₂O')
      || this.#molecules.find(m => m.location === 'sample');
    if (!molecule) return null;
    molecule.location = 'surroundings';
    return molecule.id;
  }

  reset() {
    this.#system = 'closed';
    return this.setAmounts(this.#hydrogen, this.#oxygen);
  }

  get state() {
    const extent = Math.min(Math.floor(this.#hydrogen / 2), this.#oxygen);
    const possibleWater = 2 * extent;
    const atoms = this.#molecules.flatMap(m => m.atoms);
    const sample = this.#molecules.filter(m => m.location === 'sample');
    const outside = this.#molecules.filter(m => m.location === 'surroundings');
    const moleculeCounts = {water: 0, hydrogen: 0, oxygen: 0};
    for (const m of this.#molecules) moleculeCounts[m.formula === 'H₂O' ? 'water' : m.formula === 'H₂' ? 'hydrogen' : 'oxygen'] += 1;
    return {
      hydrogen: this.#hydrogen, oxygen: this.#oxygen,
      reacted: this.#reacted, system: this.#system, extent, possibleWater,
      limiting: this.#hydrogen === 2 * this.#oxygen ? 'balanced' : this.#hydrogen < 2 * this.#oxygen ? 'hydrogen' : 'oxygen',
      counts: moleculeCounts,
      beforeAtoms: {H: this.#hydrogen * 2, O: this.#oxygen * 2},
      afterAtoms: {H: atoms.filter(a => a.element === 'H').length, O: atoms.filter(a => a.element === 'O').length},
      massBefore: this.#hydrogen * 2 + this.#oxygen * 32,
      sampleMass: sample.reduce((sum, m) => sum + mass(m), 0),
      surroundingsMass: outside.reduce((sum, m) => sum + mass(m), 0),
      totalMass: this.#molecules.reduce((sum, m) => sum + mass(m), 0),
      molecules: this.#molecules.map(m => ({...m, atoms: m.atoms.map(a => ({...a}))})),
    };
  }
}
