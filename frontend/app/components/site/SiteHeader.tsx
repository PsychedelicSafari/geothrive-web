'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { navigation, whatsappUrl } from '@/lib/site';
import Arrow from './Arrow';
import BrandMark from './BrandMark';

export default function SiteHeader({ dark = false }: { dark?: boolean }): React.ReactElement {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <header className={`site-header${dark ? ' site-header-dark' : ''}`}>
      <a className="site-skip" href="#main-content">
        Skip to content
      </a>
      <div className="site-container site-header-inner">
        <Link
          href="/"
          className="site-brand"
          aria-label="GeoThrive Africa home"
          onClick={() => setOpen(false)}
        >
          <BrandMark idPrefix="header-yantra" className="site-brand-mark" />
          <span>
            GeoThrive<span className="site-brand-region">AFRICA</span>
          </span>
        </Link>
        <button
          ref={menuButton}
          className="site-menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '−' : '+'}</span>
        </button>
        <nav
          id="site-navigation"
          aria-label="Main navigation"
          className={`site-nav${open ? ' is-open' : ''}`}
        >
          {navigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={
                (
                  href === '/'
                    ? pathname === '/'
                    : pathname === href || pathname.startsWith(`${href}/`)
                )
                  ? 'page'
                  : undefined
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="site-nav-contact"
            aria-label="Let's Talk on WhatsApp (opens in new tab)"
            onClick={() => setOpen(false)}
          >
            Let&apos;s Talk <Arrow diagonal />
          </a>
        </nav>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="site-mobile-talk"
        aria-label="Let's Talk on WhatsApp (opens in new tab)"
      >
        Let&apos;s Talk <Arrow diagonal />
      </a>
    </header>
  );
}
