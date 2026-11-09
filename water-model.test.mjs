import test from 'node:test';
import assert from 'node:assert/strict';
import {WaterModel, energyForState, WATER_CONSTANTS as C, PHASES, MODEL_CARD} from './water-model.js';

const near = (actual, expected, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≉ ${expected}`);

function conservation(state) {
  const fractions = [state.iceFraction, state.liquidFraction, state.vaporFraction];
  for (const fraction of fractions) assert.ok(fraction >= 0 && fraction <= 1);
  near(fractions.reduce((sum, value) => sum + value, 0), 1, 1e-12);
  assert.ok(Number.isFinite(state.temperature) && Number.isFinite(state.energyJ));
  assert.ok(state.temperature >= -30 && state.temperature <= 120);
}

test('default sample is 50 g of liquid water at 20 °C', () => {
  const state = new WaterModel().state;
  near(state.massKg, 0.05);
  near(state.temperature, 20);
  near(state.energyJ, 20880);
  assert.equal(state.phase, PHASES.LIQUID);
  assert.equal(state.liquidFraction, 1);
  assert.equal(state.timeSeconds, 0);
});

test('one-phase heating obeys Q = m cp ΔT and scales with sample mass', () => {
  for (const massKg of [0.01, 0.05, 0.1]) {
    const model = new WaterModel({massKg});
    const energyBefore = model.state.energyJ;
    const result = model.step(10, 20);
    near(result.energyJ - energyBefore, 200);
    near(result.temperature, 20 + 200 / (massKg * C.cpLiquid));
    assert.equal(result.timeSeconds, 10);
    conservation(result);
  }
});

test('ice and vapor use their own constant heat capacities', () => {
  const ice = new WaterModel({initialPhase: 'solid', initialTemperature: -20});
  near(ice.step(1, 1050).temperature, -10);
  const vapor = new WaterModel({initialPhase: 'gas', initialTemperature: 110});
  near(vapor.step(1, 500).temperature, 115);
});

test('fusion plateau absorbs latent heat without changing 0 °C', () => {
  const model = new WaterModel({initialPhase: 'solid', initialTemperature: 0});
  const latentHeat = 0.05 * C.fusion;
  for (const fraction of [0.1, 0.25, 0.5, 0.9]) {
    model.reset({phase: 'solid', temperature: 0});
    const state = model.step(1, fraction * latentHeat);
    assert.equal(state.temperature, 0);
    assert.equal(state.phase, PHASES.MELTING);
    near(state.liquidFraction, fraction);
    near(state.iceFraction, 1 - fraction);
    assert.equal(state.vaporFraction, 0);
    conservation(state);
  }
  model.reset({phase: 'solid', temperature: 0});
  const melted = model.step(1, latentHeat);
  assert.equal(melted.phase, PHASES.LIQUID);
  assert.equal(melted.liquidFraction, 1);
  near(melted.temperature, 0);
});

test('boiling plateau converts mass to vapor while temperature stays 100 °C', () => {
  const model = new WaterModel({initialTemperature: 100});
  const latentHeat = 0.05 * C.vaporization;
  const start = model.state.energyJ;
  const state = model.step(1, latentHeat * 0.6);
  near(state.energyJ - start, latentHeat * 0.6);
  assert.equal(state.temperature, 100);
  assert.equal(state.phase, PHASES.BOILING);
  near(state.vaporFraction, 0.6);
  near(state.liquidFraction, 0.4);
  assert.equal(state.iceFraction, 0);
  conservation(state);
  const gas = model.step(1, latentHeat * 0.4);
  near(gas.temperature, 100);
  assert.equal(gas.phase, PHASES.GAS);
  assert.equal(gas.vaporFraction, 1);
});

test('cooling retraces both latent-heat plateaus with no hysteresis', () => {
  const model = new WaterModel({initialPhase: 'solid', initialTemperature: -10});
  const initial = model.state;
  const checkpoints = [];
  const increments = [1050, 8350, 8350, 10450, 10450, 56400, 56400, 1000];
  for (const energy of increments) checkpoints.push(model.step(1, energy));
  assert.equal(model.state.phase, 'gas');
  near(model.state.temperature, 110);
  for (let index = increments.length - 1; index >= 0; index -= 1) {
    const actual = model.step(1, -increments[index]);
    const expected = index === 0 ? initial : checkpoints[index - 1];
    for (const key of ['energyJ', 'temperature', 'iceFraction', 'liquidFraction', 'vaporFraction']) {
      near(actual[key], expected[key]);
    }
    assert.equal(actual.phase, expected.phase);
    conservation(actual);
  }
});

test('a large step crosses several phases with the same result as small steps', () => {
  const coarse = new WaterModel({initialPhase: 'solid', initialTemperature: -30});
  const fine = new WaterModel({initialPhase: 'solid', initialTemperature: -30});
  const power = 1000;
  coarse.step(80, power);
  for (let index = 0; index < 800; index += 1) fine.step(0.1, power);
  for (const key of ['energyJ', 'temperature', 'iceFraction', 'liquidFraction', 'vaporFraction']) {
    near(coarse.state[key], fine.state[key], 1e-7);
  }
  assert.equal(coarse.state.phase, PHASES.BOILING);
  conservation(coarse.state);
});

test('fractions conserve sample mass throughout a complete heating and cooling cycle', () => {
  const model = new WaterModel({initialPhase: 'solid', initialTemperature: -30});
  for (const power of [200, -200]) {
    for (let index = 0; index < 820; index += 1) {
      const state = model.step(1, power);
      conservation(state);
      near(state.massKg, 0.05);
      const phaseMass = state.massKg * (state.iceFraction + state.liquidFraction + state.vaporFraction);
      near(phaseMass, 0.05, 1e-12);
    }
  }
});

test('energy clamps at −30 °C and 120 °C without accumulating hidden heat', () => {
  const model = new WaterModel();
  const hot = model.step(1e6, 1e6);
  near(hot.temperature, 120);
  near(hot.energyJ, 152400);
  near(model.step(1, -100).temperature, 119);
  const cold = model.step(1e6, -1e6);
  near(cold.temperature, -30);
  near(cold.energyJ, -3150);
  near(model.step(1, 105).temperature, -29);
  conservation(model.state);
  // A fractional sample mass must not leak floating-point error past the bounds.
  const fractionalMass = new WaterModel({massKg: 1 / 3});
  assert.equal(fractionalMass.step(1e6, 1e6).temperature, 120);
  assert.equal(fractionalMass.step(1e6, -1e6).temperature, -30);
});

test('zero power preserves state; negative time is a no-op; reset clears time', () => {
  const model = new WaterModel({massKg: 0.1});
  const initial = model.state;
  const idle = model.step(15, 0);
  assert.equal(idle.energyJ, initial.energyJ);
  assert.equal(idle.timeSeconds, 15);
  assert.deepEqual(model.step(-10, 500), idle);
  const state = model.reset({temperature: -15, phase: PHASES.SOLID});
  assert.equal(state.timeSeconds, 0);
  assert.equal(state.massKg, 0.1);
  near(state.temperature, -15);
  assert.equal(state.phase, PHASES.SOLID);
  assert.equal(model.reset().temperature, 20);
});

test('pure-phase presets stay inside equilibrium temperature ranges', () => {
  near(energyForState({temperature: -100, phase: 'solid'}), -3150);
  near(energyForState({temperature: 10, phase: 'solid'}), 0);
  near(energyForState({temperature: -10, phase: 'liquid'}), 16700);
  near(energyForState({temperature: 200, phase: 'liquid'}), 37600);
  near(energyForState({temperature: 20, phase: 'gas'}), 150400);
  near(energyForState({temperature: 200, phase: 'gas'}), 152400);
});

test('bad inputs cannot corrupt a valid state; snapshots are immutable', () => {
  for (const massKg of [0, -1, Infinity, NaN]) assert.throws(() => new WaterModel({massKg}));
  const model = new WaterModel();
  const initial = model.state;
  for (const bad of [Infinity, -Infinity, NaN, '1']) {
    assert.throws(() => model.step(bad, 10));
    assert.throws(() => model.step(1, bad));
  }
  assert.throws(() => model.reset({phase: 'plasma'}));
  assert.throws(() => model.reset({temperature: NaN}));
  assert.deepEqual(model.state, initial);
  assert.throws(() => { initial.energyJ = 0; }, TypeError);
  assert.equal(MODEL_CARD.sources.length, 3);
});
