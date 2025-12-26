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
      <main className="flex-1 flex flex-col items-center justify-center relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/3 pointer-events-none" />

        <div className="z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Column: Copy & Input */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                The Professional Network for <br className="hidden lg:block" />
                <span className="italic text-muted-foreground">builders</span> to show & tell.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground/80 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                Showcase your work, launch projects, find jobs, and connect with the most (in)credible people.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleClaim} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mx-auto lg:mx-0">
              <div className="relative w-full group">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-full p-1.5 focus-within:border-white/20 transition-colors">
                  <span className="pl-4 text-muted-foreground text-sm font-mono hidden sm:inline-block">about-me-api.com/</span>
                  <input
                    type="text"
                    placeholder="username"
                    className="bg-transparent border-none text-foreground placeholder:text-muted-foreground/50 focus:ring-0 w-full text-sm font-medium px-2 py-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    aria-label="Username"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-full bg-white text-black hover:bg-zinc-200 w-8 h-8 shrink-0 transition-transform active:scale-95"
                  >
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            </form>
            <p className="text-xs text-muted-foreground/60 text-center lg:text-left pl-4">
              Claim your username before it's too late!
            </p>
          </div>

          {/* Right Column: Code Demo */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none perspective-1000">
            <div className="transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out preserve-3d">
              <CodeWindow />
            </div>
          </div>
        </div>
      </main>

      {/* Social Proof / Trusted By (Optional Placeholder) */}
      <div className="w-full border-y border-white/5 bg-black/20 backdrop-blur-sm py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-muted-foreground/50 mb-6 uppercase tracking-widest">Trusted by builders at</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale mix-blend-screen">
            {/* Simple text placeholders for logos to verify layout */}
            <span className="text-xl font-bold font-serif">Vercel</span>
            <span className="text-xl font-bold font-sans">Linear</span>
            <span className="text-xl font-bold font-mono">Supabase</span>
            <span className="text-xl font-bold font-serif">Stripe</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
