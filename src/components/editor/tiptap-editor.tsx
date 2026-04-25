"use client";

import React, { useEffect } from "react";
import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { tokens } from "@/lib/design/tokens";
import {
  applyPriorityActionSuggestion,
  applyStructureSuggestion,
  applyTermSuggestion,
} from "@/lib/editor/apply-guidance";
import { deriveInlineGuidance } from "@/lib/scoring/inline-guidance";
import type { ScoreMovement } from "@/lib/scoring/score-movement";
import type { TermsBuckets, TopAction } from "@/lib/scoring/types";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toEditorHtml(value: string) {
  const paragraphs = value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (!paragraphs.length) {
    return "<p></p>";
  }

  return paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`)
    .join("");
}

function buildTermEntries(terms: TermsBuckets) {
  return [
    ...terms.required.map((term) => ({ term, tier: "required" as const })),
    ...terms.recommended.map((term) => ({ term, tier: "recommended" as const })),
    ...terms.optional.map((term) => ({ term, tier: "optional" as const })),
  ].filter((entry) => entry.term.trim().length > 0);
}

function buildTermHighlightExtension(terms: TermsBuckets, enabled: boolean) {
  const entries = buildTermEntries(terms).map((entry) => ({
    ...entry,
    lower: entry.term.toLowerCase(),
  }));

  return Extension.create({
    name: "termHighlight",
    addProseMirrorPlugins() {
      return [
        new Plugin({
          props: {
            decorations(state) {
              if (!enabled || !entries.length) {
                return null;
              }

              const decorations: Decoration[] = [];

              state.doc.descendants((node, position) => {
                if (!node.isText || !node.text) {
                  return;
                }

                const lowerText = node.text.toLowerCase();

                for (const entry of entries) {
                  let searchOffset = 0;

                  while (searchOffset < lowerText.length) {
                    const matchIndex = lowerText.indexOf(entry.lower, searchOffset);

                    if (matchIndex === -1) {
                      break;
                    }

                    decorations.push(
                      Decoration.inline(
                        position + matchIndex,
                        position + matchIndex + entry.term.length,
                        {
                          class: `term-highlight term-highlight-${entry.tier}`,
                          "data-term-tier": entry.tier,
                          "data-term-label": entry.term,
                        },
                      ),
                    );

                    searchOffset = matchIndex + entry.term.length;
                  }
                }
              });

              return DecorationSet.create(state.doc, decorations);
            },
          },
        }),
      ];
    },
  });
}

function InlineGuidance({
  content,
  terms,
  topActions,
  scoreMovement,
  onApplyPriorityAction,
  onApplyStructure,
  onApplyTerm,
}: {
  content: string;
  terms: TermsBuckets;
  topActions: TopAction[];
  scoreMovement: ScoreMovement | null;
  onApplyPriorityAction: () => void;
  onApplyStructure: () => void;
  onApplyTerm: (term: string) => void;
}) {
  const guidance = deriveInlineGuidance({
    content,
    terms,
    topActions,
  });

  return (
    <section
      aria-label="Inline guidance"
      style={{
        display: "grid",
        gap: "12px",
        padding: "16px 18px",
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.card,
        background:
          "linear-gradient(180deg, rgba(6, 182, 212, 0.08) 0%, rgba(17, 17, 17, 0.96) 100%)",
      }}
    >
      <div style={{ display: "grid", gap: "4px" }}>
        <div
          style={{
            color: tokens.colors.primary,
            fontFamily: tokens.typography.mono,
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Inline Guidance
        </div>
        <div style={{ color: tokens.colors.textSecondary, lineHeight: 1.55 }}>
          Guided mode surfaces missing terms and structure cues without pushing the writer out of flow.
        </div>
      </div>

      <div style={{ display: "grid", gap: "8px" }}>
        <div
          style={{
            fontFamily: tokens.typography.mono,
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: tokens.colors.textFaint,
          }}
        >
          Missing Required Terms
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {guidance.missingRequired.length ? (
            guidance.missingRequired.map((item) => (
              <div
                key={item.term}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #F59E0B",
                  borderRadius: tokens.radius.pill,
                  padding: "6px 10px",
                  color: "#F59E0B",
                  fontSize: "13px",
                }}
              >
                <span>
                  {item.term} {" "}
                  <span style={{ color: tokens.colors.textSecondary }}>{item.liftLabel}</span>
                </span>
                <GuidanceActionButton
                  label={`Apply term ${item.term}`}
                  onClick={() => onApplyTerm(item.term)}
                />
              </div>
            ))
          ) : (
            <span
              style={{
                border: `1px solid ${tokens.colors.border}`,
                borderRadius: tokens.radius.pill,
                padding: "6px 10px",
                color: tokens.colors.textSecondary,
                fontSize: "13px",
              }}
            >
              All required terms present
            </span>
          )}
        </div>
      </div>

      {guidance.missingRecommended.length ? (
        <div style={{ display: "grid", gap: "8px" }}>
          <div
            style={{
              fontFamily: tokens.typography.mono,
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: tokens.colors.textFaint,
            }}
          >
            Recommended Terms
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {guidance.missingRecommended.map((item) => (
              <div
                key={item.term}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  border: `1px solid ${tokens.colors.primary}`,
                  borderRadius: tokens.radius.pill,
                  padding: "6px 10px",
                  color: tokens.colors.primary,
                  fontSize: "13px",
                }}
              >
                <span>
                  {item.term}{" "}
                  <span style={{ color: tokens.colors.textSecondary }}>{item.liftLabel}</span>
                </span>
                <GuidanceActionButton
                  label={`Apply term ${item.term}`}
                  onClick={() => onApplyTerm(item.term)}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div style={{ display: "grid", gap: "6px" }}>
        <div
          style={{
            fontFamily: tokens.typography.mono,
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: tokens.colors.textFaint,
          }}
          >
          Structure Cue
        </div>
        <div style={{ color: tokens.colors.textSecondary, lineHeight: 1.6 }}>
          {guidance.structureCue.detail}
        </div>
        <GuidanceStatusPill
          status={guidance.structureCue.status}
          statusLabel={guidance.structureCue.statusLabel}
        />
        <div
          style={{
            color: tokens.colors.primary,
            fontFamily: tokens.typography.mono,
            fontSize: "12px",
          }}
        >
          {guidance.structureCue.liftLabel}
        </div>
        {guidance.structureCue.status !== "completed" ? (
          <div>
            <GuidanceActionButton
              label="Apply structure cue"
              cta={guidance.structureCue.status === "reduced" ? "Refine" : "Apply"}
              onClick={onApplyStructure}
            />
          </div>
        ) : null}
      </div>

      {guidance.priorityAction ? (
        <div style={{ display: "grid", gap: "6px" }}>
          <div
            style={{
              fontFamily: tokens.typography.mono,
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: tokens.colors.textFaint,
            }}
          >
            Priority Action
          </div>
          <div style={{ fontWeight: 600 }}>{guidance.priorityAction.title}</div>
          <div style={{ color: tokens.colors.textSecondary, lineHeight: 1.6 }}>
            {guidance.priorityAction.detail}
          </div>
          <GuidanceStatusPill
            status={guidance.priorityAction.status}
            statusLabel={guidance.priorityAction.statusLabel}
          />
          <div
            style={{
              color: tokens.colors.primary,
              fontFamily: tokens.typography.mono,
              fontSize: "12px",
            }}
          >
            {guidance.priorityAction.liftLabel}
          </div>
          {guidance.priorityAction.status !== "completed" ? (
            <div>
              <GuidanceActionButton
                label={`Apply priority action ${guidance.priorityAction.title}`}
                cta={guidance.priorityAction.status === "reduced" ? "Refine" : "Apply"}
                onClick={onApplyPriorityAction}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {scoreMovement ? (
        <section
          aria-label="Session movement"
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
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: tokens.colors.textFaint,
            }}
          >
            Session Movement
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: "10px",
              alignItems: "baseline",
            }}
          >
            <div>Content Score</div>
            <div style={{ fontFamily: tokens.typography.mono }}>
              {scoreMovement.content.before} {"→"} {scoreMovement.content.after}
            </div>
            <div
              style={{
                color: scoreMovement.content.delta >= 0 ? tokens.scoreRamp.good : tokens.scoreRamp.poor,
                fontFamily: tokens.typography.mono,
              }}
            >
              {scoreMovement.content.deltaLabel}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: "10px",
              alignItems: "baseline",
            }}
          >
            <div>GEO Score</div>
            <div style={{ fontFamily: tokens.typography.mono }}>
              {scoreMovement.geo.before} {"→"} {scoreMovement.geo.after}
            </div>
            <div
              style={{
                color: scoreMovement.geo.delta >= 0 ? tokens.scoreRamp.good : tokens.scoreRamp.poor,
                fontFamily: tokens.typography.mono,
              }}
            >
              {scoreMovement.geo.deltaLabel}
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}

function GuidanceActionButton({
  label,
  cta = "Apply",
  onClick,
}: {
  label: string;
  cta?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.pill,
        backgroundColor: "rgba(17, 17, 17, 0.92)",
        color: tokens.colors.text,
        fontFamily: tokens.typography.mono,
        fontSize: "11px",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding: "6px 10px",
      }}
    >
      {cta}
    </button>
  );
}

function GuidanceStatusPill({
  status,
  statusLabel,
}: {
  status: "pending" | "reduced" | "completed";
  statusLabel: string;
}) {
  const palette =
    status === "completed"
      ? {
          border: "rgba(132, 204, 22, 0.35)",
          color: "#BEF264",
          background: "rgba(132, 204, 22, 0.12)",
        }
      : status === "reduced"
        ? {
            border: "rgba(245, 158, 11, 0.35)",
            color: "#FCD34D",
            background: "rgba(245, 158, 11, 0.12)",
          }
        : {
            border: "rgba(6, 182, 212, 0.3)",
            color: tokens.colors.primary,
            background: "rgba(6, 182, 212, 0.1)",
          };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        border: `1px solid ${palette.border}`,
        borderRadius: tokens.radius.pill,
        backgroundColor: palette.background,
        color: palette.color,
        fontFamily: tokens.typography.mono,
        fontSize: "11px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "5px 9px",
      }}
    >
      {statusLabel}
    </span>
  );
}

function ToolbarButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      style={{
        border: `1px solid ${active ? tokens.colors.primary : tokens.colors.border}`,
        borderRadius: "999px",
        backgroundColor: active ? "rgba(6, 182, 212, 0.14)" : tokens.colors.surface,
        color: active ? tokens.colors.primary : tokens.colors.textSecondary,
        fontFamily: tokens.typography.mono,
        fontSize: "12px",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding: "8px 12px",
      }}
    >
      {label}
    </button>
  );
}

export function TiptapEditor({
  value,
  onChange,
  focusMode,
  terms,
  topActions,
  scoreMovement,
}: {
  value: string;
  onChange: (nextValue: string) => void;
  focusMode: boolean;
  terms: TermsBuckets;
  topActions: TopAction[];
  scoreMovement: ScoreMovement | null;
}) {
  const editor = useEditor({
    extensions: [StarterKit, buildTermHighlightExtension(terms, focusMode)],
    immediatelyRender: false,
    content: toEditorHtml(value),
    editorProps: {
      attributes: {
        "aria-label": "Editor content",
        "aria-multiline": "true",
        class: "seo-ai-regent-editor",
        role: "textbox",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getText({ blockSeparator: "\n\n" }));
    },
  }, [focusMode, terms]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentValue = editor.getText({ blockSeparator: "\n\n" });

    if (currentValue === value) {
      return;
    }

    editor.commands.setContent(toEditorHtml(value), {
      emitUpdate: false,
    });
  }, [editor, value]);

  return (
    <div
      style={{
        display: "grid",
        gap: "14px",
      }}
    >
      <div
        aria-label="Formatting toolbar"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          padding: "14px 16px",
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.card,
          backgroundColor: "rgba(17, 17, 17, 0.92)",
        }}
      >
        <ToolbarButton
          label="Bold"
          active={editor?.isActive("bold") ?? false}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          active={editor?.isActive("italic") ?? false}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Bullet List"
          active={editor?.isActive("bulletList") ?? false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        />
      </div>

      {focusMode ? (
        <InlineGuidance
          content={value}
          terms={terms}
          topActions={topActions}
          scoreMovement={scoreMovement}
          onApplyPriorityAction={() =>
            onChange(applyPriorityActionSuggestion(value, topActions[0] ?? null))
          }
          onApplyStructure={() => onChange(applyStructureSuggestion(value))}
          onApplyTerm={(term) => onChange(applyTermSuggestion(value, term))}
        />
      ) : null}

      <style>{`
        .seo-ai-regent-editor .term-highlight {
          border-radius: 6px;
          padding: 1px 2px;
          transition: background-color 120ms ease, color 120ms ease;
        }

        .seo-ai-regent-editor .term-highlight-required {
          background: rgba(245, 158, 11, 0.18);
          color: #FCD34D;
          box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.28);
        }

        .seo-ai-regent-editor .term-highlight-recommended {
          background: rgba(6, 182, 212, 0.18);
          color: #67E8F9;
          box-shadow: inset 0 0 0 1px rgba(6, 182, 212, 0.25);
        }

        .seo-ai-regent-editor .term-highlight-optional {
          background: rgba(132, 204, 22, 0.16);
          color: #BEF264;
          box-shadow: inset 0 0 0 1px rgba(132, 204, 22, 0.2);
        }
      `}</style>

      <div
        style={{
          width: "100%",
          minHeight: "520px",
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.card,
          backgroundColor: tokens.colors.surface,
          color: tokens.colors.text,
          padding: "22px",
          lineHeight: 1.7,
          fontSize: "16px",
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
