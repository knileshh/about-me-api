"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getSiteUrl } from "@/lib/config";

interface ShareButtonsProps {
    profileUrl?: string;
    apiUrl?: string;
}

export function ShareButtons({ profileUrl, apiUrl }: ShareButtonsProps) {
    const siteUrl = getSiteUrl();
    const [copied, setCopied] = useState(false);

    const shareText = "Check out About Me API - Your identity, one API call away!";
    const profileShareText = profileUrl
        ? "Check out my About Me API profile!"
        : shareText;

    const shareOnTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(profileShareText)}&url=${encodeURIComponent(profileUrl || siteUrl)}`;
        window.open(url, "_blank", "width=600,height=400");
    };

    const shareOnLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl || siteUrl)}`;
        window.open(url, "_blank", "width=600,height=600");
    };

    const copyLink = async () => {
        const textToCopy = apiUrl || profileUrl || siteUrl;
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={shareOnTwitter}>
                Share on X
            </Button>
            <Button variant="outline" size="sm" onClick={shareOnLinkedIn}>
                Share on LinkedIn
            </Button>
            <Button variant="outline" size="sm" onClick={copyLink}>
                {copied ? "Copied!" : "Copy Link"}
            </Button>
        </div>
    );
}

export function ShareCTA() {
    const siteUrl = getSiteUrl();

    return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-6 border border-green-200 dark:border-green-900">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                        Love About Me API? Share it! 🚀
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                        Help others discover the power of personal APIs
                    </p>
                </div>
                <ShareButtons />
            </div>
        </div>
    );
}
