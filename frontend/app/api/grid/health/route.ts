import { NextResponse } from 'next/server';
import { gridHealth } from '@/lib/geothrive';

/** Proves the browser-side app can actually reach Kesh's grid, without exposing the key. */
export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json(await gridHealth());
  } catch {
    return NextResponse.json(
      { error: 'Map data is temporarily unavailable.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
