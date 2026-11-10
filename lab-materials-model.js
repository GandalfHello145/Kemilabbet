/** Qualitative tests of four defined, pure samples at room temperature.
 * 2 g sample in 100 mL deionized water, short observation, no heating.
 * Electrical outputs are qualitative instrument observations, not measured S/m.
 */
export const MATERIALS = Object.freeze({
  iron: Object.freeze({id:'iron',name:'Järn',symbol:'Fe',color:'#9cabb6',magnetic:true,dryConducts:true,dissolves:false,solutionConducts:null}),
  copper: Object.freeze({id:'copper',name:'Koppar',symbol:'Cu',color:'#d99265',magnetic:false,dryConducts:true,dissolves:false,solutionConducts:null}),
  salt: Object.freeze({id:'salt',name:'Koksalt',symbol:'NaCl',color:'#e8edf0',magnetic:false,dryConducts:false,dissolves:true,solutionConducts:true}),
  sugar: Object.freeze({id:'sugar',name:'Socker',symbol:'sackaros',color:'#f2ddb6',magnetic:false,dryConducts:false,dissolves:true,solutionConducts:false}),
});
export const TESTS = Object.freeze({
  magnet: Object.freeze({id:'magnet',name:'Magnet',short:'Magnet'}),
  dry: Object.freeze({id:'dry',name:'Leda ström som torrt prov',short:'Torrprov'}),
  dissolve: Object.freeze({id:'dissolve',name:'Lösa i vatten',short:'Upplösning'}),
  solution: Object.freeze({id:'solution',name:'Leda ström i lösning',short:'Lösning'}),
});
const ids=Object.keys(MATERIALS);
const assertMaterial=id=>{if(!MATERIALS[id])throw new RangeError('Unknown material');return MATERIALS[id];};
export function unknownForSeed(seed=1){
  if(!Number.isFinite(seed))throw new TypeError('seed must be finite');
  // A reproducible permutation of the four possible samples.
  return ids[((Math.trunc(seed)*3+1)%4+4)%4];
}
export function observeMaterial(id,test){
  const m=assertMaterial(id);
  if(!TESTS[test])throw new RangeError('Unknown test');
  if(test==='magnet')return Object.freeze({test,code:m.magnetic?'yes':'no',label:m.magnetic?'Dras tydligt till magneten':'Dras inte tydligt till en vanlig magnet',short:m.magnetic?'Ja':'Nej',
    explanation:m.magnetic?'Det rena järnprovet dras tydligt till en vanlig magnet. Provet är fortfarande järn.':'Det här provet dras inte tydligt till en vanlig magnet. Testet kan därför inte ensamt skilja koppar, salt och socker åt.'});
  if(test==='dry')return Object.freeze({test,code:m.dryConducts?'yes':'no',label:m.dryConducts?'Lampan lyser':'Lampan är släckt',short:m.dryConducts?'Leder':'Leder inte märkbart',
    explanation:m.dryConducts?'Metallen har rörliga elektroner som kan överföra laddning genom det fasta provet.':'I det torra provet finns inga laddningar som kan röra sig genom hela provet på det sätt som behövs här. Att något innehåller laddade delar räcker alltså inte.'});
  if(test==='dissolve')return Object.freeze({test,code:m.dissolves?'yes':'no',label:m.dissolves?'Provet löses upp':'Provet är kvar som fast ämne',short:m.dissolves?'Löses':'Kvar som fast prov',
    explanation:id==='salt'?'Natriumjoner och kloridjoner lämnar kristallen och sprids i vattnet. Jonerna finns kvar; upplöst betyder inte borta.':id==='sugar'?'Hela sackarosmolekyler skiljs från varandra och sprids i vattnet. Bindningarna inne i sockermolekylerna finns kvar.':'I det korta testet med vanligt vatten löses inte metallprovet märkbart upp. Vi modellerar inte långsam korrosion.'});
  if(!m.dissolves)return Object.freeze({test,code:'not-applicable',label:'Ingen lösning av provet att testa',short:'Inte jämförbart',
    explanation:'Metallbiten är kvar som ett fast prov. Här testar elektroderna bara vattnet runt den, utan att röra metallen. Det säger inget nytt om metallens egen ledningsförmåga.'});
  return Object.freeze({test,code:m.solutionConducts?'yes':'no',label:m.solutionConducts?'Lampan lyser i lösningen':'Lampan förblir släckt i modellen',short:m.solutionConducts?'Leder':'Leder inte märkbart',
    explanation:m.solutionConducts?'I saltlösningen kan både positiva natriumjoner och negativa kloridjoner röra sig och överföra laddning.':'Sackarosmolekylerna är neutrala. De ger inte en ström av rörliga joner som saltlösningen gör. Avjoniserat vatten och sockerlösning leder mycket svagt; lampan är släckt i detta enkla test.'});
}
export class MaterialsModel{
  constructor({sample='iron',seed=1}={}){this.seed=seed;this.reset(sample);}
  reset(sample=this.sample){if(sample!=='unknown')assertMaterial(sample);this.sample=sample;this.materialId=sample==='unknown'?unknownForSeed(this.seed):sample;this.evidence={};this.lastTest=null;this.revealed=false;return this.state;}
  choose(sample){return this.reset(sample);}
  newUnknown(){this.seed+=1;return this.reset('unknown');}
  test(test){const result=observeMaterial(this.materialId,test);this.evidence[test]=result;this.lastTest=test;return result;}
  guess(id){assertMaterial(id);const enoughEvidence=Object.keys(this.evidence).length>=2&&this.candidates.length===1;if(!enoughEvidence)return Object.freeze({correct:false,needsEvidence:true,actualId:null,candidates:this.candidates});const correct=id===this.materialId;if(correct)this.revealed=true;return Object.freeze({correct,needsEvidence:false,actualId:this.revealed?this.materialId:null,candidates:this.candidates});}
  get candidates(){return ids.filter(id=>Object.entries(this.evidence).every(([test,result])=>observeMaterial(id,test).code===result.code));}
  get state(){const hidden=this.sample==='unknown'&&!this.revealed;return Object.freeze({sample:this.sample,materialId:this.materialId,displayName:hidden?'Okänt prov':MATERIALS[this.materialId].name,hidden,revealed:this.revealed,lastTest:this.lastTest,evidence:Object.freeze({...this.evidence}),candidates:Object.freeze(this.candidates),seed:this.seed});}
}
