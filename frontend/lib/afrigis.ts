/**
 * AfriGIS API client (server-side only).
 *
 * AfriGIS runs on AWS Cognito. Two steps to call a service:
 *   1. POST client_credentials to the token endpoint with HTTP Basic auth to get a Bearer token.
 *   2. Call the service with `Authorization: Bearer <token>` and `x-api-key: <key>`.
 *
 * The Bearer token is valid for one hour, so we cache it in module memory and only
 * mint a new one when it is about to expire. Several AfriGIS services are metered at
 * 5 to 20 requests per month on the trial, so the long-term plan is a PostGIS cache
 * keyed by H3 cell in front of this client. This file is just the raw transport.
 *
 * Credentials come from env (see .env.example). Never hard-code them.
 */

const TOKEN_URL = 'https://auth.afrigis.services/oauth2/token';
const BASE_URL = 'https://afrigis.services';

type CachedToken = { token: string; expiresAt: number };
let cached: CachedToken | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cached && cached.expiresAt > now + 60_000) {
    return cached.token;
  }

  const clientId = requireEnv('AFRIGIS_CLIENT_ID');
  const clientSecret = requireEnv('AFRIGIS_CLIENT_SECRET');
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error(`AfriGIS token request failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cached = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };
  return cached.token;
}

async function callService(path: string, params: Record<string, string>): Promise<unknown> {
  const token = await getAccessToken();
  const apiKey = requireEnv('AFRIGIS_API_KEY');
  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-api-key': apiKey,
    },
  });

  if (!res.ok) {
    throw new Error(`AfriGIS request to ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

/** Address autocomplete. Counts against the Address Search bucket (1000/month). */
export async function afrigisAutocomplete(query: string, maxResults = 5): Promise<unknown> {
  return callService('/places-autocomplete/api/v3/autocomplete', {
    query,
    max_results: String(maxResults),
  });
}

/** Forward geocode: address text to coordinates. Counts against Address Search (1000/month). */
export async function afrigisGeocode(query: string): Promise<unknown> {
  return callService('/geocode/api/v3/address', { query });
}

/**
 * Daily weather forecast for a coordinate. Counts against the Weather bucket (1000/month).
 * station_count=1 pulls the single nearest reporting station.
 */
export async function afrigisWeather(lat: number, lng: number, dayCount = 3): Promise<unknown> {
  return callService('/weather-forecast/v1/getDailyByCoords', {
    latitude: String(lat),
    longitude: String(lng),
    day_count: String(dayCount),
    station_count: '1',
  });
}
