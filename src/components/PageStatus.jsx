// Loading / error placeholders for pages fed by the async API.
export function PageLoading() {
  return <div role="status" aria-live="polite" className="min-h-[60vh]"><span className="vs-sr-only">Loading…</span></div>;
}

export function PageError({ error }) {
  return (
    <div role="alert" className="max-w-lg mx-auto py-20 px-4 md:px-8 text-center">
      <h1 className="m-0 type-h2">Something went wrong</h1>
      <p className="mt-4 text-[16px] leading-[1.6] text-taupe-deep">{error?.message ?? 'Please try again.'}</p>
    </div>
  );
}
