import { WeatherState } from '../store/useStore';

export const fetchLiveWeather = async (): Promise<WeatherState> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=19.30&longitude=72.85&current=temperature_2m,precipitation',
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Weather API HTTP status ' + res.status);

    const data = await res.json();
    const temp = Math.round(data?.current?.temperature_2m ?? 31);
    const precip = data?.current?.precipitation ?? 0;
    const isRaining = precip > 0.5;

    return {
      temperature: temp,
      precipitation: precip,
      isRaining,
      conditionText: isRaining ? `${temp}°C Rain (${precip}mm)` : `${temp}°C Fair`,
      loaded: true
    };
  } catch {
    // 4s timeout or network error fallback
    return {
      temperature: 31,
      precipitation: 0,
      isRaining: false,
      conditionText: '31°C Fair',
      loaded: true
    };
  }
};
