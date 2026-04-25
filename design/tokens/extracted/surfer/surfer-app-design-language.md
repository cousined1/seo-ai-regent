# Design Language: Log in to Surfer

> Extracted from `https://app.surferseo.com` on April 16, 2026
> 188 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#000000` | hsl(0, 0%, 0%) | 221 |
| `#18181b` | hsl(240, 6%, 10%) | 98 |
| `#ffffff` | hsl(0, 0%, 100%) | 40 |
| `#3f3f47` | hsl(240, 6%, 26%) | 9 |
| `#9f9fa9` | hsl(240, 5%, 64%) | 8 |
| `#e4e4e7` | hsl(240, 6%, 90%) | 6 |
| `#71717b` | hsl(240, 4%, 46%) | 2 |
| `#d4d4d8` | hsl(240, 5%, 84%) | 2 |
| `#2f2f34` | hsl(240, 5%, 19%) | 1 |
| `#f4f4f5` | hsl(240, 5%, 96%) | 1 |
| `#c1c1c1` | hsl(0, 0%, 76%) | 1 |
| `#cccccc` | hsl(0, 0%, 80%) | 1 |

### Background Colors

Used on large-area elements: `#ffffff`, `#000000`, `#f4f4f5`

### Text Colors

Text color palette: `#000000`, `#18181b`, `#3f3f47`, `#ffffff`, `#71717b`, `#9f9fa9`, `#e4e4e7`

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#000000` | text, border, background | 221 |
| `#18181b` | text, border, background | 98 |
| `#ffffff` | background, text, border | 40 |
| `#3f3f47` | text, border | 9 |
| `#9f9fa9` | text, border | 8 |
| `#e4e4e7` | text, background, border | 6 |
| `#71717b` | text, border | 2 |
| `#d4d4d8` | border | 2 |
| `#2f2f34` | border | 1 |
| `#f4f4f5` | background | 1 |
| `#c1c1c1` | border | 1 |
| `#cccccc` | border | 1 |

## Typography

### Font Families

- **Inter** — used for all (188 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 60px | 3.75rem | 600 | 60px | -1.2px | h1 |
| 16px | 1rem | 400 | normal | normal | html, head, meta, link |
| 14px | 0.875rem | 400 | 20px | normal | body, noscript, div, ol |
| 13.3333px | 0.8333rem | 400 | normal | normal | textarea |

### Heading Scale

```css
h1 { font-size: 60px; font-weight: 600; line-height: 60px; }
```

### Body Text

```css
body { font-size: 16px; font-weight: 400; line-height: normal; }
```

### Font Weights in Use

`400` (158x), `600` (27x), `500` (3x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-1 | 1px | 0.0625rem |
| spacing-16 | 16px | 1rem |
| spacing-24 | 24px | 1.5rem |
| spacing-32 | 32px | 2rem |
| spacing-40 | 40px | 2.5rem |
| spacing-64 | 64px | 4rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| xs | 2px | 1 |
| md | 8px | 5 |
| lg | 16px | 1 |

## Box Shadows

**xs** — blur: 2px
```css
box-shadow: rgba(26, 29, 40, 0.06) 0px 1px 2px 0px;
```

**sm** — blur: 5px
```css
box-shadow: rgb(128, 128, 128) 0px 0px 5px 0px;
```

## CSS Custom Properties

### Colors

```css
--tw-ring-shadow: 0 0 #0000;
--tw-border-spacing-x: 0;
--primary-light: #8F69FC;
--tw-ring-color: #3b82f680;
--font-family-primary: "Inter",sans-serif;
--tw-ring-offset-color: #fff;
--tw-ring-offset-width: 0px;
--tw-shadow-colored: 0 0 #0000;
--tw-ring-offset-shadow: 0 0 #0000;
--secondary-light: #52525C;
--tw-ring-inset: ;
--gradient-primary: linear-gradient(79.47deg,#FF4087 0%,#FFC056 100%);
--tw-border-spacing-y: 0;
--primary: #783AFB;
--secondary: #3F3F47;
```

### Spacing

```css
--spacer-2xl: 2.5rem;
--spacer-base: 1rem;
--spacer-xs: .375rem;
--spacer-sm: 0.5rem;
--spacer-md: 0.75rem;
--spacer-3xl: 3rem;
--spacer-3xs: 0.125rem;
--spacer-0: 0;
--spacer-2xs: 0.25rem;
--spacer-5xl: 8rem;
--tw-numeric-spacing: ;
--spacer-xl: 2rem;
--tw-contain-size: ;
--spacer-lg: 1.5rem;
--spacer-4xl: 4rem;
```

### Typography

```css
--font-base: 1rem;
--font-extrabold: 800;
--font-black: 900;
--font-bold: 700;
--font-xs: .6875rem;
--font-lg: 1.25rem;
--font-sm: .8125rem;
--font-xl: 1.5rem;
--font-3xl: 2.5rem;
--font-medium: 500;
--font-5xl: 3.75rem;
--font-4xl: 3rem;
--font-md: .875rem;
--font-semibold: 600;
--font-regular: 400;
--font-2xl: 2rem;
```

### Shadows

```css
--shadow-xs: 0px 1px 2px 0px rgba(26,29,40,0.06);
--shadow-md: 0px 8px 16px 0px rgba(24,26,34,0.04),0px 2px 8px 0px rgba(24,26,34,0.02),0px 1px 2px 0px rgba(24,26,34,0.06);
--shadow-sm: 0px 4px 4px 0px rgba(24,26,34,0.02),0px 1px 2px 0px rgba(24,26,34,0.08),0px -1px 1px 0px rgba(0,0,0,0.02);
--shadow-lg: 0px 8px 16px 0px rgba(24,26,34,0.12),0px 2px 4px 0px rgba(24,26,34,0.04),0px 1px 2px 0px rgba(0,0,0,0.08);
--tw-drop-shadow: ;
--shadow-xl: 0px 16px 32px 0px rgba(24,26,34,0.32),0px 2px 4px 0px rgba(24,26,34,0.16),0px 4px 4px 0px rgba(0,0,0,0.08),0px 1px 1px 0px rgba(0,0,0,0.04);
--tw-shadow: 0 0 #0000;
```

### Radii

```css
--radius-2xs: 2px;
--radius-sm: 6px;
--radius-base: 16px;
--radius-md: 8px;
--radius-lg: 24px;
--radius-full: 100px;
--radius-xs: 4px;
```

### Other

```css
--tw-backdrop-sepia: ;
--green-160: #020D02;
--red-60: #FF6F77;
--tw-sepia: ;
--tw-ordinal: ;
--info-light: #51A2FF;
--tw-contain-style: ;
--green-60: #1AB25E;
--success: #169345;
--tw-backdrop-invert: ;
--orange-60: #ff907c;
--purple-40: #AA93FD;
--blue-5: #EFF6FF;
--purple-60: #8F69FC;
--blue-100: #1447E6;
--green-70: #169345;
--danger-light: #FF6F77;
--tw-backdrop-grayscale: ;
--tw-hue-rotate: ;
--red-160: #310003;
--tw-pan-y: ;
--red-80: #D70028;
--gray-140: #18181B;
--white-40: rgba(255,255,255,0.4);
--yellow-10: #FFDFA3;
--orange-80: #de3000;
--purple-160: #0A0418;
--orange-10: #ffe4d0;
--warning: #D27D0A;
--tw-rotate: 0;
--yellow-40: #F5B338;
--orange-100: #a92200;
--green-140: #051F08;
--gray-20: #E4E4E7;
--brand-orange-light: #fff3e6;
--red-20: #FFBBBD;
--white-120: rgba(255,255,255,0.8);
--white-5: rgba(255,255,255,0.1);
--bf-red: #FF1A51;
--red-120: #710010;
--white-140: rgba(255,255,255,0.9);
--purple-120: #360483;
--brand-orange-dark: #120705;
--black: rgba(0,0,0,1);
--purple-70: #783AFB;
--blue-20: #BEDBFF;
--danger: #FF3347;
--yellow-100: #7D4002;
--green-120: #083A11;
--orange-40: #ffb8a2;
--gray-100: #3F3F47;
--tw-gradient-via-position: ;
--orange-160: #120705;
--purple-10: #E1DBFE;
--tw-saturate: ;
--tw-scroll-snap-strictness: proximity;
--blue-80: #155DFC;
--white-80: rgba(255,255,255,0.6);
--red-100: #A4001C;
--green-100: #0D5920;
--yellow-70: #D27D0A;
--green-base: #169345;
--tw-grayscale: ;
--tw-backdrop-hue-rotate: ;
--blue-160: #162456;
--blue-140: #1C398E;
--red-base: #FF3347;
--blue-60: #51A2FF;
--tw-numeric-fraction: ;
--red-70: #FF3347;
--white-10: rgba(255,255,255,0.2);
--tw-gradient-to-position: ;
--brand-orange: #ff5b49;
--gray-160: #09090B;
--tw-skew-y: 0;
--gray-10: #F4F4F5;
--tw-slashed-zero: ;
--white-70: rgba(255,255,255,0.55);
--tw-backdrop-opacity: ;
--red-140: #450006;
--tw-gradient-from-position: ;
--opacity-80: 0.8;
--tw-pinch-zoom: ;
--tw-contain-paint: ;
--red-10: #FFDDDF;
--opacity-20: 0.24;
--blue-base: #2B7FFF;
--green-5: #E0FAE5;
--tw-backdrop-saturate: ;
--purple-20: #C5B8FE;
--yellow-60: #EFA00D;
--opacity-90: 0.88;
--orange-70: #ff5b49;
--yellow-base: #D27D0A;
--blue-10: #DBEAFE;
--brand-violet: #783AFB;
--red-40: #FF9A9E;
--white-100: rgba(255,255,255,0.7);
--warning-light: #EFA00D;
--blue-120: #193CB8;
--tw-brightness: ;
--tooltip-background: #18181B;
--red-5: #FFF0F1;
--tw-scale-y: 1;
--opacity-60: 0.64;
--tw-backdrop-contrast: ;
--purple-base: #783AFB;
--orange-120: #721400;
--tw-backdrop-brightness: ;
--blue-40: #8EC5FF;
--tw-pan-x: ;
--tw-translate-y: 0;
--orange-base: #ff5b49;
--gray-5: #F8F8F9;
--gray-60: #9F9FA9;
--info: #2B7FFF;
--green-20: #7AEB9D;
--orange-5: #fff3e6;
--yellow-20: #FFCB6B;
--tw-contrast: ;
--gray-80: #52525C;
--gray-base: #18181B;
--gray-120: #2F2F34;
--yellow-140: #321500;
--tw-skew-x: 0;
--blue-70: #2B7FFF;
--orange-20: #ffccb6;
--white-160: #fff;
--yellow-120: #562401;
--gray-70: #71717B;
--tw-backdrop-blur: ;
--white-base: #fff;
--tw-translate-x: 0;
--brand-violet-dark: #0A0418;
--brand-violet-light: #F1EBFE;
--purple-100: #4D08B5;
--yellow-160: #210E00;
--success-light: #1AB25E;
--green-40: #37E278;
--gray-40: #D4D4D8;
--white-60: rgba(255,255,255,0.5);
--tw-scale-x: 1;
--green-10: #BCF5CA;
--yellow-80: #A65B05;
--orange-140: #440800;
--purple-5: #F1EBFE;
--tw-blur: ;
--tw-invert: ;
--purple-80: #630DE3;
--green-80: #137832;
--purple-140: #200255;
--bf-purple: #7814F7;
--yellow-5: #FFF7EA;
--tw-numeric-figure: ;
--opacity-50: 0.48;
--tw-contain-layout: ;
--white-20: rgba(255,255,255,0.3);
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
| 400px | 400px | max-width |
| sm | 600px | max-width |
| sm | 640px | min-width |
| md | 768px | min-width |
| 840px | 840px | min-width |
| lg | 1024px | min-width |
| xl | 1280px | min-width |
| 1410px | 1410px | min-width |
| 2xl | 1536px | min-width |

## Transitions & Animations

**Easing functions:** `[object Object]`, `[object Object]`, `[object Object]`

**Durations:** `0.15s`, `0.3s`, `0.25s`, `0.2s`, `0s`

### Common Transitions

```css
transition: all;
transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), fill 0.15s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.15s cubic-bezier(0.4, 0, 0.2, 1);
transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
transition: right 0.3s;
transition: border-color 0.25s, box-shadow 0.25s, outline-color 0.2s ease-in-out;
transition: visibility 0s linear 0.3s, opacity 0.3s linear;
```

### Keyframe Animations

**growOut**
```css
@keyframes growOut {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
```

**ping**
```css
@keyframes ping {
  75%, 100% { opacity: 0; transform: scale(2); }
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
  100% { content: var(--tw-content); transform: rotate(360deg); }
}
```

**accordionSlideUp**
```css
@keyframes accordionSlideUp {
  0% { height: var(--radix-accordion-content-height); }
  100% { height: 0px; }
}
```

**fadeOut**
```css
@keyframes fadeOut {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
```

**slideDownOut**
```css
@keyframes slideDownOut {
  0% { transform: translateY(0px); }
  100% { transform: translateY(100%); }
}
```

**slideOut**
```css
@keyframes slideOut {
  0% { transform: translate(0px); }
  100% { transform: translate(100%); }
}
```

**collapsibleSlideUp**
```css
@keyframes collapsibleSlideUp {
  0% { height: var(--radix-collapsible-content-height); }
  100% { height: 0px; }
}
```

**accordionSlideDown**
```css
@keyframes accordionSlideDown {
  0% { height: 0px; }
  100% { height: var(--radix-accordion-content-height); }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (3 instances)

```css
.button {
  background-color: rgb(24, 24, 27);
  color: rgb(255, 255, 255);
  font-size: 16px;
  font-weight: 600;
  padding-top: 8px;
  padding-right: 24px;
  border-radius: 8px;
}
```

### Inputs (3 instances)

```css
.input {
  background-color: rgb(255, 255, 255);
  color: rgb(24, 24, 27);
  border-color: rgb(212, 212, 216);
  border-radius: 8px;
  font-size: 14px;
  padding-top: 1px;
  padding-right: 12px;
}
```

### Links (4 instances)

```css
.link {
  color: rgb(24, 24, 27);
  font-size: 14px;
  font-weight: 600;
}
```

## Layout System

**0 grid containers** and **28 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 1920px | 24px |
| 600px | 0px |
| 480px | 32px |

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| column/nowrap | 12x |
| row/nowrap | 16x |

**Gap values:** `12px`, `16px`, `2px`, `4px`, `6px`, `8px`

## Responsive Design

### Viewport Snapshots

| Viewport | Body Font | Nav Visible | Max Columns | Hamburger | Page Height |
|----------|-----------|-------------|-------------|-----------|-------------|
| mobile (375px) | 14px | No | 0 | No | 812px |
| tablet (768px) | 14px | No | 0 | No | 1024px |
| desktop (1280px) | 14px | No | 0 | No | 800px |
| wide (1920px) | 14px | No | 0 | No | 1080px |

### Breakpoint Changes

**375px → 768px** (mobile → tablet):
- H1 size: `24px` → `60px`
- Page height: `812px` → `1024px`

**768px → 1280px** (tablet → desktop):
- Page height: `1024px` → `800px`

**1280px → 1920px** (desktop → wide):
- Page height: `800px` → `1080px`

## Interaction States

### Button States

**"Continue with Google"**
```css
/* Hover */
background-color: rgb(24, 24, 27) → rgb(117, 57, 244);
```
```css
/* Focus */
background-color: rgb(24, 24, 27) → rgb(120, 58, 251);
outline: rgba(0, 0, 0, 0) solid 2px → rgb(170, 147, 253) auto 2px;
```

**""**
```css
/* Hover */
color: rgb(24, 24, 27) → rgb(45, 45, 50);
border-color: rgb(24, 24, 27) → rgb(45, 45, 50);
```
```css
/* Focus */
color: rgb(24, 24, 27) → rgb(47, 47, 52);
border-color: rgb(24, 24, 27) → rgb(47, 47, 52);
outline: rgba(0, 0, 0, 0) solid 2px → rgb(170, 147, 253) auto 2px;
```

**"Continue with Email"**
```css
/* Hover */
background-color: rgb(24, 24, 27) → rgb(117, 57, 244);
```
```css
/* Focus */
background-color: rgb(24, 24, 27) → rgb(120, 58, 251);
outline: rgba(0, 0, 0, 0) solid 2px → rgb(170, 147, 253) auto 2px;
```

### Link Hover

```css
background-color: rgb(24, 24, 27) → rgb(112, 55, 233);
```

### Input Focus

```css
border-color: rgb(212, 212, 216) → rgb(123, 123, 131);
outline: rgba(0, 0, 0, 0) solid 2px → rgba(170, 147, 253, 0.498) solid 2px;
```

## Accessibility (WCAG 2.1)

**Overall Score: 83%** — 10 passing, 2 failing color pairs

### Failing Color Pairs

| Foreground | Background | Ratio | Level | Used On |
|------------|------------|-------|-------|---------|
| `#18181b` | `#000000` | 1.19:1 | FAIL | div (1x) |
| `#3f3f47` | `#000000` | 2.01:1 | FAIL | div (1x) |

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#18181b` | `#ffffff` | 17.72:1 | AAA |
| `#ffffff` | `#18181b` | 17.72:1 | AAA |
| `#18181b` | `#f4f4f5` | 16.12:1 | AAA |
| `#000000` | `#ffffff` | 21:1 | AAA |

## Design System Score

**Overall: 91/100 (Grade: A)**

| Category | Score |
|----------|-------|
| Color Discipline | 70/100 |
| Typography Consistency | 100/100 |
| Spacing System | 100/100 |
| Shadow Consistency | 100/100 |
| Border Radius Consistency | 100/100 |
| Accessibility | 83/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Consistent typography system, Well-defined spacing scale, Clean elevation system, Consistent border radii, Good CSS variable tokenization

**Issues:**
- No clear primary brand color detected
- 2 WCAG contrast failures

## Z-Index Map

**4 unique z-index values** across 3 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| modal | 1000,2000000000 | ol.t.o.p.-.b.a.s.e. .r.i.g.h.t.-.b.a.s.e. .f.i.x.e.d. .z.-.[.1.0.0.0.]. .m.-.0. .f.l.e.x. .w.-.[.2.2...5.r.e.m.]. .m.a.x.-.w.-.[.1.0.0.v.w.]. .f.l.e.x.-.c.o.l. .o.u.t.l.i.n.e.-.n.o.n.e, div, div |
| dropdown | 100,100 | div.g.a.p.-.m.d. .t.e.x.t.-.m.d. .t.o.p.-.0. .z.-.[.1.0.0.]. .m.i.n.-.h.-.[.5.6.p.x.]. .i.t.e.m.s.-.c.e.n.t.e.r. .j.u.s.t.i.f.y.-.b.e.t.w.e.e.n. .f.o.n.t.-.s.e.m.i.b.o.l.d. .t.e.x.t.-.g.r.a.y.-.1.0.0. .s.t.i.c.k.y. .b.o.r.d.e.r.-.g.r.a.y.-.1.2.0. .p.-.l.g. .m.x.-.a.u.t.o. .h.i.d.d.e.n. .w.-.f.u.l.l. .b.o.r.d.e.r.-.b. .b.g.-.b.l.a.c.k. .s.m.:.b.l.o.c.k |
| base | 1,1 | div.g.r.e.c.a.p.t.c.h.a.-.b.a.d.g.e |

**Issues:**
- [object Object]

## SVG Icons

**3 unique SVG icons** detected. Dominant style: **filled**.

| Size Class | Count |
|------------|-------|
| md | 3 |

**Icon colors:** `#4285F4`, `#34A853`, `#FBBC04`, `#EA4335`, `white`, `currentColor`, `rgb(0, 0, 0)`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| Inter | self-hosted | 400, 500, 600, 700 | normal |
| Thunder | self-hosted | 600 | normal |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 1 | objectFit: fill, borderRadius: 0px, shape: square |

**Aspect ratios:** 5.47:1 (1x)

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Inter` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
