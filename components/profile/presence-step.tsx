"use client";

import { ProfileData } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PresenceStepProps {
    data: ProfileData;
    onUpdate: (updates: Partial<ProfileData>) => void;
}

export function PresenceStep({ data, onUpdate }: PresenceStepProps) {
    const presence = data.presence || {};
    const socials = presence.socials || {};
    const competitive = presence.competitive_programming || {};

    const updateSocials = (field: string, value: string) => {
        onUpdate({
            presence: {
                ...presence,
                socials: { ...socials, [field]: value || null },
            },
        });
    };

    const updateCompetitive = (field: string, value: string) => {
        onUpdate({
            presence: {
                ...presence,
                competitive_programming: { ...competitive, [field]: value || null },
            },
        });
    };

    return (
        <div className="space-y-8">
            {/* Social Links */}
            <div>
                <h3 className="text-sm font-medium mb-4">Social Profiles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                            id="github"
                            placeholder="https://github.com/username"
                            value={socials.github || ""}
                            onChange={(e) => updateSocials("github", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                            id="linkedin"
                            placeholder="https://linkedin.com/in/username"
                            value={socials.linkedin || ""}
                            onChange={(e) => updateSocials("linkedin", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter / X</Label>
                        <Input
                            id="twitter"
                            placeholder="https://twitter.com/username"
                            value={socials.twitter || ""}
                            onChange={(e) => updateSocials("twitter", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                            id="instagram"
                            placeholder="https://instagram.com/username"
                            value={socials.instagram || ""}
                            onChange={(e) => updateSocials("instagram", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="youtube">YouTube</Label>
                        <Input
                            id="youtube"
                            placeholder="https://youtube.com/@username"
                            value={socials.youtube || ""}
                            onChange={(e) => updateSocials("youtube", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Competitive Programming */}
            <div>
                <h3 className="text-sm font-medium mb-4">Competitive Programming</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="leetcode">LeetCode</Label>
                        <Input
                            id="leetcode"
                            placeholder="https://leetcode.com/username"
                            value={competitive.leetcode || ""}
                            onChange={(e) => updateCompetitive("leetcode", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="codeforces">Codeforces</Label>
                        <Input
                            id="codeforces"
                            placeholder="https://codeforces.com/profile/username"
                            value={competitive.codeforces || ""}
                            onChange={(e) => updateCompetitive("codeforces", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="codechef">CodeChef</Label>
                        <Input
                            id="codechef"
                            placeholder="https://codechef.com/users/username"
                            value={competitive.codechef || ""}
                            onChange={(e) => updateCompetitive("codechef", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Contact Email (Public) */}
            <div>
                <h3 className="text-sm font-medium mb-4">Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Public Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="hello@example.com"
                            value={data.contact?.emails?.work || ""}
                            onChange={(e) =>
                                onUpdate({
                                    contact: {
                                        visibility: "public",
                                        ...data.contact,
                                        emails: { ...data.contact?.emails, work: e.target.value },
                                    },
                                })
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            This will be visible in your public profile.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
