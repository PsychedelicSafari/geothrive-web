'use client';

import type { Feature, FeatureCollection, Polygon } from 'geojson';
import maplibregl from 'maplibre-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import CellPanel, { type CellDetail, type SnapshotDetail } from './CellPanel';
import CorridorPanel, { type Corridor } from './CorridorPanel';
import { MAX_SCORE, scoreColourExpression, TIERS } from '@/lib/score';

/**
 * The grid, on a map.
 *
 * The basemap is the same license-clean OpenStreetMap raster the field scanner uses, but
 * desaturated and dimmed in CSS so Kesh's red band ramp is the only saturated thing on screen.
 * The psychedelic hue-rotate filter deliberately does not apply here: it would shift the
 * hexagon colours and the colour *is* the reading.
 */

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
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      // Drained and dimmed on the layer, not in CSS, so the hexagons above it keep their colour.
      paint: {
        'raster-saturation': -0.9,
        'raster-brightness-max': 0.34,
        'raster-contrast': 0.2,
        'raster-opacity': 0.85,
      },
    },
  ],
};

/** Opens over the Kruger side of Limpopo, which is where the highest-scoring land sits. */
const HOME: { center: [number, number]; zoom: number } = {
  center: [31.2, -23.6],
  zoom: 7.4,
};

const PLACES: Array<{ label: string; center: [number, number]; zoom: number }> = [
  { label: 'Limpopo', center: [31.2, -23.6], zoom: 7.4 },
  { label: 'Cape Town', center: [18.72, -33.85], zoom: 7.8 },
  { label: 'Drakensberg', center: [29.2, -29.3], zoom: 7.6 },
  { label: 'Tankwa Karoo', center: [19.9, -32.3], zoom: 7.6 },
  { label: 'Whole country', center: [25.0, -29.0], zoom: 4.6 },
];

const EMPTY: FeatureCollection = { type: 'FeatureCollection', features: [] };

type CellsResponse = { features: Feature[]; count: number; truncated: boolean };

export default function GridExplorer(): React.ReactElement {
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const hovered = useRef<string | null>(null);
  const loadToken = useRef(0);
  const corridorPins = useRef<maplibregl.Marker[]>([]);

  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);
  const [truncated, setTruncated] = useState(false);
  const [loadingCells, setLoadingCells] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cell, setCell] = useState<CellDetail | null>(null);
  const [snapshot, setSnapshot] = useState<SnapshotDetail | null>(null);
  const [cellLoading, setCellLoading] = useState(false);

  const [extruded, setExtruded] = useState(false);
  const [corridorMode, setCorridorMode] = useState(false);
  const [corridor, setCorridor] = useState<Corridor | null>(null);
  const [corridorLoading, setCorridorLoading] = useState(false);
  const [pins, setPins] = useState<Array<[number, number]>>([]);

  /** Fetch every hexagon in the current viewport. Debounced by the caller. */
  const loadViewport = useCallback(async () => {
    const m = map.current;
    if (!m) return;
    const token = ++loadToken.current;

    const b = m.getBounds();
    const bbox = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]
      .map((n) => n.toFixed(4))
      .join(',');

    setLoadingCells(true);
    try {
      const res = await fetch(`/api/grid/cells?bbox=${bbox}`);
      const data = (await res.json()) as CellsResponse & { error?: string };
      if (token !== loadToken.current) return;
      if (!res.ok) throw new Error(data.error ?? 'Could not load the grid');

      const src = m.getSource('cells') as maplibregl.GeoJSONSource | undefined;
      src?.setData({ type: 'FeatureCollection', features: data.features });
      setCount(data.count);
      setTruncated(data.truncated);
      setError(null);
    } catch (err) {
      if (token !== loadToken.current) return;
      setError(err instanceof Error ? err.message : 'Could not load the grid');
    } finally {
      if (token === loadToken.current) setLoadingCells(false);
    }
  }, []);

  const openCell = useCallback(async (h3: string, centroid: [number, number]) => {
    setCellLoading(true);
    setSnapshot(null);
    try {
      const [cellRes, snapRes] = await Promise.all([
        fetch(`/api/grid/cell/${h3}`),
        fetch(`/api/grid/snapshot?lat=${centroid[1]}&lng=${centroid[0]}&resolution=6`),
      ]);
      const detail = (await cellRes.json()) as CellDetail & { error?: string };
      if (!cellRes.ok) throw new Error(detail.error ?? 'Could not open that hexagon');
      setCell(detail);
      if (snapRes.ok) setSnapshot((await snapRes.json()) as SnapshotDetail);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open that hexagon');
    } finally {
      setCellLoading(false);
    }
  }, []);

  // Initialise the map once.
  useEffect(() => {
    if (!container.current || map.current) return;

    const m = new maplibregl.Map({
      container: container.current,
      style: OSM_STYLE,
      center: HOME.center,
      zoom: HOME.zoom,
      maxZoom: 12,
      attributionControl: { compact: true },
    });
    map.current = m;
    m.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

    m.on('load', () => {
      // promoteId lets feature-state key off the H3 index, which is already unique.
      m.addSource('cells', { type: 'geojson', data: EMPTY, promoteId: 'h3' });

      m.addLayer({
        id: 'cells-fill',
        type: 'fill',
        source: 'cells',
        paint: {
          'fill-color': scoreColourExpression() as never,
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.95,
            ['case', ['==', ['coalesce', ['get', 'score'], -1], -1], 0.3, 0.88],
          ] as never,
        },
      });

      m.addLayer({
        id: 'cells-line',
        type: 'line',
        source: 'cells',
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#ffffff',
            'rgba(255,255,255,0.16)',
          ] as never,
          'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 2, 0.4] as never,
        },
      });

      m.addLayer({
        id: 'cells-3d',
        type: 'fill-extrusion',
        source: 'cells',
        layout: { visibility: 'none' },
        paint: {
          'fill-extrusion-color': scoreColourExpression() as never,
          'fill-extrusion-height': ['*', ['coalesce', ['get', 'score'], 0], 1600] as never,
          'fill-extrusion-opacity': 0.9,
        },
      });

      m.addSource('corridor', { type: 'geojson', data: EMPTY });
      m.addLayer({
        id: 'corridor-line',
        type: 'line',
        source: 'corridor',
        paint: { 'line-color': '#24e6d0', 'line-width': 2.5, 'line-dasharray': [2, 1.5] },
      });

      setReady(true);
      void loadViewport();
    });

    // Debounce so a drag does not fire a request per frame.
    let timer: ReturnType<typeof setTimeout>;
    const onMove = (): void => {
      clearTimeout(timer);
      timer = setTimeout(() => void loadViewport(), 420);
    };
    m.on('moveend', onMove);

    const onEnter = (e: maplibregl.MapLayerMouseEvent): void => {
      m.getCanvas().style.cursor = 'pointer';
      const id = e.features?.[0]?.properties?.h3 as string | undefined;
      if (!id || id === hovered.current) return;
      if (hovered.current) {
        m.setFeatureState({ source: 'cells', id: hovered.current }, { hover: false });
      }
      hovered.current = id;
      m.setFeatureState({ source: 'cells', id }, { hover: true });
    };
    const onLeave = (): void => {
      m.getCanvas().style.cursor = '';
      if (hovered.current) {
        m.setFeatureState({ source: 'cells', id: hovered.current }, { hover: false });
      }
      hovered.current = null;
    };
    m.on('mousemove', 'cells-fill', onEnter);
    m.on('mouseleave', 'cells-fill', onLeave);

    return () => {
      clearTimeout(timer);
      m.remove();
      map.current = null;
    };
  }, [loadViewport]);

  // Click behaviour depends on the mode, so it is bound separately from init.
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;

    const onClick = (e: maplibregl.MapMouseEvent): void => {
      if (corridorMode) {
        setPins((prev) =>
          prev.length >= 2
            ? [[e.lngLat.lng, e.lngLat.lat]]
            : [...prev, [e.lngLat.lng, e.lngLat.lat]],
        );
        return;
      }
      const hit = m.queryRenderedFeatures(e.point, { layers: ['cells-fill'] })[0];
      const h3 = hit?.properties?.h3 as string | undefined;
      if (!h3) return;
      const geom = hit.geometry as Polygon;
      const ring = geom.coordinates[0];
      const centroid: [number, number] = [
        ring.reduce((sum, pt) => sum + (pt[0] ?? 0), 0) / ring.length,
        ring.reduce((sum, pt) => sum + (pt[1] ?? 0), 0) / ring.length,
      ];
      void openCell(h3, centroid);
    };

    m.on('click', onClick);
    return () => {
      m.off('click', onClick);
    };
  }, [ready, corridorMode, openCell]);

  // Draw the corridor pins and run the profile once both ends exist.
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;

    for (const marker of corridorPins.current) marker.remove();
    corridorPins.current = pins.map((p) => {
      const el = document.createElement('div');
      el.className = 'corridor-pin';
      return new maplibregl.Marker({ element: el }).setLngLat(p).addTo(m);
    });

    const src = m.getSource('corridor') as maplibregl.GeoJSONSource | undefined;
    if (pins.length < 2) {
      src?.setData(EMPTY);
      setCorridor(null);
      return;
    }

    src?.setData({
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: pins } },
      ],
    });

    const controller = new AbortController();
    setCorridorLoading(true);
    const [from, to] = pins;
    fetch(`/api/grid/corridor?from=${from[0]},${from[1]}&to=${to[0]},${to[1]}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = (await res.json()) as Corridor & { error?: string };
        if (!res.ok) throw new Error(data.error ?? 'Could not read that route');
        setCorridor(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Could not read that route');
      })
      .finally(() => setCorridorLoading(false));

    return () => controller.abort();
  }, [pins, ready]);

  // 3D toggle swaps which of the two grid layers is visible, and tilts the camera with it.
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    m.setLayoutProperty('cells-3d', 'visibility', extruded ? 'visible' : 'none');
    m.setLayoutProperty('cells-fill', 'visibility', extruded ? 'none' : 'visible');
    m.easeTo({ pitch: extruded ? 55 : 0, duration: 700 });
  }, [extruded, ready]);

  const jump = useCallback((place: (typeof PLACES)[number]) => {
    map.current?.flyTo({ center: place.center, zoom: place.zoom, speed: 1.1, curve: 1.3 });
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pb-24">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {PLACES.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => jump(p)}
            className="font-mono text-xs px-3 py-1.5 rounded-full border border-cyan/25 text-cream/80 hover:bg-cyan/15 hover:text-cream transition-colors"
          >
            {p.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExtruded((v) => !v)}
            aria-pressed={extruded}
            className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
              extruded
                ? 'bg-cyan/20 border-cyan text-cream'
                : 'border-cyan/25 text-cream/80 hover:bg-cyan/15'
            }`}
          >
            3D
          </button>
          <button
            type="button"
            onClick={() => {
              setCorridorMode((v) => !v);
              setPins([]);
              setCorridor(null);
            }}
            aria-pressed={corridorMode}
            className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
              corridorMode
                ? 'bg-pink/25 border-pink text-cream'
                : 'border-cyan/25 text-cream/80 hover:bg-cyan/15'
            }`}
          >
            Route profile
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Map */}
        <div className="lg:col-span-3 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-cyan/25 shadow-[0_24px_70px_-24px_rgba(192,39,58,0.55)]">
            <div ref={container} className="map-grid h-[560px] w-full" />

            {corridorMode && (
              <div className="absolute top-3 left-3 right-3 pointer-events-none">
                <p className="inline-block font-mono text-xs px-3 py-2 rounded-lg bg-navy-deep/90 border border-pink/40 text-cream">
                  {pins.length === 0
                    ? 'Click the start of your route'
                    : pins.length === 1
                      ? 'Now click the destination'
                      : 'Click anywhere to start a new route'}
                </p>
              </div>
            )}

            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              {loadingCells && (
                <span className="font-mono text-[0.7rem] px-2.5 py-1.5 rounded-lg bg-navy-deep/90 border border-cyan/30 text-cyan animate-pulse">
                  loading grid
                </span>
              )}
              {truncated && !loadingCells && (
                <span className="font-mono text-[0.7rem] px-2.5 py-1.5 rounded-lg bg-navy-deep/90 border border-mustard/40 text-mustard">
                  showing first 2,000 · zoom in for the rest
                </span>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="neon-card rounded-xl p-4">
            <div className="flex items-baseline justify-between mb-3">
              <p className="eyebrow text-cyan/80">Weight score</p>
              <p className="font-mono text-[0.7rem] text-muted">
                {count.toLocaleString()} hexagons in view
              </p>
            </div>
            <ul className="space-y-1.5">
              {TIERS.map((t) => (
                <li key={t.id} className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-sm shrink-0 border border-white/15"
                    style={{ background: t.colour }}
                  />
                  <span className="font-editorial text-sm text-cream/90">{t.label}</span>
                  <span className="font-mono text-[0.65rem] text-muted ml-auto shrink-0">
                    {t.id === 0 ? '<' : '≥'} {t.id === 0 ? TIERS[3].min : t.min} ·{' '}
                    {t.cells.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-editorial text-xs text-muted mt-3 leading-snug">
              Deeper red means more pristine, more protected, further from anything built. Scores
              run to {MAX_SCORE}. Five sixths of the country sits below the bottom band, which is
              why this is drawn in Kesh&apos;s own five classes rather than a smooth ramp.
            </p>
          </div>
        </div>

        {/* Side */}
        <aside className="lg:col-span-2 space-y-4">
          {error && (
            <p className="font-mono text-sm text-pink text-glow-pink border border-pink/30 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {corridorMode ? (
            <CorridorPanel corridor={corridor} loading={corridorLoading} />
          ) : (
            <CellPanel
              cell={cell}
              snapshot={snapshot}
              loading={cellLoading}
              onClose={() => {
                setCell(null);
                setSnapshot(null);
              }}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
