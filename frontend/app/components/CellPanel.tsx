'use client';

import { useMemo } from 'react';
import {
  formatArea,
  formatValue,
  humanise,
  isAreaLayer,
  LOCKED_LAYERS,
  THEMES,
  type Theme,
  themeFor,
} from '@/lib/layers';
import { cleanTag, tierFor } from '@/lib/score';

export type Attribute = {
  layer_key: string;
  value: { value?: unknown } | Record<string, unknown>;
  source: string | null;
  license_class: string;
  min_tier: string;
  fetched_at: string;
};

export type CellDetail = {
  h3: string;
  resolution: number;
  region: string | null;
  centroid: [number, number];
  attributes: Attribute[];
  withheld: number;
  scores: Array<{ model_key: string; score: number; components?: { tag?: string } | null }>;
};

export type SnapshotDetail = {
  percentile: number | null;
  neighbour_count: number;
  neighbour_mean_score: number | null;
};

function rawValue(attr: Attribute): unknown {
  const v = attr.value as { value?: unknown };
  return v && typeof v === 'object' && 'value' in v ? v.value : attr.value;
}

export default function CellPanel({
  cell,
  snapshot,
  loading,
  onClose,
}: {
  cell: CellDetail | null;
  snapshot: SnapshotDetail | null;
  loading: boolean;
  onClose: () => void;
}): React.ReactElement {
  const grouped = useMemo(() => {
    if (!cell) return null;

    // Every *_area layer is square metres of this hexagon covered by that thing. Overlapping
    // source features are summed, so a layer can exceed the hexagon's own area. Clamping keeps
    // the bars honest rather than drawing 198% coverage.
    const hexArea =
      (cell.attributes
        .filter((a) => a.layer_key === 'h3_area')
        .map((a) => rawValue(a))
        .find((v) => typeof v === 'number') as number | undefined) ?? null;

    const buckets = new Map<
      Theme,
      Array<{ attr: Attribute; value: unknown; coverage: number | null }>
    >();

    for (const attr of cell.attributes) {
      const value = rawValue(attr);
      // A layer present at zero is the absence of that thing, which is noise in a list this long.
      if (typeof value === 'number' && value === 0) continue;
      if (attr.layer_key === 'h3_area') continue;

      const theme = themeFor(attr.layer_key);
      const coverage =
        hexArea && isAreaLayer(attr.layer_key, value) && typeof value === 'number'
          ? Math.min(1, value / hexArea)
          : null;

      if (!buckets.has(theme)) buckets.set(theme, []);
      buckets.get(theme)!.push({ attr, value, coverage });
    }

    for (const rows of buckets.values()) {
      rows.sort((a, b) => (b.coverage ?? -1) - (a.coverage ?? -1));
    }
    return { buckets, hexArea };
  }, [cell]);

  if (loading) {
    return (
      <div className="neon-card rounded-2xl p-6">
        <p className="font-mono text-sm text-cyan animate-pulse">reading hexagon</p>
      </div>
    );
  }

  if (!cell || !grouped) {
    return (
      <div className="neon-card rounded-2xl p-6 text-muted font-editorial leading-relaxed">
        Click any hexagon to open it. Each one carries roughly forty government and AfriGIS layers
        plus GeoThrive&apos;s own weight score, which is the derived product, the one thing in here
        that can actually be sold.
      </div>
    );
  }

  const primary = cell.scores[0] ?? null;
  const tier = tierFor(primary?.score ?? null);
  // The tag on the source row is authoritative. The band is only a colour decision.
  const tag = cleanTag(primary?.components?.tag) ?? tier.label;
  const updated = cell.attributes.find((a) => a.layer_key === 'UPDATED');
  const source = cell.attributes.find((a) => a.layer_key === 'SOURCE');

  const themeOrder = (Object.keys(THEMES) as Theme[]).filter((t) => grouped.buckets.has(t));

  return (
    <div className="neon-card rounded-2xl overflow-hidden">
      <div className="p-6 pb-5 border-b border-cyan/15" style={{ background: `${tier.colour}1a` }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-cyan/80">{cell.region ?? 'South Africa'}</p>
            <h3 className="font-display text-2xl text-cream mt-1 leading-tight">{tag}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close hexagon detail"
            className="shrink-0 rounded-full w-8 h-8 border border-cyan/30 text-cyan hover:bg-cyan/15 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex items-end gap-5 mt-4">
          <div>
            <span className="font-display text-4xl" style={{ color: tier.colour }}>
              {primary ? primary.score.toFixed(2) : '—'}
            </span>
            <span className="font-mono text-xs text-muted ml-1">weight</span>
          </div>
          {snapshot?.percentile !== null && snapshot?.percentile !== undefined && (
            <div className="pb-1">
              <span className="font-display text-xl text-cream">
                {snapshot.percentile.toFixed(0)}
              </span>
              <span className="font-mono text-xs text-muted ml-1">
                {ordinal(snapshot.percentile)} pct
              </span>
            </div>
          )}
          {snapshot?.neighbour_mean_score !== null &&
            snapshot?.neighbour_mean_score !== undefined && (
              <div className="pb-1">
                <span className="font-display text-xl text-cream">
                  {snapshot.neighbour_mean_score.toFixed(2)}
                </span>
                <span className="font-mono text-xs text-muted ml-1">
                  nbrs ({snapshot.neighbour_count})
                </span>
              </div>
            )}
        </div>

        <p className="font-editorial text-sm text-cream/75 mt-3 leading-snug">{tier.meaning}</p>
        <p className="font-mono text-[0.65rem] text-muted mt-3 break-all">{cell.h3}</p>
      </div>

      <div className="max-h-[46vh] overflow-y-auto">
        {themeOrder.length === 0 && cell.withheld > 0 && (
          <section className="px-6 py-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full shrink-0 bg-mustard" />
              <h4 className="font-display text-sm text-cream">
                {cell.withheld} layers measured here
              </h4>
            </div>
            <p className="font-editorial text-sm text-cream/70 leading-snug mb-4">
              The score above is derived from these. The layer values themselves are licensed
              government and commercial data, so they are withheld from this tier rather than
              republished.
            </p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {LOCKED_LAYERS.map((key) => (
                <li key={key} className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: THEMES[themeFor(key)].accent, opacity: 0.55 }}
                  />
                  <span className="font-editorial text-xs text-cream/45 truncate">
                    {humanise(key)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {themeOrder.map((theme) => {
          const rows = grouped.buckets.get(theme)!;
          const meta = THEMES[theme];
          return (
            <section key={theme} className="px-6 py-4 border-b border-cyan/10 last:border-0">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: meta.accent }}
                />
                <h4 className="font-display text-sm text-cream">{meta.label}</h4>
                <span className="font-mono text-[0.65rem] text-muted ml-auto">{rows.length}</span>
              </div>

              <ul className="mt-3 space-y-2">
                {rows.map(({ attr, value, coverage }) => (
                  <li key={attr.layer_key}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-editorial text-sm text-cream/90 truncate">
                        {humanise(attr.layer_key)}
                      </span>
                      <span className="font-mono text-[0.7rem] text-cyan/80 shrink-0">
                        {coverage !== null && typeof value === 'number'
                          ? `${(coverage * 100).toFixed(0)}% · ${formatArea(value)}`
                          : formatValue(value)}
                      </span>
                    </div>
                    {coverage !== null && (
                      <div className="mt-1 h-1 rounded-full bg-navy/70 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(2, coverage * 100)}%`,
                            background: meta.accent,
                          }}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="px-6 py-4 bg-navy/40 border-t border-cyan/15 space-y-1">
        {source && (
          <p className="font-mono text-[0.65rem] text-muted">
            Source {formatValue(rawValue(source))}
            {updated ? ` · updated ${formatValue(rawValue(updated))}` : ''}
          </p>
        )}
        <p className="font-mono text-[0.65rem] text-muted">
          Qualified data. Every layer is government or vetted commercial, auditable, and dated.
        </p>
        {cell.withheld > 0 && themeOrder.length > 0 && (
          <p className="font-mono text-[0.65rem] text-mustard">
            {cell.withheld} further layer{cell.withheld === 1 ? '' : 's'} on this hexagon sit above
            your tier.
          </p>
        )}
      </div>
    </div>
  );
}

function ordinal(n: number): string {
  const v = Math.round(n) % 100;
  if (v >= 11 && v <= 13) return 'th';
  return ['th', 'st', 'nd', 'rd'][Math.min(v % 10, 4)] ?? 'th';
}
