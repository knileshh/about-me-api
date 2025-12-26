"use client";

import { UserMenu } from "./user-menu";

interface UserMenuWrapperProps {
    email: string;
    hasProfile?: boolean;
    username?: string;
}

export function UserMenuWrapper({ email, hasProfile, username }: UserMenuWrapperProps) {
    return <UserMenu email={email} hasProfile={hasProfile} username={username} />;
}
