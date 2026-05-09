import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import type { CoachVoice, PurchaseMode } from './types';

// Resolve the OpenAI API key from (in order):
//   1. EXPO_PUBLIC_OPENAI_API_KEY env var (works in dev + EAS builds)
//   2. extra.openaiApiKey in app.json (for one-off testing)
// SECURITY: anything bundled into the client is recoverable from the binary.
// For production, replace these calls with a server proxy you own.
function resolveApiKey(): string {
  const fromEnv = (process.env as any).EXPO_PUBLIC_OPENAI_API_KEY as string | undefined;
  const fromExtra =
    ((Constants.expoConfig?.extra ?? Constants.manifest?.extra) as any)?.openaiApiKey as
      | string
      | undefined;
  return (fromEnv ?? fromExtra ?? '').trim();
}

const OPENAI_API_KEY = resolveApiKey();
export const aiEnabled: boolean = OPENAI_API_KEY.length > 0;

const OPENAI = 'https://api.openai.com/v1';

export async function transcribeAudio(uri: string): Promise<string> {
  if (!aiEnabled) throw new Error('OpenAI API key not set');
  const form = new FormData();
  form.append('file', {
    uri,
    name: 'recording.m4a',
    type: 'audio/m4a',
  } as any);
  form.append('model', 'whisper-1');
  form.append('language', 'en');
  form.append('response_format', 'json');

  const r = await fetch(`${OPENAI}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: form as unknown as BodyInit,
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`STT failed (${r.status}): ${txt.slice(0, 200)}`);
  }
  const j = (await r.json()) as { text?: string };
  return (j.text ?? '').trim();
}

export interface CoachContext {
  name: string;
  day: number;
  phaseLabel: string;
  style: 'gentle' | 'direct' | 'playful';
  voice: CoachVoice;
  partnerName?: string;
  mode: PurchaseMode;
  completedToday: number;
  totalTasks: number;
}

export interface CoachTurn {
  role: 'user' | 'assistant';
  content: string;
}

export async function getCoachReply(
  history: CoachTurn[],
  ctx: CoachContext,
): Promise<string> {
  if (!aiEnabled) throw new Error('OpenAI API key not set');
  const system = buildSystemPrompt(ctx);

  const r = await fetch(`${OPENAI}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 220,
      messages: [{ role: 'system', content: system }, ...history],
    }),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`LLM failed (${r.status}): ${txt.slice(0, 200)}`);
  }
  const j = (await r.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return (j.choices?.[0]?.message?.content ?? '').trim();
}

function buildSystemPrompt(c: CoachContext): string {
  const styleNote =
    c.style === 'gentle'
      ? 'Be warm, patient, and encouraging. No pressure.'
      : c.style === 'playful'
        ? 'Be witty and lighthearted, but still useful. Light teasing is fine.'
        : 'Be blunt, direct, and mission-focused. No fluff.';

  const modeNote =
    c.mode === 'gift'
      ? `This program was gifted to ${c.name} by his partner${c.partnerName ? ` ${c.partnerName}` : ''}. Honor that — occasionally remind him this is a shared journey.`
      : `${c.name} bought this for himself. Honor that focus and self-respect.`;

  return [
    'You are the Voice AI Coach for Quantum Ceed, a 90-day men\'s fertility transformation program.',
    `You are coaching ${c.name} (he/him).`,
    `Today is day ${c.day} of 90. Current phase: ${c.phaseLabel}.`,
    `Tasks completed today: ${c.completedToday} of ${c.totalTasks}.`,
    `Coaching style: ${c.style}. ${styleNote}`,
    modeNote,
    'You speak through a phone — write the way you would speak. 2 to 4 sentences.',
    'Reinforce sperm-friendly lifestyle: 7+ hrs sleep, hydration, whole-food protein, strength training, cool boxers / no laptop on lap, low stress, minimal alcohol, no seed oils.',
    'There are three YO Sperm Tests on day 1, day 45, and day 90. Reference them when relevant.',
    `Phase 1 (Foundation, days 1\u201330): hydration, sleep, walks, cut alcohol & seed oils.`,
    `Phase 2 (Activation, days 31\u201360): resistance training 4x/wk, cold exposure, zone 2, pelvic floor.`,
    `Phase 3 (Optimization, days 61\u201390): HRV recovery, micronutrients, stress mastery, sperm-friendly cooling.`,
    'Use his name occasionally, not every sentence. Never give medical advice or diagnose. You are a habit and mindset coach.',
  ].join('\n');
}

export async function synthesizeSpeech(
  text: string,
  voice: CoachVoice,
): Promise<string> {
  if (!aiEnabled) throw new Error('OpenAI API key not set');
  const r = await fetch(`${OPENAI}/audio/speech`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'tts-1',
      voice: voice === 'female' ? 'nova' : 'onyx',
      input: text,
      response_format: 'mp3',
    }),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`TTS failed (${r.status}): ${txt.slice(0, 200)}`);
  }
  const buffer = await r.arrayBuffer();
  const base64 = arrayBufferToBase64(buffer);
  const dir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? '';
  const fileUri = `${dir}coach-${Date.now()}.mp3`;
  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return fileUri;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, Math.min(i + chunk, bytes.length))),
    );
  }
  // React Native + Expo SDK 51 expose btoa globally; fall back to manual b64 if absent.
  const g = globalThis as any;
  if (typeof g.btoa === 'function') return g.btoa(binary);
  return manualBase64(binary);
}

function manualBase64(str: string): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '';
  let i = 0;
  while (i < str.length) {
    const c1 = str.charCodeAt(i++) & 0xff;
    const c2 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
    const c3 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
    const e1 = c1 >> 2;
    const e2 = ((c1 & 3) << 4) | (isNaN(c2) ? 0 : c2 >> 4);
    const e3 = isNaN(c2) ? 64 : ((c2 & 15) << 2) | (isNaN(c3) ? 0 : c3 >> 6);
    const e4 = isNaN(c3) ? 64 : c3 & 63;
    out += chars.charAt(e1) + chars.charAt(e2) + chars.charAt(e3) + chars.charAt(e4);
  }
  return out;
}
