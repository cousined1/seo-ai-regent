import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EditorRail } from "@/components/rail/editor-rail";
import { EditorShell } from "@/components/editor/editor-shell";

const contentScore = {
  overall: 74,
  termFrequency: 78,
  entityCoverage: 68,
  headingStructure: 62,
  wordCount: 80,
  readability: 84,
  internalLinks: 35,
  geoSignals: 58,
};

const geoScore = {
  overall: 64,
  entityAuthority: 61,
  factualDensity: 48,
  answerFormat: 75,
  sourceCredibility: 66,
  freshness: 52,
};

const topActions = [
  {
    area: "Content" as const,
    signal: "headingStructure",
    title: "Introduce stronger structural framing",
    detail: "Add headings or section cues so the passage is easier to parse and reuse.",
    lift: 5.5,
    liftLabel: "+5.5 Content pts",
  },
  {
    area: "Content" as const,
    signal: "termFrequency",
    title: "Tighten keyword-to-intent coverage",
    detail: "Use the target phrase and adjacent terms earlier and more explicitly in the passage.",
    lift: 4.5,
    liftLabel: "+4.5 Content pts",
  },
  {
    area: "GEO" as const,
    signal: "factualDensity",
    title: "Add cited statistics",
    detail: "Support the main claim with attributed figures.",
    lift: 6,
    liftLabel: "+6 GEO pts",
  },
];

const terms = {
  required: ["entity authority"],
  recommended: ["search intent"],
  optional: ["internal links"],
};

const contentBreakdown = [
  {
    signal: "termFrequency",
    score: 78,
    weight: 0.2,
    contribution: 15.6,
    status: "strong" as const,
  },
];

describe("EditorRail", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("renders dual-score lockup, top actions, terms, and breakdown in fixed order", () => {
    render(
      <EditorRail
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
      />,
    );

    const headings = screen.getAllByRole("heading", { level: 3 }).map((node) => node.textContent);
    expect(headings).toEqual(["Top 3 Actions", "Terms", "Signal Breakdown"]);
    expect(screen.getByText(/content score/i)).toBeTruthy();
    expect(screen.getByText(/geo score/i)).toBeTruthy();
    expect(screen.getByText(/entity authority/i)).toBeTruthy();
    expect(screen.getAllByText(/termFrequency/i).length).toBeGreaterThanOrEqual(1);
  });

  it("keeps the editor clean by default and toggles assisted mode on demand", () => {
    render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026"
      />,
    );

    expect(screen.getAllByText(/clean canvas/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/missing required terms/i)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /assisted mode/i }));

    expect(screen.getAllByText(/assisted canvas/i).length).toBeGreaterThanOrEqual(1);
    const inlineGuidance = screen.getByLabelText(/inline guidance/i);
    expect(within(inlineGuidance).getByText(/^missing required terms$/i)).toBeTruthy();
    expect(within(inlineGuidance).getByText(/^structure cue$/i)).toBeTruthy();
    expect(within(inlineGuidance).getAllByText(/\+5\.5 content pts/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders a rich-text toolbar and editable writing surface", () => {
    render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026"
      />,
    );

    expect(screen.getByRole("button", { name: /bold/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /italic/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /bullet list/i })).toBeTruthy();

    const editor = screen.getByRole("textbox", { name: /editor content/i });
    expect(editor.getAttribute("contenteditable")).toBe("true");
  });

  it("shows inline term markers inside the writing surface when assisted mode is enabled", () => {
    render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026 improves when search intent is explicit."
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /assisted mode/i }));

    const editor = screen.getByRole("textbox", { name: /editor content/i });
    const highlightedTerm = within(editor).getByText(/search intent/i);
    const inlineGuidance = screen.getByLabelText(/inline guidance/i);

    expect(highlightedTerm.closest("[data-term-tier='recommended']")).toBeTruthy();
    expect(within(inlineGuidance).getAllByText(/\+4\.5 content pts/i).length).toBeGreaterThanOrEqual(1);
  });

  it("applies inline guidance actions into the draft when clicked", () => {
    render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /assisted mode/i }));

    fireEvent.click(screen.getByRole("button", { name: /apply term entity authority/i }));
    fireEvent.click(screen.getByRole("button", { name: /apply structure cue/i }));

    const editor = screen.getByRole("textbox", { name: /editor content/i });
    expect(editor.textContent).toMatch(/entity authority/i);
    expect(editor.textContent).toMatch(/supporting evidence/i);
  });

  it("marks structural guidance as completed after the applied scaffold resolves it", async () => {
    render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /assisted mode/i }));
    fireEvent.click(screen.getByRole("button", { name: /apply structure cue/i }));

    const inlineGuidance = screen.getByLabelText(/inline guidance/i);

    await waitFor(() => {
      expect(within(inlineGuidance).getByText(/^completed$/i)).toBeTruthy();
    });

    expect(within(inlineGuidance).queryByRole("button", { name: /apply structure cue/i })).toBeNull();
    expect(within(inlineGuidance).getByText(/tighten keyword-to-intent coverage/i)).toBeTruthy();
  });

  it("drops completed actions below unresolved actions in the right rail", async () => {
    render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /assisted mode/i }));
    fireEvent.click(screen.getByRole("button", { name: /apply structure cue/i }));

    await waitFor(() => {
      const actionTitles = screen
        .getAllByRole("heading", { level: 3 })
        .map((node) => node.textContent);
      expect(actionTitles).toContain("Top 3 Actions");
    });

    const rail = screen.getByText(/top 3 actions/i).closest("section");
    const queueButtons = within(rail as HTMLElement)
      .getAllByRole("button")
      .map((node) => node.getAttribute("aria-label"));

    expect(queueButtons[0]).toMatch(/tighten keyword-to-intent coverage/i);
    expect(
      queueButtons.findIndex((label) => /dismiss completed action introduce stronger structural framing/i.test(label ?? "")),
    ).toBeGreaterThan(
      queueButtons.findIndex((label) => /tighten keyword-to-intent coverage/i.test(label ?? "")),
    );
  });

  it("shows progress state directly on right-rail action cards", async () => {
    render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /assisted mode/i }));
    fireEvent.click(screen.getByRole("button", { name: /apply structure cue/i }));

    const rail = screen.getByText(/top 3 actions/i).closest("section");

    await waitFor(() => {
      expect(within(rail as HTMLElement).getByText(/^pending$/i)).toBeTruthy();
      expect(within(rail as HTMLElement).getAllByText(/^completed$/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  it("applies an unresolved rail action into the draft from the right rail", async () => {
    render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /assisted mode/i }));
    fireEvent.click(screen.getByRole("button", { name: /apply structure cue/i }));
    fireEvent.click(screen.getByRole("button", { name: /apply rail action tighten keyword-to-intent coverage/i }));

    const editor = screen.getByRole("textbox", { name: /editor content/i });

    await waitFor(() => {
      expect(editor.textContent).toMatch(/use the target phrase and adjacent terms earlier and more explicitly/i);
    });
  });

  it("dismisses completed actions from the visible rail queue", async () => {
    render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /assisted mode/i }));
    fireEvent.click(screen.getByRole("button", { name: /apply structure cue/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /dismiss completed action introduce stronger structural framing/i })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: /dismiss completed action introduce stronger structural framing/i }));

    const rail = screen.getByText(/top 3 actions/i).closest("section");

    await waitFor(() => {
      expect(
        within(rail as HTMLElement).queryByRole("button", {
          name: /introduce stronger structural framing/i,
        }),
      ).toBeNull();
    });
  });

  it("restores dismissed queue state and recent applied actions when reopening the same draft", async () => {
    const view = render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /assisted mode/i }));
    fireEvent.click(screen.getByRole("button", { name: /apply structure cue/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /dismiss completed action introduce stronger structural framing/i })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: /dismiss completed action introduce stronger structural framing/i }));
    fireEvent.click(screen.getByRole("button", { name: /apply rail action tighten keyword-to-intent coverage/i }));
    view.unmount();

    render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026"
      />,
    );

    const rail = screen.getByText(/top 3 actions/i).closest("section");

    await waitFor(() => {
      expect(
        within(rail as HTMLElement).queryByRole("button", {
          name: /introduce stronger structural framing/i,
        }),
      ).toBeNull();
      expect(within(rail as HTMLElement).getByText(/recent applied/i)).toBeTruthy();
      expect(
        within(rail as HTMLElement).getAllByText(/tighten keyword-to-intent coverage/i).length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  it("restores session movement and resolved action history when reopening the same draft", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        contentScore: {
          ...contentScore,
          overall: 88,
        },
        geoScore: {
          ...geoScore,
          overall: 83,
        },
        topActions,
        terms,
        contentBreakdown,
        geoBreakdown: contentBreakdown,
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const view = render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /assisted mode/i }));
    fireEvent.click(screen.getByRole("button", { name: /apply structure cue/i }));
    fireEvent.input(screen.getByRole("textbox", { name: /editor content/i }), {
      currentTarget: {
        textContent:
          "How to start a blog in 2026\n\nSupporting evidence:\n- 77% of editorial teams improve output with clearer structure.",
      },
      target: {
        textContent:
          "How to start a blog in 2026\n\nSupporting evidence:\n- 77% of editorial teams improve output with clearer structure.",
      },
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    expect(await screen.findAllByText(/^88$/i)).toHaveLength(1);
    expect(await screen.findAllByText(/^83$/i)).toHaveLength(1);

    view.unmount();

    render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026"
      />,
    );

    expect(await screen.findAllByText(/^88$/i)).toHaveLength(1);
    expect(await screen.findAllByText(/^83$/i)).toHaveLength(1);

    const inlineGuidance = await screen.findByLabelText(/inline guidance/i);
    const sessionMovement = within(inlineGuidance).getByLabelText(/session movement/i);
    expect(within(sessionMovement).getByText(/74\s*→\s*88/i)).toBeTruthy();
    expect(within(sessionMovement).getByText(/\+14/i)).toBeTruthy();
    expect(within(sessionMovement).getByText(/64\s*→\s*83/i)).toBeTruthy();
    expect(within(sessionMovement).getByText(/\+19/i)).toBeTruthy();

    const rail = screen.getByText(/top 3 actions/i).closest("section");

    expect(within(rail as HTMLElement).getByText(/resolved this session/i)).toBeTruthy();
    expect(
      within(rail as HTMLElement).getAllByText(/introduce stronger structural framing/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(within(rail as HTMLElement).getByText(/what worked here/i)).toBeTruthy();
    expect(
      within(rail as HTMLElement).getAllByText(/\+7 content \| \+9\.5 geo/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("rescoring the draft refreshes the rail from the canonical score route", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        contentScore: {
          ...contentScore,
          overall: 88,
          internalLinks: 52,
        },
        geoScore: {
          ...geoScore,
          overall: 83,
          factualDensity: 86,
        },
        topActions: [
          {
            area: "Content",
            signal: "internalLinks",
            title: "Add internal navigation paths",
            detail: "Link the draft to related editorial assets.",
            lift: 4.5,
            liftLabel: "+4.5 Content pts",
          },
        ],
        terms: {
          required: ["editorial system"],
          recommended: ["citations"],
          optional: ["internal links"],
        },
        contentBreakdown,
        geoBreakdown: contentBreakdown,
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    render(
      <EditorShell
        keyword="how to start a blog"
        contentScore={contentScore}
        geoScore={geoScore}
        topActions={topActions}
        terms={terms}
        contentBreakdown={contentBreakdown}
        geoBreakdown={contentBreakdown}
        initialContent="How to start a blog in 2026"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /assisted mode/i }));

    fireEvent.input(screen.getByRole("textbox", { name: /editor content/i }), {
      currentTarget: {
        textContent:
          "How to start a blog in 2026 with examples, citations, and stronger internal links.",
      },
      target: {
        textContent:
          "How to start a blog in 2026 with examples, citations, and stronger internal links.",
      },
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/score/content",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });

    expect(await screen.findAllByText(/^88$/i)).toHaveLength(1);
    expect(await screen.findAllByText(/^83$/i)).toHaveLength(1);
    expect((await screen.findAllByText(/add internal navigation paths/i)).length).toBeGreaterThanOrEqual(1);
    expect((await screen.findAllByText(/editorial system/i)).length).toBeGreaterThanOrEqual(1);
    const inlineGuidance = await screen.findByLabelText(/inline guidance/i);
    const sessionMovement = within(inlineGuidance).getByLabelText(/session movement/i);
    expect(within(sessionMovement).getByText(/session movement/i)).toBeTruthy();
    expect(within(sessionMovement).getByText(/74\s*→\s*88/i)).toBeTruthy();
    expect(within(sessionMovement).getByText(/\+14/i)).toBeTruthy();
    expect(within(sessionMovement).getByText(/64\s*→\s*83/i)).toBeTruthy();
    expect(within(sessionMovement).getByText(/\+19/i)).toBeTruthy();

    vi.unstubAllGlobals();
  });
});
