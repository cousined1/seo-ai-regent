# Design Extraction Status

## Server (Linux — moltbot)
- `designlang` installed (v6.0.0)
- Playwright installed but **missing system libraries** (libatk-1.0.so.0, etc.)
- Needs `sudo` to install deps → cannot run headless browser extraction on server
- **Workaround:** Downloaded CSS files manually and extracted tokens via grep/regex
- Files extracted:
  - `surfer/surfer-shared.css` (30KB) — Surfer shared styles
  - `surfer/surfer-main.css` (301KB) — Surfer main styles  
  - `clearscope/tailwind.css` — Clearscope Tailwind build
  - `frase/frase-main.css` — Frase Next.js CSS
  - `frase/frase-chunk.css` — Frase additional CSS

## Windows Workstation (TODO)
- Playwright fully installed with all system deps
- **Action:** Run these commands from PowerShell on the workstation:

```powershell
cd C:\Users\Eddie\clawd\projects\seo-ai-regent

# Full extraction of all 3 competitors
npx designlang https://surferseo.com --full --name surfer --out design\tokens\surfer
npx designlang https://surferseo.com/pricing/ --full --name surfer-pricing --out design\tokens\surfer
npx designlang https://app.surferseo.com --full --name surfer-app --out design\tokens\surfer
npx designlang https://www.clearscope.io --full --name clearscope --out design\tokens\clearscope
npx designlang https://www.frase.io --full --name frase --out design\tokens\frase

# Design scoring
npx designlang score https://surferseo.com
npx designlang score https://www.clearscope.io
npx designlang score https://www.frase.io

# Competitive comparison
npx designlang brands surferseo.com clearscope.io frase.io
```

## Manual Extraction Results (Server)
See `competitive-design-intelligence.md` for full token analysis.
Key findings already extracted:
- Surfer: Violet #783AFB primary, Inter Variable font, dark mode default, 1rem border-radius
- Clearscope: Blue #356AD4, GT Pressura Mono + Century Old Style serif, light mode
- Frase: Purple #9600E0, Inter + Fraunces + JetBrains Mono, dark option
- All three: Rounded cards, content score gauges, NLP term checklists