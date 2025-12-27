import { Footer } from "@/components/footer";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export const metadata = {
    title: "Terms of Service | About Me API",
    description: "Terms of service for About Me API - Read our terms and conditions for using the platform.",
};

export default function TermsPage() {
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
                <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">Last updated: December 26, 2024</p>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using About Me API, you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            About Me API provides a platform for users to create personal API endpoints that
                            return structured profile data. This data can be consumed by AI tools, applications,
                            and other services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                        <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                            <li>You must provide accurate information when creating an account</li>
                            <li>You are responsible for maintaining the security of your account</li>
                            <li>One person may only have one account</li>
                            <li>Accounts are non-transferable</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You retain ownership of the content you submit to About Me API. By making your
                            profile public, you grant us a license to display and distribute that content
                            through our service.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            You agree not to submit content that:
                        </p>
                        <ul className="space-y-2 text-muted-foreground list-disc list-inside mt-2">
                            <li>Is false, misleading, or impersonates another person</li>
                            <li>Violates any laws or regulations</li>
                            <li>Contains malicious code or spam</li>
                            <li>Infringes on intellectual property rights</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. API Usage</h2>
                        <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                            <li>API endpoints are subject to rate limiting</li>
                            <li>Excessive or abusive API usage may result in account suspension</li>
                            <li>We reserve the right to modify API functionality with notice</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to suspend or terminate accounts that violate these terms.
                            You may delete your account at any time through your dashboard.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Disclaimer</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            About Me API is provided "as is" without warranties of any kind. We do not
                            guarantee uptime or availability of the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update these terms from time to time. Continued use of the service after
                            changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            For questions about these Terms, contact us at{" "}
                            <a href="mailto:legal@about-me-api.xyz" className="text-primary hover:underline">
                                legal@about-me-api.xyz
                            </a>
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
