# Design Language: Frase — Pricing | Full platform. Any scale.

> Extracted from `https://www.frase.io/pricing` on April 16, 2026
> 979 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#e2e8f0` | rgb(226, 232, 240) | hsl(214, 32%, 91%) | 915 |
| Secondary | `#020817` | rgb(2, 8, 23) | hsl(223, 84%, 5%) | 365 |
| Accent | `#28a05f` | rgb(40, 160, 95) | hsl(148, 60%, 39%) | 95 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#44403c` | hsl(30, 6%, 25%) | 173 |
| `#ffffff` | hsl(0, 0%, 100%) | 127 |
| `#78716c` | hsl(25, 5%, 45%) | 55 |
| `#000000` | hsl(0, 0%, 0%) | 37 |
| `#57534e` | hsl(33, 5%, 32%) | 34 |
| `#1c1917` | hsl(24, 10%, 10%) | 32 |
| `#d6d3d1` | hsl(24, 6%, 83%) | 17 |
| `#a8a29e` | hsl(24, 5%, 64%) | 16 |

### Background Colors

Used on large-area elements: `#ffffff`, `#faf8f5`, `#f0f9f4`, `#f1f5f9`, `#1e3a2f`

### Text Colors

Text color palette: `#000000`, `#020817`, `#ffffff`, `#78716c`, `#44403c`, `#1f7a4d`, `#a8a29e`, `#1c1917`, `#57534e`, `#28a05f`

### Gradients

```css
background-image: linear-gradient(135deg, rgb(40, 160, 95), rgb(31, 122, 77));
```

```css
background-image: radial-gradient(rgba(40, 160, 95, 0.06) 0%, rgba(0, 0, 0, 0) 70%);
```

```css
background-image: linear-gradient(90deg, rgb(52, 168, 103), rgb(40, 160, 95));
```

```css
background-image: linear-gradient(135deg, rgb(214, 240, 226), rgb(168, 223, 192));
```

```css
background-image: linear-gradient(135deg, rgb(240, 249, 244) 0%, rgb(253, 252, 250) 100%);
```

```css
background-image: linear-gradient(135deg, rgb(30, 58, 47) 0%, rgb(22, 46, 36) 100%);
```

```css
background-image: radial-gradient(rgba(40, 160, 95, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
```

```css
background-image: linear-gradient(135deg, rgb(40, 160, 95) 0%, rgb(31, 122, 77) 50%, rgb(26, 99, 64) 100%);
```

```css
background-image: radial-gradient(at 30% 50%, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0) 60%);
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#e2e8f0` | border | 915 |
| `#020817` | text, border | 365 |
| `#44403c` | text | 173 |
| `#ffffff` | background, text, border | 127 |
| `#28a05f` | background, border, text | 95 |
| `#f5f0eb` | border, background | 74 |
| `#78716c` | text, border | 55 |
| `#000000` | text, background | 37 |
| `#57534e` | text | 34 |
| `#1f7a4d` | text | 32 |
| `#1c1917` | text | 32 |
| `#64748b` | text | 23 |
| `#d6d3d1` | text | 17 |
| `#a8a29e` | text | 16 |
| `#059469` | text | 12 |
| `#ebe4dc` | border | 8 |
| `#34a867` | background | 6 |
| `#f4c430` | text | 5 |
| `#1e3a2f` | text, border, background | 3 |
| `#1a6340` | text, border | 2 |
| `#6cc795` | border | 1 |
| `#a8dfc0` | border | 1 |
| `#f1f5f9` | background | 1 |

## Typography

### Font Families

- **Inter** — used for all (922 elements)
- **Times New Roman** — used for body (36 elements)
- **Fraunces** — used for all (19 elements)
- **system-ui** — used for all (2 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 64px | 4rem | 700 | 69.12px | -1.92px | h1 |
| 44.8px | 2.8rem | 600 | 51.52px | -0.896px | h2 |
| 42px | 2.625rem | 700 | 42px | -1.26px | span |
| 38.4px | 2.4rem | 600 | 57.6px | -0.768px | h2, br |
| 28px | 1.75rem | 600 | 42px | -0.56px | h3, div |
| 26px | 1.625rem | 700 | 39px | -0.52px | div |
| 22px | 1.375rem | 700 | 33px | normal | div |
| 18px | 1.125rem | 600 | 30.6px | normal | span, p |
| 17px | 1.0625rem | 400 | 28.9px | normal | p |
| 16px | 1rem | 400 | 24px | normal | html, head, meta, link |
| 15.36px | 0.96rem | 400 | 25.344px | normal | p |
| 15px | 0.9375rem | 600 | 22.5px | normal | a, span, p, button |
| 14px | 0.875rem | 600 | 21px | normal | a, button, svg, path |
| 13px | 0.8125rem | 400 | 19.5px | normal | p, strong, div, span |
| 12px | 0.75rem | 600 | 18px | 0.12px | span, div, h3, p |

### Heading Scale

```css
h1 { font-size: 64px; font-weight: 700; line-height: 69.12px; }
h2 { font-size: 44.8px; font-weight: 600; line-height: 51.52px; }
h2 { font-size: 38.4px; font-weight: 600; line-height: 57.6px; }
h3 { font-size: 28px; font-weight: 600; line-height: 42px; }
h3 { font-size: 12px; font-weight: 600; line-height: 18px; }
```

### Body Text

```css
body { font-size: 16px; font-weight: 400; line-height: 24px; }
```

### Font Weights in Use

`400` (820x), `500` (71x), `600` (60x), `700` (28x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-1 | 1px | 0.0625rem |
| spacing-48 | 48px | 3rem |
| spacing-56 | 56px | 3.5rem |
| spacing-64 | 64px | 4rem |
| spacing-72 | 72px | 4.5rem |
| spacing-77 | 77px | 4.8125rem |
| spacing-102 | 102px | 6.375rem |
| spacing-108 | 108px | 6.75rem |
| spacing-208 | 208px | 13rem |
| spacing-258 | 258px | 16.125rem |
| spacing-268 | 268px | 16.75rem |
| spacing-278 | 278px | 17.375rem |
| spacing-288 | 288px | 18rem |
| spacing-328 | 328px | 20.5rem |
| spacing-471 | 471px | 29.4375rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| md | 8px | 46 |
| lg | 12px | 14 |
| lg | 16px | 7 |
| xl | 20px | 1 |
| xl | 24px | 1 |
| full | 9999px | 57 |

## Box Shadows

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
```

**sm** — blur: 3px
```css
box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px;
```

**md** — blur: 8px
```css
box-shadow: rgba(40, 160, 95, 0.25) 0px 2px 8px 0px;
```

**md** — blur: 12px
```css
box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 12px 0px;
```

**md** — blur: 12px
```css
box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 12px 0px;
```

**lg** — blur: 14px
```css
box-shadow: rgba(40, 160, 95, 0.3) 0px 4px 14px 0px;
```

**lg** — blur: 20px
```css
box-shadow: rgba(40, 160, 95, 0.12) 0px 4px 20px 0px, rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px;
```

## CSS Custom Properties

### Colors

```css
--purple-accent: #9600e0;
--shadow-card: 0 1px 3px rgba(0,0,0,0.05),0 1px 2px rgba(0,0,0,0.03);
--shadow-card-hover: 0 4px 12px rgba(0,0,0,0.08),0 2px 4px rgba(0,0,0,0.04);
--foreground: 222.2 84% 4.9%;
--card: 0 0% 100%;
--card-foreground: 222.2 84% 4.9%;
--popover: 0 0% 100%;
--popover-foreground: 222.2 84% 4.9%;
--primary: 162 94% 30%;
--primary-foreground: 0 0% 100%;
--primary-dark: 162 94% 25%;
--secondary: 45 97% 64%;
--secondary-foreground: 222.2 47.4% 11.2%;
--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;
--accent: 162 94% 95%;
--accent-foreground: 162 94% 25%;
--destructive: 0 91% 71%;
--destructive-foreground: 0 0% 100%;
--border: 214.3 31.8% 91.4%;
--ring: 158 46% 62%;
--accent-purple: 258 90% 66%;
--dark-bg: 220 9% 10%;
--light-gray-bg: 210 40% 96%;
--tw-ring-shadow: 0 0 #0000;
--tw-border-spacing-x: 0;
--tw-ring-color: rgb(59 130 246/0.5);
--tw-ring-offset-color: #fff;
--tw-ring-offset-width: 0px;
--tw-shadow-colored: 0 0 #0000;
--tw-ring-offset-shadow: 0 0 #0000;
--tw-ring-inset: ;
--tw-border-spacing-y: 0;
```

### Spacing

```css
--tw-numeric-spacing: ;
--tw-contain-size: ;
```

### Shadows

```css
--shadow-elevated: 0 20px 40px -12px rgba(0,0,0,0.12);
--shadow-elevated-lg: 0 30px 60px -15px rgba(0,0,0,0.18);
--shadow-btn: 0 4px 14px 0 rgba(40,160,95,0.3);
--shadow-btn-hover: 0 6px 20px 0 rgba(40,160,95,0.4);
--tw-drop-shadow: ;
--tw-shadow: 0 0 #0000;
```

### Radii

```css
--radius: 0.5rem;
```

### Other

```css
--cream-50: #FDFCFA;
--cream-100: #FAF8F5;
--cream-200: #F5F0EB;
--cream-300: #EBE4DC;
--cream-400: #D9CFC4;
--cream-500: #C4B5A5;
--cream-600: #A89888;
--cream-900: #4A4238;
--cream-950: #2D2923;
--forest-50: #F0F9F4;
--forest-100: #D6F0E2;
--forest-200: #A8DFC0;
--forest-300: #6CC795;
--forest-400: #34A867;
--forest-500: #28A05F;
--forest-600: #1F7A4D;
--forest-700: #1A6340;
--forest-800: #174F35;
--forest-900: #143F2C;
--ink-200: #E7E5E4;
--ink-300: #D6D3D1;
--ink-400: #A8A29E;
--ink-500: #78716C;
--ink-600: #57534E;
--ink-700: #44403C;
--ink-800: #292524;
--ink-900: #1C1917;
--sidebar-hex: #1E3A2F;
--sidebar-dark-hex: #162E24;
--gold-50: #FEFCE8;
--teal-50: #F0FDFA;
--terracotta-50: #FDF5F0;
--max-w: 1280px;
--section-py: clamp(48px,6vw,80px);
--background: 0 0% 100%;
--input: 214.3 31.8% 91.4%;
--brand-green: 162 94% 30%;
--brand-yellow: 45 97% 64%;
--brand-red: 0 91% 71%;
--success: 142 76% 36%;
--warning: 38 92% 50%;
--purple-gradient: 279 100% 44%;
--light-gray: 0 0% 34%;
--medium-gray: 0 0% 56%;
--slate-gray: 215 16% 47%;
--mystic: 214 32% 91%;
--slate-50: 210 40% 98%;
--slate-100: 210 40% 96.1%;
--slate-200: 214.3 31.8% 91.4%;
--slate-300: 212.7 26.8% 83.9%;
--slate-400: 215.4 16.3% 46.9%;
--slate-500: 215.4 16.3% 46.9%;
--slate-600: 215.3 19.3% 34.5%;
--slate-700: 215.3 25% 26.7%;
--slate-800: 217.2 32.6% 17.5%;
--slate-900: 222.2 47.4% 11.2%;
--tw-backdrop-sepia: ;
--tw-sepia: ;
--tw-ordinal: ;
--tw-contain-style: ;
--tw-backdrop-invert: ;
--tw-backdrop-grayscale: ;
--tw-hue-rotate: ;
--tw-pan-y: ;
--tw-rotate: 0;
--tw-gradient-via-position: ;
--tw-saturate: ;
--tw-scroll-snap-strictness: proximity;
--tw-grayscale: ;
--tw-backdrop-hue-rotate: ;
--tw-gradient-to-position: ;
--tw-numeric-fraction: ;
--tw-skew-y: 0;
--tw-slashed-zero: ;
--tw-backdrop-opacity: ;
--tw-gradient-from-position: ;
--tw-pinch-zoom: ;
--tw-contain-paint: ;
--tw-backdrop-saturate: ;
--tw-brightness: ;
--tw-scale-y: 1;
--tw-backdrop-contrast: ;
--tw-backdrop-brightness: ;
--tw-pan-x: ;
--tw-translate-y: 0;
--tw-contrast: ;
--tw-skew-x: 0;
--tw-backdrop-blur: ;
--tw-translate-x: 0;
--tw-scale-x: 1;
--tw-blur: ;
--tw-invert: ;
--tw-numeric-figure: ;
--tw-contain-layout: ;
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
| sm | 639px | max-width |
| sm | 640px | min-width |
| md | 768px | max-width |
| lg | 1024px | max-width |
| 1400px | 1400px | min-width |

## Transitions & Animations

**Easing functions:** `[object Object]`, `[object Object]`, `[object Object]`

**Durations:** `0.2s`, `0.3s`, `0.15s`, `0.5s`, `0.7s`

### Common Transitions

```css
transition: all;
transition: top 0.2s;
transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), fill 0.15s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.15s cubic-bezier(0.4, 0, 0.2, 1);
transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
transition: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transition: 0.3s cubic-bezier(0, 0, 0.2, 1);
transition: 0.2s cubic-bezier(0, 0, 0.2, 1);
```

### Keyframe Animations

**mkt-page-enter**
```css
@keyframes mkt-page-enter {
  0% { opacity: 0; transform: translateY(12px) scale(0.99); }
  100% { opacity: 1; transform: translateY(0px) scale(1); }
}
```

**pulse-dot**
```css
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
```

**marquee-scroll**
```css
@keyframes marquee-scroll {
  0% { transform: translateX(0px); }
  100% { transform: translateX(-50%); }
}
```

**pulse**
```css
@keyframes pulse {
  50% { opacity: 0.5; }
}
```

**spin**
```css
@keyframes spin {
  100% { transform: rotate(1turn); }
}
```

**enter**
```css
@keyframes enter {
  0% { opacity: var(--tw-enter-opacity,1); transform: translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0)); }
}
```

**exit**
```css
@keyframes exit {
  100% { opacity: var(--tw-exit-opacity,1); transform: translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0)); }
}
```

**fade-up**
```css
@keyframes fade-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0px); }
}
```

**fade-in**
```css
@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
```

**slide-up**
```css
@keyframes slide-up {
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0px); opacity: 1; }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (30 instances)

```css
.button {
  background-color: rgb(255, 255, 255);
  color: rgb(28, 25, 23);
  font-size: 14px;
  font-weight: 500;
  padding-top: 8px;
  padding-right: 24px;
  border-radius: 0px;
}
```

### Cards (20 instances)

```css
.card {
  background-color: rgb(255, 255, 255);
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Links (78 instances)

```css
.link {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
}
```

### Navigation (2 instances)

```css
.navigatio {
  background-color: rgb(253, 252, 250);
  color: rgb(2, 8, 23);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
}
```

### Footer (1 instances)

```css
.foote {
  background-color: rgb(30, 58, 47);
  color: rgb(2, 8, 23);
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 16px;
}
```

### Dropdowns (3 instances)

```css
.dropdown {
  background-color: rgb(253, 252, 250);
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  border-color: rgb(245, 240, 235);
  padding-top: 8px;
}
```

### Tables (1 instances)

```css
.table {
  border-color: rgb(245, 240, 235);
  cell-style: [object Object];
}
```

### Tabs (5 instances)

```css
.tab {
  background-color: rgb(40, 160, 95);
  color: rgb(120, 113, 108);
  font-size: 14px;
  font-weight: 600;
  padding-top: 10px;
  padding-right: 16px;
  border-color: rgb(120, 113, 108);
  border-radius: 9px;
}
```

## Layout System

**6 grid containers** and **203 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 900px | 0px |
| 1280px | 32px |
| 1120px | 0px |
| 700px | 32px |
| 680px | 38.4px |
| 640px | 32px |
| 1000px | 0px |
| 800px | 0px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 3-column | 2x |
| 2-column | 2x |
| 1-column | 1x |
| 5-column | 1x |

### Grid Templates

```css
grid-template-columns: 1120px;
gap: 24px;
grid-template-columns: 357.328px 357.328px 357.344px;
gap: 24px;
grid-template-columns: 204.797px 204.797px 204.797px 204.797px 204.812px;
gap: 48px;
grid-template-columns: 567.266px 472.734px;
gap: 48px;
grid-template-columns: 317.328px 317.328px 317.344px;
gap: 24px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 188x |
| column/nowrap | 10x |
| row/wrap | 5x |

**Gap values:** `10px`, `12px`, `16px`, `24px`, `2px`, `32px`, `40px`, `48px`, `4px`, `5px`, `6px`, `8px`

## Responsive Design

### Viewport Snapshots

| Viewport | Body Font | Nav Visible | Max Columns | Hamburger | Page Height |
|----------|-----------|-------------|-------------|-----------|-------------|
| mobile (375px) | 16px | No | 2 | Yes | 8119px |
| tablet (768px) | 16px | No | 3 | Yes | 6565px |
| desktop (1280px) | 16px | Yes | 5 | No | 5551px |
| wide (1920px) | 16px | Yes | 5 | No | 5616px |

### Breakpoint Changes

**375px → 768px** (mobile → tablet):
- H1 size: `36px` → `38.4px`
- Max grid columns: `2` → `3`
- Page height: `8119px` → `6565px`

**768px → 1280px** (tablet → desktop):
- H1 size: `38.4px` → `64px`
- Nav visibility: `hidden` → `visible`
- Hamburger menu: `shown` → `hidden`
- Max grid columns: `3` → `5`
- Page height: `6565px` → `5551px`

## Interaction States

### Button States

**"Product"**
```css
/* Hover */
color: rgb(120, 113, 108) → rgb(31, 28, 26);
background-color: rgba(0, 0, 0, 0) → rgba(245, 240, 235, 0.97);
outline: rgb(120, 113, 108) none 3px → rgb(31, 28, 26) none 3px;
```
```css
/* Focus */
color: rgb(120, 113, 108) → rgb(28, 25, 23);
background-color: rgba(0, 0, 0, 0) → rgb(245, 240, 235);
outline: rgb(120, 113, 108) none 3px → rgb(5, 148, 105) solid 2px;
```

**"Solutions"**
```css
/* Hover */
color: rgb(120, 113, 108) → rgb(31, 28, 26);
background-color: rgba(0, 0, 0, 0) → rgba(245, 240, 235, 0.97);
outline: rgb(120, 113, 108) none 3px → rgb(31, 28, 26) none 3px;
```
```css
/* Focus */
color: rgb(120, 113, 108) → rgb(28, 25, 23);
background-color: rgba(0, 0, 0, 0) → rgb(245, 240, 235);
outline: rgb(120, 113, 108) none 3px → rgb(5, 148, 105) solid 2px;
```

**"Resources"**
```css
/* Hover */
color: rgb(120, 113, 108) → rgb(31, 28, 26);
background-color: rgba(0, 0, 0, 0) → rgba(245, 240, 235, 0.97);
outline: rgb(120, 113, 108) none 3px → rgb(31, 28, 26) none 3px;
```
```css
/* Focus */
color: rgb(120, 113, 108) → rgb(28, 25, 23);
background-color: rgba(0, 0, 0, 0) → rgb(245, 240, 235);
outline: rgb(120, 113, 108) none 3px → rgb(5, 148, 105) solid 2px;
```

## Accessibility (WCAG 2.1)

**Overall Score: 63%** — 72 passing, 42 failing color pairs

### Failing Color Pairs

| Foreground | Background | Ratio | Level | Used On |
|------------|------------|-------|-------|---------|
| `#28a05f` | `#f0f9f4` | 3.11:1 | FAIL | span (31x) |
| `#1f7a4d` | `#34a867` | 1.76:1 | FAIL | span (6x) |
| `#ffffff` | `#28a05f` | 3.34:1 | FAIL | a, button (3x) |
| `#020817` | `#000000` | 1.05:1 | FAIL | div (1x) |
| `#020817` | `#1e3a2f` | 1.62:1 | FAIL | footer (1x) |

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#020817` | `#ffffff` | 20.01:1 | AAA |
| `#1f7a4d` | `#f0f9f4` | 4.95:1 | AA |
| `#020817` | `#28a05f` | 5.99:1 | AA |
| `#78716c` | `#faf8f5` | 4.53:1 | AAA |
| `#020817` | `#fdfcfa` | 19.51:1 | AAA |
| `#44403c` | `#fdfcfa` | 10.02:1 | AAA |
| `#1c1917` | `#ffffff` | 17.49:1 | AAA |
| `#020817` | `#faf8f5` | 18.87:1 | AAA |
| `#44403c` | `#f5f0eb` | 9.07:1 | AAA |
| `#1e3a2f` | `#ffffff` | 12.34:1 | AAA |

## Design System Score

**Overall: 70/100 (Grade: C)**

| Category | Score |
|----------|-------|
| Color Discipline | 70/100 |
| Typography Consistency | 40/100 |
| Spacing System | 100/100 |
| Shadow Consistency | 75/100 |
| Border Radius Consistency | 65/100 |
| Accessibility | 63/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Well-defined spacing scale, Good CSS variable tokenization

**Issues:**
- 4 font families — consider limiting to 2 (heading + body)
- 18 distinct font sizes — consider a tighter type scale
- 42 WCAG contrast failures

## Gradients

**9 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| linear | 135deg | 2 | brand |
| radial | — | 2 | brand |
| linear | 90deg | 2 | brand |
| linear | 135deg | 2 | brand |
| linear | 135deg | 2 | brand |
| linear | 135deg | 2 | brand |
| radial | — | 2 | brand |
| linear | 135deg | 3 | bold |
| radial | at 30% 50% | 2 | brand |

```css
background: linear-gradient(135deg, rgb(40, 160, 95), rgb(31, 122, 77));
background: radial-gradient(rgba(40, 160, 95, 0.06) 0%, rgba(0, 0, 0, 0) 70%);
background: linear-gradient(90deg, rgb(52, 168, 103), rgb(40, 160, 95));
background: linear-gradient(135deg, rgb(214, 240, 226), rgb(168, 223, 192));
background: linear-gradient(135deg, rgb(240, 249, 244) 0%, rgb(253, 252, 250) 100%);
```

## Z-Index Map

**5 unique z-index values** across 3 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| dropdown | 200,200 | a.s.k.i.p.-.l.i.n.k |
| sticky | 10,55 | div.m.a.r.k.e.t.i.n.g.-.c.o.n.t.a.i.n.e.r. .r.e.l.a.t.i.v.e. .z.-.1.0. .m.k.t.-.p.a.g.e.-.e.n.t.e.r, div.e.n.t.e.r.p.r.i.s.e.-.g.r.i.d.-.l.a.y.o.u.t. .r.e.l.a.t.i.v.e. .z.-.1.0, header.f.i.x.e.d. .t.o.p.-.0. .l.e.f.t.-.0. .r.i.g.h.t.-.0. .z.-.5.0. .t.r.a.n.s.i.t.i.o.n.-.[.b.a.c.k.g.r.o.u.n.d.-.c.o.l.o.r.,.b.o.x.-.s.h.a.d.o.w.,.b.a.c.k.d.r.o.p.-.f.i.l.t.e.r.]. .d.u.r.a.t.i.o.n.-.3.0.0. .b.g.-.t.r.a.n.s.p.a.r.e.n.t |
| base | -1000,-1000 | iframe |

## SVG Icons

**15 unique SVG icons** detected. Dominant style: **outlined**.

| Size Class | Count |
|------------|-------|
| xs | 9 |
| sm | 4 |
| lg | 2 |

**Icon colors:** `currentColor`, `var(--forest-300)`, `url(#gdpr-gradient-_R_3bnlfivdb_)`, `white`, `url(#gdpr-gradient-_R_6llb_)`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| Fraunces | self-hosted | 100 900 | normal |
| Inter | self-hosted | 100 900 | normal |
| JetBrains Mono | self-hosted | 100 800 | normal |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 40 | objectFit: fill, borderRadius: 0px, shape: square |

**Aspect ratios:** 2.73:1 (8x), 3.33:1 (4x), 1:1 (4x), 3.83:1 (2x), 9.25:1 (2x), 6.02:1 (2x), 4.29:1 (2x), 2.89:1 (2x)

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Inter` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
