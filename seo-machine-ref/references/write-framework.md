# Write Framework

## Pre-Writing Review

Before writing, gather:
1. Research brief (from `/research`) if available
2. Brand voice from `context/brand-voice.md`
3. Writing examples from `context/writing-examples.md`
4. Style guide from `context/style-guide.md`
5. SEO guidelines from `context/seo-guidelines.md`
6. Target keywords from `context/target-keywords.md`

## Content Structure

### 1. Headline (H1)
- Primary keyword naturally included
- Compelling, click-worthy
- Under 60 characters
- Promise clear value

### 2. Introduction (150-250 words)

**CRITICAL: Direct Answer First (AI Search Optimization)**
For any "best/top/how" query, first 1-2 sentences MUST directly answer the question. AI scrapers (ChatGPT, Perplexity, Gemini) pull from the top of the page. Don't bury the answer.

Example — "best project management tools":
> The best project management tools in 2026 are Asana, Monday, and ClickUp — each built for different team sizes and workflows. Here's how they compare.

After the direct answer, use ONE hook type:

| Hook Type | Example | Best For |
|-----------|---------|----------|
| Provocative Question | "What if the 'free' plan is actually costing you $500/month?" | Challenging assumptions |
| Specific Scenario | "Last Tuesday, Sarah checked her dashboard and discovered something alarming." | Emotional connection |
| Surprising Statistic | "73% of SaaS users switch platforms within 18 months." | Data-driven topics |
| Bold Statement | "Your current tool is lying to you about your numbers." | Controversial takes |
| Counterintuitive Claim | "The cheapest option might be the most expensive decision." | Comparison content |

Then follow the APP Formula:
- **Agree**: Acknowledge what the reader already believes/feels
- **Promise**: Tell them exactly what they'll learn
- **Preview**: Brief overview of what's coming

### 3. Key Takeaways Block (REQUIRED)

After introduction, before first H2:

```markdown
> **Key Takeaways**
> - [Core finding with specifics — numbers, names, outcomes]
> - [Core finding #2]
> - [Core finding #3]
> - [Core finding #4 if needed]
> - [Core finding #5 if needed]
```

Rules:
- 3-5 bullets
- NOT a table of contents — these are the article's actual conclusions
- Written AFTER the full article is drafted (so takeaways are accurate)

### 4. Main Body (1800-2500+ words)

- 4-7 H2 sections with logical progressive flow
- H3 subsections for complex topics
- Primary keyword 1-2% density, variations throughout
- Keyword in at least 2-3 H2 headings
- Short paragraphs (2-4 sentences MAX)
- Bold key concepts
- Bulleted/numbered lists for scannability
- Statistics with sources
- At least 1 YouTube embed suggestion

**REQUIRED: Mini-Stories (2-3 per article)**

Each mini-story (50-150 words) includes:
- A **specific person** (use names: "Sarah," "The team at Acme Corp")
- A **concrete situation** (dates, numbers, specifics)
- A **clear outcome** that illustrates the point

Placement: One early (hook readers), one middle (re-engage skimmers), one near conclusion.

**REQUIRED: Contextual CTAs (2-3 per article)**

| Location | Type | Example |
|----------|------|---------|
| After first value section | Soft CTA | "Want to see how this works? [Explore our features →]" |
| After comparison/proof | Medium CTA | "**Ready to test the difference?** Start a free trial." |
| End of article | Strong CTA | "**[Start Your Free Trial →]**" |

Rules:
- First CTA within first 500 words
- Vary format (inline text, bold callout, button-style)
- Contextual to the section content
- Never generic "Click here"

### 5. Conclusion (150-200 words)
- Recap 3-5 key takeaways
- Clear next steps
- Final CTA
- Empowering, forward-looking close

## Output Format

### Article File
Save as `seo/drafts/[slug]-[date].md` with frontmatter:

```yaml
---
meta_title: "[50-60 char optimized title]"
meta_description: "[150-160 char compelling description]"
primary_keyword: "[main keyword]"
secondary_keywords: [keyword1, keyword2, keyword3]
url_slug: /blog/[optimized-slug]
internal_links: [list of pages linked]
external_links: [list of external sources]
word_count: [actual]
seo_score: [from optimization]
---
```

### After Saving: Auto-Run Agents

Immediately after saving the article:

1. **SEO Optimizer** — Score article 0-100, on-page recommendations
2. **Meta Creator** — 5 title + 5 description variations
3. **Internal Linker** — 3-5 specific link suggestions with anchor text
4. **Keyword Mapper** — Density analysis, placement, LSI keyword check

Then **scrub** the article for AI patterns (see `references/ai-scrubbing.md`).

### Quality Gate

If composite quality score < 70 after auto-analysis, route to `seo/review-required/` with `_REVIEW_NOTES.md` containing scoring details.