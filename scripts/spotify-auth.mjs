// One-time helper: prints the SPOTIFY_REFRESH_TOKEN for your own account.
//
//   1. Create an app at https://developer.spotify.com/dashboard
//      and add the redirect URI http://127.0.0.1:8888/callback
//   2. SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... npm run spotify:auth
//   3. Open the printed URL, approve, and copy the token it prints.
import http from 'node:http';
import crypto from 'node:crypto';

const id = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET;
if (!id || !secret) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.');
  process.exit(1);
}

const redirect = 'http://127.0.0.1:8888/callback';
const scope = 'user-read-recently-played user-library-read';
const state = crypto.randomBytes(12).toString('hex');
const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({ response_type: 'code', client_id: id, scope, redirect_uri: redirect, state });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, redirect);
  if (url.pathname !== '/callback') return res.writeHead(404).end();
  if (url.searchParams.get('state') !== state || !url.searchParams.get('code')) {
    res.writeHead(400).end('State mismatch or missing code. Start again.');
    return server.close();
  }
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: url.searchParams.get('code'),
      redirect_uri: redirect,
    }),
  });
  const body = await tokenRes.json();
  if (!tokenRes.ok || !body.refresh_token) {
    res.writeHead(500).end('Spotify refused the code. See the terminal.');
    console.error(body);
  } else {
    res.end('Done. Return to the terminal.');
    console.log('\nSPOTIFY_REFRESH_TOKEN=' + body.refresh_token + '\n');
    console.log('Add it to Vercel (Project, Settings, Environment Variables) and to .env.');
  }
  server.close();
});

server.listen(8888, '127.0.0.1', () => {
  console.log('Open this URL and approve:\n\n' + authUrl + '\n');
});
