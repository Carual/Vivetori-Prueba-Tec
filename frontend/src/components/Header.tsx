export function Header({
  onRefresh,
  onNewTicket,
}: {
  onRefresh: () => void;
  onNewTicket: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Realtime enabled
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Support Tickets
        </h1>
        <p className="mt-1 text-sm text-zinc-300/80">
          Direct from Supabase + Realtime channels.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 shadow-sm hover:bg-white/10 active:scale-[0.99]"
        >
          Refresh
        </button>

        <button
          onClick={onNewTicket}
          className="inline-flex items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200 shadow-sm hover:bg-indigo-500/15 active:scale-[0.99]"
        >
          New ticket
        </button>
      </div>
    </div>
  );
}
