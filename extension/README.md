# NPC YouTube Caption Translator Extension

Questa estensione legge direttamente i sottotitoli dal DOM del player YouTube, mostra una traduzione italiana sopra il video e può pronunciarla con la voce italiana del browser.

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
10. Attiva **Dubbing audio IT** e premi **Test audio**.

## Uso

1. Apri un video su YouTube.
2. Attiva i sottotitoli YouTube.
3. L'estensione cerca elementi come `.ytp-caption-segment` e `caption-visual-line`.
4. Quando trova testo nuovo, lo traduce.
5. La traduzione appare in overlay sopra il video.
6. Se **Dubbing audio IT** è attivo, la traduzione viene pronunciata con `speechSynthesis`.

## Audio / Dubbing IT

Il browser può bloccare la sintesi vocale finché non c'è un'interazione utente. Per sbloccarla:

1. Apri un video YouTube.
2. Apri il popup dell'estensione.
3. Attiva **Dubbing audio IT**.
4. Premi **Test audio**.
5. Dovresti sentire: `Audio traduzione italiano attivo.`
6. Lascia i sottotitoli YouTube attivi e avvia il video.

## Audio durante il video

La versione `0.3.0` usa una coda audio stabilizzata:

```text
sottotitolo cambia rapidamente
→ attesa breve frase stabile
→ traduzione
→ audio in riproduzione
→ eventuale frase successiva in coda
```

Questo evita il problema in cui il video aggiornava i sottotitoli troppo velocemente e il browser cancellava la voce prima che partisse.

Se vedi la traduzione a schermo ma non senti il video parlare:

- controlla che nel popup sia attivo **Dubbing audio IT**;
- premi **Test audio** una volta dopo il caricamento del video;
- lascia **Velocità voce = Normale** e **Volume voce = 100%**;
- verifica che l'overlay dica `audio IT attivo`;
- se l'overlay resta su `attendo sottotitoli`, il video non sta esponendo sottotitoli DOM leggibili.

Se non senti audio:

- ricarica la scheda YouTube;
- premi di nuovo **Test audio**;
- controlla volume di sistema e mixer audio;
- verifica che Chrome/Edge non abbia il sito disattivato;
- installa/abilita una voce italiana nel sistema operativo;
- prova velocità voce `Normale` e volume `100%`.

## Impostazioni popup

- attiva/disattiva;
- lingua sottotitoli;
- lingua destinazione;
- provider traduzione;
- posizione overlay;
- mostra originale;
- frequenza lettura;
- Dubbing audio IT;
- velocità voce;
- volume voce;
- Test audio.

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
- L'audio usa la sintesi vocale del browser/sistema operativo, quindi qualità e disponibilità dipendono dal dispositivo.

## Architettura

```text
manifest.json
→ content.js iniettato su youtube.com
→ lettura DOM sottotitoli
→ traduzione provider gratuito
→ overlay italiano
→ coda audio stabilizzata
→ speechSynthesis per Dubbing IT
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
