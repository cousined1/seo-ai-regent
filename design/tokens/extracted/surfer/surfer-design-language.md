# Design Language: Surfer: SEO Content Optimization Platform

> Extracted from `https://surferseo.com` on April 16, 2026
> 2837 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#ff5b49` | rgb(255, 91, 73) | hsl(6, 100%, 64%) | 139 |
| Secondary | `#783afb` | rgb(120, 58, 251) | hsl(259, 96%, 61%) | 13 |
| Accent | `#ff5b49` | rgb(255, 91, 73) | hsl(6, 100%, 64%) | 139 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#ffffff` | hsl(0, 0%, 100%) | 2703 |
| `#000000` | hsl(0, 0%, 0%) | 1447 |
| `#f4f4f5` | hsl(240, 5%, 96%) | 1111 |
| `#dddddd` | hsl(0, 0%, 87%) | 474 |
| `#2f2f34` | hsl(240, 5%, 19%) | 72 |
| `#18181b` | hsl(240, 6%, 10%) | 31 |
| `#444444` | hsl(0, 0%, 27%) | 16 |
| `#09090b` | hsl(240, 10%, 4%) | 7 |
| `#999999` | hsl(0, 0%, 60%) | 5 |
| `#666666` | hsl(0, 0%, 40%) | 4 |
| `#71717b` | hsl(240, 4%, 46%) | 2 |
| `#9f9fa9` | hsl(240, 5%, 64%) | 2 |

### Background Colors

Used on large-area elements: `#000000`, `#ffffff`, `#783afb`, `#09090b`, `#201e24`, `#0c0a10`, `#ff5b49`, `#f4f4f5`

### Text Colors

Text color palette: `#000000`, `#ffffff`, `#71717b`, `#ff5b49`, `#9f9fa9`, `#666666`, `#eeeeee`, `#dddddd`

### Gradients

```css
background-image: linear-gradient(rgb(9, 9, 11) 9%, rgba(0, 0, 0, 0.25));
```

```css
background-image: linear-gradient(rgba(0, 0, 0, 0) 50%, rgb(0, 0, 0) 83%);
```

```css
background-image: linear-gradient(90deg, rgb(51, 51, 51), rgb(51, 51, 51) 70%, rgba(51, 51, 51, 0));
```

```css
background-image: linear-gradient(270deg, rgb(51, 51, 51), rgb(51, 51, 51) 70%, rgba(51, 51, 51, 0));
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#ffffff` | text, border, background | 2703 |
| `#000000` | text, border, background | 1447 |
| `#f4f4f5` | border, background, text | 1111 |
| `#dddddd` | text, border | 474 |
| `#ff5b49` | text, border, background | 139 |
| `#2f2f34` | border, background | 72 |
| `#18181b` | border, background | 31 |
| `#444444` | border | 16 |
| `#783afb` | background, border | 13 |
| `#221e28` | border, background | 11 |
| `#09090b` | background | 7 |
| `#999999` | background | 5 |
| `#666666` | text, border | 4 |
| `#71717b` | text, border | 2 |
| `#9f9fa9` | text, border | 2 |
| `#cccccc` | border | 1 |
| `#ff0000` | background | 1 |

## Typography

### Font Families

- **Inter Variable** — used for all (1960 elements)
- **system-ui** — used for body (819 elements)
- **sans-serif** — used for all (58 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 78.3351px | 4.8959rem | 600 | 86.1686px | -1.95838px | h1, br |
| 62.8639px | 3.929rem | 600 | 69.1503px | normal | h2 |
| 41.2826px | 2.5802rem | 600 | 49.5391px | normal | h3 |
| 39.1675px | 2.448rem | 600 | 47.001px | -0.940021px | h2, span, p, h3 |
| 31.334px | 1.9584rem | 600 | 47.001px | normal | p, del |
| 23.5005px | 1.4688rem | 600 | 30.5507px | -0.626681px | divs, div, svg, path |
| 22.3647px | 1.3978rem | 400 | 29.0741px | normal | div, strong, span |
| 22.2472px | 1.3904rem | 600 | 27.8089px | normal | h3 |
| 20px | 1.25rem | 400 | 20px | normal | div |
| 19.5838px | 1.224rem | 400 | 29.3756px | normal | div, strong, span, h3 |
| 18.3937px | 1.1496rem | 400 | 27.5906px | normal | p |
| 18px | 1.125rem | 700 | 60px | normal | strong |
| 17.2337px | 1.0771rem | 600 | 21.5421px | normal | a, div, svg, path |
| 17.0304px | 1.0644rem | 400 | 25.5455px | normal | p, br |
| 17.0213px | 1.0638rem | 500 | 17.0213px | normal | div |

### Heading Scale

```css
h1 { font-size: 78.3351px; font-weight: 600; line-height: 86.1686px; }
h2 { font-size: 62.8639px; font-weight: 600; line-height: 69.1503px; }
h3 { font-size: 41.2826px; font-weight: 600; line-height: 49.5391px; }
h2 { font-size: 39.1675px; font-weight: 600; line-height: 47.001px; }
h4 { font-size: 23.5005px; font-weight: 600; line-height: 30.5507px; }
h3 { font-size: 22.2472px; font-weight: 600; line-height: 27.8089px; }
h3 { font-size: 19.5838px; font-weight: 400; line-height: 29.3756px; }
```

### Body Text

```css
body { font-size: 14px; font-weight: 400; line-height: 20px; }
```

### Font Weights in Use

`400` (2443x), `600` (177x), `500` (173x), `700` (44x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-1 | 1px | 0.0625rem |
| spacing-20 | 20px | 1.25rem |
| spacing-30 | 30px | 1.875rem |
| spacing-35 | 35px | 2.1875rem |
| spacing-40 | 40px | 2.5rem |
| spacing-44 | 44px | 2.75rem |
| spacing-47 | 47px | 2.9375rem |
| spacing-56 | 56px | 3.5rem |
| spacing-62 | 62px | 3.875rem |
| spacing-69 | 69px | 4.3125rem |
| spacing-86 | 86px | 5.375rem |
| spacing-94 | 94px | 5.875rem |
| spacing-125 | 125px | 7.8125rem |
| spacing-196 | 196px | 12.25rem |
| spacing-200 | 200px | 12.5rem |
| spacing-213 | 213px | 13.3125rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| md | 8px | 91 |
| lg | 12px | 70 |
| lg | 16px | 50 |
| xl | 20px | 1 |
| xl | 24px | 2 |
| full | 30px | 1 |
| full | 42px | 2 |
| full | 47px | 1 |
| full | 50px | 22 |
| full | 78px | 37 |
| full | 157px | 8 |
| full | 1567px | 25 |
| full | 9999px | 3 |

## Box Shadows

**xs (inset)** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0.2) 0px -1px 0px 0px inset, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
```

**xs** — blur: 1px
```css
box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 1px 0px, rgba(34, 42, 53, 0.04) 0px 4px 6px 0px, rgba(47, 48, 55, 0.05) 0px 24px 68px 0px, rgba(0, 0, 0, 0.04) 0px 2px 3px 0px;
```

**sm** — blur: 3px
```css
box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 0px 20px 0px;
```

**md** — blur: 10px
```css
box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 10px 0px;
```

**md** — blur: 12px
```css
box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px 0px;
```

**lg** — blur: 20px
```css
box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 20px 0px;
```

## CSS Custom Properties

### Colors

```css
--_swatches---neutral--white-muted: #ffffff80;
--border-width: 1.5px;
--interactions--jobs-image-border<deleted|variable-56c2143d-7011-d3d4-50df-84df765ce951>: 0rem;
--browser-border<deleted|variable-38701af9-9d8a-f1b3-0aac-6de149c0d6ab>: #8080804d;
--_swatches---neutral--muted: var(--_swatches---neutral--currentcolor-50);
--_swatches---neutral--black-muted: #00000080;
--_swatches---neutral--currentcolor-05: rgb(from currentColor r g b/.05);
--_swatches---neutral--currentcolor-15: rgb(from currentColor r g b/.15);
--_swatches---neutral--currentcolor-50: rgb(from currentColor r g b/.5);
--_swatches---neutral--muted-hard: var(--_swatches---neutral--currentcolor-15);
--_themes---text-muted: var(--_swatches---neutral--black-muted);
--_swatches---neutral--currentcolor-100: currentColor;
--shadow-card: 0px 1px 1px 0px rgba(0, 0, 0, 0.05),
      0px 4px 6px 0px rgba(34, 42, 53, 0.04),
      0px 24px 68px 0px rgba(47, 48, 55, 0.05),
      0px 2px 3px 0px rgba(0, 0, 0, 0.04);
--swiper-theme-color: #007aff;
--color-violet: #783AFB;
--color-gray-dark: #0C0A10;
--color-gray-light: #221E28;
```

### Spacing

```css
--size--8rem: 8rem;
--gap--large: var(--size--2-5rem);
--gap--medium: var(--size--1-5rem);
--gap--xsmall: var(--size--0-5rem);
--sizes--size--2<deleted|variable-b7e5dde3-4528-a48f-3010-60b2c376894a>: 2rem;
--gap--main: var(--size--1rem);
--global-padding: var(--size--1-5rem);
--padding-vertical--medium: var(--size--7rem);
--size--6rem: 6rem;
--padding-vertical--small: var(--size--5rem);
--size--0-75rem: 0.75rem;
--padding-vertical--xlarge: var(--size--15rem);
--padding-vertical--large: var(--size--10rem);
--gap--content<deleted|variable-499aaf72-3e03-ffc6-05f8-bb3ce4551e9f>: 6rem;
--size--0-25rem: 0.25rem;
--size--1rem: 1rem;
--sizes--size--0-5<deleted|variable-75798306-d689-f766-6230-334e26c66501>: .5rem;
--size--0-5rem: 0.5rem;
--size--2-5rem: 2.5rem;
--size--2rem: 2rem;
--sizes--size--6<deleted|variable-9e77702f-f85c-c456-f3bb-4db842529bc9>: 6rem;
--sizes--size--3<deleted|variable-554bef42-0528-be1c-4369-c257575c59a7>: 3rem;
--_text-sizes---u-text-sm: .875rem;
--gap--bento<deleted|variable-12997eb7-1a55-08c5-7d41-46519a4ca416>: var(--gap--medium);
--sizes--size--1-5<deleted|variable-bed719b3-1db1-33ab-2dd8-48e922456fb9>: 1.5rem;
--sizes--size--1<deleted|variable-82e910aa-0f3d-f0ce-a8ab-f17d92f8a0c9>: 1rem;
--padding--section-mobile<deleted|variable-e003bddb-333d-5c15-cd2d-b9b8fa15ac8d>: var(--spacing--spacing-2xl\<deleted\|variable-35d1a19d-e7b2-2c61-f2c5-37249eaf2688\>);
--gap--content<deleted|variable-9105031e-7e8e-e534-e965-40482ca50990>: var(--gap--medium);
--padding--section-tablet<deleted|variable-491c7c6f-f7ca-d7fe-27a0-a8e55dbdb5a9>: var(--spacing--spacing-3xl\<deleted\|variable-03e7d6ef-42fd-8b6f-af14-7883d8f39a1a\>);
--spacing--spacing-s<deleted|variable-6eabb4c9-ab1c-ba97-a7b3-ded6eca6f839>: .5rem;
--padding--section-desktop<deleted|variable-eb3a761c-5792-fc68-bf14-9dd5fb281363>: var(--spacing--spacing-4xl\<deleted\|variable-eeaecf89-b143-f0a0-bd55-6048876dbc21\>);
--spacing--spacing-m<deleted|variable-ae79bbe6-2039-50df-9f4b-6a43866ed427>: 1rem;
--sizes--size--0<deleted|variable-cfdf3c83-ac0f-b6bf-fd2c-d11a92084692>: 0rem;
--spacing--spacing-2xl<deleted|variable-35d1a19d-e7b2-2c61-f2c5-37249eaf2688>: 4rem;
--spacing--spacing-l<deleted|variable-76a73833-06cd-4287-272a-1c429d8ec7d2>: 1.5rem;
--size--1-5rem: 1.5rem;
--size--0-125rem: 0.125rem;
--size--4rem: 4rem;
--size--1-25rem: 1.25rem;
--size--5rem: 5rem;
--size--3-5rem: 3.5rem;
--size--4-5rem: 4.5rem;
--size--0rem: 0rem;
--sizes--size--8<deleted|variable-bfa1031a-9b8a-9718-00ac-2ccc7d3d16b6>: 8rem;
--size--12rem: 12rem;
--size--3rem: 3rem;
--gap--xlarge: var(--size--5rem);
--padding-vertical--none: var(--size--0rem);
--letter-spacing--large: -.025em;
--gap--none: var(--size--0rem);
--letter-spacing--medium: -.02em;
--gap--small: var(--size--0-75rem);
--size--15rem: 15rem;
--size--16rem: 16rem;
--size--14rem: 14rem;
--size--7rem: 7rem;
--size--7-5rem: 7.5rem;
--size--9rem: 9rem;
--size--6-5rem: 6.5rem;
--_text-sizes---u-text-md: var(--size--1-25rem);
--size--11rem: 11rem;
--_text-sizes---u-text-main: var(--size--1rem);
--letter-spacing--small: -.015em;
--size--5-5rem: 5.5rem;
--size--9-5rem: 9.5rem;
--_text-sizes---u-text-lg: var(--size--1-5rem);
--size--8-5rem: 8.5rem;
--size--10rem: 10rem;
--size--13rem: 13rem;
--letter-spacing--none: 0px;
--letter-spacing--xsmall: -.01em;
--spacing--spacing-3xl<deleted|variable-03e7d6ef-42fd-8b6f-af14-7883d8f39a1a>: 6rem;
--spacing--spacing-4xl<deleted|variable-eeaecf89-b143-f0a0-bd55-6048876dbc21>: 8rem;
--space--marquee-gap: 1rem;
--space--content: 6rem;
--gleap-margin-top: 50px;
--swiper-navigation-size: 44px;
```

### Typography

```css
--_themes---text: var(--_swatches---neutral--black);
--u-text-lg: 1.5rem;
--u-text-md: 1.25rem;
--u-text-main: 1rem;
--u-text-sm: 0.875rem;
--font-from-0: 12;
--font-to-0: 16;
--font-from-1: 14;
--font-to-1: 16;
--font-from-2: 16;
--font-to-2: 16.5;
--font-from-3: 16.5;
--font-to-3: 17;
```

### Radii

```css
--radius--medium: var(--size--0-75rem);
--radius--section: var(--size--1-5rem);
--radius--main: var(--size--1rem);
--radius--max: 9999px;
--radius--small: var(--size--0-5rem);
--radius--none: var(--size--0rem);
```

### Other

```css
--_swatches---neutral--black: black;
--neutral--pure-white<deleted|variable-f725e072>: white;
--neutral--abyss-black<deleted|variable-2b5e96e3>: black;
--violet--900<deleted|variable-32a9f1f0>: #130425;
--neutral--50<deleted|variable-3c1c15d5>: #f8f9fa;
--_swatches---neutral--white: white;
--violet--50<deleted|variable-031330ea>: #f2e8fe;
--swatches--neutral--black<deleted|variable-ace34eac-d750-3d85-a1e7-f31854945c66>: black;
--neutral--gray-white<deleted|variable-01f711a4-3281-535c-f2e6-8250a6deeb90>: #ebedef;
--neutral--600<deleted|variable-ae13e981>: #888e95;
--brand--sunny-orange<deleted|variable-6024c199-9f3e-9811-2ec9-18fdbc2ac59f>: #ff5b49;
--brand--yellow<deleted|variable-86d5817b>: #ffbd57;
--swatches--neutral--white<deleted|variable-9ff15e8c-beba-7a9e-b4ad-9a8e2b234870>: white;
--swatches--neutral--gray<deleted|variable-9d4dc153-de2a-5cb7-f88f-50837843d7f8>: #71717b;
--swatches--neutral--gray-lighter<deleted|variable-a17c6e7d-c4a6-3b59-c0e5-bc4462841e54>: #f4f4f5;
--neutral--transaprent<deleted|variable-3dce374d-133f-8049-76ce-5f7d5f83321f>: #0000;
--_swatches---neutral--transparent: #0000;
--brand--pink<deleted|variable-7721611a>: #ff4286;
--neutral--400<deleted|variable-8858ea57>: #d0d4da;
--_swatches---neutral--500: #71717b;
--brand--ocean-violet<deleted|variable-6e5c4398-5497-6cfd-8ce2-d7a3abb2998f>: #783afb;
--swatches--brand--violet--main<deleted|variable-f478a591-829e-5353-1e60-988b9a6ffb4c>: #783afb;
--violet--550<deleted|variable-c288b402>: #7814f7;
--violet--400<deleted|variable-ea34c53a>: #9343f9;
--violet--500<deleted|variable-3134fbc4>: #862cf8;
--_layout---max-width-large: 65rem;
--brand--violet<deleted|variable-909db2ba-44a9-daa9-6465-611c14353504>: var(--brand--ocean-violet\<deleted\|variable-6e5c4398-5497-6cfd-8ce2-d7a3abb2998f\>);
--violet--200<deleted|variable-5690b9d2>: #c9a1fc;
--violet--600<deleted|variable-45d19110>: #410290;
--violet--100<deleted|variable-8ddf6a0a>: #e4d0fd;
--_swatches---violet--main: #783afb;
--_swatches---neutral--800: #2f2f34;
--_swatches---neutral--1000: #09090b;
--_layout---max-width-small: 45rem;
--neutral--300<deleted|variable-20637317>: #dfe2e6;
--neutral--pearl-white<deleted|variable-7cf9fdcf-97bb-6ee7-51a3-3fe2d616e13f>: #f8f9fa;
--neutral--800<deleted|variable-d06e6765>: #353a40;
--neutral--200<deleted|variable-8c6b0f15>: #eaecee;
--neutral--artificial-gray<deleted|variable-55f4eb6b-9a33-0030-7c65-0ea077f18e30>: #221e28;
--swatches--neutral--gray-darker<deleted|variable-47463749-5670-d998-1597-82aa8a5b0378>: #09090b;
--neutral--100<deleted|variable-2ac362ac>: #f2f3f5;
--_layout---max-width-medium: 55rem;
--_layout---max-width-xlarge: 75rem;
--swatches--neutral--gray-dark<deleted|variable-9cafcde4-e56f-90f6-3722-5c6533d0f3b7>: #18181b;
--_swatches---neutral--200: #e4e4e7;
--violet--700<deleted|variable-447e8bb3>: #270156;
--swatches--neutral--gray-light<deleted|variable-8c395530-118e-175c-d162-02229e060fe7>: #e4e4e7;
--neutral--artificial-gray-dark<deleted|variable-0623577f-a529-bf04-26db-61577e9999ee>: #0c0a10;
--neutral--500<deleted|variable-e843cb61>: #afb5bc;
--neutral--900<deleted|variable-19ddea64>: #22252a;
--transaprent<deleted|variable-2a50960f-34e9-f79d-3083-932da2a29889>: #0000;
--neutral--700<deleted|variable-f113c88f>: #4a5057;
--_layout---max-width-xsmall: 25rem;
--_swatches---neutral--900: #18181b;
--_themes---background: var(--_swatches---neutral--white);
--navbar-height: var(--size--5-5rem);
--swatches--brand--orange--main<deleted|variable-32e2638c-7c3e-f072-0ffd-0d6118661deb>: #ff5b49;
--_swatches---neutral--100: #f4f4f5;
--_swatches---orange--main: #ff5b49;
--swatches--neutral--transparent<deleted|variable-0b8664a1-62de-ffea-4c45-d39e1436ad7f>: transparent;
--_swatches---neutral--300: #d4d4d8;
--_swatches---neutral--400: #9f9fa9;
--_swatches---neutral--600: #52525c;
--_swatches---neutral--700: #3f3f47;
--_swatches---violet--light: #f1ebfe;
--_swatches---violet--dark: #0a0418;
--_swatches---orange--light: #fff3e6;
--_swatches---orange--dark: #120705;
--u-eyebrow: 1.25rem;
--u-display-3xl: 6rem;
--u-display-2xl: 4.76rem;
--u-display-xl: 3.78rem;
--u-display-lg: 3rem;
--u-display-md: 2.38rem;
--u-display-sm: 1.89rem;
--u-display-xs: 1.5rem;
--brand--sunny-orange: #ff5b49;
--swatches--brand--orange--main: #ff5b49;
--brand--ocean-violet: #783afb;
--swatches--brand--violet--main: #783afb;
--neutral--pure-white: white;
--neutral--pearl-white: #f8f9fa;
--neutral--gray-white: #ebedef;
--neutral--artificial-gray-light: #dac2fb;
--neutral--artificial-gray: #221e28;
--neutral--artificial-gray-dark: #0c0a10;
--neutral--abyss-black: black;
--neutral--transparent: transparent;
--swatches--neutral--transparent: transparent;
--swatches--neutral--white: #ffffff;
--swatches--neutral--gray-lighter: #f4f4f5;
--swatches--neutral--gray-light: #e4e4e7;
--swatches--neutral--gray: #71717b;
--swatches--neutral--gray-dark: #18181b;
--swatches--neutral--gray-darker: #09090b;
--swatches--neutral--black: #000000;
--gradient-ambient: linear-gradient(108deg, #000 0%, #0C0A10 100%);
--container: 0px;
--vw-from-0: calc(1 / 100);
--vw-to-0: calc(479 / 100);
--coefficient-0: calc((var(--font-to-0) - var(--font-from-0)) / (var(--vw-to-0) - var(--vw-from-0)));
--base-0: calc((var(--font-from-0) - var(--vw-from-0) * var(--coefficient-0)) / 16);
--vw-from-1: calc(479 / 100);
--vw-to-1: calc(1440 / 100);
--coefficient-1: calc((var(--font-to-1) - var(--font-from-1)) / (var(--vw-to-1) - var(--vw-from-1)));
--base-1: calc((var(--font-from-1) - var(--vw-from-1) * var(--coefficient-1)) / 16);
--vw-from-2: calc(1440 / 100);
--vw-to-2: calc(1920 / 100);
--coefficient-2: calc((var(--font-to-2) - var(--font-from-2)) / (var(--vw-to-2) - var(--vw-from-2)));
--base-2: calc((var(--font-from-2) - var(--vw-from-2) * var(--coefficient-2)) / 16);
--vw-from-3: calc(1920 / 100);
--vw-to-3: calc(2400 / 100);
--coefficient-3: calc((var(--font-to-3) - var(--font-from-3)) / (var(--vw-to-3) - var(--vw-from-3)));
--base-3: calc((var(--font-from-3) - var(--vw-from-3) * var(--coefficient-3)) / 16);
--nav-height: 300px;
--glvh: 8px;
```

### Dependencies

```css
--gap--large: --size--2-5rem;
--gap--medium: --size--1-5rem;
--gap--xsmall: --size--0-5rem;
--gap--main: --size--1rem;
--global-padding: --size--1-5rem;
--padding-vertical--medium: --size--7rem;
--padding-vertical--small: --size--5rem;
--padding-vertical--xlarge: --size--15rem;
--padding-vertical--large: --size--10rem;
--radius--medium: --size--0-75rem;
--brand--violet<deleted|variable-909db2ba-44a9-daa9-6465-611c14353504>: --brand--ocean-violet;
--radius--section: --size--1-5rem;
--radius--main: --size--1rem;
--gap--bento<deleted|variable-12997eb7-1a55-08c5-7d41-46519a4ca416>: --gap--medium;
--padding--section-mobile<deleted|variable-e003bddb-333d-5c15-cd2d-b9b8fa15ac8d>: --spacing--spacing-2xl;
--gap--content<deleted|variable-9105031e-7e8e-e534-e965-40482ca50990>: --gap--medium;
--padding--section-tablet<deleted|variable-491c7c6f-f7ca-d7fe-27a0-a8e55dbdb5a9>: --spacing--spacing-3xl;
--padding--section-desktop<deleted|variable-eb3a761c-5792-fc68-bf14-9dd5fb281363>: --spacing--spacing-4xl;
--_themes---text: --_swatches---neutral--black;
--_themes---background: --_swatches---neutral--white;
--navbar-height: --size--5-5rem;
--radius--small: --size--0-5rem;
--gap--xlarge: --size--5rem;
--padding-vertical--none: --size--0rem;
--_swatches---neutral--muted: --_swatches---neutral--currentcolor-50;
--gap--none: --size--0rem;
--gap--small: --size--0-75rem;
--radius--none: --size--0rem;
--_text-sizes---u-text-md: --size--1-25rem;
--_text-sizes---u-text-main: --size--1rem;
--_swatches---neutral--muted-hard: --_swatches---neutral--currentcolor-15;
--_themes---text-muted: --_swatches---neutral--black-muted;
--_text-sizes---u-text-lg: --size--1-5rem;
--coefficient-0: --font-to-0,--font-from-0,--vw-to-0,--vw-from-0;
--base-0: --font-from-0,--vw-from-0,--coefficient-0;
--coefficient-1: --font-to-1,--font-from-1,--vw-to-1,--vw-from-1;
--base-1: --font-from-1,--vw-from-1,--coefficient-1;
--coefficient-2: --font-to-2,--font-from-2,--vw-to-2,--vw-from-2;
--base-2: --font-from-2,--vw-from-2,--coefficient-2;
--coefficient-3: --font-to-3,--font-from-3,--vw-to-3,--vw-from-3;
--base-3: --font-from-3,--vw-from-3,--coefficient-3;
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
| sm | 450px | max-width |
| sm | 479px | max-width |
| sm | 480px | min-width |
| sm | 599px | max-width |
| sm | 600px | max-width |
| md | 767px | max-width |
| md | 768px | min-width |
| md | 800px | max-width |
| md | 801px | min-width |
| lg | 980px | max-width |
| lg | 991px | max-width |
| lg | 992px | min-width |
| lg | 1024px | min-width |
| 1200px | 1200px | min-width |
| 1365px | 1365px | max-width |
| 1440px | 1440px | max-width |
| 2xl | 1500px | max-width |
| 1920px | 1920px | max-width |

## Transitions & Animations

**Easing functions:** `[object Object]`, `[object Object]`, `[object Object]`, `[object Object]`, `[object Object]`, `[object Object]`

**Durations:** `0.2s`, `0.15s`, `0.3s`, `0.12s`, `0.5s`, `8s`, `0.6s`

### Common Transitions

```css
transition: all;
transition: 0.2s cubic-bezier(0, 0, 0, 1);
transition: 0.15s cubic-bezier(0, 0, 0, 1);
transition: opacity 0.3s;
transition: height 0.12s cubic-bezier(0, 0, 0, 1);
transition: transform 0.5s cubic-bezier(0, 1.5, 0.34, 1);
transition: 0.5s cubic-bezier(0.25, 1.2, 0.5, 1);
transition: transform ease-out;
transition: transform;
transition: 0.5s cubic-bezier(0, 0, 0, 1);
```

### Keyframe Animations

**spin**
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

**plyr-progress**
```css
@keyframes plyr-progress {
  100% { background-position: var(--plyr-progress-loading-size,25px) 0; }
}
```

**plyr-popup**
```css
@keyframes plyr-popup {
  0% { opacity: 0.5; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0px); }
}
```

**plyr-fade-in**
```css
@keyframes plyr-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
```

**pulse-violet**
```css
@keyframes pulse-violet {
  0% { box-shadow: rgba(174, 67, 249, 0.7) 0px 0px 0px 0px; }
  70% { box-shadow: rgba(174, 67, 249, 0) 0px 0px 0px 20px; }
  100% { box-shadow: rgba(174, 67, 249, 0) 0px 0px 0px 0px; }
}
```

**pulse-red**
```css
@keyframes pulse-red {
  0% { box-shadow: rgba(255, 26, 81, 0.7) 0px 0px 0px 0px; }
  70% { box-shadow: rgba(255, 26, 81, 0) 0px 0px 0px 20px; }
  100% { box-shadow: rgba(255, 26, 81, 0) 0px 0px 0px 0px; }
}
```

**dot-pulse**
```css
@keyframes dot-pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
```

**moveGradient**
```css
@keyframes moveGradient {
  0% { background-position: 400% 0px; }
  100% { background-position: 0px 0px; }
}
```

**gleap-pulse**
```css
@keyframes gleap-pulse {
  0% { transform: scale(0); opacity: 0.25; }
  45% { transform: scale(2.5); opacity: 0; }
  100% { transform: scale(0); opacity: 0; }
}
```

**gleapSlideIn**
```css
@keyframes gleapSlideIn {
  0% { top: calc(-1 * var(--gleap-margin-top)); }
  100% { top: 10px; }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (54 instances)

```css
.button {
  background-color: rgb(120, 58, 251);
  color: rgb(255, 255, 255);
  font-size: 15.667px;
  font-weight: 400;
  padding-top: 0px;
  padding-right: 15px;
  border-radius: 0px;
}
```

### Cards (217 instances)

```css
.card {
  background-color: rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 1px 0px, rgba(34, 42, 53, 0.04) 0px 4px 6px 0px, rgba(47, 48, 55, 0.05) 0px 24px 68px 0px, rgba(0, 0, 0, 0.04) 0px 2px 3px 0px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Inputs (8 instances)

```css
.input {
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  border-color: rgb(0, 0, 0);
  border-radius: 0px;
  font-size: 14px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Links (204 instances)

```css
.link {
  color: rgb(255, 255, 255);
  font-size: 15.667px;
  font-weight: 400;
}
```

### Navigation (293 instances)

```css
.navigatio {
  background-color: rgb(255, 255, 255);
  color: rgb(255, 255, 255);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
  box-shadow: rgba(0, 0, 0, 0.2) 0px -1px 0px 0px inset, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
}
```

### Footer (109 instances)

```css
.foote {
  background-color: rgb(0, 0, 0);
  color: rgba(255, 255, 255, 0.5);
  padding-top: 4.7001px;
  padding-bottom: 4.7001px;
  font-size: 13.7086px;
}
```

### Modals (3 instances)

```css
.modal {
  background-color: rgb(12, 10, 16);
  border-radius: 0px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px 0px;
  padding-top: 0px;
  padding-right: 0px;
  max-width: 1096.69px;
}
```

### Dropdowns (2 instances)

```css
.dropdown {
  border-radius: 0px;
  border-color: rgb(255, 255, 255);
  padding-top: 0px;
}
```

### Tables (5 instances)

```css
.table {
  border-color: rgb(221, 221, 221);
  cell-style: [object Object];
}
```

### Badges (26 instances)

```css
.badge {
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  font-size: 13.7086px;
  font-weight: 400;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 0px;
}
```

### Avatars (35 instances)

```css
.avatar {
  border-radius: 1566.7px;
}
```

### Tabs (16 instances)

```css
.tab {
  color: rgb(255, 255, 255);
  font-size: 15.667px;
  font-weight: 400;
  padding-top: 0px;
  padding-right: 15.667px;
  border-color: rgb(255, 255, 255);
  border-radius: 0px;
}
```

### ProgressBars (2 instances)

```css
.progressBar {
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  border-radius: 15.667px;
  font-size: 15.667px;
}
```

### Switches (26 instances)

```css
.switche {
  border-radius: 0px;
  border-color: rgb(0, 0, 0);
}
```

## Layout System

**58 grid containers** and **707 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 1723.37px | 0px |
| 1253.36px | 0px |
| 861.686px | 0px |
| 100% | 0px |
| 64px | 22.3647px |
| 1018.36px | 0px |
| 591.379px | 23.5005px |
| calc(100% - 47.001px) | 0px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 1-column | 36x |
| 2-column | 13x |
| 3-column | 4x |
| 5-column | 2x |
| 4-column | 2x |
| 8-column | 1x |

### Grid Templates

```css
grid-template-columns: 312.547px 208.359px 208.375px 208.359px 208.359px;
gap: 82.4868px 15.667px;
grid-template-columns: 1253.36px;
gap: 22.3647px;
grid-template-columns: 689.344px 541.656px;
gap: 22.3647px;
grid-template-columns: 361.344px 722.719px;
gap: 36.8566px 55.7746px;
grid-template-columns: 614.922px 614.938px;
gap: 23.5005px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| column/nowrap | 178x |
| row/nowrap | 442x |
| row/wrap | 68x |
| column-reverse/nowrap | 18x |
| row-reverse/nowrap | 1x |

**Gap values:** `11.7503px`, `125.336px`, `15.667px`, `15.667px 36.8566px`, `22.3647px`, `23.5005px`, `3.42716px 6.85432px`, `3.91675px`, `31.334px`, `31.334px 47.001px`, `36.8566px`, `36.8566px 55.7746px`, `47.001px`, `6.85432px`, `7.83351px`, `82.4868px 15.667px`, `86.1686px`, `8px`, `94.0021px`

## Responsive Design

### Viewport Snapshots

| Viewport | Body Font | Nav Visible | Max Columns | Hamburger | Page Height |
|----------|-----------|-------------|-------------|-----------|-------------|
| mobile (375px) | 15.1297px | Yes | 3 | Yes | 15522px |
| tablet (768px) | 14.6015px | Yes | 4 | Yes | 13672px |
| desktop (1280px) | 15.667px | Yes | 8 | Yes | 11866px |
| wide (1920px) | 16.5px | Yes | 8 | Yes | 12515px |

### Breakpoint Changes

**375px → 768px** (mobile → tablet):
- Body font size: `15.1297px` → `14.6015px`
- H1 size: `40.8074px` → `56.1136px`
- Max grid columns: `3` → `4`
- Page height: `15522px` → `13672px`

**768px → 1280px** (tablet → desktop):
- Body font size: `14.6015px` → `15.667px`
- H1 size: `56.1136px` → `78.3351px`
- Max grid columns: `4` → `8`
- Page height: `13672px` → `11866px`

**1280px → 1920px** (desktop → wide):
- Body font size: `15.667px` → `16.5px`
- H1 size: `78.3351px` → `82.5px`
- Page height: `11866px` → `12515px`

## Interaction States

### Button States

**"Surfer | SEO Content Optimizat"**
```css
/* Hover */
background-color: rgba(0, 0, 0, 0) → rgba(255, 255, 255, 0.184);
outline: rgb(255, 255, 255) none 3px → rgb(255, 255, 255) none 1px;
```
```css
/* Focus */
background-color: rgba(0, 0, 0, 0) → rgba(255, 255, 255, 0.2);
outline: rgb(255, 255, 255) none 3px → rgb(255, 255, 255) none 0px;
```

**"Platform"**
```css
/* Hover */
background-color: rgba(0, 0, 0, 0) → rgba(255, 255, 255, 0.2);
```
```css
/* Focus */
background-color: rgba(0, 0, 0, 0) → rgba(255, 255, 255, 0.2);
outline: rgb(255, 255, 255) none 3px → rgb(16, 16, 16) auto 1px;
```

**"Solutions"**
```css
/* Hover */
background-color: rgba(0, 0, 0, 0) → rgba(255, 255, 255, 0.2);
```
```css
/* Focus */
background-color: rgba(0, 0, 0, 0) → rgba(255, 255, 255, 0.2);
outline: rgb(255, 255, 255) none 3px → rgb(16, 16, 16) auto 1px;
```

### Link Hover

```css
outline: rgb(255, 255, 255) none 3px → rgb(255, 255, 255) none 1px;
```

## Accessibility (WCAG 2.1)

**Overall Score: 98%** — 160 passing, 3 failing color pairs

### Failing Color Pairs

| Foreground | Background | Ratio | Level | Used On |
|------------|------------|-------|-------|---------|
| `#000000` | `#783afb` | 3.8:1 | FAIL | div (1x) |
| `#ffffff` | `#ff0000` | 4:1 | FAIL | div (1x) |
| `#000000` | `#0c0a10` | 1.07:1 | FAIL | div (1x) |

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#000000` | `#ffffff` | 21:1 | AAA |
| `#eeeeee` | `#333333` | 10.89:1 | AAA |
| `#ffffff` | `#000000` | 21:1 | AAA |
| `#ffffff` | `#783afb` | 5.53:1 | AA |
| `#ffffff` | `#18181b` | 17.72:1 | AAA |
| `#ffffff` | `#09090b` | 19.9:1 | AAA |
| `#000000` | `#999999` | 7.37:1 | AAA |
| `#ffffff` | `#16141a` | 18.28:1 | AAA |
| `#ffffff` | `#201e24` | 16.5:1 | AAA |
| `#000000` | `#ff5b49` | 6.84:1 | AA |

## Design System Score

**Overall: 75/100 (Grade: C)**

| Category | Score |
|----------|-------|
| Color Discipline | 70/100 |
| Typography Consistency | 70/100 |
| Spacing System | 80/100 |
| Shadow Consistency | 75/100 |
| Border Radius Consistency | 40/100 |
| Accessibility | 98/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 26 distinct font sizes — consider a tighter type scale
- 13 unique border radii — standardize to 3-4 values
- 3 WCAG contrast failures

## Gradients

**4 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| linear | — | 2 | brand |
| linear | — | 2 | brand |
| linear | 90deg | 3 | bold |
| linear | 270deg | 3 | bold |

```css
background: linear-gradient(rgb(9, 9, 11) 9%, rgba(0, 0, 0, 0.25));
background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgb(0, 0, 0) 83%);
background: linear-gradient(90deg, rgb(51, 51, 51), rgb(51, 51, 51) 70%, rgba(51, 51, 51, 0));
background: linear-gradient(270deg, rgb(51, 51, 51), rgb(51, 51, 51) 70%, rgba(51, 51, 51, 0));
```

## Z-Index Map

**17 unique z-index values** across 4 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| modal | 99999,2147483630 | header.n.a.v.b.a.r.-.-.c.o.m.p.o.n.e.n.t, div.c.h.2.-.s.e.t.t.i.n.g.s. .c.h.2.-.s.e.t.t.i.n.g.s.-.s.c.a.n, div.g.l.o.b.a.l._.s.t.y.l.e.-.w.r.a.p. .d.i.v.-.b.l.o.c.k.-.8.2.4 |
| dropdown | 100,900 | img.n.a.v.b.a.r.-.c.o.l.u.m.n._.c.a.r.d.-.b.r.a.n.d.-.i.m.g, img.n.a.v.b.a.r.-.c.o.l.u.m.n._.c.a.r.d.-.b.r.a.n.d.-.i.m.g, div.n.a.v.b.a.r.-.c.o.l.u.m.n._.c.a.r.d.-.b.r.a.n.d.-.i.m.g |
| sticky | 10,50 | div.i.c.o.n.-.e.m.b.e.d.-.c.u.s.t.o.m.-.3. .w.-.e.m.b.e.d, div.c.h.2.-.s.e.t.t.i.n.g.s.-.s.c.r.o.l.l.e.r. .c.h.2.-.s.c.r.o.l.l.e.r.-.l.e.f.t, div.c.h.2.-.s.e.t.t.i.n.g.s.-.s.c.r.o.l.l.e.r. .c.h.2.-.s.c.r.o.l.l.e.r.-.r.i.g.h.t |
| base | -1000,5 | span.s.w.i.p.e.r.-.n.o.t.i.f.i.c.a.t.i.o.n, span.s.w.i.p.e.r.-.n.o.t.i.f.i.c.a.t.i.o.n, span.s.w.i.p.e.r.-.n.o.t.i.f.i.c.a.t.i.o.n |

**Issues:**
- [object Object]

## SVG Icons

**40 unique SVG icons** detected. Dominant style: **filled**.

| Size Class | Count |
|------------|-------|
| xs | 3 |
| sm | 8 |
| md | 11 |
| lg | 6 |
| xl | 12 |

**Icon colors:** `currentColor`, `#FF5B49`, `white`, `black`, `#0C0A10`, `#F8F9FA`, `#FF9D28`, `#00B67A`, `#DCDCE6`, `#fff`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| webflow-icons | self-hosted | 400 | normal |
| Inter Variable | self-hosted | 100 900 | italic, normal |
| swiper-icons | self-hosted | 400 | normal |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 66 | objectFit: fill, borderRadius: 0px, shape: square |
| avatar | 25 | objectFit: cover, borderRadius: 50%, shape: circular |
| general | 9 | objectFit: cover, borderRadius: 22.3647px, shape: pill |
| hero | 7 | objectFit: cover, borderRadius: 7.83351px, shape: rounded |
| gallery | 4 | objectFit: fill, borderRadius: 0px, shape: square |

**Aspect ratios:** 1:1 (61x), 16:9 (15x), 4:1 (7x), 3:4 (3x), 4:3 (2x), 5.36:1 (1x), 3.75:1 (1x), 5.82:1 (1x)

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Inter Variable` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
