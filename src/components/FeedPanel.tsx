"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock } from 'lucide-react';

const MiniMap = dynamic(() => import('@/components/MapPanel').then((mod) => mod.MapPanel), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-neutral-900 animate-pulse" />
});

export const FeedPanel = ({ items, onSelect }: any) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <div className="flex items-end justify-between px-4">
        <div className="space-y-4">
          <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Community <span className="text-primary">Grid</span></h2>
          <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em]">Live Satellite Incident Data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item: any) => (
          <Card key={item.id} className="bg-white/[0.03] border-white/10 rounded-[2.5rem] overflow-hidden group cursor-pointer hover:border-primary/50 transition-all flex flex-col" onClick={() => onSelect(item.location, item.locationName)}>
            <div className="relative h-64 w-full">
              <div className="absolute inset-0 pointer-events-none z-10 opacity-60 group-hover:opacity-100 transition-opacity">
                 <MiniMap initialLocation={{ latitude: item.location.lat, longitude: item.location.lng, city: item.locationName }} isEmergencyActive={false} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
              <Badge className="absolute top-6 right-6 bg-red-500 text-white font-black text-[9px] uppercase border-0 px-4 py-1.5 z-30 shadow-xl">{item.severity}</Badge>
              <div className="absolute bottom-6 left-6 z-30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[11px] font-black text-primary uppercase backdrop-blur-md">{item.user[0]}</div>
                  <div>
                    <h4 className="text-[12px] font-black uppercase text-white leading-none">{item.user}</h4>
                    <div className="flex items-center gap-1.5 text-primary text-[9px] font-black uppercase mt-1">
                      <MapPin className="w-2.5 h-2.5" /> {item.locationName}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-8 space-y-4 flex-1">
              <h3 className="text-xl font-black uppercase text-white tracking-tighter group-hover:text-primary transition-colors">{item.type}</h3>
              <p className="text-xs text-white/40 line-clamp-3 leading-relaxed font-medium">{item.description}</p>
              <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase font-black pt-6 border-t border-white/5 mt-auto">
                <Clock className="w-3 h-3" /> Reported {item.time}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
