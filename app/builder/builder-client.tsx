"use client";

import { ProfileWizard } from "@/components/profile/profile-wizard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BuilderContent({ existingUsername, existingProfileData }: {
    existingUsername: string | null;
    existingProfileData: null;
}) {
    const searchParams = useSearchParams();
    const usernameFromUrl = searchParams.get("username");

    // Use username from URL if provided, otherwise fall back to existing
    const initialUsername = usernameFromUrl || existingUsername;

    return (
        <ProfileWizard
            existingUsername={initialUsername}
            existingProfileData={existingProfileData}
            usernameFromUrl={!!usernameFromUrl}
        />
    );
}

interface BuilderClientProps {
    existingUsername: string | null;
    existingProfileData: null;
}

export function BuilderClient({ existingUsername, existingProfileData }: BuilderClientProps) {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="animate-pulse text-muted-foreground">Loading...</div></div>}>
            <BuilderContent
                existingUsername={existingUsername}
                existingProfileData={existingProfileData}
            />
        </Suspense>
    );
}
