import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LocationState {
  latitude: number;
  longitude: number;
  city: string;
  isGpsActive: boolean;
  gpsPermissionDenied: boolean;
  statusMessage: string;
}

interface LocationContextType {
  location: LocationState;
  requestGps: () => void;
  setManualCity: (cityName: string, lat: number, lng: number) => void;
}

export const CITIES: Record<string, { lat: number; lng: number; region: string }> = {
  Samarkand: { lat: 39.6547, lng: 66.9758, region: 'Samarkand Region' },
  Bukhara: { lat: 39.7747, lng: 64.4286, region: 'Bukhara Region' },
  Khiva: { lat: 41.3783, lng: 60.3639, region: 'Khorezm Region' },
  Tashkent: { lat: 41.2995, lng: 69.2401, region: 'Tashkent City' },
  'Tashkent Region': { lat: 41.5644, lng: 70.0125, region: 'Bostanliq / Chimgan' },
  Fergana: { lat: 40.3842, lng: 71.7843, region: 'Fergana Valley' },
  Andijan: { lat: 40.7821, lng: 72.3442, region: 'Andijan Region' },
  Namangan: { lat: 40.9983, lng: 71.6726, region: 'Namangan Region' },
  Kashkadarya: { lat: 39.0558, lng: 66.8286, region: 'Shahrisabz / Qarshi' },
  Surkhandarya: { lat: 37.2242, lng: 67.2783, region: 'Termez / Boysun' },
  Navoiy: { lat: 40.0844, lng: 65.3792, region: 'Nurata / Kyzylkum' },
  Jizzakh: { lat: 39.9611, lng: 68.3972, region: 'Zaamin National Park' },
  Syrdarya: { lat: 40.4897, lng: 68.7842, region: 'Guliston' },
  Karakalpakstan: { lat: 42.4619, lng: 59.6166, region: 'Nukus / Aral Sea' }
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationState>({
    latitude: 39.6547, // Default to Registan, Samarkand
    longitude: 66.9758,
    city: 'Samarkand',
    isGpsActive: true,
    gpsPermissionDenied: false,
    statusMessage: 'Location calibrated at Registan Square, Samarkand'
  });

  const requestGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: 'Samarkand',
            isGpsActive: true,
            gpsPermissionDenied: false,
            statusMessage: `GPS Active (Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)})`
          });
        },
        (error) => {
          console.warn('GPS location request:', error.message);
          setLocation((prev) => ({
            ...prev,
            isGpsActive: false,
            gpsPermissionDenied: true,
            statusMessage: 'GPS permission denied. Using selected city center.'
          }));
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  const setManualCity = (cityName: string, lat: number, lng: number) => {
    setLocation({
      latitude: lat,
      longitude: lng,
      city: cityName,
      isGpsActive: false,
      gpsPermissionDenied: false,
      statusMessage: `City centered at ${cityName}`
    });
  };

  useEffect(() => {
    requestGps();
  }, []);

  return (
    <LocationContext.Provider value={{ location, requestGps, setManualCity }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
