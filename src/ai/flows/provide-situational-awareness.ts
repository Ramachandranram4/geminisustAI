'use server';

/**
 * @fileOverview A conversational AI agent that explains the detected situation,
 * offers tailored precautions, and guides the user through appropriate actions.
 *
 * - provideSituationalAwareness - A function that provides situational awareness information.
 * - ProvideSituationalAwarenessInput - The input type for the provideSituationalAwareness function.
 * - ProvideSituationalAwarenessOutput - The return type for the provideSituationalAwareness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideSituationalAwarenessInputSchema = z.object({
  incidentType: z
    .string()
    .describe("The type of incident detected (e.g., 'Fire accident', 'Flood')."),
  locationCity: z.string().describe('The city where the incident occurred.'),
  locationState: z.string().describe('The state where the incident occurred.'),
  latitude: z.number().describe('The latitude of the incident location.'),
  longitude: z.number().describe('The longitude of the incident location.'),
  severityLevel: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The severity level of the incident.'),
  nearbyFireStations: z
    .string()
    .describe('List of nearby fire stations with distances.'),
  nearbyHospitals: z.string().describe('List of nearby hospitals with distances.'),
  nearbyPoliceStations: z
    .string()
    .describe('List of nearby police stations with distances.'),
});

export type ProvideSituationalAwarenessInput = z.infer<
  typeof ProvideSituationalAwarenessInputSchema
>;

const ProvideSituationalAwarenessOutputSchema = z.object({
  situationAnalysis: z.string().describe('Explanation of the situation.'),
  precautions: z.string().describe('Immediate safety measures for civilians.'),
  whatToDoNow: z.string().describe('Step-by-step guidance for the user.'),
  authorityAlertRecommendation: z
    .string()
    .describe('Recommendation of which authorities should be alerted.'),
});

export type ProvideSituationalAwarenessOutput = z.infer<
  typeof ProvideSituationalAwarenessOutputSchema
>;

export async function provideSituationalAwareness(
  input: ProvideSituationalAwarenessInput
): Promise<ProvideSituationalAwarenessOutput> {
  return provideSituationalAwarenessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideSituationalAwarenessPrompt',
  input: {schema: ProvideSituationalAwarenessInputSchema},
  output: {schema: ProvideSituationalAwarenessOutputSchema},
  prompt: `Detected Incident: {{{incidentType}}}\nSeverity Level: {{{severityLevel}}}\n\nDetected Location: {{{locationCity}}}, {{{locationState}}}\nLatitude: {{{latitude}}}\nLongitude: {{{longitude}}}\n\nSituation Analysis: {{situationAnalysis}}\n\nPrecautions: {{precautions}}\n\nWhat To Do Now: {{whatToDoNow}}\n\nNearby Emergency Services:\n{{nearbyFireStations}}\n{{nearbyHospitals}}\n{{nearbyPoliceStations}}\n\nAuthority Alert Recommendation: {{authorityAlertRecommendation}}`,
  system: `You are an AI Emergency Situation Intelligence Agent for a smart-city disaster response platform. Provide clear, concise, and actionable information to the user based on the detected incident, location, and severity. Always speak in a professional, calm, and emergency-ready tone. Do not be casual. Speak like a city emergency intelligence system.`,
});

const provideSituationalAwarenessFlow = ai.defineFlow(
  {
    name: 'provideSituationalAwarenessFlow',
    inputSchema: ProvideSituationalAwarenessInputSchema,
    outputSchema: ProvideSituationalAwarenessOutputSchema,
  },
  async input => {
    const {
      incidentType,
      locationCity,
      locationState,
      latitude,
      longitude,
      severityLevel,
      nearbyFireStations,
      nearbyHospitals,
      nearbyPoliceStations,
    } = input;

    const incidentDetails = {
      Fire: {
        situationAnalysis:
          'A fire incident has been detected. This is dangerous due to potential burns, smoke inhalation, and structural collapse.',
        precautions:
          'Stay low to the ground to avoid smoke inhalation. Cover your mouth and nose with a damp cloth. Evacuate immediately if possible.',
        whatToDoNow:
          '1. Evacuate the building immediately. 2. Call the fire department. 3. Assist others in evacuating if it is safe to do so.',
        authorityAlertRecommendation:
          'Alert the Fire & Rescue Department immediately. Also, alert Emergency Medical Services in case of injuries.',
      },
      Flood: {
        situationAnalysis:
          'A flood incident has been detected. This is dangerous due to potential drowning, electrocution, and waterborne diseases.',
        precautions:
          'Move to higher ground immediately. Avoid contact with floodwater. Turn off electricity if it is safe to do so.',
        whatToDoNow:
          '1. Move to the highest level of the building. 2. Wait for emergency responders. 3. Avoid walking or driving through floodwater.',
        authorityAlertRecommendation:
          'Alert the Flood Control Department and Emergency Medical Services due to potential injuries or health hazards.',
      },
      Accident: {
        situationAnalysis:
          'A road accident has been detected. This may cause injuries and traffic congestion.',
        precautions:
          'If you are near the accident, maintain a safe distance. Do not obstruct emergency responders. If involved, check for injuries and call for help.',
        whatToDoNow:
          '1. If involved, call emergency services. 2. Provide first aid if trained. 3. Stay calm and assist authorities.',
        authorityAlertRecommendation:
          'Alert the Police Department and Emergency Medical Services immediately.',
      },
      Collapse: {
        situationAnalysis:
          'A building collapse has been detected. This is extremely dangerous due to potential for serious injuries or fatalities from falling debris.',
        precautions:
          'Evacuate immediately to a safe distance. Watch out for falling debris and power lines.',
        whatToDoNow:
          '1. Clear the area immediately. 2. Assist in rescuing trapped individuals if safe. 3. Alert emergency services.',
        authorityAlertRecommendation:
          'Alert Fire & Rescue Department and Emergency Medical Services to search for survivors and provide medical aid.',
      },
      Crowd: {
        situationAnalysis:
          'A crowd hazard incident has been detected. Large gatherings can become dangerous due to trampling or stampede risks.',
        precautions:
          'Maintain situational awareness. Stay on the edges of the crowd. Identify escape routes.',
        whatToDoNow:
          '1. Avoid entering crowded areas if possible. 2. Stay calm and move with the flow of the crowd. 3. If feeling overwhelmed, move to an exit.',
        authorityAlertRecommendation:
          'Alert the Police Department to monitor and manage the crowd to prevent escalating dangers.',
      },
      Environmental: {
        situationAnalysis:
          'An environmental risk has been detected, such as a chemical spill. This poses health risks to the population.',
        precautions:
          'Avoid the affected area. Stay indoors if possible. Seal windows and doors.',
        whatToDoNow:
          '1. Follow instructions from local authorities. 2. Evacuate if instructed to do so. 3. Seek medical attention if exposed.',
        authorityAlertRecommendation:
          'Alert environmental protection agencies and emergency medical services for monitoring and response.',
      },
    }[incidentType.split(' ')[0]];

    const {output} = await prompt({
      incidentType,
      locationCity,
      locationState,
      latitude,
      longitude,
      severityLevel,
      nearbyFireStations,
      nearbyHospitals,
      nearbyPoliceStations,
      situationAnalysis: incidentDetails?.situationAnalysis || 'No analysis available.',
      precautions: incidentDetails?.precautions || 'No precautions available.',
      whatToDoNow: incidentDetails?.whatToDoNow || 'No guidance available.',
      authorityAlertRecommendation:
        incidentDetails?.authorityAlertRecommendation || 'No recommendation available.',
    });
    return output!;
  }
);
