export const contactEmail = 'kshetra.govindasamy@gmail.com';

// Public WhatsApp destination confirmed by Kshetra for GeoThrive, 17 October 2026.
export const whatsappUrl = 'https://wa.me/27795236855';

export const legacyMapUrl = 'https://map-geotripz.afrigis.co.za/';

export const navigation = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/explore', label: 'H3 Explorer' },
  { href: '/mapping-kiosk', label: 'Mapping Kiosk' },
  { href: '/join', label: 'Join the Grid' },
  { href: '/tours', label: 'Tours' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
] as const;

export const services = [
  {
    id: 'spatial-strategy',
    number: '01',
    title: 'Spatial strategy',
    summary: 'Find the geographic context behind your next decision.',
    description:
      'Bring a location question into focus. We connect your objectives with the places, people and conditions that matter, then shape a practical way forward.',
    outcomes: [
      'A clear spatial brief',
      'Location and opportunity assessment',
      'Maps and decision support',
    ],
    audience: 'For organisations choosing where to invest, operate or grow.',
  },
  {
    id: 'location-intelligence',
    number: '02',
    title: 'Location intelligence',
    summary: 'Turn layers of information into a picture you can act on.',
    description:
      'Use GIS, H3 grids and proximity analysis to understand how assets, businesses, communities and opportunities relate to one another.',
    outcomes: [
      'H3 and proximity analysis',
      'Interactive map prototypes',
      'A documented spatial evidence base',
    ],
    audience: 'For teams that need to see connections their spreadsheets cannot show.',
  },
  {
    id: 'esg-circular-economy',
    number: '03',
    title: 'ESG & circular economy',
    summary: 'Connect sustainability ambitions to the places they affect.',
    description:
      'Explore local procurement, resource relationships and community investment through a geographic lens. Build a clearer picture of the evidence and its limits.',
    outcomes: [
      'Place-based opportunity mapping',
      'Local network and resource analysis',
      'Evidence-led reporting frameworks',
    ],
    audience: 'For organisations developing grounded sustainability programmes.',
  },
  {
    id: 'regenerative-places',
    number: '04',
    title: 'Regenerative places',
    summary: 'Understand what makes a place valuable, and what comes next.',
    description:
      'Bring landscape, heritage, tourism and community context into the same conversation. Develop spatial concepts and tools around the character of a place.',
    outcomes: [
      'Landscape and destination research',
      'Heritage and community mapping',
      'Place-based concepts and prototypes',
    ],
    audience: 'For destinations, events and teams working with living landscapes.',
  },
] as const;

export const socialProfiles = [
  { network: 'x', label: 'X', handle: '@Kshetra', url: 'https://x.com/Kshetra' },
  {
    network: 'youtube',
    label: 'YouTube',
    handle: '@kshetra_g',
    url: 'https://www.youtube.com/@kshetra_g',
  },
  {
    network: 'linkedin',
    label: 'LinkedIn',
    handle: 'kshetra',
    url: 'https://www.linkedin.com/in/kshetra/',
  },
] as const;
