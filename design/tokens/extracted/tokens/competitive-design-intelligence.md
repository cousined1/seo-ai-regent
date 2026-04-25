# SEO AI Regent — Competitive Design Intelligence

## Extraction Method
Manual CSS extraction (designlang requires Playwright system libs not available on server).
Will re-run with `designlang --full` on Windows workstation where Playwright is fully installed.

---

## Surfer SEO — Design Token Extraction

### Brand Colors
| Role | Hex | Usage |
|------|-----|-------|
| Primary (Violet) | `#783AFB` | CTAs, links, brand accents |
| Violet Alt | `#7814F7` | Secondary violet |
| Orange/Red Accent | `#FF5B49` | Alerts, badges, highlights |
| Yellow Accent | `#FFBD57` | Warnings, secondary badges |
| Pink | `#FF4286` | Brand pink |
| Blue Link | `#0082F3` | Links, external references |
| Blue Alt | `#3898EC` | Secondary blue |
| Dark BG | `#0C0A10` | Near-black background |
| Dark Surface | `#131313` | Card backgrounds |
| Dark Surface Alt | `#18181B` | Elevated surfaces |
| Dark Border | `#2F2F34` | Borders (neutral-800) |
| Neutral | `#5D6C7B` | Secondary text |
| Neutral Light | `#758696` | Muted text |
| Neutral 500 | `#71717B` | Zinc-500 equivalent |
| Neutral 200 | `#E4E4E7` | Light borders |
| Off White | `#FAFAFA` | Light mode bg |
| White | `#FFFFFF` | Text on dark |

### Typography
- **Primary Font:** Inter Variable (with Arial, sans-serif fallback)
- **Body Font:** Inter Variable
- **Secondary Font:** Helvetica Neue, Helvetica, Ubuntu, Segoe UI, Verdana, sans-serif
- **Mono:** monospace (system default)
- **Scale:** rem-based (0.75rem → 2.5rem+)
- **Key sizes:** 1rem (base), 1.25rem, 1.5rem, 2rem, 2.5rem

### Spacing System
- Uses rem-based scale: 0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 2.5rem, 3rem, 4rem
- **Gap system:** xsmall (0.5rem), main (1rem), medium (1.5rem), large (2.5rem), xlarge, bento
- **Max widths:** small (45rem), medium (55rem), large (65rem), xlarge (75rem)

### Border Radius
- **main:** 1rem (16px)
- **medium:** 0.75rem (12px)
- **section:** 1.5rem (24px)
- **max:** 9999px (pill buttons)
- **none:** 0

### Shadows
- Card shadow: `var(--shadow-card)` (variable-based)
- Subtle: `0 0 0 1px #0000001a, 0 1px 3px #0000001a`
- Focus: `0 0 0 2px #fff`
- Modal overlay: `0 15px 3.75rem #000000ed`

### Key Design Patterns
- **Dark mode dominant** — Uses `#0C0A10` as primary background
- **Violet as primary action color** — Not blue, not cyan. Violet (#783AFB)
- **Large border-radius** — Cards at 1rem, sections at 1.5rem (rounded, not sharp)
- **Variable-driven spacing** — Systematic rem scale, not arbitrary pixels
- **Webflow-generated CSS** — Built on Webflow (variable names contain Webflow hashes)
- **Bento grid layout** — Cards with variant colors (violet, orange, gray)

---

## Clearscope — Design Token Extraction

### Brand Colors
| Role | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#356AD4` | CTAs, links |
| Green Success | `#1DA51D` | Positive signals |
| Error Red | `#D92626` | Errors |
| Light BG | `#F4F7FA` | Page background |
| Card BG | `#EBF0F5` | Card surfaces |
| Border Light | `#E2E5E9` | Light borders |
| Info Blue | `#B3CCFF` | Info highlights |

### Typography
- **Primary Font:** GT Pressura Mono (brand/identity font)
- **Body Font:** Century Old Style Std (serif, unusual for SaaS)
- **System Sans:** var(--font-sans)
- **System Mono:** var(--font-mono)

### Key Patterns
- **Light mode default** — No dark mode dominance
- **Unique serif body font** — Stands out from typical SaaS
- **Monospace identity font** — GT Pressura Mono for headings
- **Tailwind CSS** — Standard utility classes
- **Small color palette** — Blue primary, minimal accent colors

---

## Frase — Design Token Extraction

### Brand Colors
| Role | Hex | Usage |
|------|-----|-------|
| Primary Purple | `#9600E0` | CTAs, brand, links |
| Purple Alt | `#7C3AED` | Secondary purple |
| Purple Light | `#C084FC` | Hover states |
| Purple Dark | `#9333EA` | Active states |
| Success Green | `#059469` | Positive signals |
| Green Dark | `#046D4D` | Green hover |
| Green Light | `#7EC19B` | Green highlights |
| Dark BG | `#18191B` | Near-black background |
| Light BG | `#F8FAFB` | Page background |
| Border Light | `#E2E8F0` | Light borders |
| Facebook Blue | `#1877F2` | Social |
| LinkedIn Blue | `#0A66C2` | Social |

### Typography
- **Primary Font:** Inter (var --font-inter)
- **Display Font:** Fraunces (Georgia serif fallback)
- **Mono Font:** JetBrains Mono
- **Stack:** Inter → system-ui → sans-serif

### Key Patterns
- **Purple primary** — Similar to Surfer's violet but more saturated
- **Dark mode option** — Has dark background colors
- **Next.js site** — Standard React deployment
- **Three-font system** — Inter (body) + Fraunces (display) + JetBrains Mono (code)
- **Green/purple contrast** — Unique dual-accent system

---

## Competitive Design Matrix

| Aspect | Surfer SEO | Clearscope | Frase | SEO AI Regent (Ours) |
|--------|-----------|------------|-------|-------------------|
| **Primary Color** | Violet #783AFB | Blue #356AD4 | Purple #9600E0 | Cyan #06B6D4 |
| **Dark Mode** | Default | No | Optional | Default |
| **Body Font** | Inter Variable | Century Old Style | Inter | Geist |
| **Heading Font** | Inter Variable | GT Pressura Mono | Fraunces | Geist |
| **Mono Font** | System | GT Pressura Mono | JetBrains Mono | Geist Mono |
| **Border Radius** | 1rem cards | Tailwind default | Tailwind default | 1rem cards |
| **Max Width** | 65rem content | Standard | Standard | 1280px content |
| **Accent Color** | Orange #FF5B49 | Green #1DA51D | Green #059469 | Cyan hover #0891B2 |
| **Card Style** | Rounded, elevated | Flat, bordered | Rounded | Rounded, elevated |
| **CSS Framework** | Webflow | Tailwind | Tailwind | Tailwind |
| **Framework** | Webflow (static) | Custom | Next.js | Next.js |
| **Content Score UI** | Circular gauge 0-100 | Bar chart | Not visible | Circular gauge 0-100 |
| **Price Range** | $99–$219/mo | $170/mo | $15–$115/mo | $0–$149/mo |

---

## Key Design Insights for SEO AI Regent

1. **Surfer uses dark mode as default** — We're already doing this. Cyan on near-black works.
2. **Surfer's violet (#783AFB) is their brand** — Our cyan (#06B6D4) is clearly different. Good differentiation.
3. **Surfer's content score is circular gauge** — We should use the same pattern (users are trained on it).
4. **All three use Inter or Inter-like fonts** — We're using Geist, which is more distinctive and developer-friendly.
5. **Surfer's CSS is Webflow-generated** — Messy variable names with hashes. Our Tailwind approach is cleaner.
6. **Clearscope uses serif body font** — Unusual but distinctive. We'll stick with Geist (more readable).
7. **Frase uses three-font system** — Overkill. Two-font (Geist + Geist Mono) is enough.
8. **All competitors use rounded cards** — 1rem border-radius is the standard. We're already doing this.
9. **Surfer's bento grid layout** — Good pattern for feature showcases. Adopt for landing page.
10. **Content Score 0-100 with color gradient** — Red (0-30) → Yellow (31-70) → Green (71-100). Industry standard.

---

## Action Items for Build

1. **Re-run `designlang --full` on Windows workstation** for pixel-accurate extraction
2. **Design score Surfer, Clearscope, Frase** as benchmarks (`designlang score`)
3. **Target: SEO AI Regent must score ≥ B on designlang score before launch**
4. **Content Score UI**: Circular gauge (0-100) with color gradient — match Surfer's mental model
5. **NLP Terms Panel**: Checklist with checkmarks (✅ required terms, ⬜ missing terms) — proven UX
6. **Dark mode first**: #0A0A0A background, #06B6D4 primary — our differentiator from Clearscope (light mode)
7. **Landing page**: 9-section conversion layout (hero → social proof → how it works → features → comparison → testimonials → pricing → FAQ → CTA)