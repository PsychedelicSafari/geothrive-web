import { beforeEach, expect, mock, test } from 'bun:test';

const internalMessage = 'INTERNAL_ONLY: provider response and database connection details';
const failure = () => Promise.reject(new Error(internalMessage));
const autocomplete = mock(failure);
const geocode = mock(failure);
const weather = mock(failure);
const cells = mock(failure);
const cell = mock(failure);
const snapshot = mock(failure);
const health = mock(failure);

// Mock before importing routes: these tests must not load credentials or contact services.
mock.module('@/lib/afrigis', () => ({
  afrigisAutocomplete: autocomplete,
  afrigisGeocode: geocode,
  afrigisWeather: weather,
}));
mock.module('@/lib/geothrive', () => ({
  gridCells: cells,
  gridCell: cell,
  gridSnapshot: snapshot,
  gridHealth: health,
}));

const routes = [
  [
    'autocomplete',
    (await import('../app/api/afrigis/autocomplete/route')).GET,
    '?query=Cape',
    'Address search is temporarily unavailable.',
  ],
  [
    'geocode',
    (await import('../app/api/afrigis/geocode/route')).GET,
    '?query=Cape',
    'Address search is temporarily unavailable.',
  ],
  [
    'weather',
    (await import('../app/api/afrigis/weather/route')).GET,
    '?lat=-33.9&lng=18.4',
    'Weather is temporarily unavailable.',
  ],
  [
    'cells',
    (await import('../app/api/grid/cells/route')).GET,
    '?bbox=18,-34,19,-33',
    'Map data is temporarily unavailable.',
  ],
  [
    'cell',
    (await import('../app/api/grid/cell/[h3]/route')).GET,
    '',
    'Map data is temporarily unavailable.',
  ],
  [
    'snapshot',
    (await import('../app/api/grid/snapshot/route')).GET,
    '?lat=-33.9&lng=18.4',
    'Map data is temporarily unavailable.',
  ],
  [
    'health',
    (await import('../app/api/grid/health/route')).GET,
    '',
    'Map data is temporarily unavailable.',
  ],
];

beforeEach(() => {
  for (const fn of [autocomplete, geocode, weather, cells, cell, snapshot, health]) {
    fn.mockReset();
    fn.mockImplementation(failure);
  }
});

for (const [name, get, query, message] of routes) {
  test(`${name}: dependency failures never expose internal details`, async () => {
    const response = await get(new Request(`https://example.test/api/${name}${query}`), {
      params: Promise.resolve({ h3: '86972124fffffff' }),
    });
    expect(response.status).toBe(502);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({ error: message });
  });
}

test('cell: only an explicit missing-cell error becomes a safe 404', async () => {
  cell.mockImplementation(() => {
    const error = new Error(internalMessage);
    error.name = 'NotInGrid';
    return Promise.reject(error);
  });
  const get = routes.find(([name]) => name === 'cell')[1];
  const response = await get(new Request('https://example.test/api/grid/cell/86972124fffffff'), {
    params: Promise.resolve({ h3: '86972124fffffff' }),
  });
  expect(response.status).toBe(404);
  expect(response.headers.get('cache-control')).toBe('no-store');
  expect(await response.json()).toEqual({ error: 'Cell not found.' });
});

test('cell: an upstream message containing 404 is not a missing-cell signal', async () => {
  cell.mockRejectedValue(new Error('INTERNAL_ONLY: upstream status 404 during authentication'));
  const get = routes.find(([name]) => name === 'cell')[1];
  const response = await get(new Request('https://example.test/api/grid/cell/86972124fffffff'), {
    params: Promise.resolve({ h3: '86972124fffffff' }),
  });
  expect(response.status).toBe(502);
  expect(await response.json()).toEqual({ error: 'Map data is temporarily unavailable.' });
});

test('missing query stays a 400 and never calls a metered provider', async () => {
  const get = routes.find(([name]) => name === 'autocomplete')[1];
  const response = await get(new Request('https://example.test/api/afrigis/autocomplete'));
  expect(response.status).toBe(400);
  expect(autocomplete).not.toHaveBeenCalled();
});

test('successful map responses retain their data and cache policy', async () => {
  cells.mockResolvedValue({ type: 'FeatureCollection', features: [], count: 0 });
  const get = routes.find(([name]) => name === 'cells')[1];
  const response = await get(new Request('https://example.test/api/grid/cells?bbox=18,-34,19,-33'));
  expect(response.status).toBe(200);
  expect(response.headers.get('cache-control')).toBe('s-maxage=300, stale-while-revalidate=600');
  expect(await response.json()).toEqual({
    type: 'FeatureCollection',
    features: [],
    count: 0,
    truncated: false,
  });
});
