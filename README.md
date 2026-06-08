# Partnrz BV — Static Website

A static frontend website for **Partnrz BV**, an early-stage investment firm. Built with vanilla HTML, CSS, and JavaScript. All CSS class names use the custom `pz` prefix and CSS variables use the `--partnrz-*` namespace.

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
    │   ├── base.css          ← Base layout, typography, component styles (pz- classes)
    │   └── partnrz.css       ← CSS custom properties (--partnrz-*), theme tokens,
    │                            site-specific overrides, cookie & modal styles
    ├── fonts/                ← Font Awesome woff2 files (unused; FA loaded via CDN)
    ├── img/
    │   ├── bg/               ← Hero background images (dark + light)
    │   ├── criteria/         ← Criteria section images
    │   ├── favicons/         ← favicon-dark.png, favicon-light.png
    │   └── og/dark/          ← Open Graph images per page
    └── js/
        ├── jquery.min.js     ← jQuery (local)
        ├── main.js           ← UI interactions: animations, nav menu, share panel,
        │                        slideshow, stat counters, scroll nav, cursor
        └── app.js            ← App logic: dark/light theme toggle, active nav links,
                                 cookie consent banner & preferences modal, share panel init,
                                 pitch form submission
```

## External Dependencies (CDN)

| Library | Version | Purpose |
|---|---|---|
| Normalize.css | 8.0.1 | CSS reset |
| Bootstrap Grid | 4.6.2 | Grid layout only |
| Font Awesome | 6.5.1 | Icons (solid, brands) |
| Swiper | 4.3.5 | Slideshow / carousel |
| GSAP | 3.12.5 | Menu and cursor animations |
| jQuery | local | DOM utilities, AJAX navigation |

## Features

- Dark / light theme toggle — persisted in `localStorage` under key `partnrz-theme`
- AJAX page transitions — `#wrapper` content swaps without full reload
- Hero background image switches with theme (`partnrz-hero-dark.webp` / `partnrz-hero-light.webp`)
- Logo switches with theme via CSS `content: var(--partnrz-logo)`
- Animated stat counters on the home hero (IntersectionObserver-driven)
- Slide-out social share panel — Facebook, X (Twitter), LinkedIn, Pinterest, Tumblr
- Hamburger menu with GSAP-animated slide-in nav overlay (Home, Criteria, Pitch)
- Desktop left sidebar with active link tracking
- Cookie consent banner with Accept / Reject / Preferences (toggle per category)
- Custom cursor (desktop only)
- Responsive layout

## CSS Architecture

CSS loads in this order: CDN (normalize → bootstrap-grid → Font Awesome → Swiper) → `base.css` → `partnrz.css`

| File | Responsibility |
|---|---|
| `base.css` | All structural and component rules; every selector uses the `pz` prefix |
| `partnrz.css` | `:root` + `:root[data-theme="light"]` blocks defining all `--partnrz-*` tokens; page-specific overrides (criteria, pitch, cookies, privacy, terms); cookie banner & pitch modal styles |

## Theme Tokens (key variables)

| Variable | Dark | Light |
|---|---|---|
| `--partnrz-teal` | `#49a0a5` | `#165d61` |
| `--partnrz-bg` | `#1b4253` | `#ffffff` |
| `--partnrz-overlay` | `#060f13` | `rgba(255,255,255,0.04)` |
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
- **Font Awesome 6 Free** — CDN (`cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1`)
