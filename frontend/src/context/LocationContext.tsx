import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  city: string;
  region: string;
  isGpsActive: boolean;
  gpsPermissionDenied: boolean;
  statusMessage: string;
  isLiveTracking: boolean;
  lastUpdated: number;
}

interface LocationContextType {
  location: LocationState;
  requestGps: () => void;
  setManualCity: (cityName: string, lat: number, lng: number) => void;
  recenterOnRealGps: () => void;
}

export const CITIES: Record<string, { lat: number; lng: number; region: string; localName: string }> = {
  Samarkand: { lat: 39.6547, lng: 66.9758, region: 'Samarkand Region', localName: 'Samarqand' },
  Tashkent: { lat: 41.2995, lng: 69.2401, region: 'Tashkent City', localName: 'Toshkent' },
  Bukhara: { lat: 39.7747, lng: 64.4286, region: 'Bukhara Region', localName: 'Buxoro' },
  Khiva: { lat: 41.3783, lng: 60.3639, region: 'Khorezm Region', localName: 'Xiva / Xorazm' },
  Fergana: { lat: 40.3842, lng: 71.7843, region: 'Fergana Valley', localName: "Farg'ona" },
  Andijan: { lat: 40.7821, lng: 72.3442, region: 'Andijan Region', localName: 'Andijon' },
  Namangan: { lat: 40.9983, lng: 71.6726, region: 'Namangan Region', localName: 'Namangan' },
  Kashkadarya: { lat: 38.8611, lng: 65.7847, region: 'Kashkadarya Region', localName: 'Qarshi / Shahrisabz' },
  Surkhandarya: { lat: 37.2242, lng: 67.2783, region: 'Surkhandarya Region', localName: 'Termiz / Boysun' },
  Navoiy: { lat: 40.0844, lng: 65.3792, region: 'Navoiy Region', localName: 'Navoiy / Nurota' },
  Jizzakh: { lat: 39.9611, lng: 68.3972, region: 'Jizzakh Region', localName: 'Jizzax / Zomin' },
  Syrdarya: { lat: 40.4897, lng: 68.7842, region: 'Syrdarya Region', localName: 'Guliston / Sirdaryo' },
  Karakalpakstan: { lat: 42.4619, lng: 59.6166, region: 'Karakalpakstan', localName: "Nukus / Orol bo'yi" },
  'Tashkent Region': { lat: 41.5644, lng: 70.0125, region: 'Tashkent Region', localName: "Bo'stonliq / Chimyon" }
};

export interface CityWeatherInfo {
  tempC: number;
  condition: string;
  humidity: number;
  windKmH: number;
}

export const CITY_WEATHER_DATA: Record<string, CityWeatherInfo> = {
  Fergana: { tempC: 30, condition: 'Musaffo quyoshli', humidity: 26, windKmH: 8 },
  Tashkent: { tempC: 30, condition: 'Ochiq quyoshli', humidity: 28, windKmH: 10 },
  Samarkand: { tempC: 29, condition: 'Mayin shabada', humidity: 24, windKmH: 12 },
  Bukhara: { tempC: 32, condition: 'Iliq va ochiq', humidity: 18, windKmH: 14 },
  Khiva: { tempC: 31, condition: 'Musaffo osmon', humidity: 20, windKmH: 11 },
  Andijan: { tempC: 30, condition: 'Quyoshli', humidity: 29, windKmH: 7 },
  Namangan: { tempC: 29, condition: 'Ochiq havo', humidity: 27, windKmH: 9 },
  Syrdarya: { tempC: 31, condition: 'Daryo shabadasi', humidity: 22, windKmH: 13 },
  Jizzakh: { tempC: 27, condition: "Tog' oldi havosi", humidity: 30, windKmH: 15 },
  Kashkadarya: { tempC: 33, condition: 'Issiq quyoshli', humidity: 19, windKmH: 10 },
  Surkhandarya: { tempC: 34, condition: 'Issiq va ochiq', humidity: 16, windKmH: 12 },
  Navoiy: { tempC: 31, condition: 'Ochiq osmon', humidity: 17, windKmH: 16 },
  Karakalpakstan: { tempC: 29, condition: "O'rtacha shamol", humidity: 21, windKmH: 18 },
  'Tashkent Region': { tempC: 26, condition: "Tog' archazori", humidity: 35, windKmH: 11 }
};

// Haversine distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find closest city in Uzbekistan from real coordinates
function findClosestUzbekCity(lat: number, lng: number): { cityName: string; region: string; distanceKm: number } {
  let closest = 'Samarkand';
  let minDistance = Infinity;

  for (const [cityName, info] of Object.entries(CITIES)) {
    const dist = calculateDistanceKm(lat, lng, info.lat, info.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = cityName;
    }
  }

  return {
    cityName: closest,
    region: CITIES[closest]?.region || 'Uzbekistan',
    distanceKm: minDistance
  };
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationState>({
    latitude: 39.6547,
    longitude: 66.9758,
    accuracy: 10,
    city: 'Samarkand',
    region: 'Samarkand Region',
    isGpsActive: false,
    gpsPermissionDenied: false,
    statusMessage: 'GPS aniqlanmoqda...',
    isLiveTracking: false,
    lastUpdated: Date.now()
  });

  const realGpsCoordsRef = useRef<{ lat: number; lng: number; accuracy: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const processGpsPosition = (position: GeolocationPosition) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = Math.round(position.coords.accuracy || 10);

    realGpsCoordsRef.current = { lat, lng, accuracy };

    const closest = findClosestUzbekCity(lat, lng);

    setLocation({
      latitude: lat,
      longitude: lng,
      accuracy,
      city: closest.cityName,
      region: closest.region,
      isGpsActive: true,
      gpsPermissionDenied: false,
      isLiveTracking: true,
      statusMessage: `Real GPS Faol (±${accuracy}m): ${closest.cityName} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      lastUpdated: Date.now()
    });
  };

  const handleGpsError = (error: GeolocationPositionError) => {
    console.warn('Real GPS xatosi:', error.message);
    setLocation((prev) => ({
      ...prev,
      isGpsActive: false,
      gpsPermissionDenied: error.code === error.PERMISSION_DENIED,
      isLiveTracking: false,
      statusMessage:
        error.code === error.PERMISSION_DENIED
          ? "GPS ruxsati berilmadi. Shaharni qo'lda tanlashingiz mumkin."
          : "GPS signalini aniqlab bo'lmadi."
    }));
  };

  const startRealGpsTracking = () => {
    if (!('geolocation' in navigator)) {
      setLocation((prev) => ({
        ...prev,
        isGpsActive: false,
        statusMessage: 'Brauzeringizda Geolocation mavjud emas.'
      }));
      return;
    }

    // Clear previous watch if exists
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    // High accuracy real-time GPS tracking
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    // 1. Get immediate position
    navigator.geolocation.getCurrentPosition(processGpsPosition, handleGpsError, options);

    // 2. Watch position continuously in real-time as user moves
    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        processGpsPosition,
        (err) => {
          console.warn('Live GPS watch error:', err.message);
        },
        options
      );
    } catch (e) {
      console.warn('watchPosition error:', e);
    }
  };

  const requestGps = () => {
    startRealGpsTracking();
  };

  const recenterOnRealGps = () => {
    if (realGpsCoordsRef.current) {
      const { lat, lng, accuracy } = realGpsCoordsRef.current;
      const closest = findClosestUzbekCity(lat, lng);
      setLocation({
        latitude: lat,
        longitude: lng,
        accuracy,
        city: closest.cityName,
        region: closest.region,
        isGpsActive: true,
        gpsPermissionDenied: false,
        isLiveTracking: true,
        statusMessage: `Real GPS: ${closest.cityName} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        lastUpdated: Date.now()
      });
    } else {
      startRealGpsTracking();
    }
  };

  const setManualCity = (cityName: string, lat: number, lng: number) => {
    setLocation((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      city: cityName,
      region: CITIES[cityName]?.region || 'Uzbekistan',
      isLiveTracking: false,
      statusMessage: `Tanlangan shahar: ${cityName} (${CITIES[cityName]?.region || 'Uzbekistan'})`,
      lastUpdated: Date.now()
    }));
  };

  useEffect(() => {
    startRealGpsTracking();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <LocationContext.Provider value={{ location, requestGps, setManualCity, recenterOnRealGps }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
