import { XMLParser } from 'fast-xml-parser';
import snapshot from '../data/snapshot.json';
import { site } from '../site';

export interface Item {
  title: string;
  by?: string;
  link?: string;
  note?: string;
  date?: string; // ISO
  meta?: string; // rating, year, "reading now"
  sample?: boolean;
}

const parser = new XMLParser({ ignoreAttributes: true, processEntities: true });

async function rssItems(url: string): Promise<Record<string, unknown>[]> {
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  const xml = parser.parse(await res.text());
  const items = xml?.rss?.channel?.item ?? [];
  return Array.isArray(items) ? items : [items];
}

const text = (v: unknown) => (v == null ? '' : String(v).trim());
const iso = (v: unknown) => {
  const d = new Date(text(v));
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};
const stars = (v: unknown) => {
  const n = Number(v);
  if (!n) return undefined;
  return '★'.repeat(Math.floor(n)) + (n % 1 ? '½' : '');
};

/** Substack posts, newest first. Falls back to the committed snapshot. */
export async function substackPosts(limit = 20): Promise<Item[]> {
  try {
    const items = await rssItems(`${site.substack}/feed`);
    return items.slice(0, limit).map((i) => ({
      title: text(i.title),
      link: text(i.link),
      note: text(i.description),
      date: iso(i.pubDate),
    }));
  } catch (err) {
    console.warn('[feeds] substack:', (err as Error).message);
    return snapshot.substack.slice(0, limit);
  }
}

/** Letterboxd diary, newest first. Empty when the diary is empty or unreachable. */
export async function letterboxdDiary(limit = 8): Promise<Item[]> {
  try {
    const items = await rssItems(`https://letterboxd.com/${site.letterboxdUser}/rss/`);
    return items
      .filter((i) => i['letterboxd:filmTitle'])
      .slice(0, limit)
      .map((i) => ({
        title: text(i['letterboxd:filmTitle']),
        by: text(i['letterboxd:filmYear']) || undefined,
        link: text(i.link),
        meta: stars(i['letterboxd:memberRating']),
        // watchedDate is a bare day; pin it to midday so it shows as that day in New York.
        date: i['letterboxd:watchedDate']
          ? iso(`${text(i['letterboxd:watchedDate'])}T12:00:00-05:00`)
          : iso(i.pubDate),
      }));
  } catch (err) {
    console.warn('[feeds] letterboxd:', (err as Error).message);
    return [];
  }
}

/** One Goodreads shelf. The id comes from site.ts; GOODREADS_USER_ID overrides it. */
export async function goodreadsShelf(
  shelf: 'currently-reading' | 'read',
  limit = 8,
): Promise<Item[]> {
  const id =
    import.meta.env.GOODREADS_USER_ID ?? process.env.GOODREADS_USER_ID ?? site.goodreadsUserId;
  if (!id) return [];
  try {
    const items = await rssItems(
      `https://www.goodreads.com/review/list_rss/${id}?shelf=${shelf}&sort=date_read`,
    );
    return items.slice(0, limit).map((i) => ({
      title: text(i.title),
      by: text(i.author_name) || undefined,
      link: text(i.link),
      meta: shelf === 'read' ? stars(i.user_rating) : 'reading now',
      date: iso(i.user_read_at || i.user_date_added),
    }));
  } catch (err) {
    console.warn('[feeds] goodreads:', (err as Error).message);
    return [];
  }
}
