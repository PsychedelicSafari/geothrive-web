'use client';

import { useMemo } from 'react';
import { cleanTag, MAX_SCORE, tierFor } from '@/lib/score';

/**
 * The route profile.
 *
 * This is the thing Kesh asks for more than anything else: "my safari starts at point A, it
 * ends at point B, give me the information along the way." Two clicks on the map walk the
 * great-circle line between them and read every hexagon it crosses, so the answer is a profile
 * of the drive rather than a verdict on a single pin.
 */

export type CorridorLeg = {
  h3: string;
  region: string | null;
  centroid: { lat: number; lng: number } | null;
  score: number | null;
  tag: string | null;
  atKm: number;
};

export type Corridor = {
  distanceKm: number;
  sampled: number;
  missed: number;
  cells: CorridorLeg[];
  meanScore: number | null;
  bestCell: CorridorLeg | null;
};

const CHART_H = 92;

export default function CorridorPanel({
  corridor,
  loading,
}: {
  corridor: Corridor | null;
  loading: boolean;
}): React.ReactElement {
  const bars = useMemo(() => {
    if (!corridor?.cells.length) return [];
    const n = corridor.cells.length;
    return corridor.cells.map((leg, i) => {
      const score = leg.score ?? 0;
      return {
        leg,
        x: (i / n) * 100,
        w: 100 / n,
        h: Math.max(2, (score / MAX_SCORE) * CHART_H),
        colour: tierFor(leg.score).colour,
      };
    });
  }, [corridor]);

  if (loading) {
    return (
      <div className="neon-card rounded-2xl p-6">
        <p className="font-mono text-sm text-cyan animate-pulse">walking the route</p>
      </div>
    );
  }

  if (!corridor) {
    return (
      <div className="neon-card rounded-2xl p-6">
        <p className="eyebrow text-cyan/80 mb-2">Route profile</p>
        <p className="font-editorial text-sm text-cream/70 leading-relaxed">
          Click a start point and a destination on the map. Every hexagon the line crosses gets
          read, so you get the character of the whole drive instead of a verdict on one pin.
        </p>
      </div>
    );
  }

  const best = corridor.bestCell;
  const meanTier = tierFor(corridor.meanScore);

  return (
    <div className="neon-card rounded-2xl p-6 space-y-5">
      <div>
        <p className="eyebrow text-cyan/80 mb-1">Route profile</p>
        <p className="font-display text-3xl text-chrome leading-none">
          {corridor.distanceKm.toLocaleString()} km
        </p>
        <p className="font-mono text-[0.7rem] text-muted mt-1">
          {corridor.cells.length} hexagons crossed · {corridor.sampled} samples
          {corridor.missed > 0 && ` · ${corridor.missed} off-grid`}
        </p>
      </div>

      {/* Score along the way */}
      <div>
        <svg
          viewBox={`0 0 100 ${CHART_H}`}
          preserveAspectRatio="none"
          className="w-full h-24 rounded-lg bg-navy-deep/60 border border-cyan/15"
          aria-label="Weight score along the route"
        >
          {bars.map((b) => (
            <rect key={b.leg.h3} x={b.x} y={CHART_H - b.h} width={b.w} height={b.h} fill={b.colour}>
              <title>{`${b.leg.atKm} km · ${b.leg.score?.toFixed(2) ?? 'unscored'}`}</title>
            </rect>
          ))}
        </svg>
        <div className="flex justify-between font-mono text-[0.65rem] text-muted mt-1">
          <span>start</span>
          <span>{corridor.distanceKm.toLocaleString()} km</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-cyan/15 px-3 py-2.5">
          <p className="font-mono text-[0.65rem] text-muted uppercase tracking-wide">Route mean</p>
          <p className="font-display text-xl text-cream leading-tight">
            {corridor.meanScore?.toFixed(2) ?? '--'}
          </p>
          <p className="font-editorial text-xs" style={{ color: meanTier.colour }}>
            {meanTier.label}
          </p>
        </div>
        <div className="rounded-lg border border-cyan/15 px-3 py-2.5">
          <p className="font-mono text-[0.65rem] text-muted uppercase tracking-wide">Best stop</p>
          <p className="font-display text-xl text-cream leading-tight">
            {best?.score?.toFixed(2) ?? '--'}
          </p>
          <p className="font-editorial text-xs text-cream/70 truncate">
            {best ? `${best.region ?? 'unnamed'} · ${best.atKm} km in` : 'nothing scored'}
          </p>
        </div>
      </div>

      {/* The legs worth stopping at */}
      <div>
        <p className="eyebrow text-cyan/80 mb-2">Worth stopping</p>
        <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {corridor.cells
            .filter((l) => l.score !== null && l.score >= 1.478)
            .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
            .slice(0, 8)
            .map((leg) => (
              <li key={leg.h3} className="flex items-center gap-2.5 text-sm">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ background: tierFor(leg.score).colour }}
                />
                <span className="font-editorial text-cream/90 truncate">
                  {cleanTag(leg.tag) ?? tierFor(leg.score).label}
                </span>
                <span className="font-mono text-[0.65rem] text-muted ml-auto shrink-0">
                  {leg.atKm} km · {leg.score?.toFixed(2)}
                </span>
              </li>
            ))}
          {corridor.cells.every((l) => (l.score ?? 0) < 1.478) && (
            <li className="font-editorial text-sm text-muted">
              Nothing on this line clears the bottom band. Most of the country is like this.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
