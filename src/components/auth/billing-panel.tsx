"use client";

import React, { useEffect, useState } from "react";

import { BILLING_PLANS } from "@/lib/billing/plans";
import { tokens } from "@/lib/design/tokens";

type SessionPayload = {
  authenticated: boolean;
  user: null | {
    email: string;
    role: string;
    plan: string;
  };
};

export function BillingPanel() {
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyPlan, setBusyPlan] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      const response = await fetch("/api/auth/session");
      const payload = (await response.json()) as SessionPayload;

      if (!cancelled) {
        setSession(payload);
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function startCheckout(planId: string) {
    setBusyPlan(planId);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: window.location.origin,
        },
        body: JSON.stringify({ planId }),
      });
      const payload = (await response.json()) as { error?: string; checkoutUrl?: string };

      if (!response.ok || !payload.checkoutUrl) {
        setError(payload.error ?? "Checkout failed.");
        return;
      }

      window.location.href = payload.checkoutUrl;
    } catch {
      setError("Checkout failed.");
    } finally {
      setBusyPlan(null);
    }
  }

  async function openPortal() {
    setBusyPlan("portal");
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
        headers: {
          origin: window.location.origin,
        },
      });
      const payload = (await response.json()) as { error?: string; portalUrl?: string };

      if (!response.ok || !payload.portalUrl) {
        setError(payload.error ?? "Portal launch failed.");
        return;
      }

      window.location.href = payload.portalUrl;
    } catch {
      setError("Portal launch failed.");
    } finally {
      setBusyPlan(null);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        origin: window.location.origin,
      },
    });
    setSession({
      authenticated: false,
      user: null,
    });
    setMessage("Signed out.");
  }

  if (!session) {
    return <p style={{ margin: 0 }}>Loading account state...</p>;
  }

  if (!session.authenticated || !session.user) {
    return (
      <div style={{ display: "grid", gap: "12px" }}>
        <p style={{ margin: 0, color: tokens.colors.textSecondary }}>
          Sign in first to start checkout or open the customer portal.
        </p>
        {error ? <p style={{ margin: 0, color: "#F87171" }}>{error}</p> : null}
        {message ? <p style={{ margin: 0, color: tokens.colors.primary }}>{message}</p> : null}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "18px" }}>
      <div
        style={{
          display: "grid",
          gap: "6px",
          paddingBottom: "14px",
          borderBottom: `1px solid ${tokens.colors.divider}`,
        }}
      >
        <strong>{session.user.email}</strong>
        <span style={{ color: tokens.colors.textSecondary }}>
          Role: {session.user.role} / Plan: {session.user.plan}
        </span>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {BILLING_PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => startCheckout(plan.id)}
            disabled={busyPlan !== null}
            style={{
              textAlign: "left",
              padding: "14px 16px",
              borderRadius: tokens.radius.control,
              border: `1px solid ${tokens.colors.border}`,
              backgroundColor: tokens.colors.surfaceElevated,
              color: tokens.colors.text,
            }}
          >
            <strong>{plan.name}</strong> / {plan.price}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={openPortal}
          disabled={busyPlan !== null}
          style={{
            padding: "12px 16px",
            borderRadius: tokens.radius.control,
            border: `1px solid ${tokens.colors.border}`,
            backgroundColor: "transparent",
            color: tokens.colors.text,
          }}
        >
          Open billing portal
        </button>
        <button
          onClick={logout}
          disabled={busyPlan !== null}
          style={{
            padding: "12px 16px",
            borderRadius: tokens.radius.control,
            border: `1px solid ${tokens.colors.border}`,
            backgroundColor: "transparent",
            color: tokens.colors.textSecondary,
          }}
        >
          Sign out
        </button>
      </div>

      {error ? <p style={{ margin: 0, color: "#F87171" }}>{error}</p> : null}
      {message ? <p style={{ margin: 0, color: tokens.colors.primary }}>{message}</p> : null}
    </div>
  );
}
