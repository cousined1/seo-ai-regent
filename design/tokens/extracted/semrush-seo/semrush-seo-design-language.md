# Design Language: Page not found | Semrush

> Extracted from `https://www.semrush.com/writing-assistant/` on April 16, 2026
> 515 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#181e15` | rgb(24, 30, 21) | hsl(100, 18%, 10%) | 463 |
| Secondary | `#006dca` | rgb(0, 109, 202) | hsl(208, 100%, 40%) | 36 |
| Accent | `#e0e1e9` | rgb(224, 225, 233) | hsl(233, 17%, 90%) | 4 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#000000` | hsl(0, 0%, 0%) | 266 |
| `#333333` | hsl(0, 0%, 20%) | 214 |
| `#ffffff` | hsl(0, 0%, 100%) | 23 |
| `#3e424b` | hsl(222, 9%, 27%) | 10 |
| `#898d9a` | hsl(226, 8%, 57%) | 10 |
| `#6c6e79` | hsl(231, 6%, 45%) | 6 |
| `#575c66` | hsl(220, 8%, 37%) | 6 |

### Background Colors

Used on large-area elements: `#ffffff`, `#421983`, `#dceeeb`

### Text Colors

Text color palette: `#000000`, `#333333`, `#006dca`, `#0071bc`, `#181e15`, `#ffffff`, `#6c6e79`, `#171a22`, `#575c66`, `#3e424b`

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#181e15` | text, border, background | 463 |
| `#000000` | text, border | 266 |
| `#333333` | text, border | 214 |
| `#006dca` | text, border | 36 |
| `#ffffff` | background, text, border | 23 |
| `#3e424b` | text, border | 10 |
| `#898d9a` | text, border | 10 |
| `#6c6e79` | text, border | 6 |
| `#575c66` | text, border | 6 |
| `#d1d4db` | border | 5 |
| `#e0e1e9` | background | 4 |
| `#421983` | background | 1 |
| `#c190ff` | background | 1 |

## Typography

### Font Families

- **Lazzer** — used for all (283 elements)
- **Inter** — used for all (148 elements)
- **Times New Roman** — used for body (68 elements)
- **Factor A** — used for headings (13 elements)
- **Arial** — used for body (3 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 100px | 6.25rem | 700 | 160px | normal | h1 |
| 48px | 3rem | 600 | 48px | -1.92px | h2 |
| 40px | 2.5rem | 700 | 42px | normal | h2 |
| 32px | 2rem | 700 | 38.4px | normal | h2 |
| 24px | 1.5rem | 700 | 28px | normal | h3 |
| 22px | 1.375rem | 700 | 28.6px | normal | h3 |
| 16px | 1rem | 400 | 24px | normal | button, a, h3, div |
| 14px | 0.875rem | 500 | 19.6px | -0.28px | a, div, span, p |
| 13.3333px | 0.8333rem | 400 | normal | normal | button |
| 12px | 0.75rem | 400 | normal | normal | html, head, meta, title |

### Heading Scale

```css
h1 { font-size: 100px; font-weight: 700; line-height: 160px; }
h2 { font-size: 48px; font-weight: 600; line-height: 48px; }
h2 { font-size: 40px; font-weight: 700; line-height: 42px; }
h2 { font-size: 32px; font-weight: 700; line-height: 38.4px; }
h3 { font-size: 24px; font-weight: 700; line-height: 28px; }
h3 { font-size: 22px; font-weight: 700; line-height: 28.6px; }
h3 { font-size: 16px; font-weight: 400; line-height: 24px; }
```

### Body Text

```css
body { font-size: 14px; font-weight: 500; line-height: 19.6px; }
```

### Font Weights in Use

`400` (299x), `500` (168x), `600` (35x), `700` (13x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-1 | 1px | 0.0625rem |
| spacing-4 | 4px | 0.25rem |
| spacing-16 | 16px | 1rem |
| spacing-30 | 30px | 1.875rem |
| spacing-37 | 37px | 2.3125rem |
| spacing-44 | 44px | 2.75rem |
| spacing-48 | 48px | 3rem |
| spacing-56 | 56px | 3.5rem |
| spacing-68 | 68px | 4.25rem |
| spacing-80 | 80px | 5rem |
| spacing-117 | 117px | 7.3125rem |
| spacing-187 | 187px | 11.6875rem |
| spacing-418 | 418px | 26.125rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| sm | 5px | 2 |
| md | 10px | 8 |
| full | 100px | 3 |

## CSS Custom Properties

### Other

```css
--srf-factor-a-frac: 'frac' off;
--srf-factor-a-funk-up-latin: 'ss01' off;
--srf-factor-a-curly-arrows: 'ss03' off;
--srf-header-blend-percent: 0%;
```

### Semantic

```css
success: [object Object];
warning: [object Object];
error: [object Object];
info: [object Object];
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| xs | 320px | max-width |
| sm | 480px | max-width |
| sm | 599px | max-width |
| md | 767px | max-width |
| md | 768px | min-width |
| md | 769px | min-width |
| lg | 1023px | max-width |
| lg | 1024px | min-width |
| 1200px | 1200px | max-width |
| xl | 1280px | min-width |
| 1440px | 1440px | max-width |

## Transitions & Animations

**Easing functions:** `[object Object]`

**Durations:** `0.3s`, `0.2s`, `0.1s`

### Common Transitions

```css
transition: all;
transition: transform 0.3s;
transition: 0.2s ease-in-out;
transition: color 0.2s ease-in-out;
transition: transform 0.1s;
```

### Keyframe Animations

**_3jca91rrtZ4Z2Vq_i9WDX**
```css
@keyframes _3jca91rrtZ4Z2Vq_i9WDX {
  100% { transform: rotate(1turn); }
}
```

**srf-header-colors**
```css
@keyframes srf-header-colors {
  100% { --srf-header-blend-percent: 100%; }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (34 instances)

```css
.button {
  background-color: rgb(224, 225, 233);
  color: rgb(23, 26, 34);
  font-size: 14px;
  font-weight: 400;
  padding-top: 12px;
  padding-right: 12px;
  border-radius: 0px;
}
```

### Cards (23 instances)

```css
.card {
  background-color: rgb(246, 247, 248);
  border-radius: 0px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Links (100 instances)

```css
.link {
  color: rgb(24, 30, 21);
  font-size: 14px;
  font-weight: 500;
}
```

### Navigation (86 instances)

```css
.navigatio {
  background-color: rgb(255, 255, 255);
  color: rgb(24, 30, 21);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
}
```

### Footer (100 instances)

```css
.foote {
  background-color: rgb(255, 255, 255);
  color: rgb(24, 30, 21);
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 14px;
}
```

### Modals (2 instances)

```css
.modal {
  border-radius: 0px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Dropdowns (135 instances)

```css
.dropdown {
  background-color: rgb(255, 255, 255);
  border-radius: 0px;
  border-color: rgb(24, 30, 21);
  padding-top: 0px;
}
```

### Badges (1 instances)

```css
.badge {
  color: rgb(0, 113, 188);
  font-size: 14px;
  font-weight: 500;
  padding-top: 8px;
  padding-right: 8px;
  border-radius: 0px;
}
```

## Layout System

**3 grid containers** and **53 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 100% | 0px |
| 1110px | 48px |
| 350px | 0px |
| 637px | 0px |
| 1440px | 24px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 2-column | 1x |

### Grid Templates

```css
grid-template-columns: 0px 1280px;
grid-template-columns: none;
gap: 12px;
grid-template-columns: none;
gap: 12px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 33x |
| column/nowrap | 17x |
| row/wrap | 3x |

**Gap values:** `12px`, `16px`, `32px`, `44px`, `48px`, `56px`, `8px`

## Responsive Design

### Viewport Snapshots

| Viewport | Body Font | Nav Visible | Max Columns | Hamburger | Page Height |
|----------|-----------|-------------|-------------|-----------|-------------|
| mobile (375px) | 12px | No | 2 | Yes | 4451px |
| tablet (768px) | 12px | No | 2 | Yes | 4263px |
| desktop (1280px) | 12px | No | 2 | Yes | 2995px |
| wide (1920px) | 12px | No | 2 | Yes | 2995px |

### Breakpoint Changes

**768px → 1280px** (tablet → desktop):
- Page height: `4263px` → `2995px`

## Interaction States

### Button States

**"Products"**
```css
/* Hover */
text-decoration: none → underline;
```
```css
/* Focus */
box-shadow: none → rgba(0, 143, 248, 0.5) 0px 0px 0px 3px;
text-decoration: none → underline;
```

**"Resources"**
```css
/* Hover */
text-decoration: none → underline;
```
```css
/* Focus */
box-shadow: none → rgba(0, 143, 248, 0.5) 0px 0px 0px 3px;
text-decoration: none → underline;
```

### Link Hover

```css
text-decoration: none → underline;
```

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 18 passing, 0 failing color pairs

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#333333` | `#ffffff` | 12.63:1 | AAA |
| `#000000` | `#ffffff` | 21:1 | AAA |
| `#000000` | `#e0e1e9` | 16.12:1 | AAA |
| `#171a22` | `#f6f7f8` | 16.22:1 | AAA |
| `#ffffff` | `#181e15` | 17:1 | AAA |
| `#ffffff` | `#421983` | 12.36:1 | AAA |
| `#171a22` | `#ffffff` | 17.39:1 | AAA |
| `#181e15` | `#ffffff` | 17:1 | AAA |
| `#181e15` | `#c190ff` | 7.04:1 | AAA |
| `#333333` | `#dceeeb` | 10.51:1 | AAA |

## Design System Score

**Overall: 79/100 (Grade: C)**

| Category | Score |
|----------|-------|
| Color Discipline | 85/100 |
| Typography Consistency | 50/100 |
| Spacing System | 80/100 |
| Shadow Consistency | 80/100 |
| Border Radius Consistency | 100/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 50/100 |

**Strengths:** Tight, disciplined color palette, Consistent border radii, Strong accessibility compliance

**Issues:**
- 5 font families — consider limiting to 2 (heading + body)

## Z-Index Map

**4 unique z-index values** across 3 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| modal | 999999,999999 | div.s.r.f.-.l.a.y.o.u.t._._.s.k.i.p.-.t.o.-.c.o.n.t.e.n.t |
| dropdown | 500,500 | header |
| base | 1,2 | footer.s.r.f.-.f.o.o.t.e.r, button.s.r.f.-.f.o.o.t.e.r._._.l.a.n.g.-.b.u.t.t.o.n. .s.r.f.-.f.o.o.t.e.r._._.l.a.n.g.-.b.u.t.t.o.n.-.-.a.c.t.i.v.e, button.s.r.f.-.f.o.o.t.e.r._._.l.a.n.g.-.b.u.t.t.o.n |

**Issues:**
- [object Object]

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| Lazzer VF | self-hosted | 100 900 | normal |
| Lazzer | self-hosted | 100, 300, 400, 500, 600, 700, 900 | normal, italic |
| Factor A Variable | self-hosted | 400, normal | normal |
| Factor A | self-hosted | 100, 400, 500, 700, 900 | normal |
| Inter | google-fonts | 100, 100 900, 900 | italic, normal |
| Ubuntu | google-fonts | 300, 400, 500, 700 | italic, normal |

**Google Fonts URL:** `https://fonts.googleapis.com/`

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Lazzer` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
