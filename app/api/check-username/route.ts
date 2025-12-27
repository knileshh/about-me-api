import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username || username.trim().length < 3) {
        return NextResponse.json(
            { available: false, error: "Username must be at least 3 characters" },
            { status: 400 }
        );
    }

    // Validate username format (alphanumeric + underscores only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return NextResponse.json(
            { available: false, error: "Username can only contain letters, numbers, and underscores" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    // Check if username exists
    const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username.toLowerCase())
        .single();

    if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned (username available)
        return NextResponse.json(
            { available: false, error: "Database error" },
            { status: 500 }
        );
    }

    const available = !data;

    return NextResponse.json(
        { available, username: username.toLowerCase() },
        {
            headers: {
                "Cache-Control": "no-cache",
            },
        }
    );
}
