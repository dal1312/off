# 🏴‍☠️ NPC Translator

**Traduttore avanzato per testi, libri, RPG e documenti**

Un'applicazione web moderna, leggera e potente per tradurre testi in molteplici lingue. Supporta l'importazione di file complessi (PDF, EPUB, DOCX), OCR da immagini, sintesi vocale, glossario personalizzato, modalità libro per coerenza su testi lunghi e tanto altro.

Pensato per essere **facile da usare** (è un singolo file HTML) e **installabile come PWA**.

![Versione](https://img.shields.io/badge/version-0.5.0--serious-purple)
![PWA](https://img.shields.io/badge/PWA-support-blue)
![Offline](https://img.shields.io/badge/Offline-ready-green)

## ✨ Funzionalità principali

- **Import multi-formato**: PDF, EPUB, DOCX, TXT e immagini (con OCR)
- **Esportazione** in TXT, PDF, DOCX ed EPUB con metadati
- **Modalità Libro**: traduzione intelligente capitolo per capitolo con contesto per mantenere coerenza
- **Glossario personalizzato**: definisci termini, nomi propri e frasi da tradurre sempre allo stesso modo
- **Cronologia** delle traduzioni con ricerca e import/export
- **Sintesi vocale**: ascolta il testo originale e la traduzione
- **Dettatura vocale** (microfono)
- **OCR** da immagini e foto
- **Traduzione batch**: carica più file e ottieni un ZIP con le traduzioni
- **Traduzione in tempo reale** (opzionale)
- **Preserva formattazione** (sperimentale per DOCX)
- **PWA installabile** + Service Worker per funzionamento offline dell'interfaccia
- **Tema chiaro/scuro** + **Modalità immersiva**
- Supporto lingue RTL (Arabo, Ebraico, Yiddish)
- Scorciatoie da tastiera

### Lingue supportate
Auto-rilevamento +: Inglese, Italiano, Latino, Yiddish, Ebraico, Arabo, Francese, Spagnolo, Tedesco, Portoghese, Russo, Cinese, Giapponese.

## 🚀 Come usarlo

### Modalità più semplice (locale)
1. Scarica o clona questo repository
2. Apri il file `index.html` con qualsiasi browser moderno

### Su GitHub Pages (consigliato per uso continuativo)
1. Crea un repository su GitHub e carica tutti i file (`index.html`, `manifest.json`, `sw.js` + cartella `icons/`)
2. Vai su **Settings → Pages**
3. Seleziona:
   - Source: **Deploy from a branch**
   - Branch: `main` (o `master`)
   - Folder: `/ (root)`
4. Salva. Il tuo traduttore sarà disponibile all'indirizzo:
   `https://TUO-USERNAME.github.io/NOME-REPO/`

Puoi anche installarlo come app dal browser (pulsante "Installa" o "Aggiungi alla schermata Home").

## 🛠️ Tecnologie utilizzate

- **HTML + CSS + JavaScript vanilla** (tutto in un singolo file per massima portabilità)
- CDN esterni (nessuna dipendenza da installare):
  - [PDF.js](https://mozilla.github.io/pdf.js/) – estrazione testo PDF
  - [JSZip](https://stuk.github.io/jszip/) – creazione ZIP e file DOCX/EPUB
  - [Mammoth.js](https://github.com/mwilliamson/mammoth.js) – lettura DOCX
  - [jsPDF](https://github.com/parallax/jsPDF) – generazione PDF
  - [Tesseract.js](https://github.com/naptha/tesseract.js) – OCR
- Service Worker per cache PWA
- Web Speech API per sintesi e riconoscimento vocale

Le traduzioni vengono effettuate tramite API gratuite pubbliche:
- Google Translate (senza chiave)
- MyMemory
- Lingva.ml

## 📋 Note importanti

- **La traduzione richiede connessione internet** (le API sono online). L'interfaccia e le funzioni di base funzionano offline grazie alla PWA.
- Per testi molto lunghi (libri), attiva la **Modalità Libro** per risultati più coerenti.
- Usa il **Glossario** per mantenere nomi di personaggi, luoghi e termini tecnici sempre uguali.
- Il file è progettato per essere self-contained: basta `index.html` per usarlo ovunque.

## 🖼️ Screenshot

*(Aggiungi qui degli screenshot dell'interfaccia una volta che li fai)*

## 📄 Licenza

Questo progetto è rilasciato sotto licenza **MIT**.

---

Fatto con 💜 per chi traduce libri, manuali, dialoghi di gioco e documenti.

Se ti piace il progetto, metti una ⭐ su GitHub!
