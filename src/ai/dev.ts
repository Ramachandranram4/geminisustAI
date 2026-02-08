import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-uploaded-media-for-incident.ts';
import '@/ai/flows/classify-incident-severity.ts';
import '@/ai/flows/offer-multilingual-support.ts';
import '@/ai/flows/provide-situational-awareness.ts';
import '@/ai/flows/send-emergency-alert.ts';
import '@/ai/flows/summarize-incident-for-authorities.ts';
