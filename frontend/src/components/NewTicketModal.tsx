import { useState } from "react";

export function NewTicketModal({
  open,
  onClose,
  apiBaseUrl,
}: {
  open: boolean;
  onClose: () => void;
  apiBaseUrl: string;
}) {
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function submit() {
    setError(null);

    const text = description.trim();
    if (!text) {
      setError("Escribe una descripción.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text }),
      });

      if (!res.ok) {
        const maybeJson = await res.json().catch(() => null);
        const msg =
          maybeJson?.detail ||
          `Error creando ticket (HTTP ${res.status})`;
        throw new Error(msg);
      }

      // Si todo sale bien, cerramos.
      // El ticket debería aparecer solo por Realtime.
      setDescription("");
      onClose();
    } catch (e: any) {
      setError(e?.message || "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => !submitting && onClose()}
      />
      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-semibold">New ticket</div>
              <div className="mt-1 text-sm text-white/60">
                Se enviará a tu API (FastAPI) y se insertará en Supabase.
              </div>
            </div>

            <button
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
              onClick={() => !submitting && onClose()}
            >
              Close
            </button>
          </div>

          <div className="mt-4">
            <label className="text-xs text-white/60">Description</label>
            <textarea
              className="mt-2 h-32 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/20"
              placeholder="Describe el problema del cliente…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          {error && (
            <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              onClick={() => !submitting && onClose()}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/15 disabled:opacity-60"
              onClick={submit}
              disabled={submitting}
            >
              {submitting ? "Creating…" : "Create ticket"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
