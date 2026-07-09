# NPC Translator · PDF avanzato locale con Ollama

Questo modulo aggiunge un backend locale per tradurre PDF complessi usando:

```text
PDFMathTranslate / pdf2zh
→ servizio ollama
→ modello LLM locale
→ PDF tradotto mono / bilingue
```

È pensato per PDF difficili: scientifici, tecnici, impaginati, con formule, grafici e layout da preservare.

## Perché backend separato

`index.html` gira su GitHub Pages ed è solo frontend statico. PDFMathTranslate è un programma Python, quindi serve un processo locale/server.

## Requisiti

- Python 3.11 o 3.12.
- Ollama installato e avviato.
- Un modello locale scaricato.
- Windows, macOS o Linux.

PDFMathTranslate richiede Python `>=3.11,<3.13` e supporta il servizio `ollama` con:

```text
OLLAMA_HOST=http://127.0.0.1:11434
OLLAMA_MODEL=gemma2
```

## Setup Ollama

Installa Ollama dal sito ufficiale:

```text
https://ollama.com/download
```

Scarica un modello:

```bash
ollama pull gemma2
```

oppure, consigliato per traduzione multilingua:

```bash
ollama pull qwen2.5:7b
```

Poi aggiorna `.env`:

```text
OLLAMA_MODEL=qwen2.5:7b
```

Verifica che Ollama risponda:

```bash
curl http://127.0.0.1:11434/api/tags
```

## Avvio rapido Windows

Da PowerShell:

```powershell
cd backend-pdf
.\start-windows.ps1
```

Il backend parte su:

```text
http://127.0.0.1:8090
```

## Avvio rapido macOS/Linux

```bash
cd backend-pdf
chmod +x start-linux-mac.sh
./start-linux-mac.sh
```

## Avvio manuale

```bash
cd backend-pdf
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app:app --host 127.0.0.1 --port 8090 --reload
```

## Endpoint

### Health

```text
GET /health
```

Risposta esempio:

```json
{
  "ok": true,
  "service": "npc-pdf-ollama",
  "ollama": {
    "ok": true,
    "host": "http://127.0.0.1:11434",
    "model": "gemma2"
  }
}
```

### Traduci PDF

```bash
curl -X POST http://127.0.0.1:8090/api/pdf/translate \
  -F "file=@document.pdf" \
  -F "lang_in=en" \
  -F "lang_out=it" \
  -F "threads=1"
```

Risposta:

```json
{"id":"JOB_ID","state":"queued"}
```

### Stato job

```bash
curl http://127.0.0.1:8090/api/pdf/job/JOB_ID
```

### Download risultati

```text
GET /api/pdf/job/JOB_ID/mono
GET /api/pdf/job/JOB_ID/dual
GET /api/pdf/job/JOB_ID/log
```

- `mono`: PDF tradotto.
- `dual`: PDF bilingue.
- `log`: log tecnico pdf2zh.

## Traduzione parziale pagine

Per test rapidi:

```bash
curl -X POST http://127.0.0.1:8090/api/pdf/translate \
  -F "file=@document.pdf" \
  -F "lang_in=en" \
  -F "lang_out=it" \
  -F "pages=1-3" \
  -F "threads=1"
```

## Modelli consigliati

### PC medio

```bash
ollama pull gemma2
```

### Traduzione migliore multilingua

```bash
ollama pull qwen2.5:7b
```

### PC leggero

```bash
ollama pull gemma2:2b
```

La qualità dipende molto dal modello e dalla RAM/VRAM disponibile.

## Note prestazioni

- Usa `threads=1` per evitare blocchi e consumo eccessivo.
- Traduci prima 1-3 pagine per test.
- I PDF grandi possono richiedere molti minuti.
- Ollama deve restare avviato durante tutto il job.
- Il backend è locale: non invia la chiave a servizi cloud.

## Licenza

Questo modulo usa `pdf2zh`, basato su PDFMathTranslate, licenza AGPL-3.0. Mantieni questo modulo separato e documentato.
