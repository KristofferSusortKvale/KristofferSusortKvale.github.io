// Site-wide details. Edit these to make the site yours.
export const site = {
  name: 'Kristoffer S. Kvale',
  tagline: 'Game developer working across art, design and code.',
  description: 'Portfolio of game development work: 2D and 3D art, materials, game design and programming.',
  // Contact links, shown as cards on the About page and in the footer.
  // `text` is what the card shows; `icon` is a name from src/components/Icon.astro.
  links: [
    {
      label: 'Email',
      text: 'kristoffersusortkvale@gmail.com',
      url: 'mailto:kristoffersusortkvale@gmail.com',
      icon: 'mail',
    },
    { label: 'YouTube', text: 'Kristoffer', url: 'https://www.youtube.com/@Kristoffer-p4f', icon: 'youtube' },
  ] as { label: string; text: string; url: string; icon: string }[],
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
