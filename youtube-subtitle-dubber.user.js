// ==UserScript==
// @name         NPC YouTube Subtitle Dubber IT
// @namespace    npc-translator
// @version      1.0.0
// @description  Legge i sottotitoli visibili di YouTube e li pronuncia in italiano
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  let enabled = true;
  let lastText = '';
  let voices = [];

  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
  }

  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;

  function italianVoice() {
    return voices.find(v => v.lang && v.lang.toLowerCase().startsWith('it')) || null;
  }

  function speak(text) {
    if (!enabled || !text || text === lastText) return;
    lastText = text;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'it-IT';
    u.rate = 1.08;
    const v = italianVoice();
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }

  function readCaption() {
    const nodes = document.querySelectorAll('.ytp-caption-segment');
    const text = Array.from(nodes)
      .map(n => n.textContent.trim())
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) speak(text);
  }

  function addPanel() {
    if (document.getElementById('npc-dubber-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'npc-dubber-panel';
    panel.style.cssText = 'position:fixed;right:16px;top:80px;z-index:999999;background:#12121a;color:#fff;border:1px solid #7c3aed;border-radius:12px;padding:10px;font:14px system-ui;box-shadow:0 8px 30px #0008';
    const btn = document.createElement('button');
    btn.textContent = 'Dubbing IT: ON';
    btn.style.cssText = 'background:#7c3aed;color:white;border:0;border-radius:8px;padding:8px 10px;cursor:pointer;font-weight:700';
    btn.onclick = () => {
      enabled = !enabled;
      btn.textContent = 'Dubbing IT: ' + (enabled ? 'ON' : 'OFF');
      if (!enabled) window.speechSynthesis.cancel();
    };
    panel.appendChild(btn);
    document.body.appendChild(panel);
  }

  addPanel();
  setInterval(() => {
    addPanel();
    readCaption();
  }, 500);
})();
