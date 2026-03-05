import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { timingSafeEqual } from 'crypto';

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(request: Request) {
  try {
    const { secret, tag, path } = await request.json();

    const serverSecret = process.env.REVALIDATION_SECRET;
    if (!serverSecret || !secret || !safeCompare(secret, serverSecret)) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    if (tag) revalidateTag(tag, 'default');
    if (path) revalidatePath(path, 'page');

    return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
