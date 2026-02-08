'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUploadedMediaInputSchema = z.object({
  mediaDataUri: z.string(),
  userLatitude: z.number(),
  userLongitude: z.number(),
  googleApiKey: z.string().optional(),
});

const AnalyzeUploadedMediaOutputSchema = z.object({
  incidentType: z.string(),
  severity: z.enum(['🟢 Low', '🟡 Medium', '🔴 High']),
  nearbyFireStations: z.string(),
  nearbyHospitals: z.string(),
  nearbyPoliceStations: z.string(),
  situationAnalysis: z.string(),
  precautions: z.string(),
  whatToDoNow: z.string(),
  authoritiesToBeAlerted: z.string(),
});

export type AnalyzeUploadedMediaOutput = z.infer<typeof AnalyzeUploadedMediaOutputSchema>;

export async function analyzeUploadedMediaForIncident(input: z.infer<typeof AnalyzeUploadedMediaInputSchema>) {
  // Prioritize UI Key over .env for hosted environments
  if (input.googleApiKey) {
    process.env.GOOGLE_GENAI_API_KEY = input.googleApiKey;
    process.env.GEMINI_API_KEY = input.googleApiKey;
  }

  const prompt = ai.definePrompt({
    name: 'analyzeUploadedMediaPrompt',
    input: {schema: AnalyzeUploadedMediaInputSchema},
    output: {schema: AnalyzeUploadedMediaOutputSchema},
    prompt: `Analyze the provided media at location (Lat: {{userLatitude}}, Lng: {{userLongitude}}).
    Media: {{media url=mediaDataUri}}
    Identify incident type, severity, and provide emergency instructions and nearby services.`,
  });

  const {output} = await prompt(input);
  return output!;
}
