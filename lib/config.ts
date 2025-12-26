// Site configuration - uses environment variable or falls back to default
export const siteConfig = {
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://aboutme.knileshh.com",
    name: "About Me API",
    description: "Your identity, one API call away",
} as const;

export function getApiUrl(username: string): string {
    return `${siteConfig.url}/api/u/${username}`;
}

export function getProfileUrl(username: string): string {
    return `${siteConfig.url}/u/${username}`;
}

export function getSiteUrl(): string {
    return siteConfig.url;
}
