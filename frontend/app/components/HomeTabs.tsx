'use client';

import { useState } from 'react';
import Explorer from './Explorer';
import GridExplorer from './GridExplorer';

type TabId = 'grid' | 'scanner';

const TABS: Array<{ id: TabId; label: string; blurb: string }> = [
  {
    id: 'grid',
    label: 'The grid',
    blurb: 'Explore the South African H3 grid and available scores.',
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
        See place. Understand connection.
        <br />
        One hexagon at a time.
      </>
    ),
    body: 'Read the relationships between landscape, local activity and opportunity through a geographic lens. Explore South Africa’s H3 cells and inspect their available evidence. Deeper red indicates a higher weight score in the current model; it is separate from the legacy Mapping Kiosk’s green natural-capital grid.',
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
