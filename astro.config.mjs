// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // Your GitHub Pages address. Replace with https://<your-username>.github.io once the repo exists.
  // If the repo is named anything other than <your-username>.github.io, also add: base: '/<repo-name>'
  site: 'https://KristofferSusortKvale.github.io',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
