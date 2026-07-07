# NPC Translator Live Backend

Backend Node.js per YouTube Live Translator v2.

## Perché serve

GitHub Pages esegue solo file statici. La trascrizione audio AI richiede un server backend.

## Deploy rapido su Render

1. Vai su Render.com
2. New Web Service
3. Collega repository `dal1312/off`
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Environment:
   - `OPENAI_API_KEY`: la tua chiave OpenAI
   - `ALLOWED_ORIGIN`: `https://dal1312.github.io`
   - `PORT`: lascia quello automatico Render oppure `8787`

## Test

Apri:

`https://TUO-BACKEND.onrender.com/health`

Deve rispondere:

```json
{"ok":true,"service":"npc-live-stt"}
```

Poi inserisci quell'URL nella pagina:

`https://dal1312.github.io/off/youtube-live.html`
