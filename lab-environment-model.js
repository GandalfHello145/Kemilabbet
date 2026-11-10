/** A deliberately fictional relative-mass transport model.
 * No parameter represents a real chemical or a real health-risk threshold.
 * Every transfer has a receiving compartment. Collection is not destruction.
 */
export const ENVIRONMENT_CONSTANTS=Object.freeze({initialMass:1000,waterVolume:100,organismMass:5,leachingPerMinute:.06,uptakePerMinute:.025,outflowPerMinute:.05,returnPerMinute:.012});
const C=ENVIRONMENT_CONSTANTS;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function finite(v,label){if(!Number.isFinite(v))throw new TypeError(label+' must be finite');return v;}
export class EnvironmentModel{
  constructor({emissionRate=8,prevention=0,treatment=0}={}){this.emissionRate=8;this.prevention=0;this.treatment=0;this.reset();this.configure({emissionRate,prevention,treatment});}
  configure({emissionRate=this.emissionRate,prevention=this.prevention,treatment=this.treatment}={}){
    finite(emissionRate,'emissionRate');finite(prevention,'prevention');finite(treatment,'treatment');
    this.emissionRate=clamp(emissionRate,0,20);this.prevention=clamp(prevention,0,1);this.treatment=clamp(treatment,0,1);
    return this.state;
  }
  reset(){this.source=C.initialMass;this.land=0;this.water=0;this.organisms=0;this.collected=0;this.outflow=0;this.released=0;this.timeMinutes=0;return this.state;}
  step(minutes){
    finite(minutes,'minutes');if(minutes<=0)return this.state;if(minutes>10000)throw new RangeError('Single step is limited to 10000 model minutes');
    // Fixed small internal steps keep all competing flows nonnegative.
    const n=Math.ceil(minutes/.025),h=minutes/n;
    for(let i=0;i<n;i++){
      const emitted=Math.min(this.source,this.emissionRate*(1-this.prevention)*h);
      this.source-=emitted;this.released+=emitted;this.collected+=emitted*this.treatment;this.land+=emitted*(1-this.treatment);
      const leached=this.land*(1-Math.exp(-C.leachingPerMinute*h));this.land-=leached;this.water+=leached;
      const waterLoss=this.water*(1-Math.exp(-(C.uptakePerMinute+C.outflowPerMinute)*h));
      const uptake=waterLoss*C.uptakePerMinute/(C.uptakePerMinute+C.outflowPerMinute);
      this.water-=waterLoss;this.organisms+=uptake;this.outflow+=waterLoss-uptake;
      const returned=this.organisms*(1-Math.exp(-C.returnPerMinute*h));this.organisms-=returned;this.water+=returned;
    }
    this.timeMinutes+=minutes;return this.state;
  }
  get state(){
    const total=this.source+this.land+this.water+this.organisms+this.collected+this.outflow;
    return Object.freeze({source:this.source,land:this.land,water:this.water,organisms:this.organisms,collected:this.collected,outflow:this.outflow,released:this.released,timeMinutes:this.timeMinutes,total,
      waterConcentration:this.water/C.waterVolume,organismConcentration:this.organisms/C.organismMass,emissionRate:this.emissionRate,prevention:this.prevention,treatment:this.treatment});
  }
}
