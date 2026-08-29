import { NextResponse } from 'next/server';
import { gridSnapshot } from '@/lib/geothrive';

// The Grid Snapshot payload: score, percentile against the whole grid, and how the
// hexagon compares to its immediate neighbours.
//   GET /api/grid/snapshot?lat=-23.31&lng=31.56&resolution=6

export async function GET(request: Request): Promise<NextResponse> {
  const params = new URL(request.url).searchParams;
  const lat = params.get('lat');
  const lng = params.get('lng');
  const resolution = Number(params.get('resolution') ?? '6');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Missing required ?lat and ?lng parameters' },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await gridSnapshot(Number(lat), Number(lng), resolution), {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
