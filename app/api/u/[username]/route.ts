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

    // Fetch profile
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username.toLowerCase())
        .eq("is_public", true)
        .single();

    if (error || !profile) {
        return NextResponse.json(
            { error: "Profile not found" },
            { status: 404 }
        );
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
        },
    };

    return NextResponse.json(response, {
        headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
    });
}
