import type { Metadata } from 'next';
import { EB_Garamond, Geist_Mono, Syne } from 'next/font/google';
import './globals.css';
import './site.css';
import './sprint03.css';
import './brand-theme.css';

const syne = Syne({ variable: '--font-syne', subsets: ['latin'], weight: ['600', '700', '800'] });
const ebGaramond = EB_Garamond({ variable: '--font-eb-garamond', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://geothrive.africa'),
  title: {
    default: 'GeoThrive Africa | Spatial Strategy & Location Intelligence',
    template: '%s | GeoThrive Africa',
  },
  description:
    'Spatial strategy, location intelligence and regenerative geography. GeoThrive Africa connects places, people and geographic evidence with practical decisions.',
  openGraph: { siteName: 'GeoThrive Africa', locale: 'en_ZA', type: 'website' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${ebGaramond.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
