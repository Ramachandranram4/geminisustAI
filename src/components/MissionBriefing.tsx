"use client";

import React from 'react';
import { 
  Shield, 
  Cpu, 
  Globe, 
  Zap, 
  Map as MapIcon, 
  PhoneCall, 
  Database,
  Layers,
  Search,
  Activity,
  Server,
  Workflow,
  Radio,
  History
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export function MissionBriefing({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const features = [
    { title: "Vision-AI Scan", desc: "Real-time incident detection (Fire, Flood, Accident) using Gemini 2.5 Flash vision models.", icon: <Cpu className="w-4 h-4" /> },
    { title: "Tactical GIS", desc: "Interactive OpenStreetMap visualization with real-time response unit tracking and grid-locking.", icon: <MapIcon className="w-4 h-4" /> },
    { title: "Multilingual Triad", desc: "Automated translation of emergency protocols into native scripts (Devanagari, Tamil, Kanji, etc.).", icon: <Globe className="w-4 h-4" /> },
    { title: "AI Voice Dispatch", desc: "Regional voice briefs generated via Gemini TTS and delivered via automated Twilio uplinks.", icon: <PhoneCall className="w-4 h-4" /> },
    { title: "Tactical Archive", desc: "High-fidelity logging system with media previews, Lat/Lng telemetry, and severity matrix.", icon: <Database className="w-4 h-4" /> },
    { title: "Community Grid", desc: "Live sector activity feed showing reports from other tactical agents in the region.", icon: <Radio className="w-4 h-4" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] bg-[#0a0a0a] border-white/10 shadow-3xl p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar Navigation/Context */}
          <div className="w-[280px] border-r border-white/5 bg-black/40 p-8 hidden lg:flex flex-col gap-8">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-black tracking-tighter text-white">SustAInex</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Intelligence Hub</p>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-3 text-white/40 hover:text-primary transition-colors cursor-default">
                <Layers className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Architecture</span>
              </div>
              <div className="flex items-center gap-3 text-white/40 hover:text-primary transition-colors cursor-default">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Process Flow</span>
              </div>
              <div className="flex items-center gap-3 text-white/40 hover:text-primary transition-colors cursor-default">
                <Workflow className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Strategy</span>
              </div>
            </div>

            <div className="mt-auto space-y-2">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">System Version</span>
              <p className="text-[10px] font-mono text-primary font-bold">STX-V3-ALPHA</p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <DialogHeader className="p-8 border-b border-white/5">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-black text-white uppercase tracking-tight">Project Intelligence Briefing</DialogTitle>
                <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">End-to-End Tactical Solution Breakdown</DialogDescription>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 p-8">
              <div className="space-y-12 pb-12">
                {/* Process Flow Diagram Section */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                    <Zap className="w-3 h-3" /> Process Flow Diagram
                  </h3>
                  <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                      {[
                        { step: "01", title: "Media Capture", desc: "User uploads photo/video. SustAInex Vision-AI matrix extracts visual features and severity." },
                        { step: "02", title: "Threat Context", desc: "AI calculates GPS location, regional language, and centers GIS grid on the threat epicenter." },
                        { step: "03", title: "Ops Dispatch", desc: "Multilingual Voice briefs generated via TTS and delivered via automated Twilio uplinks to authorities." }
                      ].map((step, i) => (
                        <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 relative group hover:border-primary/50 transition-all">
                          <span className="text-5xl font-black text-primary/10 absolute top-4 right-6 group-hover:text-primary/20 transition-colors">{step.step}</span>
                          <h4 className="text-[12px] font-black uppercase text-white tracking-widest mb-2">{step.title}</h4>
                          <p className="text-[10px] text-white/40 font-medium leading-relaxed">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Intelligence Modules */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                    <Radio className="w-3 h-3" /> Deployment Modules
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Radio className="w-3.5 h-3.5 text-primary" />
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Community Grid</h4>
                      </div>
                      <p className="text-[11px] text-white/60 font-medium">Real-time sector activity feed displaying mock incident data from across the smart city grid to simulate a live operational environment.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <div className="flex items-center gap-2">
                        <History className="w-3.5 h-3.5 text-primary" />
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Tactical Logs</h4>
                      </div>
                      <p className="text-[11px] text-white/60 font-medium">High-fidelity archive featuring incident thumbnails, precise Lat/Lng telemetry, and regional language records for end-to-end accountability.</p>
                    </div>
                  </div>
                </section>

                {/* Architecture Matrix */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                    <Server className="w-3 h-3" /> Architecture Layers
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Intelligence Layer</h4>
                      <p className="text-[11px] text-white/60 font-medium">Gemini 2.5 Flash Vision for detection, Gemini Flash-TTS for regional voice generation.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">GIS & Mapping</h4>
                      <p className="text-[11px] text-white/60 font-medium">Leaflet + OpenStreetMap with custom tactical overlays and coordinate telemetry.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Comms Uplink</h4>
                      <p className="text-[11px] text-white/60 font-medium">Twilio Programmable Voice for authority alerting + Cloudinary for audio report hosting.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Core Framework</h4>
                      <p className="text-[11px] text-white/60 font-medium">Next.js 15, Tailwind CSS, ShadCN UI for high-performance Command Center UI.</p>
                    </div>
                  </div>
                </section>

                {/* Key Features List */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                    <Layers className="w-3 h-3" /> Core Feature Matrix
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((f, i) => (
                      <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 items-start hover:bg-primary/5 transition-all">
                        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                          {f.icon}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-black uppercase text-white tracking-widest">{f.title}</h4>
                          <p className="text-[10px] text-white/30 font-medium leading-tight">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Strategy Note */}
                <section className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                  <div className="relative z-10 flex flex-col items-center text-center gap-4">
                    <Shield className="w-8 h-8 text-primary" />
                    <div className="space-y-2">
                      <h4 className="text-[14px] font-black text-white uppercase tracking-tighter">Mission Statement</h4>
                      <p className="text-[11px] text-white/40 max-w-xl">To empower cities with real-time intelligence that converts raw media data into life-saving response protocols, minimizing human error and maximizing efficiency during urban crises.</p>
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
