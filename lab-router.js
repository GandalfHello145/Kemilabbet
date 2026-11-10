export const LABS = Object.freeze({
  1:{slug:'molekyler',title:'Molekylverkstaden',description:'Bygg molekyler och följ sambandet mellan atomer, atomslag och formler.',file:'lab-atoms.js'},
  2:{slug:'atommodeller',title:'Atomdetektiven',description:'Skicka alfapartiklar, jämför modeller och följ deras spår.',file:'lab-models.js'},
  3:{slug:'bindningar',title:'Bindningslabbet',description:'Följ elektroner och undersök joner och delade elektronpar.',file:'lab-bonds.js'},
  4:{slug:'reaktioner',title:'Reaktionslabbet',description:'Välj mängder och följ samma atomer före och efter en reaktion.',file:'lab-reactions.js'},
  5:{slug:'material',title:'Materialdetektiven',description:'Undersök okända prov och använd resultaten som ledtrådar.',file:'lab-materials.js'},
  6:{slug:'vatten',title:'Vattenlabbet',description:'Värm, kyl och följ molekylerna och temperaturkurvan.',file:'water-lab.js'},
  7:{slug:'miljo',title:'Miljölandskapet',description:'Följ ett ämnes spridning och pröva åtgärder vid källan och i vattnet.',file:'lab-environment.js'}
});
export function mountSubjectLab(host, number) {
  const info=LABS[number];if(!info)throw new RangeError('Unknown chemistry area');
  let inner=null,active=true,destroyed=false;
  host.dataset.texRendered='lab-slot';
  host.innerHTML='<div class="cl-loading" role="status">Öppnar '+info.title+'…</div>';
  import('./'+info.file+'?v=20261110-labs2').then(module=>{
    if(destroyed||!host.isConnected)return;
    inner=number===6?module.mountWaterLab(host):module.mountLab(host);
    inner?.setActive(active);
  }).catch(error=>{
    if(destroyed||!host.isConnected)return;
    console.error(error);
    host.innerHTML='<div class="cl-loading"><strong>Experimentet kunde inte öppnas.</strong><p>Ladda om sidan för att försöka igen. Ni kan också fortsätta med förklaringen och uppgifterna nedanför.</p></div>';
  });
  return {setActive(value){if(destroyed)return;active=Boolean(value);inner?.setActive(active);},destroy(){if(destroyed)return;destroyed=true;inner?.destroy();inner=null;}};
}
