#!/usr/bin/env bash
set -euo pipefail

echo "NPC Translator PDF Ollama Backend"

if [ ! -d ".venv" ]; then
  python3.12 -m venv .venv || python3 -m venv .venv
fi

source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "Creato .env da .env.example"
fi

if curl -fsS http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
  echo "Ollama risponde."
else
  echo "Ollama non risponde. Avvia Ollama e scarica un modello, es: ollama pull gemma2"
fi

uvicorn app:app --host 127.0.0.1 --port 8090 --reload
