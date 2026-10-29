import type { Metadata } from 'next';
import Link from 'next/link';
import Arrow from '../../components/site/Arrow';
import ContactBand from '../../components/site/ContactBand';
import MappingWorkflowVisual from '../../components/site/MappingWorkflowVisual';

export const metadata: Metadata = {
  title: 'Join the Grid',
  description:
    'Put your place on the map. Help shape an African-first participation model for people, businesses, skills and community opportunity.',
};

export default function JoinPage(): React.ReactElement {
  return (
    <>
      <section className="site-container join-hero">
        <div>
          <p className="site-eyebrow">Join the Grid / People make places</p>
          <h1>
            Put your place
            <br />
            <em>on the map.</em>
          </h1>
          <p className="site-lead">
            An African-first approach to mapping people, businesses, skills, community initiatives
            and local opportunity.
          </p>
          <p>
            Every place holds knowledge. The people who live, work and care for it should help shape
            how it is understood.
          </p>
          <a href="#participation" className="site-button">
            Explore participation <Arrow />
          </a>
        </div>
        <div className="join-map-story">
          <MappingWorkflowVisual step={3} />
          <p className="site-eyebrow">People · Skills · Enterprise · Nature</p>
          <p>
            A place is more
            <br />
            than a coordinate.
          </p>
          <span className="site-eyebrow">Local knowledge / Shared possibility</span>
        </div>
      </section>
      <section id="participation" className="site-container site-section">
        <p className="site-eyebrow">A participation model in development</p>
        <h2>
          Start local.
          <br />
          <em>Connect what matters.</em>
        </h2>
        <div className="join-pillars">
          <article>
            <span className="site-eyebrow">01 / People & skills</span>
            <h3>Make local capability visible.</h3>
            <p>
              Explore how knowledge, skills and interests could connect with opportunities nearby.
            </p>
          </article>
          <article>
            <span className="site-eyebrow">02 / Businesses & initiatives</span>
            <h3>Understand your neighbourhood.</h3>
            <p>Bring enterprise and community activity into a shared geographic conversation.</p>
          </article>
          <article>
            <span className="site-eyebrow">03 / Natural resources</span>
            <h3>See the wider environment.</h3>
            <p>Consider the landscape and resources that support a place, alongside its people.</p>
          </article>
        </div>
      </section>
      <section className="site-container join-principles kiosk-editorial">
        <div>
          <p className="site-eyebrow">Participation with care</p>
          <h2>
            Your information.
            <br />
            <em>Your choice.</em>
          </h2>
        </div>
        <div className="kiosk-prose">
          <p className="site-lead">
            Participation is being designed independently of mandatory Meta or social-media login.
          </p>
          <p>
            This page introduces the idea. Registration and public submissions are not open here,
            and there is no personal-information form on this page.
          </p>
          <p>
            Before onboarding opens, the privacy and security design must explain consent,
            moderation, visibility, storage locations, providers and how to correct or remove
            information. African-first describes our focus; it is not a promise that all data stays
            in Africa.
          </p>
          <Link href="/contact" className="site-text-link">
            Discuss the participation model <Arrow />
          </Link>
        </div>
      </section>
      <section className="kiosk-join">
        <div className="site-container kiosk-editorial">
          <div>
            <p className="site-eyebrow">See the roots of the idea</p>
            <h2>
              Where is where
              <br />
              <em>it starts.</em>
            </h2>
          </div>
          <div>
            <p>
              Discover the GeoTripz Mapping Kiosk and the participatory approach documented in its
              February 2025 guide.
            </p>
            <Link href="/mapping-kiosk" className="site-button site-button-light">
              Visit the Mapping Kiosk <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
