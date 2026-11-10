/** Electron bookkeeping, not an atomic trajectory or reaction-mechanism model. */
export class BondsModel {
  #mode = 'ionic';
  #transferred = false;
  #shared = false;
  #overlap = 0;

  setMode(mode) {
    if (!['ionic', 'covalent'].includes(mode)) throw new RangeError('Unknown bond mode');
    this.#mode = mode;
    return this.state;
  }

  transfer(target = 'Cl') {
    if (!['Na', 'Cl'].includes(target)) throw new RangeError('Target must be Na or Cl');
    this.#transferred = target === 'Cl';
    return this.state;
  }

  share(value = true) {
    this.#shared = Boolean(value);
    this.#overlap = this.#shared ? 1 : 0;
    return this.state;
  }

  /** A lesson-view control, not a measured internuclear distance or bond energy. */
  setOverlap(value) {
    if (!Number.isFinite(value)) throw new TypeError('Overlap must be finite');
    this.#overlap = Math.max(0, Math.min(1, value));
    this.#shared = false;
    return this.state;
  }

  reset() {
    this.#transferred = false;
    this.#shared = false;
    this.#overlap = 0;
    return this.state;
  }

  get state() {
    const transferred = this.#transferred;
    return {
      mode: this.#mode,
      transferred,
      shared: this.#shared,
      sodium: {symbol: 'Na', protons: 11, electrons: transferred ? 10 : 11, charge: transferred ? 1 : 0},
      chlorine: {symbol: 'Cl', protons: 17, electrons: transferred ? 18 : 17, charge: transferred ? -1 : 0},
      ionic: {totalProtons: 28, totalElectrons: 28, totalCharge: 0, transferredElectronId: 'Na-outer-1'},
      hydrogen: {nuclei: 2, totalProtons: 2, totalElectrons: 2, totalCharge: 0,
        electronIds: ['H-left-electron', 'H-right-electron'], sharedPair: this.#shared, overlap: this.#overlap},
    };
  }
}
