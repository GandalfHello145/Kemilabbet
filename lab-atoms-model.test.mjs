import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorkspace, addAtom, bindAtoms, breakBond, removeAtom, moveComponent, describeWorkspace, snapCandidate, missionComplete } from './lab-atoms-model.js';
function water(s, x = 0) { const o = addAtom(s,'O',x,0), h1 = addAtom(s,'H',x+1,0), h2 = addAtom(s,'H',x-1,0); bindAtoms(s,o.id,h1.id); bindAtoms(s,o.id,h2.id); return [o,h1,h2]; }
test('nearby atoms remain unbound until the explicit bond operation', () => {
 const s=createWorkspace();addAtom(s,'H',0,0);addAtom(s,'H',0,0);
 assert.equal(describeWorkspace(s).moleculeCount,0);assert.equal(s.bonds.length,0);
});
test('water counts atoms and atom types independently, and is a pure compound',()=>{
 const s=createWorkspace();water(s);const d=describeWorkspace(s);
 assert.equal(d.atomCount,3);assert.equal(d.atomTypes,2);assert.equal(d.moleculeCount,1);
 assert.equal(d.formula,'H₂O');assert.equal(d.classification,'Rent ämne · kemisk förening');
});
test('valence prevents a third hydrogen on water and oxygen makes a double bond',()=>{
 const s=createWorkspace();const [o]=water(s);const h=addAtom(s,'H');
 assert.equal(bindAtoms(s,o.id,h.id).ok,false);
 const o1=addAtom(s,'O'),o2=addAtom(s,'O');assert.equal(bindAtoms(s,o1.id,o2.id).order,2);
 assert.equal(bindAtoms(s,o1.id,h.id).ok,false);
});
test('OH already counts as a molecule although it is not one of the three workshop targets',()=>{
 const s=createWorkspace(),o=addAtom(s,'O'),h=addAtom(s,'H');bindAtoms(s,o.id,h.id);
 const d=describeWorkspace(s);assert.equal(d.moleculeCount,1);assert.equal(d.targetMoleculeCount,0);
 assert.equal(d.classification,'Byggfas');assert.equal(d.atomCount,2);
});
test('two waters remain one substance; adding O2 produces a mixture',()=>{
 const s=createWorkspace();water(s);water(s,5);assert.equal(describeWorkspace(s).formula,'2 H₂O');
 assert.equal(describeWorkspace(s).classification,'Rent ämne · kemisk förening');
 const a=addAtom(s,'O'),b=addAtom(s,'O');bindAtoms(s,a.id,b.id);
 assert.equal(describeWorkspace(s).classification,'Blandning');assert.equal(describeWorkspace(s).moleculeCount,3);
});
test('moving a molecule preserves its bonds; breaking and deleting update composition',()=>{
 const s=createWorkspace();const [o,h1,h2]=water(s);moveComponent(s,o.id,7,4);
 assert.deepEqual([h1.x-o.x,h1.y-o.y],[1,0]);assert.equal(s.bonds.length,2);
 breakBond(s,o.id,h1.id);assert.equal(describeWorkspace(s).moleculeCount,1);
 assert.equal(describeWorkspace(s).targetMoleculeCount,0);
 removeAtom(s,h1.id);assert.equal(s.bonds.length,1);assert.equal(describeWorkspace(s).atomCount,2);
 assert.equal(bindAtoms(s,o.id,h2.id).ok,false);
});
test('snap preview finds an available external atom without silently changing chemistry',()=>{
 const s=createWorkspace(),o=addAtom(s,'O',0,0),h=addAtom(s,'H',70,0),extra=addAtom(s,'H',85,0);
 const preview=snapCandidate(s,h.id);assert.equal(preview.b,extra.id);
 assert.equal(s.bonds.length,0);bindAtoms(s,o.id,h.id);
 const groupPreview=snapCandidate(s,h.id);assert.equal(groupPreview.a,o.id);assert.equal(groupPreview.b,extra.id);
 bindAtoms(s,groupPreview.a,groupPreview.b);assert.equal(snapCandidate(s,h.id),null);
});
test('guided discoveries require actual bonds and distinguish quantity from substance count',()=>{
 const s=createWorkspace(),o=addAtom(s,'O'),h=addAtom(s,'H');bindAtoms(s,o.id,h.id);
 assert.equal(missionComplete(s,0),false);const second=addAtom(s,'H');bindAtoms(s,o.id,second.id);
 assert.equal(missionComplete(s,0),true);assert.equal(missionComplete(s,1),false);
 water(s,9);assert.equal(missionComplete(s,1),true);assert.equal(describeWorkspace(s).atomTypes,2);
 const a=addAtom(s,'O'),b=addAtom(s,'O');assert.equal(missionComplete(s,2),false);bindAtoms(s,a.id,b.id);
 assert.equal(missionComplete(s,2),true);assert.equal(describeWorkspace(s).atomTypes,2);
 assert.equal(describeWorkspace(s).moleculeCount,3);
});
