# 🏴‍☠️ NPC Translator

**Traduttore avanzato per testi, libri, RPG, documenti e workflow live.**

NPC Translator è una PWA leggera basata su HTML/CSS/JavaScript vanilla. Nasce per tradurre testi lunghi, libri, file e dialoghi, ma include anche un modulo sperimentale per YouTube/Live in italiano.

![Versione](https://img.shields.io/badge/version-0.6.0--stability-purple)
![PWA](https://img.shields.io/badge/PWA-support-blue)
![Offline UI](https://img.shields.io/badge/Offline-UI-green)
![Static](https://img.shields.io/badge/GitHub%20Pages-ready-black)

## Moduli del progetto

| Modulo | File/cartella | Stato | Descrizione |
|---|---|---:|---|
| PWA principale | `index.html` | Attivo | Traduzione testi/file, glossario, cronologia, export, OCR, TTS. |
| YouTube Live gratuito | `youtube-live.html` | Sperimentale | Microfono → riconoscimento vocale browser → traduzione free → voce italiana. |
| Diagnostica | `diagnostics.html` | Attivo | Verifica browser, PWA, provider gratuiti e voce italiana. |
| Backend opzionale | `backend/` | Separato | Server Node.js/Fastify per futura trascrizione/traduzione AI lato server. |

## Funzionalità principali

- Import multi-formato: PDF, EPUB, DOCX, TXT e immagini con OCR.
- Esportazione in TXT, PDF, DOCX ed EPUB.
- Modalità Libro per testi lunghi e dialoghi.
- Glossario personalizzato per nomi, termini tecnici e frasi ricorrenti.
- Cronologia locale con IndexedDB.
- Sintesi vocale e dettatura vocale dove supportate dal browser.
- Traduzione batch con ZIP.
- Traduzione live opzionale.
- PWA installabile con Service Worker.
- Tema chiaro/scuro, modalità immersiva e supporto RTL.

## Lingue supportate

Auto-rilevamento più: Inglese, Italiano, Latino, Yiddish, Ebraico, Arabo, Francese, Spagnolo, Tedesco, Portoghese, Russo, Cinese, Giapponese.

## Avvio rapido

### Locale

```bash
git clone https://github.com/dal1312/off.git
cd off
```

Poi apri `index.html` nel browser.

### GitHub Pages

1. Vai su **Settings → Pages**.
2. Source: **Deploy from a branch**.
3. Branch: `main`.
4. Folder: `/ (root)`.
5. Apri:

```text
https://dal1312.github.io/off/
```

## Pagine operative

```text
index.html          → PWA principale
youtube-live.html   → YouTube/Live gratuito browser-only
diagnostics.html    → test ambiente e provider
```

## Traduzione gratuita

La PWA principale usa provider pubblici gratuiti con fallback:

1. Google Translate endpoint non ufficiale;
2. MyMemory;
3. Lingva.

Questi provider possono avere limiti, timeout o blocchi temporanei. Per testi molto lunghi conviene usare chunk piccoli, Modalità Libro e salvataggio progressivo.

## YouTube Live gratuito

Il modulo `youtube-live.html` non cattura direttamente YouTube dal browser. Usa il microfono o un sistema audio configurato dal PC.

Pipeline:

```text
Audio vicino al microfono / stereo mix
→ SpeechRecognition browser
→ MyMemory
→ speechSynthesis italiana
```

Consulta `docs/YOUTUBE_LIVE.md` per dettagli tecnici, limiti e roadmap.

## Diagnostica

Apri `diagnostics.html` per verificare:

- SpeechRecognition;
- sintesi vocale;
- IndexedDB;
- Cache API / Service Worker;
- provider gratuiti;
- voce italiana disponibile.

Consulta `docs/DIAGNOSTICS.md` per l'interpretazione dei risultati.

## Backend opzionale

La cartella `backend/` contiene un server Node.js/Fastify per una modalità live avanzata con OpenAI.

Avvio locale:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Health check:

```text
http://localhost:8787/health
```

Il backend è opzionale e non serve per usare la PWA statica su GitHub Pages.

## Tecnologie

- HTML, CSS e JavaScript vanilla.
- PDF.js per estrazione testo PDF.
- Mammoth.js per DOCX.
- JSZip per ZIP/DOCX/EPUB.
- jsPDF per PDF.
- Tesseract.js per OCR.
- IndexedDB per cronologia, glossario e progetti.
- Web Speech API per voce e dettatura.
- Fastify/OpenAI solo nel backend opzionale.

## Note tecniche

- L'interfaccia PWA può funzionare offline dopo il primo caricamento.
- La traduzione richiede internet perché i provider sono online.
- Le API gratuite non vanno trattate come servizio garantito.
- La chiave OpenAI, se usata, deve restare solo nel backend e mai nei file statici.

## Licenza

Questo progetto è rilasciato sotto licenza MIT.

---

Fatto con 💜 per chi traduce libri, manuali, dialoghi di gioco, documenti e contenuti live.
