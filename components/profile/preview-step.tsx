"use client";

import { ProfileData } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface PreviewStepProps {
    data: ProfileData;
    username: string;
    onUsernameChange: (username: string) => void;
}

export function PreviewStep({ data, username, onUsernameChange }: PreviewStepProps) {
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const checkUsername = async () => {
        if (!username.trim()) return;

        setIsChecking(true);
        setError(null);

        try {
            const { data: existing } = await supabase
                .from("profiles")
                .select("username")
                .eq("username", username.toLowerCase())
                .single();

            setIsAvailable(!existing);
        } catch {
            setIsAvailable(true); // No match found = available
        } finally {
            setIsChecking(false);
        }
    };

    const handleSave = async () => {
        if (!username.trim()) {
            setError("Please choose a username");
            return;
        }

        if (!data.identity?.name?.first) {
            setError("Please add at least your first name");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            // Check if user is logged in
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Save draft and redirect to signup
                localStorage.setItem("aboutme_pending_username", username);
                router.push("/auth/sign-up?redirect=/builder/save");
                return;
            }

            // User is logged in, save profile directly
            const { error: saveError } = await supabase
                .from("profiles")
                .upsert({
                    user_id: user.id,
                    username: username.toLowerCase(),
                    profile_data: data,
                    is_public: true,
                });

            if (saveError) throw saveError;

            // Clear draft
            localStorage.removeItem("aboutme_draft_profile");
            localStorage.removeItem("aboutme_pending_username");

            // Redirect to dashboard
            router.push("/protected");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save profile");
        } finally {
            setIsSaving(false);
        }
    };

    const fullName = [
        data.identity?.name?.first,
        data.identity?.name?.middle,
        data.identity?.name?.last,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
                <Label htmlFor="username">Choose your username *</Label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            aboutme.knileshh.com/u/
                        </span>
                        <Input
                            id="username"
                            className="pl-[180px]"
                            placeholder="nilesh"
                            value={username}
                            onChange={(e) => {
                                const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
                                onUsernameChange(value);
                                setIsAvailable(null);
                            }}
                        />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={checkUsername}
                        disabled={isChecking || !username.trim()}
                    >
                        {isChecking ? "Checking..." : "Check"}
                    </Button>
                </div>
                {isAvailable === true && (
                    <p className="text-sm text-green-600">✓ Username is available!</p>
                )}
                {isAvailable === false && (
                    <p className="text-sm text-red-600">✗ Username is taken</p>
                )}
            </div>

            {/* Preview */}
            <div className="space-y-4">
                <Label>Preview</Label>
                <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold">{fullName || "Your Name"}</h3>
                                {data.identity?.bio && (
                                    <p className="text-muted-foreground mt-1">{data.identity.bio}</p>
                                )}
                            </div>

                            {data.location?.current_city && (
                                <p className="text-sm text-muted-foreground">
                                    📍 {data.location.current_city}
                                </p>
                            )}

                            {(data.career?.primary_roles?.length || 0) > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {data.career?.primary_roles?.map((role) => (
                                        <span
                                            key={role}
                                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {data.presence?.socials && (
                                <div className="flex gap-4 text-sm">
                                    {data.presence.socials.github && (
                                        <span className="text-muted-foreground">GitHub</span>
                                    )}
                                    {data.presence.socials.linkedin && (
                                        <span className="text-muted-foreground">LinkedIn</span>
                                    )}
                                    {data.presence.socials.twitter && (
                                        <span className="text-muted-foreground">Twitter</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* API Example */}
            <div className="space-y-2">
                <Label>Your API URL</Label>
                <Card className="bg-zinc-950 text-zinc-100">
                    <CardContent className="pt-4 font-mono text-sm">
                        <p className="text-zinc-500"># Fetch your profile</p>
                        <p>
                            curl https://aboutme.knileshh.com/u/
                            <span className="text-green-400">{username || "username"}</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Error */}
            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {error}
                </div>
            )}

            {/* Save Button */}
            <Button
                onClick={handleSave}
                disabled={isSaving || !username.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
            >
                {isSaving ? "Saving..." : "Save Profile & Get Your URL"}
            </Button>
        </div>
    );
}
