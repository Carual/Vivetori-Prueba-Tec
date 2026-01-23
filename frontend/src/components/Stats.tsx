export function Stats({
  total,
  pending,
  processed,
  negative,
}: {
  total: number;
  pending: number;
  processed: number;
  negative: number;
}) {
  const Card = ({ label, value }: { label: string; value: number }) => (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card label="Total" value={total} />
      <Card label="Pending" value={pending} />
      <Card label="Processed" value={processed} />
      <Card label="Negative" value={negative} />
    </div>
  );
}
