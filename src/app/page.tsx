
"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  LayoutDashboard, 
  Radio, 
  History, 
  Shield, 
  MapPin, 
  Search, 
  LocateFixed,
  Settings,
  Target,
  Info
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadSection } from '@/components/UploadSection';
import { ChatPanel } from '@/components/ChatPanel';
import { FeedPanel } from '@/components/FeedPanel';
import { LogsPanel } from '@/components/LogsPanel';
import { SettingsModal } from '@/components/SettingsModal';
import { MissionBriefing } from '@/components/MissionBriefing';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { 
  UserLocation, 
  PRESET_LOCATIONS, 
  SEARCHABLE_CITIES, 
  getCurrentLocation 
} from '@/lib/location';
import { analyzeUploadedMediaForIncident } from '@/ai/flows/analyze-uploaded-media-for-incident';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';

const MapPanel = dynamic(() => import('@/components/MapPanel').then((mod) => mod.MapPanel), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-neutral-900 animate-pulse rounded-[3rem]" />
});

const MOCK_COMMUNITY = [
  { id: '1', user: 'Ram', locationName: 'Chennai', location: { lat: 13.0827, lng: 80.2707 }, type: 'Electrical Hazard', severity: 'High', description: 'Transformer burst near T-Nagar. Live wires on road.', time: '10m ago', image: 'https://picsum.photos/seed/elec/800/600' },
  { id: '2', user: 'Reshma', locationName: 'Bangalore', location: { lat: 12.9716, lng: 77.5946 }, type: 'Flash Flood', severity: 'High', description: 'Heavy water logging in Silk Board junction. Traffic stalled.', time: '25m ago', image: 'https://picsum.photos/seed/flood/800/600' },
  { id: '3', user: 'Fazil', locationName: 'Beijing', location: { lat: 39.9042, lng: 116.4074 }, type: 'Structure Fire', severity: 'High', description: 'Commercial building fire reported in Chaoyang District.', time: '5m ago', image: 'https://picsum.photos/seed/beijing/800/600' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('grid');
  const [location, setLocation] = useState<UserLocation>(PRESET_LOCATIONS['Chennai HQ']);
  const [locationMode, setLocationMode] = useState<'gps' | 'fixed' | 'manual'>('fixed');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [incidentData, setIncidentData] = useState<any>(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);
  const [myLogs, setMyLogs] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const { toast } = useToast();

  const handleModeChange = async (mode: 'gps' | 'fixed' | 'manual') => {
    setLocationMode(mode);
    if (mode === 'gps') {
      const gpsLoc = await getCurrentLocation();
      setLocation(gpsLoc);
      toast({ title: "GPS ACQUIRED", description: "Centering on live coordinates." });
    } else if (mode === 'fixed') {
      setLocation(PRESET_LOCATIONS['Chennai HQ']);
      toast({ title: "HQ GRID LOCKED", description: "Defaulting to HQ sector." });
    }
  };

  const handleManualSelect = (city: any) => {
    setLocation({
      latitude: city.lat,
      longitude: city.lng,
      city: city.name,
      state: city.state,
      country: city.country || 'Global',
      mode: 'manual'
    });
    setSearchOpen(false);
    toast({ title: "GLOBAL RELOCATION", description: `SustAInex focus shifted to ${city.name}.` });
  };

  const handleUpload = async (dataUri: string) => {
    setUploadedMedia(dataUri);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        const next = prev + Math.random() * 25;
        return next >= 95 ? 95 : next;
      });
    }, 150);

    try {
      const configStr = localStorage.getItem('sentinel_dispatch_config');
      const config = configStr ? JSON.parse(configStr) : {};
      const apiKey = config.googleApiKey || config.geminiApiKey;

      const result = await analyzeUploadedMediaForIncident({
        mediaDataUri: dataUri,
        userLatitude: location.latitude,
        userLongitude: location.longitude,
        googleApiKey: apiKey,
      });

      clearInterval(interval);
      setAnalysisProgress(100);

      setTimeout(() => {
        setIsAnalyzing(false);
        setIncidentData({
          ...result,
          baseLat: location.latitude,
          baseLng: location.longitude
        });
        setIsEmergencyActive(true);
        
        setMyLogs(prev => [{ 
          ...result, 
          id: Date.now().toString(), 
          media: dataUri,
          city: location.city,
          lat: location.latitude,
          lng: location.longitude,
          timestamp: new Date().toLocaleTimeString()
        }, ...prev]);

        toast({ title: "THREAT CONFIRMED", description: `${result.incidentType} detected in sector.` });
      }, 500);
    } catch (error: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      
      const isAuthError = error.message?.toLowerCase().includes('key') || error.message?.toLowerCase().includes('api');
      toast({ 
        variant: "destructive", 
        title: isAuthError ? "CREDENTIAL FAILURE" : "SCAN FAILED", 
        description: isAuthError ? "The API key in settings is invalid or expired." : "Failed to decrypt sector data." 
      });
    }
  };

  const resetGrid = () => {
    setIncidentData(null);
    setIsEmergencyActive(false);
    setUploadedMedia(null);
    toast({ title: "GRID REFRESHED", description: "Tactical data cleared." });
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white selection:bg-primary selection:text-white overflow-hidden font-body">
      <header className="h-20 px-8 border-b border-white/5 flex items-center justify-between glass-card z-[1001] shrink-0">
        <div className="flex items-center gap-4 w-[250px]">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-[12px] font-black uppercase tracking-[0.4em] text-white leading-none">SustAInex</h1>
            <p className="text-[8px] font-black text-primary/60 uppercase tracking-[0.3em] mt-1.5">Tactical Matrix</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center gap-3 max-w-xl px-4">
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <button className="flex-1 h-12 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center gap-4 group hover:bg-white/10 transition-all text-white/40">
                <Search className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] truncate">{location.city || 'Global Sector Search'}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[450px] p-0 bg-[#0a0a0a] border-white/10 shadow-2xl rounded-[2rem] z-[2000]" align="center">
              <Command className="bg-transparent">
                <CommandInput placeholder="Enter Global City..." className="text-white text-[12px] h-14" />
                <CommandList className="max-h-[350px] p-2">
                  <CommandEmpty className="p-8 text-[10px] text-white/30 uppercase font-black text-center tracking-[0.4em]">Sector not found.</CommandEmpty>
                  <CommandGroup heading="Global Hubs" className="text-white/20 text-[10px] uppercase font-black px-6">
                    {SEARCHABLE_CITIES.map((city) => (
                      <CommandItem 
                        key={city.name} 
                        onSelect={() => handleManualSelect(city)}
                        className="text-white text-[12px] font-black hover:bg-primary/20 cursor-pointer rounded-xl p-4 flex items-center gap-4"
                      >
                        <MapPin className="w-4 h-4 text-primary" />
                        <div className="flex flex-col">
                          <span className="tracking-widest uppercase">{city.name}</span>
                          <span className="text-[8px] text-white/30 uppercase tracking-[0.2em]">{city.country}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="flex gap-1.5">
            <Button variant={locationMode === 'fixed' ? 'default' : 'ghost'} size="icon" onClick={() => handleModeChange('fixed')} className="w-10 h-10 rounded-xl bg-white/5">
              <LocateFixed className="w-4 h-4" />
            </Button>
            <Button variant={locationMode === 'gps' ? 'default' : 'ghost'} size="icon" onClick={() => handleModeChange('gps')} className="w-10 h-10 rounded-xl bg-white/5">
              <Target className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 w-[250px] justify-end">
          <button onClick={() => setIsBriefingOpen(true)} className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-all">
            <Info className="w-5 h-5 text-primary" />
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
            <Settings className="w-5 h-5 text-white/40" />
          </button>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden bg-[#050505]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsContent value="grid" className="flex-1 m-0 p-6 h-full overflow-hidden outline-none">
            <div className="h-full flex flex-col lg:flex-row gap-6">
              <div className="flex-[2] relative rounded-[3rem] overflow-hidden border border-white/5">
                <MapPanel 
                  initialLocation={location} 
                  isEmergencyActive={isEmergencyActive} 
                  incidentData={incidentData} 
                  onLocationChange={setLocation} 
                />
              </div>
              <div className="flex-1 overflow-hidden">
                {!isEmergencyActive ? (
                  <UploadSection onUpload={handleUpload} isAnalyzing={isAnalyzing} analysisProgress={analysisProgress} />
                ) : (
                  <ChatPanel data={incidentData!} onReset={resetGrid} location={location} uploadedMedia={uploadedMedia} />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feed" className="flex-1 m-0 p-8 overflow-y-auto outline-none">
            <FeedPanel items={MOCK_COMMUNITY} onSelect={(loc: any, name: string) => {
              setLocation({ latitude: loc.lat, longitude: loc.lng, city: name, mode: 'manual' });
              setActiveTab('grid');
              setIsEmergencyActive(false);
              toast({ title: "SECTOR SHIFT", description: `Viewing activity in ${name}.` });
            }} />
          </TabsContent>

          <TabsContent value="logs" className="flex-1 m-0 p-8 overflow-y-auto outline-none">
            <LogsPanel logs={myLogs} />
          </TabsContent>

          <footer className="h-24 border-t border-white/5 bg-black/95 backdrop-blur-3xl flex items-center justify-center px-6 shrink-0 z-[1001]">
            <TabsList className="bg-white/5 h-16 p-1.5 rounded-[2rem] border border-white/10">
              <TabsTrigger value="grid" className="h-full px-16 rounded-[1.5rem] flex flex-col items-center justify-center gap-1 data-[state=active]:bg-primary">
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Grid</span>
              </TabsTrigger>
              <TabsTrigger value="feed" className="h-full px-16 rounded-[1.5rem] flex flex-col items-center justify-center gap-1 data-[state=active]:bg-primary">
                <Radio className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Feed</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="h-full px-16 rounded-[1.5rem] flex flex-col items-center justify-center gap-1 data-[state=active]:bg-primary">
                <History className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Logs</span>
              </TabsTrigger>
            </TabsList>
          </footer>
        </Tabs>
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <MissionBriefing isOpen={isBriefingOpen} onClose={() => setIsBriefingOpen(false)} />
      <Toaster />
    </div>
  );
}
