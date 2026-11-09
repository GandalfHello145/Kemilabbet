import { diagrams, environmentImages } from './study-assets.js?v=20261109-4';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const sources = {
  1: [['American Chemical Society: atomer och deras delar', 'https://www.acs.org/middleschoolchemistry/lessonplans/chapter4/lesson1.html']],
  2: [['Institute of Physics: hur atommodellen utvecklades', 'https://spark.iop.org/collections/model-atom']],
  3: [['American Chemical Society: kemiska reaktioner', 'https://www.acs.org/middleschoolchemistry/lessonplans/chapter6/lesson1.html']],
  4: [['American Chemical Society: ämnen före och efter en reaktion', 'https://www.acs.org/middleschoolchemistry/lessonplans/chapter6/lesson1.html']],
  5: [['American Chemical Society: densitet', 'https://www.acs.org/middleschoolchemistry/lessonplans/chapter3/lesson1.html']],
  6: [['American Chemical Society: partikelmodellen och aggregationstillstånd', 'https://www.acs.org/middleschoolchemistry/lessonplans/chapter1.html']],
  7: [['Kemikalieinspektionen: miljömålet Giftfri miljö', 'https://www.kemi.se/om-kemikalieinspektionen/vart-uppdrag/giftfri-miljo'], ['Kemikalieinspektionen: fara, exponering och risk', 'https://www.kemi.se/prioguiden/prioritera']]
};

export function renderStudyGalleries(moduleId) {
  const drawings = diagrams.filter(item => Number(item.module) === Number(moduleId));
  const drawingSection = drawings.length ? `<section class="study-gallery" aria-labelledby="study-gallery-title"><p class="margin-label">SE DELARNA OCH HELHETEN</p><h2 id="study-gallery-title">Ritningar att tänka med</h2><p class="gallery-intro">Följ en pil i taget. Använd färgerna och orden i bilden när ni förklarar sambanden för varandra.</p><div class="study-drawings">${drawings.map((item, index) => `<figure class="study-drawing"><div class="study-drawing-heading"><span class="drawing-index">${String(index + 1).padStart(2, '0')}</span><h3>${esc(item.title)}</h3><button type="button" class="text-button" data-study-src="${esc(item.file)}" data-study-alt="${esc(item.alt)}" data-study-title="${esc(item.title)}">Visa större ↗</button></div><img src="${esc(item.file)}" alt="${esc(item.alt)}" loading="lazy" decoding="async"><figcaption><p>${esc(item.caption)}</p><p class="picture-question"><strong>Förklara tillsammans:</strong> ${esc(item.question)}</p><a class="diagram-source" href="${esc(item.tex)}" download>Hämta ritningens TikZ-källa</a></figcaption></figure>`).join('')}</div></section>` : '';
  const photoSection = Number(moduleId) === 7 ? `<section class="environment-gallery" aria-labelledby="environment-gallery-title"><p class="margin-label">KEMI I VÄRLDEN OMKRING OSS</p><h2 id="environment-gallery-title">Förstå giftfri miljö med bilder</h2><p class="gallery-intro">Bilderna visar var ett ämne kan finnas, hur det kan spridas och hur vi kan hindra spridningen. Skilj på det ni ser i bilden och det ni behöver undersöka vidare.</p>${environmentImages.map((item,index) => `<figure class="environment-picture"><div class="environment-image-wrap"><img src="${esc(item.file)}" alt="${esc(item.alt)}" loading="lazy" decoding="async"><button type="button" class="picture-zoom" data-study-src="${esc(item.file)}" data-study-alt="${esc(item.alt)}" data-study-title="${esc(item.title)}" aria-label="Förstora bilden: ${esc(item.title)}">Visa större ↗</button></div><figcaption><span class="drawing-index">${String(index + 1).padStart(2,'0')}</span><h3>${esc(item.title)}</h3><p><strong>Titta:</strong> ${esc(item.observe)}</p><p>${esc(item.explain)}</p><p class="picture-question"><strong>Prata om:</strong> ${esc(item.question)}</p><p class="picture-credit">Bild: <a href="${esc(item.source)}" target="_blank" rel="noopener">${esc(item.author)}</a> · ${item.licenseUrl ? `<a href="${esc(item.licenseUrl)}" target="_blank" rel="noopener">${esc(item.license)}</a>` : esc(item.license)}. ${esc(item.changes)}</p><p class="fact-credit">Läs mer: <a href="${esc(item.factSource)}" target="_blank" rel="noopener">${esc(item.factLabel)}</a>.</p></figcaption></figure>`).join('')}</section>` : '';
  const references = `<details class="hint study-references"><summary>Källor och vidare läsning</summary><ul>${(sources[moduleId] || []).map(([label,url]) => `<li><a href="${url}" target="_blank" rel="noopener">${esc(label)}</a></li>`).join('')}</ul></details>`;
  return drawingSection + photoSection + references;
}

export function connectStudyGalleries(player) {
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
