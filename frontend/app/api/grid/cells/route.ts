import { NextResponse } from 'next/server';
import { gridCells } from '@/lib/geothrive';

// Every hexagon intersecting a viewport, as GeoJSON for the map.
//   GET /api/grid/cells?bbox=31.0,-23.8,32.1,-22.8
//
// The query caps the response at 2000 features, so `truncated` tells the map it is looking at
// a slice rather than the whole area.
//
// The grid is immutable between loads, so the response is cached at the edge. That cache used
// to live in the fetch to the upstream API; now that the query runs here, it has to be stated
// on the response instead, and it matters more, because every uncached pan is a real query
// against a free-tier database.

const CAP = 2000;
const CACHE = 's-maxage=300, stale-while-revalidate=600';

export async function GET(request: Request): Promise<NextResponse> {
  const bbox = new URL(request.url).searchParams.get('bbox');
  if (!bbox) {
    return NextResponse.json({ error: 'Missing required ?bbox parameter' }, { status: 400 });
  }

  try {
    const data = await gridCells(bbox);
    return NextResponse.json(
      { ...data, truncated: data.count >= CAP },
      { headers: { 'Cache-Control': CACHE } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
