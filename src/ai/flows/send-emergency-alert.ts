'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import twilio from 'twilio';
import { v2 as cloudinary } from 'cloudinary';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

cloudinary.config({
  cloud_name: "dc2yhdum9",
  api_key: "214136869737145",
  api_secret: "Romw1tK3XL-Nuy_NVV7ltQfLTto"
});

const TwilioAlertInputSchema = z.object({
  message: z.string().describe('The emergency summary text in native script.'),
  language: z.string().describe('The language name (e.g., Kannada, Tamil, Hindi).'),
  credentials: z.object({
    accountSid: z.string(),
    authToken: z.string(),
    from: z.string(),
    to: z.string(),
  }),
  googleApiKey: z.string().optional(),
});

async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({ channels, sampleRate: rate, bitDepth: sampleWidth * 8 });
    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', d => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs)));
    writer.write(pcmData);
    writer.end();
  });
}

export async function sendEmergencyAlert(input: z.infer<typeof TwilioAlertInputSchema>) {
  if (input.googleApiKey) {
    process.env.GOOGLE_GENAI_API_KEY = input.googleApiKey;
    process.env.GEMINI_API_KEY = input.googleApiKey;
  }
  return sendEmergencyAlertFlow(input);
}

const sendEmergencyAlertFlow = ai.defineFlow(
  { name: 'sendEmergencyAlertFlow', inputSchema: TwilioAlertInputSchema },
  async (input) => {
    const { accountSid, authToken, from, to } = input.credentials;
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Algenib' } } } },
      prompt: `Speak this emergency report clearly in ${input.language}. Ensure native pronunciation for: ${input.message}`,
    });

    if (!media) throw new Error('TTS Failed');

    const audioBuffer = Buffer.from(media.url.split(',')[1], 'base64');
    const wavBuffer = await toWav(audioBuffer);
    const wavBase64 = `data:audio/wav;base64,${wavBuffer.toString('base64')}`;

    const uploadResult = await cloudinary.uploader.upload(wavBase64, { resource_type: 'video', folder: 'sentinel' });
    const audioUrl = uploadResult.secure_url;

    const client = twilio(accountSid, authToken);
    const call = await client.calls.create({
      twiml: `<Response><Play>${audioUrl}</Play></Response>`,
      to: to,
      from: from,
    });

    return { success: true, callSid: call.sid };
  }
);
