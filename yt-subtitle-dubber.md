# YouTube sottotitoli -> italiano + voce

Obiettivo: leggere i sottotitoli visibili su YouTube, tradurli in italiano e leggerli con voce italiana.

Nota tecnica: una pagina su GitHub Pages non puo leggere direttamente i sottotitoli dentro youtube.com, per blocco cross-origin del browser. Serve codice eseguito direttamente sulla pagina YouTube: estensione, userscript o bookmarklet.

## Metodo gratuito consigliato

1. Apri YouTube.
2. Attiva i sottotitoli del video.
3. Usa uno userscript/browser extension che legge i testi visibili dei sottotitoli.
4. Il testo viene tradotto verso italiano.
5. Il browser lo legge con speechSynthesis in italiano.

## Stato progetto

La pagina `youtube-live.html` resta utile per microfono + dubbing.
Per lettura diretta sottotitoli serve modulo userscript separato.
