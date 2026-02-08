
"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Target } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapController = ({ location, zoomLevel }: { location: any; zoomLevel: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([location.latitude, location.longitude], zoomLevel, {
      duration: 1.5,
      easeLinearity: 0.1
    });
  }, [location, map, zoomLevel]);
  return null;
};

const createEmojiIcon = (emoji: string, label: string = '', distance: string = '', size: number = 44, isEpicenter: boolean = false) => {
  return L.divIcon({
    html: `
      <div class="flex flex-col items-center" style="transform: translateY(-50%)">
        ${label ? `
          <div class="mb-2 px-3 py-1 bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl animate-in fade-in zoom-in duration-500">
            <div class="text-[9px] font-black uppercase tracking-[0.1em] text-white whitespace-nowrap leading-none flex items-center gap-1.5">
              ${label} ${distance ? `<span class="text-primary font-bold ml-1">${distance}</span>` : ''}
            </div>
          </div>
        ` : ''}
        <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
          ${isEpicenter ? '<div class="siren-alert"></div>' : ''}
          <div style="font-size: ${size}px; line-height: 1; filter: drop-shadow(0 0 10px rgba(0,0,0,0.5)); z-index: 10;">
            ${emoji}
          </div>
        </div>
      </div>
    `,
    className: 'custom-emoji-icon',
    iconSize: [size, size + (label ? 40 : 0)],
    iconAnchor: [size/2, (size + (label ? 40 : 0))/2],
  });
};

export const MapPanel = ({ initialLocation, isEmergencyActive, incidentData }: any) => {
  const [zoom, setZoom] = useState(14);

  useEffect(() => {
    if (isEmergencyActive) setZoom(17);
    else setZoom(14);
  }, [isEmergencyActive]);

  const getIncidentEmoji = () => {
    if (!incidentData) return "📍";
    const type = incidentData.incidentType.toLowerCase();
    if (type.includes('fire')) return "🔥";
    if (type.includes('flood')) return "🌊";
    if (type.includes('accident')) return "🚑";
    if (type.includes('collapse')) return "🏚️";
    return "🚨";
  };

  const authorities = [
    { name: "DM CENTER", emoji: "🏢", latOffset: 0.0035, lngOffset: -0.0035, dist: "0.8km" },
    { name: "FIRE STATION", emoji: "🚒", latOffset: -0.0042, lngOffset: 0.0051, dist: "1.2km" },
    { name: "HOSPITAL", emoji: "🏥", latOffset: 0.0051, lngOffset: -0.0068, dist: "1.5km" },
    { name: "POLICE HUB", emoji: "👮", latOffset: -0.0028, lngOffset: -0.0044, dist: "0.5km" },
  ];

  return (
    <div className="h-full w-full relative group rounded-[3.5rem] overflow-hidden shadow-inner border border-white/5 bg-[#050505]">
      {isEmergencyActive && (
        <>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in slide-in-from-top duration-700 pointer-events-none">
            <div className="gis-overlay-active px-8 py-3 rounded-full flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <div className="flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary leading-none">GIS Active</h3>
                <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">Satellite Grid Locked</p>
              </div>
            </div>
          </div>
          <div className="scanning-line" />
        </>
      )}

      <MapContainer 
        center={[initialLocation.latitude, initialLocation.longitude]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapController location={initialLocation} zoomLevel={zoom} />

        {incidentData && (
          <Marker 
            position={[incidentData.baseLat || initialLocation.latitude, incidentData.baseLng || initialLocation.longitude]}
            icon={createEmojiIcon(getIncidentEmoji(), 'THREAT EPICENTER', '', 64, true)}
          >
            <Popup className="dark-popup">
              <div className="p-6 text-center min-w-[200px] bg-[#0a0a0a]">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-4 shadow-2xl">
                  <span className="text-3xl">{getIncidentEmoji()}</span>
                </div>
                <h4 className="text-[12px] font-black uppercase text-primary tracking-[0.2em] mb-1">Threat Epicenter</h4>
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Active Threat Zone</p>
              </div>
            </Popup>
          </Marker>
        )}

        {!isEmergencyActive && (
          <Marker position={[initialLocation.latitude, initialLocation.longitude]} icon={createEmojiIcon("📍", 'HQ GRID', '', 48)} />
        )}

        {isEmergencyActive && authorities.map((auth, idx) => (
          <Marker 
            key={idx} 
            position={[initialLocation.latitude + auth.latOffset, initialLocation.longitude + auth.lngOffset]}
            icon={createEmojiIcon(auth.emoji, auth.name, auth.dist, 44)}
          />
        ))}
      </MapContainer>

      <div className="absolute bottom-8 left-8 z-[1000] p-5 rounded-[1.8rem] bg-black/90 backdrop-blur-3xl border border-white/10 text-[9px] font-mono pointer-events-none shadow-3xl flex flex-col gap-4 min-w-[160px]">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Target className="w-3.5 h-3.5 text-primary" />
          <span className="font-black tracking-[0.3em] uppercase text-white">Telemetry</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between gap-6">
            <span className="text-primary font-black uppercase tracking-widest flex items-center gap-1.5">Lat</span>
            <span className="text-white font-bold tracking-tighter text-[11px]">{initialLocation.latitude.toFixed(6)}°</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-primary font-black uppercase tracking-widest flex items-center gap-1.5">Lng</span>
            <span className="text-white font-bold tracking-tighter text-[11px]">{initialLocation.longitude.toFixed(6)}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
