'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateSection(_section: string) {
  revalidatePath('/', 'layout');
}
