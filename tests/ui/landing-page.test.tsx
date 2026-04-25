import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { vi } from "vitest";

import { LandingPage } from "@/components/marketing/landing-page";

describe("LandingPage", () => {
  it("renders the approved hero and split CTA from the homepage design", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /score content for google and ai search\. before you publish\./i,
      }),
    ).toBeTruthy();

    expect(screen.getByRole("button", { name: /start free/i })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /try live demo/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/kw \/\//i)).toBeTruthy();
  });

  it("highlights GEO Score as the comparison anchor", () => {
    render(<LandingPage />);

    expect(screen.getAllByText(/geo score/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/^no$/i).length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText(/^yes$/i).length).toBeGreaterThanOrEqual(4);
  });

  it("renders the production-facing conversion sections from the approved landing structure", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /see the scoring loop before you create an account/i,
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /how editorial teams move from draft to retrieval-ready/i,
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /pricing that maps to editorial operating range/i,
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /questions teams ask before replacing their scoring stack/i,
      }),
    ).toBeTruthy();
    expect(screen.getByText(/editor plan/i)).toBeTruthy();
    expect(screen.getByText(/syndicate plan/i)).toBeTruthy();
    expect(screen.getByText(/ready to score your next draft/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: /privacy/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /terms/i })).toBeTruthy();
  });

  it("hydrates the live demo with canonical score output", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        contentScore: {
          overall: 84,
          termFrequency: 88,
          entityCoverage: 80,
          headingStructure: 72,
          wordCount: 78,
          readability: 91,
          internalLinks: 45,
          geoSignals: 81,
        },
        geoScore: {
          overall: 81,
          entityAuthority: 76,
          factualDensity: 84,
          answerFormat: 80,
          sourceCredibility: 79,
          freshness: 83,
        },
        topActions: [
          {
            area: "Content",
            signal: "internalLinks",
            title: "Add internal navigation paths",
            detail: "Connect the draft to supporting pages.",
            lift: 6.5,
            liftLabel: "+6.5 Content pts",
          },
          {
            area: "GEO",
            signal: "entityAuthority",
            title: "Cite stronger authority entities",
            detail: "Anchor claims to more trusted organizations.",
            lift: 4.8,
            liftLabel: "+4.8 GEO pts",
          },
          {
            area: "GEO",
            signal: "factualDensity",
            title: "Increase factual density",
            detail: "Add more explicit evidence and dates.",
            lift: 3.6,
            liftLabel: "+3.6 GEO pts",
          },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<LandingPage />);

    fireEvent.change(screen.getByLabelText(/keyword/i), {
      target: { value: "content optimization strategies" },
    });
    fireEvent.change(screen.getByLabelText(/content draft/i), {
      target: {
        value:
          "Content optimization strategies are editorial systems that improve rankings and AI-search visibility.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /start free/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/score/content",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });

    expect((await screen.findAllByText(/^84$/i)).length).toBeGreaterThanOrEqual(1);
    expect((await screen.findAllByText(/^81$/i)).length).toBeGreaterThanOrEqual(1);
    expect(await screen.findByText(/add internal navigation paths/i)).toBeTruthy();

    vi.unstubAllGlobals();
  });
});
