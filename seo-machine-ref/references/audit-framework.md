# SEO Audit Framework

## Priority Order

1. **Crawlability & Indexation** — Can Google find and index it?
2. **Technical Foundations** — Is the site fast and functional?
3. **On-Page Optimization** — Is content optimized?
4. **Content Quality** — Does it deserve to rank?
5. **Authority & Links** — Does it have credibility?

## Technical SEO Audit

### Crawlability
- Robots.txt: Check for unintentional blocks, verify sitemap reference
- XML Sitemap: Exists, accessible, submitted to Search Console, contains only canonical URLs
- Site Architecture: Important pages within 3 clicks of homepage, no orphan pages
- Crawl Budget: Parameterized URLs controlled, faceted navigation handled

### Indexation
- `site:domain.com` check
- Search Console coverage report
- Noindex tags on important pages?
- Canonicals pointing correct direction?
- Redirect chains/loops?
- Soft 404s?
- Duplicate content without canonicals?
- www vs non-www consistency
- HTTP → HTTPS redirects

### Site Speed & Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- INP (Interaction to Next Paint): < 200ms
- CLS (Cumulative Layout Shift): < 0.1
- TTFB, image optimization, JS execution, CDN usage

### Mobile
- Responsive design (not m. site)
- Tap targets, viewport, no horizontal scroll
- Same content as desktop

### Security
- HTTPS everywhere, valid SSL, no mixed content, HSTS header

### URL Structure
- Readable, descriptive, keywords where natural, lowercase, hyphen-separated

## On-Page SEO Audit

### Title Tags
- Unique per page, keyword near beginning, 50-60 chars, compelling

### Meta Descriptions
- Unique per page, 150-160 chars, includes keyword, clear value prop, CTA

### Heading Structure
- One H1 per page, keyword in H1, logical hierarchy, no skipped levels

### Content
- Keyword in first 100 words, related keywords natural, sufficient depth, answers search intent

### Images
- Descriptive file names, alt text, compressed, WebP, lazy loading, responsive

### Internal Linking
- Important pages well-linked, descriptive anchor text, no broken links, reasonable count

## Content Quality (E-E-A-T)

| Signal | What to Check |
|--------|--------------|
| Experience | First-hand experience, original insights, real examples |
| Expertise | Author credentials, accurate info, sourced claims |
| Authoritativeness | Recognized in space, cited by others |
| Trustworthiness | Accurate info, transparent business, contact info, privacy policy, HTTPS |

## Audit Report Format

### Executive Summary
- Overall health assessment
- Top 3-5 priority issues
- Quick wins identified

### Findings (per issue)
- **Issue**: What's wrong
- **Impact**: High/Medium/Low
- **Evidence**: How you found it
- **Fix**: Specific recommendation
- **Priority**: Critical/High/Medium/Low

### Prioritized Action Plan
1. Critical fixes (blocking indexation/ranking)
2. High-impact improvements
3. Quick wins (easy, immediate benefit)
4. Long-term recommendations

## Common Issues by Site Type

| Site Type | Common Problems |
|-----------|----------------|
| SaaS | Thin product pages, missing comparison pages, no glossary content |
| E-commerce | Duplicate descriptions, thin categories, missing product schema, faceted nav duplicates |
| Blog | Outdated content, keyword cannibalization, poor internal linking, no author pages |
| Local | Inconsistent NAP, missing local schema, no Google Business Profile optimization |

## Tools

**Free:** Google Search Console, PageSpeed Insights, Rich Results Test, Schema Validator
**Paid (if available):** Screaming Frog, Ahrefs/Semrush, Sitebulb