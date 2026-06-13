import { NextResponse } from 'next/server';
import { afrigisWeather } from '@/lib/afrigis';

// Daily weather forecast for a coordinate. Hits the AfriGIS Weather bucket (1000/month),
// so cache by H3 cell + day before this sees real traffic.
//   GET /api/afrigis/weather?lat=-33.92&lng=18.42&days=3

type RawForecast = {
  forecast_day: number;
  date: string;
  name: string;
  basic: {
    description: string;
    temperature_minimum: number;
    temperature_maximum: number;
    temperature_apparent: number;
    precipitation_probability: number;
    precipitation_type: string;
    precipitation_amount: number;
    wind_direction_short: string | null;
    wind_speed: number;
    wind_description: string;
  };
};

type RawStation = {
  station_name: string;
  province: string;
  local_municipality: string;
  distance: number;
  forecasts: RawForecast[];
};

type RawWeather = { result?: RawStation[] };

export async function GET(request: Request): Promise<NextResponse> {
  const params = new URL(request.url).searchParams;
  const lat = params.get('lat');
  const lng = params.get('lng');
  const days = Number(params.get('days') ?? '3');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Missing required ?lat and ?lng parameters' },
      { status: 400 },
    );
  }

  try {
    const raw = (await afrigisWeather(Number(lat), Number(lng), days)) as RawWeather;
    const station = raw.result?.[0];
    if (!station) {
      return NextResponse.json(
        { error: 'No weather station found near this coordinate' },
        { status: 404 },
      );
    }

    const trimmed = {
      station: {
        name: station.station_name,
        province: station.province,
        municipality: station.local_municipality,
        distanceMeters: station.distance,
      },
      forecasts: station.forecasts.map((f) => ({
        day: f.forecast_day,
        date: f.date,
        weekday: f.name,
        description: f.basic.description,
        tempMin: f.basic.temperature_minimum,
        tempMax: f.basic.temperature_maximum,
        tempApparent: f.basic.temperature_apparent,
        precipProbability: f.basic.precipitation_probability,
        precipType: f.basic.precipitation_type,
        precipAmount: f.basic.precipitation_amount,
        windShort: f.basic.wind_direction_short,
        windSpeed: f.basic.wind_speed,
        windDescription: f.basic.wind_description,
      })),
    };

    return NextResponse.json(trimmed);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
