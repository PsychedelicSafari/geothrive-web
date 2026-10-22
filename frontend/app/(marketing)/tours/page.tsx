import type { Metadata } from 'next';
import Link from 'next/link';
import { whatsappUrl } from '@/lib/site';
import ContactBand from '../../components/site/ContactBand';
import Arrow from '../../components/site/Arrow';

export const metadata: Metadata = {
  title: 'Guided Experiences',
  description:
    'A Grid brought to life through local knowledge, guiding skills and natural assets. Explore The Green Door, The Peninsula Side Quest and The Full Quest with Kshetra.',
};

const experiences = [
  {
    code: 'C',
    name: 'The Green Door',
    label: 'Signature tour',
    format: 'Newlands Forest towards Kirstenbosch',
    paragraphs: [
      'A guided forest-edge route from Panorama Guest House through Newlands Forest toward Kirstenbosch, blending indigenous forest, Afro-temperate biodiversity, contour paths, story, and mountain quiet.',
      'This is the signature route for curious travellers who want more than a postcard. It is Cape Town through the breathing side of the mountain: forest, ecology, local knowledge, and a gentle reminder that Table Mountain has been running a silent university for millions of years.',
    ],
    availability: null,
  },
  {
    code: 'D',
    name: 'The Peninsula Side Quest',
    label: 'Most popular',
    format: 'Half-day journey',
    paragraphs: [
      'Sacred sites, mountain paths, coastline, and local story in one focused half-day journey. For travellers who want the essence without needing to pack a sleeping bag, and their entire ancestral archive.',
      'We move lightly, listen carefully, and let the Cape do what the Cape does best: rearrange your perspective with wind, stone, and ridiculous beauty.',
    ],
    availability: null,
  },
  {
    code: 'E',
    name: 'The Full Quest',
    label: 'Full-Day Private Safari',
    format: 'Full-day curated exploration',
    paragraphs: [
      'Forest, mountain, ceremony space, coastline, and a full day of curated land-based exploration. Pack light. You will not need the baggage.',
      'This is the deeper private journey for guests who want time, spaciousness, and a route shaped around energy, weather, interests, and the intelligence of the day. The itinerary has a plan. The mountain may still make edits.',
      'Optional private add-ons may include grounding practices, forest reflection, creative ritual, or a simple inspired fire circle where suitable, safe, and pre-arranged.',
    ],
    availability: 'Seasonal, pre-booking required.',
  },
] as const;

export default function ToursPage(): React.ReactElement {
  return (
    <>
      <section className="site-container site-page-intro">
        <p className="site-eyebrow">A Grid in practice / Guided experiences</p>
        <h1>
          Read the landscape.
          <br />
          <em>Bring a Grid to life.</em>
        </h1>
        <p>
          These tours are Kshetra’s Grid brought into practice: local knowledge, guiding skills and
          natural assets connected to create meaningful journeys and local opportunity.
        </p>
      </section>

      <section className="site-container tours-grid-story" aria-labelledby="grid-in-practice">
        <div>
          <p className="site-eyebrow">Map. Connect. Regenerate.</p>
          <h2 id="grid-in-practice">
            One place activated.
            <br />
            <em>A wider field of possibility.</em>
          </h2>
        </div>
        <div>
          <p>
            Here, a Grid begins with a place and the relationships around it. These experiences
            bring that idea to life through forest, mountain, coast and the people who know them.
          </p>
          <p>
            An active Grid becomes a starting point for working with others nearby: connecting local
            guides and enterprises, sharing skills, and shaping opportunities together. Proximity
            helps us discover who we can work with and what we can make possible, one Grid at a
            time.
          </p>
          <Link href="/join" className="site-text-link">
            Explore Join the Grid <Arrow />
          </Link>
        </div>
      </section>

      <section className="site-container tours-list" aria-label="Guided experiences C, D and E">
        {experiences.map(({ code, name, label, format, paragraphs, availability }) => (
          <article key={code} className="tour-row">
            <span className="tour-letter" aria-hidden="true">
              {code}.
            </span>
            <div>
              <span className="tour-badge">{label}</span>
              <p className="site-eyebrow">
                Experience {code} / {format}
              </p>
              <h2>{name}</h2>
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {availability && (
                <p className="tour-availability">
                  <strong>Availability:</strong> {availability}
                </p>
              )}
            </div>
            <a
              href={`${whatsappUrl}?text=${encodeURIComponent(`Hi Kshetra, I’d like to enquire about ${name} through GeoThrive Africa.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="site-text-link"
            >
              Enquire on WhatsApp <Arrow diagonal />
            </a>
          </article>
        ))}
      </section>
      <section className="site-container tours-note">
        <p>
          Discuss dates, group size, current pricing and arrangements before booking. Enquiry links
          open WhatsApp; nothing is sent automatically.
        </p>
        <a
          href="https://psychedelicsafari.guide/"
          target="_blank"
          rel="noopener noreferrer"
          className="site-text-link"
        >
          Explore Psychedelic Safari <Arrow diagonal />
        </a>
      </section>
      <ContactBand />
    </>
  );
}
