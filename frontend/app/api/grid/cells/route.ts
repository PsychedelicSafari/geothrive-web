import { NextResponse } from 'next/server';
import { gridCells } from '@/lib/geothrive';

// Every hexagon intersecting a viewport, as GeoJSON for the map.
//   GET /api/grid/cells?bbox=31.0,-23.8,32.1,-22.8
//
// The upstream caps the response at 2000 features, so `truncated` is passed through to let
// the map tell the user it is looking at a slice rather than the whole area.

const UPSTREAM_CAP = 2000;

export async function GET(request: Request): Promise<NextResponse> {
  const bbox = new URL(request.url).searchParams.get('bbox');
  if (!bbox) {
    return NextResponse.json({ error: 'Missing required ?bbox parameter' }, { status: 400 });
  }

  try {
    const data = (await gridCells(bbox)) as { count: number; features: unknown[] };
    return NextResponse.json({ ...data, truncated: data.count >= UPSTREAM_CAP });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
