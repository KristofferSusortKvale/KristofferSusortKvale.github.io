import { disciplineLabels } from '../site.config';

/** Prefixes a site path with the configured `base`, so links keep working if the site moves to a sub-path. */
export const url = (path: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;

/** Like `url`, but leaves full URLs (https://…) untouched. For `src` props that may point either way. */
export const publicUrl = (path: string) => (path.startsWith('/') ? url(path) : path);

/** Lowercase, dash-separated form of a tag or tool name, used for filter values. */
export const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/#/g, 'sharp')
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const titleCase = (value: string) => value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const disciplineLabel = (tag: string) => disciplineLabels[tag.toLowerCase()] ?? titleCase(tag);

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', timeZone: 'UTC' });
