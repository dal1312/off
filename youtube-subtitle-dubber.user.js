// ==UserScript==
// @name         NPC YouTube Subtitle Dubber IT
// @namespace    npc-translator
// @version      2.0.0
// @description  Traduce i sottotitoli visibili di YouTube in italiano e li pronuncia
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  let enabled = true;
  let lastSource = '';
  let processing = false;
  let voices = [];
  const queue = [];
  const cache = new Map();

  function loadVoices() { voices = speechSynthesis.getVoices(); }
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;

  function italianVoice() {
    return voices.find(v => v.lang && v.lang.toLowerCase().startsWith('it')) || null;
  }

  function speak(text) {
    if (!enabled || !text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'it-IT';
    u.rate = 1.12;
    const v = italianVoice();
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }

  async function translateIt(text) {
    if (cache.has(text)) return cache.get(text);
    const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=en|it';
    const r = await fetch(url);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    const out = d && d.responseData && d.responseData.translatedText ? d.responseData.translatedText : text;
    cache.set(text, out);
    return out;
  }

  async function processQueue() {
    if (processing || !queue.length) return;
    processing = true;
    const text = queue.shift();
    try {
      const translated = await translateIt(text);
      speak(translated);
      setStatus('IT: ' + translated);
    } catch (e) {
      setStatus('Errore traduzione: ' + e.message);
    } finally {
      processing = false;
      if (queue.length) processQueue();
    }
  }

  function enqueue(text) {
    if (!text || text === lastSource) return;
    lastSource = text;
    queue.push(text);
    if (queue.length > 3) queue.shift();
    processQueue();
  }

  function readCaption() {
    const nodes = document.querySelectorAll('.ytp-caption-segment');
    const text = Array.from(nodes).map(n => n.textContent.trim()).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
    if (text) enqueue(text);
  }

  function setStatus(text) {
    const s = document.getElementById('npc-dubber-status');
    if (s) s.textContent = text;
  }

  function addPanel() {
    if (document.getElementById('npc-dubber-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'npc-dubber-panel';
    panel.style.cssText = 'position:fixed;right:16px;top:80px;z-index:999999;background:#12121a;color:#fff;border:1px solid #7c3aed;border-radius:12px;padding:10px;width:260px;font:14px system-ui;box-shadow:0 8px 30px #0008';
    const btn = document.createElement('button');
    btn.textContent = 'Dubbing IT: ON';
    btn.style.cssText = 'background:#7c3aed;color:white;border:0;border-radius:8px;padding:8px 10px;cursor:pointer;font-weight:700';
    btn.onclick = () => {
      enabled = !enabled;
      btn.textContent = 'Dubbing IT: ' + (enabled ? 'ON' : 'OFF');
      if (!enabled) { speechSynthesis.cancel(); queue.length = 0; }
    };
    const status = document.createElement('div');
    status.id = 'npc-dubber-status';
    status.textContent = 'Attiva i sottotitoli YouTube';
    status.style.cssText = 'margin-top:8px;color:#d8b4fe;font-size:12px;line-height:1.3';
    panel.append(btn, status);
    document.body.appendChild(panel);
  }

  addPanel();
  setInterval(() => { addPanel(); if (enabled) readCaption(); }, 650);
})();
