(() => {
  'use strict';

  const DEFAULTS = {
    enabled: true,
    sourceLang: 'en',
    targetLang: 'it',
    provider: 'mymemory',
    overlayPosition: 'bottom',
    showOriginal: false,
    minChars: 2,
    pollMs: 450
  };

  let settings = { ...DEFAULTS };
  let lastCaption = '';
  let lastTranslation = '';
  let translating = false;
  let pollTimer = null;
  let cache = new Map();

  const CAPTION_SELECTORS = [
    '.ytp-caption-segment',
    '.caption-window .captions-text .caption-visual-line',
    '.ytp-caption-window-container .caption-visual-line',
    '.ytp-caption-window-container span',
    '.captions-text span'
  ];

  function normalize(text) {
    return String(text || '')
      .replace(/\s+/g, ' ')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .trim();
  }

  function uniqJoin(parts) {
    const out = [];
    for (const raw of parts) {
      const text = normalize(raw);
      if (!text) continue;
      if (out[out.length - 1] !== text) out.push(text);
    }
    return normalize(out.join(' '));
  }

  function readCaptionFromDom() {
    for (const selector of CAPTION_SELECTORS) {
      const nodes = [...document.querySelectorAll(selector)]
        .filter(node => node && node.offsetParent !== null)
        .map(node => node.textContent);
      const text = uniqJoin(nodes);
      if (text && text.length >= settings.minChars) return text;
    }
    return '';
  }

  function ensureOverlay() {
    let overlay = document.getElementById('npc-yt-translation-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'npc-yt-translation-overlay';
    overlay.innerHTML = `
      <div id="npc-yt-original"></div>
      <div id="npc-yt-italian">NPC Translator attivo</div>
      <div id="npc-yt-status">lettura sottotitoli YouTube...</div>
    `;
    document.documentElement.appendChild(overlay);
    injectStyle();
    return overlay;
  }

  function injectStyle() {
    if (document.getElementById('npc-yt-style')) return;
    const style = document.createElement('style');
    style.id = 'npc-yt-style';
    style.textContent = `
      #npc-yt-translation-overlay {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2147483647;
        width: min(86vw, 1180px);
        padding: 12px 18px;
        border-radius: 14px;
        background: linear-gradient(180deg, rgba(0,0,0,.18), rgba(0,0,0,.82));
        color: #fff;
        text-align: center;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        pointer-events: none;
        box-shadow: 0 16px 42px rgba(0,0,0,.38);
        backdrop-filter: blur(2px);
      }
      #npc-yt-translation-overlay.npc-bottom { bottom: 7.2vh; }
      #npc-yt-translation-overlay.npc-top { top: 8vh; }
      #npc-yt-original {
        display: none;
        margin-bottom: 6px;
        color: #d8b4fe;
        font-size: clamp(13px, 1.25vw, 18px);
        line-height: 1.25;
        text-shadow: 0 2px 8px #000;
      }
      #npc-yt-translation-overlay.npc-show-original #npc-yt-original { display: block; }
      #npc-yt-italian {
        color: #ffffff;
        font-size: clamp(20px, 2.4vw, 42px);
        font-weight: 900;
        line-height: 1.12;
        text-shadow: 0 3px 12px #000, 0 0 2px #000;
      }
      #npc-yt-status {
        margin-top: 5px;
        color: rgba(255,255,255,.58);
        font-size: 12px;
        font-weight: 700;
      }
      #npc-yt-translation-overlay.npc-hidden { display: none; }
    `;
    document.documentElement.appendChild(style);
  }

  function paintOverlay(original, translation, status = '') {
    const overlay = ensureOverlay();
    overlay.classList.toggle('npc-hidden', !settings.enabled);
    overlay.classList.toggle('npc-show-original', !!settings.showOriginal);
    overlay.classList.toggle('npc-bottom', settings.overlayPosition !== 'top');
    overlay.classList.toggle('npc-top', settings.overlayPosition === 'top');

    const originalEl = document.getElementById('npc-yt-original');
    const italianEl = document.getElementById('npc-yt-italian');
    const statusEl = document.getElementById('npc-yt-status');

    if (originalEl) originalEl.textContent = original || '';
    if (italianEl) italianEl.textContent = translation || 'In attesa dei sottotitoli...';
    if (statusEl) statusEl.textContent = status || 'NPC YouTube Caption Translator';
  }

  async function translate(text) {
    const clean = normalize(text);
    if (!clean) return '';
    const cacheKey = `${settings.provider}:${settings.sourceLang}:${settings.targetLang}:${clean}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    let translated = '';
    if (settings.sourceLang === settings.targetLang) {
      translated = clean;
    } else if (settings.provider === 'google') {
      translated = await translateGoogle(clean);
    } else if (settings.provider === 'lingva') {
      translated = await translateLingva(clean);
    } else {
      translated = await translateMyMemory(clean);
    }

    translated = normalize(translated) || clean;
    cache.set(cacheKey, translated);
    if (cache.size > 120) cache.delete(cache.keys().next().value);
    return translated;
  }

  async function fetchJson(url, ms = 8000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
      const res = await fetch(url, { signal: ctrl.signal, credentials: 'omit' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  async function translateMyMemory(text) {
    const src = settings.sourceLang === 'auto' ? 'en' : settings.sourceLang;
    const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + encodeURIComponent(src + '|' + settings.targetLang);
    const data = await fetchJson(url);
    return data?.responseData?.translatedText || text;
  }

  async function translateGoogle(text) {
    const src = settings.sourceLang === 'auto' ? 'auto' : settings.sourceLang;
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + encodeURIComponent(src) + '&tl=' + encodeURIComponent(settings.targetLang) + '&dt=t&q=' + encodeURIComponent(text);
    const data = await fetchJson(url);
    return Array.isArray(data?.[0]) ? data[0].map(part => part[0]).join('') : text;
  }

  async function translateLingva(text) {
    const src = settings.sourceLang === 'auto' ? 'en' : settings.sourceLang;
    const url = 'https://lingva.ml/api/v1/' + encodeURIComponent(src) + '/' + encodeURIComponent(settings.targetLang) + '/' + encodeURIComponent(text);
    const data = await fetchJson(url);
    return data?.translation || text;
  }

  async function processCaption(caption) {
    if (!settings.enabled || translating) return;
    const clean = normalize(caption);
    if (!clean || clean === lastCaption) return;

    lastCaption = clean;
    translating = true;
    paintOverlay(clean, lastTranslation || 'Traduzione...', 'traduzione in corso...');

    try {
      const translated = await translate(clean);
      lastTranslation = translated;
      paintOverlay(clean, translated, 'letto direttamente dal DOM YouTube');
    } catch (err) {
      paintOverlay(clean, lastTranslation || clean, 'provider non disponibile: ' + err.message);
    } finally {
      translating = false;
    }
  }

  function tick() {
    const caption = readCaptionFromDom();
    if (caption) processCaption(caption);
    else if (settings.enabled) paintOverlay('', lastTranslation, 'attendo sottotitoli YouTube visibili...');
  }

  function start() {
    stop();
    ensureOverlay();
    pollTimer = setInterval(tick, Number(settings.pollMs) || DEFAULTS.pollMs);
    tick();
  }

  function stop() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
  }

  async function loadSettings() {
    try {
      const stored = await chrome.storage.sync.get(DEFAULTS);
      settings = { ...DEFAULTS, ...stored };
    } catch (_) {
      settings = { ...DEFAULTS };
    }
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || message.type !== 'NPC_YT_SETTINGS') return;
    settings = { ...settings, ...message.settings };
    if (settings.enabled) start();
    else {
      stop();
      paintOverlay('', '', 'disattivato');
    }
    sendResponse({ ok: true, settings });
  });

  let lastUrl = location.href;
  const routeObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      lastCaption = '';
      lastTranslation = '';
      cache.clear();
      setTimeout(tick, 1200);
    }
  });

  async function boot() {
    await loadSettings();
    routeObserver.observe(document.documentElement, { childList: true, subtree: true });
    if (settings.enabled) start();
    else paintOverlay('', '', 'disattivato');
  }

  boot();
})();
