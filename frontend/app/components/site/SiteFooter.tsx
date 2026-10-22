import Link from 'next/link';
import { navigation, whatsappUrl } from '@/lib/site';
import Arrow from './Arrow';
import SocialLinks from './SocialLinks';

export default function SiteFooter(): React.ReactElement {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="site-footer-top">
          <div>
            <Link href="/" className="site-footer-brand">
              GeoThrive Africa<span className="site-brand-dot">.</span>
            </Link>
            <p>Map. Connect. Regenerate.</p>
          </div>
          <nav aria-label="Footer navigation">
            {navigation.map(({ href, label }) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
            <Link href="/contact">Contact</Link>
          </nav>
          <a
            className="site-footer-email"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Let&apos;s Talk on WhatsApp <Arrow diagonal />
          </a>
        </div>
        <div className="site-footer-social">
          <p className="site-eyebrow">Follow Kshetra / GeoThrive Africa</p>
          <SocialLinks />
          <a
            className="site-legal-link"
            href="https://www.afrigis.co.za/legal/"
            target="_blank"
            rel="noopener noreferrer"
          >
            AfriGIS terms, licensing &amp; legal ↗
          </a>
        </div>
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} GeoThrive Africa</span>
          <span>Spatial thinking. Grounded in Africa.</span>
          <span>Cape Town, South Africa</span>
        </div>
      </div>
    </footer>
  );
}
