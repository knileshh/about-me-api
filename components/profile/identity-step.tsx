"use client";

import { ProfileData } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IdentityStepProps {
    data: ProfileData;
    onUpdate: (updates: Partial<ProfileData>) => void;
}

export function IdentityStep({ data, onUpdate }: IdentityStepProps) {
    const identity = data.identity || { name: { first: "", last: "" } };

    const updateIdentity = (updates: Partial<typeof identity>) => {
        onUpdate({
            identity: { ...identity, ...updates },
        });
    };

    const updateName = (field: "first" | "middle" | "last", value: string) => {
        updateIdentity({
            name: { ...identity.name, [field]: value },
        });
    };

    return (
        <div className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                        id="firstName"
                        placeholder="Nilesh"
                        value={identity.name?.first || ""}
                        onChange={(e) => updateName("first", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                        id="middleName"
                        placeholder="Optional"
                        value={identity.name?.middle || ""}
                        onChange={(e) => updateName("middle", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                        id="lastName"
                        placeholder="Patel"
                        value={identity.name?.last || ""}
                        onChange={(e) => updateName("last", e.target.value)}
                    />
                </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                    id="bio"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Backend developer passionate about distributed systems..."
                    value={identity.bio || ""}
                    onChange={(e) => updateIdentity({ bio: e.target.value })}
                    rows={3}
                />
                <p className="text-xs text-muted-foreground">
                    A short description about yourself that AI tools can use for introductions.
                </p>
            </div>

            {/* Pronouns */}
            <div className="space-y-2">
                <Label htmlFor="pronouns">Pronouns</Label>
                <Input
                    id="pronouns"
                    placeholder="he/him, she/her, they/them"
                    value={identity.pronouns || ""}
                    onChange={(e) => updateIdentity({ pronouns: e.target.value })}
                />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="currentCity">Current City</Label>
                    <Input
                        id="currentCity"
                        placeholder="Bengaluru, India"
                        value={data.location?.current_city || ""}
                        onChange={(e) =>
                            onUpdate({
                                location: { ...data.location, current_city: e.target.value },
                            })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                        id="timezone"
                        placeholder="Asia/Kolkata"
                        value={data.location?.timezone || ""}
                        onChange={(e) =>
                            onUpdate({
                                location: { ...data.location, timezone: e.target.value },
                            })
                        }
                    />
                </div>
            </div>
        </div>
    );
}
