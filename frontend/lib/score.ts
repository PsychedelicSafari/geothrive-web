/**
 * The weight score and Kesh's recommendation ladder.
 *
 * `geothrive.weight.v0` is Kesh's own derived output, and it is the part of this dataset he is
 * allowed to sell. In his words: "the darker the red is the more naturally pristine and more
 * protected and more awesome is the area away from human builtup areas. So it's a derived
 * calculation. So I can sell the derived calculation but not the layers."
 *
 * So the ramp runs pale to deep red, and deep red means pristine. Not a rainbow, and not
 * green-for-good: he has been showing people dark red hexagons for months.
 *
 * Band boundaries are the observed minima of each tag in the source grid, not guesses. The
 * distribution is savagely skewed, 28,795 of 33,996 cells sit under 1.478 with no tag at all,
 * which is why this renders as five bands rather than a linear ramp. A linear ramp draws
 * South Africa as one flat blob with 149 bright specks on it.
 */

export type Tier = {
  id: 1 | 2 | 3 | 4 | 0;
  /** Kesh's own label. The source misspells "recomended"; corrected for display only. */
  label: string;
  /** What it means for someone deciding what to do with the land. */
  meaning: string;
  colour: string;
  /** Lowest score carrying this tag in the source grid. */
  min: number;
  /** How many of the 33,996 cells fall in this band. */
  cells: number;
};

export const TIERS: readonly Tier[] = [
  {
    id: 1,
    label: 'Highly recommended',
    meaning: 'Pristine, protected, far from anything built. The best land in the country.',
    colour: '#7f0d20',
    min: 7.355,
    cells: 149,
  },
  {
    id: 2,
    label: 'Recommended',
    meaning: 'Strong ground. Worth a site visit and a full report.',
    colour: '#c0273a',
    min: 4.416,
    cells: 966,
  },
  {
    id: 3,
    label: 'Might be worthwhile',
    meaning: 'Mixed signals. Depends what you intend to do with it.',
    colour: '#e35f43',
    min: 3.134,
    cells: 1857,
  },
  {
    id: 4,
    label: 'Not much, but there is something',
    meaning: 'Thin, but not empty. One or two layers carry it.',
    colour: '#f0a06a',
    min: 1.478,
    cells: 2229,
  },
  {
    id: 0,
    label: 'Below threshold',
    meaning: 'Nothing the weight model rates. Five sixths of the country looks like this.',
    colour: '#3c4a63',
    min: 0,
    cells: 28795,
  },
] as const;

/** Highest score anywhere in the source grid. Used to scale the 3D extrusion. */
export const MAX_SCORE = 14.886;

export function tierFor(score: number | null | undefined): Tier {
  if (score === null || score === undefined) return TIERS[TIERS.length - 1];
  return TIERS.find((t) => score >= t.min) ?? TIERS[TIERS.length - 1];
}

/** Kesh's tags arrive as "1_Highly recomended". Strip the sort prefix and fix the spelling. */
export function cleanTag(tag: string | null | undefined): string | null {
  if (!tag) return null;
  const fixed = tag
    .replace(/^\d+_/, '')
    .trim()
    .replace(/recomended/gi, 'recommended')
    .replace(/worth while/gi, 'worthwhile');
  // Kesh's tags arrive sentence-cased. The spelling fix lowercases the first word, so restore it.
  return fixed.charAt(0).toUpperCase() + fixed.slice(1);
}

/** MapLibre step expression: score to band colour. Unscored cells keep the bottom colour. */
export function scoreColourExpression(): unknown[] {
  return [
    'step',
    ['coalesce', ['get', 'score'], -1],
    TIERS[4].colour,
    TIERS[3].min,
    TIERS[3].colour,
    TIERS[2].min,
    TIERS[2].colour,
    TIERS[1].min,
    TIERS[1].colour,
    TIERS[0].min,
    TIERS[0].colour,
  ];
}
