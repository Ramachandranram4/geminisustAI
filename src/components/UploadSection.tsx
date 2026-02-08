"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const UploadSection = ({ onUpload, isAnalyzing, analysisProgress }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (isAnalyzing) {
      setInternalProgress(analysisProgress);
    } else {
      setInternalProgress(0);
    }
  }, [analysisProgress, isAnalyzing]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => onUpload(e.target.result);
    reader.readAsDataURL(file);
  };

  const progressLimit = Math.min(Math.round(internalProgress), 100);

  return (
    <div className="h-full flex flex-col relative py-4 px-2">
      <div className="absolute top-0 right-2 z-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-primary text-[8px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
          <Sparkles className="w-2.5 h-2.5" />
          Satellite Grid Active
        </div>
      </div>

      <div className="mt-2 mb-4">
        <h2 className="text-[12px] font-black uppercase leading-none tracking-[0.2em] text-white">
          URBAN <span className="text-primary">SCAN</span>
        </h2>
        <p className="text-[7px] font-black uppercase text-white/20 tracking-[0.3em] mt-1.5">
          SustAInex Matrix Intelligence
        </p>
      </div>

      <Card 
        className="flex-1 relative border-2 border-dashed border-white/5 bg-white/[0.02] p-6 flex flex-col items-center justify-center rounded-[2.5rem] cursor-pointer hover:border-primary/30 transition-all group overflow-hidden"
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" className="hidden" accept="image/*,video/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        
        {isAnalyzing ? (
          <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="currentColor" strokeWidth="4"
                  strokeDasharray="364"
                  strokeDashoffset={364 - (364 * progressLimit) / 100}
                  className="text-primary transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Zap className="w-6 h-6 text-primary mb-1 animate-pulse" />
                <span className="text-2xl font-black text-white tracking-tighter">{progressLimit}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Decrypting Matrix</p>
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/20">Analyzing Sector Assets</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 text-center w-full">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:bg-primary/20 transition-all">
              <Upload className="w-7 h-7 text-primary relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
            </div>
            <div className="space-y-6 w-full">
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60">Initialize Matrix Uplink</p>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">Select media for tactical scanning</p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.setAttribute('capture', 'environment');
                    fileInputRef.current?.click();
                  }}
                  className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-[10px] font-black uppercase hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95"
                >
                  <Camera className="w-4 h-4" /> Live Cam
                </Button>
                <Button className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-[10px] font-black uppercase hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95">
                  <Upload className="w-4 h-4" /> Media Lib
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
