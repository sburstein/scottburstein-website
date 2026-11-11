# scottburstein.com

Personal site. White page, black Courier, red / yellow / blue blocks.
Built with [Astro](https://astro.build), hosted on Vercel.

## Pages

| Page | What it shows | Where the content comes from |
| --- | --- | --- |
| `/` | Name, one line, latest writing, one item each for reading / listening / watching | feeds below |
| `/writing` | Books and essays | `src/data/books.ts`, Substack RSS |
| `/notebook` | Reading, Listening, Watching, with your own notes | Goodreads RSS, Spotify API, Letterboxd RSS, `src/content/notes/*.md` |

Names, links and the one-line bio live in `src/site.ts`.

## Edit content

- **Add a note:** copy `src/content/notes/example.md`, set `kind` to `reading`,
  `listening` or `watching`, write a few sentences, delete the `draft` line.
- **Show a book:** edit `src/data/books.ts` and set `public: true`. Until then
  no title appears on the site.
- **Essays, films, books, tracks** update themselves from the feeds. Pages are
  cached for 30 minutes.

## Run locally

```sh
npm install
cp .env.example .env      # fill in what you have; everything is optional
npm run dev               # http://localhost:4321
PUBLIC_SAMPLE=1 npm run dev   # fill empty Notebook sections with labeled sample rows
npm run check && npm run build
```

Every feed fails soft: a section with no data says "Nothing logged yet."
Essays fall back to `src/data/snapshot.json` if Substack is unreachable.

## Environment variables (set in Vercel)

| Name | For | How to get it |
| --- | --- | --- |
| `GOODREADS_USER_ID` | Reading | Optional override. The default is set in `src/site.ts` |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | Listening | Create an app at developer.spotify.com/dashboard with redirect URI `http://127.0.0.1:8888/callback`. Needs Spotify Premium. |
| `SPOTIFY_REFRESH_TOKEN` | Listening | `SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... npm run spotify:auth` |

## Fonts

The stack is `'Courier New', 'Courier Prime', Courier, monospace`. Courier New
is only referenced by name (it ships with macOS and Windows; its files are not
hosted here). Courier Prime (SIL Open Font License) is bundled for devices
without it.
