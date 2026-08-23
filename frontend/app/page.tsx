import HomeTabs from './components/HomeTabs';

export default function Home(): React.ReactElement {
  return (
    <div className="flex flex-col flex-1">
      <HomeTabs />

      <footer className="border-t border-cyan/15 py-8 px-6 text-center">
        <p className="font-mono text-xs text-muted">
          Grid and weight scores via GeoThrive · Address and weather via AfriGIS · Basemap (c)
          OpenStreetMap contributors
        </p>
      </footer>
    </div>
  );
}
