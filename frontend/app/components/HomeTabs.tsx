'use client';

import { useState } from 'react';
import Explorer from './Explorer';
import GridExplorer from './GridExplorer';

type TabId = 'grid' | 'scanner';

const TABS: Array<{ id: TabId; label: string; blurb: string }> = [
  {
    id: 'grid',
    label: 'The grid',
    blurb: 'Every hexagon in South Africa, scored and ranked.',
  },
  {
    id: 'scanner',
    label: 'Field scanner',
    blurb: 'Look up one address and read the weather off it.',
  },
];

const HERO: Record<TabId, { eyebrow: string; title: React.ReactNode; body: string }> = {
  grid: {
    eyebrow: 'GeoThrive · The grid',
    title: (
      <>
        34,000 hexagons.
        <br />
        One question each.
      </>
    ),
    body: 'South Africa cut into 42 square kilometre tiles, each one weighed against forty layers of conservation, water, terrain and land use. Deeper red means more pristine. Click any hexagon to see what is actually under it.',
  },
  scanner: {
    eyebrow: 'GeoThrive · Field scanner',
    title: (
      <>
        South Africa,
        <br />
        one coordinate at a time.
      </>
    ),
    body: 'Type an address. GeoThrive geocodes it live, drops it on the map, and reads the forecast off the nearest weather station. All of it straight from AfriGIS.',
  },
};

export default function HomeTabs(): React.ReactElement {
  const [tab, setTab] = useState<TabId>('grid');
  const hero = HERO[tab];

  return (
    <>
      <header className="sunset-wash scanlines relative pt-20 pb-24 px-6 text-center overflow-hidden">
        <p className="eyebrow text-cyan text-glow-cyan mb-5">{hero.eyebrow}</p>
        <h1 className="font-display font-extrabold tracking-tight text-chrome text-5xl sm:text-7xl leading-[0.95] max-w-4xl mx-auto">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-2xl mx-auto font-editorial text-lg sm:text-xl text-cream/85">
          {hero.body}
        </p>
      </header>

      <div className="relative z-20 -mt-8 mb-10 px-6 flex justify-center">
        <div
          className="inline-flex gap-1 p-1 rounded-full neon-card"
          role="tablist"
          aria-label="Views"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              title={t.blurb}
              onClick={() => setTab(t.id)}
              className={`font-display text-sm font-bold tracking-wide px-5 py-2.5 rounded-full transition-colors ${
                tab === t.id
                  ? 'bg-pink text-cream shadow-[0_0_20px_-4px_rgba(255,62,127,0.9)]'
                  : 'text-cream/70 hover:text-cream hover:bg-cyan/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1">{tab === 'grid' ? <GridExplorer /> : <Explorer />}</main>
    </>
  );
}
