# Game dev portfolio

A static portfolio site built with [Astro](https://astro.build) and published to GitHub Pages.
All content is Markdown, in `src/content/`.

## Commands

| Command           | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `npm install`     | Install dependencies (once, or after pulling new ones)              |
| `npm run dev`     | Local preview at http://localhost:4321 that updates as you save. **Shows drafts.** |
| `npm run build`   | Build the live site into `dist/`. Drafts are left out.              |
| `npm run preview` | Serve the built `dist/` locally, to check exactly what will go live |

## How content is organised

There are two kinds of entries:

- **Productions** (`src/content/productions/`): a game, film, jam entry or anything else you worked on as a whole.
- **Projects** (`src/content/projects/`): one role or one piece of work, such as the environment art or the gameplay code. A project can point to a production with `production: <id>`, or stand alone.

A production page lists every project that points to it, and a project page links back to its production and to the other roles on it.

An entry is either a single file (`my-thing.md`) or a folder (`my-thing/index.md`) with its images next to it. Either way, its ID is `my-thing`. The ID is used in URLs (`/work/my-thing/`) and in `production:` links. Use `.mdx` instead of `.md` to use the content blocks below.

### Project fields

```yaml
title: Environment Art                # required
description: One-line summary         # cards and search engines
production: moss-and-stone            # optional; a typo here fails the build
role: Environment Artist              # your role, shown under the title
disciplines: [3d, materials]          # required; free-form filter tags
tools: [Blender, Maya]
date: 2026-09-12                      # required; used for sorting
thumbnail: ./thumb.png                # card image
cover: ./cover.png                    # big image at the top of the page
links:
  - { label: Source on GitHub, url: https://github.com/... }
playable: { src: https://itch.io/embed-upload/<upload-id>, aspect: 960 / 600 }   # see "Playable builds"
featured: true                        # show on the home page
draft: true                           # hidden on the live site
theme: { accent: '#c2357a' }          # see "Per-page styling"
customCss: ./style.css
```

Display names for discipline tags (`3d` → "3D Art") are in `src/site.config.ts`. Unlisted tags are title-cased, so new disciplines need no setup.

### Production fields

```yaml
title: Moss & Stone                   # required
description: One-line pitch
type: game                            # free text: game, film, jam, prototype...
status: in-development                # concept | in-development | released | on-hold | cancelled
year: 2026
engine: Godot
platforms: [Web, Windows]
cover: ./cover.png
thumbnail: ./thumb.png                # falls back to cover
team:
  - { name: Alex Doe, role: Sound design, url: https://... }
links:
  - { label: Steam, url: https://... }
playable: { src: https://itch.io/embed-upload/<upload-id>, aspect: 960 / 600 }   # see "Playable builds"
theme: { accent: '#4a7a3a' }          # inherited by its projects
customCss: ./style.css                # also applied to its projects
draft: false
```

## Content blocks (.mdx only)

These work in any `.mdx` entry without importing anything:

```mdx
<Gallery cols={3} caption="Optional caption">
  ![Alt text](./image-1.png)
  ![Alt text](./image-2.png)
</Gallery>

<Video youtube="https://www.youtube.com/watch?v=..." caption="Trailer" />
<Video vimeo="123456789" />
<Video src="/media/turntable.mp4" loop />   <!-- file in public/media/; loop = plays like a GIF -->

<Playable src="https://itch.io/embed-upload/<upload-id>" aspect="960 / 600" />
```

`Gallery` also takes `ratio="1 / 1"` to crop every image to one shape, and `pixelated` for pixel art.

For an entry's main build, use the `playable` field instead of a `<Playable>` block: it goes at the top of the page with the cover behind the play button. The block is for extra builds further down.

To add a new kind of block (a 3D model viewer, a before/after slider...), create a component in `src/components/blocks/` and add it to `src/components/blocks/index.ts`.

### Images

- Images next to an entry (`./image.png`) are resized and converted to WebP automatically.
- **Pixel art and GIFs** should go in `public/media/` and be linked from the site root (`/media/sprite.png`), so they're served untouched. Compression blurs pixel edges and can break animation.
- Videos go in `public/media/` too, but keep them small. Upload long videos to YouTube or Vimeo.

## Playable builds

Web builds are hosted on itch.io and embedded here. Productions and projects both take a `playable` field:

1. Upload the web build to itch.io as an HTML game.
2. On itch.io, go to **Edit game → Distribute → Embed game** and copy the iframe code.
3. Put the iframe's `src` in `playable.src`, and its `width / height` in `playable.aspect` (for `width="960" height="600"`, use `960 / 600`).

```yaml
playable:
  src: https://itch.io/embed-upload/<upload-id>
  aspect: 960 / 600       # defaults to 16 / 9
```

The game shows at the top of the page with the entry's `cover` behind the play button, and only loads after the visitor presses play.

## Per-page styling

The site's look comes from CSS variables in `src/styles/global.css`. A production or project can override them for its own pages:

```yaml
theme:
  accent: '#c2357a'      # also: bg, surface, text, muted, border, font
  dark:                  # optional extra values for visitors in dark mode
    accent: '#f28bbd'
customCss: ./style.css   # any extra CSS, relative to the entry's file
```

A project inherits its production's theme and stylesheet, and its own values win.

## Site settings

Your name, tagline, footer links and discipline labels are in `src/site.config.ts`. The About page is `src/pages/about.mdx`.

## Publishing to GitHub Pages

1. Create a GitHub repository named `<your-username>.github.io`.
2. In `astro.config.mjs`, set `site` to `https://<your-username>.github.io`, and `base` to `'/<repo-name>'`. For a repository named `<your-username>.github.io`, set `base` to `'/'` instead. Links and Markdown paths starting with `/` get the base added automatically.
3. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes the site in a minute or two.

A custom domain can be added later under Settings → Pages.

## Sample content

These sample entries are all drafts and only show with `npm run dev`. Delete them once you've added your own work:

- `src/content/productions/moss-and-stone/`
- `src/content/projects/moss-and-stone-environment-art/`
- `src/content/projects/moss-and-stone-gameplay.md`
- `src/content/projects/slime-sprite/`
- `public/media/samples/`
