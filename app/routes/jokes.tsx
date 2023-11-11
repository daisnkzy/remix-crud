import { Link, Outlet, useLoaderData } from '@remix-run/react';

import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { db } from '~/utils/db.server';
//用来展示数据--查get，查所有数据
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const jokes = await db.joke.findMany({
    orderBy: { createAt: 'desc' },
    select: { id: true, name: true },
    take: 5,
  });
  return json(jokes);
};
export default function Jokes() {
  const jokes = useLoaderData<typeof loader>();
  return (
    <div>
      <header>
        <Link to="/">Remix Jokes</Link>
        <h1>Jokes🤣</h1>
      </header>
      <main>
        <div>
          <ul>
            {jokes.map(({ id, name }) => (
              <li key={id}>
                <Link to={id}>{name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/jokes">add new</Link>
        <Outlet />
      </main>
    </div>
  );
}
