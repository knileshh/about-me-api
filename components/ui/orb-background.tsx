"use client";

import { cn } from "@/lib/utils";

interface OrbBackgroundProps {
    children: React.ReactNode;
    className?: string;
}

export function OrbBackground({ children, className }: OrbBackgroundProps) {
    return (
        <div className={cn("relative min-h-screen overflow-hidden bg-background", className)}>
            {/* Animated Orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Top-Left Orb */}
                <div
                    className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full opacity-30 blur-[100px] animate-pulse"
                    style={{
                        background: "radial-gradient(circle, rgba(79,70,229,0.8) 0%, transparent 70%)", // Indigo
                        animationDuration: "8s",
                    }}
                />
                {/* Top-Right Orb */}
                <div
                    className="absolute -top-20 right-0 h-[400px] w-[400px] rounded-full opacity-20 blur-[80px] animate-pulse"
                    style={{
                        background: "radial-gradient(circle, rgba(124,58,237,0.8) 0%, transparent 70%)", // Violet
                        animationDuration: "10s",
                        animationDelay: "2s",
                    }}
                />
                {/* Center-Right Orb - Subtle Blue */}
                <div
                    className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full opacity-25 blur-[120px] animate-pulse"
                    style={{
                        background: "radial-gradient(circle, rgba(37,99,235,0.7) 0%, transparent 70%)", // Blue
                        animationDuration: "12s",
                        animationDelay: "4s",
                    }}
                />
                {/* Bottom-Left Orb - Deep Indigo */}
                <div
                    className="absolute -bottom-20 -left-20 h-[500px] w-[500px] rounded-full opacity-20 blur-[100px] animate-pulse"
                    style={{
                        background: "radial-gradient(circle, rgba(67,56,202,0.6) 0%, transparent 70%)", // Dark Indigo
                        animationDuration: "9s",
                        animationDelay: "1s",
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
