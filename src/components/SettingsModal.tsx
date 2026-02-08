
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Terminal,
  Save,
  Key,
  Cpu,
  Lock,
  Loader2
} from 'lucide-react';

const DEFAULT_CONFIG = {
  accountSid: '',
  authToken: '',
  from: '',
  to: '',
  googleApiKey: '',
  geminiApiKey: '',
};

export function SettingsModal({ isOpen, onClose }: any) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [showSid, setShowSid] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('sentinel_dispatch_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        localStorage.setItem('sentinel_dispatch_config', JSON.stringify(DEFAULT_CONFIG));
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('sentinel_dispatch_config', JSON.stringify(config));
    
    toast({
      title: "COMMAND PROTOCOLS UPDATED",
      description: "Tactical credentials synchronized with matrix core successfully.",
    });
    
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#0a0a0a] border-white/10 shadow-3xl p-8 rounded-[2.5rem]">
        <DialogHeader className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Terminal className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-white tracking-tighter text-2xl font-black uppercase">Command Center</DialogTitle>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Strategic Matrix Config</p>
            </div>
          </div>
          <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 pt-4 leading-relaxed">
            Configure SustAInex Intelligence and Global Dispatch Uplink. UI settings take absolute priority over backend defaults.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 max-h-[50vh] overflow-y-auto px-1 custom-scrollbar">
          <div className="space-y-5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Intelligence Matrix
            </h4>
            
            <div className="space-y-2">
              <Label className="text-[9px] uppercase font-black tracking-widest text-white/40 flex items-center gap-2">
                <Cpu className="w-3 h-3" /> Google GenAI API Key
              </Label>
              <div className="relative">
                <Input 
                  type={showGoogleKey ? "text" : "password"} 
                  value={config.googleApiKey} 
                  onChange={(e) => setConfig({ ...config, googleApiKey: e.target.value })} 
                  className="h-12 bg-white/5 border-white/10 text-white rounded-xl pr-12 font-mono text-xs focus:ring-primary shadow-inner" 
                />
                <button onClick={() => setShowGoogleKey(!showGoogleKey)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-primary transition-colors">
                  {showGoogleKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[9px] uppercase font-black tracking-widest text-white/40 flex items-center gap-2">
                <Key className="w-3 h-3" /> Gemini API Key
              </Label>
              <div className="relative">
                <Input 
                  type={showGeminiKey ? "text" : "password"} 
                  value={config.geminiApiKey} 
                  onChange={(e) => setConfig({ ...config, geminiApiKey: e.target.value })} 
                  className="h-12 bg-white/5 border-white/10 text-white rounded-xl pr-12 font-mono text-xs focus:ring-primary shadow-inner" 
                />
                <button onClick={() => setShowGeminiKey(!showGeminiKey)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-primary transition-colors">
                  {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-5 pt-6 border-t border-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5" /> Global Dispatch Uplink
            </h4>
            
            <div className="space-y-2">
              <Label className="text-[9px] uppercase font-black tracking-widest text-white/40 flex items-center gap-2">
                <Key className="w-3 h-3" /> Twilio Account SID
              </Label>
              <div className="relative">
                <Input type={showSid ? "text" : "password"} value={config.accountSid} onChange={(e) => setConfig({ ...config, accountSid: e.target.value })} className="h-12 bg-white/5 border-white/10 text-white rounded-xl font-mono text-xs" />
                <button onClick={() => setShowSid(!showSid)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-primary transition-colors">
                  {showSid ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[9px] uppercase font-black tracking-widest text-white/40 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Twilio Auth Token
              </Label>
              <div className="relative">
                <Input type={showToken ? "text" : "password"} value={config.authToken} onChange={(e) => setConfig({ ...config, authToken: e.target.value })} className="h-12 bg-white/5 border-white/10 text-white rounded-xl font-mono text-xs" />
                <button onClick={() => setShowToken(!showToken)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-primary transition-colors">
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[9px] uppercase font-black tracking-widest text-white/40">From Number</Label>
                <Input value={config.from} onChange={(e) => setConfig({ ...config, from: e.target.value })} placeholder="+123456789" className="h-12 bg-white/5 border-white/10 text-white rounded-xl font-mono text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] uppercase font-black tracking-widest text-white/40">Alert Recipient</Label>
                <Input value={config.to} onChange={(e) => setConfig({ ...config, to: e.target.value })} placeholder="+123456789" className="h-12 bg-white/5 border-white/10 text-white rounded-xl font-mono text-xs" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-10">
          <Button onClick={handleSave} disabled={isSaving} className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl gap-3 transition-all active:scale-95 border-0">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? 'Configuring...' : 'Synchronize Protocols'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
