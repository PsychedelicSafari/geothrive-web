import { NextResponse } from 'next/server';
import { afrigisGeocode } from '@/lib/afrigis';

// Forward geocode: address text to coordinates. Hits the AfriGIS Address Search
// bucket (1000/month), so cache results in PostGIS before this goes anywhere near prod traffic.
//   GET /api/afrigis/geocode?query=Long%20Street%20Cape%20Town
export async function GET(request: Request): Promise<NextResponse> {
  const query = new URL(request.url).searchParams.get('query');
  if (!query) {
    return NextResponse.json({ error: 'Missing required ?query parameter' }, { status: 400 });
  }
  try {
    const result = await afrigisGeocode(query);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
