"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, MapPin, Clock, ShieldCheck, Navigation, Globe, Languages } from 'lucide-react';

export const LogsPanel = ({ logs }: any) => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      <div className="space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Tactical <span className="text-primary">Logs</span></h2>
        <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.4em]">Personal Response Deployment Records</p>
      </div>

      {logs.length === 0 ? (
        <Card className="bg-white/[0.02] border-dashed border-white/10 rounded-[3rem] py-40 flex flex-col items-center gap-8 opacity-30">
          <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.5em]">No Deployment Records Found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {logs.map((log: any) => (
            <Card key={log.id} className="bg-white/[0.03] border-white/10 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary/30 transition-all group shadow-2xl">
              <CardContent className="p-0 flex flex-col">
                <div className="relative h-56 w-full overflow-hidden">
                  {log.media && log.media.startsWith('data:video') ? (
                    <video src={log.media} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" muted loop autoPlay />
                  ) : (
                    <img src={log.media} alt="Log Image" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-primary text-white font-black text-[8px] uppercase tracking-widest px-3 py-1 border-0 shadow-lg">
                      {log.severity}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-xl">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-[14px] font-black uppercase tracking-widest text-white block leading-none">{log.incidentType}</span>
                      <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1 block">Sector Lock Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6 bg-black/40">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Sector</span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{log.city || 'Global Sector'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Timestamp</span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{log.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Languages className="w-4 h-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Lang Protocol</span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{log.language || 'Native'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Domain</span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Sector</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <div className="flex flex-col gap-2">
                       <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">Telemetry Matrix</span>
                       <div className="flex items-center gap-4 text-[10px] font-mono text-primary font-bold">
                          <span className="flex items-center gap-1.5"><Navigation className="w-3 h-3 rotate-45" /> LAT: {log.lat?.toFixed(6)}°</span>
                          <span className="flex items-center gap-1.5"><Navigation className="w-3 h-3" /> LNG: {log.lng?.toFixed(6)}°</span>
                       </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};