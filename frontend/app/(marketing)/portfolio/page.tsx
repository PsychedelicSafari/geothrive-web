import type { Metadata } from 'next';
import Link from 'next/link';
import Arrow from '../../components/site/Arrow';
import ContactBand from '../../components/site/ContactBand';

export const metadata: Metadata = {
  title: 'Selected work',
  description:
    'Explore GeoThrive Africa’s H3 Explorer, GeoTripz partner mapping environment, heritage mapping and spatial research.',
};

export default function PortfolioPage(): React.ReactElement {
  return (
    <>
      <section className="site-container site-page-intro">
        <p className="site-eyebrow">Selected work / Ideas in the landscape</p>
        <h1>
          Spatial thinking.
          <br />
          <em>In practice.</em>
        </h1>
        <p>
          Mapping environments, partnerships and research connecting geographic evidence with
          practical questions.
        </p>
      </section>
      <section className="site-container site-projects" aria-label="Selected projects">
        <article className="site-project site-project-featured">
          <div className="site-project-graphic project-grid" aria-hidden="true">
            <span>H3</span>
            <small>SOUTH AFRICA / SPATIAL EXPLORER</small>
          </div>
          <div className="site-project-content">
            <p className="site-eyebrow">01 / Interactive application</p>
            <h2>The H3 Explorer</h2>
            <p>
              A grid-based view of South Africa. Explore geographic context, inspect cell insights,
              or use the AfriGIS field scanner for an address and weather lookup.
            </p>
            <Link href="/explore" className="site-text-link">
              Explore the map <Arrow diagonal />
            </Link>
          </div>
        </article>
        <article className="site-project">
          <div className="site-project-graphic project-connections" aria-hidden="true">
            <span>
              Place.
              <br />
              <em>Connected.</em>
            </span>
          </div>
          <div className="site-project-content">
            <p className="site-eyebrow">02 / Participatory mapping legacy</p>
            <h2>GeoTripz Mapping Kiosk</h2>
            <p>
              A historical mapping environment bringing location intelligence, place-based research
              and geographic exploration together.
            </p>
            <Link href="/mapping-kiosk" className="site-text-link">
              Visit the Mapping Kiosk <Arrow />
            </Link>
          </div>
        </article>
        <article className="site-project">
          <div className="site-project-graphic project-heritage" aria-hidden="true">
            <span>
              Stories
              <br />
              <em>have roots.</em>
            </span>
          </div>
          <div className="site-project-content">
            <p className="site-eyebrow">03 / Published case study</p>
            <h2>Heritage mapping</h2>
            <p>
              Explore AfriGIS&apos;s published heritage mapping case study and the connection
              between culture, communities and place-based information.
            </p>
            <a
              href="https://www.afrigis.co.za/heritage-mapping-afrigis/"
              target="_blank"
              rel="noopener noreferrer"
              className="site-text-link"
            >
              Read the case study <Arrow diagonal />
            </a>
          </div>
        </article>
        <article className="site-research-note">
          <p className="site-eyebrow">Ongoing research</p>
          <h2>H3 & the circular economy</h2>
          <p>
            Exploring how proximity-based spatial frameworks can help connect businesses,
            communities, assets and regenerative economic activity.
          </p>
          <Link href="/contact" className="site-text-link">
            Talk about a collaboration <Arrow />
          </Link>
        </article>
      </section>
      <ContactBand />
    </>
  );
}
