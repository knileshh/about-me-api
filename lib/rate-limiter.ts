/**
 * Simple in-memory rate limiter for Next.js applications.
 * For production at scale, consider using Upstash Redis or similar.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

// Store rate limit entries by IP + endpoint
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000;

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;

    lastCleanup = now;
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}

/**
 * Rate limit configurations for different endpoint types
 */
export const RATE_LIMITS = {
    // Public API - 100 requests per minute per IP
    api: { maxRequests: 100, windowMs: 60 * 1000 },

    // Username check - 30 requests per minute per IP (prevent enumeration)
    usernameCheck: { maxRequests: 30, windowMs: 60 * 1000 },

    // Auth endpoints - 10 requests per minute per IP (brute force protection)
    auth: { maxRequests: 10, windowMs: 60 * 1000 },

    // General API calls - 60 requests per minute per IP
    general: { maxRequests: 60, windowMs: 60 * 1000 },
};

export type RateLimitType = keyof typeof RATE_LIMITS;

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (usually IP + endpoint type)
 * @param limitType - Type of rate limit to apply
 * @returns Object with isLimited boolean and remaining requests
 */
export function checkRateLimit(
    identifier: string,
    limitType: RateLimitType = 'general'
): { isLimited: boolean; remaining: number; resetIn: number } {
    cleanup();

    const config = RATE_LIMITS[limitType];
    const now = Date.now();
    const key = `${limitType}:${identifier}`;

    let entry = rateLimitStore.get(key);

    // If no entry or entry has expired, create new one
    if (!entry || entry.resetTime < now) {
        entry = {
            count: 1,
            resetTime: now + config.windowMs,
        };
        rateLimitStore.set(key, entry);
        return {
            isLimited: false,
            remaining: config.maxRequests - 1,
            resetIn: config.windowMs,
        };
    }

    // Increment count
    entry.count++;

    // Check if over limit
    if (entry.count > config.maxRequests) {
        return {
            isLimited: true,
            remaining: 0,
            resetIn: entry.resetTime - now,
        };
    }

    return {
        isLimited: false,
        remaining: config.maxRequests - entry.count,
        resetIn: entry.resetTime - now,
    };
}

/**
 * Get client IP from request headers
 * Handles various proxy configurations
 */
export function getClientIP(request: Request): string {
    // Check common proxy headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        // Take the first IP in the chain (client IP)
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    // Fallback for development
    return '127.0.0.1';
}

/**
 * Create rate limit response headers
 */
export function rateLimitHeaders(remaining: number, resetIn: number): Record<string, string> {
    return {
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(resetIn / 1000).toString(),
    };
}
