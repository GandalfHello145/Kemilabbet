import test from 'node:test';
import assert from 'node:assert/strict';
import {ReactionsModel} from './lab-reactions-model.js';

test('all 81 count combinations conserve every atom identity and relative mass', () => {
  for (let hydrogen = 0; hydrogen <= 8; hydrogen += 1) for (let oxygen = 0; oxygen <= 8; oxygen += 1) {
    const model = new ReactionsModel({hydrogen, oxygen});
    const before = model.state;
    const ids = before.molecules.flatMap(m => m.atoms.map(a => a.id)).sort();
    const after = model.react();
    assert.equal(after.counts.water, 2 * Math.min(Math.floor(hydrogen / 2), oxygen));
    assert.equal(after.counts.hydrogen, hydrogen - after.counts.water);
    assert.equal(after.counts.oxygen, oxygen - after.counts.water / 2);
    assert.deepEqual(after.beforeAtoms, after.afterAtoms);
    assert.deepEqual(after.molecules.flatMap(m => m.atoms.map(a => a.id)).sort(), ids);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(after.totalMass, before.totalMass);
    assert.equal(after.totalMass, after.massBefore);
    assert.deepEqual(model.react(), after); // Clicking twice cannot manufacture water.
  }
});

test('limiting reactant and excess are distinct from balanced proportions', () => {
  assert.equal(new ReactionsModel({hydrogen: 2, oxygen: 3}).state.limiting, 'hydrogen');
  assert.equal(new ReactionsModel({hydrogen: 3, oxygen: 1}).state.limiting, 'oxygen');
  assert.equal(new ReactionsModel({hydrogen: 4, oxygen: 2}).state.limiting, 'balanced');
  const odd = new ReactionsModel({hydrogen: 1, oxygen: 8}).react();
  assert.equal(odd.counts.water, 0);
  assert.equal(odd.counts.hydrogen, 1);
});

test('opening and releasing changes the sample mass, never the whole overview', () => {
  const model = new ReactionsModel({hydrogen: 5, oxygen: 2});
  assert.equal(model.releaseGas(), null);
  model.react();
  assert.equal(model.releaseGas(), null); // closed
  model.setSystem('open');
  const total = model.state.totalMass;
  let released = 0;
  while (model.releaseGas()) {
    const s = model.state;
    released += 1;
    assert.equal(s.sampleMass + s.surroundingsMass, total);
    assert.equal(s.totalMass, total);
    assert.deepEqual(s.beforeAtoms, s.afterAtoms);
  }
  assert.equal(released, 5);
  assert.equal(model.state.sampleMass, 0);
  assert.equal(model.state.surroundingsMass, total);
  model.setSystem('closed');
  assert.equal(model.state.sampleMass, 0); // No teleporting molecules back in.
  assert.equal(model.releaseGas(), null);
});

test('count controls clamp to integers in 0–8 and invalid actions are atomic', () => {
  const model = new ReactionsModel({hydrogen: 10, oxygen: -2});
  assert.equal(model.state.hydrogen, 8);
  assert.equal(model.state.oxygen, 0);
  model.setAmounts(3.9, 2.9);
  assert.equal(model.state.hydrogen, 3);
  assert.equal(model.state.oxygen, 2);
  const initial = model.state;
  assert.throws(() => model.setAmounts(5, NaN));
  assert.throws(() => model.setSystem('vacuum'));
  assert.deepEqual(model.state, initial);
});

test('reset and returned snapshots cannot duplicate, lose, or mutate atoms', () => {
  const model = new ReactionsModel();
  model.react(); model.setSystem('open'); model.releaseGas();
  const s = model.reset();
  assert.equal(s.reacted, false);
  assert.equal(s.system, 'closed');
  assert.equal(s.surroundingsMass, 0);
  s.molecules[0].atoms[0].id = 'changed';
  assert.equal(model.state.molecules[0].atoms[0].id, 'H-0');
});
