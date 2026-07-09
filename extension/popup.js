const DEFAULTS = {
  enabled: true,
  sourceLang: 'en',
  targetLang: 'it',
  provider: 'mymemory',
  overlayPosition: 'bottom',
  showOriginal: false,
  ttsEnabled: true,
  ttsRate: 1,
  ttsVolume: 1,
  pollMs: 450
};

const ids = Object.keys(DEFAULTS);
const $ = id => document.getElementById(id);

function readForm() {
  return {
    enabled: $('enabled').checked,
    sourceLang: $('sourceLang').value,
    targetLang: $('targetLang').value,
    provider: $('provider').value,
    overlayPosition: $('overlayPosition').value,
    showOriginal: $('showOriginal').checked,
    ttsEnabled: $('ttsEnabled').checked,
    ttsRate: Number($('ttsRate').value),
    ttsVolume: Number($('ttsVolume').value),
    pollMs: Number($('pollMs').value)
  };
}

function writeForm(settings) {
  $('enabled').checked = !!settings.enabled;
  $('sourceLang').value = settings.sourceLang || DEFAULTS.sourceLang;
  $('targetLang').value = settings.targetLang || DEFAULTS.targetLang;
  $('provider').value = settings.provider || DEFAULTS.provider;
  $('overlayPosition').value = settings.overlayPosition || DEFAULTS.overlayPosition;
  $('showOriginal').checked = !!settings.showOriginal;
  $('ttsEnabled').checked = settings.ttsEnabled !== false;
  $('ttsRate').value = String(settings.ttsRate || DEFAULTS.ttsRate);
  $('ttsVolume').value = String(settings.ttsVolume || DEFAULTS.ttsVolume);
  $('pollMs').value = String(settings.pollMs || DEFAULTS.pollMs);
}

async function activeYoutubeTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (!tab || !/^https:\/\/([\w-]+\.)?youtube\.com\//.test(tab.url || '')) return null;
  return tab;
}

async function sendToTab(type, settings) {
  const tab = await activeYoutubeTab();
  if (!tab) {
    $('status').textContent = 'Apri una scheda YouTube e ricarica il video.';
    return null;
  }
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type, settings });
    return response || { ok: true };
  } catch (err) {
    $('status').textContent = 'Ricarica la scheda YouTube e riprova.';
    return null;
  }
}

async function applyToTab(settings) {
  const response = await sendToTab('NPC_YT_SETTINGS', settings);
  if (response) $('status').textContent = response.voicesReady ? 'Applicato. Voce caricata.' : 'Applicato. Premi Test audio se non senti voce.';
}

async function save() {
  const settings = readForm();
  await chrome.storage.sync.set(settings);
  await applyToTab(settings);
}

async function testAudio() {
  const settings = { ...readForm(), ttsEnabled: true };
  $('ttsEnabled').checked = true;
  await chrome.storage.sync.set(settings);
  const response = await sendToTab('NPC_YT_TEST_AUDIO', settings);
  if (response) {
    $('status').textContent = response.speech ? 'Test audio inviato. Dovresti sentire la voce italiana.' : 'Questo browser non supporta speechSynthesis.';
  }
}

async function init() {
  const settings = await chrome.storage.sync.get(DEFAULTS);
  writeForm({ ...DEFAULTS, ...settings });
  $('save').addEventListener('click', save);
  $('testAudio').addEventListener('click', testAudio);
  for (const id of ids) {
    const el = $(id);
    if (!el || id === 'pollMs') continue;
    el.addEventListener('change', save);
  }
  $('pollMs').addEventListener('change', save);
}

init();
