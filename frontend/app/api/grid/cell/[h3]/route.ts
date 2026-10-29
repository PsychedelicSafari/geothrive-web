import { NextResponse } from 'next/server';
import { gridCell } from '@/lib/geothrive';

// One hexagon with its full layer stack and score.
//   GET /api/grid/cell/86972124fffffff

export async function GET(
  _request: Request,
  context: { params: Promise<{ h3: string }> },
): Promise<NextResponse> {
  const { h3 } = await context.params;

  try {
    return NextResponse.json(await gridCell(h3), {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    const missing = error instanceof Error && error.name === 'NotInGrid';
    return NextResponse.json(
      { error: missing ? 'Cell not found.' : 'Map data is temporarily unavailable.' },
      { status: missing ? 404 : 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
