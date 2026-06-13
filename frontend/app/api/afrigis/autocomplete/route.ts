import { NextResponse } from 'next/server';
import { afrigisAutocomplete } from '@/lib/afrigis';

// Proof-of-concept route. Hits the live AfriGIS Address Search bucket (1000/month),
// so the long-term plan is a PostGIS cache keyed by H3 cell in front of this.
//   GET /api/afrigis/autocomplete?query=Long%20Street%20Cape%20Town
export async function GET(request: Request): Promise<NextResponse> {
  const query = new URL(request.url).searchParams.get('query');
  if (!query) {
    return NextResponse.json({ error: 'Missing required ?query parameter' }, { status: 400 });
  }
  try {
    const result = await afrigisAutocomplete(query);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
