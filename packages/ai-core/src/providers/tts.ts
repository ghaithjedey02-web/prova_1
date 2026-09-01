/**
 * Speech for the console — a real voice, generated server-side.
 *
 * Browser `speechSynthesis` is the only option that needs no key, and it
 * sounds like what it is: a screen reader. For a product a company is meant
 * to trust, the voice has to be neural. So the console asks the server first
 * and only falls back to the browser when no provider is configured.
 *
 * Provider is chosen by which key exists, best Italian first. Neither key
 * present is a normal state, not an error: `ttsConfigured()` is false and the
 * route answers 503 so the client can fall back and say nothing about it.
 *
 * Plain fetch, no vendor SDK — but it lives in providers/ because this is the
 * zone of the monorepo that is allowed to talk to a third party at all.
 */

export type TtsProvider = 'elevenlabs' | 'openai' | null;

export function ttsProvider(): TtsProvider {
  if (process.env['ELEVENLABS_API_KEY']) return 'elevenlabs';
  if (process.env['OPENAI_API_KEY']) return 'openai';
  return null;
}

export function ttsConfigured(): boolean {
  return ttsProvider() !== null;
}

/** Rachel-family multilingual default; override per deployment. */
const EL_VOICE = process.env['ELEVENLABS_VOICE_ID'] ?? '21m00Tcm4TlvDq8ikWAM';
const EL_MODEL = process.env['ELEVENLABS_MODEL'] ?? 'eleven_multilingual_v2';
const OA_MODEL = process.env['OPENAI_TTS_MODEL'] ?? 'gpt-4o-mini-tts';
const OA_VOICE = process.env['OPENAI_TTS_VOICE'] ?? 'alloy';

export interface SpeechResult {
  /** MP3 bytes, ready to stream to the browser. */
  body: ReadableStream<Uint8Array> | ArrayBuffer;
  contentType: string;
}

/**
 * Generates Italian speech for `text`. Throws on provider failure so the route
 * can answer 502 and the client can fall back to the browser voice.
 */
export async function speak(text: string, signal?: AbortSignal): Promise<SpeechResult> {
  const provider = ttsProvider();

  if (provider === 'elevenlabs') {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env['ELEVENLABS_API_KEY']!,
          'content-type': 'application/json',
          accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: EL_MODEL,
          language_code: 'it',
          // Calm and even: this voice reports facts, it does not perform them.
          voice_settings: { stability: 0.45, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
        }),
        signal,
      },
    );
    if (!res.ok || !res.body) throw new Error(`elevenlabs ${res.status}`);
    return { body: res.body, contentType: 'audio/mpeg' };
  }

  if (provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${process.env['OPENAI_API_KEY']!}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: OA_MODEL,
        voice: OA_VOICE,
        input: text,
        response_format: 'mp3',
        instructions:
          'Parla italiano con accento neutro, tono calmo e professionale, ritmo naturale con pause vere fra le frasi. Non enfatizzare, non recitare: stai riportando fatti a un imprenditore.',
      }),
      signal,
    });
    if (!res.ok || !res.body) throw new Error(`openai ${res.status}`);
    return { body: res.body, contentType: 'audio/mpeg' };
  }

  throw new Error('tts not configured');
}
