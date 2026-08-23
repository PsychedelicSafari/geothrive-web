import type { Metadata } from 'next';
import { EB_Garamond, Geist_Mono, Syne } from 'next/font/google';
import './globals.css';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
});

const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GeoThrive',
  description:
    'South Africa cut into 34,000 hexagons and weighed against forty layers of conservation, water, terrain and land use. Plus live address search and weather via AfriGIS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${ebGaramond.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-navy-deep text-cream">{children}</body>
    </html>
  );
}
