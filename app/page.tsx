"use client";

import { Button } from "@/components/ui/button";
import { FloatingNavbar } from "@/components/floating-navbar";
import { CodeWindow } from "@/components/code-window";
import { Footer } from "@/components/footer";
import { GridBackground } from "@/components/ui/grid-background";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Loader2, Check, X } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Debounced username check
  useEffect(() => {
    if (username.trim().length < 3) {
      setIsAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/check-username?username=${encodeURIComponent(username.trim())}`);
        const data = await res.json();
        setIsAvailable(data.available);
      } catch {
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [username]);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !isAvailable) return;

    setIsSubmitting(true);
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    router.push(`/builder?username=${encodeURIComponent(username.trim())}`);
  };

  const canSubmit = username.trim().length >= 3 && isAvailable === true && !isSubmitting;

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
            className="w-full max-w-md mx-auto z-20 relative"
          >
            <div className="relative group">
              {/* Animated Border Ray - Linear Shimmer */}
              <div className="absolute -inset-[2px] rounded-full overflow-hidden">
                <div
                  className="absolute inset-0 animate-shimmer"
                  style={{
                    backgroundImage: isAvailable === false
                      ? "linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), rgba(220, 38, 38, 1), rgba(239, 68, 68, 0.5), transparent)"
                      : isAvailable === true
                        ? "linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.5), rgba(22, 163, 74, 1), rgba(34, 197, 94, 0.5), transparent)"
                        : "linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.5), rgba(6, 182, 212, 1), rgba(20, 184, 166, 0.5), transparent)",
                    backgroundSize: "200% 100%",
                  }}
                />
              </div>
              {/* Glow Effect */}
              <div className={`absolute -inset-2 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 ${isAvailable === false
                ? "bg-gradient-to-r from-red-500/15 via-red-500/15 to-red-500/15"
                : isAvailable === true
                  ? "bg-gradient-to-r from-green-500/15 via-green-500/15 to-green-500/15"
                  : "bg-gradient-to-r from-teal-500/15 via-cyan-500/15 to-sky-500/15"
                }`} />
              <div className="relative flex items-center bg-background backdrop-blur-md border border-transparent rounded-full p-1.5 pl-5 shadow-2xl transition-all duration-300">
                <span className={`text-muted-foreground font-mono text-sm mr-1 whitespace-nowrap transition-all duration-200 ${isFocused ? 'hidden sm:inline-block' : 'inline-block'}`}>
                  about-me-api.xyz/
                </span>
                <input
                  type="text"
                  placeholder="username"
                  className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground/50 focus:ring-0 focus:outline-none text-base font-medium min-w-0"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  aria-label="Username"
                />
                {/* Status indicator */}
                {username.trim().length >= 3 && (
                  <div className="mr-2">
                    {isChecking ? (
                      <Loader2 size={16} className="animate-spin text-muted-foreground" />
                    ) : isAvailable === true ? (
                      <Check size={16} className="text-green-500" />
                    ) : isAvailable === false ? (
                      <X size={16} className="text-red-500" />
                    ) : null}
                  </div>
                )}
                <Button
                  type="submit"
                  size="icon"
                  disabled={!canSubmit}
                  className={`rounded-full w-10 h-10 shrink-0 transition-all active:scale-95 shadow-lg ${canSubmit
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <ArrowRight size={18} className={canSubmit ? "animate-button-pop" : ""} />
                  )}
                </Button>
              </div>
            </div>
            {/* Availability Status Badge - Absolute positioned */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
              {username.trim().length >= 3 && !isChecking && isAvailable !== null && (
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${isAvailable
                  ? "text-green-600 bg-green-500/10"
                  : "text-red-600 bg-red-500/10"
                  }`}>
                  {isAvailable ? "✓ Available" : "✗ Taken"}
                </span>
              )}
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
