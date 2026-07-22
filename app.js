const FILTER_LABELS = {
  auto: 'Auto', none: 'Ninguno', brightness: 'Brillo',
  warm: 'Cálido', cool: 'Frío', vintage: 'Vintage',
  vibrant: 'Vibrante', bw: 'B&N', soft: 'Suave',
};

const FILTER_CSS = {
  brightness: 'brightness(1.2) contrast(1.15)',
  warm: 'sepia(0.25) saturate(1.3) hue-rotate(-15deg) brightness(1.05)',
  cool: 'saturate(0.9) hue-rotate(25deg) brightness(1.05)',
  vintage: 'sepia(0.5) saturate(0.8) brightness(1.1) contrast(0.9)',
  vibrant: 'saturate(1.8) brightness(1.05)',
  bw: 'grayscale(1) brightness(1.1) contrast(1.1)',
  soft: 'brightness(1.1) contrast(0.95) saturate(0.9) blur(0.5px)',
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
  overlayPreview.innerHTML = `<img src="${state.overlay.dataUrl}" alt="overlay">`;
  $('#btnProcess').disabled = false;
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
  if (avgSat < 0.12) return 'vibrant';
  if (warmth > 0.15) return 'warm';
  if (warmth < -0.1) return 'cool';
  if (avgSat > 0.3 && avgBrightness > 0.6) return 'vintage';
  if (avgBrightness < 0.5) return 'soft';
  return 'none';
}

function composite(baseImg, overlayImg, opacity, filterType) {
  const canvas = document.createElement('canvas');
  const size = Math.min(baseImg.width, baseImg.height);
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');

  const baseOffsetX = (baseImg.width - size) / 2;
  const baseOffsetY = (baseImg.height - size) / 2;
  ctx.drawImage(baseImg, baseOffsetX, baseOffsetY, size, size, 0, 0, size, size);

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
    });
  }

  renderResultThumbs();
  progressContainer.hidden = true;
  hideStatus();
  $('#btnSaveZip').disabled = false;
  $('#btnSaveIndividual').disabled = false;
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
  const canvas = composite(result.baseImg, result.overlayImg, result.opacity, effective);
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
  const canvas = composite(result.baseImg, result.overlayImg, result.opacity, effective);
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

hideStatus();
