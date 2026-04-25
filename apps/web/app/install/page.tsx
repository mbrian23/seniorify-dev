import Link from "next/link";

const claudeCmd = `claude plugins marketplace add mbrian23/seniorify-dev
claude plugins install seniorify`;

const mcpJson = `{
  "mcpServers": {
    "seniorify": {
      "type": "http",
      "url": "https://seniorify.dev/api/mcp"
    }
  }
}`;

const cursorRule = `# Seniorify rule path
.cursor/rules/seniorify.mdc

# Cursor → Settings → MCP → Add server
type: http
url:  https://seniorify.dev/api/mcp`;

const tools = [
  ["submit_plan", "Audit a plan; returns findings against team conventions"],
  ["defend", "Record a one-line defense of a finding"],
  ["update_finding", "Mark a finding addressed / defended / overridden"],
  ["sign_plan", "Freeze the plan; generate the manager-readable summary"],
  ["get_audit", "Read back a plan with all findings and decisions"],
];

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-8 py-4">
          <Link
            href="/"
            className="font-mono text-sm text-zinc-900 hover:text-zinc-600"
          >
            seniorify<span className="text-[#B45309]">.</span>
          </Link>
          <nav className="flex items-center gap-5">
            <Link
              href="/work"
              className="font-mono text-xs text-zinc-500 hover:text-zinc-900"
            >
              /work
            </Link>
            <Link
              href="/manager"
              className="font-mono text-xs text-zinc-500 hover:text-zinc-900"
            >
              /manager
            </Link>
            <Link
              href="/install"
              className="font-mono text-xs text-zinc-900 underline underline-offset-4"
            >
              /install
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-8 py-16">
        <h1 className="text-4xl font-medium tracking-tight">install seniorify</h1>
        <p className="mt-3 max-w-2xl text-zinc-600">
          One install. The plugin ships a skill that tells your AI agent when
          to run the audit loop, and registers the Seniorify MCP server. Works
          with Claude Code, Cursor, and any MCP-capable client.
        </p>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <Card title="Claude Code" subtitle="recommended">
            <Code>{claudeCmd}</Code>
            <p className="mt-3 text-xs text-zinc-500">
              Installs the seniorify skill + MCP server. Claude will run the
              audit loop on every non-trivial coding task.
            </p>
          </Card>

          <Card title="Cursor">
            <Code>{cursorRule}</Code>
            <p className="mt-3 text-xs text-zinc-500">
              Drop the rule into your project, then add the MCP HTTP endpoint
              in Cursor&apos;s settings.
            </p>
          </Card>

          <Card title="Generic MCP client">
            <Code>{mcpJson}</Code>
            <p className="mt-3 text-xs text-zinc-500">
              Any MCP-capable client. Drop into <code className="font-mono">.mcp.json</code> or your client&apos;s equivalent.
            </p>
          </Card>
        </section>

        <section className="mt-16">
          <h2 className="text-sm text-zinc-500">tools exposed</h2>
          <table className="mt-4 w-full text-left">
            <tbody>
              {tools.map(([name, desc]) => (
                <tr key={name} className="border-t border-zinc-200">
                  <td className="py-3 pr-6 align-top font-mono text-sm text-zinc-900">
                    {name}
                  </td>
                  <td className="py-3 text-sm text-zinc-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-16 border-t border-zinc-200 pt-10">
          <h2 className="text-sm text-zinc-500">what installs</h2>
          <ul className="mt-3 space-y-1 text-sm text-zinc-700">
            <li>
              <span className="font-mono text-xs text-zinc-500">skill</span> —
              the senior&apos;s prompt: how and when to call Seniorify.
            </li>
            <li>
              <span className="font-mono text-xs text-zinc-500">command</span> —
              <code className="font-mono"> /audit</code> for manual runs.
            </li>
            <li>
              <span className="font-mono text-xs text-zinc-500">mcp</span> — the
              audit-trail server at <code className="font-mono">seniorify.dev/api/mcp</code>.
            </li>
          </ul>
        </section>

        <section className="mt-16 text-xs text-zinc-500">
          <Link href="https://github.com/mbrian23/seniorify-dev" className="underline">
            github.com/mbrian23/seniorify-dev
          </Link>
        </section>
      </main>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[4px] border border-zinc-200 p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-zinc-900">{title}</h3>
        {subtitle ? (
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#B45309]">
            {subtitle}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-[4px] border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed text-zinc-800">
      {children}
    </pre>
  );
}
