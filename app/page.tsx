import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <Link href="/" className="font-semibold text-lg">
            About Me API
          </Link>
          <div className="flex items-center gap-4">
            {hasEnvVars && (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Your identity,{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              one API call away
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Give AI tools your context with a single URL. No more copy-pasting your bio,
            skills, and links every time you try a new tool.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/builder">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Create Your Profile →
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline">
                How it works
              </Button>
            </Link>
          </div>
        </div>

        {/* API Demo */}
        <div className="mt-16 w-full max-w-2xl">
          <Card className="bg-zinc-950 text-zinc-100 overflow-hidden">
            <CardContent className="p-6 font-mono text-sm">
              <p className="text-zinc-500 mb-2"># Get your profile with one command</p>
              <p className="mb-4">
                curl https://aboutme.knileshh.com/u/
                <span className="text-green-400">nilesh</span>
              </p>
              <div className="border-t border-zinc-800 pt-4 mt-4">
                <p className="text-zinc-500 mb-2"># Response</p>
                <pre className="text-xs text-zinc-400">
                  {`{
  "username": "nilesh",
  "identity": {
    "name": { "first": "Nilesh", "last": "Patel" },
    "bio": "Backend developer passionate about distributed systems"
  },
  "presence": {
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username"
  },
  "career": {
    "primary_roles": ["Backend Developer", "Systems Engineer"],
    "open_to_work": true
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="font-semibold mb-2">Fill in your details</h3>
              <p className="text-muted-foreground text-sm">
                Add your name, bio, social links, skills, and anything you want AI tools to know about you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="font-semibold mb-2">Get your personal URL</h3>
              <p className="text-muted-foreground text-sm">
                Your profile becomes available at a unique API endpoint that returns structured JSON.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="font-semibold mb-2">Share with any AI</h3>
              <p className="text-muted-foreground text-sm">
                Give the URL to ChatGPT, Claude, Cursor, or any tool. They'll instantly know your context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect for</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI Assistants",
                description: "Give Claude, ChatGPT, or Gemini instant context about you",
                emoji: "🤖",
              },
              {
                title: "Portfolio Sites",
                description: "Pull your profile data dynamically into any website",
                emoji: "💼",
              },
              {
                title: "Developer Tools",
                description: "Auto-fill your info in Cursor, VS Code, and other IDEs",
                emoji: "⚡",
              },
              {
                title: "Profile Images",
                description: "Version your avatars and switch between them",
                emoji: "🖼️",
              },
              {
                title: "Job Applications",
                description: "Share a link that always has your latest info",
                emoji: "📝",
              },
              {
                title: "Open Source",
                description: "Let collaborators quickly learn about you",
                emoji: "🌐",
              },
            ].map((item) => (
              <Card key={item.title} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <span className="text-3xl mb-4 block">{item.emoji}</span>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg opacity-90 mb-8">
            Create your profile in under 2 minutes. Free forever.
          </p>
          <Link href="/builder">
            <Button size="lg" variant="secondary">
              Create Your Profile →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-8">
        <p className="text-muted-foreground">
          © 2024 About Me API — Built with Next.js & Supabase
        </p>
        <ThemeSwitcher />
      </footer>
    </main>
  );
}
