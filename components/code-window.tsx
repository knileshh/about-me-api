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

    const renderValue = (value: unknown, indent: number = 0): React.ReactNode => {
        const spacing = "  ".repeat(indent);

        if (typeof value === "string") {
            return <span className="text-emerald-400">"{value}"</span>;
        }
        if (typeof value === "boolean") {
            return <span className="text-amber-400">{value.toString()}</span>;
        }
        if (typeof value === "number") {
            return <span className="text-amber-400">{value}</span>;
        }
        if (Array.isArray(value)) {
            return (
                <span>
                    {"[\n"}
                    {value.map((item, i) => (
                        <span key={i}>
                            {spacing}    {renderValue(item, indent + 1)}
                            {i < value.length - 1 ? ",\n" : "\n"}
                        </span>
                    ))}
                    {spacing}  {"]"}
                </span>
            );
        }
        if (typeof value === "object" && value !== null) {
            const entries = Object.entries(value);
            return (
                <span>
                    {"{\n"}
                    {entries.map(([key, val], i) => (
                        <span key={key}>
                            {spacing}    <span className="text-sky-400">"{key}"</span>
                            <span className="text-zinc-400">: </span>
                            {renderValue(val, indent + 1)}
                            {i < entries.length - 1 ? ",\n" : "\n"}
                        </span>
                    ))}
                    {spacing}  {"}"}
                </span>
            );
        }
        return <span className="text-zinc-400">null</span>;
    };

    return (
        <div className={cn("relative group", className)}>
            {/* Window Container */}
            <div className="relative rounded-2xl overflow-hidden bg-zinc-900 dark:bg-[#0D0D0D] border border-zinc-200 dark:border-white/10 shadow-2xl transition-all duration-500 hover:shadow-primary/10 hover:border-zinc-300 dark:hover:border-white/20">
                {/* Title Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-100 dark:bg-white/5 border-b border-zinc-200 dark:border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-500">response.json</span>
                </div>

                {/* Content */}
                <div className="p-6 font-mono text-sm overflow-x-auto bg-zinc-50 dark:bg-transparent">
                    {/* Command */}
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 mb-6">
                        <span className="text-emerald-600 dark:text-green-500">$</span>
                        <span className="text-zinc-500">curl</span>
                        <span className="text-sky-600 dark:text-blue-400">https://about-me-api.com/api/u/knileshh</span>
                    </div>

                    {/* Beautified JSON Response */}
                    <pre className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
                        {mounted ? renderValue(jsonData) : JSON.stringify(jsonData, null, 2)}
                    </pre>
                </div>
            </div>

            {/* Background Glow - Using teal instead of purple */}
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-sky-500/20 blur-3xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-500" />
        </div>
    );
}
