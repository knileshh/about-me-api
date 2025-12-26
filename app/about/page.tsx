import { Footer } from "@/components/footer";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export const metadata = {
    title: "About | About Me API",
    description: "Learn about About Me API - the platform that helps developers create personal API endpoints for AI tools.",
};

export default function AboutPage() {
    return (
        <main className="min-h-screen flex flex-col">
            {/* Header */}
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    <Link href="/" className="font-semibold text-lg">
                        About Me API
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/builder" className="text-muted-foreground hover:text-foreground">
                            Create Profile
                        </Link>
                        <ThemeSwitcher />
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="flex-1 max-w-3xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold mb-8">About About Me API</h1>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            About Me API was created to solve a simple yet important problem: giving AI tools
                            and applications context about who you are. In an era where AI assistants are
                            becoming increasingly prevalent, having a standardized way to share your professional
                            identity is essential.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
                        <ul className="space-y-4 text-muted-foreground">
                            <li className="flex gap-3">
                                <span className="text-primary">✓</span>
                                <span><strong>Personal API Endpoint:</strong> Create a unique URL that returns your profile data in JSON format.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary">✓</span>
                                <span><strong>AI-Ready Format:</strong> Structured data that AI tools can easily understand and use.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary">✓</span>
                                <span><strong>Privacy Control:</strong> Choose what information to share publicly.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary">✓</span>
                                <span><strong>Analytics:</strong> Track how often your API is accessed.</span>
                            </li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
                        <ol className="space-y-4 text-muted-foreground list-decimal list-inside">
                            <li>Create your profile using our simple wizard</li>
                            <li>Choose a unique username</li>
                            <li>Get your personal API URL (e.g., aboutme.knileshh.com/api/u/yourname)</li>
                            <li>Share it with AI tools, add it to your resume, or embed it in your portfolio</li>
                        </ol>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">Built By</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            About Me API is built by Nilesh Kumar, a passionate developer focused on
                            creating tools that bridge the gap between humans and AI. This project is
                            open-source and welcomes contributions from the community.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
                        <p className="text-muted-foreground mb-4">
                            Ready to create your personal API? It takes less than 2 minutes.
                        </p>
                        <Link
                            href="/builder"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
                        >
                            Create Your Profile →
                        </Link>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
