# SEO Agents

Auto-run these agents after `/write` completes. Each produces a separate output file.

## 1. Content Analyzer

Comprehensive analysis using 5 modules:

| Module | Analyzes |
|--------|----------|
| Search Intent | Informational/navigational/transactional/commercial classification |
| Keyword Density | Density, clustering, LSI keywords, stuffing detection |
| Content Length | Benchmarks against top 10 SERP results |
| Readability | Flesch Reading Ease, Flesch-Kincaid Grade Level |
| SEO Quality | Comprehensive 0-100 score with category breakdowns |

**Output:** `seo/drafts/content-analysis-[slug]-[date].md`

Provides:
- Executive summary with publishing readiness
- Priority action plan (critical/high/optimization)
- Competitive positioning
- Exact metrics and benchmarks
- Keyword distribution heatmap by section

## 2. SEO Optimizer

On-page SEO analysis:
- Keyword optimization and density
- Content structure and headings
- Internal and external links
- Meta elements completeness
- Readability and UX
- Featured snippet opportunities

**Output:** `seo/drafts/seo-report-[slug]-[date].md`

SEO score 0-100 with specific improvement recommendations.

## 3. Meta Creator

Generate conversion-optimized meta elements:
- 5 meta title variations (50-60 chars)
- 5 meta description variations (150-160 chars)
- Testing recommendations
- SERP preview
- Reasoning for each option

**Output:** `seo/drafts/meta-options-[slug]-[date].md`

## 4. Internal Linker

Strategic internal linking recommendations:
- 3-5 specific internal link suggestions
- Exact placement locations
- Anchor text recommendations
- User journey mapping
- SEO impact prediction

References `context/internal-links-map.md` if available.

**Output:** `seo/drafts/link-suggestions-[slug]-[date].md`

## 5. Keyword Mapper

Keyword placement analysis:
- Primary keyword positions (H1, first 100 words, H2s, body)
- Density calculation (target 1-2%)
- LSI/semantic keyword coverage
- Keyword distribution by section
- Missing keyword opportunities
- Stuffing risk detection

**Output:** `seo/drafts/keyword-analysis-[slug]-[date].md`

## 6. Headline Generator

When invoked separately:
- 10 headline variations using different formulas
- Social media headline variants
- Email subject line variants
- A/B testing recommendations

## 7. CRO Analyst

Landing page conversion analysis:
- Above-the-fold assessment
- CTA visibility and copy
- Trust signals
- Objection handling
- Mobile conversion friction

## 8. Cluster Strategist

Topic cluster architecture:
- Pillar page definition
- Supporting article list (5-15 articles)
- Internal linking map between cluster pages
- Content calendar ordering
- Search volume distribution across cluster