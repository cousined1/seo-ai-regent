#!/usr/bin/env node
// Deployed smoke test for SEO-AI-REGENT.
// Usage: node scripts/smoke.mjs [base-url]
//        BASE_URL=https://app.example.com node scripts/smoke.mjs
//
// Verifies that a deployed instance answers on the public surface area
// covered by PRODUCTION_CHECKLIST.md without requiring any test credentials.

const baseUrl = (process.argv[2] ?? process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const checks = [];

function record(name, ok, detail) {
  checks.push({ name, ok, detail });
  const tag = ok ? "PASS" : "FAIL";
  process.stdout.write(`${tag}  ${name}${detail ? `  — ${detail}` : ""}\n`);
}

async function fetchJson(path, init) {
  const response = await fetch(`${baseUrl}${path}`, init);
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();
  return { status: response.status, body };
}

async function expectStatus(name, path, expected, init) {
  try {
    const { status, body } = await fetchJson(path, init);
    const expectedList = Array.isArray(expected) ? expected : [expected];
    if (!expectedList.includes(status)) {
      record(name, false, `expected ${expectedList.join("|")}, got ${status}`);
      return null;
    }
    record(name, true, `status ${status}`);
    return { status, body };
  } catch (error) {
    record(name, false, `request error: ${error?.message ?? error}`);
    return null;
  }
}

async function expectJsonShape(name, path, predicate) {
  try {
    const { status, body } = await fetchJson(path);
    if (status !== 200) {
      record(name, false, `expected 200, got ${status}`);
      return;
    }
    if (typeof body !== "object" || body === null) {
      record(name, false, `expected JSON object, got ${typeof body}`);
      return;
    }
    const reason = predicate(body);
    if (reason) {
      record(name, false, reason);
      return;
    }
    record(name, true, `status ${status}`);
  } catch (error) {
    record(name, false, `request error: ${error?.message ?? error}`);
  }
}

async function expectHtmlContains(name, path, needle) {
  try {
    const response = await fetch(`${baseUrl}${path}`);
    if (response.status !== 200) {
      record(name, false, `expected 200, got ${response.status}`);
      return;
    }
    const text = await response.text();
    if (!text.includes(needle)) {
      record(name, false, `body did not contain ${JSON.stringify(needle)}`);
      return;
    }
    record(name, true, `status 200, contains ${JSON.stringify(needle)}`);
  } catch (error) {
    record(name, false, `request error: ${error?.message ?? error}`);
  }
}

async function main() {
  process.stdout.write(`\nSmoke testing ${baseUrl}\n\n`);

  await expectJsonShape("health", "/api/health", (body) =>
    body.status === "ok" && body.dependencies ? null : `unexpected health body: ${JSON.stringify(body)}`,
  );
  await expectJsonShape("ready", "/api/ready", (body) =>
    body.status === "ready" && body.dependencies ? null : `unexpected ready body: ${JSON.stringify(body)}`,
  );
  await expectJsonShape("anonymous session", "/api/auth/session", (body) =>
    body.authenticated === false ? null : `expected authenticated:false, got ${JSON.stringify(body)}`,
  );

  await expectHtmlContains("login page renders", "/login", "Sign in");
  await expectStatus("homepage renders", "/", 200);
  await expectStatus("robots.txt served", "/robots.txt", 200);
  await expectStatus("sitemap.xml served", "/sitemap.xml", 200);

  // Stripe webhook must reject unsigned POSTs. The route returns 503 when the
  // webhook secret is not yet configured and 400 when a signature is supplied
  // but invalid; both are acceptable from a smoke perspective.
  await expectStatus(
    "stripe webhook rejects unsigned",
    "/api/stripe/webhook",
    [400, 503],
    { method: "POST", body: "{}", headers: { "content-type": "application/json" } },
  );

  // Auth and reset endpoints must validate input rather than 500.
  await expectStatus(
    "login rejects empty body",
    "/api/auth/login",
    [400, 401, 422],
    { method: "POST", body: "{}", headers: { "content-type": "application/json" } },
  );
  await expectStatus(
    "password reset request validates input",
    "/api/auth/password/request",
    [200, 400, 422, 503],
    { method: "POST", body: "{}", headers: { "content-type": "application/json" } },
  );

  const failed = checks.filter((entry) => !entry.ok);
  process.stdout.write(`\n${checks.length - failed.length}/${checks.length} checks passed.\n`);

  if (failed.length > 0) {
    process.stdout.write(`\nFailed checks:\n`);
    for (const entry of failed) {
      process.stdout.write(`  - ${entry.name}: ${entry.detail ?? "no detail"}\n`);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  process.stderr.write(`Smoke runner crashed: ${error?.stack ?? error}\n`);
  process.exit(1);
});
