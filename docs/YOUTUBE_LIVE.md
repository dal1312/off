# YouTube Live → Italiano + Dubbing

Questo modulo contiene due modalità distinte.

## 1. Modalità gratuita browser-only

File: `youtube-live.html`

Funziona senza backend e senza chiavi API.

Pipeline:

```text
Audio YouTube / microfono
→ Web SpeechRecognition del browser
→ testo riconosciuto
→ MyMemory Translation API
→ sintesi vocale italiana del dispositivo
```

### Requisiti

- Browser consigliato: Chrome o Edge desktop.
- Microfono autorizzato.
- Connessione internet per la traduzione MyMemory.
- Voce italiana installata nel sistema operativo o nel browser.

### Limiti tecnici

- Su iPhone/iPad il supporto a `SpeechRecognition` può essere limitato o assente.
- Non cattura direttamente l'audio interno di YouTube: serve microfono, stereo mix o virtual cable.
- MyMemory è un provider gratuito pubblico: può applicare limiti, rallentamenti o risposte temporaneamente non disponibili.
- La qualità del riconoscimento dipende da volume, rumore, lingua selezionata e distanza dal microfono.

### Procedura rapida

1. Apri `youtube-live.html` da GitHub Pages.
2. Seleziona la lingua parlata nel video.
3. Seleziona una voce italiana se disponibile.
4. Premi `Avvia` e consenti il microfono.
5. Avvia il video YouTube.
6. Leggi la traduzione nella colonna italiana o ascolta il dubbing.

## 2. Modalità backend opzionale

Cartella: `backend/`

Pipeline prevista:

```text
Audio chunk
→ backend Fastify
→ OpenAI audio transcription
→ OpenAI translation
→ risposta JSON al frontend
```

Questa modalità richiede un server Node.js e una variabile `OPENAI_API_KEY`.

### Endpoint backend

- `GET /health`
- `POST /api/live-chunk`

Il file `backend/README.md` contiene la procedura di deploy su Render.

## Diagnostica

Apri `diagnostics.html` per verificare:

- supporto a SpeechRecognition;
- supporto a sintesi vocale;
- presenza di IndexedDB;
- stato online/offline;
- test MyMemory;
- test Google endpoint non ufficiale;
- test Lingva;
- voce italiana disponibile.

## Roadmap consigliata

1. Tenere `youtube-live.html` come versione gratuita e statica.
2. Creare in futuro una pagina separata `youtube-live-backend.html` per il flusso con backend.
3. Aggiungere una coda audio chunk lato frontend per il backend.
4. Aggiungere log diagnostico esportabile.
5. Aggiungere preset per streaming, podcast, lezione, conferenza.
