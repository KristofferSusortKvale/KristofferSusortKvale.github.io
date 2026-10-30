import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// `moss-and-stone.md` and `moss-and-stone/index.md` both get the ID `moss-and-stone`,
// so an entry can be a single file or a folder with its images next to it.
const generateId = ({ entry }: { entry: string }) =>
  entry
    .replace(/\.mdx?$/, '')
    .replace(/\/index$/, '')
    .toLowerCase()
    .replace(/[\s_]+/g, '-');

const colors = z
  .object({
    accent: z.string(),
    bg: z.string(),
    surface: z.string(),
    text: z.string(),
    muted: z.string(),
    border: z.string(),
    font: z.string(),
  })
  .partial();

// Per-page style overrides. `dark` applies on top when the visitor uses dark mode.
const theme = colors.extend({ dark: colors.optional() }).optional();

const link = z.object({ label: z.string(), url: z.string() });

// An itch.io embed, shown at the top of the page with the entry's cover behind the play button.
const playable = z.object({ src: z.string(), aspect: z.string().default('16 / 9') }).optional();

const productions = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/productions', generateId }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      type: z.string().default('game'),
      status: z.enum(['concept', 'in-development', 'released', 'on-hold', 'cancelled']).optional(),
      year: z.number().int().optional(),
      engine: z.string().optional(),
      platforms: z.array(z.string()).default([]),
      cover: image().optional(),
      thumbnail: image().optional(),
      team: z.array(z.object({ name: z.string(), role: z.string().optional(), url: z.string().optional() })).default([]),
      links: z.array(link).default([]),
      playable,
      theme,
      customCss: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects', generateId }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      production: reference('productions').optional(),
      role: z.string().optional(),
      disciplines: z.array(z.string()).min(1),
      tools: z.array(z.string()).default([]),
      date: z.coerce.date(),
      thumbnail: image().optional(),
      cover: image().optional(),
      links: z.array(link).default([]),
      playable,
      featured: z.boolean().default(false),
      theme,
      customCss: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { productions, projects };
