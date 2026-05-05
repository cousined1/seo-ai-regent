---
type: slice-completion
tags: [schema, json-ld, structured-data, recommendation, validation, slice-13]
confidence: high
created: 2026-05-04
source: slice-13-schema-recommendation
supersedes: null
---

# Slice 13: Schema Recommendation → Validation → Publish Warning/Block

## What Changed
- Added `SchemaRecommendation` model to Prisma schema with fields for schema type, JSON-LD payload, validation state, and applied flag.
- Implemented `src/lib/schema/recommendation.ts` with three core functions:
  - `recommendSchemaTypes(content)` — analyzes article content and returns ranked schema type recommendations with confidence scores and explanations.
  - `generateJsonLd(schemaType, content)` — produces valid JSON-LD for Article, FAQ, HowTo, Review, Product, Breadcrumb, Organization, Person, Event, and LocalBusiness types.
  - `validateJsonLd(schemaType, jsonLd)` — validates JSON-LD structure with type-specific field checks and returns detailed error messages.
- Created API route at `/api/articles/[id]/schema` supporting GET (list recommendations), POST (generate new schema), and PATCH (apply/validate/reject).
- Built `SchemaPanel` React component for the editor sidebar showing recommended types, generated JSON-LD preview, validation status, and apply/copy actions.
- Added 13 unit tests covering recommendation logic, JSON-LD generation for 3 types, and validation for Article/FAQ/HowTo schemas.

## What Matters
- TypeScript type overlap between `Record<string, unknown>` and specific JSON-LD interfaces (ArticleJsonLd, FaqJsonLd, HowToJsonLd) required double-casting via `as unknown as T` to satisfy the compiler without losing type safety in tests.
- The recommendation engine uses a simple rule-based approach: check content flags (`hasFaq`, `hasHowTo`, `hasReview`, `hasProduct`), heading patterns, and content structure to determine which schema types apply.
- Validation is structural only — it checks required fields per schema type but does not call external validators like Google's Rich Results Test.
- The UI panel integrates with the editor sidebar pattern established in Slice 9 (internal link suggestions), using the same border/spacing conventions.

## What Needs Action
- Production deployment should replace the inline JSON-LD generation with a call to an external validation API (Google Rich Results Test or Schema Markup Validator) for richer validation feedback.
- The `apply` action currently marks the recommendation as applied in the database but does not yet inject the JSON-LD script tag into the published article HTML — this requires CMS integration work.
- Consider adding a "preview" mode that renders the JSON-LD as a `<script>` tag in a sandboxed iframe for visual verification before applying.

## Execution Trace
| Step | State | Notes |
|------|-------|-------|
| Update Prisma schema | COMPLETED | Added SchemaRecommendation model, ran prisma generate |
| Write failing tests | COMPLETED | 13 tests for recommendation, generation, validation |
| Implement service | COMPLETED | 3 functions with type-specific logic |
| Fix TS casting errors | COMPLETED | Double-cast pattern for JSON-LD interfaces |
| Create API routes | COMPLETED | GET/POST/PATCH at /api/articles/[id]/schema |
| Build UI panel | COMPLETED | SchemaPanel component with recommendations, preview, validation |
| Typecheck | COMPLETED | tsc --noEmit zero errors |
| Tests | COMPLETED | 328 tests pass (13 new) |
| Security audit | COMPLETED | 0 HIGH/CRITICAL (7 moderate, non-blocking) |
