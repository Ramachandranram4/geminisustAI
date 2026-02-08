'use server';

/**
 * @fileOverview This file defines a Genkit flow for classifying the severity of an incident based on user-uploaded media.
 *
 * - classifyIncidentSeverity - A function that classifies the incident severity.
 * - ClassifyIncidentSeverityInput - The input type for the classifyIncidentSeverity function.
 * - ClassifyIncidentSeverityOutput - The return type for the classifyIncidentSeverity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyIncidentSeverityInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A photo or video of the incident, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  incidentType: z.string().describe('The type of incident (e.g., fire, flood, accident).'),
  locationDescription: z.string().describe('A description of the incident location.'),
});
export type ClassifyIncidentSeverityInput = z.infer<typeof ClassifyIncidentSeverityInputSchema>;

const ClassifyIncidentSeverityOutputSchema = z.object({
  severity: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The severity level of the incident (Low, Medium, or High).'),
  reasoning: z
    .string()
    .describe('The reasoning behind the assigned severity level, based on the image and other factors.'),
});
export type ClassifyIncidentSeverityOutput = z.infer<typeof ClassifyIncidentSeverityOutputSchema>;

export async function classifyIncidentSeverity(
  input: ClassifyIncidentSeverityInput
): Promise<ClassifyIncidentSeverityOutput> {
  return classifyIncidentSeverityFlow(input);
}

const classifyIncidentSeverityPrompt = ai.definePrompt({
  name: 'classifyIncidentSeverityPrompt',
  input: {schema: ClassifyIncidentSeverityInputSchema},
  output: {schema: ClassifyIncidentSeverityOutputSchema},
  prompt: `You are an AI agent for a smart-city disaster response platform. Your task is to classify the severity of an incident based on the provided information.

  Here's the information about the incident:

  Incident Type: {{{incidentType}}}
  Location Description: {{{locationDescription}}}
  Media: {{media url=mediaDataUri}}

  Based on this information, classify the incident severity as Low, Medium, or High.  Low severity indicates awareness only, Medium indicates precaution needed, and High indicates emergency response required. Explain your reasoning for the assigned severity level.
  IMPORTANT: Respond with a JSON object that strictly adheres to the output schema.`,
});

const classifyIncidentSeverityFlow = ai.defineFlow(
  {
    name: 'classifyIncidentSeverityFlow',
    inputSchema: ClassifyIncidentSeverityInputSchema,
    outputSchema: ClassifyIncidentSeverityOutputSchema,
  },
  async input => {
    const {output} = await classifyIncidentSeverityPrompt(input);
    return output!;
  }
);
