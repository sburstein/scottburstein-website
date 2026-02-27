# scottburstein.com — "The Workstation"

**Date:** 2026-02-27
**Status:** Approved

## Summary

Personal website for Scott Burstein — an all-in-one hub combining portfolio (technical + creative), blog/writing, about page, and contact. Visual aesthetic inspired by Tom Sachs' workstation/knolling style: clean industrial, plywood textures, stencil typography, visible structure, grid-based layouts.

## Visual Language

### Color Palette

| Token              | Hex       | Usage                          |
|--------------------|-----------|--------------------------------|
| `--plywood`        | `#F5E6C8` | Primary background             |
| `--plywood-dark`   | `#C4B89C` | Borders, dividers              |
| `--white`          | `#FFFFFF` | Card surfaces, painted plywood |
| `--black`          | `#1A1A1A` | Text, labels (Sharpie black)   |
| `--steel`          | `#2B2B2B` | Nav bar, footer                |
| `--orange`         | `#D4440F` | Accents, links, hover states   |

### Typography

- **Headings:** `Space Mono` or `JetBrains Mono` — monospaced, evokes stenciled labels
- **Body:** `Inter` or `Work Sans` — clean sans-serif
- **Labels/tags:** Uppercase, letter-spaced, small — Sharpie-on-tape style

### Texture & Detail

- Subtle plywood grain texture on backgrounds (CSS or lightweight image)
- Cards with "screw head" corner dots (CSS-only decorative detail)
- Borders styled as tape strips or raw plywood edges
- Grid layout everywhere — knolling principle applied to web
- Visible structure: no hidden magic, layout is the decoration

### Design Level

Clean industrial — the knolling end of the Sachs spectrum. Structured grids, plywood textures, but everything deliberately placed and organized.

## Site Structure

```
/ (home)
├── /projects    — filterable grid of project cards
├── /writing     — markdown blog posts
├── /about       — bio, tools, background
└── /contact     — links and contact info
```

## Page Designs

### Home

Hero with "SCOTT BURSTEIN" stenciled large. Below: a knolling-style grid showing featured projects and latest blog posts. Functional, no fluff. Think: a workbench top view with tools laid out.

### Projects (`/projects`)

Filterable grid of cards. Each card is a plywood-textured rectangle with:
- Project image or screenshot
- Stencil-style title
- Tag labels (`CODE`, `DESIGN`, `PHYSICAL`)
- Click to expand into full project page

Filter controls styled as workshop toggle switches or labeled tabs.

### Writing (`/writing`)

Clean list of posts. Each entry: title, date, one-line description. Minimal — content speaks for itself. Individual post pages with clean readable typography.

### About (`/about`)

Bio alongside a photo. Key facts organized in a knolled grid:
- Tools you use
- What you do
- Where you're based
- Background

### Contact (`/contact`)

Email, GitHub, LinkedIn — presented as labeled connection ports, not just a plain list. Each link is a labeled terminal block.

## Tech Stack

- **Framework:** Astro (static site generator, near-zero JS)
- **Styling:** Vanilla CSS with custom properties (no Tailwind — hand-built ethos)
- **Content:** Markdown files for blog posts
- **Deployment:** Vercel or Netlify
- **Fonts:** Google Fonts (Space Mono + Inter)

## Non-Goals

- No CMS or admin panel
- No client-side interactivity beyond basic navigation and filtering
- No dark mode (the plywood IS the palette)
- No analytics (can add later if needed)
