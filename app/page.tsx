"use client";

import { Button } from "@/components/ui/button";
import { FloatingNavbar } from "@/components/floating-navbar";
import { CodeWindow } from "@/components/code-window";
import { Footer } from "@/components/footer";
import { GridBackground } from "@/components/ui/grid-background";
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
    <GridBackground className="text-foreground flex flex-col font-sans">
      <FloatingNavbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 md:pt-40 pb-16 md:pb-24 px-4">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center space-y-10">

          {/* Hero Copy */}
          <div className="space-y-5 max-w-4xl z-20">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground leading-[1.05]">
              Your Personal{" "}
              <span className="text-muted-foreground/80 italic relative inline-block">
                API Endpoint
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              A single JSON source of truth for your identity. Perfect for AI context, portfolios, and effortless sharing.
            </p>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleClaim}
            className="w-full max-w-lg mx-auto z-20"
          >
            <div className="relative group">
              {/* Animated Border Ray */}
              <div className="absolute -inset-[2px] rounded-full overflow-hidden">
                <div
                  className="absolute inset-0 animate-border-ray"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0deg, rgba(20, 184, 166, 0.8) 60deg, rgba(6, 182, 212, 0.8) 120deg, transparent 180deg)",
                  }}
                />
              </div>
              {/* Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-sky-500/20 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-background backdrop-blur-md border border-transparent rounded-full p-1.5 pl-5 shadow-2xl transition-all duration-300">
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
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-5 h-10 shrink-0 transition-all active:scale-95 shadow-lg font-medium group/btn"
                >
                  <span className="mr-1">Go</span>
                  <ArrowRight size={16} className="group-hover/btn:animate-arrow-bounce" />
                </Button>
              </div>
            </div>
          </form>

          {/* Code Demo */}
          <div className="w-full max-w-4xl mt-6 z-10">
            <div className="transform hover:scale-[1.01] transition-transform duration-500 ease-out">
              <CodeWindow />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </GridBackground>
  );
}
