"use client";

interface ReviewGateModalProps {
  contentScore: number;
  geoScore: number;
  blockedActions: string[];
  improvements: string[];
  onDismiss: () => void;
  onContinueEditing: () => void;
}

export function ReviewGateModal({
  contentScore,
  geoScore,
  blockedActions,
  improvements,
  onDismiss,
  onContinueEditing,
}: ReviewGateModalProps) {
  const isBlocked = contentScore < 50 || geoScore < 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-lg rounded-lg bg-background p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isBlocked ? "bg-red-100" : "bg-amber-100"}`}>
            <span className={`text-lg ${isBlocked ? "text-red-600" : "text-amber-600"}`}>
              {isBlocked ? "!" : "?"}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Review Gate</h2>
            <p className="text-sm text-muted-foreground">
              {isBlocked ? "Publishing blocked" : "Review required before publishing"}
            </p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className={`rounded-md border p-3 ${contentScore < 70 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
            <p className="text-xs text-muted-foreground">Content Score</p>
            <p className={`text-2xl font-semibold ${contentScore < 70 ? "text-red-600" : "text-green-600"}`}>
              {contentScore}
            </p>
          </div>
          <div className={`rounded-md border p-3 ${geoScore < 70 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
            <p className="text-xs text-muted-foreground">GEO Score</p>
            <p className={`text-2xl font-semibold ${geoScore < 70 ? "text-red-600" : "text-green-600"}`}>
              {geoScore}
            </p>
          </div>
        </div>

        {blockedActions.length > 0 && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
            <p className="font-medium text-amber-800">Blocked Actions</p>
            <ul className="mt-1 list-inside list-disc text-amber-700">
              {blockedActions.map((action) => (
                <li key={action}>{action.charAt(0).toUpperCase() + action.slice(1)}</li>
              ))}
            </ul>
          </div>
        )}

        {improvements.length > 0 && (
          <div className="mb-6 space-y-2">
            <p className="text-sm font-medium">Required Improvements</p>
            {improvements.map((improvement, i) => (
              <div key={i} className="rounded-md border p-3 text-sm">
                {improvement}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onDismiss}
            className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
          >
            Close
          </button>
          <button
            onClick={onContinueEditing}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Continue Editing
          </button>
        </div>
      </div>
    </div>
  );
}
