export type UserLocation = {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  mode: 'fixed' | 'gps' | 'manual';
};

export const PRESET_LOCATIONS: Record<string, UserLocation> = {
  'Chennai HQ': {
    latitude: 13.0827,
    longitude: 80.2707,
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    mode: 'fixed'
  },
  'Bangalore Hub': {
    latitude: 12.9716,
    longitude: 77.5946,
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    mode: 'fixed'
  },
  'Mumbai West': {
    latitude: 19.0760,
    longitude: 72.8777,
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    mode: 'fixed'
  },
  'Beijing Sector': {
    latitude: 39.9042,
    longitude: 116.4074,
    city: 'Beijing',
    state: 'Beijing',
    country: 'China',
    mode: 'fixed'
  }
};

export const SEARCHABLE_CITIES = [
  // India
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', country: 'India' },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, state: 'Karnataka', country: 'India' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'Maharashtra', country: 'India' },
  { name: 'Delhi', lat: 28.6139, lng: 77.2090, state: 'Delhi', country: 'India' },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, state: 'Telangana', country: 'India' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, state: 'West Bengal', country: 'India' },
  
  // Global - Asia
  { name: 'Beijing', lat: 39.9042, lng: 116.4074, state: 'Beijing', country: 'China' },
  { name: 'Shanghai', lat: 31.2304, lng: 121.4737, state: 'Shanghai', country: 'China' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, state: 'Tokyo', country: 'Japan' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, state: 'Singapore', country: 'Singapore' },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, state: 'Dubai', country: 'UAE' },
  
  // Global - Europe
  { name: 'London', lat: 51.5074, lng: -0.1278, state: 'London', country: 'UK' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, state: 'Paris', country: 'France' },
  { name: 'Berlin', lat: 52.5200, lng: 13.4050, state: 'Berlin', country: 'Germany' },
  { name: 'Madrid', lat: 40.4168, lng: -3.7038, state: 'Madrid', country: 'Spain' },
  { name: 'Rome', lat: 41.9028, lng: 12.4964, state: 'Lazio', country: 'Italy' },
  
  // Global - Americas
  { name: 'New York', lat: 40.7128, lng: -74.0060, state: 'NY', country: 'USA' },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, state: 'CA', country: 'USA' },
  { name: 'Mexico City', lat: 19.4326, lng: -99.1332, state: 'CDMX', country: 'Mexico' },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333, state: 'SP', country: 'Brazil' },
  
  // Global - Others
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, state: 'NSW', country: 'Australia' },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173, state: 'Moscow', country: 'Russia' },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, state: 'Cairo', country: 'Egypt' },
];

export async function getCurrentLocation(): Promise<UserLocation> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve({ ...PRESET_LOCATIONS['Chennai HQ'], mode: 'gps' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: 'Detected Area',
          state: 'GPS Active',
          country: 'Local',
          mode: 'gps'
        });
      },
      () => {
        resolve({ ...PRESET_LOCATIONS['Chennai HQ'], mode: 'gps' });
      }
    );
  });
}
