export interface CitabilityBreakdown {
  answerBlockQuality: number;
  selfContainment: number;
  structuralReadability: number;
  statisticalDensity: number;
  uniquenessSignals: number;
}

export interface CitabilityScore {
  heading?: string;
  wordCount: number;
  totalScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  label: string;
  breakdown: CitabilityBreakdown;
  preview: string;
}

export interface CitabilityBlockInput {
  heading: string;
  content: string;
}

export interface CitabilitySummary {
  totalBlocksAnalyzed: number;
  averageCitabilityScore: number;
  citabilityCoverage: number;
  topBlocks: CitabilityScore[];
  bottomBlocks: CitabilityScore[];
}

function clamp(value: number, max: number) {
  return Math.min(Math.max(value, 0), max);
}

function gradeScore(totalScore: number): Pick<CitabilityScore, "grade" | "label"> {
  if (totalScore >= 80) {
    return { grade: "A", label: "Highly Citable" };
  }

  if (totalScore >= 65) {
    return { grade: "B", label: "Good Citability" };
  }

  if (totalScore >= 50) {
    return { grade: "C", label: "Moderate Citability" };
  }

  if (totalScore >= 35) {
    return { grade: "D", label: "Low Citability" };
  }

  return { grade: "F", label: "Poor Citability" };
}

export function scoreCitabilityPassage(
  text: string,
  heading?: string,
): CitabilityScore {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const firstSentence = sentences[0] ?? "";

  let answerBlockQuality = 0;
  const definitionPatterns = [
    /\b\w+\s+is\s+(?:a|an|the)\s/i,
    /\b\w+\s+refers?\s+to\s/i,
    /\b\w+\s+means?\s/i,
    /\bdefined\s+as\s/i,
    /\bin\s+(?:simple|other)\s+(?:terms|words)\s*,/i,
  ];

  if (definitionPatterns.some((pattern) => pattern.test(text))) {
    answerBlockQuality += 15;
  }

  const firstSixtyWords = words.slice(0, 60).join(" ");
  if (
    definitionPatterns.some((pattern) => pattern.test(firstSixtyWords)) ||
    [/\d+(?:\.\d+)?%/, /\$[\d,]+/, /\b\d+\s+(?:million|billion|thousand|x)\b/i].some(
      (pattern) => pattern.test(firstSixtyWords),
    )
  ) {
    answerBlockQuality += 15;
  }

  if (heading?.endsWith("?")) {
    answerBlockQuality += 10;
  }

  if (
    /\b(?:is|are|refers to|means|uses|measures|helps)\b/i.test(firstSentence) &&
    !/\b(?:i|we|you)\b/i.test(firstSentence)
  ) {
    answerBlockQuality += 5;
  }

  const shortClearSentences = sentences.filter((sentence) => {
    const length = sentence.split(/\s+/).filter(Boolean).length;
    return length >= 5 && length <= 25;
  }).length;

  if (sentences.length > 0) {
    answerBlockQuality += Math.round((shortClearSentences / sentences.length) * 10);
  }

  if (
    /(?:according to|research shows|stud(?:y|ies) (?:show|indicate|suggest|found)|data (?:shows|indicates|suggests))/i.test(
      text,
    )
  ) {
    answerBlockQuality += 10;
  }

  if (
    /(?:Gartner|Forrester|McKinsey|Harvard|Stanford|MIT|Google|Microsoft|OpenAI|Anthropic|Perplexity|ChatGPT|Claude)/.test(
      text,
    )
  ) {
    answerBlockQuality += 5;
  }

  let selfContainment = 0;

  if (wordCount >= 134 && wordCount <= 167) {
    selfContainment += 10;
  } else if (wordCount >= 100 && wordCount <= 200) {
    selfContainment += 7;
  } else if (wordCount >= 80 && wordCount <= 250) {
    selfContainment += 4;
  } else if (wordCount >= 30 && wordCount <= 400) {
    selfContainment += 2;
  }

  const pronounCount = (
    text.match(/\b(?:it|they|them|their|this|that|these|those|he|she|his|her)\b/gi) ?? []
  ).length;
  const pronounRatio = wordCount > 0 ? pronounCount / wordCount : 1;

  if (pronounRatio < 0.02) {
    selfContainment += 8;
  } else if (pronounRatio < 0.04) {
    selfContainment += 5;
  } else if (pronounRatio < 0.06) {
    selfContainment += 3;
  }

  const properNouns = (text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) ?? []).length;
  if (properNouns >= 3) {
    selfContainment += 7;
  } else if (properNouns >= 1) {
    selfContainment += 4;
  }

  if (!/^(?:but|however|and|so|then)\b/i.test(text.trim())) {
    selfContainment += 4;
  }

  if (heading?.endsWith("?")) {
    selfContainment += 3;
  }

  let structuralReadability = 0;
  const averageSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
  if (averageSentenceLength >= 10 && averageSentenceLength <= 20) {
    structuralReadability += 8;
  } else if (averageSentenceLength >= 8 && averageSentenceLength <= 25) {
    structuralReadability += 5;
  } else if (sentences.length > 0) {
    structuralReadability += 2;
  }

  if (/(?:first|second|third|finally|additionally|moreover|furthermore)/i.test(text)) {
    structuralReadability += 4;
  }

  if (/(?:\d+[\.\)]\s|\b(?:step|tip|point)\s+\d+)/i.test(text)) {
    structuralReadability += 4;
  }

  if (/\n/.test(text)) {
    structuralReadability += 4;
  }

  let statisticalDensity = 0;
  statisticalDensity += clamp((text.match(/\d+(?:\.\d+)?%/g) ?? []).length * 3, 6);
  statisticalDensity += clamp(
    (text.match(/\$[\d,]+(?:\.\d+)?(?:\s*(?:million|billion|M|B|K))?/gi) ?? []).length * 3,
    5,
  );
  statisticalDensity += clamp(
    (
      text.match(
        /\b\d+(?:,\d{3})*(?:\.\d+)?\s+(?:users|customers|pages|sites|companies|businesses|people|percent|times|x)\b/gi,
      ) ?? []
    ).length * 2,
    4,
  );

  if (/\b20(?:1\d|2[3-9])\b/.test(text)) {
    statisticalDensity += 2;
  }

  if (/(?:according to|per|from|by)\s+[A-Z]/.test(text)) {
    statisticalDensity += 2;
  }

  if (
    /(?:Gartner|Forrester|McKinsey|Harvard|Stanford|MIT|Google|Microsoft|OpenAI|Anthropic|Perplexity|ChatGPT|Claude)/.test(
      text,
    )
  ) {
    statisticalDensity += 4;
  }

  if (/\([A-Z][a-z]+(?:\s+\d{4})?\)/.test(text)) {
    statisticalDensity += 2;
  }

  if (properNouns >= 3 && /\d/.test(text)) {
    statisticalDensity += 2;
  }

  let uniquenessSignals = 0;
  if (/(?:our (?:research|study|data|analysis|survey|findings)|we (?:found|discovered|analyzed|surveyed|measured))/i.test(text)) {
    uniquenessSignals += 5;
  }

  if (/(?:case study|for example|for instance|in practice|real-world|hands-on)/i.test(text)) {
    uniquenessSignals += 3;
  }

  if (/(?:using|with|via|through)\s+[A-Z][a-z]+/.test(text)) {
    uniquenessSignals += 2;
  }

  if (/(?:systems|platforms|engines)\s+like\s+(?:ChatGPT|Perplexity|Claude)/i.test(text)) {
    uniquenessSignals += 2;
  }

  const breakdown: CitabilityBreakdown = {
    answerBlockQuality: clamp(answerBlockQuality, 30),
    selfContainment: clamp(selfContainment, 25),
    structuralReadability: clamp(structuralReadability, 20),
    statisticalDensity: clamp(statisticalDensity, 15),
    uniquenessSignals: clamp(uniquenessSignals, 10),
  };

  const totalScore =
    breakdown.answerBlockQuality +
    breakdown.selfContainment +
    breakdown.structuralReadability +
    breakdown.statisticalDensity +
    breakdown.uniquenessSignals;

  return {
    heading,
    wordCount,
    totalScore,
    ...gradeScore(totalScore),
    breakdown,
    preview: `${words.slice(0, 30).join(" ")}${wordCount > 30 ? "..." : ""}`,
  };
}

export function analyzeCitabilityBlocks(
  blocks: CitabilityBlockInput[],
): CitabilitySummary {
  const scoredBlocks = blocks.map((block) =>
    scoreCitabilityPassage(block.content, block.heading),
  );

  if (scoredBlocks.length === 0) {
    return {
      totalBlocksAnalyzed: 0,
      averageCitabilityScore: 0,
      citabilityCoverage: 0,
      topBlocks: [],
      bottomBlocks: [],
    };
  }

  const averageCitabilityScore =
    scoredBlocks.reduce((sum, block) => sum + block.totalScore, 0) /
    scoredBlocks.length;
  const citabilityCoverage =
    (scoredBlocks.filter((block) => block.totalScore >= 70).length /
      scoredBlocks.length) *
    100;

  return {
    totalBlocksAnalyzed: scoredBlocks.length,
    averageCitabilityScore: Number(averageCitabilityScore.toFixed(1)),
    citabilityCoverage: Number(citabilityCoverage.toFixed(1)),
    topBlocks: [...scoredBlocks]
      .sort((left, right) => right.totalScore - left.totalScore)
      .slice(0, 3),
    bottomBlocks: [...scoredBlocks]
      .sort((left, right) => left.totalScore - right.totalScore)
      .slice(0, 3),
  };
}
