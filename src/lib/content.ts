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

const themeVars: Record<keyof Colors, string> = {
  accent: '--accent',
  bg: '--bg',
  surface: '--surface',
  text: '--text',
  muted: '--muted',
  border: '--border',
  font: '--font-body',
};

const toVars = (colors: Colors) =>
  Object.entries(colors)
    .map(([key, value]) => `${themeVars[key as keyof Colors]}: ${value};`)
    .join(' ');

/**
 * Turns `theme` fields into CSS that overrides the site's design tokens. Later themes win,
 * so pass the production's theme before the project's.
 */
export function themeCss(...themes: Theme[]) {
  const light: Colors = {};
  const dark: Colors = {};
  for (const { dark: darkColors, ...colors } of themes.filter((t) => t !== undefined)) {
    for (const [key, value] of Object.entries(colors) as [keyof Colors, string][]) {
      light[key] = value;
      // A plain override replaces any dark-mode value set by an earlier theme.
      delete dark[key];
    }
    Object.assign(dark, darkColors);
  }
  let css = '';
  if (Object.keys(light).length) css += `:root { ${toVars(light)} }`;
  if (Object.keys(dark).length) css += ` @media (prefers-color-scheme: dark) { :root { ${toVars(dark)} } }`;
  return css;
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
