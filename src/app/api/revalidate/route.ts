import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { secret, tag, path } = await request.json();

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    if (tag) revalidateTag(tag, 'default');
    if (path) revalidatePath(path, 'page');

    return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
