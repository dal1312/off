from __future__ import annotations

import os
import re
import shutil
import subprocess
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

import requests
from fastapi import BackgroundTasks, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"
JOB_DIR = BASE_DIR / "jobs"

for directory in (UPLOAD_DIR, OUTPUT_DIR, JOB_DIR):
    directory.mkdir(parents=True, exist_ok=True)

ALLOWED_ORIGINS = [
    item.strip()
    for item in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:8000,http://127.0.0.1:8000,http://localhost:8080,https://dal1312.github.io",
    ).split(",")
    if item.strip()
]

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma2")
PDF2ZH_BIN = os.getenv("PDF2ZH_BIN", "pdf2zh")
MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "80"))

app = FastAPI(
    title="NPC Translator PDF Ollama Backend",
    description="Backend locale per traduzione PDF avanzata con PDFMathTranslate + Ollama.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS or ["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def safe_filename(name: str) -> str:
    stem = Path(name or "document.pdf").stem
    stem = re.sub(r"[^a-zA-Z0-9._-]+", "-", stem).strip("-._") or "document"
    return stem[:90] + ".pdf"


def job_file(job_id: str) -> Path:
    return JOB_DIR / f"{job_id}.json"


def write_job(job_id: str, data: dict) -> None:
    import json

    path = job_file(job_id)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def read_job(job_id: str) -> dict:
    import json

    path = job_file(job_id)
    if not path.exists():
        raise HTTPException(status_code=404, detail="job_not_found")
    return json.loads(path.read_text(encoding="utf-8"))


def probe_ollama() -> dict:
    try:
        response = requests.get(f"{OLLAMA_HOST.rstrip('/')}/api/tags", timeout=5)
        response.raise_for_status()
        payload = response.json()
        models = [item.get("name") for item in payload.get("models", []) if item.get("name")]
        return {"ok": True, "host": OLLAMA_HOST, "model": OLLAMA_MODEL, "models": models}
    except Exception as exc:
        return {"ok": False, "host": OLLAMA_HOST, "model": OLLAMA_MODEL, "error": str(exc)}


def run_pdf2zh(job_id: str, input_path: Path, lang_in: str, lang_out: str, pages: str | None, threads: int) -> None:
    out_dir = OUTPUT_DIR / job_id
    out_dir.mkdir(parents=True, exist_ok=True)

    job = read_job(job_id)
    job.update({"state": "running", "started_at": utc_now()})
    write_job(job_id, job)

    env = os.environ.copy()
    env["OLLAMA_HOST"] = OLLAMA_HOST
    env["OLLAMA_MODEL"] = OLLAMA_MODEL

    cmd = [
        PDF2ZH_BIN,
        str(input_path),
        "-s",
        "ollama",
        "-li",
        lang_in,
        "-lo",
        lang_out,
        "-t",
        str(max(1, min(int(threads), 8))),
        "-o",
        str(out_dir),
    ]

    if pages:
        cmd.extend(["-p", pages])

    log_path = out_dir / "pdf2zh.log"

    try:
        with log_path.open("w", encoding="utf-8") as log:
            log.write("CMD: " + " ".join(cmd) + "\n")
            log.write(f"OLLAMA_HOST={OLLAMA_HOST}\n")
            log.write(f"OLLAMA_MODEL={OLLAMA_MODEL}\n\n")
            proc = subprocess.run(
                cmd,
                cwd=str(out_dir),
                env=env,
                stdout=log,
                stderr=subprocess.STDOUT,
                text=True,
                timeout=int(os.getenv("PDF_TRANSLATE_TIMEOUT_SEC", "3600")),
            )

        pdfs = sorted(out_dir.glob("*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True)
        mono = next((p for p in pdfs if "mono" in p.name.lower()), None)
        dual = next((p for p in pdfs if "dual" in p.name.lower()), None)

        if proc.returncode != 0:
            raise RuntimeError(f"pdf2zh_failed_return_code_{proc.returncode}")
        if not pdfs:
            raise RuntimeError("pdf2zh_finished_but_no_pdf_output")

        job.update(
            {
                "state": "success",
                "finished_at": utc_now(),
                "return_code": proc.returncode,
                "outputs": {
                    "mono": str(mono.name) if mono else None,
                    "dual": str(dual.name) if dual else None,
                    "all": [p.name for p in pdfs],
                    "log": log_path.name,
                },
            }
        )
    except Exception as exc:
        job.update(
            {
                "state": "failed",
                "finished_at": utc_now(),
                "error": str(exc),
                "outputs": {"log": log_path.name if log_path.exists() else None},
            }
        )
    finally:
        write_job(job_id, job)


@app.get("/health")
def health() -> dict:
    return {
        "ok": True,
        "service": "npc-pdf-ollama",
        "ollama": probe_ollama(),
        "pdf2zh_bin": PDF2ZH_BIN,
    }


@app.post("/api/pdf/translate")
async def translate_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    lang_in: str = Form("en"),
    lang_out: str = Form("it"),
    pages: str | None = Form(None),
    threads: int = Form(1),
) -> dict:
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="only_pdf_allowed")

    content = await file.read()
    max_bytes = MAX_UPLOAD_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(status_code=413, detail=f"file_too_large_max_{MAX_UPLOAD_MB}_mb")

    job_id = uuid.uuid4().hex
    input_name = safe_filename(file.filename)
    input_path = UPLOAD_DIR / f"{job_id}-{input_name}"
    input_path.write_bytes(content)

    job = {
        "id": job_id,
        "state": "queued",
        "created_at": utc_now(),
        "input_file": input_name,
        "input_path": str(input_path),
        "lang_in": lang_in,
        "lang_out": lang_out,
        "pages": pages,
        "threads": threads,
        "engine": "pdf2zh",
        "service": "ollama",
        "ollama_host": OLLAMA_HOST,
        "ollama_model": OLLAMA_MODEL,
    }
    write_job(job_id, job)

    background_tasks.add_task(run_pdf2zh, job_id, input_path, lang_in, lang_out, pages, threads)

    return {"id": job_id, "state": "queued"}


@app.get("/api/pdf/job/{job_id}")
def get_job(job_id: str) -> dict:
    return read_job(job_id)


@app.get("/api/pdf/job/{job_id}/{kind}")
def download_job_file(job_id: str, kind: Literal["mono", "dual", "log"]):
    job = read_job(job_id)
    out_dir = OUTPUT_DIR / job_id
    outputs = job.get("outputs") or {}
    filename = outputs.get(kind)

    if not filename:
        if kind in {"mono", "dual"}:
            candidates = sorted(out_dir.glob(f"*{kind}*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True)
            if candidates:
                filename = candidates[0].name

    if not filename:
        raise HTTPException(status_code=404, detail=f"{kind}_not_available")

    path = out_dir / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="file_not_found")

    media_type = "application/pdf" if path.suffix.lower() == ".pdf" else "text/plain"
    return FileResponse(path, media_type=media_type, filename=path.name)


@app.delete("/api/pdf/job/{job_id}")
def delete_job(job_id: str) -> dict:
    job = read_job(job_id)
    out_dir = OUTPUT_DIR / job_id
    if out_dir.exists():
        shutil.rmtree(out_dir, ignore_errors=True)
    input_path = Path(job.get("input_path", ""))
    if input_path.exists():
        input_path.unlink(missing_ok=True)
    job_file(job_id).unlink(missing_ok=True)
    return {"ok": True, "deleted": job_id}
