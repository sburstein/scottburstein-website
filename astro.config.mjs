import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://scottburstein.com',
  adapter: vercel(),
  devToolbar: { enabled: false },
});
