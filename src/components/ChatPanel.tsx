
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  PhoneCall, 
  AlertTriangle, 
  Volume2, 
  Activity, 
  Zap, 
  RotateCcw, 
  Loader2,
  Globe,
  Camera,
  Film
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { generateSpeech } from '@/ai/flows/generate-speech';
import { detectAndTranslate, MultilingualSupportOutput } from '@/ai/flows/offer-multilingual-support';
import { sendEmergencyAlert } from '@/ai/flows/send-emergency-alert';

export function ChatPanel({ data, onReset, location, uploadedMedia }: any) {
  const [selectedLang, setSelectedLang] = useState<'English' | 'Regional Language' | 'Hindi'>('Regional Language');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [translatedData, setTranslatedData] = useState<MultilingualSupportOutput | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function performTranslation() {
      setIsTranslating(true);
      try {
        const configStr = localStorage.getItem('sentinel_dispatch_config');
        const config = configStr ? JSON.parse(configStr) : {};
        const apiKey = config.googleApiKey || config.geminiApiKey;
        
        const result = await detectAndTranslate({
          city: location.city || 'Chennai',
          state: location.state || 'Tamil Nadu',
          country: location.country || 'India',
          situationAnalysis: data.situationAnalysis,
          precautions: data.precautions,
          whatToDoNow: data.whatToDoNow,
          targetLanguage: selectedLang,
          googleApiKey: apiKey
        });
        setTranslatedData(result);
      } catch (error: any) {
        const isAuthError = error.message?.toLowerCase().includes('key') || error.message?.toLowerCase().includes('api');
        toast({ 
          variant: "destructive", 
          title: isAuthError ? "TRANSLATION CREDENTIAL ERROR" : "TRANSLATION ERROR", 
          description: isAuthError ? "Invalid API Key in settings. Please update your Command protocols." : "Matrix failed to localize data." 
        });
      } finally {
        setIsTranslating(false);
      }
    }
    performTranslation();
  }, [data, location, selectedLang]);

  const handleSpeak = async () => {
    if (isSpeaking || !translatedData) return;
    setIsSpeaking(true);
    try {
      const configStr = localStorage.getItem('sentinel_dispatch_config');
      const config = configStr ? JSON.parse(configStr) : {};
      const apiKey = config.googleApiKey || config.geminiApiKey;
      
      const text = `${translatedData.translatedSituationAnalysis}. ${translatedData.translatedPrecautions}`;
      const response = await generateSpeech({ 
        text, 
        language: translatedData.language,
        googleApiKey: apiKey 
      });
      const audio = new Audio(response.media);
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch (error: any) {
      setIsSpeaking(false);
      const isAuthError = error.message?.toLowerCase().includes('key') || error.message?.toLowerCase().includes('api');
      toast({ 
        variant: "destructive", 
        title: isAuthError ? "VOICE CREDENTIAL ERROR" : "AUDIO ERROR", 
        description: isAuthError ? "Check your Gemini/GenAI key in settings." : error.message 
      });
    }
  };

  const handleDispatch = async () => {
    const configStr = localStorage.getItem('sentinel_dispatch_config');
    if (!configStr) {
      toast({ variant: "destructive", title: "CONFIG MISSING", description: "Set Twilio credentials in command settings." });
      return;
    }

    setIsDispatching(true);
    try {
      const credentials = JSON.parse(configStr);
      
      if (!credentials.accountSid || !credentials.authToken) {
        throw new Error("Twilio credentials incomplete. Configure Account SID and Auth Token in settings.");
      }

      if (!credentials.from || !credentials.to) {
        throw new Error("Phone numbers missing. Set 'From Number' and 'Alert Recipient' in command settings.");
      }

      const message = `${translatedData?.translatedSituationAnalysis || data.situationAnalysis}. Emergency Location: ${location.city}. Incident Type: ${data.incidentType}.`;
      
      await sendEmergencyAlert({
        message,
        language: translatedData?.language || 'English',
        credentials,
        googleApiKey: credentials.googleApiKey || credentials.geminiApiKey
      });

      toast({ title: "DISPATCH SUCCESS", description: "Emergency voice uplink established with regional dispatcher." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "DISPATCH FAILED", description: error.message });
    } finally {
      setIsDispatching(false);
    }
  };

  const isVideo = uploadedMedia?.startsWith('data:video');

  return (
    <div className="h-full flex flex-col glass-card rounded-[3.5rem] overflow-hidden border border-white/5 animate-in slide-in-from-right duration-700 shadow-3xl bg-black/40">
      <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-white">SustAInex Core</h2>
            <span className="text-[7px] font-black text-primary uppercase tracking-[0.3em] mt-0.5">Tactical Analysis</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedLang} onValueChange={(val: any) => setSelectedLang(val)}>
            <SelectTrigger className="w-[120px] h-8 bg-white/5 border-white/10 text-[8px] font-black uppercase tracking-[0.1em] rounded-lg">
              <Globe className="w-3 h-3 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white rounded-lg z-[2001]">
              <SelectItem value="English" className="text-[9px] font-black uppercase">English</SelectItem>
              <SelectItem value="Regional Language" className="text-[9px] font-black uppercase">Regional</SelectItem>
              <SelectItem value="Hindi" className="text-[9px] font-black uppercase">Hindi</SelectItem>
            </SelectContent>
          </Select>
          <button onClick={onReset} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
            <RotateCcw className="w-3.5 h-3.5 text-white/40" />
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-5">
        <div className="py-5 space-y-6">
          {uploadedMedia && (
            <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-xl group/media">
              {isVideo ? (
                <video src={uploadedMedia} className="w-full h-full object-cover" autoPlay muted loop />
              ) : (
                <img src={uploadedMedia} alt="Incident Preview" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />
              <div className="absolute top-4 left-4 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/90">Visual Feed Locked</span>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-1.5">
                 <Badge variant="outline" className="bg-black/40 border-white/10 backdrop-blur-md text-[7px] font-black py-0.5 px-2 tracking-widest text-white/80">
                   {isVideo ? <Film className="w-2.5 h-2.5 mr-1 text-primary" /> : <Camera className="w-2.5 h-2.5 mr-1 text-primary" />}
                   {isVideo ? 'MOTION LOG' : 'STILL FRAME'}
                 </Badge>
              </div>
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                   <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-white">
                  {data.incidentType}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="text-[8px] font-black uppercase border-red-500/30 text-red-500 bg-red-500/5 px-3 py-0.5 tracking-widest rounded-full">
                  SEVERITY: {data.severity}
                </Badge>
                <div className="flex items-center gap-1.5 text-[8px] font-black text-white/30 uppercase tracking-[0.1em]">
                  <Activity className="w-2.5 h-2.5" /> {location.city}
                </div>
              </div>
            </div>
            <Button onClick={handleSpeak} disabled={isSpeaking || isTranslating} variant="ghost" className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-primary transition-all group shadow-lg">
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : 'text-primary'}`} />
            </Button>
          </div>

          <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden shadow-xl space-y-6">
             {isTranslating && (
               <div className="absolute inset-0 bg-black/80 backdrop-blur-xl z-20 flex flex-col items-center justify-center gap-3">
                 <Loader2 className="w-8 h-8 animate-spin text-primary" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Translating Data...</span>
               </div>
             )}
             
             <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <Activity className="w-3 h-3 text-primary" />
                   <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/70">Situation Analysis</h4>
                </div>
                <p className="text-[0.95rem] text-white font-bold leading-relaxed">
                  {translatedData?.translatedSituationAnalysis || data.situationAnalysis}
                </p>
             </div>

             <div className="pt-6 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-2">
                   <Zap className="w-3 h-3 text-primary" />
                   <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/70">Safety Protocols</h4>
                </div>
                <p className="text-[0.95rem] text-white font-bold leading-relaxed">
                  {translatedData?.translatedPrecautions || data.precautions}
                </p>
             </div>
          </div>

          <div className="space-y-4 pb-4">
            <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 px-1">Nearby Response Grid</h4>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: "DM CENTER", dist: "0.8km", icon: "🏢" },
                { name: "FIRE STATION", dist: "1.2km", icon: "🚒" },
                { name: "HOSPITAL", dist: "1.5km", icon: "🏥" },
                { name: "POLICE HUB", dist: "0.5km", icon: "👮" },
              ].map((auth, idx) => (
                <div key={idx} className="p-4 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all text-left shadow-md">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{auth.icon}</span>
                    <span className="text-[9px] font-black uppercase text-white/90 leading-none">{auth.name}</span>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[7px] font-black px-1.5 py-0 rounded-md">
                    {auth.dist}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-5 pt-0 shrink-0">
        <Button 
          onClick={handleDispatch}
          disabled={isDispatching || isTranslating}
          className="w-full h-16 rounded-[1.8rem] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-base gap-4 shadow-2xl border-0 active:scale-98 transition-all"
        >
          {isDispatching ? <Loader2 className="w-6 h-6 animate-spin" /> : <PhoneCall className="w-6 h-6" />}
          <span>{isDispatching ? 'Initiating Uplink...' : 'Ops Dispatch System'}</span>
        </Button>
      </div>
    </div>
  );
}
