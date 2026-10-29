import type { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/lib/site';
import Arrow from '../../components/site/Arrow';
import ContactBand from '../../components/site/ContactBand';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Spatial strategy, location intelligence, ESG and circular economy, and regenerative place services from GeoThrive Africa.',
};

export default function ServicesPage(): React.ReactElement {
  return (
    <>
      <section className="site-container site-page-intro">
        <p className="site-eyebrow">Our services / Geography made useful</p>
        <h1>
          The right perspective
          <br />
          for your <em>next move.</em>
        </h1>
        <p>
          From an early question to a working spatial tool, we shape the work around the decision
          you need to make.
        </p>
      </section>
      <div className="site-container site-service-details">
        {services.map((service) => (
          <section id={service.id} key={service.id} className="site-service-detail">
            <div>
              <span className="site-row-number">{service.number} /</span>
              <h2>{service.title}</h2>
              <p className="site-service-audience">{service.audience}</p>
            </div>
            <div>
              <p className="site-lead">{service.description}</p>
              <p className="site-eyebrow site-delivery-label">What the work can include</p>
              <ul className="site-deliverables">
                {service.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
              <Link href="/contact" className="site-text-link">
                Discuss a brief <Arrow diagonal />
              </Link>
            </div>
          </section>
        ))}
      </div>
      <section className="site-container site-engagement">
        <p className="site-eyebrow">A scope that makes sense</p>
        <h2>
          Start with a conversation.
          <br />
          <em>Build from there.</em>
        </h2>
        <p>
          We agree the question, available data, deliverables and scope before the work begins. A
          focused assessment, a prototype or an ongoing advisory relationship can each be the right
          starting point.
        </p>
      </section>
      <section className="site-container site-section kiosk-editorial">
        <div>
          <p className="site-eyebrow">Guided experiences / Geography on the ground</p>
          <h2>
            Take the question
            <br />
            <em>into the landscape.</em>
          </h2>
        </div>
        <div className="kiosk-prose">
          <p className="site-lead">A Grid brought to life through guided experiences.</p>
          <p>
            Kshetra’s tours put local knowledge, guiding skills and natural assets into practice.
            Explore The Green Door, The Peninsula Side Quest and The Full Quest, and see how an
            active Grid can connect with nearby people, enterprises and opportunity.
          </p>
          <Link href="/tours" className="site-button">
            Explore guided experiences <Arrow />
          </Link>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
