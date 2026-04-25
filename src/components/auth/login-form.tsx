"use client";

import React, { useState } from "react";

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

export function LoginForm(props: { resetToken?: string }) {
  const resetToken = props.resetToken ?? "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          otp,
        }),
      });
      const payload = (await response.json()) as { error?: string; user?: { email: string } };

      if (!response.ok) {
        setError(payload.error ?? "Login failed.");
        return;
      }

      setMessage(`Signed in as ${payload.user?.email ?? email}. Open /account/billing to manage the account.`);
    } catch {
      setError("Login failed.");
    } finally {
      setBusy(false);
    }
  }

  async function submitReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: resetToken,
          password: resetPassword,
        }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Password reset failed.");
        return;
      }

      setMessage("Password updated. Sign in with the new password.");
      setResetPassword("");
    } catch {
      setError("Password reset failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {resetToken ? (
        <form onSubmit={submitReset} style={{ display: "grid", gap: "14px" }}>
          <label style={{ display: "grid", gap: "8px" }}>
            <span>New password</span>
            <input
              type="password"
              value={resetPassword}
              onChange={(event) => setResetPassword(event.target.value)}
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
            {busy ? "Updating..." : "Reset password"}
          </button>
        </form>
      ) : null}

      <form onSubmit={submitLogin} style={{ display: "grid", gap: "14px" }}>
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
        <label style={{ display: "grid", gap: "8px" }}>
          <span>MFA code</span>
          <input
            type="text"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
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
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <PasswordRequestForm onMessage={setMessage} onError={setError} />

      {error ? <p style={{ margin: 0, color: "#F87171" }}>{error}</p> : null}
      {message ? <p style={{ margin: 0, color: tokens.colors.primary }}>{message}</p> : null}
    </div>
  );
}

function PasswordRequestForm(props: {
  onMessage: (value: string | null) => void;
  onError: (value: string | null) => void;
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    props.onError(null);
    props.onMessage(null);

    try {
      const response = await fetch("/api/auth/password/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        props.onError(payload.error ?? "Reset request failed.");
        return;
      }

      props.onMessage("If the account exists, a reset email has been sent.");
    } catch {
      props.onError("Reset request failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: "grid",
        gap: "10px",
        paddingTop: "8px",
        borderTop: `1px solid ${tokens.colors.divider}`,
      }}
    >
      <div
        style={{
          fontFamily: tokens.typography.mono,
          fontSize: "12px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: tokens.colors.textSecondary,
        }}
      >
        Need a reset link?
      </div>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter account email"
        style={inputStyle()}
      />
      <button
        type="submit"
        disabled={busy}
        style={{
          padding: "12px 16px",
          borderRadius: tokens.radius.control,
          border: `1px solid ${tokens.colors.border}`,
          backgroundColor: "transparent",
          color: tokens.colors.text,
          fontWeight: 600,
        }}
      >
        {busy ? "Sending..." : "Send reset email"}
      </button>
    </form>
  );
}
