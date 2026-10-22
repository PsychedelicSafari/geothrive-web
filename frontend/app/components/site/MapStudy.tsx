import BrandMark from './BrandMark';

export default function MapStudy(): React.ReactElement {
  return (
    <figure className="site-map-study brand-map-study">
      <div className="site-map-heading">
        <span>A GEOGRAPHY OF POSSIBILITY</span>
        <span>33° S / 18° E</span>
      </div>
      <div className="brand-map-plane">
        <div className="brand-map-orbit orbit-a" />
        <div className="brand-map-orbit orbit-b" />
        <BrandMark idPrefix="hero-yantra" className="brand-map-mark" />
        <span className="brand-map-north">N ↑</span>
        <span className="brand-map-coordinate">PLACE / PEOPLE / PATTERNS</span>
      </div>
      <figcaption>
        <span>Sacred geometry × Spatial thinking</span>
        <span>Illustrative cartography</span>
      </figcaption>
    </figure>
  );
}
