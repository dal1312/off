# NPC Translator Live Backend

Backend Node.js opzionale per una futura modalità YouTube/Live con trascrizione audio server-side.

## Perché serve

GitHub Pages esegue solo file statici. Le funzioni che richiedono elaborazione audio AI lato server hanno bisogno di un backend separato.

La pagina statica `youtube-live.html` funziona invece in modalità gratuita browser-only, usando:

```text
SpeechRecognition browser → MyMemory → speechSynthesis italiana
```

Questo backend è per la modalità avanzata:

```text
audio chunk → Fastify → OpenAI transcription → OpenAI translation → JSON
```

## Requisiti

- Node.js >= 20
- `OPENAI_API_KEY`
- origine frontend autorizzata tramite `ALLOWED_ORIGIN`

## Avvio locale

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

Risposta attesa:

```json
{"ok":true,"service":"npc-live-stt"}
```

## Deploy rapido su Render

1. Vai su Render.
2. Crea un nuovo Web Service.
3. Collega il repository `dal1312/off`.
4. Imposta `Root Directory`: `backend`.
5. Imposta `Build Command`: `npm install`.
6. Imposta `Start Command`: `npm start`.
7. Configura le variabili ambiente:
   - `OPENAI_API_KEY`
   - `ALLOWED_ORIGIN=https://dal1312.github.io`
   - `STT_MODEL=gpt-4o-mini-transcribe`
   - `TRANSLATE_MODEL=gpt-4.1-mini`

Render gestisce automaticamente `PORT`.

## Endpoint

### GET `/health`

Controlla che il servizio sia vivo.

### POST `/api/live-chunk`

Accetta un file audio multipart e parametri query:

- `source`: lingua sorgente, oppure `auto`;
- `target`: lingua di destinazione, default `it`.

Risposta:

```json
{
  "text": "testo trascritto",
  "translation": "traduzione"
}
```

## Note operative

- `youtube-live.html` non usa questo backend: è volutamente gratuito e statico.
- Per usare il backend serve una pagina frontend dedicata o un'estensione futura dell'attuale modulo live.
- Mantieni `OPENAI_API_KEY` solo nel backend. Non inserirla mai nei file statici GitHub Pages.
