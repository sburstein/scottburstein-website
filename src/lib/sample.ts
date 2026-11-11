import type { Item } from './feeds';

// Labeled sample rows for local design review only (PUBLIC_SAMPLE=1 in dev).
// They never render in a production build.
export const sampleOn = import.meta.env.DEV && import.meta.env.PUBLIC_SAMPLE === '1';

const mark = (items: Omit<Item, 'sample'>[]): Item[] => items.map((i) => ({ ...i, sample: true }));

export const sample = {
  reading: mark([
    { title: 'The Power Broker', by: 'Robert A. Caro', meta: 'reading now' },
    { title: 'Draft No. 4', by: 'John McPhee', meta: '★★★★★', date: '2026-10-18T17:00:00Z' },
    { title: 'The Weather Machine', by: 'Andrew Blum', meta: '★★★★', date: '2026-09-02T17:00:00Z' },
  ]),
  tracks: mark([
    { title: 'Sample Track One', by: 'Sample Artist', date: '2026-11-10T21:04:00Z' },
    { title: 'Sample Track Two', by: 'Sample Artist', date: '2026-11-10T20:58:00Z' },
    { title: 'Sample Track Three', by: 'Another Artist', date: '2026-11-10T20:51:00Z' },
  ]),
  shows: mark([
    { title: 'Sample Podcast', by: 'Sample Publisher' },
    { title: 'Another Podcast', by: 'Sample Publisher' },
  ]),
  watching: mark([
    { title: 'Sample Film', by: '1974', meta: '★★★★½', date: '2026-11-08T17:00:00Z' },
    { title: 'Another Film', by: '2025', meta: '★★★', date: '2026-10-30T17:00:00Z' },
  ]),
};
