import { useLocalWeather } from '../hooks/useLocalWeather';
import './WateringAdvice.css';

function buildAdvice(temperatureC: number, precipitationMm: number): string {
  if (precipitationMm > 1) {
    return 'Danas ima dovoljno padavina — možete preskočiti zalivanje.';
  }
  if (temperatureC >= 25) {
    return 'Toplo i suvo vreme — biljkama je danas potrebno više vode.';
  }
  if (temperatureC <= 10) {
    return 'Hladnije vreme — zalivajte umereno, zemlja se sporije suši.';
  }
  return 'Umereni uslovi — pratite uobičajeni raspored zalivanja.';
}


export function WateringAdvice() {
  const { weather, loading, error } = useLocalWeather();

  return (
    <div className="watering-advice">
      <h3>Savet za zalivanje danas</h3>
      {loading && <p className="watering-advice__muted">Učitavanje vremenskih podataka…</p>}
      {error && <p className="watering-advice__muted">{error}</p>}
      {weather && (
        <>
          <p className="watering-advice__stats">
            🌡️ {Math.round(weather.temperatureC)}°C · 🌧️ {weather.precipitationMm} mm padavina
          </p>
          <p className="watering-advice__text">
            {buildAdvice(weather.temperatureC, weather.precipitationMm)}
          </p>
        </>
      )}
    </div>
  );
}
