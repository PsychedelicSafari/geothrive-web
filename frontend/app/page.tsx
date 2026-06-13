import Explorer from './components/Explorer';

export default function Home(): React.ReactElement {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <header className="sunset-wash scanlines relative pt-20 pb-28 px-6 text-center overflow-hidden">
        <p className="eyebrow text-cyan text-glow-cyan mb-5">Substrate · GeoThrive Field Scanner</p>
        <h1 className="font-display font-extrabold tracking-tight text-chrome text-5xl sm:text-7xl leading-[0.95] max-w-4xl mx-auto">
          South Africa,
          <br />
          one coordinate at a time.
        </h1>
        <p className="mt-6 max-w-xl mx-auto font-editorial text-lg sm:text-xl text-cream/85">
          Type an address. Substrate geocodes it live, drops it on the map, and reads the forecast
          off the nearest weather station. All of it straight from AfriGIS.
        </p>
      </header>

      <main className="flex-1">
        <Explorer />
      </main>

      <footer className="border-t border-cyan/15 py-8 px-6 text-center">
        <p className="font-mono text-xs text-muted">
          Live data via AfriGIS · Basemap (c) OpenStreetMap contributors · Built for GeoThrive
        </p>
      </footer>
    </div>
  );
}
