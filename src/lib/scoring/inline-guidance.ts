import type { TermsBuckets, TopAction } from "@/lib/scoring/types";

export type InlineGuidanceStatus = "pending" | "reduced" | "completed";

export interface InlineGuidanceTermItem {
  term: string;
  liftLabel: string;
}

export interface InlineGuidanceStructureCue {
  detail: string;
  liftLabel: string;
  status: InlineGuidanceStatus;
  statusLabel: string;
}

export interface InlineGuidancePriorityAction extends TopAction {
  status: InlineGuidanceStatus;
  statusLabel: string;
}

export interface InlineGuidanceModel {
  missingRequired: InlineGuidanceTermItem[];
  missingRecommended: InlineGuidanceTermItem[];
  structureCue: InlineGuidanceStructureCue;
  priorityAction: InlineGuidancePriorityAction | null;
}

function containsTerm(content: string, term: string) {
  return content.toLowerCase().includes(term.trim().toLowerCase());
}

function getStructureCue(content: string) {
  if (!content.includes("\n\n")) {
    return "Break the opening into a direct answer paragraph, then a second block with evidence or examples.";
  }

  if (!/[-*]\s|\d+\.\s/.test(content)) {
    return "Add a short list section so the draft becomes easier for both readers and retrieval systems to scan.";
  }

  return "Keep the first section answer-first, then tighten the following sections around evidence and examples.";
}

function hasParagraphBreak(content: string) {
  return content.includes("\n\n");
}

function hasListStructure(content: string) {
  return /[-*]\s|\d+\.\s/.test(content);
}

function hasEvidenceScaffold(content: string) {
  const lowerContent = content.toLowerCase();

  return (
    lowerContent.includes("supporting evidence:") ||
    lowerContent.includes("evidence block:") ||
    (hasListStructure(content) &&
      /(statistic|source|reference|evidence|citation)/i.test(content))
  );
}

function toStatusLabel(status: InlineGuidanceStatus) {
  if (status === "completed") {
    return "Completed";
  }

  if (status === "reduced") {
    return "Reduced";
  }

  return "Pending";
}

function deriveStructureStatus(content: string): InlineGuidanceStatus {
  if (hasParagraphBreak(content) && hasListStructure(content) && hasEvidenceScaffold(content)) {
    return "completed";
  }

  if (hasParagraphBreak(content) || hasListStructure(content)) {
    return "reduced";
  }

  return "pending";
}

function countMissingTerms(content: string, terms: string[]) {
  return terms.filter((term) => !containsTerm(content, term)).length;
}

function deriveTermStatus(content: string, terms: TermsBuckets): InlineGuidanceStatus {
  const totalRequired = terms.required.length;
  const totalRecommended = terms.recommended.length;
  const missingRequired = countMissingTerms(content, terms.required);
  const missingRecommended = countMissingTerms(content, terms.recommended);

  if (missingRequired === 0 && (totalRecommended === 0 || missingRecommended === 0)) {
    return "completed";
  }

  if (
    (totalRequired > 0 && missingRequired < totalRequired) ||
    (totalRecommended > 0 && missingRecommended < totalRecommended)
  ) {
    return "reduced";
  }

  return "pending";
}

function deriveEvidenceStatus(content: string): InlineGuidanceStatus {
  const lowerContent = content.toLowerCase();
  const hasSoftEvidenceSignal =
    /\d/.test(content) || /(source|statistic|citation|reference|evidence)/i.test(content);

  if (hasEvidenceScaffold(content)) {
    return "completed";
  }

  if (hasSoftEvidenceSignal || lowerContent.includes("supporting evidence")) {
    return "reduced";
  }

  return "pending";
}

function deriveInternalLinkStatus(content: string): InlineGuidanceStatus {
  const lowerContent = content.toLowerCase();

  if (lowerContent.includes("internal links to add:")) {
    return "completed";
  }

  if (lowerContent.includes("internal link") || lowerContent.includes("internal links")) {
    return "reduced";
  }

  return "pending";
}

export function deriveActionStatus(input: {
  content: string;
  action: TopAction | null;
  terms: TermsBuckets;
}): InlineGuidanceStatus {
  const { content, action, terms } = input;

  if (!action) {
    return "completed";
  }

  if (
    action.signal === "headingStructure" ||
    action.signal === "answerFormat" ||
    action.signal === "readability" ||
    action.signal === "wordCount"
  ) {
    return deriveStructureStatus(content);
  }

  if (
    action.signal === "termFrequency" ||
    action.signal === "entityCoverage" ||
    action.signal === "geoSignals"
  ) {
    return deriveTermStatus(content, terms);
  }

  if (action.signal === "factualDensity" || action.signal === "sourceCredibility") {
    return deriveEvidenceStatus(content);
  }

  if (action.signal === "internalLinks") {
    return deriveInternalLinkStatus(content);
  }

  return "pending";
}

function derivePriorityStatus(
  content: string,
  action: TopAction | null,
  terms: TermsBuckets,
): InlineGuidanceStatus {
  return deriveActionStatus({
    content,
    action,
    terms,
  });
}

function findLiftLabel(actions: TopAction[], signals: string[], fallback: string) {
  return actions.find((action) => signals.includes(action.signal))?.liftLabel ?? fallback;
}

function deriveTermItems(
  content: string,
  terms: string[],
  topActions: TopAction[],
  signals: string[],
) {
  const liftLabel = findLiftLabel(topActions, signals, "+0 pts");

  return terms
    .filter((term) => !containsTerm(content, term))
    .map((term) => ({
      term,
      liftLabel,
    }));
}

export function deriveInlineGuidance(input: {
  content: string;
  terms: TermsBuckets;
  topActions: TopAction[];
}): InlineGuidanceModel {
  const structureStatus = deriveStructureStatus(input.content);
  const priorityAction = input.topActions[0] ?? null;
  const priorityStatus = derivePriorityStatus(input.content, priorityAction, input.terms);

  return {
    missingRequired: deriveTermItems(
      input.content,
      input.terms.required,
      input.topActions,
      ["termFrequency", "entityCoverage"],
    ),
    missingRecommended: deriveTermItems(
      input.content,
      input.terms.recommended,
      input.topActions,
      ["termFrequency", "entityCoverage", "geoSignals"],
    ),
    structureCue: {
      detail: getStructureCue(input.content),
      liftLabel: findLiftLabel(
        input.topActions,
        ["headingStructure", "answerFormat", "readability", "wordCount"],
        "+0 pts",
      ),
      status: structureStatus,
      statusLabel: toStatusLabel(structureStatus),
    },
    priorityAction: priorityAction
      ? {
          ...priorityAction,
          status: priorityStatus,
          statusLabel: toStatusLabel(priorityStatus),
        }
      : null,
  };
}
