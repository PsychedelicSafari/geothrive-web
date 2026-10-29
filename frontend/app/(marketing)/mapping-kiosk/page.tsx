import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Arrow from '../../components/site/Arrow';
import MappingKioskEmbed from '../../components/site/MappingKioskEmbed';
import MappingWorkflowVisual from '../../components/site/MappingWorkflowVisual';
import ContactBand from '../../components/site/ContactBand';

export const metadata: Metadata = {
  title: 'GeoTripz Mapping Kiosk',
  description:
    'Where is where it starts. Discover the GeoTripz participatory mapping legacy and explore its live mapping application.',
};

const capabilities = [
  [
    'Locate your place',
    'Address search and locate-me tools, alongside topographic and satellite mapping.',
  ],
  [
    'Read the landscape',
    'Layer controls, H3 natural-capital grids, conservation zones and biodiversity overlays.',
  ],
  [
    'Discover what is nearby',
    'Local enterprise and points of interest, from coffee shops and guesthouses to wellness activities.',
  ],
  [
    'Make local knowledge visible',
    'Community and business mapping, including a documented submission and approval workflow.',
  ],
] as const;

const workflows = [
  [
    'Find your place.',
    'Begin with an address or the locate-me tool. The February 2025 guide uses a business site as the starting point for exploring its surroundings.',
    'Address search / Base maps',
    'pp. 2, 5–6',
  ],
  [
    'Explore your natural environment.',
    'Compare the green natural-capital grid with conservation and biodiversity layers. The guide illustrates coastal attributes, mountain buffers and possible ecological corridors.',
    'Natural capital / Layer controls',
    'pp. 3–4, 7–8',
  ],
  [
    'Understand local business and community activity.',
    'Zoom into clustered points of interest and use categories to explore nearby activity. The guide’s examples include wellness, children’s activities, coffee shops and accommodation.',
    'Points of interest / Categories',
    'pp. 9–10, 14',
  ],
  [
    'Contribute your information.',
    'The historical workflow places a marker, categorises a business, skill or activity, then submits information for approval before it appears on the map. Current submission arrangements need confirmation.',
    'Place / Categorise / Review',
    'pp. 11–13',
  ],
] as const;

export default function MappingKioskPage(): React.ReactElement {
  return (
    <>
      <section className="site-container kiosk-hero">
        <div>
          <p className="site-eyebrow">People · Places · Possibility</p>
          <h1>
            GeoTripz
            <br />
            <em>Mapping Kiosk</em>
          </h1>
          <p className="kiosk-tagline">Where is where it starts.</p>
          <p className="site-body-copy">
            A participatory mapping experience connecting people, businesses, skills, communities
            and natural resources through location intelligence.
          </p>
          <a className="site-text-link" href="#live-map">
            Explore the Mapping Kiosk <Arrow />
          </a>
        </div>
        <figure className="kiosk-landscape">
          <Image
            src="/images/cape-point.webp"
            alt="Layered cliffs and Atlantic coastline at Cape Point, South Africa"
            width={900}
            height={1200}
            sizes="(max-width: 800px) 100vw, 45vw"
            preload
          />
          <div className="kiosk-landscape-grid" aria-hidden="true" />
          <figcaption>
            Cape Point / South Africa<span>Landscape photograph · illustrative grid</span>
          </figcaption>
        </figure>
      </section>

      <section className="site-container site-section kiosk-editorial">
        <div>
          <p className="site-eyebrow">01 / Our mapping legacy</p>
          <h2>
            A place on the map.
            <br />
            <em>A voice in the picture.</em>
          </h2>
        </div>
        <div className="kiosk-prose">
          <p className="site-lead">
            GeoTripz began with a participatory idea: local knowledge helps us understand a place.
          </p>
          <p>
            The February 2025 <cite>Mapping Kiosk: Tourism &amp; Hospitality</cite> guide describes
            GeoTripz as an enterprise and supplier development (ESD) partner of AfriGIS and records
            a public platform revision launched in September 2024.
          </p>
          <p>
            That platform brought environmental context together with businesses, skills and
            community activity. GeoThrive Africa’s emerging H3 platform carries this interest in
            place and connection into a separate exploration experience.
          </p>
          <p className="kiosk-source-note">
            This is a historical partnership reference. Current participation, branding and
            publication permissions remain to be confirmed; no current endorsement is implied.
          </p>
        </div>
      </section>

      <section className="kiosk-geography">
        <div className="site-container">
          <p className="site-eyebrow">02 / Explore your geography</p>
          <h2>
            See more of <em>where you are.</em>
          </h2>
          <p className="kiosk-section-lead">
            Capabilities documented in the February 2025 guide. Availability in the legacy
            application may differ today.
          </p>
          <div className="kiosk-capabilities">
            {capabilities.map(([title, description], index) => (
              <article key={title}>
                <span className="site-eyebrow">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <div className="kiosk-model-note">
            <span className="kiosk-model-swatches" aria-hidden="true">
              ⬡ ⬡ ⬡
            </span>
            <p>
              <strong>Two maps, two meanings.</strong> The legacy green grid represents the guide’s
              natural-capital model. The <Link href="/explore">H3 Explorer</Link> uses red for its
              current weight scores. These are separate models; their colours and scores are not
              interchangeable.
            </p>
          </div>
        </div>
      </section>

      <section id="live-map" className="site-container site-section">
        <div className="site-section-heading site-heading-split">
          <div>
            <p className="site-eyebrow">03 / The original Mapping Kiosk</p>
            <h2>
              A landscape of <em>connections.</em>
            </h2>
          </div>
          <p>
            Explore in the frame.
            <br />
            Or give the map its own window.
          </p>
        </div>
        <MappingKioskEmbed />
      </section>

      <section className="site-container site-section kiosk-workflow-section">
        <p className="site-eyebrow">04 / How participatory mapping works</p>
        <h2>
          Start with a place.
          <br />
          <em>Build a richer picture.</em>
        </h2>
        <p className="kiosk-section-lead">
          Four steps from the documented GeoTripz approach. These examples explain the historical
          model and are not a claim that every tool is currently available.
        </p>
        <div className="kiosk-workflows">
          {workflows.map(([title, description, caption, pages], index) => (
            <article key={title}>
              <div className="kiosk-workflow-top">
                <span className="site-eyebrow">0{index + 1}</span>
                <span className="site-eyebrow">{caption}</span>
              </div>
              <MappingWorkflowVisual step={index + 1} />
              <h3>{title}</h3>
              <p>{description}</p>
              <small>February 2025 guide / {pages}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="kiosk-join">
        <div className="site-container kiosk-editorial">
          <div>
            <p className="site-eyebrow">05 / Join the Grid</p>
            <h2>
              Put your place
              <br />
              <em>on the map.</em>
            </h2>
          </div>
          <div>
            <p className="site-lead">
              An African-first approach to mapping people, businesses, skills, community initiatives
              and local opportunity.
            </p>
            <p>
              Help shape a participation model that stands on its own, without mandatory Meta or
              social-media login.
            </p>
            <Link href="/join" className="site-button site-button-light">
              Join the Grid <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <div className="site-container kiosk-credits">
        <p>
          Historical source: <cite>Mapping Kiosk: Tourism &amp; Hospitality</cite>, GeoTripz, 18
          February 2025, pp. 1–16. Historical claims and current service availability are
          distinguished above.
        </p>
        <p>
          Photograph: Rohan_Reddy via{' '}
          <a
            href="https://www.goodfreephotos.com/south-africa/other-south-africa/landscape-at-cape-point-at-cape-of-good-hope-africa.jpg.php"
            target="_blank"
            rel="noopener noreferrer"
          >
            Good Free Photos
          </a>{' '}
          ·{' '}
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC0
          </a>{' '}
          · resized and compressed.
        </p>
      </div>
      <ContactBand />
    </>
  );
}
