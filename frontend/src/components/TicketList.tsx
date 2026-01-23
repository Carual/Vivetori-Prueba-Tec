import type { Ticket } from "../types/ticket";
import { TicketCard } from "./TicketCard";

export function TicketList({
  tickets,
  loading,
  error,
}: {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-white/80">Latest tickets (max 200)</div>
        {loading && <div className="text-xs text-white/60">Loading…</div>}
      </div>

      <div className="grid gap-3">
        {!loading && !error && tickets.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            No tickets found. Insert one in Supabase (or via your API) and it
            should appear here automatically.
          </div>
        )}

        {tickets.map((t) => (
          <TicketCard key={t.id} ticket={t} />
        ))}
      </div>
    </div>
  );
}
