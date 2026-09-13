import { useEffect, useState } from 'react';
import { fetchCurrentWeather, type ICurrentWeather } from '../services/weatherApi';

const BELGRADE_COORDS = { lat: 44.7866, lon: 20.4489 };

interface LocalWeatherState {
  weather: ICurrentWeather | null;
  loading: boolean;
  error: string | null;
}

function getCoordinates(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(BELGRADE_COORDS);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
      () => resolve(BELGRADE_COORDS),
      { timeout: 4000 },
    );
  });
}

/** Vraća trenutne vremenske uslove za lokaciju korisnika (uz fallback na Beograd). */
export function useLocalWeather() {
  const [state, setState] = useState<LocalWeatherState>({
    weather: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    getCoordinates()
      .then(({ lat, lon }) => fetchCurrentWeather(lat, lon))
      .then((weather) => {
        if (!cancelled) {
          setState({ weather, loading: false, error: null });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ weather: null, loading: false, error: 'Vremenski podaci trenutno nisu dostupni.' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
