---
name: seo-machine
description: Research, write, optimize, and audit SEO-optimized blog content and landing pages. Use when the user wants to create blog posts, research keywords, analyze competitors, optimize existing content for search, audit SEO issues, generate meta elements, build topic clusters, create landing pages, or any SEO content task. Triggers on "SEO," "blog post," "keyword research," "content optimization," "meta description," "SERP analysis," "content gap," "topic cluster," "landing page," "SEO audit," "internal linking," "schema markup," or "rank for."
---

# SEO Machine

End-to-end SEO content system: research → write → optimize → publish.

## Workflow

### 1. Research: `/research [topic]`

Use `web_search` and `web_fetch` to:
- Find primary keyword + 3-5 secondary keywords (volume, difficulty, intent)
- Analyze top 10 SERP results for the target keyword
- Identify content gaps (what competitors miss)
- Check `context/target-keywords.md` and `context/internal-links-map.md` if they exist in the workspace

**Output:** Save research brief to `seo/research/brief-[slug]-[date].md`

### 2. Write: `/write [topic or brief]`

Follow the writing framework in `references/write-framework.md` for:
- 2000-3000+ word SEO-optimized article
- Direct answer first (AI search optimization)
- Key Takeaways block after intro
- 2-3 mini-stories with specific names/details/outcomes
- 2-3 contextual CTAs (first within 500 words)
- Brand voice from `context/brand-voice.md` if available
- Internal links (3-5+) and external authority links (2-3)

After writing, auto-run these analyses (see `references/agents.md`):
- **SEO Optimizer** — on-page SEO check, score 0-100
- **Meta Creator** — 5 title + 5 description variations
- **Internal Linker** — specific link suggestions + anchor text
- **Keyword Mapper** — density, placement, clustering analysis

**Output:** Save to `seo/drafts/[slug]-[date].md` with frontmatter (meta title, description, keywords, slug, word count)

### 3. Rewrite: `/rewrite [topic or analysis]`

- Fetch existing content via `web_fetch` or read local file
- Score content health (0-100)
- Update stats, fill gaps, improve SEO, modernize examples
- Track changes (before/after)

**Output:** Save to `seo/rewrites/[slug]-rewrite-[date].md`

### 4. Optimize: `/optimize [file]`

Final pre-publish SEO audit:
- Validate all checklist items (see `references/seo-checklist.md`)
- Generate publishing readiness score
- Priority fixes → quick wins → enhancements

**Output:** Save optimization report to `seo/drafts/optimization-report-[slug]-[date].md`

### 5. Audit Existing: `/analyze-existing [URL or file]`

- Fetch and score existing content (0-100)
- Check E-E-A-T signals, technical SEO, on-page, content depth
- See `references/audit-framework.md` for full audit structure

**Output:** Save analysis to `seo/research/analysis-[slug]-[date].md`

### 6. Topic Cluster: `/cluster [topic]`

- Design pillar + supporting articles + linking map
- Internal linking architecture (hub-spoke)
- See `references/programmatic-seo.md` for 12 playbook patterns

**Output:** Save cluster strategy to `seo/research/cluster-[slug]-[date].md`

### 7. Landing Page: `/landing-write [topic]`

- Conversion-optimized landing page (not blog post)
- Single message, single CTA, objection handling
- See `references/copy-frameworks.md` for headline formulas and section templates

### 8. SEO Audit: `/seo-audit [domain]`

Full site audit — crawlability, indexation, technical, on-page, content, authority. See `references/audit-framework.md`.

### 9. Scrub: `/scrub [file]`

Remove AI watermarks and patterns from content:
- Em-dash overuse → contextually appropriate punctuation
- AI filler phrases ("It's worth noting," "In today's landscape")
- Zero-width Unicode characters
- Passive voice clusters
- See `references/ai-scrubbing.md`

## Context Files

If the workspace has a `context/` directory, read these before writing:
- `brand-voice.md` — tone, messaging pillars
- `style-guide.md` — grammar, formatting rules
- `seo-guidelines.md` — keyword/structure requirements
- `internal-links-map.md` — key pages for internal linking
- `target-keywords.md` — priority keywords and clusters
- `competitor-analysis.md` — competitive intelligence
- `features.md` — product features (for natural CTAs)

## Directory Structure

```
seo/
├── research/       # Research briefs, analyses
├── drafts/         # Articles + optimization reports
├── rewrites/       # Updated/refreshed content
├── review-required/  # Articles scoring <70
├── published/      # Final published versions
└── topics/         # Topic ideas and backlogs
```

## Key Principles

1. **Direct answer first** — First 1-2 sentences must answer the target query (AI scrapers pull from top of page)
2. **Key Takeaways block** — 3-5 specific bullets after intro, NOT a TOC
3. **Specificity > vagueness** — Names, numbers, outcomes, not "streamline" or "optimize"
4. **Mini-stories** — 2-3 per article with specific people, situations, and outcomes (50-150 words each)
5. **Contextual CTAs** — 2-3 distributed throughout, first within 500 words
6. **Paragraph max 4 sentences** — Vary rhythm (short punchy + longer flowing)
7. **Quality score ≥ 70** — Use content scorer before publishing; <70 goes to `review-required/`
8. **No paragraphs longer than 4 sentences**

## Quality Dimensions

| Dimension | Weight | Target |
|-----------|--------|--------|
| Humanity/Voice | 30% | No AI phrases, contractions, specific |
| Specificity | 25% | Concrete examples, numbers, names |
| Structure Balance | 20% | 40-70% prose (not all lists) |
| SEO Compliance | 15% | Keywords, meta, hierarchy |
| Readability | 10% | Flesch 60-70, grade 8-10 |

## Reference Files

- **`references/write-framework.md`** — Full writing process, structure, engagement rules, auto-agent triggers
- **`references/seo-checklist.md`** — Pre-publish SEO + AI search optimization checklists
- **`references/audit-framework.md`** — Technical + on-page + content audit structure
- **`references/agents.md`** — SEO Optimizer, Meta Creator, Internal Linker, Keyword Mapper details
- **`references/copy-frameworks.md`** — Headline formulas, section templates, CTA copy, transitions
- **`references/programmatic-seo.md`** — 12 playbooks for pages at scale
- **`references/ai-scrubbing.md`** — AI watermark removal patterns and rules