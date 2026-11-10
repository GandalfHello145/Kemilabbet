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

test('reference comparison interpolates matching times without extrapolation',async()=>{
 const {sampleEnvironmentReference,compareEnvironmentAtTime}=await import('./lab-environment-model.js');
 const history=[{timeMinutes:0,waterConcentration:0,organismConcentration:0},{timeMinutes:10,waterConcentration:2,organismConcentration:4}];
 close(sampleEnvironmentReference(history,5).waterConcentration,1);
 assert.equal(sampleEnvironmentReference(history,11),null);
 assert.equal(compareEnvironmentAtTime({timeMinutes:0,waterConcentration:0},history),null);
 close(compareEnvironmentAtTime({timeMinutes:5,waterConcentration:.25},history).reductionPercent,75);
});
test('an 80 percent source or collection measure cuts matched water exposure by 80 percent',async()=>{
 const {compareEnvironmentAtTime}=await import('./lab-environment-model.js');
 const base=new EnvironmentModel(),sealed=new EnvironmentModel({prevention:.8}),collected=new EnvironmentModel({treatment:.8});
 const ref=[base.state];for(let i=0;i<120;i++){base.step(.5);ref.push(base.state);}
 sealed.step(60);collected.step(60);
 close(compareEnvironmentAtTime(sealed.state,ref).reductionPercent,80,1e-7);
 close(compareEnvironmentAtTime(collected.state,ref).reductionPercent,80,1e-7);
 close(sealed.state.total,1000);close(collected.state.total,1000);
 assert.ok(sealed.state.source>collected.state.source);
 assert.ok(collected.state.collected>sealed.state.collected);
});

test('a zero-release experiment has no nonzero water reference to halve',async()=>{
 const {compareEnvironmentAtTime}=await import('./lab-environment-model.js');
 const m=new EnvironmentModel({emissionRate:0}),history=[m.state];m.step(10);history.push(m.state);
 assert.equal(m.state.waterConcentration,0);assert.equal(compareEnvironmentAtTime(m.state,history),null);
});
