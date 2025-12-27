"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Link2, Unlink } from "lucide-react";

interface LinkedAccountsProps {
    userEmail: string;
}

// Provider configuration
const PROVIDERS = [
    {
        id: "google",
        name: "Google",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
            </svg>
        ),
    },
    {
        id: "github",
        name: "GitHub",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
        ),
    },
];

export function LinkedAccounts({ userEmail }: LinkedAccountsProps) {
    const [linkedProviders, setLinkedProviders] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const supabase = createClient();

    // Fetch linked identities on mount
    useEffect(() => {
        const fetchIdentities = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.identities) {
                const providers = user.identities.map((identity) => identity.provider);
                setLinkedProviders(providers);
            }
        };
        fetchIdentities();
    }, [supabase.auth]);

    const handleLinkAccount = async (provider: "google" | "github") => {
        setIsLoading(provider);
        setError(null);
        setSuccess(null);

        try {
            const { error } = await supabase.auth.linkIdentity({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/protected`,
                },
            });

            if (error) throw error;
            // Redirect will happen automatically
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to link account");
            setIsLoading(null);
        }
    };

    const handleUnlinkAccount = async (provider: string) => {
        setIsLoading(provider);
        setError(null);
        setSuccess(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const identity = user?.identities?.find(i => i.provider === provider);

            if (!identity) {
                throw new Error("Identity not found");
            }

            // Check if this is the only identity
            if (user?.identities?.length === 1) {
                throw new Error("Cannot unlink your only sign-in method. Add another method first.");
            }

            const { error } = await supabase.auth.unlinkIdentity(identity);

            if (error) throw error;

            setLinkedProviders(prev => prev.filter(p => p !== provider));
            setSuccess(`${provider.charAt(0).toUpperCase() + provider.slice(1)} account unlinked successfully`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to unlink account");
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    Linked Accounts
                </CardTitle>
                <CardDescription>
                    Connect additional sign-in methods to your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Current email */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">@</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-xs text-muted-foreground">{userEmail}</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                        <Check className="h-3 w-3" />
                        Primary
                    </Badge>
                </div>

                {/* OAuth Providers */}
                {PROVIDERS.map((provider) => {
                    const isLinked = linkedProviders.includes(provider.id);
                    const isLoadingThis = isLoading === provider.id;

                    return (
                        <div
                            key={provider.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    {provider.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{provider.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {isLinked ? "Connected" : "Not connected"}
                                    </p>
                                </div>
                            </div>
                            {isLinked ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUnlinkAccount(provider.id)}
                                    disabled={isLoadingThis}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    {isLoadingThis ? (
                                        "Unlinking..."
                                    ) : (
                                        <>
                                            <Unlink className="h-4 w-4 mr-1" />
                                            Unlink
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleLinkAccount(provider.id as "google" | "github")}
                                    disabled={isLoadingThis}
                                >
                                    {isLoadingThis ? (
                                        "Connecting..."
                                    ) : (
                                        <>
                                            <Link2 className="h-4 w-4 mr-1" />
                                            Connect
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    );
                })}

                {/* Error/Success Messages */}
                {error && (
                    <p className="text-sm text-red-600 mt-2">{error}</p>
                )}
                {success && (
                    <p className="text-sm text-green-600 mt-2">{success}</p>
                )}
            </CardContent>
        </Card>
    );
}
