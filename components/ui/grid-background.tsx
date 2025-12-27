"use client";

import { cn } from "@/lib/utils";

interface GridBackgroundProps {
    children: React.ReactNode;
    className?: string;
}

export function GridBackground({ children, className }: GridBackgroundProps) {
    return (
        <div className={cn("relative min-h-screen bg-background selection:bg-primary/20", className)}>
            {/* Grid Background */}
            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)'
                }}
            >
                {/* Animated Beams */}
                <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent animate-grid-beam opacity-0 sm:opacity-100" />
                <div className="absolute top-0 left-3/4 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent animate-grid-beam animation-delay-2000 opacity-0 sm:opacity-100" style={{ animationDelay: '2s' }} />
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent animate-grid-beam animation-delay-4000 opacity-0 sm:opacity-100" style={{ animationDelay: '4s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
