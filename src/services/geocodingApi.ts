import { getWardFromCoordinates } from '../data/wards';

export interface GeocodeSearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Nominatim status ' + res.status);
    const data = await res.json();
    if (data?.display_name) {
      // Pick a clean, shortened Indian address
      const parts = data.display_name.split(',');
      return parts.slice(0, 3).join(',').trim();
    }
  } catch {
    // 4s timeout / offline fallback
  }

  // Graceful ward fallback
  const ward = getWardFromCoordinates(lat, lng);
  return `Near Municipal Post, ${ward.name}`;
};

export const searchLocationNominatim = async (query: string): Promise<GeocodeSearchResult[]> => {
  if (!query || query.trim().length < 2) return [];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    // Bias near the Mumbai / suburban coastal belt (19.30, 72.85)
    const encoded = encodeURIComponent(query.trim());
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&countrycodes=in&viewbox=72.75,19.40,72.95,19.20&bounded=0&limit=5`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Nominatim search status ' + res.status);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    // Fallback to simulated local suggestions
    const qLower = query.toLowerCase();
    const wardMatches = [
      { display_name: `${query}, Sector 1, Marine West`, lat: '19.308', lon: '72.842' },
      { display_name: `${query}, Central Market Chowk`, lat: '19.308', lon: '72.858' },
      { display_name: `${query}, Tech Park Ring Road`, lat: '19.324', lon: '72.842' }
    ].filter((item) => item.display_name.toLowerCase().includes(qLower));

    return wardMatches;
  }
};
