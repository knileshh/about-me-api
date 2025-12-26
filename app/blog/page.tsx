import { Footer } from "@/components/footer";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = {
    title: "Blog | About Me API",
    description: "Learn about personal APIs, AI integrations, and developer identity management.",
};

// Static blog posts - can be replaced with CMS later
const blogPosts = [
    {
        slug: "why-you-need-personal-api",
        title: "Why Every Developer Needs a Personal API in 2025",
        excerpt: "In an AI-first world, having a structured way to share your identity with tools and applications is becoming essential. Here's why a personal API matters.",
        date: "December 26, 2024",
        category: "Guides",
        readTime: "5 min read",
    },
    {
        slug: "ai-tools-context",
        title: "How AI Tools Use Context About You",
        excerpt: "AI assistants like Claude, ChatGPT, and Copilot work better when they understand who you are. Learn how to provide context effectively.",
        date: "December 24, 2024",
        category: "AI",
        readTime: "4 min read",
    },
    {
        slug: "building-developer-brand",
        title: "Building Your Developer Brand with APIs",
        excerpt: "Your online presence is more than a resume. Discover how a personal API can serve as a dynamic, always-updated portfolio.",
        date: "December 22, 2024",
        category: "Career",
        readTime: "6 min read",
    },
    {
        slug: "privacy-first-profiles",
        title: "Privacy-First Digital Profiles: What to Share and What to Keep Private",
        excerpt: "Not everything needs to be public. Learn how to balance visibility with privacy in your developer profile.",
        date: "December 20, 2024",
        category: "Privacy",
        readTime: "4 min read",
    },
];

export default function BlogPage() {
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

            {/* Hero */}
            <div className="bg-gradient-to-b from-muted/50 to-background py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">Blog</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Insights on personal APIs, AI integrations, and building your developer identity
                    </p>
                </div>
            </div>

            {/* Blog Posts */}
            <div className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
                <div className="grid gap-6">
                    {blogPosts.map((post) => (
                        <Card key={post.slug} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge variant="secondary">{post.category}</Badge>
                                    <span className="text-sm text-muted-foreground">{post.date}</span>
                                    <span className="text-sm text-muted-foreground">•</span>
                                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                                </div>
                                <CardTitle className="text-xl hover:text-primary transition-colors">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </CardTitle>
                                <CardDescription className="text-base">
                                    {post.excerpt}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="text-primary text-sm font-medium hover:underline"
                                >
                                    Read more →
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 text-center p-8 bg-muted/30 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Ready to create your personal API?</h2>
                    <p className="text-muted-foreground mb-4">
                        Join developers who are already sharing their identity with AI tools.
                    </p>
                    <Link
                        href="/builder"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
                    >
                        Create Your Profile →
                    </Link>
                </div>
            </div>

            <Footer />
        </main>
    );
}
