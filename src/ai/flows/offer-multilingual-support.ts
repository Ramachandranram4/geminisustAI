'use server';
/**
 * @fileOverview Global multilingual support for emergency communications.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultilingualSupportInputSchema = z.object({
  city: z.string().describe('The city of the incident.'),
  state: z.string().describe('The state of the incident.'),
  country: z.string().optional().describe('The country of the incident.'),
  situationAnalysis: z.string().describe('The analysis of the situation.'),
  precautions: z.string().describe('The precautions to take.'),
  whatToDoNow: z.string().describe('Step-by-step guidance for the user.'),
  targetLanguage: z.string().optional().describe('Manually specified target language.'),
  googleApiKey: z.string().optional(),
});
export type MultilingualSupportInput = z.infer<typeof MultilingualSupportInputSchema>;

const MultilingualSupportOutputSchema = z.object({
  translatedSituationAnalysis: z.string().describe('The translated analysis of the situation.'),
  translatedPrecautions: z.string().describe('The translated precautions to take.'),
  translatedWhatToDoNow: z.string().describe('The translated step-by-step guidance for the user.'),
  language: z.string().describe('The language used for translation.'),
});
export type MultilingualSupportOutput = z.infer<typeof MultilingualSupportOutputSchema>;

export async function detectAndTranslate(input: MultilingualSupportInput): Promise<MultilingualSupportOutput> {
  if (input.googleApiKey) {
    process.env.GOOGLE_GENAI_API_KEY = input.googleApiKey;
    process.env.GEMINI_API_KEY = input.googleApiKey;
  }
  return multilingualSupportFlow(input);
}

const getGlobalLanguage = (city: string, state: string, country?: string, target?: string): string => {
  if (target && target !== 'Regional Language' && target !== 'Hindi' && target !== 'English') return target;
  
  const c = (city || '').toLowerCase();
  const s = (state || '').toLowerCase();
  const co = (country || '').toLowerCase();

  // Indian States
  if (s.includes('tamil') || c.includes('chennai')) return 'Tamil';
  if (s.includes('karnataka') || c.includes('bangalore') || c.includes('bengaluru')) return 'Kannada';
  if (s.includes('maharashtra') || c.includes('mumbai') || c.includes('pune')) return 'Marathi';
  if (s.includes('telangana') || s.includes('andhra') || c.includes('hyderabad')) return 'Telugu';
  if (s.includes('west bengal') || c.includes('kolkata')) return 'Bengali';
  if (s.includes('gujarat') || c.includes('ahmedabad')) return 'Gujarati';
  if (s.includes('kerala') || c.includes('kochi')) return 'Malayalam';
  if (s.includes('delhi') || s.includes('uttar') || s.includes('bihar') || s.includes('haryana')) return 'Hindi';

  // Global Fallbacks
  if (co.includes('china') || c.includes('beijing') || c.includes('shanghai')) return 'Chinese';
  if (co.includes('japan') || c.includes('tokyo') || c.includes('osaka')) return 'Japanese';
  if (co.includes('france') || c.includes('paris')) return 'French';
  if (co.includes('germany') || c.includes('berlin')) return 'German';
  if (co.includes('spain') || co.includes('madrid') || co.includes('mexico')) return 'Spanish';
  if (co.includes('italy') || c.includes('rome')) return 'Italian';
  if (co.includes('russia') || c.includes('moscow')) return 'Russian';
  if (co.includes('brazil') || co.includes('portugal')) return 'Portuguese';
  
  return 'English';
};

const prompt = ai.definePrompt({
  name: 'multilingualSupportPrompt',
  input: {
    schema: z.object({
      language: z.string(),
      situationAnalysis: z.string(),
      precautions: z.string(),
      whatToDoNow: z.string(),
    })
  },
  output: {schema: MultilingualSupportOutputSchema},
  prompt: `You are an expert translator specializing in emergency communications. 

CRITICAL: You MUST translate the following emergency information into the native script of {{language}}. 
- Tamil -> Tamil script
- Kannada -> Kannada script
- Hindi -> Devanagari script
- Chinese -> Simplified Chinese Characters
- Japanese -> Kanji/Kana
- Arabic -> Arabic script
- etc.

Do NOT use Romanized characters. Use the actual native characters.

Information to Translate:
Situation: {{{situationAnalysis}}}
Precautions: {{{precautions}}}
Instructions: {{{whatToDoNow}}}

Response must be a valid JSON object matching the output schema.`,
});

const multilingualSupportFlow = ai.defineFlow(
  {
    name: 'multilingualSupportFlow',
    inputSchema: MultilingualSupportInputSchema,
    outputSchema: MultilingualSupportOutputSchema,
  },
  async input => {
    let language = 'English';
    if (input.targetLanguage === 'Hindi') {
      language = 'Hindi';
    } else if (input.targetLanguage === 'English') {
      language = 'English';
    } else {
      language = getGlobalLanguage(input.city, input.state, input.country, input.targetLanguage);
    }
    
    const {output} = await prompt({
      language: language,
      situationAnalysis: input.situationAnalysis,
      precautions: input.precautions,
      whatToDoNow: input.whatToDoNow,
    });

    if (!output) throw new Error('Translation failed');

    return {
      ...output,
      language: language,
    };
  }
);
