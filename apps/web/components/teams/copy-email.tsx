"use client";

import { useState } from "react";

export function CopyEmail({
  email,
  className,
  prefix = "or email",
}: {
  email: string;
  className?: string;
  prefix?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fall back: open the mail client if clipboard isn't available
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={
        className ??
        "text-sm text-zinc-600 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900 hover:decoration-zinc-900"
      }
      aria-label={`Copy ${email} to clipboard`}
    >
      {copied ? `Copied ${email} ✓` : `${prefix} ${email}`}
    </button>
  );
}
