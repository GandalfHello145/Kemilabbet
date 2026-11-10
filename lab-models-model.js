/** Dimensionless positive-charge comparison. No hard-surface collisions. */
export const ATOM_RADIUS = 1.45;
export const COUPLING = 0.008;
export const ANGLE_BINS = Object.freeze([5, 20, 90, 180.0001]);
export function seededRandom(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(1664525,s)+1013904223)>>>0; return s / 4294967296; };
}
export function forceAt(model, charge, x, y) {
  const k = COUPLING * charge, r = Math.max(1e-10, Math.hypot(x,y));
  const factor = model === 'thomson' && r < ATOM_RADIUS ? k / ATOM_RADIUS ** 3 : k / r ** 3;
  return { x: factor*x, y: factor*y };
}
export function potentialEnergy(model, charge, x, y) {
  const k=COUPLING*charge,r=Math.max(1e-10,Math.hypot(x,y));
  return model === 'thomson' && r<ATOM_RADIUS ? k/(2*ATOM_RADIUS)*(3-r*r/ATOM_RADIUS**2) : k/r;
}
export function createParticle({ model='rutherford', charge=40, impact=1.2, id=0, boundary=8, speed=3 }={}) {
  const p={model,charge,id,boundary,x:-boundary,y:impact,vx:speed,vy:0,age:0,done:false,
    path:[{x:-boundary,y:impact}],sampleClock:0,angle:null};
  p.initialEnergy=0.5*speed*speed+potentialEnergy(model,charge,p.x,p.y);return p;
}
export function advanceParticle(p, seconds) {
  if(p.done)return;
  let left=Math.max(0,seconds);
  while(left>1e-9){
    const r=Math.max(.0001,Math.hypot(p.x,p.y)),v=Math.max(.01,Math.hypot(p.vx,p.vy));
    const h=Math.min(left,.012,.025*r/v,.025*Math.sqrt(r**3/Math.max(.001,COUPLING*p.charge)));
    const a=forceAt(p.model,p.charge,p.x,p.y);
    p.x+=p.vx*h+.5*a.x*h*h;p.y+=p.vy*h+.5*a.y*h*h;
    const b=forceAt(p.model,p.charge,p.x,p.y);
    p.vx+=.5*(a.x+b.x)*h;p.vy+=.5*(a.y+b.y)*h;p.age+=h;left-=h;p.sampleClock+=h;
    if(p.sampleClock>.028){p.path.push({x:p.x,y:p.y});p.sampleClock=0;}
    if(p.x>p.boundary||p.x<-p.boundary-.03||Math.abs(p.y)>p.boundary*.54||p.age>30){
      p.done=true;p.angle=Math.abs(Math.atan2(p.vy,p.vx))*180/Math.PI;
      p.path.push({x:p.x,y:p.y});return;
    }
  }
}
export function particleEnergy(p){return .5*(p.vx*p.vx+p.vy*p.vy)+potentialEnergy(p.model,p.charge,p.x,p.y);}
export function createExperiment({seed=20261111,charge=40,impact=1.2,count=80,spread=1.65}={}){
 const random=seededRandom(seed),impacts=Array.from({length:count},()=>impact+(random()*2-1)*spread);
 return {seed,charge,impact,count,impacts,clock:0,launched:0,models:{
  thomson:{particles:[],bins:[0,0,0,0],completed:0},rutherford:{particles:[],bins:[0,0,0,0],completed:0}}};
}
export function advanceExperiment(e,seconds,{rate=1.6,launchInterval=.055}={}){
 const dt=Math.max(0,Math.min(.12,seconds));e.clock+=dt;
 const target=Math.min(e.count,Math.floor(e.clock/Math.max(.001,launchInterval))+1);
 while(e.launched<target){
  for(const model of ['thomson','rutherford'])e.models[model].particles.push(createParticle({model,charge:e.charge,impact:e.impacts[e.launched],id:e.launched}));
  e.launched++;
 }
 for(const result of Object.values(e.models))for(const p of result.particles){
  if(p.done)continue;advanceParticle(p,dt*Math.max(0,rate));
  if(p.done){result.completed++;result.bins[ANGLE_BINS.findIndex(limit=>p.angle<limit)]++;}
 }
 return e.launched===e.count&&Object.values(e.models).every(r=>r.completed===e.count);
}
export function traceTrajectory(options={}) {
 const particle=createParticle(options);
 for(let i=0;i<2000&&!particle.done;i++)advanceParticle(particle,.02);
 return particle;
}
export function probeSummary(experiment) {
 if(experiment.count!==1||Object.values(experiment.models).some(r=>r.completed!==1))return null;
 return {impact:experiment.impact,charge:experiment.charge,
  rutherford:experiment.models.rutherford.particles[0].angle,
  thomson:experiment.models.thomson.particles[0].angle};
}
export function controlledCloserComparison(reference,probe) {
 return Boolean(reference&&probe&&reference.charge===probe.charge&&
  Math.abs(probe.impact)<Math.abs(reference.impact)*.65&&probe.rutherford>reference.rutherford+3);
}
