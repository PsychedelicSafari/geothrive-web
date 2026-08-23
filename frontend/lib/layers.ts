/**
 * Turning raw grid layer keys into something a human can read.
 *
 * The layer keys come straight off Kesh's source grid, so they are a mix of conventions:
 * `conservation_area` (square metres), `Beef cattle` (square metres, title case),
 * `SANS_FTYPE` (a shapefile attribute), `BL_LAT` (a province bounding box corner).
 * None of that means anything to someone looking at a map.
 *
 * Classification is by pattern rather than by an exhaustive list, because cells carry
 * different layers depending on what intersects them. An unrecognised key still lands
 * in a sensible group instead of vanishing.
 */

export type Theme =
  | 'conservation'
  | 'agriculture'
  | 'water'
  | 'climate'
  | 'terrain'
  | 'commercial'
  | 'reference';

export type ThemeMeta = { label: string; blurb: string; accent: string };

/** Display order is deliberate: what sells the land first, reference last. */
export const THEMES: Record<Theme, ThemeMeta> = {
  conservation: {
    label: 'Conservation & biodiversity',
    blurb: 'Protected areas, parks, and habitat overlapping this hexagon.',
    accent: 'var(--neon-cyan)',
  },
  agriculture: {
    label: 'Agriculture & grazing',
    blurb: 'What the land is currently suited to producing.',
    accent: 'var(--vac-mustard)',
  },
  water: {
    label: 'Water',
    blurb: 'Rivers, catchments, and water stress.',
    accent: '#4aa8ff',
  },
  climate: {
    label: 'Climate stress',
    blurb: 'Evaporation pressure, the main climate risk layer in this grid.',
    accent: 'var(--sunset-orange)',
  },
  terrain: {
    label: 'Terrain',
    blurb: 'Relief and landscape character.',
    accent: 'var(--vac-mint)',
  },
  commercial: {
    label: 'Commercial activity',
    blurb: 'Retail, entertainment, and other built-up footprint.',
    accent: 'var(--neon-pink)',
  },
  reference: {
    label: 'Reference',
    blurb: 'Administrative identifiers and source metadata.',
    accent: 'var(--vac-muted)',
  },
};

const RULES: ReadonlyArray<{ theme: Theme; test: RegExp }> = [
  { theme: 'conservation', test: /conserv|fauna|flora|sanbiparks|^t_areas|^t_regions|protect/i },
  { theme: 'agriculture', test: /agric|graz|cattle|ph_|crop|vegetab|crop|soil/i },
  { theme: 'water', test: /river|catchment|wetland|water|dam/i },
  { theme: 'climate', test: /evapo|rain|temper|drought|climate/i },
  { theme: 'terrain', test: /mountain|topograph|landscape|slope|elev/i },
  { theme: 'commercial', test: /entertainment|stores|retail|business|^other$/i },
];

/** Reference keys we know are plumbing rather than signal. */
const REFERENCE = new RegExp(
  [
    '^AG_PROV_ID$',
    '^BL_(LAT|LONG)$',
    '^TR_(LAT|LONG)$',
    '^CENTROID(X|Y)$',
    '^CODE$',
    '^TYPE$',
    '^OLD_NAME$',
    '^SOURCE$',
    '^UPDATED$',
    '^SANS_',
    '^group$',
    '^h3_area$',
  ].join('|'),
);

export function themeFor(layerKey: string): Theme {
  if (REFERENCE.test(layerKey)) return 'reference';
  for (const rule of RULES) {
    if (rule.test.test(layerKey)) return rule.theme;
  }
  return 'reference';
}

/**
 * Area layers are square metres of the hexagon covered by that thing. Everything that ends
 * in `_area`, plus the bare title-case land-use keys the source grid uses for the same idea.
 */
export function isAreaLayer(layerKey: string, value: unknown): boolean {
  if (typeof value !== 'number') return false;
  if (/_area$/i.test(layerKey)) return true;
  if (/^(agric_region_|grazing_group_|ph_|river_order_)/i.test(layerKey)) return true;
  return /^(Beef cattle|Entertainment|Stores|OTHER|Extreme Evaporation|Very High Evaporation)$/.test(
    layerKey,
  );
}

/** `agric_region_Vegetables` becomes `Vegetables`, `t_regions_area` becomes `Terrestrial regions`. */
export function humanise(layerKey: string): string {
  const known: Record<string, string> = {
    conservation_area: 'Conservation area',
    fauna_and_flora_area: 'Fauna and flora habitat',
    sanbiparks_2004_area: 'SANParks land',
    t_areas_area: 'Terrestrial areas',
    t_regions_area: 'Terrestrial regions',
    high_mountains_area: 'High mountains',
    mountains_area: 'Mountains',
    river_1km_area: 'Within 1 km of a river',
    stressed_catchments_area: 'Stressed catchment',
    h3_area: 'Hexagon area',
    OTHER: 'Other built-up',
    group: 'Parent hexagon',
    CODE: 'Province code',
    OLD_NAME: 'Former province name',
    SOURCE: 'Data source',
    UPDATED: 'Source updated',
  };
  if (known[layerKey]) return known[layerKey];

  const stripped = layerKey
    .replace(/^agric_region_/i, '')
    .replace(/^grazing_group_/i, 'Grazing group ')
    .replace(/^ph_/i, 'Soil pH ')
    .replace(/^river_order_/i, 'River order ')
    .replace(/_area$/i, '')
    .replace(/_/g, ' ')
    .trim();

  if (!stripped || stripped.toLowerCase() === 'none') return 'Unclassified';
  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

/** Square metres into the largest unit that still reads naturally. */
export function formatArea(squareMetres: number): string {
  if (squareMetres <= 0) return 'none';
  if (squareMetres < 10_000) return `${Math.round(squareMetres).toLocaleString()} m²`;
  if (squareMetres < 1_000_000) return `${(squareMetres / 10_000).toFixed(1)} ha`;
  return `${(squareMetres / 1_000_000).toFixed(1)} km²`;
}

export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(2);
  }
  return String(value);
}

/**
 * The layer names carried on every hexagon, for the locked preview.
 *
 * Names only, never values. The names are metadata about what the product covers; the values
 * are the licensed AfriGIS and government data that the tier gate exists to withhold. Junk
 * columns are left out: the two centroid columns hold province centroids rather than cell
 * centroids, and the rest are identifiers and bookkeeping.
 */
export const LOCKED_LAYERS: readonly string[] = [
  'conservation_area',
  'fauna_and_flora_area',
  'sanbiparks_2004_area',
  't_areas_area',
  't_regions_area',
  'river_1km_area',
  'river_order_1',
  'stressed_catchments_area',
  'ph_Neutral / Optimal',
  'Extreme Evaporation',
  'Very High Evaporation',
  'high_mountains_area',
  'mountains_area',
  'Topography',
  'Landscape',
  'agric_region_Vegetables',
  'grazing_group_3',
  'grazing_group_4',
  'Beef cattle',
  'Entertainment',
  'Stores',
];
