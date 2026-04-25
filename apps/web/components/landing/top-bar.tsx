import Link from "next/link";

export function TopBar() {
  return (
    <header className="flex w-full items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-2 font-mono text-sm lowercase text-zinc-900"
      >
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-900"
        />
        seniorify
        <span className="font-mono text-[10px] text-zinc-400">v0.1</span>
      </Link>
      <nav className="flex items-center gap-1 font-mono text-xs lowercase">
        <Link
          href="/work"
          className="rounded-[4px] px-2 py-1 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
        >
          /work
        </Link>
        <Link
          href="/manager"
          className="rounded-[4px] px-2 py-1 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
        >
          /manager
        </Link>
        <Link
          href="/install"
          className="ml-2 inline-flex h-8 items-center justify-center rounded-[4px] border border-zinc-200 bg-white px-3 text-zinc-900 transition-colors hover:border-zinc-300"
        >
          install →
        </Link>
      </nav>
    </header>
  );
}
