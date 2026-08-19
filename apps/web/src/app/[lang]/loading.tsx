export default function Loading() {
  return (
    <div className="rounded-2xl bg-[#f6f2ea] p-6 text-[#0f1230] shadow-lg" role="status" aria-live="polite">
      <span className="sr-only">Loading</span>
      <div className="h-8 w-48 animate-pulse rounded bg-black/10" aria-hidden="true" />
      <div className="mt-8 h-64 animate-pulse rounded-xl bg-black/5" aria-hidden="true" />
    </div>
  );
}
