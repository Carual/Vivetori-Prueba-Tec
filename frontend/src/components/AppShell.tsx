export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-44 bg-gradient-to-b from-indigo-600/20 via-zinc-950 to-zinc-950" />

      <div className="relative w-full px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-screen-2xl">{children}</div>
      </div>
    </div>
  );
}
