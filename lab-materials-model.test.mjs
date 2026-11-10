import test from 'node:test';
import assert from 'node:assert/strict';
import {MaterialsModel,observeMaterial,unknownForSeed,MATERIALS} from './lab-materials-model.js';
test('defined samples distinguish metal conduction from dissolved ions',()=>{
 assert.equal(observeMaterial('iron','magnet').code,'yes');
 assert.equal(observeMaterial('copper','magnet').code,'no');
 for(const id of ['iron','copper'])assert.equal(observeMaterial(id,'dry').code,'yes');
 for(const id of ['salt','sugar'])assert.equal(observeMaterial(id,'dry').code,'no');
 assert.equal(observeMaterial('salt','solution').code,'yes');
 assert.equal(observeMaterial('sugar','solution').code,'no');
});
test('a solid metal is not labelled a conducting solution',()=>{
 for(const id of ['iron','copper']){assert.equal(observeMaterial(id,'dissolve').code,'no');assert.equal(observeMaterial(id,'solution').code,'not-applicable');}
});
test('dissolving alone cannot distinguish the two soluble samples',()=>{
 const m=new MaterialsModel({sample:'salt'});m.test('dissolve');assert.deepEqual(m.candidates,['salt','sugar']);
 m.test('solution');assert.deepEqual(m.candidates,['salt']);
});
test('four observations identify each of the four samples',()=>{
 for(const id of Object.keys(MATERIALS)){const m=new MaterialsModel({sample:id});for(const t of ['magnet','dry','dissolve','solution'])m.test(t);assert.deepEqual(m.candidates,[id]);}
});
test('unknown selection is reproducible and stays hidden until correctly identified',()=>{
 assert.equal(unknownForSeed(12),unknownForSeed(12));
 const m=new MaterialsModel({sample:'unknown',seed:1});const id=m.state.materialId;
 assert.equal(m.state.hidden,true);
 const wrong=Object.keys(MATERIALS).find(x=>x!==id);
 assert.equal(m.guess(wrong).correct,false);assert.equal(m.state.hidden,true);
 assert.equal(m.guess(id).correct,true);assert.equal(m.state.hidden,false);
 const first=m.materialId;m.newUnknown();assert.notEqual(m.materialId,first);assert.deepEqual(m.state.evidence,{});
});
test('invalid samples and tests are rejected',()=>{
 assert.throws(()=>new MaterialsModel({sample:'gold'}));
 assert.throws(()=>observeMaterial('salt','taste'));
 assert.throws(()=>unknownForSeed(Infinity));
});
