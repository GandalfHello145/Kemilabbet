import test from 'node:test';
import assert from 'node:assert/strict';
import {EnvironmentModel,ENVIRONMENT_CONSTANTS as C} from './lab-environment-model.js';
const close=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,a+' != '+b);
test('all relative mass is accounted for during a long run',()=>{
 const m=new EnvironmentModel();
 for(let i=0;i<500;i++){const s=m.step(.2);close(s.total,C.initialMass);for(const k of ['source','land','water','organisms','collected','outflow'])assert.ok(s[k]>=0);}
 assert.ok(m.state.organisms>0);assert.ok(m.state.outflow>0);
});
test('a fully sealed source prevents release without deleting material',()=>{
 const m=new EnvironmentModel({prevention:1});m.step(100);
 close(m.state.source,1000);close(m.state.released,0);close(m.state.total,1000);
});
test('complete collection diverts release into the collection compartment',()=>{
 const m=new EnvironmentModel({treatment:1});m.step(20);
 close(m.state.collected,m.state.released);close(m.state.land,0);close(m.state.water,0);close(m.state.organisms,0);close(m.state.total,1000);
});
test('source cannot emit more material than it contains',()=>{
 const m=new EnvironmentModel({emissionRate:20});m.step(500);
 close(m.state.source,0);close(m.state.released,1000);close(m.state.total,1000);
});
test('smaller time steps match an equivalent long integration',()=>{
 const a=new EnvironmentModel({prevention:.3,treatment:.4}),b=new EnvironmentModel({prevention:.3,treatment:.4});
 a.step(10);for(let i=0;i<100;i++)b.step(.1);
 for(const k of ['source','land','water','organisms','collected','outflow'])close(a.state[k],b.state[k],1e-6);
});
test('reset preserves selected measures and repeats the same experiment',()=>{
 const m=new EnvironmentModel({emissionRate:12,prevention:.2,treatment:.6});m.step(20);const old=m.state;
 m.reset();m.step(20);for(const k of ['source','water','organisms','collected'])close(m.state[k],old[k]);
});
test('both concentrations use fixed disclosed denominator',()=>{
 const m=new EnvironmentModel();m.step(20);
 close(m.state.waterConcentration,m.state.water/C.waterVolume);
 close(m.state.organismConcentration,m.state.organisms/C.organismMass);
});
test('invalid input cannot corrupt state and measures stay within bounds',()=>{
 const m=new EnvironmentModel();assert.throws(()=>m.step(NaN));assert.throws(()=>m.configure({treatment:Infinity}));
 m.configure({emissionRate:300,prevention:-2,treatment:5});
 assert.equal(m.emissionRate,20);assert.equal(m.prevention,0);assert.equal(m.treatment,1);close(m.state.total,1000);
});
