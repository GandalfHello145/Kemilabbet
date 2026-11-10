import test from 'node:test';
import assert from 'node:assert/strict';
import {forceAt,potentialEnergy,createParticle,advanceParticle,particleEnergy,createExperiment,advanceExperiment,COUPLING,traceTrajectory,probeSummary,controlledCloserComparison,
 DETECTOR_STAGES,createDetectorLesson,observeDetectorLesson,nextDetectorStage,qualitativeScattering} from './lab-models-model.js';
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
test('the guided comparison requires a closer beam at the same charge, with a larger measured angle',()=>{
 const far={impact:1.2,charge:40,rutherford:traceTrajectory({charge:40,impact:1.2}).angle};
 const near={impact:.12,charge:40,rutherford:traceTrajectory({charge:40,impact:.12}).angle};
 assert.equal(controlledCloserComparison(far,near),true);
 assert.equal(controlledCloserComparison(far,{...near,charge:80}),false);
 assert.equal(controlledCloserComparison(far,{...near,impact:1.4}),false);
 assert.equal(controlledCloserComparison(far,{...near,rutherford:far.rutherford}),false);
});
test('slow playback changes observation time, not the resulting force-driven path',()=>{
 const a=createExperiment({count:1,impact:.12,spread:0}),b=createExperiment({count:1,impact:.12,spread:0});
 for(let i=0;i<5000;i++){if(advanceExperiment(a,1/60,{rate:.5}))break;}
 for(let i=0;i<5000;i++){if(advanceExperiment(b,1/60,{rate:2.2}))break;}
 const x=probeSummary(a),y=probeSummary(b);assert.ok(x&&y);
 assert.ok(Math.abs(x.rutherford-y.rutherford)<.05);assert.ok(Math.abs(x.thomson-y.thomson)<.05);
 assert.equal(probeSummary(createExperiment({count:1})),null);
});
test('the lesson reveals Thomson, then Rutherford, then the fair comparison only after observation',()=>{
 const lesson=createDetectorLesson(),e=createExperiment({count:1});
 assert.equal(DETECTOR_STAGES[lesson.stage].view,'thomson');assert.equal(nextDetectorStage(lesson),false);
 assert.equal(observeDetectorLesson(lesson,e),false);
 e.models.thomson.completed=1;
 assert.equal(observeDetectorLesson(lesson,e),true);assert.equal(lesson.stage,0);
 assert.equal(nextDetectorStage(lesson),true);assert.equal(DETECTOR_STAGES[lesson.stage].view,'rutherford');
 assert.equal(observeDetectorLesson(lesson,e),false);e.models.rutherford.completed=1;
 assert.equal(observeDetectorLesson(lesson,e),true);nextDetectorStage(lesson);
 assert.equal(DETECTOR_STAGES[lesson.stage].view,'rutherford');assert.equal(DETECTOR_STAGES[lesson.stage].count,80);
 assert.equal(observeDetectorLesson(lesson,e),false);
 const many=createExperiment({count:80});many.models.rutherford.completed=80;
 assert.equal(observeDetectorLesson(lesson,many),true);nextDetectorStage(lesson);
 assert.equal(DETECTOR_STAGES[lesson.stage].view,'both');
 e.models.thomson.completed=0;assert.equal(observeDetectorLesson(lesson,e),false);
 e.models.thomson.completed=1;assert.equal(observeDetectorLesson(lesson,e),true);assert.equal(nextDetectorStage(lesson),false);
});
test('the fixed observation supports the conclusion that most pass and a few return',()=>{
 const e=createExperiment({seed:20261111,charge:40,impact:1.2,count:80});
 for(let i=0;i<1800;i++){if(advanceExperiment(e,1/60))break;}
 const result=qualitativeScattering(e.models.rutherford);
 assert.equal(result.mostPass,true);assert.ok(result.strong>0);assert.ok(result.returned>0);
 assert.equal(result.passed+result.strong+result.returned,80);
});
