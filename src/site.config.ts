// Site-wide details. Edit these to make the site yours.
export const site = {
  name: 'Your Name',
  tagline: 'Game developer working across art, design and code.',
  description: 'Portfolio of game development work: 2D and 3D art, materials, game design and programming.',
  // Shown in the footer, e.g. { label: 'itch.io', url: 'https://you.itch.io' }
  links: [] as { label: string; url: string }[],
};

// Display names for discipline tags. A tag that isn't listed is shown title-cased
// (`level-design` becomes "Level Design"), so a new discipline only needs a new tag in a project file.
export const disciplineLabels: Record<string, string> = {
  '2d': '2D Art',
  '3d': '3D Art',
  'tech-art': 'Technical Art',
  vfx: 'VFX',
  ui: 'UI',
  'ui-ux': 'UI/UX',
  code: 'Programming',
};
