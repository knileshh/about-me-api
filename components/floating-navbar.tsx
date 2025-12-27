"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowUp } from "lucide-react";

export function FloatingNavbar() {
    const pathname = usePathname();
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show back-to-top button after scrolling 300px
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);

        // Check auth status
        const checkAuth = async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();
            setIsLoggedIn(!!data.session);
        };
        checkAuth();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Docs", href: "/docs" },
    ];

    return (
        <>
            {/* Main Navbar - Fixed at top, doesn't scroll with page */}
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <nav
                    className={cn(
                        "flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 w-full max-w-2xl",
                        "bg-background/80 backdrop-blur-md border border-border/50 shadow-lg"
                    )}
                >
                    {/* Logo */}
                    <Link href="/" className="font-serif font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
                        About Me API
                    </Link>

                    {/* Links - Desktop */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                        {isLoggedIn ? (
                            <Link href="/protected">
                                <Button size="sm" className="rounded-full px-5 h-9 font-medium">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/auth/login">
                                <Button size="sm" variant="default" className="rounded-full px-5 h-9 font-medium">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>

            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className={cn(
                    "fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg",
                    "hover:bg-primary/90 transition-all duration-300 transform",
                    showBackToTop
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"
                )}
                aria-label="Back to top"
            >
                <ArrowUp className="h-5 w-5" />
            </button>
        </>
    );
}

