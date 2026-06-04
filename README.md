# Partnrz BV — Static Website

A static frontend website for **Partnrz BV**, an early-stage investment firm. Built with vanilla HTML, CSS, and JavaScript. All CSS class names use the custom `pz-` prefix and CSS variables use the `--partnrz-*` namespace to distinguish the codebase from its original template.

## Pages

| File | Description |
|---|---|
| `index.html` | Home — hero, stats, pitch CTA |
| `criteria.html` | Investment criteria |
| `pitch.html` | Pitch your deal form |
| `terms.html` | Terms & conditions |
| `privacy.html` | Privacy policy |
| `cookies.html` | Cookie policy |
| `404.html` | Not found page |

## Folder Structure

```
public/
├── index.html
├── criteria.html
├── pitch.html
├── terms.html
├── privacy.html
├── cookies.html
├── 404.html
└── assets/
    ├── css/
    │   ├── plugins.css       ← Third-party plugin styles (untouched)
    │   ├── base.css          ← Base layout, typography, component styles (pz- classes)
    │   ├── variables.css     ← Brand color rules (.pz-color-bg, etc.)
    │   └── partnrz.css       ← CSS custom properties (--partnrz-*), theme tokens,
    │                            site-specific overrides, cookie & modal styles
    ├── fonts/                ← Font Awesome 5 locally hosted
    ├── img/
    │   ├── bg/               ← Hero background images (dark + light)
    │   ├── criteria/         ← Criteria section images
    │   ├── favicons/         ← favicon-dark.png, favicon-light.png
    │   └── og/dark/          ← Open Graph images per page
    └── js/
        ├── jquery.min.js     ← jQuery (local, untouched)
        ├── plugins.js        ← Third-party plugins: Swiper, share, isotope… (untouched)
        ├── main.js           ← All UI interactions, animations, AJAX navigation
        ├── theme.js          ← Dark / light mode toggle (localStorage)
        ├── menu.js           ← Active nav link state based on URL
        ├── cookies.js        ← Cookie consent banner & preferences modal
        └── share.js          ← Social share panel (Facebook, X, LinkedIn, Pinterest, Tumblr)
```

## Features

- Dark / light theme toggle — persisted in `localStorage` under key `partnrz-theme`
- AJAX page transitions via `$.coretemp` — `#wrapper` content swaps without full reload
- Hero background image switches with theme (`partnrz-hero-dark.webp` / `partnrz-hero-light.webp`)
- Logo switches with theme via CSS `content: var(--partnrz-logo)`
- Animated stat counters on the home hero (Active investments, Focus sectors, Countries)
- Slide-out social share panel — Facebook, X (Twitter), LinkedIn, Pinterest, Tumblr
- Hamburger menu with slide-in nav overlay (Home, Criteria, Pitch)
- Desktop left sidebar with active link tracking
- Cookie consent banner with Accept / Reject / Preferences (toggle per category)
- Custom cursor
- Responsive layout

## CSS Architecture

CSS loads in this order: `plugins.css` → `base.css` → `variables.css` → `partnrz.css`

| File | Responsibility |
|---|---|
| `plugins.css` | Third-party styles, never modified |
| `base.css` | All structural and component rules; every selector uses the `pz-` prefix |
| `variables.css` | Brand accent colour applied to `pz-color-bg` and related selectors |
| `partnrz.css` | `:root` + `:root[data-theme="light"]` blocks defining all `--partnrz-*` tokens; site-specific overrides on top of base |

## Theme Tokens (key variables)

| Variable | Dark | Light |
|---|---|---|
| `--partnrz-teal` | `#49a0a5` | `#49a0a5` |
| `--partnrz-bg` | `#1b4253` | `#ffffff` |
| `--partnrz-overlay` | `#060f13` | `rgba(6,15,19,0.04)` |
| `--partnrz-hero-image` | `url(/assets/img/bg/partnrz-hero-dark.webp)` | `url(/assets/img/bg/partnrz-hero-light.webp)` |
| `--partnrz-logo` | `url(/assets/img/logo-dark.webp)` | `url(/assets/img/logo-light.webp)` |

## How to Run

Requires a local server (absolute asset paths starting with `/` won't resolve over `file://`).

```bash
# Python
python3 -m http.server 8080 --directory public

# Node (npx)
npx serve public
```

Then open `http://localhost:8080`.

## Fonts

- **Raleway / Barlow** — Google Fonts CDN
- **Font Awesome 5 Brands / Solid / Regular** — loaded locally from `assets/fonts/`
