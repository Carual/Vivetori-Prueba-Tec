import type { Ticket } from "../types/ticket";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80">
      {children}
    </span>
  );
}

function Pill({
  label,
  tone,
}: {
  label: string;
  tone: "neutral" | "good" | "warn" | "bad";
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
      : tone === "warn"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
      : tone === "bad"
      ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
      : "border-white/10 bg-white/5 text-white/80";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${toneClass}`}>
      {label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

function sentimentTone(sentiment: Ticket["sentiment"]) {
  if (sentiment === "Positivo") return "good";
  if (sentiment === "Negativo") return "bad";
  if (sentiment === "Neutral") return "neutral";
  return "neutral";
}

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <div className="group rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm transition hover:bg-white/10">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{formatDate(ticket.created_at)}</Badge>
            <Pill label={ticket.category ?? "— Category"} tone="neutral" />
            <Pill
              label={ticket.sentiment ?? "— Sentiment"}
              tone={sentimentTone(ticket.sentiment)}
            />
            <Pill
              label={ticket.processed ? "Processed" : "Pending"}
              tone={ticket.processed ? "good" : "warn"}
            />
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/90">
            {ticket.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="text-[11px] text-white/40">{ticket.id}</div>

          <div className="flex items-center gap-2 text-xs text-white/60">
            <span
              className={`h-2 w-2 rounded-full ${
                ticket.sentiment === "Negativo"
                  ? "bg-rose-400"
                  : ticket.sentiment === "Positivo"
                  ? "bg-emerald-400"
                  : "bg-zinc-400"
              }`}
            />
            Live
          </div>
        </div>
      </div>

      <div className="mt-4 h-px w-full bg-white/10" />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
        <div>
          Table: <span className="text-white/70">public.tickets</span>
        </div>
        <div className="opacity-0 transition group-hover:opacity-100">
          Realtime updates enabled
        </div>
      </div>
    </div>
  );
}
