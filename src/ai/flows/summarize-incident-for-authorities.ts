'use server';
/**
 * @fileOverview Summarizes an incident for an Emergency Dispatch Agent.
 * Maps global location to native languages for voice dispatch.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeForAuthorityInputSchema = z.object({
  incidentType: z.string(),
  location: z.string(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  severity: z.string(),
  situationAnalysis: z.string(),
});

const SummarizeForAuthorityOutputSchema = z.object({
  summary: z.string().describe('Plain text emergency message in native script.'),
  language: z.string().describe('The language used.'),
});

const getTargetLanguage = (city?: string, state?: string, country?: string) => {
  const c = (city || '').toLowerCase();
  const s = (state || '').toLowerCase();
  const co = (country || '').toLowerCase();

  // Global Mappings
  if (co.includes('china') || c.includes('beijing') || c.includes('shanghai')) return 'Chinese';
  if (co.includes('japan') || c.includes('tokyo') || c.includes('osaka')) return 'Japanese';
  if (co.includes('germany') || c.includes('berlin') || c.includes('munich')) return 'German';
  if (co.includes('france') || c.includes('paris')) return 'French';
  if (co.includes('brazil') || co.includes('portugal')) return 'Portuguese';
  if (co.includes('spain') || co.includes('madrid') || co.includes('mexico') || co.includes('argentina')) return 'Spanish';
  if (co.includes('italy') || c.includes('rome') || c.includes('milan')) return 'Italian';
  if (co.includes('russia') || c.includes('moscow')) return 'Russian';
  if (co.includes('korea') || c.includes('seoul')) return 'Korean';

  // Indian States
  if (c.includes('bengaluru') || c.includes('bangalore') || s.includes('karnataka')) return 'Kannada';
  if (c.includes('chennai') || s.includes('tamil')) return 'Tamil';
  if (s.includes('maharashtra') || c.includes('mumbai') || c.includes('pune')) return 'Marathi';
  if (c.includes('hyderabad') || s.includes('telangana') || s.includes('andhra')) return 'Telugu';
  if (s.includes('west bengal') || c.includes('kolkata')) return 'Bengali';
  if (s.includes('gujarat')) return 'Gujarati';
  if (s.includes('kerala')) return 'Malayalam';
  if (s.includes('delhi') || s.includes('uttar') || s.includes('bihar') || s.includes('haryana')) return 'Hindi';
  
  return 'English';
};

export async function summarizeIncidentForAuthorities(input: z.infer<typeof SummarizeForAuthorityInputSchema>) {
  const language = getTargetLanguage(input.city, input.state, input.country);
  
  const prompt = ai.definePrompt({
    name: 'summarizeForAuthorityPrompt',
    input: {schema: SummarizeForAuthorityInputSchema},
    output: {schema: SummarizeForAuthorityOutputSchema},
    system: `You are an Emergency Dispatch Voice Agent. 
    Your job is to generate a calm, authoritative emergency voice message ONLY in the native script of ${language}.
    
    CRITICAL RULES:
    1. Output MUST be plain text only (no markdown).
    2. Use ONLY the native script of the selected language (e.g., Simplified Chinese characters for Chinese, Kanji/Kana for Japanese, Devanagari for Hindi).
    3. Do NOT use English characters or words.
    4. Do NOT mention AI or internal systems.
    
    Structure:
    - Emergency alert statement (e.g., "This is an emergency alert.")
    - Location confirmation
    - Incident type
    - Immediate instruction`,
    prompt: `Generate the emergency brief in the native script of ${language}.
    
    Location: {{{location}}}
    Incident: {{{incidentType}}}
    Severity: {{{severity}}}
    Context: {{{situationAnalysis}}}`,
  });

  const {output} = await prompt(input);
  return {
    summary: output!.summary,
    language: language
  };
}
