const DEFAULTS = {
  enabled: true,
  sourceLang: 'en',
  targetLang: 'it',
  provider: 'mymemory',
  overlayPosition: 'bottom',
  showOriginal: false,
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
  $('pollMs').value = String(settings.pollMs || DEFAULTS.pollMs);
}

async function activeYoutubeTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (!tab || !/^https:\/\/([\w-]+\.)?youtube\.com\//.test(tab.url || '')) return null;
  return tab;
}

async function applyToTab(settings) {
  const tab = await activeYoutubeTab();
  if (!tab) {
    $('status').textContent = 'Apri una scheda YouTube e ricarica il video.';
    return;
  }
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'NPC_YT_SETTINGS', settings });
    $('status').textContent = 'Applicato alla scheda YouTube.';
  } catch (err) {
    $('status').textContent = 'Ricarica la scheda YouTube e riprova.';
  }
}

async function save() {
  const settings = readForm();
  await chrome.storage.sync.set(settings);
  await applyToTab(settings);
}

async function init() {
  const settings = await chrome.storage.sync.get(DEFAULTS);
  writeForm({ ...DEFAULTS, ...settings });
  $('save').addEventListener('click', save);
  for (const id of ids) {
    const el = $(id);
    if (!el || id === 'pollMs') continue;
    el.addEventListener('change', save);
  }
  $('pollMs').addEventListener('change', save);
}

init();
