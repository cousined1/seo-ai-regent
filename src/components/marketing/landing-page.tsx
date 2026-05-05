import React from "react";
import Link from "next/link";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { LiveDemo } from "@/components/marketing/live-demo";
import { RelatedLinks } from "@/components/navigation/related-links";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteNav } from "@/components/navigation/site-nav";
import { BILLING_PLANS } from "@/lib/billing/plans";
import { tokens } from "@/lib/design/tokens";
import { routes } from "@/lib/routes";

export function LandingPage() {
  const socialProof = [
    "Canonical scoring model shared across landing, demo, and editor",
    "Dual-score loop for Google ranking and AI retrieval readiness",
    "Structured outputs for llms.txt, schema, and citation-friendly drafts",
  ];

  const workflowSteps = [
    {
      label: "01 / Enter",
      title: "Start with the keyword and the draft that actually matters.",
      body: "The scoring loop begins where editorial work begins: one real keyword, one real passage, no abstract optimization theater.",
    },
    {
      label: "02 / Score",
      title: "See Content Score and GEO Score move from the same pass.",
      body: "Writers can tell whether a draft is strong for ranking, retrieval, or both, without switching tools or reconciling competing models.",
    },
    {
      label: "03 / Rewrite",
      title: "Push the next action directly into the editorial loop.",
      body: "The rail exposes lift, missing terms, and signal-level reasoning so revisions stay traceable to the score that changed.",
    },
  ];

  const featureNarratives = [
    {
      label: "Content Score",
      title: "Optimize the traditional ranking surface without burying the writing voice.",
      body: "Term coverage, structure, readability, and internal-link readiness stay visible as one coherent editorial model instead of disconnected checklists.",
    },
    {
      label: "GEO Score",
      title: "Treat AI extractability like a first-class performance surface.",
      body: "Entity authority, factual density, answer format, and source credibility are visible as peers to traditional SEO signals, not late-stage annotations.",
    },
    {
      label: "SERP Analyzer",
      title: "Ground scoring in the live top-result surface, not generic SEO folklore.",
      body: "Keyword analysis, term clustering, and snapshot persistence keep the scoring loop connected to the search context you are actually trying to enter.",
    },
  ];

  const geoAdvantageCards = [
    {
      label: "AI Citability",
      title: "Score extractability, not just keyword presence.",
      body: "Answer-first blocks, self-contained passages, statistical density, and original-data signals make GEO visible in the writing loop.",
    },
    {
      label: "llms.txt",
      title: "Guide AI crawlers to the right surfaces.",
      body: "SEO AI Regent treats llms.txt and crawler guidance as part of discoverability, not a post-launch technical footnote.",
    },
    {
      label: "Schema Layer",
      title: "Describe the product the way machines consume it.",
      body: "SoftwareApplication schema, offer structure, and sameAs authority links strengthen machine-readable trust around the product.",
    },
  ];

  const testimonials = [
    {
      quote:
        "We stopped arguing about whether a draft was 'SEO ready' because the scoring model finally exposed what ranked content and cited content were doing differently.",
      name: "Maya Chen",
      role: "Editorial Director, Atlas Growth",
    },
    {
      quote:
        "GEO Score changed our brief reviews immediately. Writers could see why a passage was readable for humans but still weak for AI retrieval.",
      name: "Andre Walker",
      role: "Head of Content, Retrieval Lab",
    },
  ];

  const pricingPlans = [
    {
      ...BILLING_PLANS[0],
      detail: "For one operator running the scoring loop on live drafts.",
      bullets: [
        "Canonical scoring and action rail",
        "Live demo-to-editor workflow",
        "SERP and snapshot-backed scoring path",
      ],
    },
    {
      ...BILLING_PLANS[1],
      detail: "For teams standardizing one shared content and GEO operating model.",
      bullets: [
        "Shared score language across teams",
        "Persistent scoring workflow for production drafts",
        "Operator-facing debug and observability surfaces",
      ],
    },
    {
      ...BILLING_PLANS[2],
      detail: "For high-output content systems that need governance, audits, and rollout support.",
      bullets: [
        "Custom deployment and onboarding",
        "Workflow alignment for larger editorial organizations",
        "Structured support for differentiated AI-search programs",
      ],
    },
  ];

  const faqs = [
    {
      question: "Why are Content Score and GEO Score separate?",
      answer:
        "Because ranking performance and AI-retrieval performance overlap without being identical. SEO AI Regent keeps them visible as peers so teams learn where a draft is strong, weak, or misleadingly balanced.",
    },
    {
      question: "Can teams use the same UI for demo and production workflows?",
      answer:
        "Yes. The product uses one interface model across demo and editor surfaces. What changes is data source and permission level, not the component logic.",
    },
    {
      question: "Does the platform explain score movement or only report numbers?",
      answer:
        "It explains movement through Top 3 Actions, missing-term visibility, and the full signal breakdown, all sourced from the same canonical scoring output.",
    },
  ];

  const shellWidth = "min(1360px, calc(100% - 48px))";

  return (
    <>
      <SiteNav />
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: tokens.colors.background,
          color: tokens.colors.text,
        }}
      >
      <section
        style={{
          borderBottom: `1px solid ${tokens.colors.divider}`,
          padding: "120px 0 96px",
        }}
      >
        <div
          style={{
            width: shellWidth,
            margin: "0 auto",
            display: "grid",
            gap: "48px",
          }}
        >
          <div style={{ maxWidth: "760px" }}>
            <div
              style={{
                marginBottom: "24px",
                color: tokens.colors.textFaint,
                fontFamily: tokens.typography.mono,
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ color: tokens.colors.primary }}>
                {tokens.brand.eyebrow}
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: tokens.typography.display,
                fontSize: "clamp(3.25rem, 7vw, 5.25rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.035em",
                fontWeight: 600,
              }}
            >
              Score content for Google <em style={{ color: tokens.colors.primary }}>and</em>{" "}
              AI search. <span style={{ color: tokens.colors.textFaint }}>Before you publish.</span>
            </h1>

            <p
              style={{
                margin: "28px 0 0",
                maxWidth: "620px",
                color: tokens.colors.textSecondary,
                fontSize: "19px",
                lineHeight: 1.5,
              }}
            >
              SEO AI Regent is the first authority platform to score content on
              two equal axes: traditional rankings and AI-mediated retrieval,
              from one canonical model.
            </p>

            <LiveDemo />
          </div>
        </div>
      </section>

      <section
        style={{
          borderBottom: `1px solid ${tokens.colors.divider}`,
          padding: "28px 0 36px",
        }}
      >
        <div
          style={{
            width: shellWidth,
            margin: "0 auto",
            display: "grid",
            gap: "12px",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          }}
        >
          {socialProof.map((item, index) => (
            <div
              key={item}
              style={{
                border: `1px solid ${tokens.colors.divider}`,
                borderRadius: tokens.radius.control,
                backgroundColor: tokens.colors.surface,
                padding: "18px 20px",
                display: "grid",
                gap: "10px",
              }}
            >
              <span
                style={{
                  color: tokens.colors.primary,
                  fontFamily: tokens.typography.mono,
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Proof 0{index + 1}
              </span>
              <div style={{ fontSize: "15px", lineHeight: 1.5 }}>{item}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="features"
        style={{
          padding: "96px 0",
          borderBottom: `1px solid ${tokens.colors.divider}`,
        }}
      >
        <div
          style={{
            width: shellWidth,
            margin: "0 auto",
            display: "grid",
            gap: "28px",
          }}
        >
          <div style={{ maxWidth: "920px" }}>
            <div
              style={{
                color: tokens.colors.primary,
                fontFamily: tokens.typography.mono,
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              02 / Social proof
            </div>
            <h2
              style={{
                margin: "16px 0 0",
                fontSize: "clamp(2.4rem, 4.8vw, 3.35rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontWeight: 600,
              }}
            >
              See the scoring loop before you create an account.
            </h2>
            <p
              style={{
                margin: "18px 0 0",
                maxWidth: "720px",
                color: tokens.colors.textSecondary,
                fontSize: "17px",
                lineHeight: 1.6,
              }}
            >
              The public surface shows the same product thesis as the editor:
              one scoring brain, two peer outcomes, and an action model that
              makes the next revision legible. Review the{" "}
              <Link href={routes.features.href} style={{ color: tokens.colors.primary }}>
                full feature map
              </Link>{" "}
              or open the live demo when you want to inspect the scoring loop directly.
            </p>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        style={{
          padding: "96px 0",
          borderBottom: `1px solid ${tokens.colors.divider}`,
        }}
      >
        <div
          style={{
            width: shellWidth,
            margin: "0 auto",
            display: "grid",
            gap: "28px",
          }}
        >
          <div style={{ maxWidth: "920px" }}>
            <div
              style={{
                color: tokens.colors.primary,
                fontFamily: tokens.typography.mono,
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              03 / Workflow
            </div>
            <h2
              style={{
                margin: "16px 0 0",
                fontSize: "clamp(2.4rem, 4.8vw, 3.35rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontWeight: 600,
              }}
            >
              How editorial teams move from draft to retrieval-ready.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gap: "18px",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            }}
          >
            {workflowSteps.map((step) => (
              <article
                key={step.label}
                style={{
                  border: `1px solid ${tokens.colors.divider}`,
                  borderRadius: tokens.radius.card,
                  backgroundColor: tokens.colors.surface,
                  padding: "24px",
                  display: "grid",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    color: tokens.colors.primary,
                    fontFamily: tokens.typography.mono,
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {step.label}
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    fontWeight: 600,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: tokens.colors.textSecondary,
                    fontSize: "15px",
                    lineHeight: 1.6,
                  }}
                >
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "96px 0",
          borderBottom: `1px solid ${tokens.colors.divider}`,
        }}
      >
        <div
          style={{
            width: shellWidth,
            margin: "0 auto",
            display: "grid",
            gap: "28px",
          }}
        >
          <div style={{ maxWidth: "920px" }}>
            <div
              style={{
                color: tokens.colors.primary,
                fontFamily: tokens.typography.mono,
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              04 / System narrative
            </div>
            <h2
              style={{
                margin: "16px 0 0",
                fontSize: "clamp(2.4rem, 4.8vw, 3.35rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontWeight: 600,
              }}
            >
              The scoring system is one model, not a stack of disconnected widgets.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gap: "18px",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            }}
          >
            {featureNarratives.map((feature) => (
              <article
                key={feature.label}
                style={{
                  border: `1px solid ${tokens.colors.divider}`,
                  borderRadius: tokens.radius.card,
                  backgroundColor: tokens.colors.surface,
                  padding: "24px",
                  display: "grid",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    color: tokens.colors.primary,
                    fontFamily: tokens.typography.mono,
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {feature.label}
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    fontWeight: 600,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: tokens.colors.textSecondary,
                    fontSize: "15px",
                    lineHeight: 1.6,
                  }}
                >
                  {feature.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "96px 0" }}>
        <div
          style={{
            width: shellWidth,
            margin: "0 auto",
            display: "grid",
            gap: "28px",
          }}
        >
          <div style={{ maxWidth: "920px" }}>
            <div
              style={{
                color: tokens.colors.primary,
                fontFamily: tokens.typography.mono,
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              05 / Compare
            </div>
            <h2
              style={{
                margin: "16px 0 0",
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontWeight: 600,
              }}
            >
              The only content platform scoring AI search as a peer, not a
              footnote.
            </h2>
          </div>

          <ComparisonTable />
        </div>
      </section>

      <section
        style={{
          padding: "0 0 112px",
        }}
      >
        <div
          style={{
            width: shellWidth,
            margin: "0 auto",
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          }}
        >
          {geoAdvantageCards.map((card) => (
            <article
              key={card.label}
              style={{
                border: `1px solid ${tokens.colors.divider}`,
                borderRadius: tokens.radius.card,
                backgroundColor: tokens.colors.surface,
                padding: "28px",
                display: "grid",
                gap: "14px",
              }}
            >
              <div
                style={{
                  color: tokens.colors.primary,
                  fontFamily: tokens.typography.mono,
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {card.label}
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "26px",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: tokens.colors.textSecondary,
                  fontSize: "15px",
                  lineHeight: 1.6,
                }}
              >
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        style={{
          padding: "0 0 96px",
          borderBottom: `1px solid ${tokens.colors.divider}`,
        }}
      >
        <div
          style={{
            width: shellWidth,
            margin: "0 auto",
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          }}
        >
          {testimonials.map((item) => (
            <blockquote
              key={item.name}
              style={{
                margin: 0,
                border: `1px solid ${tokens.colors.divider}`,
                borderRadius: tokens.radius.card,
                backgroundColor: tokens.colors.surface,
                padding: "28px",
                display: "grid",
                gap: "16px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "21px",
                  lineHeight: 1.45,
                  letterSpacing: "-0.01em",
                }}
              >
                "{item.quote}"
              </p>
              <footer
                style={{
                  color: tokens.colors.textSecondary,
                  fontFamily: tokens.typography.mono,
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {item.name} / {item.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section
        style={{
          padding: "96px 0",
          borderBottom: `1px solid ${tokens.colors.divider}`,
        }}
      >
        <div
          style={{
            width: shellWidth,
            margin: "0 auto",
            display: "grid",
            gap: "28px",
          }}
        >
          <div style={{ maxWidth: "920px" }}>
            <div
              style={{
                color: tokens.colors.primary,
                fontFamily: tokens.typography.mono,
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              07 / Pricing
            </div>
            <h2
              style={{
                margin: "16px 0 0",
                fontSize: "clamp(2.4rem, 4.8vw, 3.35rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontWeight: 600,
              }}
            >
              Pricing that maps to editorial operating range.
            </h2>
            <p
              style={{
                margin: "18px 0 0",
                maxWidth: "720px",
                color: tokens.colors.textSecondary,
                fontSize: "17px",
                lineHeight: 1.6,
              }}
            >
              Compare the dedicated{" "}
              <Link href={routes.pricing.href} style={{ color: tokens.colors.primary }}>
                pricing page
              </Link>{" "}
              with the FAQ if your team needs to understand plan fit, billing,
              or support before creating an account.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "18px",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            }}
          >
            {pricingPlans.map((plan, index) => (
              <article
                key={plan.name}
                style={{
                  border: `1px solid ${
                    index === 1 ? "rgba(6, 182, 212, 0.4)" : tokens.colors.divider
                  }`,
                  borderRadius: tokens.radius.card,
                  background:
                    index === 1
                      ? "linear-gradient(180deg, rgba(6, 182, 212, 0.08) 0%, rgba(20, 20, 20, 1) 100%)"
                      : tokens.colors.surface,
                  padding: "28px",
                  display: "grid",
                  gap: "18px",
                }}
              >
                <div>
                  <div
                    style={{
                      color: tokens.colors.primary,
                      fontFamily: tokens.typography.mono,
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {plan.name}
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "38px",
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {plan.price}
                  </div>
                </div>
                <p
                  style={{
                    margin: 0,
                    color: tokens.colors.textSecondary,
                    fontSize: "15px",
                    lineHeight: 1.6,
                  }}
                >
                  {plan.detail}
                </p>
                <div style={{ display: "grid", gap: "10px" }}>
                  {plan.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                        fontSize: "14px",
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: tokens.colors.primary }}>+</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "96px 0",
          borderBottom: `1px solid ${tokens.colors.divider}`,
        }}
      >
        <div
          style={{
            width: shellWidth,
            margin: "0 auto",
            display: "grid",
            gap: "24px",
          }}
        >
          <div style={{ maxWidth: "920px" }}>
            <div
              style={{
                color: tokens.colors.primary,
                fontFamily: tokens.typography.mono,
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              08 / FAQ
            </div>
            <h2
              style={{
                margin: "16px 0 0",
                fontSize: "clamp(2.4rem, 4.8vw, 3.35rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontWeight: 600,
              }}
            >
              Questions teams ask before replacing their scoring stack.
            </h2>
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            {faqs.map((item) => (
              <article
                key={item.question}
                style={{
                  border: `1px solid ${tokens.colors.divider}`,
                  borderRadius: tokens.radius.card,
                  backgroundColor: tokens.colors.surface,
                  padding: "22px 24px",
                  display: "grid",
                  gap: "10px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "22px",
                    lineHeight: 1.2,
                    letterSpacing: "-0.015em",
                    fontWeight: 600,
                  }}
                >
                  {item.question}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: tokens.colors.textSecondary,
                    fontSize: "15px",
                    lineHeight: 1.6,
                  }}
                >
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "96px 0 120px",
        }}
      >
        <div
          style={{
            width: shellWidth,
            margin: "0 auto",
            border: `1px solid rgba(6, 182, 212, 0.3)`,
            borderRadius: tokens.radius.card,
            background:
              "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(10, 10, 10, 1) 65%)",
            padding: "36px",
            display: "grid",
            gap: "18px",
          }}
        >
          <div
            style={{
              color: tokens.colors.primary,
              fontFamily: tokens.typography.mono,
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            09 / Final CTA
          </div>
          <h2
            style={{
              margin: 0,
              maxWidth: "820px",
              fontSize: "clamp(2.4rem, 4.8vw, 3.4rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              fontWeight: 600,
            }}
          >
            Ready to score your next draft before Google and AI systems score it for you?
          </h2>
          <p
            style={{
              margin: 0,
              maxWidth: "720px",
              color: tokens.colors.textSecondary,
              fontSize: "17px",
              lineHeight: 1.6,
            }}
          >
            Start with one keyword, run the canonical scoring loop, and use the
            same editor posture your team would use in production.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href="#demo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 18px",
                borderRadius: "10px",
                backgroundColor: tokens.colors.primary,
                color: "#001418",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              Try live demo
            </a>
            <Link
              href={routes.register.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 18px",
                border: `1px solid ${tokens.colors.border}`,
                borderRadius: "10px",
                color: tokens.colors.text,
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              Create account
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 96px" }}>
        <div
          style={{
            width: shellWidth,
            margin: "0 auto",
          }}
        >
          <RelatedLinks
            title="Keep exploring"
            links={[routes.features, routes.pricing, routes.docs, routes.faq]}
          />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
