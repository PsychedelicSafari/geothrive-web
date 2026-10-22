import Image from 'next/image';
import Link from 'next/link';
import Arrow from './Arrow';

export default function Partnership({
  compact = false,
}: {
  compact?: boolean;
}): React.ReactElement {
  return (
    <section
      id="afrigis-partnership"
      className={`site-container partnership${compact ? ' partnership-compact' : ''}`}
      aria-label="GeoTripz and AfriGIS ESD partnership"
    >
      <div className="partnership-identity">
        <p className="site-eyebrow">GeoTripz × AfriGIS</p>
        <a
          href="https://www.afrigis.co.za/"
          target="_blank"
          rel="noopener noreferrer"
          className="partnership-logo"
          aria-label="Visit AfriGIS (opens in new tab)"
        >
          <Image
            src="/images/afrigis-logo.png"
            alt="AfriGIS"
            width={346}
            height={61}
            sizes="240px"
          />
        </a>
        <span className="site-eyebrow">Enterprise & supplier development</span>
      </div>
      <div>
        <p className="site-eyebrow">Our mapping partnership</p>
        <h2>
          Local knowledge.
          <br />
          <em>Geospatial possibility.</em>
        </h2>
        <p>
          GeoThrive’s story grows from Kshetra’s work through GeoTripz and its AfriGIS enterprise
          and supplier development (ESD) partnership, documented in the February 2025 Mapping Kiosk
          guide.
        </p>
        {!compact && (
          <p>
            The participatory mapping approach connects tourism, local enterprise and natural
            resources through geography. That experience informs GeoThrive’s focus on people, place
            and the opportunities between nearby grids.
          </p>
        )}
        <div className="site-actions">
          <Link href="/mapping-kiosk" className="site-text-link">
            Explore our mapping legacy <Arrow />
          </Link>
          <a
            href="https://www.afrigis.co.za/"
            target="_blank"
            rel="noopener noreferrer"
            className="site-text-link"
          >
            Visit AfriGIS <Arrow diagonal />
          </a>
        </div>
      </div>
    </section>
  );
}
