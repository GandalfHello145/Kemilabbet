import test from 'node:test';
import assert from 'node:assert/strict';
import {forceAt,potentialEnergy,createParticle,advanceParticle,particleEnergy,createExperiment,advanceExperiment,COUPLING} from './lab-models-model.js';
function finish(p){for(let i=0;i<12000&&!p.done;i++)advanceParticle(p,.02);assert.ok(p.done);return p;}
test('positive charge repels continuously, including through the diffuse Thomson interior',()=>{
 const a=forceAt('rutherford',40,1,0),b=forceAt('rutherford',40,2,0);
 assert.ok(a.x>0);assert.equal(a.y,0);assert.ok(Math.abs(a.x/b.x-4)<1e-12);
 assert.ok(forceAt('thomson',40,.1,0).x<forceAt('thomson',40,.2,0).x);
 assert.equal(forceAt('thomson',40,0,0).x,0);
});
test('Rutherford trajectories conserve energy and follow the Coulomb deflection relationship',()=>{
 for(const impact of [.25,.8,1.8]){
  const p=finish(createParticle({impact,charge:60,boundary:70}));
  assert.ok(Math.abs(particleEnergy(p)/p.initialEnergy-1)<.002);
  const expected=2*Math.atan(COUPLING*60/(impact*9))*180/Math.PI;
  assert.ok(Math.abs(p.angle-expected)<.6,`${impact}: ${p.angle} vs ${expected}`);
 }
});
test('nearer or more strongly charged nuclei bend the beam more',()=>{
 const near=finish(createParticle({impact:.2,charge:60}));
 const far=finish(createParticle({impact:1.6,charge:60}));
 const weak=finish(createParticle({impact:.2,charge:20}));
 assert.ok(near.angle>far.angle);assert.ok(near.angle>weak.angle);
});
test('head-on particles reverse before the singularity, without a collision boundary',()=>{
 const p=finish(createParticle({impact:0,charge:40}));
 assert.ok(p.vx<0);assert.ok(p.angle>179.9);assert.ok(p.path.every(point=>point.x<0));
 assert.ok(Math.abs(particleEnergy(p)/p.initialEnergy-1)<.002);
 const t=finish(createParticle({model:'thomson',impact:0,charge:40}));
 assert.ok(t.vx>0);assert.ok(t.angle<.001);
});
test('paired experiments use the same seeded incoming beam and count every result once',()=>{
 const a=createExperiment({seed:19,count:24}),b=createExperiment({seed:19,count:24}),c=createExperiment({seed:20,count:24});
 assert.deepEqual(a.impacts,b.impacts);assert.notDeepEqual(a.impacts,c.impacts);
 for(let i=0;i<1800;i++){if(advanceExperiment(a,1/60))break;}
 for(const result of Object.values(a.models)){
  assert.equal(result.completed,24);assert.equal(result.bins.reduce((x,y)=>x+y,0),24);
 }
 assert.deepEqual(a.models.thomson.particles.map(p=>p.path[0].y),a.models.rutherford.particles.map(p=>p.path[0].y));
 assert.ok(potentialEnergy('rutherford',40,.1,0)>potentialEnergy('thomson',40,.1,0));
});
