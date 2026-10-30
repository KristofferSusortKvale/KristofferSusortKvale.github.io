// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';

// The path the site is served from. A repo named <your-username>.github.io is served from the root ('/');
// any other repo is served from '/<repo-name>'.
const base = '/';

/**
 * Prefixes root-relative links and images written in Markdown (`/media/sprite.png`, `/work/foo/`)
 * with `base`, so they keep working when the site is served from a sub-path.
 * @type {import('satteri').HastPluginDefinition}
 */
const basePaths = {
  name: 'base-paths',
  element: {
    filter: ['img', 'a'],
    visit(node, ctx) {
      const prefix = base.replace(/\/$/, '');
      for (const key of ['src', 'href']) {
        const value = node.properties[key];
        if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.startsWith(`${prefix}/`)) {
          ctx.setProperty(node, key, prefix + value);
        }
      }
    },
  },
};

export default defineConfig({
  site: 'https://KristofferSusortKvale.github.io',
  base,
  integrations: [mdx()],
  markdown: {
    processor: satteri({ hastPlugins: [basePaths] }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      // Emit both color sets as CSS variables; global.css picks one to match the site's theme.
      defaultColor: false,
    },
  },
});
