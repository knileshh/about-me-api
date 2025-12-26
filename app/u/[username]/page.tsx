import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ProfileData } from "@/types/profile";

// Disable prerendering - this page uses auth data to check ownership
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { username } = await params;
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from("profiles")
        .select("profile_data")
        .eq("username", username.toLowerCase())
        .eq("is_public", true)
        .single();

    if (!profile) {
        return { title: "Profile Not Found | About Me API" };
    }

    const data = profile.profile_data as ProfileData;
    const name = [data.identity?.name?.first, data.identity?.name?.last]
        .filter(Boolean)
        .join(" ");

    return {
        title: `${name || username} | About Me API`,
        description: data.identity?.bio || `View ${username}'s profile on About Me API`,
    };
}

export default async function ProfilePage({ params }: PageProps) {
    const { username } = await params;
    const supabase = await createClient();

    // Check if current user is logged in and get their profile info
    const { data: authData } = await supabase.auth.getClaims();
    const isLoggedIn = !!authData?.claims;
    let hasProfile = false;
    let isOwner = false;

    if (isLoggedIn && authData?.claims?.sub) {
        const { data: userProfile } = await supabase
            .from("profiles")
            .select("id, username")
            .eq("user_id", authData.claims.sub)
            .single();
        hasProfile = !!userProfile;
        // Check if the logged-in user is viewing their own profile
        isOwner = userProfile?.username?.toLowerCase() === username.toLowerCase();
    }

    // Fetch the requested profile
    // If user is owner, fetch without is_public restriction
    let profile;
    let error;

    if (isOwner) {
        // Owner can view their own profile regardless of privacy setting
        const result = await supabase
            .from("profiles")
            .select("*")
            .eq("username", username.toLowerCase())
            .single();
        profile = result.data;
        error = result.error;
    } else {
        // Non-owners can only view public profiles
        const result = await supabase
            .from("profiles")
            .select("*")
            .eq("username", username.toLowerCase())
            .eq("is_public", true)
            .single();
        profile = result.data;
        error = result.error;
    }

    if (error || !profile) {
        notFound();
    }

    // Log API access (fire and forget)
    supabase.from("api_logs").insert({
        profile_id: profile.id,
        username: profile.username,
        endpoint: `/u/${username}`,
    });

    const data = profile.profile_data as ProfileData;
    const fullName = [
        data.identity?.name?.first,
        data.identity?.name?.middle,
        data.identity?.name?.last,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <main className="min-h-screen flex flex-col">
            {/* Header */}
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    <Link href="/" className="font-semibold text-lg">
                        About Me API
                    </Link>
                    <div className="flex items-center gap-4">
                        {isLoggedIn && hasProfile ? (
                            <Link href="/protected" className="text-muted-foreground hover:text-foreground">
                                Dashboard
                            </Link>
                        ) : (
                            <Link href="/builder" className="text-muted-foreground hover:text-foreground">
                                Create yours
                            </Link>
                        )}
                        <ThemeSwitcher />
                    </div>
                </div>
            </nav>

            {/* Profile Content */}
            <div className="flex-1 flex flex-col items-center py-12 px-4">
                <Card className="w-full max-w-2xl">
                    <CardContent className="pt-8 space-y-6">
                        {/* Header with Avatar */}
                        <div className="text-center">
                            {/* Avatar */}
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-3xl font-bold text-primary">
                                {data.identity?.name?.first?.[0]?.toUpperCase() || profile.username[0].toUpperCase()}
                                {data.identity?.name?.last?.[0]?.toUpperCase() || ""}
                            </div>
                            <h1 className="text-3xl font-bold">{fullName || profile.username}</h1>
                            {data.identity?.pronouns && (
                                <p className="text-muted-foreground text-sm mt-1">
                                    ({data.identity.pronouns})
                                </p>
                            )}
                            {data.identity?.bio && (
                                <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
                                    {data.identity.bio}
                                </p>
                            )}
                        </div>

                        {/* Location */}
                        {data.location?.current_city && (
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                    📍 {data.location.current_city}
                                    {data.location.timezone && ` (${data.location.timezone})`}
                                </p>
                            </div>
                        )}

                        {/* Roles */}
                        {data.career?.primary_roles && data.career.primary_roles.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2">
                                {data.career.primary_roles.map((role) => (
                                    <Badge key={role} variant="secondary">
                                        {role}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Open to Work Badge */}
                        {data.job_preferences?.open_to_work && (
                            <div className="text-center">
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                    ✓ Open to Work
                                </Badge>
                            </div>
                        )}

                        {/* Tech Stack */}
                        {data.job_preferences?.tech_focus && data.job_preferences.tech_focus.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-center mb-3">Tech Focus</h3>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {data.job_preferences.tech_focus.map((tech) => (
                                        <Badge key={tech} variant="outline">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Links */}
                        {data.presence?.socials && (
                            <div className="flex flex-wrap justify-center gap-4 pt-4 border-t">
                                {data.presence.socials.github && (
                                    <a
                                        href={data.presence.socials.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        GitHub
                                    </a>
                                )}
                                {data.presence.socials.linkedin && (
                                    <a
                                        href={data.presence.socials.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        LinkedIn
                                    </a>
                                )}
                                {data.presence.socials.twitter && (
                                    <a
                                        href={data.presence.socials.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Twitter
                                    </a>
                                )}
                                {data.presence.socials.youtube && (
                                    <a
                                        href={data.presence.socials.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        YouTube
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Contact */}
                        {data.contact?.emails?.work && data.contact.visibility === "public" && (
                            <div className="text-center pt-4 border-t">
                                <a
                                    href={`mailto:${data.contact.emails.work}`}
                                    className="text-primary hover:underline"
                                >
                                    {data.contact.emails.work}
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* API Info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                        Get this profile as JSON:
                    </p>
                    <code className="text-xs bg-muted px-3 py-1 rounded">
                        curl https://aboutme.knileshh.com/api/u/{profile.username}
                    </code>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full flex items-center justify-center border-t text-center text-xs py-8">
                <p className="text-muted-foreground">
                    Powered by{" "}
                    <Link href="/" className="font-medium hover:underline">
                        About Me API
                    </Link>
                </p>
            </footer>
        </main>
    );
}
