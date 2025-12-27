"use client";

import { cn } from "@/lib/utils";

interface GridBackgroundProps {
    children: React.ReactNode;
    className?: string;
}

export function GridBackground({ children, className }: GridBackgroundProps) {
    return (
        <div className={cn("relative min-h-screen bg-background selection:bg-primary/20", className)}>
            {/* Grid Background - Visible in both light and dark modes */}
            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(var(--grid-color), 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(var(--grid-color), 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px',
                    maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)'
                }}
            />

            {/* Subtle Radial Glow - Teal/Cyan accent */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[800px] h-[600px] opacity-20 blur-[120px]"
                    style={{
                        background: "radial-gradient(ellipse, rgba(20, 184, 166, 0.5) 0%, transparent 70%)" // teal-500
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
