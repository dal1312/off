# YouTube Screen Subtitle OCR

File: `youtube-subtitles-ocr.html`

Questa modalità serve quando il video YouTube mostra già sottotitoli a schermo e vuoi tradurli in italiano leggendo i pixel del video.

## Pipeline

```text
Scheda/finestra/schermo condiviso
→ ritaglio zona sottotitoli
→ OCR con Tesseract.js
→ traduzione MyMemory
→ overlay italiano nella pagina
→ export TXT opzionale
```

## Perché serve

Una pagina GitHub Pages non può leggere direttamente il contenuto DOM di YouTube aperto in un'altra scheda. Il browser lo impedisce per sicurezza. La soluzione corretta è chiedere all'utente il permesso di condividere lo schermo o la scheda video, poi leggere solo i pixel autorizzati.

## Procedura operativa

1. Apri YouTube.
2. Attiva i sottotitoli nel video.
3. Apri `youtube-subtitles-ocr.html`.
4. Premi `Condividi schermo`.
5. Seleziona la scheda o finestra con YouTube.
6. Regola l'area viola sopra la zona sottotitoli.
7. Premi `Avvia OCR`.
8. Leggi la traduzione italiana nell'overlay della pagina.

## Controlli disponibili

- Altezza zona sottotitoli.
- Distanza dal basso.
- Margine laterale.
- Scala OCR.
- Intervallo scansione.
- Lingua OCR.
- Lingua sorgente per la traduzione.
- Modalità preprocessing OCR:
  - normale;
  - contrasto alto;
  - inverti colori.

## Limiti tecnici

- Funziona meglio su Chrome/Edge desktop.
- Serve HTTPS, quindi GitHub Pages va bene.
- L'utente deve autorizzare la cattura schermo.
- L'OCR dipende da grandezza, contrasto e pulizia dei sottotitoli.
- Non sovrappone la traduzione direttamente sopra la scheda YouTube: mostra overlay nella pagina di NPC Translator.
- Per usare YouTube e overlay insieme, usa schermo diviso, finestra affiancata o monitor secondario.

## Suggerimenti qualità OCR

- Aumenta la dimensione dei sottotitoli YouTube.
- Usa sottotitoli bianchi su sfondo scuro.
- Allarga la zona OCR se taglia parole.
- Usa `Contrasto alto` quando il testo è poco leggibile.
- Usa `Inverti colori` solo se il testo viene riconosciuto male.
- Imposta correttamente la lingua OCR.

## Differenza dalle altre modalità

| Modalità | File | Fonte |
|---|---|---|
| Traduzione testo/file | `index.html` | testo/import documenti |
| Live microfono | `youtube-live.html` | audio dal microfono |
| Sottotitoli da schermo | `youtube-subtitles-ocr.html` | pixel catturati dallo schermo |
| Backend AI opzionale | `backend/` | audio chunk server-side |

## Roadmap consigliata

1. Aggiungere preset area per YouTube fullscreen e theater mode.
2. Aggiungere coda OCR più efficiente con worker persistente.
3. Aggiungere traduttore fallback multiprovider.
4. Aggiungere finestra overlay separata stile teleprompter.
5. Aggiungere esportazione SRT/VTT con timestamp.
