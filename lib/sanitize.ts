/**
 * Input sanitization utilities to prevent XSS and other injection attacks
 */

/**
 * Remove HTML tags from a string
 * Prevents XSS attacks in user-generated content
 */
export function stripHtml(input: string): string {
    if (!input || typeof input !== 'string') return '';

    // Remove HTML tags
    return input
        .replace(/<[^>]*>/g, '')
        // Remove any remaining HTML entities that could be malicious
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
        // Then escape them back for display
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Sanitize text input - removes dangerous characters while preserving most text
 */
export function sanitizeText(input: string, maxLength: number = 1000): string {
    if (!input || typeof input !== 'string') return '';

    return input
        .trim()
        .slice(0, maxLength)
        // Remove null bytes
        .replace(/\0/g, '')
        // Remove control characters except newlines and tabs
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Sanitize a URL - ensures it's a valid http/https URL
 */
export function sanitizeUrl(input: string): string | null {
    if (!input || typeof input !== 'string') return null;

    const trimmed = input.trim();

    // Only allow http and https protocols
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        // Try adding https
        const withHttps = 'https://' + trimmed;
        try {
            const url = new URL(withHttps);
            // Block javascript: and data: protocols
            if (url.protocol === 'https:' || url.protocol === 'http:') {
                return url.href;
            }
        } catch {
            return null;
        }
        return null;
    }

    try {
        const url = new URL(trimmed);
        // Only allow http/https
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return null;
        }
        return url.href;
    } catch {
        return null;
    }
}

/**
 * Sanitize username - only allow safe characters
 */
export function sanitizeUsername(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
        .trim()
        .toLowerCase()
        // Only allow alphanumeric, underscores, and hyphens
        .replace(/[^a-z0-9_-]/g, '')
        .slice(0, 30);
}

/**
 * Sanitize email - basic email format validation
 */
export function sanitizeEmail(input: string): string | null {
    if (!input || typeof input !== 'string') return null;

    const trimmed = input.trim().toLowerCase();

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed) || trimmed.length > 254) {
        return null;
    }

    return trimmed;
}

/**
 * Sanitize an object recursively - sanitize all string values
 */
export function sanitizeObject<T>(obj: T, maxDepth: number = 5): T {
    if (maxDepth <= 0) return obj;

    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'string') {
        return sanitizeText(obj) as T;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item, maxDepth - 1)) as T;
    }

    if (typeof obj === 'object') {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            // Sanitize keys too
            const sanitizedKey = sanitizeText(key, 100);
            result[sanitizedKey] = sanitizeObject(value, maxDepth - 1);
        }
        return result as T;
    }

    return obj;
}

/**
 * Check if a string contains potential XSS patterns
 */
export function containsXssPatterns(input: string): boolean {
    if (!input || typeof input !== 'string') return false;

    const lower = input.toLowerCase();

    const xssPatterns = [
        '<script',
        'javascript:',
        'onerror=',
        'onload=',
        'onclick=',
        'onmouseover=',
        'onfocus=',
        'onblur=',
        'eval(',
        'expression(',
        'vbscript:',
        'data:text/html',
    ];

    return xssPatterns.some(pattern => lower.includes(pattern));
}

/**
 * Log security event for monitoring
 */
export function logSecurityEvent(
    type: 'xss_attempt' | 'injection_attempt' | 'rate_limit' | 'suspicious_activity',
    details: Record<string, unknown>
): void {
    console.warn(`[SECURITY] ${type}:`, {
        timestamp: new Date().toISOString(),
        ...details,
    });
}
