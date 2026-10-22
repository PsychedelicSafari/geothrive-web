import type { Metadata } from 'next';
import HomeTabs from '../components/HomeTabs';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';

export const metadata: Metadata = {
  title: 'H3 Explorer',
  description:
    'Explore South Africa’s H3 grid, inspect cell insights and use the AfriGIS address and weather field scanner.',
};

export default function ExplorePage(): React.ReactElement {
  return (
    <div className="explorer-shell">
      <SiteHeader dark />
      <div id="main-content" tabIndex={-1}>
        <HomeTabs />
      </div>
      <div className="site-explorer-attribution">
        Grid and weight scores via GeoThrive · Address and weather via AfriGIS · Basemap ©
        OpenStreetMap contributors
      </div>
      <SiteFooter />
    </div>
  );
}
