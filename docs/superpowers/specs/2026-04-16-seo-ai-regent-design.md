# SEO AI Regent Design Spec

**Date:** 2026-04-16

**Product:** SEO AI Regent

**Positioning:** Content scoring for Google and AI search.

## Design Summary

SEO AI Regent must present as an editorial authority platform first and a SaaS tool second. The product should feel like the category-defining system for understanding whether content will perform in both traditional search and AI-mediated search.

The experience is built around two linked postures:

- `Editorial Command` for the landing page
- `Editorial Rail` for the product surface

This creates a clear product hierarchy:

- The landing page establishes authority and category leadership
- The demo proves the model quickly
- The user enters through either a live demo or keyword-first onboarding
- The editor preserves writing flow with a clean canvas by default
- The rail keeps the scoring system continuously visible
- Assisted guidance is available on demand rather than forced by default

## Section 1: Experience Architecture

The landing page must sell the category before it sells the tool. It should read like a publication-grade authority surface with conversion discipline rather than a generic SaaS marketing site.

The product must carry that same posture into the application. The editor should feel like a premium writing environment, with the reasoning engine visible at all times in a persistent right rail. The writer remains in control of the document while the product continuously explains performance, next actions, and score logic.

This yields one clear experience model:

- Authority first, tool second
- Demo proves the model in under a minute
- Keyword-first flow creates commitment
- The clean writing canvas protects flow state
- The rail exposes the logic of the scoring engine
- Assisted guidance is opt-in, not default

## Section 2: Editor and Rail Information Architecture

The editor uses a two-zone structure:

- dominant writing canvas on the left
- persistent intelligence rail on the right

### Main Canvas

- TipTap-based writing surface
- clean by default
- toolbar includes formatting controls and a focus-mode toggle
- inline guidance is off by default
- when focus mode is enabled, missing terms, structure cues, and inline guidance can appear without replacing the core writing experience

### Right Rail Order

The rail order is fixed:

1. Dual-score lockup
2. Top 3 Actions
3. Terms panel
4. Full signal breakdown

### Dual-Score Lockup

The top of the rail must use a dual-score lockup. Content Score and GEO Score are equal peers and must have equal visual weight.

- both shown side by side
- both shown as `0-100`
- both shown with status text
- both use the same ring visual system and score color ramp
- GEO Score must never be buried below Content Score

### Top 3 Actions

The Top 3 Actions card is the first synthesis layer below the dual-score lockup. It answers the question: "What should I do next?"

Each action must:

- update in real time
- stay prioritized by expected lift
- derive from canonical scoring output
- use contextual lift formatting

Contextual lift behavior:

- show unified lift when an action improves both scores
- show score-specific lift when an action affects only one score
- show split lift when the action affects both but unevenly

Examples:

- `Add H2: Best Practices  +5 pts`
- `Add 2 cited statistics  +6 GEO`
- `Include 'content optimization'  +8 Content`
- `Improve Flesch-Kincaid to Grade 8  +3 Content / +1 GEO`

### Terms Panel

The terms panel sits below the Top 3 Actions card and organizes terms into:

- required
- recommended
- optional

It must show:

- live checkmarks
- missing-state emphasis
- consistent score-ramp coloring

### Full Signal Breakdown

The signal breakdown is the full explanation layer. It answers the question: "Why is this the score?"

Each signal must show:

- current value
- weight
- contribution percentage
- status

The signal breakdown must use the shared score color ramp so the user learns a single visual language across the entire product.

### Shared Score Color Ramp

The entire rail uses the same score language:

- `--score-excellent` `#22C55E` for `90-100`
- `--score-good` `#84CC16` for `70-89`
- `--score-fair` `#F59E0B` for `50-69`
- `--score-poor` `#EF4444` for `0-49`

This ramp must be used consistently across:

- score lockups
- Top 3 Actions
- terms states
- signal breakdown statuses

### Focus Mode Toggle

The writing canvas defaults to a clean state. Assisted mode must be available by toggle, not by default.

- default state is clean
- assisted mode is triggered from the toolbar
- keyboard shortcut should exist
- suggested shortcut: `Cmd+Shift+H`

This supports both new users and experienced writers:

- new users can learn through the rail first
- experienced users can keep distraction low
- assisted mode becomes an explicit escalation path when needed

## Section 3: Landing Page Structure and Conversion Flow

The landing page follows the `Editorial Command` posture and should use a nine-section conversion structure.

### Section Order

1. Hero
2. Social proof
3. How it works
4. Feature narrative
5. Comparison table
6. Testimonials
7. Pricing
8. FAQ
9. Final CTA

### Hero

The hero must be left-aligned and built around a split CTA model:

- primary CTA: `Start Free - Enter a Keyword`
- secondary CTA: `Try Live Demo`

The split CTA exists because:

- keyword-first onboarding creates user commitment
- demo mode proves product value quickly
- demo-only onboarding creates weak conversion pressure
- keyword-only onboarding creates too much friction before value is shown

### Demo Flow

The live demo should open a preloaded editor experience with:

- article content already loaded
- Content Score visible
- GEO Score visible
- Top 3 Actions populated
- terms panel active
- breakdown visible

The demo must prove the product without allowing project creation or persistence. Save, new project creation, or fresh analysis should require account creation.

### Feature Narrative

The landing page must not use a generic three-column icon grid. It should use an asymmetric narrative layout that expresses one system:

- Content Score
- GEO Score
- SERP Analyzer
- AI Writer

### Comparison Table

The comparison table is the most important sales section. The GEO Score row must be the visual anchor because it is the row where SEO AI Regent stands alone.

Suggested comparison structure:

| Feature | SEO AI Regent | Surfer | Clearscope | Frase |
| --- | --- | --- | --- | --- |
| Content Score | yes | yes | yes | yes |
| GEO Score | yes | no | no | no |
| SERP Analyzer | yes | yes | yes | yes |
| AI Writer | yes | yes | limited | yes |

The `yes / no / no / no` pattern on GEO Score should do a large share of the conversion work by itself.

### Visual Behavior

- left alignment is the default
- body text must not be center-aligned
- editorial whitespace is required
- the score color ramp should appear in hero proof, comparison states, and pricing emphasis
- avoid generic SaaS clichés

## Section 4: Scoring, Actions, and Explanation Model

SEO AI Regent uses two peer scores:

- Content Score
- GEO Score

Both scores must always be explainable and actionable. The interface should never show a score without also making clear:

- how the user is doing
- what to do next
- why the score is what it is

### Explanation Hierarchy

- dual-score lockup answers: `How am I doing?`
- Top 3 Actions answers: `What should I do next?`
- terms panel answers: `What am I missing?`
- signal breakdown answers: `Why is this the score?`

### Behavioral Goal

Users should gradually learn the distinction between Content Score and GEO Score through normal use.

Examples:

- citations and factual density should clearly move GEO Score
- headings and term placement should clearly move Content Score
- some actions should visibly move both

This learning should emerge from interaction design, not onboarding copy.

## Section 5: Technical Architecture and Implementation Boundaries

The system must have one scoring brain and many presentation surfaces.

### Canonical Models

The following structures from the build prompt are the canonical scoring contracts:

- `ContentScore`
- `GEOScore`
- `explainScore()`

`explainScore()` must be the single source of truth for explanation output. All rail components render from canonical scoring output.

That includes:

- dual-score lockup
- Top 3 Actions
- terms panel
- signal breakdown

No separate scoring paths may exist for:

- visual score summaries
- actions
- breakdown panels
- inline guidance

This is required to prevent score contradictions and trust loss.

### Architectural Domains

- `scoring/`
  canonical score calculators, weights, explanation generation, action derivation
- `editor/`
  TipTap integration, clean mode, assisted mode, toolbar behavior, inline guidance
- `rail/`
  display components for scores, actions, terms, and signals
- `serp/`
  SERP fetching, extraction, NLP/entity processing, aggregation, caching
- `onboarding/`
  keyword-first onboarding and demo workspace entry
- `marketing/`
  landing page, comparison table, pricing, FAQ, CTA system

### Real-Time Loop

- user types in editor
- updates debounce
- scoring request executes
- canonical score output returns
- rail refreshes from canonical output

The UI must not invent values locally that diverge from canonical scoring.

### Reliability Requirements

- actions must be traceable to the same scoring model used in the breakdown
- score updates must feel live without visual jitter
- demo and real projects must share one UI system
- presentation differs by data source and save permissions, not by component logic

## Section 6: Risks, Validation, and First Implementation Slice

### Main Risks

- trust risk if scores and actions diverge
- UX noise risk if the editor feels like a dashboard
- latency risk if the rail stops feeling live
- differentiation risk if GEO Score is visible but does not shape behavior
- design drift risk if token discipline erodes

### Validation Gates

- design tokens come from extracted evidence or locked brand tokens only
- rail order remains fixed
- `explainScore()` remains the explanation source of truth
- demo and real flows use the same UI system
- the first usable build must prove the full loop:
  keyword -> SERP analysis -> editor -> live scores -> actions -> explanation

### First Implementation Slice

The first implementation slice should include:

- landing page with `Editorial Command` structure
- split CTA system
- live demo workspace
- keyword-first onboarding path
- editor shell with clean canvas
- persistent right rail
- dual-score lockup
- Top 3 Actions
- terms panel
- full signal breakdown
- focus-mode toggle scaffold
- canonical scoring interfaces
- `explainScore()` implementation
- one real end-to-end scoring path with cached keyword analysis

This slice is sufficient to validate the product thesis before expanding into broader modules like billing, audits, and AI writing.

## Never List

The following are implementation-breaking anti-patterns and must not enter the product:

- Never show a score without its breakdown.
- Never let actions and signals diverge from the same `explainScore()` output.
- Never default to assisted or inline mode. Always start clean.
- Never bury GEO Score below Content Score in the rail.
- Never use generic three-column icon grids on the landing page.
- Never center-align body text. Left-align by default.
- Never approximate design tokens. Extract them or use locked brand tokens.
- Never show raw data without synthesis. No JSON dumps in the UI.

## Visual and Brand Requirements

All extractable design tokens are evidence, not guesses. If a value can be extracted from a live reference or already exists in the locked SEO AI Regent brand token set, that value must be used.

Required SEO AI Regent brand anchors:

- dark mode default
- `#0A0A0A` background
- cyan primary `#06B6D4`
- Geist for headings and body
- Geist Mono for mono use cases
- rounded cards and systematic spacing

## Decision Record

The following design decisions are approved:

- landing page posture: `Editorial Command`
- product posture: `Editorial Rail`
- top rail metric layout: `Dual-score lockup`
- canvas mode: `Focus mode toggle`
- rail synthesis order: `Hybrid summary first`
- action impact display: `Contextual lift`
- primary landing CTA model: `Split CTA`

## Implementation Intent

SEO AI Regent should feel like a publication-grade authority system that happens to include a high-performance scoring tool, not a dashboard product attempting to sound authoritative through marketing copy.

The interface should make the thesis visible:

Google performance and AI search performance are separate but equally important, and SEO AI Regent is the system that helps users improve both.
