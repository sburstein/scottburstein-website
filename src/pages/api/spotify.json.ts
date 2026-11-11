import type { APIRoute } from 'astro';
import { listening } from '../../lib/spotify';

export const prerender = false;

// Recently played tracks and saved podcasts as JSON. Holds no secrets:
// the refresh token stays on the server.
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await listening()), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  });
