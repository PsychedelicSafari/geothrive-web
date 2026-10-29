import Link from 'next/link';
import Arrow from './Arrow';

export default function ToblerFeature(): React.ReactElement {
  return (
    <section id="tobler-law" className="site-container site-section tobler-feature">
      <div className="tobler-diagram" aria-hidden="true">
        <span className="tobler-centre">PLACE</span>
        <span className="tobler-near">NEARBY</span>
        <span className="tobler-far">FURTHER AWAY</span>
      </div>
      <div>
        <p className="site-eyebrow">Tobler’s First Law of Geography</p>
        <h2>
          Closer places.
          <br />
          <em>Stronger connections.</em>
        </h2>
        <blockquote className="site-lead tobler-quote">
          “Everything is related to everything else, but near things are more related than distant
          things.”
        </blockquote>
        <p>
          Think of a local supplier, the stream through a neighbourhood or the skills around a
          community project. Distance helps us ask better questions about their connections. It does
          not explain every relationship.
        </p>
        <p>
          H3 gives us a common grid for exploring this context. The Mapping Kiosk brings local
          knowledge into the conversation.
        </p>
        <Link href="/mapping-kiosk" className="site-text-link">
          See geography in practice <Arrow />
        </Link>
        <p className="kiosk-source-note">
          Waldo Tobler, 1970 ·{' '}
          <a href="https://doi.org/10.2307/143141" target="_blank" rel="noopener noreferrer">
            A Computer Movie Simulating Urban Growth in the Detroit Region
          </a>
        </p>
      </div>
    </section>
  );
}
