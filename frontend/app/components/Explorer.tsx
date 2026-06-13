'use client';

import maplibregl from 'maplibre-gl';
import { useCallback, useEffect, useRef, useState } from 'react';

// Geocode result shape (subset of AfriGIS /geocode/api/v3/address).
type GeocodeHit = {
  place_id: string;
  formatted_address: string;
  confidence: { description: string };
  location: { lat: number; lng: number };
  types: string[];
  country: string;
};

type Forecast = {
  day: number;
  date: string;
  weekday: string;
  description: string;
  tempMin: number;
  tempMax: number;
  tempApparent: number;
  precipProbability: number;
  precipType: string;
  precipAmount: number;
  windShort: string | null;
  windSpeed: number;
  windDescription: string;
};

type Weather = {
  station: { name: string; province: string; municipality: string; distanceMeters: number };
  forecasts: Forecast[];
};

// Free OpenStreetMap raster basemap. No API key. The brand hue-rotate filter lives in CSS
// on the canvas (.map-psychedelic), so the tiles themselves stay license-clean.
const OSM_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '(c) OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

// Cape Town, so the map opens somewhere meaningful before the first search.
const CAPE_TOWN: [number, number] = [18.4241, -33.9249];

function precipTone(probability: number): string {
  if (probability >= 60) return 'text-cyan text-glow-cyan';
  if (probability >= 30) return 'text-mustard';
  return 'text-mint';
}

export default function Explorer(): React.ReactElement {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  // Suppresses the search effect when the query change came from selecting a result,
  // otherwise picking an address re-geocodes it and reopens the dropdown.
  const skipSearchRef = useRef(false);

  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<GeocodeHit[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<GeocodeHit | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialise the map once.
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: OSM_STYLE,
      center: CAPE_TOWN,
      zoom: 10,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Debounced address search via the geocode route (returns coords inline).
  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }
    const q = query.trim();
    if (q.length < 3) {
      setHits([]);
      setOpen(false);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/afrigis/geocode?query=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as { result?: GeocodeHit[]; error?: string };
        if (!res.ok) throw new Error(data.error ?? 'Search failed');
        setHits((data.result ?? []).slice(0, 6));
        setOpen(true);
        setError(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSelect = useCallback(async (hit: GeocodeHit) => {
    skipSearchRef.current = true;
    setSelected(hit);
    setQuery(hit.formatted_address);
    setOpen(false);
    setHits([]);
    setWeather(null);
    setError(null);

    const { lat, lng } = hit.location;
    const map = mapRef.current;
    if (map) {
      map.flyTo({ center: [lng, lat], zoom: 13, speed: 0.9, curve: 1.4 });
      if (!markerRef.current) {
        const el = document.createElement('div');
        el.className = 'map-marker';
        markerRef.current = new maplibregl.Marker({ element: el });
      }
      markerRef.current.setLngLat([lng, lat]).addTo(map);
    }

    setWeatherLoading(true);
    try {
      const res = await fetch(`/api/afrigis/weather?lat=${lat}&lng=${lng}&days=3`);
      const data = (await res.json()) as Weather & { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Weather lookup failed');
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Weather lookup failed');
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pb-24">
      {/* Search */}
      <div className="relative max-w-2xl mx-auto -mt-8 z-20">
        <div className="neon-card rounded-xl p-1.5 flex items-center gap-2">
          <span className="pl-3 text-cyan text-glow-cyan font-mono text-sm select-none">{'>'}</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => hits.length > 0 && setOpen(true)}
            aria-label="Search a South African address"
            placeholder="Search any South African address. Try Long Street, Cape Town."
            className="flex-1 bg-transparent py-3 pr-4 text-cream placeholder:text-muted/70 outline-none font-editorial text-lg"
            spellCheck={false}
          />
          {searching && (
            <span className="pr-4 font-mono text-xs text-cyan animate-pulse">scanning</span>
          )}
        </div>

        {open && hits.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 neon-card rounded-xl overflow-hidden z-30">
            {hits.map((hit) => (
              <li key={hit.place_id}>
                <button
                  type="button"
                  onClick={() => handleSelect(hit)}
                  className="w-full text-left px-4 py-3 hover:bg-pink/15 transition-colors border-b border-cyan/10 last:border-0"
                >
                  <span className="block text-cream font-editorial">{hit.formatted_address}</span>
                  <span className="block font-mono text-[0.7rem] text-cyan/70 mt-0.5">
                    {hit.location.lat.toFixed(5)}, {hit.location.lng.toFixed(5)} ·{' '}
                    {hit.confidence.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <p className="max-w-2xl mx-auto mt-4 text-center font-mono text-sm text-pink text-glow-pink">
          {error}
        </p>
      )}

      {/* Map + field report */}
      <div className="grid lg:grid-cols-5 gap-6 mt-10">
        <div className="lg:col-span-3 relative scanlines rounded-2xl overflow-hidden border border-cyan/30 shadow-[0_24px_70px_-24px_rgba(255,62,127,0.5)]">
          <div ref={mapContainer} className="map-psychedelic h-[460px] w-full" />
        </div>

        <aside className="lg:col-span-2">
          <p className="eyebrow text-cyan text-glow-cyan mb-3">Field Report</p>
          {!selected && (
            <div className="neon-card rounded-2xl p-6 text-muted font-editorial">
              Pick an address and Substrate pulls live coordinates plus a three-day forecast from
              the nearest weather station. Every lookup is one AfriGIS call, which is exactly why
              the cache exists.
            </div>
          )}

          {selected && (
            <div className="neon-card rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="font-display text-xl text-cream leading-snug">
                  {selected.formatted_address}
                </h3>
                <p className="font-mono text-xs text-cyan/80 mt-2">
                  {selected.location.lat.toFixed(6)}, {selected.location.lng.toFixed(6)}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selected.types.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[0.65rem] uppercase tracking-wider px-2 py-1 rounded-full bg-violet/30 text-mint border border-cyan/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {weatherLoading && (
                <p className="font-mono text-sm text-cyan animate-pulse">reading weather station</p>
              )}

              {weather && (
                <div className="space-y-4">
                  <p className="font-mono text-xs text-muted">
                    Station {weather.station.name} · {weather.station.province} ·{' '}
                    {(weather.station.distanceMeters / 1000).toFixed(1)} km away
                  </p>
                  <div className="space-y-2">
                    {weather.forecasts.map((f) => (
                      <div
                        key={f.day}
                        className="flex items-center justify-between rounded-lg bg-navy/50 border border-cyan/15 px-4 py-3"
                      >
                        <div>
                          <span className="font-display text-cream">{f.weekday}</span>
                          <span className="block text-sm text-mint capitalize">
                            {f.description}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-display text-lg text-cream">
                            {Math.round(f.tempMax)}°
                            <span className="text-muted text-sm"> / {Math.round(f.tempMin)}°</span>
                          </span>
                          <span
                            className={`block font-mono text-xs ${precipTone(f.precipProbability)}`}
                          >
                            {f.precipProbability}% rain · {f.windShort ?? 'calm'}{' '}
                            {Math.round(f.windSpeed)}km/h
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
