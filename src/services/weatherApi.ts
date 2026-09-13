const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export interface ICurrentWeather {
  temperatureC: number;
  precipitationMm: number;
  isDay: boolean;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    precipitation: number;
    is_day: number;
  };
}

export async function fetchCurrentWeather(lat: number, lon: number): Promise<ICurrentWeather> {
  const url = `${WEATHER_BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,is_day`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open-Meteo API greška: ${response.status}`);
  }

  const payload = (await response.json()) as OpenMeteoResponse;

  return {
    temperatureC: payload.current.temperature_2m,
    precipitationMm: payload.current.precipitation,
    isDay: payload.current.is_day === 1,
  };
}
