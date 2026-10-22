import type { Metadata } from 'next';
import ContactBand from '../../components/site/ContactBand';
import SocialLinks from '../../components/site/SocialLinks';
import Partnership from '../../components/site/Partnership';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Meet Kshetra Govindasamy, geographer, spatial strategist and GIS consultant behind GeoThrive Africa.',
};

export default function AboutPage(): React.ReactElement {
  return (
    <>
      <section className="site-container site-page-intro">
        <p className="site-eyebrow">About GeoThrive Africa</p>
        <h1>
          A geographic lens.
          <br />
          <em>A human perspective.</em>
        </h1>
        <p>
          Places are more than points on a map. They are relationships between people, landscapes,
          resources and possibility.
        </p>
      </section>
      <section className="site-container site-about-grid">
        <div className="site-about-portrait" aria-label="Kshetra Govindasamy, based in Cape Town">
          <span className="site-eyebrow">Geographer / Spatial strategist</span>
          <span className="site-about-monogram" aria-hidden="true">
            KG<span>+</span>
          </span>
          <span className="site-eyebrow">Cape Town · South Africa</span>
        </div>
        <div className="site-about-copy">
          <p className="site-eyebrow">Meet the founder</p>
          <h2>
            Kshetra
            <br />
            <em>Govindasamy.</em>
          </h2>
          <p className="site-lead">
            I work at the intersection of spatial strategy, location intelligence and regenerative
            place-based development.
          </p>
          <p>
            My focus is translating geographic complexity into practical decisions, working
            prototypes and spatial solutions that people can use.
          </p>
          <p>
            GeoThrive Africa brings that approach to GIS advisory, H3 and proximity intelligence,
            ESG, circular economy, tourism and cultural landscapes. The starting point is always the
            same: understand the place and the question before choosing the tool.
          </p>
          <p>
            My background spans a mapping business in London, conservation work in Scotland and
            disaster response in India and Indonesia. A Master’s in Geography brought that field
            experience into a research practice rooted in South Africa.
          </p>
          <p>
            Through GeoTripz Spatial Solutions, my work connects geographic information with tourism
            and local opportunity. My University of South Africa research explored adventure-tourism
            hotspots and mobile knowledge in KwaZulu-Natal. Today, I bring that place-based
            perspective to spatial strategy and participatory mapping.
          </p>
          <SocialLinks />
        </div>
      </section>
      <Partnership />
      <section className="site-container site-section">
        <div className="site-section-heading">
          <p className="site-eyebrow">The approach</p>
          <h2>
            Context first.
            <br />
            <em>Tools with purpose.</em>
          </h2>
        </div>
        <div className="site-principles">
          <article>
            <span>01</span>
            <h3>See the whole place.</h3>
            <p>Consider the landscape, the people and the networks around a question.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Make evidence legible.</h3>
            <p>Use clear maps and explanations, with sources and limitations made visible.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Leave something useful.</h3>
            <p>Connect research to a decision, a working tool or a practical next step.</p>
          </article>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
