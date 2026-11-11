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

/**
 * What Scott is reading now, from his public Goodreads profile page.
 * Goodreads no longer serves shelf RSS (404 as of Nov 2026) and full shelves
 * need a sign-in, so the profile's "currently reading" box is the only public
 * source. The "read" shelf stays empty until there is one.
 * The id comes from site.ts; GOODREADS_USER_ID overrides it.
 */
export async function goodreadsShelf(
  shelf: 'currently-reading' | 'read',
  limit = 8,
): Promise<Item[]> {
  const id =
    import.meta.env.GOODREADS_USER_ID ?? process.env.GOODREADS_USER_ID ?? site.goodreadsUserId;
  if (!id || shelf !== 'currently-reading') return [];
  try {
    const url = `https://www.goodreads.com/user/show/${id}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: { 'user-agent': 'Mozilla/5.0 (personal site feed)' },
    });
    if (!res.ok) throw new Error(`${url} answered ${res.status}`);
    return currentlyReading(await res.text()).slice(0, limit);
  } catch (err) {
    console.warn('[feeds] goodreads:', (err as Error).message);
    return [];
  }
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

/** Pull title, author and link out of the profile's currently-reading box. */
export function currentlyReading(html: string): Item[] {
  const start = html.indexOf('id="currentlyReadingReviews"');
  if (start < 0) return [];
  const end = html.indexOf('bigBoxContent', start + 30);
  const box = html.slice(start, end > 0 ? end : start + 60000);
  const blocks = box.split('class="Updates').slice(1);
  const out: Item[] = [];
  for (const b of blocks) {
    const t = b.match(/class="bookTitle" href="([^"]+)">([^<]+)</);
    if (!t) continue;
    const a = b.match(/class="authorName" href="[^"]*">([^<]+)</);
    out.push({
      title: decode(t[2]),
      by: a ? decode(a[1]) : undefined,
      link: new URL(t[1], 'https://www.goodreads.com').href,
      meta: 'reading now',
    });
  }
  return out;
}
