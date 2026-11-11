import { environmentScenarios } from './environment-scenarios.js?v=20261111-clear8';
import { environmentImages } from './study-assets.js?v=20261111-clear8';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const simpleScenarios=[
 {title:'Spill följer med regnet',text:'Färg har spillts på marken. Regnet kan ta med ämnen till bäcken. Där kan fiskar få i sig ämnena.',question:'Följ den orange pilen. Hur kommer ämnet till bäcken?',alt:'Färgrester rinner med regnet genom en brunn och ett rör till en bäck med en fisk.'},
 {title:'Stoppa spill från början',text:'Locket är stängt. Burken står i en bricka som kan fånga upp spill. Då minskar risken att färgen når marken.',question:'Hur hjälper locket och brickan?',alt:'En person stänger locket på en färgburk. Burken står i en bricka som fångar upp spill.'},
 {title:'Lämna rester till insamling',text:'Färgrester lämnas till kommunens insamling för farligt avfall. Häll dem inte i avloppet. Fråga personalen om du är osäker.',question:'Varför är insamling bättre än att spola ner färgen?',alt:'En person lämnar färgrester till personal vid en återvinningscentral.'},
 {title:'Läs och planera',text:'Läs på burken före användning. Ta bara fram den färg som behövs. Då blir det mindre över och mindre som kan spillas.',question:'Vad kan personen göra innan målningen börjar?',alt:'En person läser färgburkens etikett och planerar hur mycket färg som ska användas.'}
];
const photoTexts=[
 {title:'En symbol varnar',observe:'Trädet och fisken i den röda ramen är en varningssymbol.',explain:'Symbolen visar att produkten kan skada miljön. Läs också texten på förpackningen.',question:'Vad behöver vi läsa, förutom symbolen?'},
 {title:'Allt i vatten syns inte',observe:'En person tar ett vattenprov.',explain:'Vatten kan innehålla lösta ämnen även när det ser klart ut. Ett prov kan undersökas i ett laboratorium.',question:'Kan ett foto visa allt som finns i vattnet?'},
 {title:'Ämnen kan följa maten',observe:'Pilarna visar vatten, små organismer, fisk och fågel.',explain:'Vissa ämnen kan stanna kvar i kroppen. Då kan de följa med när ett djur äter ett annat. Det gäller inte alla ämnen.',question:'Följ en pil. Vem äter vem?'},
 {title:'Rening sker i flera steg',observe:'Bilden visar bassänger i ett reningsverk.',explain:'Ett reningsverk tar bort många ämnen ur avloppsvatten. Alla ämnen försvinner inte. Därför ska farligt avfall samlas in.',question:'Varför ska vi inte hälla färg i avloppet?'},
 {title:'Samla in batterier',observe:'Batterierna har samlats för sig.',explain:'Då kan deras material tas om hand. Insamling minskar risken att ämnen hamnar i mark och vatten.',question:'Vilken del av spridningen kan insamling stoppa?'}
];
function scenarioCard(index){const item=simpleScenarios[index],row=Math.floor(index/2),col=index%2;return `<div class="scenario-window"><img src="${environmentScenarios.webImage}" alt="${esc(item.alt)}" style="left:${-col*100}%;top:${-row*100}%"></div><div class="scenario-copy"><h3>${index+1}. ${esc(item.title)}</h3><p data-read-block>${esc(item.text)}</p><p data-read-block><strong>Titta och förklara:</strong> ${esc(item.question)}</p></div>`;}

const sources = {
  1: [['American Chemical Society: atomer och deras delar', 'https://www.acs.org/middleschoolchemistry/lessonplans/chapter4/lesson1.html']],
  2: [['Institute of Physics: hur atommodellen utvecklades', 'https://spark.iop.org/collections/model-atom']],
  3: [['American Chemical Society: kemiska reaktioner', 'https://www.acs.org/middleschoolchemistry/lessonplans/chapter6/lesson1.html']],
  4: [['American Chemical Society: ämnen före och efter en reaktion', 'https://www.acs.org/middleschoolchemistry/lessonplans/chapter6/lesson1.html']],
  5: [['American Chemical Society: densitet', 'https://www.acs.org/middleschoolchemistry/lessonplans/chapter3/lesson1.html']],
  6: [['American Chemical Society: partikelmodellen och aggregationstillstånd', 'https://www.acs.org/middleschoolchemistry/lessonplans/chapter1.html']],
  7: [['Kemikalieinspektionen: miljömålet Giftfri miljö', 'https://www.kemi.se/om-kemikalieinspektionen/vart-uppdrag/giftfri-miljo'], ['Kemikalieinspektionen: fara, exponering och risk', 'https://www.kemi.se/prioguiden/prioritera']]
};

export function renderStudyGalleries(moduleId, {scenariosOnly=false, includeScenarios=true}={}) {
  const drawingSection = '';
  const scenarioSection = Number(moduleId) === 7 ? `<section class="environment-scenarios" data-focus-part aria-labelledby="scenario-title"><h2 id="scenario-title">Följ ett exempel med färg</h2><p data-read-block>Välj en bild i taget. Följ vad personen gör och vad som kan hända.</p><div class="scenario-choices" aria-label="Välj händelse">${simpleScenarios.map((item,i)=>`<button type="button" data-scenario="${i}" aria-pressed="${i===0}" aria-controls="scenario-picture">${i+1}. ${esc(item.title)}</button>`).join('')}</div><div id="scenario-picture" aria-live="polite">${scenarioCard(0)}</div><p class="picture-credit">Illustrationen är AI-genererad för det här läromedlet.</p><details class="hint"><summary>Källor till exemplet</summary><ul>${environmentScenarios.sources.map(source=>`<li><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.title)}</a></li>`).join('')}</ul></details></section>` : '';
  const photoSection = Number(moduleId) === 7 ? `<details class="learning-extra environment-gallery" data-focus-part><summary>Fler bilder från verkligheten</summary><p>Titta på en bild i taget. Beskriv först det du ser.</p>${environmentImages.map((item,index)=>{const text=photoTexts[index];return `<details class="environment-photo"><summary>${esc(text.title)}</summary><figure><img src="${esc(item.file)}" alt="${esc(item.alt)}" loading="lazy" decoding="async" style="width:100%;height:auto"><figcaption><p data-read-block><strong>Titta:</strong> ${esc(text.observe)}</p><p data-read-block>${esc(text.explain)}</p><p data-read-block>${esc(text.question)}</p><details><summary>Bildkälla och faktakälla</summary><p class="picture-credit">Bild: <a href="${esc(item.source)}" target="_blank" rel="noopener">${esc(item.author)}</a> · <a href="${esc(item.licenseUrl||item.source)}" target="_blank" rel="noopener">${esc(item.license)}</a>. ${esc(item.changes)}</p><p><a href="${esc(item.factSource)}" target="_blank" rel="noopener">${esc(item.factLabel)}</a></p></details></figcaption></figure></details>`;}).join('')}</details>` : '';
  const references = `<details class="hint study-references"><summary>Varifrån kommer faktan?</summary><ul>${(sources[moduleId] || []).map(([label,url]) => `<li><a href="${url}" target="_blank" rel="noopener">${esc(label)}</a></li>`).join('')}</ul></details>`;
  if(scenariosOnly)return scenarioSection;
  return drawingSection + (includeScenarios?scenarioSection:"") + photoSection + references;
}

export function connectStudyGalleries(player) {
  document.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>{
    const index=Number(button.dataset.scenario);document.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    document.querySelector('#scenario-picture').innerHTML=scenarioCard(index);
    window.dispatchEvent(new CustomEvent('chemistry:content'));
  }));
  document.querySelectorAll('[data-study-src]').forEach(button => {
    button.addEventListener('click', () => {
      player?.pause();
      const dialog = document.createElement('dialog');
      dialog.className = 'diagram-dialog study-dialog';
      dialog.setAttribute('aria-label', button.dataset.studyTitle);
      dialog.innerHTML = `<div class="diagram-dialog-heading"><h2>${esc(button.dataset.studyTitle)}</h2><button type="button" class="button small secondary">Stäng ×</button></div><img src="${esc(button.dataset.studySrc)}" alt="${esc(button.dataset.studyAlt)}">`;
      const close = () => { dialog.close(); dialog.remove(); button.focus(); };
      dialog.querySelector('button').addEventListener('click', close);
      dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
      document.body.append(dialog);
      dialog.showModal();
    });
  });
}
