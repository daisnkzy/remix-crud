import type { Joke } from '@prisma/client';
import { redirect } from '@remix-run/node';
import { db } from '~/utils/db.server';

export async function updateJoke(
  id: string,
  joke: Pick<Joke, 'name' | 'content'>
) {
  return db.joke.update({ data: joke, where: { id } });
}

export async function deleteJoke(id: string) {
  await db.joke.delete({ where: { id } });
  return redirect('/jokes');
}
