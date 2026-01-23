import { useState } from "react";
import { AppShell } from "./components/AppShell";
import { Header } from "./components/Header";
import { Stats } from "./components/Stats";
import { TicketList } from "./components/TicketList";
import { NewTicketModal } from "./components/NewTicketModal";
import { useTicketsRealtime } from "./hooks/useTicketsRealtime";

export default function App() {
  const { tickets, stats, loading, error, reload } = useTicketsRealtime();
  const [openNew, setOpenNew] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <AppShell>
      <Header
        onRefresh={reload}
        onNewTicket={() => setOpenNew(true)}
      />

      <Stats
        total={stats.total}
        pending={stats.pending}
        processed={stats.processed}
        negative={stats.negative}
      />

      {error && (
        <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          <div className="font-medium">Supabase error</div>
          <div className="mt-1 text-rose-200/90">{error}</div>
          <div className="mt-3">
            <button
              onClick={reload}
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs hover:bg-rose-500/15"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <TicketList tickets={tickets} loading={loading} error={error} />

      <NewTicketModal
        open={openNew}
        onClose={() => setOpenNew(false)}
        apiBaseUrl={apiBaseUrl}
      />

      <footer className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
        New tickets should appear instantly via Realtime after your API inserts them.
      </footer>
    </AppShell>
  );
}
