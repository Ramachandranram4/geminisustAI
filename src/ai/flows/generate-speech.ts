'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const GenerateSpeechInputSchema = z.object({
  text: z.string().describe('The emergency summary text to convert to speech.'),
  language: z.string().describe('The target language name.'),
  googleApiKey: z.string().optional(),
});

const GenerateSpeechOutputSchema = z.object({
  media: z.string().describe('The base64 encoded audio in data URI format.'),
});

export async function generateSpeech(input: z.infer<typeof GenerateSpeechInputSchema>) {
  if (input.googleApiKey) {
    process.env.GOOGLE_GENAI_API_KEY = input.googleApiKey;
    process.env.GEMINI_API_KEY = input.googleApiKey;
  }
  return generateSpeechFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: GenerateSpeechInputSchema,
    outputSchema: GenerateSpeechOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: `Speak this emergency report clearly in ${input.language}. Ensure the pronunciation is accurate for the native script: ${input.text}`,
    });

    if (!media) {
      throw new Error('No media returned from TTS engine');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      media: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
