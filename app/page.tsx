"use client";

import { Button } from "@/components/ui/button";
import { FloatingNavbar } from "@/components/floating-navbar";
import { CodeWindow } from "@/components/code-window";
import { Footer } from "@/components/footer";
import { OrbBackground } from "@/components/ui/orb-background";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/builder?username=${encodeURIComponent(username.trim())}`);
    }
  };

  return (
    <OrbBackground className="text-foreground flex flex-col font-sans selection:bg-primary/20">
      <FloatingNavbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 md:pt-40 pb-16 md:pb-24 px-4">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center space-y-10">

          {/* Hero Copy */}
          <div className="space-y-5 max-w-4xl">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
              Your Personal{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                API Endpoint
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              A single JSON source of truth for your identity. Perfect for AI context, portfolios, and effortless sharing.
            </p>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleClaim}
            className="w-full max-w-lg mx-auto"
          >
            <div className="flex items-center bg-card/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-border/70 dark:border-white/10 rounded-full p-1.5 pl-5 shadow-lg hover:border-primary/50 focus-within:border-primary/50 transition-all duration-300">
              <span className="text-muted-foreground font-mono text-sm hidden sm:inline-block mr-1 whitespace-nowrap">
                about-me.api/
              </span>
              <input
                type="text"
                placeholder="username"
                className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground/50 focus:ring-0 focus:outline-none text-base font-medium min-w-0"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-label="Username"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-10 h-10 shrink-0 transition-transform active:scale-95 shadow-md"
              >
                <ArrowRight size={18} />
              </Button>
            </div>
          </form>

          {/* Code Demo */}
          <div className="w-full max-w-4xl mt-6">
            <CodeWindow className="shadow-2xl border border-border/50 dark:border-white/10" />
          </div>
        </div>
      </main>

      {/* Social Proof */}
      <section className="w-full border-y border-border/50 dark:border-white/5 bg-muted/30 dark:bg-black/30 backdrop-blur-sm py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs font-medium text-muted-foreground/60 mb-6 uppercase tracking-widest">
            Powering developers at
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-14 text-lg md:text-xl font-semibold text-muted-foreground/40">
            <span className="font-serif">Vercel</span>
            <span className="font-sans tracking-tight">Linear</span>
            <span className="font-mono">Supabase</span>
            <span className="font-serif italic">Stripe</span>
            <span className="font-sans font-bold">Resend</span>
          </div>
        </div>
      </section>

      <Footer />
    </OrbBackground>
  );
}
