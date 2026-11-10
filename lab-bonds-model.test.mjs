import test from 'node:test';
import assert from 'node:assert/strict';
import {BondsModel} from './lab-bonds-model.js';

test('neutral atoms contain the same number of protons and electrons', () => {
  const {sodium, chlorine, ionic} = new BondsModel().state;
  assert.equal(sodium.protons, sodium.electrons);
  assert.equal(chlorine.protons, chlorine.electrons);
  assert.equal(ionic.totalProtons, 28);
  assert.equal(ionic.totalElectrons, 28);
  assert.equal(ionic.totalCharge, 0);
});

test('moving the outer electron changes charges but never nuclei or total electrons', () => {
  const model = new BondsModel();
  for (let i = 0; i < 20; i += 1) {
    let s = model.transfer('Cl');
    assert.deepEqual(s.sodium, {symbol: 'Na', protons: 11, electrons: 10, charge: 1});
    assert.deepEqual(s.chlorine, {symbol: 'Cl', protons: 17, electrons: 18, charge: -1});
    assert.equal(s.sodium.electrons + s.chlorine.electrons, 28);
    assert.equal(s.sodium.charge + s.chlorine.charge, 0);
    assert.deepEqual(model.transfer('Cl'), s); // No duplicated electrons.
    s = model.transfer('Na');
    assert.equal(s.sodium.charge, 0);
    assert.equal(s.chlorine.charge, 0);
    assert.equal(s.sodium.electrons + s.chlorine.electrons, 28);
  }
});

test('a shared pair still contains only two electrons and two protons', () => {
  const model = new BondsModel();
  model.setMode('covalent');
  for (const shared of [true, true, false, true, false]) {
    const state = model.share(shared);
    assert.equal(state.hydrogen.sharedPair, shared);
    assert.equal(state.hydrogen.totalElectrons, 2);
    assert.equal(state.hydrogen.totalProtons, 2);
    assert.equal(new Set(state.hydrogen.electronIds).size, 2);
    assert.equal(state.hydrogen.totalCharge, 0);
  }
});

test('mode changes and reset preserve the independent electron inventories', () => {
  const model = new BondsModel();
  model.transfer('Cl'); model.share(); model.setMode('covalent');
  let state = model.setMode('ionic');
  assert.equal(state.transferred, true);
  assert.equal(state.shared, true);
  state = model.reset();
  assert.equal(state.transferred, false);
  assert.equal(state.shared, false);
  assert.equal(state.ionic.totalElectrons, 28);
  assert.equal(state.hydrogen.totalElectrons, 2);
});

test('unsupported actions fail without corrupting the model', () => {
  const model = new BondsModel();
  const initial = model.state;
  assert.throws(() => model.transfer('O'));
  assert.throws(() => model.setMode('metallic'));
  assert.deepEqual(model.state, initial);
  const snapshot = model.state;
  snapshot.sodium.electrons = 999;
  assert.equal(model.state.sodium.electrons, 11);
});
