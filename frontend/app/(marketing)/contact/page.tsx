import type { Metadata } from 'next';
import { contactEmail } from '@/lib/site';
import EnquiryForm from '../../components/site/EnquiryForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Discuss a spatial strategy, mapping, GIS or place-based project with GeoThrive Africa.',
};

export default function ContactPage(): React.ReactElement {
  return (
    <>
      <section className="site-container site-page-intro">
        <p className="site-eyebrow">Start a conversation</p>
        <h1>
          A place. A question.
          <br />
          <em>A possibility.</em>
        </h1>
        <p>
          Tell me what you&apos;re working on. We&apos;ll explore how geographic thinking could
          help.
        </p>
      </section>
      <section className="site-container site-contact-grid">
        <div>
          <p className="site-eyebrow">Talk to Kshetra</p>
          <h2>
            Let&apos;s find
            <br />
            the <em>starting point.</em>
          </h2>
          <p>
            You don&apos;t need a perfect brief. A location, a challenge or an idea is enough to
            begin.
          </p>
          <dl className="site-contact-details">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>Cape Town, South Africa</dd>
            </div>
          </dl>
          <div className="site-contact-process">
            <p className="site-eyebrow">What happens next</p>
            <p>
              We discuss the question, consider the available information and agree whether a scoped
              project is the right fit.
            </p>
          </div>
        </div>
        <EnquiryForm />
      </section>
    </>
  );
}
