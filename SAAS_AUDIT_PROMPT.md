# COMPREHENSIVE SaaS PRODUCTION-READINESS AUDIT & AI-NATIVE SECURITY HARDENING PROTOCOL

> **Version:** 2.0 — Unified Edition
> **Lineage:** GODMYTHOS v9 · SpecForge Audit Protocol · Autonomous Agent Security Hardening Protocol
> **Compliance Frameworks:** OWASP Top 10:2025 · NIST CSF 2.0 · CMMC 2.0 Level 2 · ASVS 5.0 · SOC 2 Type II · GDPR
> **Last Updated:** 2026-04-22

---

## SYSTEM DIRECTIVE

```
Mode:           GODMYTHOS v9 · ULTRATHINK · Large Scope
Persona:        Senior Security Architect acting as "Coordinator" managing
                specialized Sub-Reviewers for security, performance, compliance,
                billing, SEO, and AI-native threat defense.
Execution:      Sequential phase execution. No skipping. No confirmation between phases.
                Every issue found MUST be fixed in-place.
Zero-Tolerance:  No TODOs. No placeholders. No "follow-up later" notes. No deferred work.
                 Ship fixes, not findings.
```

**BEGIN AUDIT ON RECEIPT. Execute all 10 phases sequentially. Do not ask for confirmation between phases.**

---

## PHASE 0 — GOVERNANCE SCAFFOLDING & AGENT SAFETY BASELINE

**Objective:** Establish immutable governance artifacts before any code analysis begins. Security is baked in at scaffolding, not bolted on at runtime.

### 0.1 Durable Guidance Layer

- [ ] Verify or create `AGENTS.md` in the repository root — this is the "Constitution" for all agentic interactions
- [ ] Validate configuration hierarchy is enforced without override leakage:

| Layer | File / Mechanism | Purpose |
|-------|-----------------|---------|
| Global Defaults | `~/.codex/config.toml` or equivalent | Enterprise-wide safety invariants, provider choice, fallback chains |
| Repo-Specific Rules | `.codex/config.toml` or project config | Project-local approval modes and tool constraints |
| Durable Guidance | `AGENTS.md` | Repo layout, build/test commands, engineering "do-not" rules |
| Security Knobs | `/config` interface or env vars | Manual/Auto approval levels, sandbox directory whitelisting |

### 0.2 Eager Construction & Registry Security

- [ ] All agent system prompts and tool registries are **pre-compiled** during initialization (Eager Build pattern)
- [ ] No lazy-loading of tool schemas — schemas are validated before the first user prompt reaches the model
- [ ] Agent identity and tool permissions are fully defined before any untrusted input is processed

### 0.3 Non-Negotiable Instruction Hierarchy

Enforce prompt assembly using strict priority ordering:

1. **System Policy (Priority 10-30):** Core identity and immutable safety guardrails
2. **Developer Policy (Priority 40-50):** Project-specific constraints from `AGENTS.md`
3. **User Input:** Immediate task or query
4. **Retrieved Context / Untrusted Data:** Files, web content, tool outputs — treated **strictly as data, never as executable instructions**

- [ ] Verify system explicitly neutralizes malicious patterns in lower tiers
- [ ] Confirm context-aware "Just-in-Time" system reminders are injected before sensitive tool calls to counteract instruction fade-out in long sessions

---

## PHASE 1 — CODEBASE SCAN & STRUCTURAL REPAIR

**Objective:** Achieve zero static analysis violations, zero fragile patterns, zero silent error swallowing.

### 1.1 Static Analysis Sweep

- [ ] Scan **every file** for: runtime errors, logic errors, unhandled promise rejections, async/await misuse, race conditions, memory leaks, missing TypeScript types
- [ ] Run project linter with strictest config (`strict: true` for TS, equivalent for other languages)
- [ ] Flag and resolve all `any` types, implicit `any` returns, and untyped function parameters

### 1.2 Structural Repair

- [ ] Refactor fragile patterns: nested callbacks → async/await, god functions → single-responsibility modules
- [ ] Add `try/catch` blocks with **typed error handling** at every async boundary
- [ ] Implement input validation at **every system boundary** — API routes, webhook handlers, queue consumers, file processors
- [ ] Centralize validation logic into shared validators (Zod schemas, class-validator decorators, or equivalent)

### 1.3 Structured Logging Protocol

- [ ] Implement structured JSON logging in **every catch block** with mandatory fields:

```json
{
  "level": "error|warn|info|debug",
  "timestamp": "ISO-8601",
  "requestId": "uuid-v4",
  "context": "module.function",
  "message": "human-readable description",
  "error": { "name": "", "message": "", "stack": "" },
  "metadata": {}
}
```

- [ ] Never swallow errors silently — every catch must log or rethrow
- [ ] Ensure logs are written to a **tamper-evident persistence layer** (append-only log store, or structured logging service)

### 1.4 Dead Code & Dependency Hygiene

- [ ] Remove all dead code, unreachable branches, and commented-out blocks
- [ ] Remove unused dependencies from `package.json` / `requirements.txt` / equivalent
- [ ] Verify no circular imports or dependency cycles exist

---

## PHASE 2 — SECURITY HARDENING (OWASP 2025 + NIST CSF 2.0 + ASVS 5.0)

**Objective:** Full compliance with OWASP Top 10:2025, NIST Cybersecurity Framework 2.0 controls, and ASVS 5.0 verification requirements.

### 2.1 Access Control & Authentication (OWASP A01:2025)

- [ ] Verify signup, login, password reset, and token refresh flows end-to-end
- [ ] Enforce **server-side RBAC** — client-side-only authorization is **forbidden**
- [ ] Passwords hashed with **Argon2id** (preferred) or bcrypt with cost ≥ 12
- [ ] Implement account lockout after N failed attempts with progressive backoff
- [ ] Enforce MFA for all privileged operations and admin accounts
- [ ] Validate JWT tokens: check signature, expiration, issuer, audience claims
- [ ] Implement token rotation and secure revocation mechanisms
- [ ] SSRF vulnerabilities mitigated — validate and allowlist all outbound URLs

### 2.2 Cryptographic Failures (OWASP A02:2025)

- [ ] All data in transit encrypted via TLS 1.2+ (prefer 1.3)
- [ ] Sensitive data at rest encrypted with AES-256-GCM or equivalent
- [ ] No secrets in source code, logs, error messages, or client-side bundles
- [ ] API keys, tokens, and credentials loaded exclusively from environment variables or a secrets manager
- [ ] Verify HSTS headers with `max-age ≥ 31536000; includeSubDomains; preload`

### 2.3 Supply Chain & Software Integrity (OWASP A03:2025)

- [ ] Audit all transitive dependencies for known vulnerabilities (`npm audit`, `pip audit`, etc.)
- [ ] Remove unused packages
- [ ] Check for obfuscated code or malicious post-install scripts in dependencies
- [ ] Pin dependency versions with lockfiles (`package-lock.json`, `poetry.lock`, etc.)
- [ ] Verify integrity of build artifacts with checksums or sigstore verification

### 2.4 Injection Prevention (OWASP A04:2025)

- [ ] All database queries use parameterized statements or ORM query builders — no string concatenation
- [ ] Sanitize all user input rendered in HTML to prevent XSS (use framework-native escaping)
- [ ] Validate and sanitize file upload filenames, MIME types, and content
- [ ] Command injection prevention on any shell-exec or subprocess calls

### 2.5 Security Misconfiguration (OWASP A05:2025)

- [ ] Remove default credentials, sample data, and debug endpoints from production
- [ ] Disable verbose error messages in production — return generic error responses to clients
- [ ] Enforce Content-Security-Policy (CSP) headers
- [ ] Set `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Disable directory listing and unnecessary HTTP methods

### 2.6 Vulnerable Components (OWASP A06:2025)

- [ ] No end-of-life frameworks, runtimes, or libraries
- [ ] Automated dependency update pipeline configured (Dependabot, Renovate, or equivalent)
- [ ] Runtime versions pinned and documented

### 2.7 Authentication & Session Failures (OWASP A07:2025)

- [ ] Session tokens are cryptographically random, rotated on privilege escalation
- [ ] Session fixation and session hijacking mitigated
- [ ] Logout fully invalidates server-side session state

### 2.8 Data Integrity Failures (OWASP A08:2025)

- [ ] CI/CD pipeline integrity verified — no unsigned artifacts deployed
- [ ] Deserialization of untrusted data is either forbidden or uses safe deserialization libraries

### 2.9 Logging & Monitoring Failures (OWASP A09:2025)

- [ ] All authentication events (login, logout, failed attempts, password changes) logged
- [ ] All access control failures logged with requestId and user context
- [ ] Alerts configured for anomalous patterns (brute force, privilege escalation attempts)
- [ ] Log retention policy defined and enforced (minimum 90 days)

### 2.10 Exceptional Conditions & Fail-Open Prevention (OWASP A10:2025)

- [ ] Audit every error handler — no "fail-open" logic where exceptions grant access
- [ ] Errors never expose sensitive data (stack traces, DB schemas, internal paths, API keys)
- [ ] All uncaught exception handlers return safe defaults and log the failure
- [ ] Race conditions in auth/authz flows identified and mitigated

### 2.11 NIST CSF 2.0 Controls Cross-Check

| Function | Control Area | Verification |
|----------|-------------|-------------|
| **Identify** | Asset inventory, risk assessment | All services, data stores, and third-party integrations cataloged |
| **Protect** | Access control, data security, training | RBAC, encryption, input validation all verified |
| **Detect** | Continuous monitoring, anomaly detection | Logging, alerting, and intrusion detection active |
| **Respond** | Incident response plan, communications | Runbooks exist for breach, outage, and data loss scenarios |
| **Recover** | Recovery planning, improvements | Backup/restore tested, RTO/RPO defined |
| **Govern** | Policy, risk strategy, supply chain | Security policies documented, third-party risk assessed |

### 2.12 CMMC 2.0 Level 2 Alignment (if applicable)

- [ ] Controlled Unclassified Information (CUI) handling procedures documented
- [ ] Access control (AC), Audit & Accountability (AU), and Configuration Management (CM) practices verified
- [ ] Incident Response (IR) and Risk Assessment (RA) capabilities confirmed

---

## PHASE 3 — AI-NATIVE THREAT DEFENSE & PROMPT INJECTION RESISTANCE

**Objective:** Harden all AI/LLM-integrated components against prompt injection, data exfiltration, and agentic abuse patterns.

### 3.1 Prompt Injection Defense (CRITICAL)

- [ ] **System prompts isolated** from user content and untrusted retrieved data
- [ ] Explicit instruction hierarchy enforced: retrieved docs and uploaded files treated as **untrusted data**, never executable instructions
- [ ] Input sanitization applied to all text entering LLM context windows
- [ ] Output sanitization applied to all AI-generated content before rendering (prevent XSS via AI output)
- [ ] Markdown, rich text, and AI outputs sanitized against injection payloads

### 3.2 Agentic Execution Safety

- [ ] **Doom-Loop Detection:** MD5 fingerprinting of tool calls — SYSTEM WARNING on 3rd repeat within a sliding window of 20 calls; approval-based pause on persistence
- [ ] **Chain-of-Thought audit trail:** Thinking/reasoning steps logged as structured data for post-hoc security review
- [ ] **Read-Only Planner subagent** enforced during exploration/planning phases — no write/delete access during discovery
- [ ] **Smart Nudge limit:** Maximum 3 recovery messages before escalation to human review

### 3.3 Multi-Tier Runtime Safety Architecture

| Layer | Defense Mechanism | Threat Mitigated |
|-------|------------------|-----------------|
| 1. Prompt-Level | System-enforced security policies, identity guardrails | Reasoning errors, instruction hijacking |
| 2. Schema-Level | Dual-agent separation (Read-only Planner vs. Executor) | Destructive actions during planning |
| 3. Runtime Approval | Manual gates for dangerous commands (`rm`, `push`, file writes) | Authorization bypass, accidental damage |
| 4. Tool Validation | Stale-read detection, pattern-based blocklists | Malicious shell commands, logic bombs |
| 5. Lifecycle Hooks | Pre-tool blocking scripts with exit-code 2 enforcement | Compliance violations, unapproved dependencies |

### 3.4 Malware Detection in Code Ingestion

- [ ] Malware scanning hook points active at **every file-write boundary**
- [ ] Strict rejection policy for: executable payloads, polyglot files, macro-enabled documents, scriptable SVG injection
- [ ] Uploaded files quarantined and scanned before processing
- [ ] File type validation by magic bytes, not just extension

### 3.5 Context Pressure Management

Enforce adaptive context compaction to prevent reasoning degradation under token pressure:

| Threshold | Action | Method |
|-----------|--------|--------|
| 70% | Warning | Alert system and user of rising context pressure |
| 80% | Observation Masking | Replace old tool results with lightweight references |
| 85% | Fast Pruning | Remove redundant observations and low-value metadata |
| 90% | Aggressive Masking | Summarize older conversation segments |
| 99% | Full Summarization | Truncate to concise strategic summary via `/compact` |

### 3.6 MCP & External Tool Hardening

- [ ] MCP connections restricted to **STDIO or Streamable HTTP with OAuth** only
- [ ] **Lazy Tool Discovery** via `search_tools` — tools registered only when a specific workflow requires them
- [ ] Tool schemas validated against allowlists before injection into agent context
- [ ] No tool auto-execution from untrusted context (retrieved docs, crawled pages, PR comments)

---

## PHASE 4 — SaaS COMPLIANCE & MULTI-TENANCY

**Objective:** Ensure architectural compliance with GDPR, SOC 2 Type II engineering controls, and robust tenant isolation.

### 4.1 Multi-Tenant Data Isolation

- [ ] Validate tenant partitioning model (Silo, Bridge, or Pool) — document which is used
- [ ] Mandatory `tenant_id` column in **every tenant-scoped table**
- [ ] `tenant_id` included in **every query** touching tenant data — no exceptions
- [ ] Row-Level Security (RLS) or equivalent enforced at the database layer
- [ ] Cross-tenant data access impossible through API, query, or join path
- [ ] Tenant isolation verified with explicit negative test cases

### 4.2 GDPR Compliance

| Article | Requirement | Implementation |
|---------|------------|---------------|
| Art. 5 | Data Minimization | Collect only necessary PII; audit and prune excess fields |
| Art. 6 | Lawful Basis | Consent mechanism or legitimate interest documented for each data category |
| Art. 12-14 | Transparency | Privacy policy accessible, accurate, and up-to-date |
| Art. 15 | Right of Access | Data export endpoint functional, returns complete user data |
| Art. 17 | Right to Erasure | Automated deletion workflow tested end-to-end, including backups and logs |
| Art. 25 | Privacy by Design | Default settings are privacy-preserving; no dark patterns |
| Art. 30 | Records of Processing | Tamper-proof, immutable audit trail for all data processing activities |
| Art. 32 | Security of Processing | Encryption, access control, and incident response verified |
| Art. 33-34 | Breach Notification | Notification procedure documented with 72-hour timeline |

### 4.3 SOC 2 Type II Engineering Controls

- [ ] **CC6.1:** Logical access controls — MFA, RBAC, least privilege verified
- [ ] **CC6.2:** Authentication mechanisms — session management, token lifecycle
- [ ] **CC6.3:** Access revocation — deprovisioning within defined SLA
- [ ] **CC7.1:** System monitoring — anomaly detection, alerting, log aggregation
- [ ] **CC7.2:** Incident detection — automated pattern recognition for security events
- [ ] **CC8.1:** Change management — code review, approval gates, rollback procedures
- [ ] **A1.2:** Availability — health checks, auto-recovery, defined RTO/RPO

---

## PHASE 5 — DATABASE & SCALABILITY VERIFICATION

**Objective:** Zero N+1 queries, proper indexing, safe migrations, verified connection management.

### 5.1 Query Safety & Performance

- [ ] Identify and eliminate all **N+1 query problems** — use eager loading, JOINs, or batch fetching
- [ ] All queries are **parameterized** — no string concatenation for SQL construction
- [ ] Proper indexing on: primary keys, foreign keys, columns used in `WHERE`/`JOIN`/`ORDER BY` clauses
- [ ] Composite indexes added where query patterns warrant them
- [ ] **Cursor-based pagination** implemented for all list endpoints (no offset pagination for large datasets)
- [ ] Query execution plans reviewed for critical paths — no full table scans on large tables

### 5.2 Connection Management

- [ ] Connection pooling configured correctly (min/max pool size, idle timeout, connection lifetime)
- [ ] SSL/TLS enabled for all production database connections
- [ ] Connection strings loaded from environment variables, never hardcoded
- [ ] Health check queries configured for pool validation

### 5.3 Migration Safety

- [ ] All migrations are sequential, idempotent, and reversible
- [ ] Destructive migrations (column drops, table drops) are separated and require explicit approval
- [ ] Migration lock handling prevents concurrent migration execution
- [ ] Rollback tested for every migration

### 5.4 Atomic Transactions

- [ ] Multi-step agent/API actions wrapped in **atomic transactions** (e.g., updating a policy and its audit log)
- [ ] Transaction isolation level appropriate for each operation (default: READ COMMITTED minimum)
- [ ] Deadlock detection and retry logic implemented for concurrent write paths

---

## PHASE 6 — STRIPE BILLING VERIFICATION

**Objective:** Billing infrastructure is production-safe, idempotent, transparent, and tamper-resistant.

### 6.1 Configuration & Secrets

- [ ] `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` loaded **exclusively** from environment variables
- [ ] Verify correct key format: `sk_live_*` for production, `sk_test_*` for staging — never mixed
- [ ] Test-mode keys **never** present in production environment
- [ ] Stripe API version pinned and documented

### 6.2 Checkout & Subscription Lifecycle

- [ ] Checkout session creation verified end-to-end (create → redirect → success/cancel)
- [ ] Webhook handler processes all critical events idempotently:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid` / `invoice.payment_failed`
- [ ] **Idempotency:** Duplicate webhook deliveries produce no side effects
- [ ] **Atomicity:** Subscription state changes and database updates in single transaction
- [ ] Failed payment → grace period → downgrade/suspension flow tested

### 6.3 Pricing Transparency

- [ ] Public pricing page plan names, amounts, and billing frequency **exactly match** internal pricing constants
- [ ] Renewal behaviors, trial periods, and cancellation terms clearly stated
- [ ] No hidden fees or undisclosed charges
- [ ] Price ID mapping verified between Stripe dashboard and application code

### 6.4 Customer Portal & Self-Service

- [ ] Customer can view invoices, update payment method, and cancel subscription
- [ ] Cancellation flow respects pro-rata billing and end-of-period access

---

## PHASE 7 — SEO & PUBLIC SITE FUNCTIONALITY

**Objective:** Search engine readiness, structured data integrity, and public-facing functionality verified.

### 7.1 Crawlability & Indexing

- [ ] `robots.txt` present at domain root — verified for correct allow/disallow rules
- [ ] `sitemap.xml` present, valid, and includes all indexable pages
- [ ] Sitemap submitted to Google Search Console (or submission documented)
- [ ] No critical pages blocked by robots.txt or `noindex` meta tags unintentionally

### 7.2 On-Page SEO

- [ ] Every key public page has:
  - Unique `<title>` tag (50-60 characters)
  - Unique `<meta name="description">` (150-160 characters)
  - Exactly one `<h1>` tag
  - Correct `<link rel="canonical">` tag
- [ ] Open Graph and Twitter Card meta tags present for social sharing
- [ ] Image alt attributes descriptive and present on all meaningful images
- [ ] Internal linking structure verified — no orphaned pages

### 7.3 Structured Data (JSON-LD)

- [ ] Implement and validate JSON-LD structured data schemas as appropriate:
  - `Organization` (company identity)
  - `WebSite` (site-level search)
  - `Product` / `Offer` (pricing pages)
  - `FAQPage` (FAQ sections)
  - `BreadcrumbList` (navigation)
- [ ] **STRICT:** Schema content accurately reflects visible on-page content
- [ ] **STRICT:** No fake reviews, unsupported claims, or schema spam
- [ ] Validate all schemas with Google Rich Results Test

### 7.4 Site Functionality

- [ ] Contact forms have rate-limiting and spam protection (CAPTCHA, honeypot, or equivalent)
- [ ] Mobile layouts responsive and functional across viewport sizes
- [ ] Footer contains consistent legal/contact identity sitewide
- [ ] All external links use `rel="noopener noreferrer"` where appropriate
- [ ] 404 page customized and helpful
- [ ] Page load performance: LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## PHASE 8 — TEST SUITE & COVERAGE

**Objective:** Achieve 80%+ unit coverage with integration, E2E, load, and security test suites.

### 8.1 Unit Tests

- [ ] 80%+ line coverage across all modules
- [ ] All critical business logic paths covered with positive and negative cases
- [ ] Edge cases: empty inputs, boundary values, malformed data, concurrent access

### 8.2 Integration Tests

- [ ] API route tests covering all CRUD operations with auth and error scenarios
- [ ] Database integration tests verifying query correctness, transaction behavior, and tenant isolation
- [ ] Third-party integration tests (Stripe, email, storage) with mocked external services

### 8.3 End-to-End Tests

- [ ] Full user journey: signup → onboarding → core feature usage → billing → cancellation
- [ ] Auth flows: login, logout, password reset, MFA enrollment
- [ ] Billing flows: checkout, upgrade, downgrade, cancellation, failed payment recovery

### 8.4 Security Tests

- [ ] Prompt injection resistance — test with known injection payloads
- [ ] Auth bypass attempts — test direct API access without tokens, expired tokens, wrong roles
- [ ] SQL injection — test with SQLi payloads on all input parameters
- [ ] XSS — test with script injection payloads on all rendered outputs
- [ ] SSRF — test with internal URL payloads on all URL-accepting inputs
- [ ] Tenant isolation — test cross-tenant data access attempts

### 8.5 Load & Stress Tests

- [ ] Concurrent user simulation at 2x expected peak load
- [ ] Database connection pool behavior under load verified
- [ ] Webhook processing throughput under burst conditions
- [ ] Memory and CPU profiling under sustained load

---

## PHASE 9 — DEPLOYMENT READINESS

**Objective:** Application is deployable, observable, and recoverable in production.

### 9.1 Runtime Configuration

- [ ] Application binds to `process.env.PORT` on `0.0.0.0`
- [ ] Graceful shutdown handler: drain active connections within 10s on `SIGTERM`
- [ ] Health check endpoint (`/health` or `/healthz`) returns application, database, and dependency status
- [ ] Readiness probe endpoint separate from liveness probe

### 9.2 Environment & Secrets

- [ ] All secrets loaded from environment variables or secrets manager — zero hardcoded values
- [ ] `.env.example` or `railway.env.example` documents all required environment variables
- [ ] Production, staging, and development environments use isolated credentials
- [ ] No `.env` files committed to source control (verify `.gitignore`)

### 9.3 Deployment Artifacts

- [ ] `Dockerfile` or `nixpacks.toml` or platform-specific config validated
- [ ] `railway.json` (Railway), `fly.toml` (Fly.io), `coolify.yaml` (Coolify), or equivalent deployment manifest present
- [ ] Build process produces deterministic, reproducible artifacts
- [ ] Container image size optimized (multi-stage builds where applicable)

### 9.4 Observability

- [ ] Application metrics exported (request rate, error rate, latency percentiles)
- [ ] Log aggregation configured and verified
- [ ] Alerting rules configured for: error rate spikes, latency degradation, resource exhaustion
- [ ] Distributed tracing enabled for multi-service architectures

### 9.5 Backup & Recovery

- [ ] Database backup schedule configured and tested
- [ ] Backup restoration tested with documented procedure
- [ ] RTO (Recovery Time Objective) and RPO (Recovery Point Objective) defined and achievable
- [ ] Disaster recovery runbook documented

### 9.6 Git Worktree Isolation (Agentic Deployments)

- [ ] All agentic code changes executed in **Git Worktrees** — isolated from main branch until reviewed
- [ ] Shadow Git Snapshots capture filesystem state before and after every agent action
- [ ] 100% auditable undo-management via snapshot history

---

## PHASE 10 — AUDIT REPORT GENERATION

**Objective:** Produce complete audit documentation as deployable artifacts.

### Required Deliverables

Generate the following files in the repository root:

| # | Artifact | Contents |
|---|----------|----------|
| 1 | **Fully patched codebase** | Zero TODOs, zero placeholders, all issues fixed in-place |
| 2 | `AUDIT_REPORT.md` | Comprehensive findings by severity (Critical / High / Medium / Low / Info) across all phases |
| 3 | `SECURITY_AUDIT_REPORT.md` | Detailed security findings: OWASP mapping, AI threat defense, NIST CSF alignment, remediation evidence |
| 4 | `SEO_AUDIT_REPORT.md` | Crawlability, metadata, structured data, performance findings with before/after |
| 5 | `PRODUCTION_CHECKLIST.md` | Pass/fail checklist: tests, deployment safety, DB connections, billing, platform readiness |
| 6 | `COMPLIANCE_MATRIX.md` | Cross-reference matrix mapping controls to OWASP 2025, NIST CSF 2.0, CMMC 2.0, SOC 2, GDPR, ASVS 5.0 |

### Report Severity Classification

| Severity | Definition | SLA |
|----------|-----------|-----|
| **CRITICAL** | Exploitable vulnerability, data breach risk, billing integrity failure | Fix immediately — blocks deployment |
| **HIGH** | Security misconfiguration, missing auth checks, fail-open logic | Fix before deployment |
| **MEDIUM** | Performance issues, missing tests, SEO gaps, logging gaps | Fix within first sprint post-launch |
| **LOW** | Code style, minor UX issues, non-blocking improvements | Fix within 30 days |
| **INFO** | Recommendations, best practices, future considerations | Track in backlog |

---

## EXECUTION INSTRUCTIONS

```
1. Read the entire codebase before making any changes.
2. Execute phases 0-10 sequentially. Do not skip any phase.
3. Fix every issue in-place as you discover it.
4. Log every finding with severity, location, description, and fix applied.
5. Generate all deliverable artifacts upon completion.
6. Do not ask for confirmation between phases.
7. If a phase reveals issues requiring re-evaluation of a prior phase, go back and fix.
8. BEGIN.
```
