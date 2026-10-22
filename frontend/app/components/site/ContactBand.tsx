import { whatsappUrl } from '@/lib/site';
import Arrow from './Arrow';

export default function ContactBand(): React.ReactElement {
  return (
    <section className="site-contact-band">
      <div className="site-container site-contact-band-inner">
        <div>
          <p className="site-eyebrow">A place to start</p>
          <h2>
            Bring a place.
            <br />
            Let&apos;s find the possibility.
          </h2>
        </div>
        <div>
          <p>
            A location, a question, a dataset.
            <br />
            We&apos;ll work out the right next step together.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="site-button site-button-light"
            aria-label="Let's Talk on WhatsApp (opens in new tab)"
          >
            Let&apos;s Talk on WhatsApp <Arrow diagonal />
          </a>
        </div>
      </div>
    </section>
  );
}
