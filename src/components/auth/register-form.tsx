"use client";

import React, { useState } from "react";

import { trackSignupCompleted, trackSignupStarted } from "@/lib/analytics/gtm";
import { tokens } from "@/lib/design/tokens";

function inputStyle() {
  return {
    width: "100%",
    backgroundColor: tokens.colors.surfaceElevated,
    color: tokens.colors.text,
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.radius.control,
    padding: "12px 14px",
    fontSize: "15px",
  };
}

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    trackSignupStarted();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const payload = (await response.json()) as { error?: string; email?: string };

      if (!response.ok) {
        setError(payload.error ?? "Registration failed.");
        return;
      }

      trackSignupCompleted();
      setMessage(`Account created for ${payload.email ?? email}. Sign in to continue.`);
      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setError("Registration failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: "14px" }}>
      <label style={{ display: "grid", gap: "8px" }}>
        <span>Name</span>
        <input value={name} onChange={(event) => setName(event.target.value)} style={inputStyle()} />
      </label>
      <label style={{ display: "grid", gap: "8px" }}>
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={inputStyle()}
        />
      </label>
      <label style={{ display: "grid", gap: "8px" }}>
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={inputStyle()}
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        style={{
          padding: "12px 16px",
          borderRadius: tokens.radius.control,
          backgroundColor: tokens.colors.primary,
          color: "#001418",
          fontWeight: 700,
          border: "none",
        }}
      >
        {busy ? "Creating..." : "Create account"}
      </button>
      {error ? <p style={{ margin: 0, color: "#F87171" }}>{error}</p> : null}
      {message ? <p style={{ margin: 0, color: tokens.colors.primary }}>{message}</p> : null}
    </form>
  );
}
