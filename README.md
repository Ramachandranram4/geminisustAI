SustAInxt 🌱🚨
AI-Powered Sustainable Emergency Intelligence Platform

Built End-to-End with Google Gemini 3

🔥 Overview

SustAInxt is a next-generation, AI-driven emergency response platform designed for smart and sustainable cities. It enables citizens to report incidents in real time and leverages Google Gemini 3 to analyze media, assess severity, generate situational intelligence, and alert authorities—reducing response time and saving lives.

This project is 100% powered by Gemini 3 models via Genkit, aligning with SDG-11 (Sustainable Cities) and SDG-12 (Responsible Systems & Resource Optimization).

🎯 What SustAInxt Does

Analyzes images/videos of incidents using Gemini 3 Vision

Detects incident type & severity (Fire, Flood, Accident, etc.)

Provides AI-generated safety guidance in regional languages

Displays incidents on live GIS maps

Triggers automated alerts to emergency authorities

Builds a community awareness feed for transparency

✨ Key Features
🚨 Incident Intelligence

Real-time media analysis using Gemini 3 Vision

Automatic classification & severity scoring

Confidence-based decision pipeline

🧠 Situational Awareness Agent

Context-aware AI guidance

Precautions and action steps

Authority recommendations

🌍 GIS Mapping

Live incident visualization

Severity zones & nearby resources

OpenStreetMap + Leaflet integration

🌐 Multilingual Support

Auto language detection

Native-script translation (Tamil, Kannada, Hindi, Telugu, etc.)

Gemini 3 language intelligence

📢 Authority Alert System

Automated SMS / voice alerts

Location + severity attached

Fail-safe notification flow

🧠 Why Gemini 3
Gemini 3 Capability	How SustAInxt Uses It
Vision Intelligence	Incident detection from images/videos
Multimodal Reasoning	Context + severity understanding
Language Models	Situational explanation & guidance
Translation	Regional language support
Text-to-Speech	AI voice alerts for authorities

All AI logic in SustAInxt is exclusively implemented using Gemini 3 models.

🏗️ Technology Stack
AI & Intelligence

Google Gemini 3 Flash

Google Genkit

Frontend

Next.js 15 (App Router)

React 18

TypeScript

Tailwind CSS

ShadCN UI

Mapping & Visualization

OpenStreetMap

Leaflet / React-Leaflet

Communication

Twilio (SMS & voice alerts – optional)

Cloud & Deployment

Vercel (Serverless deployment)

🗂️ Project Structure
src/
├── app/                # App router pages
├── ai/                 # Genkit + Gemini 3 flows
├── components/         # UI components
├── lib/                # Utilities (location, helpers)
├── hooks/              # Custom React hooks
├── types/              # Type definitions
public/
.env.example
README.md

🚀 Getting Started (Local)
1️⃣ Clone the Repository
git clone <your-repo-url>
cd SustAInxt

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create .env:

GEMINI_API_KEY=your_gemini_3_api_key
GOOGLE_GENAI_API_KEY=your_google_genai_key

4️⃣ Run the App
npm run dev


Open:
👉 http://localhost:9002

🔄 End-to-End Flow
Upload Media
→ Gemini 3 Vision Analysis
→ Severity Classification
→ Situational Intelligence
→ Multilingual Translation
→ GIS Visualization
→ Authority Alert
→ Community Feed

🌱 Sustainability Impact

Faster emergency response = lower human & environmental loss

Optimized resource dispatch = reduced wastage

Community intelligence = resilient cities

Open mapping = sustainable infrastructure

📱 Supported Platforms

Web (Desktop & Mobile)

Android (PWA-ready)

iOS (PWA-ready)

📄 License

SustAInxt
A Sustainable AI Initiative for Smarter Cities

🏁 Status

AI Stack: Gemini 3 (100%)

Deployment: Vercel
