import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Production = CollectionEntry<'productions'>;
export type Project = CollectionEntry<'projects'>;
type Theme = Project['data']['theme'];
type Colors = Omit<NonNullable<Theme>, 'dark'>;

// Drafts show while running `npm run dev` and are left out of the published site.
const isVisible = (entry: { data: { draft: boolean } }) => import.meta.env.DEV || !entry.data.draft;

/** Visible productions, newest first. */
export async function getProductions() {
  const productions = await getCollection('productions', isVisible);
  return productions.sort(
    (a, b) => (b.data.year ?? 0) - (a.data.year ?? 0) || a.data.title.localeCompare(b.data.title),
  );
}

/**
 * Visible projects, newest first. A draft production hides its projects too,
 * and a project pointing at a production that doesn't exist fails the build.
 */
export async function getProjects() {
  const productions = new Map((await getCollection('productions')).map((p) => [p.id, p]));
  const projects = await getCollection('projects');
  const visible = projects.filter((project) => {
    const ref = project.data.production;
    if (!ref) return isVisible(project);
    const production = productions.get(ref.id);
    if (!production) {
      throw new Error(
        `Project "${project.id}" has \`production: ${ref.id}\`, but there's no production with that ID in src/content/productions/.`,
      );
    }
    return isVisible(project) && isVisible(production);
  });
  return visible.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const getProduction = async (project: Project) =>
  project.data.production ? await getEntry(project.data.production) : undefined;

/**
 * Turns `theme` fields into CSS that overrides the site's design tokens (the --light-* and --dark-*
 * values in global.css). Later themes win, so pass the production's theme before the project's.
 */
export function themeCss(...themes: Theme[]) {
  const vars = new Map<string, string>();
  for (const { dark, ...colors } of themes.filter((t) => t !== undefined)) {
    for (const [key, value] of Object.entries(colors) as [keyof Colors, string][]) {
      if (key === 'font') {
        vars.set('--font-body', value);
      } else {
        // A plain value applies in both light and dark mode, replacing any earlier dark value.
        vars.set(`--light-${key}`, value);
        vars.set(`--dark-${key}`, value);
      }
    }
    for (const [key, value] of Object.entries(dark ?? {}) as [keyof Colors, string][]) {
      vars.set(key === 'font' ? '--font-body' : `--dark-${key}`, value);
    }
  }
  return vars.size ? `:root { ${[...vars].map(([name, value]) => `${name}: ${value};`).join(' ')} }` : '';
}

const cssFiles = import.meta.glob<string>('/src/content/**/*.css', { query: '?raw', import: 'default' });

/** Reads the stylesheet named by an entry's `customCss`, resolved relative to the entry's own file. */
export async function loadCustomCss(entry?: Production | Project) {
  const file = entry?.data.customCss;
  if (!entry || !file || !entry.filePath) return undefined;
  const path = new URL(file, `file:///${entry.filePath.replaceAll('\\', '/')}`).pathname;
  const load = cssFiles[path];
  if (!load) throw new Error(`"${entry.id}" has \`customCss: ${file}\`, but ${path.slice(1)} doesn't exist.`);
  return load();
}
