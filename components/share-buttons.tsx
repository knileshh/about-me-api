"use client";

import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
    profileUrl?: string;
    apiUrl?: string;
}

export function ShareButtons({ profileUrl, apiUrl }: ShareButtonsProps) {
    const siteUrl = "https://aboutme.knileshh.com";
    const shareText = "Create your personal API endpoint with About Me API! Your identity, one API call away.";
    const profileShareText = profileUrl
        ? `Check out my profile API at ${profileUrl} - Built with About Me API!`
        : shareText;

    const shareOnTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(profileShareText)}&url=${encodeURIComponent(profileUrl || siteUrl)}`;
        window.open(url, "_blank", "width=600,height=400");
    };

    const shareOnLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl || siteUrl)}`;
        window.open(url, "_blank", "width=600,height=400");
    };

    const copyLink = async () => {
        const textToCopy = apiUrl || profileUrl || siteUrl;
        await navigator.clipboard.writeText(textToCopy);
        // Show a toast or feedback
    };

    return (
        <div className="flex flex-wrap gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={shareOnTwitter}
                className="gap-2"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={shareOnLinkedIn}
                className="gap-2"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Share on LinkedIn
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={copyLink}
                className="gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Link
            </Button>
        </div>
    );
}

export function ShareCTA() {
    return (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 text-center">
            <h3 className="font-semibold mb-2">🚀 Love About Me API?</h3>
            <p className="text-sm text-muted-foreground mb-4">
                Share it with developers who need a personal API endpoint!
            </p>
            <ShareButtons />
        </div>
    );
}
