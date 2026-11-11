export const LABS = Object.freeze({
  1:{slug:'molekyler',title:'Molekylverkstaden',description:'Sätt ihop atomer. Bygg vatten och se vad en molekyl är.',file:'lab-atoms.js'},
  2:{slug:'atommodeller',title:'Atomdetektiven',description:'Skicka en positiv partikel. Följ vägen och jämför två bilder av atomen.',file:'lab-models.js'},
  3:{slug:'bindningar',title:'Bindningslabbet',description:'Dela två elektroner och bygg en vätemolekyl. Prova sedan plus och minus.',file:'lab-bonds.js'},
  6:{slug:'vatten',title:'Vattenlabbet',description:'Följ vatten från is till vattenånga, steg för steg. Se molekylerna och temperaturkurvan tillsammans.',file:'water-lab.js'},
});
export function mountSubjectLab(host, number) {
  const info=LABS[number];if(!info)throw new RangeError('Unknown chemistry area');
  let inner=null,active=true,destroyed=false;
  host.dataset.texRendered='lab-slot';
  host.innerHTML='<div class="cl-loading" role="status">Öppnar '+info.title+'…</div>';
  import('./'+info.file+'?v=20261111-water2').then(module=>{
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
