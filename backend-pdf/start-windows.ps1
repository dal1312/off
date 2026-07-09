$ErrorActionPreference = "Stop"

Write-Host "NPC Translator PDF Ollama Backend" -ForegroundColor Cyan

if (!(Test-Path ".venv")) {
  py -3.12 -m venv .venv
}

. .\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt

if (!(Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Creato .env da .env.example" -ForegroundColor Yellow
}

Write-Host "Verifica Ollama: http://127.0.0.1:11434" -ForegroundColor Yellow
try {
  Invoke-RestMethod -Uri "http://127.0.0.1:11434/api/tags" -Method GET -TimeoutSec 5 | Out-Null
  Write-Host "Ollama risponde." -ForegroundColor Green
} catch {
  Write-Host "Ollama non risponde. Avvia Ollama e scarica un modello, es: ollama pull gemma2" -ForegroundColor Red
}

uvicorn app:app --host 127.0.0.1 --port 8090 --reload
