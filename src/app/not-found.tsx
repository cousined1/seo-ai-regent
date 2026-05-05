import Link from "next/link";

import { tokens } from "@/lib/design/tokens";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundColor: tokens.colors.background,
        color: tokens.colors.text,
        padding: "32px",
      }}
    >
      <div
        style={{
          width: "min(560px, 100%)",
          display: "grid",
          gap: "16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: tokens.colors.primary,
            fontFamily: tokens.typography.mono,
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          404 / Page Not Found
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          The requested surface is not part of the published scoring system.
        </h1>
        <p
          style={{
            margin: 0,
            color: tokens.colors.textSecondary,
            fontSize: "17px",
            lineHeight: 1.6,
          }}
        >
          Return to the landing page, compare pricing, or open support to
          continue reviewing how SEO AI Regent scores content for Google and AI
          retrieval.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
            <Link
            href={routes.home.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 18px",
              borderRadius: tokens.radius.control,
              backgroundColor: tokens.colors.primary,
              color: "#001418",
              fontWeight: 700,
            }}
          >
            Return home
          </Link>
          <Link
            href={routes.pricing.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 18px",
              borderRadius: tokens.radius.control,
              border: `1px solid ${tokens.colors.border}`,
              color: tokens.colors.text,
              fontWeight: 600,
            }}
          >
            View pricing
          </Link>
          <Link
            href={routes.support.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 18px",
              borderRadius: tokens.radius.control,
              border: `1px solid ${tokens.colors.border}`,
              color: tokens.colors.text,
              fontWeight: 600,
            }}
          >
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
}
