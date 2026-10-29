import Link from 'next/link';
import SiteHeader from './components/site/SiteHeader';
import SiteFooter from './components/site/SiteFooter';

export default function NotFound(): React.ReactElement {
  return (
    <div className="marketing">
      <SiteHeader />
      <main id="main-content" className="site-container site-page-intro" tabIndex={-1}>
        <p className="site-eyebrow">404 / A little off the map</p>
        <h1>
          Let&apos;s find
          <br />
          <em>your way back.</em>
        </h1>
        <p>This page could not be found.</p>
        <div className="site-actions">
          <Link href="/" className="site-button">
            Back to GeoThrive
          </Link>
          <Link href="/explore" className="site-text-link">
            Explore the map
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
