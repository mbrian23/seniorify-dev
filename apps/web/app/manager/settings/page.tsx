import Link from "next/link";
import { getTeamConventions } from "@/lib/conventions";
import { ConventionsEditor } from "@/components/manager/conventions-editor";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { rules } = await getTeamConventions();

  return (
    <main className="min-h-screen w-full bg-white text-zinc-900 font-sans">
      <div className="mx-auto max-w-[1100px] px-8 py-10">
        <header className="mb-10 flex items-baseline justify-between border-b border-zinc-200 pb-6">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="font-mono text-sm text-zinc-900 hover:text-zinc-600"
            >
              seniorify
            </Link>
            <span className="text-xs text-zinc-500">/ manager / settings</span>
          </div>
          <Link
            href="/manager"
            className="font-mono text-xs text-zinc-500 hover:text-zinc-900"
          >
            ← /manager
          </Link>
        </header>

        <section className="mb-12">
          <h1 className="text-2xl font-medium tracking-tight">
            company guidelines
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600">
            Rules your team agrees on. The audit catches plans that deviate.
            One rule per line. Be specific — name the libraries, the patterns,
            and the things to avoid. The audit only flags real deviations, not
            style preferences.
          </p>
        </section>

        <ConventionsEditor initialRules={rules} />

        <section className="mt-16 border-t border-zinc-200 pt-8">
          <h2 className="text-sm text-zinc-500">future sources</h2>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600">
            v1 ships these manually-edited rules. v1.1 will add{" "}
            <span className="font-mono text-xs">seniorify.yml</span> per-repo,
            convention auto-discovery from recent PRs, and import from your
            internal style guide. For now, paste your rules above.
          </p>
        </section>
      </div>
    </main>
  );
}
