import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "seniorify — deck",
  description:
    "A short story about junior developers, AI agents, and the seniors we still need to train.",
};

export default function DeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
