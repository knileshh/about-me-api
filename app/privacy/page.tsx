import { Footer } from "@/components/footer";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export const metadata = {
    title: "Privacy Policy | About Me API",
    description: "Privacy policy for About Me API - Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen flex flex-col">
            {/* Header */}
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    <Link href="/" className="font-semibold text-lg">
                        About Me API
                    </Link>
                    <ThemeSwitcher />
                </div>
            </nav>

            {/* Content */}
            <div className="flex-1 max-w-3xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last updated: December 26, 2024</p>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            When you use About Me API, we collect the following types of information:
                        </p>
                        <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                            <li><strong>Account Information:</strong> Email address and authentication data when you sign up.</li>
                            <li><strong>Profile Data:</strong> Information you choose to include in your profile (name, bio, social links, etc.).</li>
                            <li><strong>Usage Data:</strong> API access logs, IP addresses, and user agents of API consumers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                        <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                            <li>To provide and maintain the About Me API service</li>
                            <li>To display your public profile to visitors</li>
                            <li>To show you analytics about your API usage</li>
                            <li>To communicate with you about service updates</li>
                            <li>To detect and prevent fraud or abuse</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Your <strong>public profile data</strong> is accessible via your API endpoint and public profile page.
                            This is the core functionality of the service. Private data (like your email) is never shared
                            unless you explicitly include it in your public profile.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Data Storage</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use Supabase to store your data. Data is stored in secure data centers with
                            encryption at rest and in transit. We retain your data as long as your account is active.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
                        <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                            <li>Access your personal data</li>
                            <li>Update or correct your profile information</li>
                            <li>Delete your account and all associated data</li>
                            <li>Export your profile data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use essential cookies for authentication purposes. No third-party tracking
                            cookies are used.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at{" "}
                            <a href="mailto:privacy@about-me-api.xyz" className="text-primary hover:underline">
                                privacy@about-me-api.xyz
                            </a>
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
