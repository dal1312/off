import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import OpenAI from 'openai';

const app = Fastify({ logger: true, bodyLimit: 30 * 1024 * 1024 });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

await app.register(cors, {
  origin: process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',') : true
});
await app.register(multipart, {
  limits: { fileSize: 25 * 1024 * 1024, files: 1 }
});

app.get('/health', async () => ({ ok: true, service: 'npc-live-stt' }));

app.post('/api/live-chunk', async (req, reply) => {
  try {
    const part = await req.file();
    if (!part) return reply.code(400).send({ error: 'missing_audio' });

    const source = req.query.source || 'auto';
    const target = req.query.target || 'it';
    const audioBuffer = await part.toBuffer();
    const file = new File([audioBuffer], part.filename || 'chunk.webm', {
      type: part.mimetype || 'audio/webm'
    });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: process.env.STT_MODEL || 'gpt-4o-mini-transcribe',
      language: source === 'auto' ? undefined : String(source).slice(0, 2)
    });

    const text = transcription.text?.trim() || '';
    if (!text) return { text: '', translation: '' };

    const translated = await openai.responses.create({
      model: process.env.TRANSLATE_MODEL || 'gpt-4.1-mini',
      input: `Translate into ${target}. Return only the translation, no notes.\n\n${text}`
    });

    return { text, translation: translated.output_text?.trim() || '' };
  } catch (err) {
    req.log.error(err);
    return reply.code(500).send({ error: 'live_chunk_failed', message: err.message });
  }
});

const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || '0.0.0.0';
await app.listen({ port, host });
