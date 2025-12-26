"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CopyButton } from "./copy-button";

interface PrivacySettingsProps {
    profileId: string;
    isPublic: boolean;
    apiKey: string | null;
}

export function PrivacySettings({ profileId, isPublic: initialIsPublic, apiKey: initialApiKey }: PrivacySettingsProps) {
    const [isPublic, setIsPublic] = useState(initialIsPublic);
    const [apiKey, setApiKey] = useState(initialApiKey);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const toggleVisibility = async () => {
        setIsUpdating(true);
        const newValue = !isPublic;

        const { error } = await supabase
            .from("profiles")
            .update({ is_public: newValue })
            .eq("id", profileId);

        if (!error) {
            setIsPublic(newValue);
            router.refresh();
        }
        setIsUpdating(false);
    };

    const generateApiKey = async () => {
        setIsGenerating(true);

        // Generate a random API key
        const newKey = `aboutme_${btoa(crypto.getRandomValues(new Uint8Array(24)).toString()).replace(/[+/=]/g, '').substring(0, 32)}`;

        const { error } = await supabase
            .from("profiles")
            .update({ api_key: newKey })
            .eq("id", profileId);

        if (!error) {
            setApiKey(newKey);
            setShowApiKey(true);
            router.refresh();
        }
        setIsGenerating(false);
    };

    const revokeApiKey = async () => {
        setIsGenerating(true);

        const { error } = await supabase
            .from("profiles")
            .update({ api_key: null })
            .eq("id", profileId);

        if (!error) {
            setApiKey(null);
            setShowApiKey(false);
            router.refresh();
        }
        setIsGenerating(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Privacy Settings
                </CardTitle>
                <CardDescription>
                    Control who can access your profile
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Public/Private Toggle */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="public-toggle" className="text-base">
                            Public Profile
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            {isPublic
                                ? "Anyone can view your profile and API"
                                : "Only accessible with API key"}
                        </p>
                    </div>
                    <Switch
                        id="public-toggle"
                        checked={isPublic}
                        onCheckedChange={toggleVisibility}
                        disabled={isUpdating}
                    />
                </div>

                {/* Status Badge */}
                <div className={`p-3 rounded-lg ${isPublic ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900' : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900'}`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isPublic ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <span className={`text-sm font-medium ${isPublic ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                            {isPublic ? "Profile is publicly accessible" : "Profile is private - API key required"}
                        </span>
                    </div>
                </div>

                {/* API Key Section */}
                <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-base">API Key</Label>
                            <p className="text-sm text-muted-foreground">
                                Use this key to access your profile when it's private
                            </p>
                        </div>
                    </div>

                    {apiKey ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <code className="flex-1 p-2 bg-muted rounded text-xs font-mono overflow-hidden">
                                    {showApiKey ? apiKey : "•".repeat(40)}
                                </code>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                >
                                    {showApiKey ? "Hide" : "Show"}
                                </Button>
                                <CopyButton text={apiKey} />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={generateApiKey}
                                    disabled={isGenerating}
                                >
                                    Regenerate
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={revokeApiKey}
                                    disabled={isGenerating}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Revoke
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            onClick={generateApiKey}
                            disabled={isGenerating}
                            variant="outline"
                        >
                            {isGenerating ? "Generating..." : "Generate API Key"}
                        </Button>
                    )}

                    {/* Usage Example */}
                    {apiKey && !isPublic && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground mb-2">Usage example:</p>
                            <code className="text-xs">
                                curl -H "Authorization: Bearer {showApiKey ? apiKey : '<api_key>'}" \<br />
                                &nbsp;&nbsp;https://aboutme.knileshh.com/api/u/username
                            </code>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
