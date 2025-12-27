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

    const jsonResponse = `{
  "username": "knileshh",
  "is_public": true,
  "profile_data": {
    "identity": {
      "name": {
        "first": "Knilesh",
        "last": "H"
      },
      "bio": "Full-stack developer building cool things.",
      "pronouns": "he/him"
    },
    "location": {
      "current_city": "San Francisco, CA",
      "timezone": "PST"
    },
    "career": {
      "primary_roles": [
        "Software Engineer",
        "Frontend Developer"
      ]
    }
  }
}`;

    // Simple syntax highlighting for JSON
    const highlightJSON = (json: string) => {
        if (!mounted) return json;

        return json.split('\n').map((line, i) => {
            const parts = line.split(':');
            if (parts.length > 1) {
                const key = parts[0];
                const value = parts.slice(1).join(':');
                return (
                    <div key={i} className="pl-4 border-l-2 border-transparent hover:border-zinc-700/50 hover:bg-zinc-800/30 transition-colors">
                        <span className="text-blue-400">{key}</span>
                        <span className="text-zinc-500">:</span>
                        <span className="text-green-400">{value}</span>
                    </div>
                );
            }
            return <div key={i} className="pl-4 text-zinc-400">{line}</div>;
        });
    };

    return (
        <div className={cn("relative group", className)}>
            {/* Window Container */}
            <div className="relative rounded-2xl overflow-hidden bg-[#0D0D0D] border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-primary/5 hover:border-white/20">
                {/* Title Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 font-mono text-sm overflow-x-auto">
                    {/* Command */}
                    <div className="flex items-center gap-2 text-zinc-300 mb-6 px-2">
                        <span className="text-green-500">➜</span>
                        <span className="text-blue-400">~</span>
                        <span className="typing-text">curl https://about-me-api.com/api/u/knileshh</span>
                    </div>

                    {/* Response */}
                    <div className="space-y-1 text-xs md:text-sm pl-2">
                        {highlightJSON(jsonResponse)}
                    </div>
                </div>
            </div>

            {/* Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 blur-3xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-500" />
        </div>
    );
}
