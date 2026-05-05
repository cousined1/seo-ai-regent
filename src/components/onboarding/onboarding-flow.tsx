"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type VerificationMethod = "HTML_TAG" | "DNS_TXT" | "FILE_UPLOAD";

interface OnboardingFlowProps {
  workspaceId: string;
}

export function OnboardingFlow({ workspaceId }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<"site" | "verify" | "crawl" | "done">("site");
  const [siteUrl, setSiteUrl] = useState("");
  const [siteId, setSiteId] = useState<string | null>(null);
  const [method, setMethod] = useState<VerificationMethod>("HTML_TAG");
  const [token, setToken] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [crawlJobId, setCrawlJobId] = useState<string | null>(null);
  const [crawlStatus, setCrawlStatus] = useState<string | null>(null);
  const [urlCount, setUrlCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAddSite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, url: siteUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to add site");
        return;
      }

      setSiteId(data.site.id);
      setStep("verify");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStartVerification() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/sites/${siteId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", method }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to start verification");
        return;
      }

      setToken(data.verification.token);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckVerification() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/sites/${siteId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Verification check failed");
        return;
      }

      if (data.verified) {
        setVerified(true);
        setStep("crawl");
      } else {
        setError(data.message ?? "Verification not found yet");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStartCrawl() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/sites/${siteId}/crawl`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to start crawl");
        return;
      }

      setCrawlJobId(data.crawlJobId);
      pollCrawlStatus(data.crawlJobId);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function pollCrawlStatus(jobId: string) {
    const poll = async () => {
      try {
        const response = await fetch(`/api/sites/${siteId}/crawl/${jobId}`);
        const data = await response.json();

        if (data.crawlJob) {
          setCrawlStatus(data.crawlJob.status);
          setUrlCount(data.crawlJob.urlCount);

          if (data.crawlJob.status === "COMPLETED" || data.crawlJob.status === "FAILED") {
            if (data.crawlJob.status === "COMPLETED") {
              setStep("done");
            } else {
              setError(data.crawlJob.error ?? "Crawl failed");
            }
          } else {
            setTimeout(poll, 3000);
          }
        }
      } catch {
        setTimeout(poll, 3000);
      }
    };

    poll();
  }

  function handleFinish() {
    router.push(`/app/workspaces/${workspaceId}/keywords`);
  }

  return (
    <div className="mx-auto max-w-2xl py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Workspace Onboarding</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Verify your site and discover your content inventory.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <StepIndicator currentStep={step} />

        {step === "site" && (
          <form onSubmit={handleAddSite} className="space-y-4 rounded-lg border p-6">
            <h2 className="text-lg font-medium">Add Your Site</h2>
            <div>
              <label htmlFor="siteUrl" className="block text-sm font-medium">
                Site URL
              </label>
              <input
                id="siteUrl"
                type="text"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !siteUrl.trim()}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Site"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <div className="space-y-4 rounded-lg border p-6">
            <h2 className="text-lg font-medium">Verify Ownership</h2>

            <div className="flex gap-2">
              {(["HTML_TAG", "DNS_TXT", "FILE_UPLOAD"] as VerificationMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`rounded-md px-3 py-1.5 text-sm ${
                    method === m
                      ? "bg-primary text-primary-foreground"
                      : "border bg-background"
                  }`}
                >
                  {m === "HTML_TAG" ? "HTML Tag" : m === "DNS_TXT" ? "DNS TXT" : "File Upload"}
                </button>
              ))}
            </div>

            {!token ? (
              <button
                onClick={handleStartVerification}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? "Starting..." : "Start Verification"}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-medium">Instructions:</p>
                  <pre className="mt-2 whitespace-pre-wrap text-xs font-mono">
                    {method === "HTML_TAG" && (
                      <>Add to your site's &lt;head&gt;:
{`<meta name="seo-ai-regent-verification" content="${token}" />`}</>
                    )}
                    {method === "DNS_TXT" && (
                      <>Add TXT record:
seo-ai-regent-verification={token}</>
                    )}
                    {method === "FILE_UPLOAD" && (
                      <>Create file at /.well-known/seo-ai-regent-verification containing:
{token}</>
                    )}
                  </pre>
                </div>
                <button
                  onClick={handleCheckVerification}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                >
                  {loading ? "Checking..." : "Verify Now"}
                </button>
              </div>
            )}
          </div>
        )}

        {step === "crawl" && (
          <div className="space-y-4 rounded-lg border p-6">
            <h2 className="text-lg font-medium">Discover Pages</h2>
            <p className="text-sm text-muted-foreground">
              We'll crawl your sitemap to discover all pages on your site.
            </p>
            <button
              onClick={handleStartCrawl}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? "Starting..." : "Start Crawl"}
            </button>
            {crawlStatus && (
              <div className="rounded-md bg-muted p-3 text-sm">
                Status: <span className="font-medium">{crawlStatus}</span>
                {urlCount != null && ` (${urlCount} URLs found)`}
              </div>
            )}
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4 rounded-lg border p-6">
            <h2 className="text-lg font-medium">Setup Complete</h2>
            <p className="text-sm text-muted-foreground">
              Your site is verified and {urlCount} pages have been discovered.
              You can now start discovering keywords or scoring existing content.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleFinish}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
              >
                Go to Keywords
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepIndicator({ currentStep }: { currentStep: string }) {
  const steps = [
    { key: "site", label: "Add Site" },
    { key: "verify", label: "Verify" },
    { key: "crawl", label: "Crawl" },
    { key: "done", label: "Done" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              i < currentIndex
                ? "bg-primary text-primary-foreground"
                : i === currentIndex
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {i < currentIndex ? "✓" : i + 1}
          </div>
          <span className={`text-sm ${i <= currentIndex ? "font-medium" : "text-muted-foreground"}`}>
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div className={`h-px w-8 ${i < currentIndex ? "bg-primary" : "bg-muted"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
