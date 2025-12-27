"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CodeWindowProps {
    className?: string;
}

export function CodeWindow({ className }: CodeWindowProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const jsonData = {
        username: "knileshh",
        is_public: true,
        profile_data: {
            identity: {
                name: { first: "Knilesh", last: "H" },
                bio: "Full-stack developer building cool things.",
                pronouns: "he/him"
            },
            location: {
                current_city: "San Francisco, CA",
                timezone: "PST"
            },
            career: {
                primary_roles: ["Software Engineer", "Frontend Developer"]
            }
        }
    };

    // Simple JSON syntax highlighting using JSON.stringify
    const highlightJSON = (json: string): React.ReactNode[] => {
        return json.split('\n').map((line, i) => {
            // Highlight keys (quoted strings followed by :)
            const highlightedLine = line
                .replace(/"([^"]+)":/g, '<key>"$1"</key>:')
                .replace(/: "([^"]*)"/g, ': <str>"$1"</str>')
                .replace(/: (true|false)/g, ': <bool>$1</bool>')
                .replace(/: (\d+)/g, ': <num>$1</num>');

            // Parse the custom tags into React elements
            const parts = highlightedLine.split(/(<key>.*?<\/key>|<str>.*?<\/str>|<bool>.*?<\/bool>|<num>.*?<\/num>)/);

            return (
                <div key={i} className="whitespace-pre">
                    {parts.map((part, j) => {
                        if (part.startsWith('<key>')) {
                            return <span key={j} className="text-sky-500 dark:text-sky-400">{part.replace(/<\/?key>/g, '')}</span>;
                        }
                        if (part.startsWith('<str>')) {
                            return <span key={j} className="text-emerald-600 dark:text-emerald-400">{part.replace(/<\/?str>/g, '')}</span>;
                        }
                        if (part.startsWith('<bool>')) {
                            return <span key={j} className="text-amber-600 dark:text-amber-400">{part.replace(/<\/?bool>/g, '')}</span>;
                        }
                        if (part.startsWith('<num>')) {
                            return <span key={j} className="text-amber-600 dark:text-amber-400">{part.replace(/<\/?num>/g, '')}</span>;
                        }
                        return <span key={j} className="text-zinc-600 dark:text-zinc-300">{part}</span>;
                    })}
                </div>
            );
        });
    };

    const formattedJSON = JSON.stringify(jsonData, null, 2);

    return (
        <div className={cn("relative group", className)}>
            {/* Window Container */}
            <div className="relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-[#0D0D0D] border border-zinc-200 dark:border-white/10 shadow-2xl transition-all duration-500 hover:shadow-primary/10 hover:border-zinc-300 dark:hover:border-white/20">
                {/* Title Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-100 dark:bg-white/5 border-b border-zinc-200 dark:border-white/5 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-500">response.json</span>
                </div>

                {/* Content */}
                <div className="p-6 font-mono text-sm overflow-x-auto bg-zinc-50 dark:bg-transparent rounded-b-2xl">
                    {/* Command */}
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 mb-6">
                        <span className="text-emerald-600 dark:text-green-500">$</span>
                        <span className="text-zinc-500">curl</span>
                        <span className="text-sky-600 dark:text-blue-400">https://about-me-api.xyz/api/u/knileshh</span>
                    </div>

                    {/* Beautified JSON Response */}
                    <div className="text-xs md:text-sm leading-relaxed text-left">
                        {mounted ? highlightJSON(formattedJSON) : <pre>{formattedJSON}</pre>}
                    </div>
                </div>
            </div>

            {/* Background Glow - Using teal instead of purple */}
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-sky-500/20 blur-3xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-500" />
        </div>
    );
}
