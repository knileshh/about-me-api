"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HeaderCopyButtonProps {
    username: string;
    isPublic: boolean;
    apiKey: string | null;
}

export function HeaderCopyButton({ username, isPublic, apiKey }: HeaderCopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const baseUrl = `https://aboutme.knileshh.com/api/u/${username}`;

        let textToCopy: string;
        if (isPublic) {
            textToCopy = `curl ${baseUrl}`;
        } else if (apiKey) {
            textToCopy = `curl -H "Authorization: Bearer ${apiKey}" ${baseUrl}`;
        } else {
            textToCopy = baseUrl;
        }

        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            onClick={handleCopy}
            size="sm"
            variant="outline"
            className={`gap-1.5 ${!isPublic ? 'border-amber-500/50 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30' : ''}`}
            title={isPublic ? "Copy public API request" : "Copy private API request (includes API key)"}
        >
            {!isPublic && (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
        </Button>
    );
}
