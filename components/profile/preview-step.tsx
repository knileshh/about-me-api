"use client";

import { ProfileData } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Check, X, AlertTriangle } from "lucide-react";

interface PreviewStepProps {
    data: ProfileData;
    username: string;
    onUsernameChange: (username: string) => void;
    isUsernameLocked?: boolean;
    showUsernameEditDialog?: boolean;
}

export function PreviewStep({ data, username, onUsernameChange, isUsernameLocked, showUsernameEditDialog }: PreviewStepProps) {
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(showUsernameEditDialog ? true : null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [tempUsername, setTempUsername] = useState(username);
    const [dialogCheckResult, setDialogCheckResult] = useState<boolean | null>(null);
    const [isDialogChecking, setIsDialogChecking] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const checkUsername = async (usernameToCheck?: string) => {
        const nameToCheck = usernameToCheck || username;
        if (!nameToCheck.trim()) return;

        setIsChecking(true);
        setError(null);

        try {
            const { data: existing } = await supabase
                .from("profiles")
                .select("username")
                .eq("username", nameToCheck.toLowerCase())
                .single();

            setIsAvailable(!existing);
            return !existing;
        } catch {
            setIsAvailable(true); // No match found = available
            return true;
        } finally {
            setIsChecking(false);
        }
    };

    const checkDialogUsername = async () => {
        if (!tempUsername.trim()) return;

        setIsDialogChecking(true);

        try {
            const { data: existing } = await supabase
                .from("profiles")
                .select("username")
                .eq("username", tempUsername.toLowerCase())
                .single();

            setDialogCheckResult(!existing);
        } catch {
            setDialogCheckResult(true);
        } finally {
            setIsDialogChecking(false);
        }
    };

    const handleDialogConfirm = () => {
        if (dialogCheckResult) {
            onUsernameChange(tempUsername);
            setIsAvailable(true);
            setIsEditDialogOpen(false);
        }
    };

    const handleDialogOpen = () => {
        setTempUsername(username);
        setDialogCheckResult(null);
        setIsEditDialogOpen(true);
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
                }, {
                    onConflict: 'user_id'
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
                <Label htmlFor="username">
                    {isUsernameLocked ? "Your username" : showUsernameEditDialog ? "Your username" : "Choose your username *"}
                </Label>
                {(isUsernameLocked || showUsernameEditDialog) ? (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md border border-muted">
                            <span className="text-muted-foreground text-sm">about-me-api.xyz/</span>
                            <span className="font-medium">{username}</span>
                            {showUsernameEditDialog && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="ml-auto h-7 px-2"
                                    onClick={handleDialogOpen}
                                >
                                    <Pencil className="h-3.5 w-3.5 mr-1" />
                                    Edit
                                </Button>
                            )}
                        </div>
                        {showUsernameEditDialog && isAvailable && (
                            <p className="text-sm text-green-600 flex items-center gap-1">
                                <Check className="h-4 w-4" /> Username confirmed & available
                            </p>
                        )}
                        {!showUsernameEditDialog && (
                            <p className="text-xs text-muted-foreground">
                                Username cannot be changed after profile creation.
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                    about-me-api.xyz/
                                </span>
                                <Input
                                    id="username"
                                    className="pl-[140px]"
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
                                onClick={() => checkUsername()}
                                disabled={isChecking || !username.trim()}
                            >
                                {isChecking ? "Checking..." : "Check"}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            ⚠️ Choose carefully — username cannot be changed later.
                        </p>
                        {isAvailable === true && (
                            <p className="text-sm text-green-600">✓ Username is available!</p>
                        )}
                        {isAvailable === false && (
                            <p className="text-sm text-red-600">✗ Username is taken</p>
                        )}
                    </>
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
                            curl https://about-me-api.xyz/api/
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
                onClick={() => setIsConfirmDialogOpen(true)}
                disabled={isSaving || !username.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
            >
                {isSaving ? "Saving..." : "Save Profile & Get Your URL"}
            </Button>

            {/* Save Confirmation Dialog */}
            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Confirm Profile Creation
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            You are about to create your profile with the username:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="p-4 bg-muted/50 rounded-lg border border-muted text-center">
                            <span className="text-muted-foreground">about-me-api.xyz/</span>
                            <span className="font-bold text-lg">{username}</span>
                        </div>
                        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
                            <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>
                                    <strong>Warning:</strong> Your username cannot be changed after profile creation.
                                    Please make sure this is the username you want.
                                </span>
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsConfirmDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                setIsConfirmDialogOpen(false);
                                handleSave();
                            }}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Confirm & Create Profile
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Username Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Username</DialogTitle>
                        <DialogDescription>
                            Choose a different username for your profile. This cannot be changed after creation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="newUsername">Username</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                        about-me-api.xyz/
                                    </span>
                                    <Input
                                        id="newUsername"
                                        className="pl-[140px]"
                                        placeholder="username"
                                        value={tempUsername}
                                        onChange={(e) => {
                                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
                                            setTempUsername(value);
                                            setDialogCheckResult(null);
                                        }}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={checkDialogUsername}
                                    disabled={isDialogChecking || !tempUsername.trim()}
                                >
                                    {isDialogChecking ? "Checking..." : "Check"}
                                </Button>
                            </div>
                            {dialogCheckResult === true && (
                                <p className="text-sm text-green-600 flex items-center gap-1">
                                    <Check className="h-4 w-4" /> Username is available!
                                </p>
                            )}
                            {dialogCheckResult === false && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <X className="h-4 w-4" /> Username is taken
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDialogConfirm}
                            disabled={!dialogCheckResult || tempUsername === username}
                        >
                            Confirm Username
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
