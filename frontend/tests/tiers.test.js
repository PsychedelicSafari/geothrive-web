import { expect, test } from 'bun:test';
import { currentTier, visibleTiers } from '../lib/tiers';

const cases = [
  ['basic', ['basic']],
  ['standard', ['basic', 'standard']],
  ['enterprise', ['basic', 'standard', 'enterprise']],
  ['unknown', ['basic']],
  ['', ['basic']],
  ['__proto__', ['basic']],
  ['constructor', ['basic']],
  ['toString', ['basic']],
  ['hasOwnProperty', ['basic']],
];

for (const [tier, expected] of cases) {
  test('visible tiers use the restrictive fallback for ' + JSON.stringify(tier), () => {
    expect(visibleTiers(tier)).toEqual(expected);
  });
}

test('deployment tier normalizes known names and rejects unknown or inherited names', () => {
  const previous = process.env.GEOTHRIVE_TIER;
  try {
    for (const [configured, expected] of [
      [undefined, 'basic'],
      [' STANDARD ', 'standard'],
      ['ENTERPRISE', 'enterprise'],
      ['unknown', 'basic'],
      ['', 'basic'],
      ['__proto__', 'basic'],
      ['constructor', 'basic'],
      ['hasOwnProperty', 'basic'],
    ]) {
      if (configured === undefined) delete process.env.GEOTHRIVE_TIER;
      else process.env.GEOTHRIVE_TIER = configured;
      expect(currentTier()).toBe(expected);
    }
  } finally {
    if (previous === undefined) delete process.env.GEOTHRIVE_TIER;
    else process.env.GEOTHRIVE_TIER = previous;
  }
});
