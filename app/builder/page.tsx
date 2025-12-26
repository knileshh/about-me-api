import { ProfileWizard } from "@/components/profile/profile-wizard";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/lib/supabase/server";
import { ProfileData } from "@/types/profile";
import Link from "next/link";
import { redirect } from "next/navigation";

// Disable prerendering - this page uses auth data
export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Create Your Profile | About Me API",
    description: "Build your personal API endpoint in minutes",
};

export default async function BuilderPage() {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getClaims();
    const isLoggedIn = !!authData?.claims;

    // Check if user already has a profile
    let existingUsername: string | null = null;
    let existingProfileData: ProfileData | null = null;

    if (isLoggedIn && authData?.claims?.sub) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("username, profile_data")
            .eq("user_id", authData.claims.sub)
            .single();

        if (profile) {
            // User already has a profile, redirect to dashboard
            redirect("/protected");
        }
    }

    return (
        <main className="min-h-screen flex flex-col">
            {/* Header */}
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    <Link href="/" className="font-semibold text-lg">
                        About Me API
                    </Link>
                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <Link href="/protected" className="text-muted-foreground hover:text-foreground">
                                Dashboard
                            </Link>
                        ) : (
                            <Link href="/auth/login" className="text-muted-foreground hover:text-foreground">
                                Login
                            </Link>
                        )}
                        <ThemeSwitcher />
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center py-12 px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        {existingUsername ? "Edit Your Profile" : "Build Your Profile"}
                    </h1>
                    <p className="text-muted-foreground">
                        {existingUsername
                            ? "Update your profile information"
                            : "Create your personal API endpoint in just a few steps"}
                    </p>
                </div>

                <ProfileWizard
                    existingUsername={existingUsername}
                    existingProfileData={existingProfileData}
                />
            </div>

            {/* Footer */}
            <footer className="w-full flex items-center justify-center border-t text-center text-xs py-8">
                <p className="text-muted-foreground">
                    About Me API — Your identity, one API call away.
                </p>
            </footer>
        </main>
    );
}
