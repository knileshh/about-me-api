/**
 * Reserved usernames that cannot be claimed by users.
 * These are blocked for security, internal use, or to prevent confusion.
 */

// Application routes and pages
const APP_ROUTES = [
    'about', 'api', 'auth', 'blog', 'builder', 'privacy', 'protected', 'terms',
    'login', 'signup', 'register', 'admin', 'dashboard', 'settings', 'help',
    'support', 'contact', 'pricing', 'docs', 'documentation', 'faq', 'home',
    'index', 'new', 'create', 'edit', 'delete', 'search', 'explore', 'discover',
    'profile', 'profiles', 'user', 'users', 'account', 'accounts',
];

// Brand and identity protection
const BRAND_NAMES = [
    'aboutme', 'about-me', 'aboutmeapi', 'about-me-api', 'aboutme-api',
    'official', 'verified', 'team', 'staff', 'moderator', 'mod',
    'administrator', 'admin', 'root', 'system', 'bot', 'robot',
];

// Security-sensitive paths
const SECURITY_PATHS = [
    'null', 'undefined', 'true', 'false', 'nan', 'infinity',
    'localhost', 'admin', 'administrator', 'root', 'superuser', 'sudo',
    'system', 'www', 'ftp', 'mail', 'email', 'smtp', 'pop', 'imap',
    'test', 'testing', 'demo', 'example', 'sample',
    'api', 'graphql', 'rest', 'webhook', 'webhooks', 'callback',
    'oauth', 'auth', 'login', 'logout', 'signin', 'signout', 'signup',
    'password', 'reset', 'forgot', 'recover', 'verify', 'confirm',
    'token', 'tokens', 'session', 'sessions', 'cookie', 'cookies',
    'ssl', 'secure', 'security', 'private', 'public',
    '.well-known', 'robots', 'sitemap', 'favicon', 'manifest',
];

// Common utility and file paths
const UTILITY_PATHS = [
    'static', 'assets', 'images', 'img', 'css', 'js', 'fonts',
    'media', 'files', 'uploads', 'download', 'downloads',
    'public', 'private', 'internal', 'external',
    'status', 'health', 'healthcheck', 'ping', 'version', 'info',
];

// Social and reserved words
const SOCIAL_RESERVED = [
    'me', 'my', 'mine', 'you', 'your', 'yours', 'we', 'our', 'ours',
    'everyone', 'anybody', 'somebody', 'nobody', 'anonymous', 'guest',
    'follow', 'following', 'followers', 'like', 'likes', 'share', 'shares',
    'comment', 'comments', 'post', 'posts', 'message', 'messages',
    'notification', 'notifications', 'feed', 'news', 'trending', 'popular',
];

// Inappropriate or problematic terms (basic list)
const BLOCKED_TERMS = [
    'abuse', 'spam', 'scam', 'phishing', 'malware', 'virus',
    'hack', 'hacker', 'exploit', 'attack',
];

// Combine all reserved usernames
export const RESERVED_USERNAMES = [
    ...new Set([
        ...APP_ROUTES,
        ...BRAND_NAMES,
        ...SECURITY_PATHS,
        ...UTILITY_PATHS,
        ...SOCIAL_RESERVED,
        ...BLOCKED_TERMS,
    ].map(name => name.toLowerCase()))
];

/**
 * Check if a username is reserved/blocked
 * @param username - The username to check
 * @returns true if the username is reserved and cannot be used
 */
export function isReservedUsername(username: string): boolean {
    const normalized = username.toLowerCase().trim();

    // Check exact match
    if (RESERVED_USERNAMES.includes(normalized)) {
        return true;
    }

    // Check if starts with reserved prefix
    const reservedPrefixes = ['admin', 'mod', 'staff', 'official', 'verified', 'system'];
    for (const prefix of reservedPrefixes) {
        if (normalized.startsWith(prefix)) {
            return true;
        }
    }

    // Check if contains problematic patterns
    const blockedPatterns = ['admin', 'support', 'help', 'official'];
    for (const pattern of blockedPatterns) {
        if (normalized.includes(pattern) && normalized !== pattern) {
            // Only block if it's trying to impersonate (e.g., "admin123", "official_support")
            if (normalized.length > pattern.length + 3) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Validate username format
 * @param username - The username to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateUsername(username: string): { isValid: boolean; error?: string } {
    const normalized = username.toLowerCase().trim();

    // Length check
    if (normalized.length < 3) {
        return { isValid: false, error: 'Username must be at least 3 characters' };
    }

    if (normalized.length > 30) {
        return { isValid: false, error: 'Username must be 30 characters or less' };
    }

    // Character check (only lowercase letters, numbers, underscores, hyphens)
    if (!/^[a-z0-9_-]+$/.test(normalized)) {
        return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
    }

    // Cannot start or end with underscore or hyphen
    if (/^[-_]|[-_]$/.test(normalized)) {
        return { isValid: false, error: 'Username cannot start or end with underscore or hyphen' };
    }

    // Cannot have consecutive special characters
    if (/[-_]{2,}/.test(normalized)) {
        return { isValid: false, error: 'Username cannot have consecutive underscores or hyphens' };
    }

    // Reserved username check
    if (isReservedUsername(normalized)) {
        return { isValid: false, error: 'This username is reserved' };
    }

    return { isValid: true };
}
