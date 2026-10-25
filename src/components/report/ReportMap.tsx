import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Search, Navigation, MapPin, Loader2 } from 'lucide-react';
import { WARDS, getWardFromCoordinates } from '../../data/wards';
import { reverseGeocode, searchLocationNominatim, GeocodeSearchResult } from '../../services/geocodingApi';
import { useT } from '../../i18n/useT';

// Custom glowing civic SVG DivIcon
const createCivicPinIcon = () => {
  return L.divIcon({
    className: 'custom-civic-pin',
    html: `
      <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(45, 226, 196, 0.25); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #0B1020; border: 2.5px solid #2DE2C4; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(45, 226, 196, 0.6);">
          <div style="width: 10px; height: 10px; border-radius: 50%; background: #2DE2C4;"></div>
        </div>
        <div style="position: absolute; bottom: 0; left: 50%; width: 2px; height: 8px; background: #2DE2C4; transform: translateX(-50%);"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });
};

interface ReportMapProps {
  coordinates: [number, number];
  onCoordinatesChange: (coords: [number, number], locationName: string) => void;
}

// Controller component to smoothly pan map when coordinates change programmatically
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { duration: 1.2 });
  }, [center, map]);
  return null;
};

// Map click and drag event handler
const MapClickHandler: React.FC<{
  onSelect: (coords: [number, number]) => void;
}> = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
};

export const ReportMap: React.FC<ReportMapProps> = ({
  coordinates,
  onCoordinatesChange
}) => {
  const { t } = useT();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeWard = useMemo(
    () => getWardFromCoordinates(coordinates[0], coordinates[1]),
    [coordinates]
  );

  const civicIcon = useMemo(() => createCivicPinIcon(), []);

  // Handle pin movement and reverse geocoding
  const handlePinPositionChange = async (newCoords: [number, number]) => {
    const locName = await reverseGeocode(newCoords[0], newCoords[1]);
    onCoordinatesChange(newCoords, locName);
  };

  // Debounced search with Nominatim
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimerRef.current = setTimeout(async () => {
      const results = await searchLocationNominatim(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 600);
  };

  // Select a search suggestion
  const handleSelectSearchResult = async (item: GeocodeSearchResult) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    if (!isNaN(lat) && !isNaN(lng)) {
      setSearchQuery('');
      setSearchResults([]);
      const locName = item.display_name.split(',').slice(0, 3).join(',').trim();
      onCoordinatesChange([lat, lng], locName);
    }
  };

  // Use browser geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setIsLocatingUser(false);
        const locName = await reverseGeocode(lat, lng);
        onCoordinatesChange([lat, lng], locName);
      },
      () => {
        setIsLocatingUser(false);
        // Fallback to default municipal zone
        handlePinPositionChange([19.308, 72.858]);
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search Bar + Geolocation Button */}
      <div className="flex flex-col sm:flex-row gap-2 relative z-20">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t('searchLocationPlaceholder')}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#2DE2C4] transition shadow-inner"
          />
          {isSearching && (
            <Loader2 className="w-4 h-4 text-[#2DE2C4] animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
          )}

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 py-1.5 bg-[#0F172A] border border-white/15 rounded-xl shadow-2xl z-50 overflow-hidden">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-slate-200 hover:bg-white/10 flex items-start gap-2 border-b border-white/5 last:border-0 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#2DE2C4] shrink-0 mt-0.5" />
                  <span className="truncate">{item.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocatingUser}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 font-medium text-xs sm:text-sm active:scale-95 transition shrink-0"
        >
          {isLocatingUser ? (
            <Loader2 className="w-4 h-4 text-[#2DE2C4] animate-spin" />
          ) : (
            <Navigation className="w-4 h-4 text-[#2DE2C4]" />
          )}
          <span>{t('useMyLocation')}</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <MapContainer
          center={coordinates}
          zoom={15}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController center={coordinates} />
          <MapClickHandler onSelect={handlePinPositionChange} />

          {/* Ward Polygon Boundary Highlight */}
          {activeWard && (
            <Polygon
              positions={activeWard.bounds}
              pathOptions={{
                color: '#2DE2C4',
                weight: 2,
                fillColor: '#2DE2C4',
                fillOpacity: 0.12,
                dashArray: '4, 4'
              }}
            />
          )}

          {/* Draggable Marker Pin */}
          <Marker
            position={coordinates}
            icon={civicIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                handlePinPositionChange([pos.lat, pos.lng]);
              }
            }}
          />
        </MapContainer>

        {/* Floating Ward Badge */}
        <div className="absolute top-3 left-3 z-[1000] pointer-events-none">
          <div className="px-3 py-1.5 rounded-xl bg-[#0B1020]/90 backdrop-blur-md border border-[#2DE2C4]/40 shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2DE2C4] animate-ping" />
            <span className="text-xs font-mono font-semibold text-white">
              {activeWard.code}: {activeWard.name}
            </span>
          </div>
        </div>

        {/* Draggable Pin Hint */}
        <div className="absolute bottom-3 right-3 z-[1000] pointer-events-none">
          <div className="px-3 py-1 rounded-lg bg-[#0B1020]/80 backdrop-blur-md border border-white/10 text-[11px] text-slate-300 font-medium">
            {t('draggablePinHint')}
          </div>
        </div>
      </div>
    </div>
  );
};
