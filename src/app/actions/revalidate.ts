'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

export async function revalidateSection(section: string) {
  revalidateTag(section);
  revalidatePath('/', 'page');
  revalidatePath('/[locale]', 'page');
}
