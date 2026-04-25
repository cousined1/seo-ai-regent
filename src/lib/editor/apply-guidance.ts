import type { TopAction } from "@/lib/scoring/types";

function appendBlock(content: string, block: string) {
  const trimmedContent = content.trim();
  const trimmedBlock = block.trim();

  if (!trimmedContent) {
    return trimmedBlock;
  }

  if (trimmedContent.toLowerCase().includes(trimmedBlock.toLowerCase())) {
    return trimmedContent;
  }

  return `${trimmedContent}\n\n${trimmedBlock}`;
}

export function applyTermSuggestion(content: string, term: string) {
  return appendBlock(
    content,
    `Add an explicit ${term} reference here so the recommendation is stated directly inside the answer.`,
  );
}

export function applyStructureSuggestion(content: string) {
  return appendBlock(
    content,
    "Supporting evidence:\n- Add one cited statistic\n- Add one named source\n- Add one internal reference",
  );
}

export function applyPriorityActionSuggestion(content: string, action: TopAction | null) {
  if (!action) {
    return content;
  }

  if (action.signal === "headingStructure" || action.signal === "answerFormat") {
    return applyStructureSuggestion(content);
  }

  if (action.signal === "internalLinks") {
    return appendBlock(
      content,
      "Internal links to add:\n- Link to a niche selection guide\n- Link to the editorial workflow page",
    );
  }

  if (action.signal === "factualDensity" || action.signal === "sourceCredibility") {
    return appendBlock(
      content,
      "Evidence block:\n- Add a current-year statistic\n- Name the source\n- State why the number matters",
    );
  }

  return appendBlock(content, action.detail);
}
