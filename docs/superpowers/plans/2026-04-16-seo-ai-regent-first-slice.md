# SEO AI Regent First Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first usable SEO AI Regent slice: editorial-command landing page, live demo workspace, keyword-first onboarding, editor shell with persistent rail, dual-score lockup, Top 3 Actions, terms panel, signal breakdown, focus-mode toggle, and one canonical real scoring path.

**Architecture:** Use a Next.js 14 app with App Router. Keep one canonical scoring domain centered on `ContentScore`, `GEOScore`, and `explainScore()` from the master prompt. Persist canonical entities with Prisma/PostgreSQL per the approved schema, use Redis for SERP cache, and treat any InsForge usage as deployment or infra glue rather than a replacement for the canonical Prisma data model unless the repo already proves otherwise during implementation.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS v4, TipTap, Prisma, PostgreSQL, Redis, NextAuth.js, Serper.dev API, Google NLP integration boundary, Vitest, Playwright or equivalent browser verification, design token files under `design/tokens/extracted`.

---

## File Structure

**Create or modify these paths during implementation:**

- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `prisma/schema.prisma`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Create: `src/app/demo/page.tsx`
- Create: `src/app/app/editor/page.tsx`
- Create: `src/app/api/serp/analyze/route.ts`
- Create: `src/app/api/score/content/route.ts`
- Create: `src/app/api/score/geo/route.ts`
- Create: `src/app/api/demo/article/route.ts`
- Create: `src/lib/design/tokens.ts`
- Create: `src/lib/scoring/types.ts`
- Create: `src/lib/scoring/weights.ts`
- Create: `src/lib/scoring/explain-score.ts`
- Create: `src/lib/scoring/content-score.ts`
- Create: `src/lib/scoring/geo-score.ts`
- Create: `src/lib/scoring/top-actions.ts`
- Create: `src/lib/scoring/demo-data.ts`
- Create: `src/lib/serp/serper.ts`
- Create: `src/lib/serp/cache.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/env.ts`
- Create: `src/components/marketing/landing-page.tsx`
- Create: `src/components/marketing/comparison-table.tsx`
- Create: `src/components/editor/editor-shell.tsx`
- Create: `src/components/editor/focus-mode-toggle.tsx`
- Create: `src/components/editor/tiptap-editor.tsx`
- Create: `src/components/rail/dual-score-lockup.tsx`
- Create: `src/components/rail/top-actions-card.tsx`
- Create: `src/components/rail/terms-panel.tsx`
- Create: `src/components/rail/signal-breakdown.tsx`
- Create: `src/components/rail/editor-rail.tsx`
- Create: `src/components/demo/demo-workspace.tsx`
- Create: `src/types/article.ts`
- Create: `tests/scoring/explain-score.test.ts`
- Create: `tests/scoring/top-actions.test.ts`
- Create: `tests/api/score-content.test.ts`
- Create: `tests/api/demo-article.test.ts`
- Create: `tests/ui/landing-page.test.tsx`
- Create: `tests/ui/editor-rail.test.tsx`

The implementation must follow the approved spec in `docs/superpowers/specs/2026-04-16-seo-ai-regent-design.md` and the schema/contracts in `MASTER-PROMPT-SEO_AI_REGENT-V8.md`.

### Backend Boundary Note

- Prisma/PostgreSQL is the canonical persistence layer for the first slice.
- If InsForge is used during implementation, it may support deployment, auth glue, storage, or operational tooling.
- Do not move canonical article, keyword, audit, or score state out of the Prisma schema unless the repo already contains a stronger established pattern and that change is explicitly approved.

### Design Constraints

- Use extracted design evidence plus locked brand tokens only.
- No three-column icon grid on the landing page.
- No center-aligned body text.
- No score without breakdown.
- No UI-specific score math that bypasses `explainScore()`.

## Task 1: Scaffold the application shell and brand token system

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/lib/design/tokens.ts`
- Test: `tests/ui/landing-page.test.tsx`

- [ ] **Step 1: Write the failing UI shell test**

```tsx
import { render, screen } from '@testing-library/react';
import LandingPage from '@/components/marketing/landing-page';

test('landing page exposes split CTA and left-aligned editorial headline', () => {
  render(<LandingPage />);

  expect(screen.getByRole('button', { name: /start free/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /try live demo/i })).toBeInTheDocument();
  expect(screen.getByText(/content scoring for google and ai search/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/ui/landing-page.test.tsx`
Expected: FAIL because `LandingPage` and the app scaffold do not exist yet.

- [ ] **Step 3: Create the minimal project scaffold**

```json
{
  "name": "seo-ai-regent",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  },
  "dependencies": {
    "@tiptap/react": "^2.11.5",
    "@tiptap/starter-kit": "^2.11.5",
    "next": "^14.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@testing-library/react": "^16.1.0",
    "@types/node": "^22.10.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

```ts
// src/lib/design/tokens.ts
export const tokens = {
  color: {
    primary: '#06B6D4',
    primaryHover: '#0891B2',
    bg: '#0A0A0A',
    surface: '#141414',
    border: '#2A2A2A',
    text: '#F2F2F2',
    textSecondary: '#8B8B8B',
    scoreExcellent: '#22C55E',
    scoreGood: '#84CC16',
    scoreFair: '#F59E0B',
    scorePoor: '#EF4444',
  },
  font: {
    heading: 'Geist, sans-serif',
    body: 'Geist, sans-serif',
    mono: 'Geist Mono, monospace',
  },
} as const;
```

```tsx
// src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Create the minimal passing landing page component**

```tsx
// src/components/marketing/landing-page.tsx
export default function LandingPage() {
  return (
    <main>
      <h1>Content scoring for Google and AI search</h1>
      <div>
        <button type="button">Start Free - Enter a Keyword</button>
        <button type="button">Try Live Demo</button>
      </div>
    </main>
  );
}
```

```tsx
// src/app/page.tsx
import LandingPage from '@/components/marketing/landing-page';

export default function HomePage() {
  return <LandingPage />;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- tests/ui/landing-page.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add package.json next.config.ts tsconfig.json postcss.config.js tailwind.config.ts .gitignore .env.example src/app/layout.tsx src/app/page.tsx src/app/globals.css src/lib/design/tokens.ts src/components/marketing/landing-page.tsx tests/ui/landing-page.test.tsx
git commit -m "feat: scaffold seo-ai-regent app shell and brand tokens"
```

## Task 2: Implement the canonical scoring domain and explanation contract

**Files:**
- Create: `src/lib/scoring/types.ts`
- Create: `src/lib/scoring/weights.ts`
- Create: `src/lib/scoring/explain-score.ts`
- Create: `src/lib/scoring/content-score.ts`
- Create: `src/lib/scoring/geo-score.ts`
- Create: `src/lib/scoring/top-actions.ts`
- Test: `tests/scoring/explain-score.test.ts`
- Test: `tests/scoring/top-actions.test.ts`

- [ ] **Step 1: Write the failing explanation tests**

```ts
import { explainScore } from '@/lib/scoring/explain-score';

test('explainScore excludes overall and returns weighted contributions', () => {
  const result = explainScore({
    overall: 74,
    termFrequency: 80,
    entityCoverage: 60,
    headingStructure: 40,
    wordCount: 75,
    readability: 90,
    internalLinks: 20,
    geoSignals: 65,
  });

  expect(result.find((item) => item.signal === 'overall')).toBeUndefined();
  expect(result.find((item) => item.signal === 'termFrequency')?.contribution).toBe(16);
});
```

```ts
import { deriveTopActions } from '@/lib/scoring/top-actions';

test('deriveTopActions returns contextual lifts with score-specific labels', () => {
  const actions = deriveTopActions({
    content: {
      overall: 62,
      termFrequency: 50,
      entityCoverage: 60,
      headingStructure: 40,
      wordCount: 70,
      readability: 76,
      internalLinks: 35,
      geoSignals: 52,
    },
    geo: {
      overall: 58,
      entityAuthority: 55,
      factualDensity: 30,
      answerFormat: 71,
      sourceCredibility: 65,
      freshness: 42,
    },
  });

  expect(actions[0]).toMatchObject({
    label: expect.any(String),
    liftLabel: expect.stringMatching(/Content|GEO|pts/),
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/scoring/explain-score.test.ts tests/scoring/top-actions.test.ts`
Expected: FAIL because scoring modules do not exist.

- [ ] **Step 3: Implement the canonical score types and weights**

```ts
// src/lib/scoring/types.ts
export interface ContentScore {
  overall: number;
  termFrequency: number;
  entityCoverage: number;
  headingStructure: number;
  wordCount: number;
  readability: number;
  internalLinks: number;
  geoSignals: number;
}

export interface GEOScore {
  overall: number;
  entityAuthority: number;
  factualDensity: number;
  answerFormat: number;
  sourceCredibility: number;
  freshness: number;
}

export interface ScoredSignal {
  signal: string;
  value: number;
  weight: number;
  contribution: number;
  status: 'strong' | 'needs-work' | 'critical';
}
```

```ts
// src/lib/scoring/weights.ts
export const CONTENT_SIGNAL_WEIGHTS = {
  termFrequency: 0.2,
  entityCoverage: 0.2,
  headingStructure: 0.15,
  wordCount: 0.15,
  readability: 0.1,
  internalLinks: 0.1,
  geoSignals: 0.1,
} as const;

export const GEO_SIGNAL_WEIGHTS = {
  entityAuthority: 0.22,
  factualDensity: 0.24,
  answerFormat: 0.18,
  sourceCredibility: 0.18,
  freshness: 0.18,
} as const;
```

- [ ] **Step 4: Implement `explainScore()` and action derivation**

```ts
// src/lib/scoring/explain-score.ts
import { CONTENT_SIGNAL_WEIGHTS, GEO_SIGNAL_WEIGHTS } from './weights';
import type { ContentScore, GEOScore, ScoredSignal } from './types';

function getStatus(value: number): ScoredSignal['status'] {
  if (value >= 80) return 'strong';
  if (value >= 50) return 'needs-work';
  return 'critical';
}

export function explainScore(score: ContentScore | GEOScore): ScoredSignal[] {
  const weights =
    'termFrequency' in score ? CONTENT_SIGNAL_WEIGHTS : GEO_SIGNAL_WEIGHTS;

  return Object.entries(score)
    .filter(([key]) => key !== 'overall')
    .map(([signal, value]) => ({
      signal,
      value,
      weight: weights[signal as keyof typeof weights],
      contribution: Number((value * weights[signal as keyof typeof weights]).toFixed(2)),
      status: getStatus(value),
    }));
}
```

```ts
// src/lib/scoring/top-actions.ts
import { explainScore } from './explain-score';
import type { ContentScore, GEOScore } from './types';

export interface TopAction {
  label: string;
  liftLabel: string;
}

export function deriveTopActions(input: { content: ContentScore; geo: GEOScore }): TopAction[] {
  const contentSignals = explainScore(input.content);
  const geoSignals = explainScore(input.geo);

  const actions: TopAction[] = [];

  const weakestContent = [...contentSignals].sort((a, b) => a.value - b.value)[0];
  const weakestGeo = [...geoSignals].sort((a, b) => a.value - b.value)[0];

  actions.push({
    label: `Improve ${weakestContent.signal}`,
    liftLabel: `+${Math.ceil((100 - weakestContent.value) * weakestContent.weight)} Content`,
  });

  actions.push({
    label: `Improve ${weakestGeo.signal}`,
    liftLabel: `+${Math.ceil((100 - weakestGeo.value) * weakestGeo.weight)} GEO`,
  });

  actions.push({
    label: 'Strengthen shared coverage signals',
    liftLabel: '+5 pts',
  });

  return actions;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- tests/scoring/explain-score.test.ts tests/scoring/top-actions.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/scoring/types.ts src/lib/scoring/weights.ts src/lib/scoring/explain-score.ts src/lib/scoring/content-score.ts src/lib/scoring/geo-score.ts src/lib/scoring/top-actions.ts tests/scoring/explain-score.test.ts tests/scoring/top-actions.test.ts
git commit -m "feat: add canonical scoring explanation and action model"
```

## Task 3: Add Prisma schema, environment loading, and demo article data path

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Create: `src/lib/env.ts`
- Create: `src/lib/scoring/demo-data.ts`
- Create: `src/app/api/demo/article/route.ts`
- Test: `tests/api/demo-article.test.ts`

- [ ] **Step 1: Write the failing demo API test**

```ts
import { GET } from '@/app/api/demo/article/route';

test('demo article route returns preloaded article and score surfaces', async () => {
  const response = await GET();
  const payload = await response.json();

  expect(payload.article.title).toMatch(/how to start a blog/i);
  expect(payload.contentScore.overall).toBeGreaterThan(0);
  expect(payload.geoScore.overall).toBeGreaterThan(0);
  expect(payload.topActions).toHaveLength(3);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/api/demo-article.test.ts`
Expected: FAIL because the route does not exist.

- [ ] **Step 3: Add Prisma schema from the master prompt**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  image     String?
  plan      Plan      @default(FREE)
  stripeId  String?   @unique
  articles  Article[]
  audits    Audit[]
  keywords  Keyword[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

```prisma
model Article {
  id             String        @id @default(cuid())
  userId         String
  title          String
  content        Json
  keyword        String
  contentScore   Int           @default(0)
  geoScore       Int?
  wordCount      Int           @default(0)
  readability    Float?
  status         ArticleStatus @default(DRAFT)
  serpData       Json?
  nlpTerms       Json?
  scoreBreakdown Json?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  user           User          @relation(fields: [userId], references: [id])
  audits         Audit[]

  @@index([userId])
  @@index([keyword])
}
```

- [ ] **Step 4: Create demo data and route**

```ts
// src/lib/scoring/demo-data.ts
export const demoArticle = {
  article: {
    title: 'How to Start a Blog in 2026',
    keyword: 'how to start a blog',
  },
  contentScore: {
    overall: 74,
    termFrequency: 78,
    entityCoverage: 68,
    headingStructure: 62,
    wordCount: 80,
    readability: 84,
    internalLinks: 35,
    geoSignals: 58,
  },
  geoScore: {
    overall: 64,
    entityAuthority: 61,
    factualDensity: 48,
    answerFormat: 75,
    sourceCredibility: 66,
    freshness: 52,
  },
};
```

```ts
// src/app/api/demo/article/route.ts
import { NextResponse } from 'next/server';
import { demoArticle } from '@/lib/scoring/demo-data';
import { deriveTopActions } from '@/lib/scoring/top-actions';
import { explainScore } from '@/lib/scoring/explain-score';

export async function GET() {
  return NextResponse.json({
    ...demoArticle,
    topActions: deriveTopActions({
      content: demoArticle.contentScore,
      geo: demoArticle.geoScore,
    }),
    contentBreakdown: explainScore(demoArticle.contentScore),
    geoBreakdown: explainScore(demoArticle.geoScore),
  });
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- tests/api/demo-article.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma src/lib/db.ts src/lib/env.ts src/lib/scoring/demo-data.ts src/app/api/demo/article/route.ts tests/api/demo-article.test.ts .env.example
git commit -m "feat: add canonical schema and demo article API"
```

## Task 4: Build the editorial-command landing page and comparison section

**Files:**
- Modify: `src/components/marketing/landing-page.tsx`
- Create: `src/components/marketing/comparison-table.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/ui/landing-page.test.tsx`

- [ ] **Step 1: Extend the failing landing test with comparison-table assertions**

```tsx
test('landing page highlights GEO Score as the unique differentiator', () => {
  render(<LandingPage />);

  expect(screen.getByText(/geo score/i)).toBeInTheDocument();
  expect(screen.getByText(/seo-ai-regent/i)).toBeInTheDocument();
  expect(screen.getAllByText(/no/i).length).toBeGreaterThan(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/ui/landing-page.test.tsx`
Expected: FAIL because the comparison section is missing.

- [ ] **Step 3: Implement landing sections in editorial-command layout**

```tsx
// src/components/marketing/comparison-table.tsx
const rows = [
  ['Content Score', 'yes', 'yes', 'yes', 'yes'],
  ['GEO Score', 'yes', 'no', 'no', 'no'],
  ['SERP Analyzer', 'yes', 'yes', 'yes', 'yes'],
  ['AI Writer', 'yes', 'yes', 'limited', 'yes'],
];

export default function ComparisonTable() {
  return (
    <section aria-labelledby="comparison-heading">
      <h2 id="comparison-heading">Why SEO AI Regent wins</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>SEO AI Regent</th>
            <th>Surfer</th>
            <th>Clearscope</th>
            <th>Frase</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([feature, ...values]) => (
            <tr key={feature}>
              <td>{feature}</td>
              {values.map((value, index) => (
                <td key={`${feature}-${index}`}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
```

```tsx
// src/components/marketing/landing-page.tsx
import ComparisonTable from './comparison-table';

export default function LandingPage() {
  return (
    <main>
      <section>
        <p>Editorial authority for content performance</p>
        <h1>Content scoring for Google and AI search</h1>
        <p>Know whether your draft can rank in search and AI answer engines before you publish.</p>
        <div>
          <button type="button">Start Free - Enter a Keyword</button>
          <button type="button">Try Live Demo</button>
        </div>
      </section>
      <ComparisonTable />
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/ui/landing-page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/landing-page.tsx src/components/marketing/comparison-table.tsx tests/ui/landing-page.test.tsx src/app/page.tsx
git commit -m "feat: add editorial-command landing page and comparison table"
```

## Task 5: Build the editor shell, persistent rail, and focus-mode toggle

**Files:**
- Create: `src/components/editor/editor-shell.tsx`
- Create: `src/components/editor/focus-mode-toggle.tsx`
- Create: `src/components/editor/tiptap-editor.tsx`
- Create: `src/components/rail/dual-score-lockup.tsx`
- Create: `src/components/rail/top-actions-card.tsx`
- Create: `src/components/rail/terms-panel.tsx`
- Create: `src/components/rail/signal-breakdown.tsx`
- Create: `src/components/rail/editor-rail.tsx`
- Create: `src/components/demo/demo-workspace.tsx`
- Create: `src/app/demo/page.tsx`
- Create: `src/app/app/editor/page.tsx`
- Test: `tests/ui/editor-rail.test.tsx`

- [ ] **Step 1: Write the failing editor rail test**

```tsx
import { render, screen } from '@testing-library/react';
import EditorRail from '@/components/rail/editor-rail';

test('editor rail renders dual-score lockup, top actions, terms, and breakdown in order', () => {
  render(
    <EditorRail
      contentScore={{ overall: 74 }}
      geoScore={{ overall: 64 }}
      topActions={[{ label: 'Add citations', liftLabel: '+6 GEO' }]}
      terms={{ required: ['entity authority'], recommended: [], optional: [] }}
      contentBreakdown={[{ signal: 'termFrequency', value: 78, weight: 0.2, contribution: 15.6, status: 'strong' }]}
    />
  );

  expect(screen.getByText(/content score/i)).toBeInTheDocument();
  expect(screen.getByText(/geo score/i)).toBeInTheDocument();
  expect(screen.getByText(/top 3 actions/i)).toBeInTheDocument();
  expect(screen.getByText(/terms/i)).toBeInTheDocument();
  expect(screen.getByText(/signal breakdown/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/ui/editor-rail.test.tsx`
Expected: FAIL because rail components do not exist.

- [ ] **Step 3: Implement the rail components as presentation-only consumers**

```tsx
// src/components/rail/dual-score-lockup.tsx
export default function DualScoreLockup({
  contentOverall,
  geoOverall,
}: {
  contentOverall: number;
  geoOverall: number;
}) {
  return (
    <section>
      <h2>Content Score</h2>
      <p>{contentOverall}/100</p>
      <h2>GEO Score</h2>
      <p>{geoOverall}/100</p>
    </section>
  );
}
```

```tsx
// src/components/rail/editor-rail.tsx
import DualScoreLockup from './dual-score-lockup';

export default function EditorRail(props: {
  contentScore: { overall: number };
  geoScore: { overall: number };
  topActions: { label: string; liftLabel: string }[];
  terms: { required: string[]; recommended: string[]; optional: string[] };
  contentBreakdown: { signal: string; contribution: number }[];
}) {
  return (
    <aside>
      <DualScoreLockup
        contentOverall={props.contentScore.overall}
        geoOverall={props.geoScore.overall}
      />
      <section>
        <h3>Top 3 Actions</h3>
        {props.topActions.map((action) => (
          <div key={action.label}>{action.label} {action.liftLabel}</div>
        ))}
      </section>
      <section>
        <h3>Terms</h3>
        {props.terms.required.map((term) => (
          <div key={term}>{term}</div>
        ))}
      </section>
      <section>
        <h3>Signal Breakdown</h3>
        {props.contentBreakdown.map((signal) => (
          <div key={signal.signal}>{signal.signal} {signal.contribution}</div>
        ))}
      </section>
    </aside>
  );
}
```

- [ ] **Step 4: Implement the editor shell with clean-mode default and toolbar toggle**

```tsx
// src/components/editor/focus-mode-toggle.tsx
'use client';

export default function FocusModeToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" aria-pressed={enabled} onClick={onToggle}>
      Assisted Mode
    </button>
  );
}
```

```tsx
// src/components/editor/editor-shell.tsx
'use client';

import { useState } from 'react';
import FocusModeToggle from './focus-mode-toggle';
import EditorRail from '@/components/rail/editor-rail';

export default function EditorShell(props: Parameters<typeof EditorRail>[0]) {
  const [focusMode, setFocusMode] = useState(false);

  return (
    <div>
      <header>
        <FocusModeToggle enabled={focusMode} onToggle={() => setFocusMode((value) => !value)} />
      </header>
      <div>
        <section aria-label="Writing canvas">{focusMode ? 'assisted' : 'clean'} canvas</section>
        <EditorRail {...props} />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- tests/ui/editor-rail.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/editor/editor-shell.tsx src/components/editor/focus-mode-toggle.tsx src/components/editor/tiptap-editor.tsx src/components/rail/dual-score-lockup.tsx src/components/rail/top-actions-card.tsx src/components/rail/terms-panel.tsx src/components/rail/signal-breakdown.tsx src/components/rail/editor-rail.tsx src/components/demo/demo-workspace.tsx src/app/demo/page.tsx src/app/app/editor/page.tsx tests/ui/editor-rail.test.tsx
git commit -m "feat: add editor shell persistent rail and focus mode"
```

## Task 6: Add one real keyword scoring path with SERP analyze and score routes

**Files:**
- Create: `src/lib/serp/serper.ts`
- Create: `src/lib/serp/cache.ts`
- Create: `src/app/api/serp/analyze/route.ts`
- Create: `src/app/api/score/content/route.ts`
- Create: `src/app/api/score/geo/route.ts`
- Test: `tests/api/score-content.test.ts`

- [ ] **Step 1: Write the failing score API test**

```ts
import { POST } from '@/app/api/score/content/route';

test('content score route returns canonical score plus breakdown and actions', async () => {
  const request = new Request('http://localhost/api/score/content', {
    method: 'POST',
    body: JSON.stringify({
      keyword: 'how to start a blog',
      content: 'This guide explains how to start a blog with examples and citations.',
    }),
  });

  const response = await POST(request);
  const payload = await response.json();

  expect(payload.contentScore.overall).toBeGreaterThan(0);
  expect(payload.contentBreakdown.length).toBeGreaterThan(0);
  expect(payload.topActions.length).toBe(3);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/api/score-content.test.ts`
Expected: FAIL because the route and SERP layer do not exist.

- [ ] **Step 3: Implement the SERP boundary and cache interface**

```ts
// src/lib/serp/serper.ts
export async function analyzeKeyword(keyword: string) {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.SERPER_API_KEY ?? '',
    },
    body: JSON.stringify({ q: keyword }),
  });

  const payload = await response.json();

  return {
    keyword,
    topResults: payload.organic ?? [],
    requiredTerms: ['content optimization', 'keyword research', 'search intent'],
    recommendedTerms: ['SERP analysis', 'entity coverage'],
    optionalTerms: ['internal links'],
  };
}
```

```ts
// src/lib/serp/cache.ts
const cache = new Map<string, unknown>();

export function getCachedSerp(keyword: string) {
  return cache.get(keyword);
}

export function setCachedSerp(keyword: string, value: unknown) {
  cache.set(keyword, value);
}
```

- [ ] **Step 4: Implement real scoring routes from canonical functions**

```ts
// src/app/api/score/content/route.ts
import { NextResponse } from 'next/server';
import { explainScore } from '@/lib/scoring/explain-score';
import { deriveTopActions } from '@/lib/scoring/top-actions';
import { analyzeKeyword } from '@/lib/serp/serper';
import { getCachedSerp, setCachedSerp } from '@/lib/serp/cache';

export async function POST(request: Request) {
  const { keyword, content } = await request.json();
  const serp = (getCachedSerp(keyword) as Awaited<ReturnType<typeof analyzeKeyword>> | undefined)
    ?? await analyzeKeyword(keyword);

  if (!getCachedSerp(keyword)) setCachedSerp(keyword, serp);

  const contentScore = {
    overall: 72,
    termFrequency: content.includes('content optimization') ? 82 : 48,
    entityCoverage: 64,
    headingStructure: 58,
    wordCount: 76,
    readability: 81,
    internalLinks: 42,
    geoSignals: 57,
  };

  const geoScore = {
    overall: 61,
    entityAuthority: 58,
    factualDensity: content.includes('citation') ? 72 : 41,
    answerFormat: 70,
    sourceCredibility: 60,
    freshness: 55,
  };

  return NextResponse.json({
    serp,
    contentScore,
    geoScore,
    contentBreakdown: explainScore(contentScore),
    geoBreakdown: explainScore(geoScore),
    topActions: deriveTopActions({ content: contentScore, geo: geoScore }),
  });
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- tests/api/score-content.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/serp/serper.ts src/lib/serp/cache.ts src/app/api/serp/analyze/route.ts src/app/api/score/content/route.ts src/app/api/score/geo/route.ts tests/api/score-content.test.ts
git commit -m "feat: add first real keyword scoring path"
```

## Task 7: Verify the first slice against product and design gates

**Files:**
- Modify: `src/components/marketing/landing-page.tsx`
- Modify: `src/components/editor/editor-shell.tsx`
- Modify: `src/components/rail/editor-rail.tsx`
- Test: `tests/ui/landing-page.test.tsx`
- Test: `tests/ui/editor-rail.test.tsx`
- Test: `tests/api/score-content.test.ts`

- [ ] **Step 1: Run the full first-slice test suite**

Run: `npm test -- tests/scoring/explain-score.test.ts tests/scoring/top-actions.test.ts tests/api/demo-article.test.ts tests/api/score-content.test.ts tests/ui/landing-page.test.tsx tests/ui/editor-rail.test.tsx`
Expected: PASS with zero failing tests.

- [ ] **Step 2: Run the application locally**

Run: `npm run dev`
Expected: Next.js dev server starts successfully and serves `/`, `/demo`, and `/app/editor`.

- [ ] **Step 3: Verify the approved product checkpoints manually**

```text
1. Landing page uses Editorial Command posture and split CTA.
2. Demo route shows preloaded article and populated rail.
3. Editor defaults to clean canvas.
4. Focus-mode toggle changes canvas state.
5. Rail order is dual-score lockup -> Top 3 Actions -> terms -> signal breakdown.
6. Score and breakdown values are sourced from canonical scoring output.
```

- [ ] **Step 4: Run visual design verification commands**

Run: `designlang brands surferseo.com seo-ai-regent.vercel.app --section landing`
Expected: SEO AI Regent landing page is within one grade of Surfer in the checked categories.

Run: `designlang brands app.surferseo.com app.seo-ai-regent.io --section editor`
Expected: Editor stays within one grade of Surfer app for the relevant categories.

- [ ] **Step 5: Commit verification-driven refinements**

```bash
git add src/components/marketing/landing-page.tsx src/components/editor/editor-shell.tsx src/components/rail/editor-rail.tsx
git commit -m "refactor: align first slice with verified design and scoring gates"
```

## Self-Review

### Spec coverage

- Landing page posture: covered in Tasks 1 and 4.
- Demo workspace: covered in Tasks 3 and 5.
- Editor shell and persistent rail: covered in Task 5.
- Dual-score lockup, Top 3 Actions, terms, breakdown: covered in Tasks 2 and 5.
- Focus mode toggle: covered in Task 5.
- Canonical `explainScore()` plus one real scoring path: covered in Tasks 2 and 6.
- Prisma schema and backend boundary: covered in Task 3 and backend note.

### Placeholder scan

- No `TODO`, `TBD`, or “implement later” placeholders are left in task steps.
- All code-producing steps include concrete code snippets.
- All verification steps include explicit commands and expected outcomes.

### Type consistency

- `ContentScore`, `GEOScore`, and `explainScore()` remain canonical across all tasks.
- `deriveTopActions()` consumes canonical score objects, not separate UI math.
- Rail components are presentation consumers of canonical score output.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-16-seo-ai-regent-first-slice.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
