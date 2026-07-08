# Diagnostica NPC Translator

File: `diagnostics.html`

La pagina diagnostica serve per capire rapidamente se il browser e il dispositivo supportano le funzioni principali del progetto.

## Controlli eseguiti

### Browser

- stato online/offline;
- contesto sicuro HTTPS/localhost;
- supporto a `SpeechRecognition`;
- supporto a `speechSynthesis`;
- supporto a IndexedDB;
- supporto a Web Share API;
- supporto a File System Access API tramite `showSaveFilePicker`.

### PWA

- supporto a Service Worker;
- supporto a Cache API;
- modalità standalone/installata;
- stato generale manifest/cache.

### Provider traduzione

La pagina contiene test manuali per:

- MyMemory;
- endpoint Google Translate non ufficiale;
- Lingva.

I provider gratuiti pubblici non garantiscono disponibilità permanente. La diagnostica non sostituisce un monitor server-side, ma è utile per test rapidi lato utente.

### Voce italiana

La pagina mostra le voci TTS disponibili e permette di provare una frase in italiano.

## Interpretazione risultati

- `OK`: funzione disponibile.
- `LIMITATO`: funzione presente solo in certe condizioni o non critica.
- `NO`: funzione assente o bloccata nel browser corrente.

## Browser consigliati

- Chrome desktop;
- Edge desktop;
- Android Chrome per funzioni PWA di base.

Safari/iOS può essere valido per la PWA, ma può limitare riconoscimento vocale e alcune API sperimentali.

## Uso operativo

1. Apri `diagnostics.html`.
2. Premi `Test MyMemory`.
3. Prova la voce italiana.
4. Se SpeechRecognition non è disponibile, usa Chrome/Edge desktop per `youtube-live.html`.
5. Se i provider gratuiti falliscono, riprova più tardi o usa un backend dedicato.
