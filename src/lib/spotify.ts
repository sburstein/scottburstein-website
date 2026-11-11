import type { Item } from './feeds';

const env = (k: string) => (import.meta.env[k] ?? process.env[k]) as string | undefined;

export function spotifyConfigured() {
  return Boolean(
    env('SPOTIFY_CLIENT_ID') && env('SPOTIFY_CLIENT_SECRET') && env('SPOTIFY_REFRESH_TOKEN'),
  );
}

async function accessToken(): Promise<string> {
  const basic = Buffer.from(
    `${env('SPOTIFY_CLIENT_ID')}:${env('SPOTIFY_CLIENT_SECRET')}`,
  ).toString('base64');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    signal: AbortSignal.timeout(6000),
    headers: {
      authorization: `Basic ${basic}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: env('SPOTIFY_REFRESH_TOKEN')!,
    }),
  });
  if (!res.ok) throw new Error(`token refresh answered ${res.status}`);
  return (await res.json()).access_token;
}

async function get(token: string, path: string) {
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    signal: AbortSignal.timeout(6000),
    headers: { authorization: `Bearer ${token}` },
  });
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`${path} answered ${res.status}`);
  return res.json();
}

export interface Listening {
  configured: boolean;
  tracks: Item[];
  shows: Item[];
}

/** Recently played tracks (deduplicated) and saved podcasts. Never throws. */
export async function listening(): Promise<Listening> {
  if (!spotifyConfigured()) return { configured: false, tracks: [], shows: [] };
  try {
    const token = await accessToken();
    const [recent, shows] = await Promise.all([
      get(token, '/me/player/recently-played?limit=30'),
      get(token, '/me/shows?limit=8').catch(() => null),
    ]);
    const seen = new Set<string>();
    const tracks: Item[] = [];
    for (const r of recent?.items ?? []) {
      const t = r.track;
      if (!t || seen.has(t.id)) continue;
      seen.add(t.id);
      tracks.push({
        title: t.name,
        by: (t.artists ?? []).map((a: { name: string }) => a.name).join(', '),
        link: t.external_urls?.spotify,
        date: r.played_at,
      });
      if (tracks.length === 8) break;
    }
    return {
      configured: true,
      tracks,
      shows: (shows?.items ?? []).map((s: any) => ({
        title: s.show.name,
        by: s.show.publisher,
        link: s.show.external_urls?.spotify,
      })),
    };
  } catch (err) {
    console.warn('[spotify]', (err as Error).message);
    return { configured: true, tracks: [], shows: [] };
  }
}
