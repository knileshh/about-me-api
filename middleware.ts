import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, getClientIP, rateLimitHeaders, RateLimitType } from '@/lib/rate-limiter';

/**
 * Security headers to add to all responses
 */
const securityHeaders = {
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // XSS protection (legacy, but still useful)
    'X-XSS-Protection': '1; mode=block',
    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Restrict browser features
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
};

/**
 * Determine rate limit type based on path
 */
function getRateLimitType(pathname: string): RateLimitType | null {
    // Auth endpoints - strictest limits
    if (pathname.startsWith('/auth/') || pathname.startsWith('/api/auth/')) {
        return 'auth';
    }

    // Username check endpoint
    if (pathname === '/api/check-username') {
        return 'usernameCheck';
    }

    // Public API endpoints
    if (pathname.startsWith('/api/')) {
        return 'api';
    }

    // Don't rate limit static assets and pages
    return null;
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const response = NextResponse.next();

    // Add security headers to all responses
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // Apply rate limiting for specific paths
    const limitType = getRateLimitType(pathname);

    if (limitType) {
        const clientIP = getClientIP(request);
        const { isLimited, remaining, resetIn } = checkRateLimit(clientIP, limitType);

        // Add rate limit headers
        const headers = rateLimitHeaders(remaining, resetIn);
        Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        // If rate limited, return 429
        if (isLimited) {
            return new NextResponse(
                JSON.stringify({
                    error: 'Too many requests',
                    message: 'Please slow down and try again later.',
                    retryAfter: Math.ceil(resetIn / 1000),
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': Math.ceil(resetIn / 1000).toString(),
                        ...securityHeaders,
                        ...headers,
                    },
                }
            );
        }
    }

    return response;
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        // Apply to all API routes
        '/api/:path*',
        // Apply to auth routes
        '/auth/:path*',
        // Apply to protected routes
        '/protected/:path*',
        // Apply to builder
        '/builder/:path*',
        // Exclude static files and images
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
