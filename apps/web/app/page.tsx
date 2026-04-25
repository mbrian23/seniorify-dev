import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { PillarStrip } from "@/components/landing/pillar-strip";
import { TopBar } from "@/components/landing/top-bar";
import { VerbStrip } from "@/components/landing/verb-strip";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col bg-white text-zinc-900">
      <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-12 px-8 py-8">
        <TopBar />
        <div className="flex flex-1 flex-col justify-center gap-12 py-4">
          <Hero />
          <VerbStrip />
          <PillarStrip />
        </div>
        <Footer />
      </div>
    </main>
  );
}
