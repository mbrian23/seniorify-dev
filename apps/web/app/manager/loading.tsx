export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-white text-zinc-900 font-sans">
      <div className="mx-auto w-full max-w-[1280px] px-8 py-12 flex flex-col gap-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl text-zinc-900 lowercase tracking-tight">
            engineering quality
          </h1>
          <p className="text-sm text-zinc-500">loading audit trail…</p>
        </header>
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-[4px] border border-zinc-200 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-[4px] border border-zinc-200 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3 h-72 rounded-[4px] border border-zinc-200 animate-pulse" />
          <div className="col-span-2 h-72 rounded-[4px] border border-zinc-200 animate-pulse" />
        </div>
        <div className="h-72 rounded-[4px] border border-zinc-200 animate-pulse" />
      </div>
    </div>
  );
}
