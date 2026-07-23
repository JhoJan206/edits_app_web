const FILTER_LABELS = {
  auto: 'Auto', none: 'Ninguno', brightness: 'Brillo',
  warm: 'Cálido', cool: 'Frío', vintage: 'Vintage',
  vibrant: 'Vibrante', bw: 'B&N', soft: 'Suave',
  drama: 'Drama', neon: 'Neón', retro: 'Retro',
  hdr: 'HDR', dreamy: 'Soñado',
};

const FILTER_CSS = {
  brightness: 'brightness(1.5) contrast(1.35) saturate(1.15)',
  warm: 'sepia(0.45) saturate(1.6) hue-rotate(-20deg) brightness(1.05) contrast(1.1)',
  cool: 'saturate(0.7) hue-rotate(35deg) brightness(1.1) contrast(1.25)',
  vintage: 'sepia(0.75) saturate(0.5) brightness(1.15) contrast(0.8)',
  vibrant: 'saturate(2.5) brightness(1.1) contrast(1.15)',
  bw: 'grayscale(1) brightness(1.15) contrast(1.4)',
  soft: 'brightness(1.15) contrast(0.85) saturate(0.8) blur(1px)',
  drama: 'contrast(1.7) saturate(1.5) brightness(0.85)',
  neon: 'hue-rotate(70deg) saturate(3) brightness(1.25) contrast(1.1)',
  retro: 'sepia(0.65) saturate(0.6) brightness(0.9) contrast(0.8) hue-rotate(-10deg)',
  hdr: 'contrast(1.8) saturate(1.6) brightness(1.2)',
  dreamy: 'brightness(1.25) contrast(0.8) saturate(1.15) blur(1.5px)',
};

const FILTER_ICONS = {
  auto: '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z" fill="currentColor"/></svg>',
  none: '<svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"/></svg>',
  brightness: '<svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  warm: '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 3c-1.5 3-5 4.5-5 8.5 0 2.76 2.24 5 5 5s5-2.24 5-5c0-4-3.5-5.5-5-8.5z" fill="currentColor"/></svg>',
  cool: '<svg viewBox="0 0 24 24" width="14" height="14"><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  vintage: '<svg viewBox="0 0 24 24" width="14" height="14"><rect x="3" y="7" width="18" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="13" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="13" r="1.5" fill="currentColor"/><rect x="5" y="8" width="3" height="2" rx="0.5" fill="currentColor"/></svg>',
  vibrant: '<svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="2 2"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
  bw: '<svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="9" fill="currentColor"/><path d="M12 3a9 9 0 0 1 0 18v-18z" fill="#222"/></svg>',
  soft: '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M18 10.5A4.5 4.5 0 0 0 13.5 6a5.5 5.5 0 0 0-5 3A3.5 3.5 0 0 0 6 16h11a4 4 0 0 0 1-7.5z" fill="currentColor"/></svg>',
  drama: '<svg viewBox="0 0 24 24" width="14" height="14"><polygon points="13,2 4,14 12,14 11,22 20,10 12,10" fill="currentColor"/></svg>',
  neon: '<svg viewBox="0 0 24 24" width="14" height="14"><polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="12,6 18,12 12,18 6,12" fill="currentColor" opacity="0.5"/></svg>',
  retro: '<svg viewBox="0 0 24 24" width="14" height="14"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="12" r="2.5" fill="currentColor"/><circle cx="16" cy="12" r="2.5" fill="currentColor"/><rect x="9.5" y="10.5" width="5" height="3" rx="0.5" fill="none" stroke="currentColor" stroke-width="1"/></svg>',
  hdr: '<svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  dreamy: '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z" fill="currentColor" opacity="0.7"/><circle cx="8" cy="6" r="1" fill="currentColor" opacity="0.4"/><circle cx="18" cy="7" r="0.8" fill="currentColor" opacity="0.3"/><circle cx="7" cy="17" r="0.6" fill="currentColor" opacity="0.4"/></svg>',
};

const state = {
  images: [],
  overlay: null,
  results: [],
  editingIndex: -1,
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const stepImages = $('#step-images');
const stepOverlay = $('#step-overlay');
const stepResults = $('#step-results');
const imageThumbs = $('#imageThumbs');
const overlayPreview = $('#overlayPreview');
const resultThumbs = $('#resultThumbs');
const progressContainer = $('#progressContainer');
const progressBarFill = $('#progressBarFill');
const progressText = $('#progressText');
const statusBar = $('#statusBar');
const statusText = $('#statusText');
const resultsGrid = $('#resultsGrid');
const resultEditor = $('#resultEditor');
const editorPreview = $('#editorPreview');
const opacitySlider = $('#opacitySlider');
const opacityValue = $('#opacityValue');
const editorAutoOpacity = $('#editorAutoOpacity');
const filterGrid = $('#filterGrid');
const filterAutoInfo = $('#filterAutoInfo');


function showStep(id) {
  $$('.step').forEach(el => el.classList.remove('active'));
  if (id === 'images') stepImages.classList.add('active');
  if (id === 'overlay') stepOverlay.classList.add('active');
  if (id === 'results') stepResults.classList.add('active');
}

function setStatus(msg) {
  statusBar.hidden = false;
  statusText.textContent = msg;
}

function hideStatus() {
  statusBar.hidden = true;
}

function loadImageFromFile(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => resolve({ file, dataUrl: reader.result, image: img });
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handleImageFiles(files) {
  const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
  if (valid.length === 0) return;

  for (const file of valid) {
    const loaded = await loadImageFromFile(file);
    state.images.push(loaded);
  }
  renderImageThumbs();
  updateImageButton();
}

function renderImageThumbs() {
  imageThumbs.innerHTML = state.images.map((item, i) => `
    <div class="thumb">
      <img src="${item.dataUrl}" alt="img ${i + 1}">
      <button class="remove-btn" data-index="${i}">&times;</button>
    </div>
  `).join('');

  imageThumbs.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.images.splice(parseInt(btn.dataset.index), 1);
      renderImageThumbs();
      updateImageButton();
    });
  });
}

function updateImageButton() {
  $('#btnNextOverlay').disabled = state.images.length === 0;
}

async function handleOverlayFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  state.overlay = await loadImageFromFile(file);
  overlayPreview.innerHTML = `
    <div style="position:relative;display:inline-block">
      <img src="${state.overlay.dataUrl}" alt="overlay">
      <button class="remove-btn" id="removeOverlayBtn">&times;</button>
    </div>`;
  $('#btnProcess').disabled = false;
  $('#removeOverlayBtn').addEventListener('click', removeOverlay);
}

function removeOverlay() {
  state.overlay = null;
  overlayPreview.innerHTML = '';
  $('#btnProcess').disabled = true;
}

function cropToSquare(img) {
  const canvas = document.createElement('canvas');
  const size = Math.min(img.width, img.height);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, -(img.width - size) / 2, -(img.height - size) / 2);
  return canvas;
}

function calculateOpacity(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const totalPixels = canvas.width * canvas.height;

  let totalLuminance = 0;
  let totalSquared = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    totalLuminance += lum;
    totalSquared += lum * lum;
  }

  const mean = totalLuminance / totalPixels;
  const variance = (totalSquared / totalPixels) - (mean * mean);
  const stdDev = Math.sqrt(variance);

  const brightness = mean / 255;
  const contrast = stdDev / 255;

  let opacity = 0.30 + (1.0 - brightness) * 0.3;
  opacity -= contrast * 0.25;
  return Math.min(0.60, Math.max(0.30, opacity));
}

function applyFilterToCanvas(canvas, width, height, filterType) {
  if (!filterType || filterType === 'none') return;

  const cssFilter = FILTER_CSS[filterType];
  if (!cssFilter) return;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, 0, 0);

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  ctx.filter = cssFilter;
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.filter = 'none';
}

function detectBestFilter(baseImg) {
  const size = Math.min(baseImg.width, baseImg.height);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const ox = (baseImg.width - size) / 2;
  const oy = (baseImg.height - size) / 2;
  ctx.drawImage(baseImg, ox, oy, size, size, 0, 0, size, size);

  const data = ctx.getImageData(0, 0, size, size).data;
  let totalR = 0, totalG = 0, totalB = 0, totalSat = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    totalR += r; totalG += g; totalB += b;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    totalSat += lum > 0 ? (max - min) / lum : 0;
  }

  const n = data.length / 4;
  const avgR = totalR / n, avgG = totalG / n, avgB = totalB / n;
  const avgSat = totalSat / n;
  const avgBrightness = (0.299 * avgR + 0.587 * avgG + 0.114 * avgB) / 255;
  const warmth = (avgR - avgB) / 255;

  if (avgBrightness < 0.3) return 'brightness';
  if (avgSat < 0.08) return 'neon';
  if (avgSat < 0.12) return 'drama';
  if (warmth > 0.15) return 'warm';
  if (warmth < -0.1) return 'cool';
  if (avgSat > 0.3 && avgBrightness > 0.6) return 'vintage';
  if (avgSat > 0.25 && avgBrightness > 0.65) return 'hdr';
  if (avgBrightness < 0.5) return 'soft';
  if (avgBrightness > 0.7 && avgSat < 0.2) return 'dreamy';
  if (warmth > 0.05 && avgSat < 0.2) return 'retro';
  return 'none';
}

function composite(baseImg, overlayImg, opacity, filterType, panX = 0, panY = 0) {
  const size = Math.min(baseImg.width, baseImg.height);
  const maxPanX = Math.max(0, (baseImg.width - size) / 2);
  const maxPanY = Math.max(0, (baseImg.height - size) / 2);
  const offsetX = maxPanX * (1 + panX);
  const offsetY = maxPanY * (1 + panY);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(baseImg, offsetX, offsetY, size, size, 0, 0, size, size);

  applyFilterToCanvas(canvas, size, size, filterType || 'none');

  const overSize = Math.min(overlayImg.width, overlayImg.height);
  const overOffsetX = (overlayImg.width - overSize) / 2;
  const overOffsetY = (overlayImg.height - overSize) / 2;
  ctx.globalAlpha = opacity;
  ctx.drawImage(overlayImg, overOffsetX, overOffsetY, overSize, overSize, 0, 0, size, size);
  ctx.globalAlpha = 1.0;

  return canvas;
}

async function processAll() {
  if (state.images.length === 0 || !state.overlay) return;

  showStep('results');
  resultsGrid.hidden = false;
  resultEditor.hidden = true;
  state.editingIndex = -1;
  progressContainer.hidden = false;
  resultThumbs.innerHTML = '';
  state.results = [];
  $('#btnSaveZip').disabled = true;
  $('#btnSaveIndividual').disabled = true;

  for (let i = 0; i < state.images.length; i++) {
    const item = state.images[i];
    const pct = ((i + 1) / state.images.length) * 100;
    progressBarFill.style.width = pct + '%';
    progressText.textContent = `${i + 1} / ${state.images.length}`;
    setStatus(`Procesando ${i + 1} de ${state.images.length}...`);

    await new Promise(r => setTimeout(r, 0));

    const autoFilter = detectBestFilter(item.image);
    const opacity = calculateOpacity(item.image);
    const resultCanvas = composite(item.image, state.overlay.image, opacity, 'none');

    const blob = await new Promise(resolve => resultCanvas.toBlob(resolve, 'image/png'));
    const buffer = await blob.arrayBuffer();
    const dataUrl = resultCanvas.toDataURL('image/png');

    state.results.push({
      dataUrl,
      buffer,
      name: item.file.name.replace(/\.[^.]+$/, ''),
      baseImg: item.image,
      overlayImg: state.overlay.image,
      opacity,
      filter: 'none',
      autoFilter,
      panX: 0,
      panY: 0,
    });
  }

  renderResultThumbs();
  progressContainer.hidden = true;
  hideStatus();
  $('#btnSaveZip').disabled = false;
  $('#btnSaveIndividual').disabled = false;
}

function resetToStep1() {
  state.images = [];
  state.overlay = null;
  state.results = [];
  state.editingIndex = -1;
  imageThumbs.innerHTML = '';
  overlayPreview.innerHTML = '';
  resultThumbs.innerHTML = '';
  updateImageButton();
  $('#btnProcess').disabled = true;
  showStep('images');
  hideStatus();
  progressContainer.hidden = true;
  resultsGrid.hidden = false;
  resultEditor.hidden = true;
}

function getEffectiveFilter(result) {
  return result.filter === 'auto' ? result.autoFilter : result.filter;
}

function openEditor(index) {
  state.editingIndex = index;
  const result = state.results[index];

  resultsGrid.hidden = true;
  resultEditor.hidden = false;

  const pct = Math.round(result.opacity * 100);
  opacitySlider.value = pct;
  opacityValue.textContent = pct + '%';
  editorAutoOpacity.textContent = Math.round(result.opacity * 100) + '%';

  const autoLabel = FILTER_LABELS[result.autoFilter] || result.autoFilter;
  filterAutoInfo.textContent = 'Auto detectado: ' + autoLabel;

  updateFilterUI(result.filter);

  const size = Math.min(result.baseImg.width, result.baseImg.height);
  const maxPanX = Math.max(0, (result.baseImg.width - size) / 2);
  const maxPanY = Math.max(0, (result.baseImg.height - size) / 2);
  const canDrag = maxPanX > 0 || maxPanY > 0;
  editorPreview.classList.toggle('draggable', canDrag);
  dragHint.hidden = !canDrag;

  renderEditorPreview(result);
}

async function closeEditor() {
  await applyEditorChanges();
  resultEditor.hidden = true;
  resultsGrid.hidden = false;
  state.editingIndex = -1;
  renderResultThumbs();
}

function renderEditorPreview(result) {
  const effective = getEffectiveFilter(result);
  const canvas = composite(result.baseImg, result.overlayImg, result.opacity, effective, result.panX || 0, result.panY || 0);
  const dataUrl = canvas.toDataURL('image/png');
  editorPreview.innerHTML = `<img src="${dataUrl}" alt="preview">`;
}

function updateOpacityFromSlider() {
  const index = state.editingIndex;
  if (index === -1) return;
  const pct = parseInt(opacitySlider.value);
  state.results[index].opacity = pct / 100;
  opacityValue.textContent = pct + '%';
  renderEditorPreview(state.results[index]);
}

function selectFilter(filterType) {
  const index = state.editingIndex;
  if (index === -1) return;
  state.results[index].filter = filterType;
  updateFilterUI(filterType);
  renderEditorPreview(state.results[index]);
}

function updateFilterUI(selected) {
  filterGrid.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.filter === selected);
  });
}

async function applyEditorChanges() {
  const index = state.editingIndex;
  if (index === -1) return;

  const result = state.results[index];
  const effective = getEffectiveFilter(result);
  const canvas = composite(result.baseImg, result.overlayImg, result.opacity, effective, result.panX || 0, result.panY || 0);
  const dataUrl = canvas.toDataURL('image/png');

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  result.dataUrl = dataUrl;
  result.buffer = await blob.arrayBuffer();
}

function renderResultThumbs() {
  resultThumbs.innerHTML = state.results.map((r, i) => `
    <div class="thumb clickable" data-index="${i}">
      <img src="${r.dataUrl}" alt="result ${i + 1}">
      <div class="thumb-badge">${Math.round(r.opacity * 100)}%</div>
      <div class="thumb-filter-badge">${FILTER_LABELS[r.filter === 'auto' ? r.autoFilter : r.filter]}</div>
      <button class="thumb-download" data-index="${i}">Descargar</button>
    </div>
  `).join('');

  resultThumbs.querySelectorAll('.thumb.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.thumb-download')) return;
      openEditor(parseInt(el.dataset.index));
    });
  });

  resultThumbs.querySelectorAll('.thumb-download').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadIndividual(parseInt(btn.dataset.index));
    });
  });
}

function renderFilterGrid() {
  const order = ['auto', 'none', 'brightness', 'warm', 'cool', 'vintage', 'vibrant', 'bw', 'soft', 'drama', 'neon', 'retro', 'hdr', 'dreamy'];
  filterGrid.innerHTML = order.map(key => `
    <button class="filter-btn" data-filter="${key}">
      ${FILTER_ICONS[key] || ''} ${FILTER_LABELS[key]}
    </button>
  `).join('');
}

function downloadIndividual(index) {
  const result = state.results[index];
  const blob = new Blob([result.buffer], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = result.name + '_edit.png';
  a.click();
  URL.revokeObjectURL(url);
  setStatus('Imagen descargada');
  setTimeout(hideStatus, 2000);
}

async function downloadAllAsZip() {
  if (state.results.length === 0) return;

  if (typeof JSZip === 'undefined') {
    setStatus('Cargando JSZip...');
    return;
  }

  setStatus('Generando ZIP...');
  $('#btnSaveZip').disabled = true;

  try {
    const zip = new JSZip();
    for (let i = 0; i < state.results.length; i++) {
      const r = state.results[i];
      zip.file(r.name + '_edit.png', r.buffer, { binary: true });
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edits_app_resultados.zip';
    a.click();
    URL.revokeObjectURL(url);

    setStatus(`✓ ZIP con ${state.results.length} imágenes descargado`);
    $('#btnSaveZip').disabled = false;
    setTimeout(hideStatus, 3000);
  } catch (err) {
    setStatus('Error al generar ZIP: ' + err.message);
    $('#btnSaveZip').disabled = false;
  }
}

function downloadAllIndividual() {
  for (let i = 0; i < state.results.length; i++) {
    const result = state.results[i];
    const blob = new Blob([result.buffer], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.name + '_edit.png';
    a.click();
    URL.revokeObjectURL(url);
  }
  setStatus(`${state.results.length} imágenes descargadas`);
  setTimeout(hideStatus, 3000);
}

$('#btnSelectImages').addEventListener('click', () => $('#imageFiles').click());
$('#dropZoneImages').addEventListener('click', () => $('#imageFiles').click());
$('#imageFiles').addEventListener('change', (e) => {
  handleImageFiles(e.target.files);
  e.target.value = '';
});

$('#dropZoneImages').addEventListener('dragover', (e) => {
  e.preventDefault();
  e.currentTarget.classList.add('dragover');
});
$('#dropZoneImages').addEventListener('dragleave', (e) => {
  e.currentTarget.classList.remove('dragover');
});
$('#dropZoneImages').addEventListener('drop', (e) => {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  handleImageFiles(e.dataTransfer.files);
});

$('#btnSelectOverlay').addEventListener('click', () => $('#overlayFile').click());
$('#dropZoneOverlay').addEventListener('click', () => $('#overlayFile').click());
$('#overlayFile').addEventListener('change', (e) => {
  if (e.target.files[0]) handleOverlayFile(e.target.files[0]);
  e.target.value = '';
});

$('#btnNextOverlay').addEventListener('click', () => {
  if (state.images.length > 0) showStep('overlay');
});
$('#btnBackImages').addEventListener('click', () => showStep('images'));
$('#btnBackOverlay').addEventListener('click', () => showStep('overlay'));
$('#btnProcess').addEventListener('click', processAll);
$('#btnSaveZip').addEventListener('click', downloadAllAsZip);
$('#btnSaveIndividual').addEventListener('click', downloadAllIndividual);
$('#btnBackGrid').addEventListener('click', closeEditor);
$('#btnDownloadOne').addEventListener('click', () => {
  if (state.editingIndex !== -1) downloadIndividual(state.editingIndex);
});
opacitySlider.addEventListener('input', updateOpacityFromSlider);
filterGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (btn) selectFilter(btn.dataset.filter);
});

$('#btnReset').addEventListener('click', resetToStep1);

const dragHint = $('#dragHint');

function tryStartDrag(clientX, clientY) {
  if (state.editingIndex === -1) return false;
  const result = state.results[state.editingIndex];
  const size = Math.min(result.baseImg.width, result.baseImg.height);
  const maxPanX = Math.max(0, (result.baseImg.width - size) / 2);
  const maxPanY = Math.max(0, (result.baseImg.height - size) / 2);
  if (maxPanX === 0 && maxPanY === 0) return false;

  isDragging = true;
  dragStartX = clientX;
  dragStartY = clientY;
  dragPanX = result.panX || 0;
  dragPanY = result.panY || 0;
  return true;
}

function tryMoveDrag(clientX, clientY) {
  if (!isDragging || state.editingIndex === -1) return;
  const result = state.results[state.editingIndex];
  const size = Math.min(result.baseImg.width, result.baseImg.height);
  const maxPanX = Math.max(0, (result.baseImg.width - size) / 2);
  const maxPanY = Math.max(0, (result.baseImg.height - size) / 2);

  const dx = clientX - dragStartX;
  const dy = clientY - dragStartY;

  if (maxPanX > 0) result.panX = Math.max(-1, Math.min(1, dragPanX - dx / maxPanX));
  if (maxPanY > 0) result.panY = Math.max(-1, Math.min(1, dragPanY - dy / maxPanY));

  renderEditorPreview(result);
}

function tryEndDrag() {
  isDragging = false;
}

let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let dragPanX = 0, dragPanY = 0;

editorPreview.addEventListener('mousedown', (e) => {
  if (tryStartDrag(e.clientX, e.clientY)) e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  tryMoveDrag(e.clientX, e.clientY);
});

document.addEventListener('mouseup', tryEndDrag);

editorPreview.addEventListener('touchstart', (e) => {
  if (tryStartDrag(e.touches[0].clientX, e.touches[0].clientY)) e.preventDefault();
}, { passive: false });

editorPreview.addEventListener('touchmove', (e) => {
  tryMoveDrag(e.touches[0].clientX, e.touches[0].clientY);
  if (isDragging) e.preventDefault();
}, { passive: false });

editorPreview.addEventListener('touchend', tryEndDrag);

renderFilterGrid();
hideStatus();
