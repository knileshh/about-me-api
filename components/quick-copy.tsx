"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/config";

interface QuickCopyButtonProps {
    username: string;
    isPublic: boolean;
    apiKey: string | null;
}

export function QuickCopyButton({ username, isPublic, apiKey }: QuickCopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const baseUrl = getApiUrl(username);

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
            size="lg"
            className={`gap-2 ${isPublic ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'}`}
        >
            {!isPublic && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            {copied ? "Copied!" : "Copy API Request"}
        </Button>
    );
}

interface ProfileAvatarProps {
    initials: string;
    isPublic: boolean;
    size?: "sm" | "md" | "lg";
}

export function ProfileAvatar({ initials, isPublic, size = "md" }: ProfileAvatarProps) {
    const sizeClasses = {
        sm: "w-10 h-10 text-sm",
        md: "w-16 h-16 text-xl",
        lg: "w-24 h-24 text-3xl",
    };

    return (
        <div className="relative inline-block">
            <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center font-bold text-primary`}>
                {initials}
            </div>
            {!isPublic && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center border-2 border-background">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17a2 2 0 002-2h-4a2 2 0 002 2zm6-9v-1a6 6 0 00-12 0v1H4v2h16V8h-2zm-2 0H8V7a4 4 0 018 0v1z" />
                    </svg>
                </div>
            )}
        </div>
    );
}
