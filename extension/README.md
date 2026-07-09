# NPC YouTube Caption Translator Extension

Questa estensione legge direttamente i sottotitoli dal DOM del player YouTube e mostra una traduzione italiana sopra il video.

## Differenza rispetto alla pagina OCR

| Modalità | Dove gira | Come legge |
|---|---|---|
| `youtube-subtitles-ocr.html` | GitHub Pages | pixel dello schermo tramite Screen Capture + OCR |
| `extension/` | dentro YouTube | elementi DOM dei sottotitoli YouTube |

Questa è la modalità richiesta quando vuoi che il sistema legga direttamente YouTube dall'interno della pagina.

## Installazione manuale Chrome / Edge

1. Scarica o clona il repository.
2. Apri Chrome/Edge.
3. Vai su:

```text
chrome://extensions
```

oppure su Edge:

```text
edge://extensions
```

4. Attiva **Modalità sviluppatore**.
5. Premi **Carica estensione non pacchettizzata**.
6. Seleziona la cartella:

```text
extension/
```

7. Apri YouTube.
8. Avvia un video con sottotitoli attivi.
9. Clicca l'icona dell'estensione e verifica che sia attiva.

## Uso

1. Apri un video su YouTube.
2. Attiva i sottotitoli YouTube.
3. L'estensione cerca elementi come `.ytp-caption-segment` e `caption-visual-line`.
4. Quando trova testo nuovo, lo traduce.
5. La traduzione appare in overlay sopra il video.

## Impostazioni popup

- attiva/disattiva;
- lingua sottotitoli;
- lingua destinazione;
- provider traduzione;
- posizione overlay;
- mostra originale;
- frequenza lettura.

## Provider disponibili

- MyMemory;
- Google endpoint non ufficiale;
- Lingva.

I provider gratuiti possono avere limiti o blocchi temporanei.

## Limiti tecnici

- Funziona solo dove YouTube espone sottotitoli nel DOM del player.
- Se YouTube cambia classi CSS o struttura HTML, il content script potrebbe richiedere aggiornamento.
- Alcuni sottotitoli automatici possono comparire a segmenti molto brevi.
- Non sostituisce i sottotitoli originali: aggiunge un overlay italiano.

## Architettura

```text
manifest.json
→ content.js iniettato su youtube.com
→ lettura DOM sottotitoli
→ traduzione provider gratuito
→ overlay italiano
→ popup.html/popup.js per impostazioni
```

## File

```text
extension/manifest.json
extension/content.js
extension/popup.html
extension/popup.js
extension/README.md
```
