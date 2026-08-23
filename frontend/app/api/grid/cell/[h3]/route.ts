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
    return NextResponse.json(await gridCell(h3));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('404') ? 404 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
