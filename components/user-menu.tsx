"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UserMenuProps {
    email: string;
    hasProfile?: boolean;
    username?: string;
}

function getInitials(email: string): string {
    const name = email.split("@")[0];
    if (name.length >= 2) {
        return name.substring(0, 2).toUpperCase();
    }
    return name.toUpperCase();
}

function getDisplayName(email: string): string {
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export function UserMenu({ email, hasProfile, username }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-muted/50 rounded-full p-1 pr-3 transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                    {getInitials(email)}
                </div>
                <span className="text-sm hidden sm:inline">
                    {getDisplayName(email)}
                </span>
                <svg
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-popover border rounded-md shadow-lg z-50">
                        <div className="p-3 border-b">
                            <p className="text-sm font-medium truncate">{email}</p>
                            {hasProfile && username && (
                                <p className="text-xs text-muted-foreground">@{username}</p>
                            )}
                        </div>

                        <div className="p-1">
                            {hasProfile && username && (
                                <Link
                                    href={`/${username}`}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-sm transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    View Profile
                                </Link>
                            )}

                            <Link
                                href="/builder"
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-sm transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {hasProfile ? "Edit Profile" : "Create Profile"}
                            </Link>

                            <Link
                                href="/protected"
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-sm transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Dashboard
                            </Link>
                        </div>

                        <div className="border-t p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                onClick={handleLogout}
                                disabled={isLoading}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                {isLoading ? "Logging out..." : "Logout"}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
