import { getConfigErrorMessage, getServerEnv } from "@/lib/env";

export async function sendPasswordResetEmail(input: {
  to: string;
  resetToken: string;
}) {
  const env = getServerEnv();

  if (!env.resendApiKey) {
    throw new Error(getConfigErrorMessage("RESEND_API_KEY"));
  }

  if (!env.authResetEmailFrom) {
    throw new Error(getConfigErrorMessage("AUTH_RESET_EMAIL_FROM"));
  }

  if (!env.siteUrl) {
    throw new Error(getConfigErrorMessage("NEXT_PUBLIC_SITE_URL"));
  }

  const resetUrl = new URL("/login?resetToken=" + encodeURIComponent(input.resetToken), env.siteUrl);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.authResetEmailFrom,
      to: [input.to],
      subject: "Reset your SEO AI Regent password",
      html: `<p>You requested a password reset for SEO AI Regent.</p><p><a href="${resetUrl.toString()}">Reset your password</a></p><p>This link expires in 30 minutes.</p>`,
      text: `Reset your SEO AI Regent password: ${resetUrl.toString()} (expires in 30 minutes).`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Reset email delivery failed with status ${response.status}.`);
  }
}
