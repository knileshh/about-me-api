import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { ProfileData } from "@/types/profile";

interface RouteParams {
    params: Promise<{ username: string }>;
}

// Filter out private fields for public API response
function filterPublicData(data: ProfileData): Partial<ProfileData> {
    const filtered: Partial<ProfileData> = { ...data };

    // Remove contact if marked as private
    if (filtered.contact?.visibility !== "public") {
        delete filtered.contact;
    }

    return filtered;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    const { username } = await params;
    const supabase = await createClient();

    // Get API key from Authorization header (if provided)
    const authHeader = request.headers.get("authorization");
    const apiKey = authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    // First, try to fetch the profile (public or with API key)
    let profile;
    let error;

    if (apiKey) {
        // If API key provided, fetch profile matching username AND api_key
        const result = await supabase
            .from("profiles")
            .select("*")
            .eq("username", username.toLowerCase())
            .eq("api_key", apiKey)
            .single();

        profile = result.data;
        error = result.error;

        if (error || !profile) {
            return NextResponse.json(
                { error: "Invalid API key or profile not found" },
                { status: 401 }
            );
        }
    } else {
        // No API key, only fetch public profiles
        const result = await supabase
            .from("profiles")
            .select("*")
            .eq("username", username.toLowerCase())
            .eq("is_public", true)
            .single();

        profile = result.data;
        error = result.error;

        if (error || !profile) {
            // Check if profile exists but is private
            const { data: privateProfile } = await supabase
                .from("profiles")
                .select("id, is_public")
                .eq("username", username.toLowerCase())
                .single();

            if (privateProfile && !privateProfile.is_public) {
                return NextResponse.json(
                    {
                        error: "This profile is private",
                        message: "Use API key authentication to access this profile. Include 'Authorization: Bearer <api_key>' header."
                    },
                    { status: 403 }
                );
            }

            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }
    }

    // Log API access (fire and forget)
    const callerIp = request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referer = request.headers.get("referer") || null;

    supabase.from("api_logs").insert({
        profile_id: profile.id,
        username: profile.username,
        endpoint: `/api/u/${username}`,
        caller_ip: callerIp,
        user_agent: userAgent,
        referer: referer,
    });

    // Filter out private fields
    const profileData = profile.profile_data as ProfileData;
    const publicData = filterPublicData(profileData);

    // Build response
    const response = {
        username: profile.username,
        ...publicData,
        _meta: {
            api_version: "1.0",
            fetched_at: new Date().toISOString(),
            profile_url: `https://aboutme.knileshh.com/u/${profile.username}`,
            is_public: profile.is_public,
        },
    };

    return NextResponse.json(response, {
        headers: {
            "Cache-Control": profile.is_public
                ? "public, s-maxage=60, stale-while-revalidate=300"
                : "private, no-cache",
        },
    });
}
