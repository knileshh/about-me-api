import { ProfileWizard } from "@/components/profile/profile-wizard";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export const metadata = {
    title: "Create Your Profile | About Me API",
    description: "Build your personal API endpoint in minutes",
};

export default function BuilderPage() {
    return (
        <main className="min-h-screen flex flex-col">
            {/* Header */}
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    <Link href="/" className="font-semibold text-lg">
                        About Me API
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/auth/login" className="text-muted-foreground hover:text-foreground">
                            Login
                        </Link>
                        <ThemeSwitcher />
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center py-12 px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Build Your Profile</h1>
                    <p className="text-muted-foreground">
                        Create your personal API endpoint in just a few steps
                    </p>
                </div>

                <ProfileWizard />
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
