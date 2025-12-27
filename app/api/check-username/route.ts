import { createClient } from "@/lib/supabase/server";
import { validateUsername } from "@/lib/reserved-usernames";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
        return NextResponse.json(
            { available: false, error: "Username is required" },
            { status: 400 }
        );
    }

    // Validate username format and check if reserved
    const validation = validateUsername(username);
    if (!validation.isValid) {
        return NextResponse.json(
            { available: false, error: validation.error },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    // Check if username exists in database
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

