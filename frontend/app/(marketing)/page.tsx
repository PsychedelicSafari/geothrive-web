import Link from 'next/link';
import { services } from '@/lib/site';
import { newsPosts } from '@/lib/news';
import NewsCard from '../components/site/NewsCard';
import Partnership from '../components/site/Partnership';
import Arrow from '../components/site/Arrow';
import ContactBand from '../components/site/ContactBand';
import MapStudy from '../components/site/MapStudy';
import ToblerFeature from '../components/site/ToblerFeature';

export default function Home(): React.ReactElement {
  return (
    <>
      <section className="site-container site-hero">
        <div className="site-hero-copy">
          <p className="site-eyebrow">
            <span className="site-status-dot" /> Spatial strategy & location intelligence
          </p>
          <h1>
            Opportunity
            <br />
            has a <em>location.</em>
          </h1>
          <p className="site-hero-description">
            Make sense of places. See the connections.
            <br className="site-desktop-break" /> Turn geographic insight into your next move.
          </p>
          <div className="site-actions">
            <Link href="/contact" className="site-button">
              Let&apos;s map your next move <Arrow diagonal />
            </Link>
            <Link href="/explore" className="site-text-link">
              Explore the map <Arrow />
            </Link>
          </div>
          <div className="site-hero-footnote">
            <span>BASED IN CAPE TOWN</span>
            <span>THINKING ACROSS AFRICA</span>
          </div>
        </div>
        <MapStudy />
      </section>

      <Partnership compact />

      <div className="site-discipline-strip">
        <div className="site-container">
          <span>Geography with purpose</span>
          <p>
            Spatial strategy <b>·</b> GIS & H3 <b>·</b> ESG & circular economy <b>·</b> Regenerative
            places
          </p>
        </div>
      </div>

      <section className="site-container site-section">
        <div className="site-section-heading">
          <p className="site-eyebrow">01 / A different perspective</p>
          <h2>
            Every decision happens
            <br />
            somewhere. <em>Start there.</em>
          </h2>
        </div>
        <div className="site-intro-copy">
          <p>
            A map can show you where things are. The right spatial thinking helps you understand why
            they matter, how they connect, and what you can do next.
          </p>
          <p>
            GeoThrive Africa brings geographic research, practical GIS and place-based strategy
            together for organisations working with land, communities and opportunity.
          </p>
        </div>
        <div className="site-service-list">
          {services.map((service) => (
            <Link className="site-service-row" href={`/services#${service.id}`} key={service.id}>
              <span className="site-row-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <Arrow diagonal />
            </Link>
          ))}
        </div>
        <Link href="/services" className="site-text-link site-section-link">
          Find the right approach <Arrow />
        </Link>
      </section>

      <section className="site-platform-section">
        <div className="site-container site-platform-grid">
          <div className="site-platform-visual" aria-hidden="true">
            <div className="site-orbit orbit-one" />
            <div className="site-orbit orbit-two" />
            <div className="site-orbit orbit-three" />
            <div className="site-platform-hex">H3</div>
            <span className="site-visual-label label-top">A COMMON SPATIAL LANGUAGE</span>
            <span className="site-visual-label label-bottom">ONE CELL. MANY CONNECTIONS.</span>
          </div>
          <div>
            <p className="site-eyebrow">02 / From thinking to seeing</p>
            <h2>
              A new way to
              <br />
              <em>read the landscape.</em>
            </h2>
            <p className="site-body-copy">
              Explore South Africa through an H3 grid. Inspect a place, compare its context and
              discover how layers of geographic information can support a decision.
            </p>
            <Link href="/explore" className="site-button">
              Open the H3 Explorer <Arrow diagonal />
            </Link>
            <p className="site-platform-note">Interactive map · Cell insights · Field scanner</p>
          </div>
        </div>
      </section>

      <section className="site-container site-section">
        <div className="site-section-heading site-heading-split">
          <div>
            <p className="site-eyebrow">03 / How we work</p>
            <h2>
              From a good question
              <br />
              to a <em>useful outcome.</em>
            </h2>
          </div>
          <p>
            Start with the decision.
            <br />
            Build the right evidence.
            <br />
            Make it usable.
          </p>
        </div>
        <ol className="site-process">
          <li>
            <span>01 / UNDERSTAND</span>
            <h3>Frame the question.</h3>
            <p>Clarify your objectives, the place and the decisions the work needs to support.</p>
          </li>
          <li>
            <span>02 / CONNECT</span>
            <h3>Find the relationships.</h3>
            <p>
              Bring relevant data, geographic context and local knowledge into the same picture.
            </p>
          </li>
          <li>
            <span>03 / MAKE USEFUL</span>
            <h3>Put insight to work.</h3>
            <p>Deliver a clear map, working prototype or practical framework your team can use.</p>
          </li>
        </ol>
      </section>

      <ToblerFeature />

      <section className="site-container site-founder-strip">
        <div className="site-founder-initials" aria-hidden="true">
          KG<span>33° S / 18° E</span>
        </div>
        <div>
          <p className="site-eyebrow">A geographer at the table</p>
          <h2>
            Grounded thinking.
            <br />
            <em>A wider view.</em>
          </h2>
          <p>
            Led by Kshetra Govindasamy, GeoThrive connects spatial strategy with the everyday
            realities of people, organisations and places.
          </p>
          <Link href="/about" className="site-text-link">
            Meet Kshetra <Arrow />
          </Link>
        </div>
      </section>
      <section className="site-container site-section news-home">
        <div className="site-section-heading site-heading-split">
          <div>
            <p className="site-eyebrow">News &amp; field notes</p>
            <h2>
              From the field.
              <br />
              <em>Into the conversation.</em>
            </h2>
          </div>
          <Link href="/news" className="site-text-link">
            All field notes <Arrow />
          </Link>
        </div>
        <div className="news-grid">
          {newsPosts.map((post) => (
            <NewsCard key={post.slug} post={post} heading="h3" />
          ))}
        </div>
      </section>
      <ContactBand />
    </>
  );
}
