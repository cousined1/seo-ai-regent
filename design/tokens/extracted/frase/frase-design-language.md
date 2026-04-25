# Design Language: Frase — The Agentic SEO & GEO Platform | Rank on Google. Get Cited by AI.

> Extracted from `https://frase.io` on April 16, 2026
> 820 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#e2e8f0` | rgb(226, 232, 240) | hsl(214, 32%, 91%) | 747 |
| Secondary | `#020817` | rgb(2, 8, 23) | hsl(223, 84%, 5%) | 358 |
| Accent | `#28a05f` | rgb(40, 160, 95) | hsl(148, 60%, 39%) | 75 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#ffffff` | hsl(0, 0%, 100%) | 143 |
| `#78716c` | hsl(25, 5%, 45%) | 70 |
| `#44403c` | hsl(30, 6%, 25%) | 47 |
| `#1c1917` | hsl(24, 10%, 10%) | 38 |
| `#000000` | hsl(0, 0%, 0%) | 36 |
| `#a8a29e` | hsl(24, 5%, 64%) | 32 |
| `#57534e` | hsl(33, 5%, 32%) | 24 |

### Background Colors

Used on large-area elements: `#ffffff`, `#faf8f5`, `#f0f9f4`, `#fdfcfa`, `#1e3a2f`

### Text Colors

Text color palette: `#000000`, `#020817`, `#ffffff`, `#78716c`, `#44403c`, `#a8a29e`, `#1f7a4d`, `#1c1917`, `#28a05f`, `#57534e`

### Gradients

```css
background-image: linear-gradient(135deg, rgb(40, 160, 95), rgb(31, 122, 77));
```

```css
background-image: radial-gradient(rgba(40, 160, 95, 0.07) 0%, rgba(0, 0, 0, 0) 70%);
```

```css
background-image: linear-gradient(135deg, rgb(214, 240, 226), rgb(168, 223, 192));
```

```css
background-image: linear-gradient(rgb(253, 252, 250) 0%, rgba(255, 255, 255, 0.7) 100%);
```

```css
background-image: repeating-linear-gradient(to right, rgb(235, 228, 220) 0px, rgb(235, 228, 220) 8px, rgba(0, 0, 0, 0) 8px, rgba(0, 0, 0, 0) 16px);
```

```css
background-image: linear-gradient(90deg, rgb(52, 168, 103), rgb(40, 160, 95));
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
| `#e2e8f0` | border | 747 |
| `#020817` | text, border | 358 |
| `#ffffff` | background, text, border | 143 |
| `#28a05f` | background, border, text | 75 |
| `#78716c` | text | 70 |
| `#f5f0eb` | border, background | 69 |
| `#44403c` | text | 47 |
| `#1c1917` | text | 38 |
| `#000000` | text, background | 36 |
| `#a8a29e` | text | 32 |
| `#1f7a4d` | text | 27 |
| `#57534e` | text | 24 |
| `#ebe4dc` | border, background | 10 |
| `#1a6340` | text, border | 9 |
| `#d6f0e2` | border, background, text | 9 |
| `#0d9488` | text | 5 |
| `#92400e` | text | 4 |
| `#fef3c7` | background | 3 |
| `#a8dfc0` | border | 3 |
| `#f0fdfa` | background | 3 |
| `#fefce8` | background | 2 |
| `#c45a30` | text | 2 |
| `#5eead4` | background | 1 |
| `#34a867` | background | 1 |
| `#d9cfc4` | background | 1 |
| `#b8860b` | text | 1 |
| `#1e3a2f` | background | 1 |

## Typography

### Font Families

- **Inter** — used for all (748 elements)
- **Fraunces** — used for all (36 elements)
- **Times New Roman** — used for body (35 elements)
- **system-ui** — used for all (1 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 70.4px | 4.4rem | 700 | 73.92px | -2.112px | h1, br, span |
| 48px | 3rem | 700 | 48px | normal | span |
| 44.8px | 2.8rem | 600 | 51.52px | -0.896px | h2 |
| 35.84px | 2.24rem | 600 | 41.216px | -0.7168px | h2 |
| 32px | 2rem | 600 | 36.8px | -0.64px | h3 |
| 28px | 1.75rem | 700 | 42px | normal | div |
| 26px | 1.625rem | 700 | 39px | normal | div |
| 24px | 1.5rem | 700 | 33.6px | normal | div |
| 22px | 1.375rem | 600 | 27.5px | normal | h3 |
| 20px | 1.25rem | 600 | 32px | normal | h3, span, div |
| 18px | 1.125rem | 400 | 28.8px | normal | p, span |
| 16.64px | 1.04rem | 400 | 27.456px | normal | p |
| 16px | 1rem | 400 | 24px | normal | html, head, meta, link |
| 15px | 0.9375rem | 600 | 22.5px | normal | a, p, div |
| 14px | 0.875rem | 600 | 21px | normal | a, button, svg, path |

### Heading Scale

```css
h1 { font-size: 70.4px; font-weight: 700; line-height: 73.92px; }
h2 { font-size: 44.8px; font-weight: 600; line-height: 51.52px; }
h2 { font-size: 35.84px; font-weight: 600; line-height: 41.216px; }
h3 { font-size: 32px; font-weight: 600; line-height: 36.8px; }
h3 { font-size: 22px; font-weight: 600; line-height: 27.5px; }
h3 { font-size: 20px; font-weight: 600; line-height: 32px; }
h3 { font-size: 12px; font-weight: 400; line-height: 18px; }
```

### Body Text

```css
body { font-size: 16px; font-weight: 400; line-height: 24px; }
```

### Font Weights in Use

`400` (623x), `600` (82x), `500` (81x), `700` (34x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-2 | 2px | 0.125rem |
| spacing-48 | 48px | 3rem |
| spacing-56 | 56px | 3.5rem |
| spacing-64 | 64px | 4rem |
| spacing-77 | 77px | 4.8125rem |
| spacing-102 | 102px | 6.375rem |
| spacing-128 | 128px | 8rem |
| spacing-149 | 149px | 9.3125rem |
| spacing-167 | 167px | 10.4375rem |
| spacing-176 | 176px | 11rem |
| spacing-184 | 184px | 11.5rem |
| spacing-208 | 208px | 13rem |
| spacing-247 | 247px | 15.4375rem |
| spacing-262 | 262px | 16.375rem |
| spacing-288 | 288px | 18rem |
| spacing-298 | 298px | 18.625rem |
| spacing-328 | 328px | 20.5rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| sm | 4px | 23 |
| md | 8px | 55 |
| lg | 12px | 36 |
| lg | 16px | 24 |
| full | 9999px | 14 |

## Box Shadows

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
```

**sm** — blur: 3px
```css
box-shadow: rgba(0, 0, 0, 0.06) 0px 1px 3px 0px;
```

**sm** — blur: 3px
```css
box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px;
```

**md** — blur: 12px
```css
box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px 0px, rgba(0, 0, 0, 0.04) 0px 2px 4px 0px;
```

**md** — blur: 12px
```css
box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 12px 0px;
```

**lg** — blur: 14px
```css
box-shadow: rgba(40, 160, 95, 0.3) 0px 4px 14px 0px;
```

**xl** — blur: 60px
```css
box-shadow: rgba(0, 0, 0, 0.18) 0px 30px 60px -15px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
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
| md | 768px | min-width |
| lg | 1024px | min-width |
| 1400px | 1400px | min-width |

## Transitions & Animations

**Easing functions:** `[object Object]`, `[object Object]`, `[object Object]`

**Durations:** `0.2s`, `0.3s`, `0.15s`, `0.7s`, `0.08s`, `0.16s`, `0.24s`, `0.32s`, `0.4s`

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

### Buttons (21 instances)

```css
.button {
  background-color: rgb(255, 255, 255);
  color: rgb(28, 25, 23);
  font-size: 16px;
  font-weight: 500;
  padding-top: 8px;
  padding-right: 0px;
  border-radius: 8px;
}
```

### Cards (24 instances)

```css
.card {
  background-color: rgb(255, 255, 255);
  border-radius: 16px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px;
  padding-top: 32px;
  padding-right: 28px;
}
```

### Links (82 instances)

```css
.link {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
}
```

### Navigation (8 instances)

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

### Badges (6 instances)

```css
.badge {
  color: rgb(31, 122, 77);
  font-size: 13px;
  font-weight: 600;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 0px;
}
```

## Layout System

**7 grid containers** and **188 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 900px | 0px |
| 1280px | 32px |
| 800px | 0px |
| 980px | 16px |
| 90% | 0px |
| 640px | 0px |
| 960px | 0px |
| 100% | 0px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 3-column | 3x |
| 2-column | 3x |
| 5-column | 1x |

### Grid Templates

```css
grid-template-columns: 389.328px 389.328px 389.344px;
gap: 24px;
grid-template-columns: 384px 384px 384px;
gap: 32px;
grid-template-columns: 596px 596px;
gap: 24px;
grid-template-columns: 576px 576px;
gap: 64px;
grid-template-columns: 204.797px 204.797px 204.797px 204.797px 204.812px;
gap: 48px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 175x |
| column/nowrap | 10x |
| row-reverse/nowrap | 1x |
| row/wrap | 2x |

**Gap values:** `10px`, `12px`, `16px`, `20px`, `24px`, `2px`, `32px`, `40px`, `48px`, `4px`, `64px`, `6px`, `8px`

## Responsive Design

### Viewport Snapshots

| Viewport | Body Font | Nav Visible | Max Columns | Hamburger | Page Height |
|----------|-----------|-------------|-------------|-----------|-------------|
| mobile (375px) | 16px | No | 2 | Yes | 14785px |
| tablet (768px) | 16px | No | 3 | Yes | 11392px |
| desktop (1280px) | 16px | Yes | 5 | No | 8235px |
| wide (1920px) | 16px | Yes | 5 | No | 8399px |

### Breakpoint Changes

**375px → 768px** (mobile → tablet):
- H1 size: `40px` → `42.24px`
- Max grid columns: `2` → `3`
- Page height: `14785px` → `11392px`

**768px → 1280px** (tablet → desktop):
- H1 size: `42.24px` → `70.4px`
- Nav visibility: `hidden` → `visible`
- Hamburger menu: `shown` → `hidden`
- Max grid columns: `3` → `5`
- Page height: `11392px` → `8235px`

**1280px → 1920px** (desktop → wide):
- H1 size: `70.4px` → `72px`

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
color: rgb(120, 113, 108) → rgb(35, 32, 30);
background-color: rgba(0, 0, 0, 0) → rgba(245, 240, 235, 0.92);
outline: rgb(120, 113, 108) none 3px → rgb(35, 32, 30) none 3px;
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
color: rgb(120, 113, 108) → rgb(35, 32, 30);
background-color: rgba(0, 0, 0, 0) → rgba(245, 240, 235, 0.92);
outline: rgb(120, 113, 108) none 3px → rgb(35, 32, 30) none 3px;
```
```css
/* Focus */
color: rgb(120, 113, 108) → rgb(28, 25, 23);
background-color: rgba(0, 0, 0, 0) → rgb(245, 240, 235);
outline: rgb(120, 113, 108) none 3px → rgb(5, 148, 105) solid 2px;
```

## Accessibility (WCAG 2.1)

**Overall Score: 91%** — 114 passing, 11 failing color pairs

### Failing Color Pairs

| Foreground | Background | Ratio | Level | Used On |
|------------|------------|-------|-------|---------|
| `#1f7a4d` | `#d6f0e2` | 4.41:1 | FAIL | div (5x) |
| `#ffffff` | `#28a05f` | 3.34:1 | FAIL | a (1x) |
| `#020817` | `#000000` | 1.05:1 | FAIL | div (1x) |
| `#1f7a4d` | `#28a05f` | 1.59:1 | FAIL | span (1x) |
| `#1a6340` | `#28a05f` | 2.16:1 | FAIL | span (1x) |
| `#a8a29e` | `#ffffff` | 2.52:1 | FAIL | div (1x) |
| `#020817` | `#1e3a2f` | 1.62:1 | FAIL | footer (1x) |

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#020817` | `#ffffff` | 20.01:1 | AAA |
| `#020817` | `#fdfcfa` | 19.51:1 | AAA |
| `#28a05f` | `#f0f9f4` | 3.11:1 | AA |
| `#57534e` | `#fdfcfa` | 7.44:1 | AAA |
| `#020817` | `#faf8f5` | 18.87:1 | AAA |
| `#1f7a4d` | `#f0f9f4` | 4.95:1 | AA |
| `#1a6340` | `#ffffff` | 7.23:1 | AAA |
| `#78716c` | `#faf8f5` | 4.53:1 | AAA |
| `#57534e` | `#f5f0eb` | 6.74:1 | AA |
| `#92400e` | `#fef3c7` | 6.37:1 | AA |

## Design System Score

**Overall: 69/100 (Grade: D)**

| Category | Score |
|----------|-------|
| Color Discipline | 50/100 |
| Typography Consistency | 40/100 |
| Spacing System | 80/100 |
| Shadow Consistency | 75/100 |
| Border Radius Consistency | 85/100 |
| Accessibility | 91/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 4 font families — consider limiting to 2 (heading + body)
- 21 distinct font sizes — consider a tighter type scale
- 11 WCAG contrast failures

## Gradients

**8 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| linear | 135deg | 2 | brand |
| radial | — | 2 | brand |
| linear | 135deg | 2 | brand |
| linear | — | 2 | brand |
| repeating-linear | to right | 4 | bold |
| linear | 90deg | 2 | brand |
| linear | 135deg | 3 | bold |
| radial | at 30% 50% | 2 | brand |

```css
background: linear-gradient(135deg, rgb(40, 160, 95), rgb(31, 122, 77));
background: radial-gradient(rgba(40, 160, 95, 0.07) 0%, rgba(0, 0, 0, 0) 70%);
background: linear-gradient(135deg, rgb(214, 240, 226), rgb(168, 223, 192));
background: linear-gradient(rgb(253, 252, 250) 0%, rgba(255, 255, 255, 0.7) 100%);
background: repeating-linear-gradient(to right, rgb(235, 228, 220) 0px, rgb(235, 228, 220) 8px, rgba(0, 0, 0, 0) 8px, rgba(0, 0, 0, 0) 16px);
```

## Z-Index Map

**6 unique z-index values** across 3 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| dropdown | 200,200 | a.s.k.i.p.-.l.i.n.k |
| sticky | 50,55 | header.f.i.x.e.d. .t.o.p.-.0. .l.e.f.t.-.0. .r.i.g.h.t.-.0. .z.-.5.0. .t.r.a.n.s.i.t.i.o.n.-.[.b.a.c.k.g.r.o.u.n.d.-.c.o.l.o.r.,.b.o.x.-.s.h.a.d.o.w.,.b.a.c.k.d.r.o.p.-.f.i.l.t.e.r.]. .d.u.r.a.t.i.o.n.-.3.0.0. .b.g.-.t.r.a.n.s.p.a.r.e.n.t, div.f.i.x.e.d. .b.o.t.t.o.m.-.0. .l.e.f.t.-.0. .r.i.g.h.t.-.0. .z.-.5.0. .b.o.r.d.e.r.-.t. .m.d.:.h.i.d.d.e.n, div.f.i.x.e.d. .i.n.s.e.t.-.0. .z.-.[.5.5.]. .b.g.-.b.l.a.c.k./.2.0. .b.a.c.k.d.r.o.p.-.b.l.u.r.-.s.m. .t.r.a.n.s.i.t.i.o.n.-.o.p.a.c.i.t.y. .d.u.r.a.t.i.o.n.-.3.0.0. .l.g.:.h.i.d.d.e.n. .o.p.a.c.i.t.y.-.0. .p.o.i.n.t.e.r.-.e.v.e.n.t.s.-.n.o.n.e |
| base | -1000,1 | iframe, div.p.o.i.n.t.e.r.-.e.v.e.n.t.s.-.n.o.n.e. .a.b.s.o.l.u.t.e. .l.e.f.t.-.1./.2. .-.t.r.a.n.s.l.a.t.e.-.x.-.1./.2, div.m.a.r.k.e.t.i.n.g.-.c.o.n.t.a.i.n.e.r. .r.e.l.a.t.i.v.e. .z.-.[.1.]. .m.k.t.-.p.a.g.e.-.e.n.t.e.r |

## SVG Icons

**11 unique SVG icons** detected. Dominant style: **outlined**.

| Size Class | Count |
|------------|-------|
| xs | 7 |
| lg | 4 |

**Icon colors:** `currentColor`, `var(--ink-500)`, `url(#gdpr-gradient-_R_6llb_)`, `white`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| Fraunces | self-hosted | 100 900 | normal |
| Inter | self-hosted | 100 900 | normal |
| JetBrains Mono | self-hosted | 100 800 | normal |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 44 | objectFit: fill, borderRadius: 0px, shape: square |
| general | 1 | objectFit: fill, borderRadius: 0px, shape: square |

**Aspect ratios:** 2.73:1 (8x), 1:1 (7x), 3.33:1 (4x), 3.44:1 (3x), 3.83:1 (2x), 9.25:1 (2x), 6.02:1 (2x), 4.29:1 (2x)

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Inter` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
