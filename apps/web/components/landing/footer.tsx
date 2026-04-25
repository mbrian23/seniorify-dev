import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6 font-mono text-xs lowercase text-zinc-500">
      <span>built at zero to agent · montevideo 2026</span>
      <div className="flex items-center gap-5">
        <Link href="/work" className="hover:text-zinc-900">
          /work
        </Link>
        <Link href="/manager" className="hover:text-zinc-900">
          /manager
        </Link>
        <Link href="/install" className="hover:text-zinc-900">
          /install
        </Link>
        <span className="text-zinc-400">seniorify.dev</span>
      </div>
    </footer>
  );
}
