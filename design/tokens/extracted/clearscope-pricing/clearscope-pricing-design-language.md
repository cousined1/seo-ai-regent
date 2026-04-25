# Design Language: Plans & Pricing | Clearscope

> Extracted from `https://www.clearscope.io/pricing` on April 16, 2026
> 377 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#580101` | rgb(88, 1, 1) | hsl(0, 98%, 17%) | 25 |
| Secondary | `#e0e9f2` | rgb(224, 233, 242) | hsl(210, 41%, 91%) | 4 |
| Accent | `#ffc2c2` | rgb(255, 194, 194) | hsl(0, 100%, 88%) | 1 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#000000` | hsl(0, 0%, 0%) | 594 |
| `#f4f4f2` | hsl(60, 8%, 95%) | 142 |
| `#c1c1c1` | hsl(0, 0%, 76%) | 1 |

### Background Colors

Used on large-area elements: `#f4f4f2`, `#010101`

### Text Colors

Text color palette: `#000000`, `#010101`, `#f4f4f2`, `#580101`, `#e0e9f2`, `#475b7c`

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#000000` | text, border, background | 594 |
| `#f4f4f2` | background, text, border | 142 |
| `#580101` | text, border | 25 |
| `#e0e9f2` | text, border | 4 |
| `#475b7c` | text, border | 2 |
| `#ffc2c2` | background | 1 |
| `#040810` | background | 1 |
| `#c1c1c1` | border | 1 |

## Typography

### Font Families

- **GT-Pressura-Mono** — used for all (353 elements)
- **ui-sans-serif** — used for body (24 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 74.2362px | 4.6398rem | 600 | 89.0834px | normal | h1 |
| 62.0374px | 3.8773rem | 600 | 62.0374px | normal | span, p |
| 43.3472px | 2.7092rem | 600 | 65.0208px | normal | h2 |
| 21.217px | 1.3261rem | 400 | 31.8254px | normal | p, a, h3 |
| 18px | 1.125rem | 400 | 28px | normal | svg, polygon, line |
| 17.7565px | 1.1098rem | 400 | 17.7565px | normal | header, a, svg, g |
| 16px | 1rem | 400 | 24px | normal | html, head, meta, title |
| 14.865px | 0.9291rem | 500 | 14.865px | normal | svg, polyline, a |
| 14px | 0.875rem | 500 | 20px | normal | div |
| 12.447px | 0.7779rem | 400 | 18.6706px | 0.622352px | h3, div, p |
| 12px | 0.75rem | 600 | 14px | normal | button, svg, line, div |

### Heading Scale

```css
h1 { font-size: 74.2362px; font-weight: 600; line-height: 89.0834px; }
h2 { font-size: 43.3472px; font-weight: 600; line-height: 65.0208px; }
h3 { font-size: 21.217px; font-weight: 400; line-height: 31.8254px; }
h2 { font-size: 17.7565px; font-weight: 400; line-height: 17.7565px; }
h3 { font-size: 12.447px; font-weight: 400; line-height: 18.6706px; }
```

### Body Text

```css
body { font-size: 17.7565px; font-weight: 400; line-height: 17.7565px; }
```

### Font Weights in Use

`400` (272x), `600` (43x), `500` (42x), `700` (20x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-2 | 2px | 0.125rem |
| spacing-15 | 15px | 0.9375rem |
| spacing-22 | 22px | 1.375rem |
| spacing-32 | 32px | 2rem |
| spacing-38 | 38px | 2.375rem |
| spacing-54 | 54px | 3.375rem |
| spacing-63 | 63px | 3.9375rem |
| spacing-78 | 78px | 4.875rem |
| spacing-116 | 116px | 7.25rem |
| spacing-156 | 156px | 9.75rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| xs | 2px | 1 |
| md | 6px | 2 |

## Box Shadows

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
```

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px;
```

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
```

**xs** — blur: 2px
```css
box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
```

**sm** — blur: 5px
```css
box-shadow: rgb(128, 128, 128) 0px 0px 5px 0px;
```

## CSS Custom Properties

### Colors

```css
--highchart-color-orange: #fd7e14;
--tw-ring-shadow: 0 0 #0000;
--color-outline: oklch(86.9% .022 252.894);
--color-highlight: #fff2cc;
--color-success-container: oklch(96.2% .044 156.743);
--color-outline-variant: #e8edf3;
--color-inverse-primary: #b3ccff;
--color-stone-400: oklch(70.9% .01 56.259);
--tw-inset-ring-shadow: 0 0 #0000;
--color-on-surface-variant: oklch(44.6% .043 257.281);
--percentage-color-76-90: #4ead1f;
--semantic-group-color-7: #a65628;
--color-checkbox-switch: oklch(86.9% .022 252.894);
--color-surface-container: #ebf0f5;
--highchart-color-purple: #a855f7;
--color-surface-container-high: #e6eaef;
--color-stone-950: oklch(14.7% .004 49.25);
--tw-ring-offset-color: #fff;
--semantic-group-color-3: #4daf4a;
--color-primary-container: #dee8fc;
--color-white: #fff;
--percentage-color-91-99: #1da51d;
--highchart-color-pink: #ec4899;
--color-primary-hover: #3f76e4;
--color-warning-container: oklch(96.2% .059 95.617);
--color-surface-container-highest: #e2e5e9;
--tw-ring-offset-width: 0px;
--color-on-danger: #fff;
--color-inverse-surface: oklch(31% .044 257.287);
--semantic-group-color-5: #ff7f00;
--percentage-color-0-15: #d92626;
--color-danger: oklch(50.5% .213 27.518);
--color-on-primary: #fff;
--percentage-color-46-60: #bfbf22;
--color-inverse-on-surface-variant: oklch(70.4% .04 256.788);
--tw-ring-offset-shadow: 0 0 #0000;
--highchart-color-gray: oklch(55.4% .046 257.417);
--color-on-success: #fff;
--semantic-group-color-6: #ff3;
--color-on-danger-container: oklch(44.4% .177 26.899);
--color-surface-container-low: #f4f7fa;
--color-stone-100: oklch(97% .001 106.424);
--color-on-warning-container: oklch(47.3% .137 46.201);
--percentage-color-61-75: #84b620;
--color-on-content-grade: #fff;
--color-stone-500: oklch(55.3% .013 58.071);
--color-inverse-on-surface: oklch(96.8% .007 247.896);
--highchart-color-blue: #356ad4;
--color-scrim: #000;
--color-success: oklch(52.7% .154 150.069);
--highchart-color-green: #22c55e;
--semantic-group-color-1: #e41a1c;
--percentage-color-31-45: #c79123;
--color-danger-hover: oklch(57.7% .245 27.325);
--semantic-group-color-4: #984ea3;
--color-surface: oklch(98.4% .003 247.858);
--color-on-primary-container: #2952a3;
--color-on-surface: oklch(12.9% .042 264.695);
--tw-border-style: solid;
--percentage-color-16-30: #d05e25;
--color-danger-container: oklch(93.6% .032 17.717);
--semantic-group-color-2: #377eb8;
--semantic-group-color-8: #f781bf;
--color-primary: #356ad4;
--color-stone-150: oklch(95.23% .0029 84.56);
--color-on-success-container: oklch(44.8% .119 151.328);
--percentage-color-100: #1da51d;
--color-danger-container-hover: oklch(88.5% .062 18.334);
--color-stone-800: oklch(26.8% .007 34.298);
--color-surface-container-lowest: #fff;
--color-inverse-success: oklch(79.2% .209 151.711);
--color-stone-300: oklch(86.9% .005 56.366);
--color-stone-50: oklch(98.5% .001 106.423);
```

### Spacing

```css
--spacing-f-3-4: clamp(1.3125rem, .8604rem + 1.9289vw, 2.5rem);
--spacing-f-8-9: clamp(6.5625rem, 5.2538rem + 5.5838vw, 10rem);
--form-elements-base-size: calc(1em - .5rem);
--spacing-f-6: clamp(3.5rem, 3.3096rem + .8122vw, 4rem);
--spacing-f-3: clamp(1.3125rem, 1.2411rem + .3046vw, 1.5rem);
--spacing-f-1: clamp(.4375rem, .4137rem + .1015vw, .5rem);
--spacing-f-2-3: clamp(.875rem, .6371rem + 1.0152vw, 1.5rem);
--spacing-f-2: clamp(.875rem, .8274rem + .203vw, 1rem);
--spacing-f-6-7: clamp(3.5rem, 2.9289rem + 2.4365vw, 5rem);
--spacing-f-1-2: clamp(.4375rem, .2234rem + .9137vw, 1rem);
--spacing-f-9: clamp(8.75rem, 8.2741rem + 2.0305vw, 10rem);
--spacing-f-8: clamp(6.5625rem, 6.2056rem + 1.5228vw, 7.5rem);
--spacing: .25rem;
--spacing-f-4: clamp(2.1875rem, 2.0685rem + .5076vw, 2.5rem);
--spacing-f-7: clamp(4.375rem, 4.1371rem + 1.0152vw, 5rem);
--spacing-f-4-5: clamp(2.1875rem, 1.6878rem + 2.132vw, 3.5rem);
--tw-space-y-reverse: 0;
--spacing-f-5: clamp(3.0625rem, 2.8959rem + .7107vw, 3.5rem);
--spacing-f-6-8: clamp(3.5rem, 1.9772rem + 6.4975vw, 7.5rem);
--spacing-f-7-8: clamp(4.375rem, 3.1853rem + 5.0761vw, 7.5rem);
--spacing-f-5-6: clamp(3.0625rem, 2.7056rem + 1.5228vw, 4rem);
```

### Typography

```css
--text-2xl: 1.5rem;
--text-lg: 1.125rem;
--text-base--line-height: calc(1.5 / 1);
--tracking-wider: .05em;
--font-mono: "GT-Pressura-Mono", monospace;
--text-f-8xl: clamp(2.7061rem, 1.5264rem + 5.0333vw, 5.8048rem);
--text-f-4xl: clamp(1.6894rem, 1.2668rem + 1.803vw, 2.7994rem);
--text-lg--line-height: calc(1.75 / 1.125);
--text-f-xs: clamp(.7407rem, .7253rem + .0658vw, .7813rem);
--text-f-3xl: clamp(1.5017rem, 1.1853rem + 1.35vw, 2.3328rem);
--font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
--font-weight-bold: 700;
--text-xs--line-height: calc(1 / .75);
--default-font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
--text-xl: 1.25rem;
--text-f-7xl: clamp(2.4054rem, 1.4796rem + 3.9502vw, 4.8373rem);
--tracking-tighter: -.05em;
--text-f-6xl: clamp(2.1382rem, 1.4175rem + 3.0748vw, 4.0311rem);
--text-2xl--line-height: calc(2 / 1.5);
--text-f-base: clamp(.9375rem, .8661rem + .3046vw, 1.125rem);
--text-xl--line-height: calc(1.75 / 1.25);
--font-weight-semibold: 600;
--text-sm: .875rem;
--text-4xl: 2.25rem;
--text-sm--line-height: calc(1.25 / .875);
--text-3xl--line-height: calc(2.25 / 1.875);
--text-3xl: 1.875rem;
--text-xs: .75rem;
--font-weight-medium: 500;
--font-weight-normal: 400;
--font-serif: "century-old-style-std", serif;
--text-f-sm: clamp(.8333rem, .7937rem + .1692vw, .9375rem);
--leading-marketing-heading: 1.2;
--text-f-lg: clamp(1.0547rem, .9423rem + .4797vw, 1.35rem);
--text-4xl--line-height: calc(2.5 / 2.25);
--text-f-5xl: clamp(1.9006rem, 1.3453rem + 2.3694vw, 3.3592rem);
--text-base: 1rem;
--text-f-2xl: clamp(1.3348rem, 1.1029rem + .9895vw, 1.944rem);
--default-mono-font-family: "GT-Pressura-Mono", monospace;
--text-f-xl: clamp(1.1865rem, 1.0215rem + .7041vw, 1.62rem);
```

### Shadows

```css
--tw-inset-shadow-alpha: 100%;
--shadow-xs: 0 1px 2px 0 #0000000d;
--tw-drop-shadow-alpha: 100%;
--shadow-none: 0 0 #0000;
--tw-inset-shadow: 0 0 #0000;
--tw-shadow-alpha: 100%;
--shadow-sm: 0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a;
--shadow-lg: 0 10px 15px -3px #0000001a, 0 4px 6px -4px #0000001a;
--tw-shadow: 0 0 #0000;
```

### Radii

```css
--radius-sm: .25rem;
--radius-md: .375rem;
--radius-lg: .5rem;
--radius-xs: .125rem;
```

### Other

```css
--container-md: 28rem;
--topnav-height: 56px;
--tw-outline-style: solid;
--ease-in: cubic-bezier(.4, 0, 1, 1);
--container-stripe-embedded-form-width: calc(412px + 4.5rem);
--container-cs-prose: 75ch;
--z-modal: 15;
--container-sm: 24rem;
--z-announcement: 10;
--z-nav: 5;
--container-lg: 32rem;
--z-alert: 30;
--default-transition-duration: .15s;
--container-xs: 20rem;
--ease-in-out: cubic-bezier(.4, 0, .2, 1);
--svg-icon-height: 1.15em;
--animate-enter-up: enterUp .3s cubic-bezier(0, 0, .2, 1);
--z-tooltip: 25;
--default-transition-timing-function: cubic-bezier(.4, 0, .2, 1);
--container-5xl: 64rem;
--tw-translate-z: 0;
--container-6xl: 72rem;
--container-3xl: 48rem;
--tw-translate-y: 0;
--container-2xs: 18rem;
--ease-out: cubic-bezier(0, 0, .2, 1);
--animate-spin: spin 1s linear infinite;
--container-4xl: 56rem;
--sidenav-width: 220px;
--container-marketing: 85rem;
--z-dropdown: 20;
--container-app: 90rem;
--container-2xl: 42rem;
--tw-translate-x: 0;
--container-3xs: 16rem;
--container-xl: 36rem;
--container-7xl: 80rem;
```

### Semantic

```css
success: [object Object];
warning: [object Object];
error: [object Object];
info: [object Object];
```

## Transitions & Animations

**Durations:** `0.3s`

### Common Transitions

```css
transition: all;
transition: right 0.3s;
```

### Keyframe Animations

**spin**
```css
@keyframes spin {
  100% { transform: rotate(360deg); }
}
```

**enterUp**
```css
@keyframes enterUp {
  0% { opacity: 0; transform: translateY(0.5rem); }
  100% {  }
}
```

**hScroll**
```css
@keyframes hScroll {
  0% { transform: translate(0px); }
  100% { transform: translate(-100%); }
}
```

**loadingBar**
```css
@keyframes loadingBar {
  0% { transform: translate(-100%); }
  100% { transform: translate(250%); }
}
```

**popin**
```css
@keyframes popin {
  0% { opacity: 0; transform: scale(0.85); }
  50% { transform: scale(1); }
  100% { opacity: 1; }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (10 instances)

```css
.button {
  background-color: oklch(0.147 0.004 49.25);
  color: oklch(0.985 0.001 106.423);
  font-size: 21.217px;
  font-weight: 600;
  padding-top: 17.504px;
  padding-right: 31.8254px;
  border-radius: 0px;
}
```

### Cards (2 instances)

```css
.card {
  background-color: oklch(0.936 0.032 17.717);
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  padding-top: 16px;
  padding-right: 16px;
}
```

### Inputs (3 instances)

```css
.input {
  background-color: oklch(0.985 0.001 106.423);
  color: oklch(0.147 0.004 49.25);
  border-color: oklch(0.147 0.004 49.25);
  border-radius: 0px;
  font-size: 17.7565px;
  padding-top: 8px;
  padding-right: 40px;
}
```

### Links (32 instances)

```css
.link {
  color: oklch(0.985 0.001 106.423);
  font-size: 17.7565px;
  font-weight: 500;
}
```

### Navigation (2 instances)

```css
.navigatio {
  color: oklch(0.147 0.004 49.25);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
}
```

### Footer (1 instances)

```css
.foote {
  background-color: oklch(0.147 0.004 49.25);
  color: oklch(0.985 0.001 106.423);
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 16px;
}
```

### Dropdowns (1 instances)

```css
.dropdown {
  background-color: oklch(0.985 0.001 106.423);
  border-radius: 0px;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  border-color: oklch(0.147 0.004 49.25);
  padding-top: 0px;
}
```

### Tables (1 instances)

```css
.table {
  border-color: oklch(0.147 0.004 49.25);
  cell-style: [object Object];
}
```

### Tooltips (1 instances)

```css
.tooltip {
  color: oklch(0.147 0.004 49.25);
  font-size: 12px;
  border-radius: 0px;
  padding-top: 0px;
  padding-right: 0px;
}
```

## Layout System

**5 grid containers** and **73 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 1360px | 38.4563px |
| 100% | 0px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 3-column | 2x |
| 1-column | 2x |
| 2-column | 1x |

### Grid Templates

```css
grid-template-columns: 562.516px 562.531px;
gap: 78.0496px;
grid-template-columns: 359.172px 359.172px 359.188px;
gap: 62.7814px;
grid-template-columns: 236px 236.016px 236.016px;
gap: 55.4314px normal;
grid-template-columns: 105px;
grid-template-columns: 86px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| column/nowrap | 43x |
| row/nowrap | 23x |
| row/wrap | 7x |

**Gap values:** `15.8368px`, `15.8368px 78.0496px`, `155.533px`, `16px`, `23.1882px`, `23.7565px`, `2px`, `38.4563px`, `4px`, `54.2944px`, `55.4314px`, `55.4314px normal`, `62.7814px`, `7.9184px`, `78.0496px`, `79.1882px`, `8px`

## Responsive Design

### Viewport Snapshots

| Viewport | Body Font | Nav Visible | Max Columns | Hamburger | Page Height |
|----------|-----------|-------------|-------------|-----------|-------------|
| mobile (375px) | 16px | No | 1 | No | 7069px |
| tablet (768px) | 16px | No | 3 | No | 5923px |
| desktop (1280px) | 16px | Yes | 3 | No | 5053px |
| wide (1920px) | 16px | Yes | 3 | No | 5139px |

### Breakpoint Changes

**375px → 768px** (mobile → tablet):
- H1 size: `38.4869px` → `54.0111px`
- Max grid columns: `1` → `3`
- Page height: `7069px` → `5923px`

**768px → 1280px** (tablet → desktop):
- H1 size: `54.0111px` → `74.2362px`
- Nav visibility: `hidden` → `visible`
- Page height: `5923px` → `5053px`

**1280px → 1920px** (desktop → wide):
- H1 size: `74.2362px` → `77.3968px`

## Interaction States

### Button States

**"Product"**
```css
/* Hover */
background-color: rgba(0, 0, 0, 0) → oklch(0.9523 0.0029 84.56);
```
```css
/* Focus */
background-color: rgba(0, 0, 0, 0) → oklch(0.9523 0.0029 84.56);
outline: oklch(0.147 0.004 49.25) none 3px → oklch(0.147 0.004 49.25) solid 2px;
```

**"Sign in"**
```css
/* Hover */
background-color: oklch(0.985 0.001 106.423) → rgb(255, 255, 255);
```
```css
/* Focus */
background-color: oklch(0.985 0.001 106.423) → rgb(255, 255, 255);
outline: oklch(0.147 0.004 49.25) none 3px → oklch(0.147 0.004 49.25) solid 2px;
```

**"Start now"**
```css
/* Hover */
background-color: oklch(0.147 0.004 49.25) → oklch(0.268 0.007 34.298);
```
```css
/* Focus */
background-color: oklch(0.147 0.004 49.25) → oklch(0.268 0.007 34.298);
outline: oklch(0.985 0.001 106.423) none 3px → oklch(0.147 0.004 49.25) solid 2px;
```

### Link Hover

```css
text-decoration: none → underline;
```

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 17 passing, 0 failing color pairs

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#010101` | `#f4f4f2` | 18.95:1 | AAA |
| `#f4f4f2` | `#010101` | 18.95:1 | AAA |
| `#580101` | `#ffc2c2` | 9.68:1 | AAA |
| `#e0e9f2` | `#040810` | 16.33:1 | AAA |

## Design System Score

**Overall: 92/100 (Grade: A)**

| Category | Score |
|----------|-------|
| Color Discipline | 100/100 |
| Typography Consistency | 70/100 |
| Spacing System | 100/100 |
| Shadow Consistency | 75/100 |
| Border Radius Consistency | 100/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Tight, disciplined color palette, Well-defined spacing scale, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 11 distinct font sizes — consider a tighter type scale

## Z-Index Map

**3 unique z-index values** across 1 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| sticky | 20,30 | div.a.b.s.o.l.u.t.e. .z.-.(.-.-.z.-.d.r.o.p.d.o.w.n.). .b.g.-.s.t.o.n.e.-.5.0. .b.o.r.d.e.r. .s.h.a.d.o.w.-.l.g. .a.n.i.m.a.t.e.-.[.p.o.p.i.n._...1.5.s._.e.a.s.e.-.o.u.t.], div.a.b.s.o.l.u.t.e. .z.-.(.-.-.z.-.t.o.o.l.t.i.p.). .t.e.x.t.-.x.s. .a.n.i.m.a.t.e.-.e.n.t.e.r.-.u.p, div.z.-.(.-.-.z.-.a.l.e.r.t.). .w.-.f.u.l.l. .f.l.e.x. .j.u.s.t.i.f.y.-.c.e.n.t.e.r. .h.i.d.d.e.n. .f.i.x.e.d. .t.o.p.-.1.2 |

## SVG Icons

**2 unique SVG icons** detected. Dominant style: **outlined**.

| Size Class | Count |
|------------|-------|
| sm | 1 |
| xl | 1 |

**Icon colors:** `currentColor`, `rgb(0, 0, 0)`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| GT-Pressura-Mono | self-hosted | 400, 500, 600 | normal |
| century-old-style-std | self-hosted | 400, 700 | normal, italic |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 14 | objectFit: fill, borderRadius: 0px, shape: square |

**Aspect ratios:** 4.77:1 (2x), 6.77:1 (2x), 4.13:1 (2x), 3.5:1 (2x), 5.27:1 (2x), 4.6:1 (2x), 2.67:1 (2x)

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `GT-Pressura-Mono` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
