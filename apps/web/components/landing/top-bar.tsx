import Link from "next/link";

export function TopBar() {
  return (
    <header className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2 font-mono text-sm lowercase text-zinc-900">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-900"
        />
        seniorify
      </div>
      <nav className="flex items-center gap-5 font-mono text-xs lowercase text-zinc-500">
        <Link href="/work" className="hover:text-zinc-900">
          /work
        </Link>
        <Link href="/manager" className="hover:text-zinc-900">
          /manager
        </Link>
      </nav>
    </header>
  );
}
