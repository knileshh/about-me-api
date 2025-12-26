"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { FloatingNavbar } from "@/components/floating-navbar";
import { CodeWindow } from "@/components/code-window";
import { Footer } from "@/components/footer";
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
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-white/20">
      <FloatingNavbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/3 pointer-events-none" />

        <div className="z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-12">

          {/* Hero Copy */}
          <div className="space-y-6 max-w-3xl">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
              Your Identity, <br />
              <span className="italic text-muted-foreground">Contextualized for AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
              Stop repeating yourself to chatbots. Create a single API endpoint that gives AI tools context about you, your work, and your preferences.
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleClaim} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mx-auto">
            <div className="relative w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-full p-2 pl-6 focus-within:border-white/20 transition-colors shadow-2xl">
                <span className="text-muted-foreground text-base font-mono hidden sm:inline-block mr-2">about-me.api/</span>
                <input
                  type="text"
                  placeholder="username"
                  className="bg-transparent border-none text-foreground placeholder:text-muted-foreground/50 focus:ring-0 w-full text-base font-medium p-0"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-label="Username"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full bg-white text-black hover:bg-zinc-200 w-10 h-10 shrink-0 transition-transform active:scale-95 ml-2 z-10 relative"
                >
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </form>

          {/* Code Demo */}
          <div className="w-full max-w-2xl mt-8 perspective-1000">
            <div className="transform hover:scale-[1.02] transition-transform duration-500 ease-out">
              <CodeWindow className="shadow-2xl" />
            </div>
          </div>
        </div>
      </main>

      {/* Social Proof */}
      <div className="w-full border-y border-white/5 bg-black/20 backdrop-blur-sm py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-muted-foreground/50 mb-8 uppercase tracking-widest">Powering developers at</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-30 grayscale mix-blend-screen text-xl md:text-2xl font-semibold">
            <span className="font-serif">Vercel</span>
            <span className="font-sans tracking-tight">Linear</span>
            <span className="font-mono">Supabase</span>
            <span className="font-serif italic">Stripe</span>
            <span className="font-sans font-bold">Resend</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
