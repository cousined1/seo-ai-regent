import { deriveActionStatus } from "@/lib/scoring/inline-guidance";
import type { TermsBuckets, TopAction } from "@/lib/scoring/types";

const statusRank = {
  pending: 0,
  reduced: 1,
  completed: 2,
} as const;

export function prioritizeActions(input: {
  content: string;
  terms: TermsBuckets;
  topActions: TopAction[];
}) {
  return input.topActions
    .map((action, index) => ({
      action,
      index,
      status: deriveActionStatus({
        content: input.content,
        action,
        terms: input.terms,
      }),
    }))
    .sort((left, right) => {
      const statusDelta = statusRank[left.status] - statusRank[right.status];

      if (statusDelta !== 0) {
        return statusDelta;
      }

      return left.index - right.index;
    })
    .map((entry) => entry.action);
}
