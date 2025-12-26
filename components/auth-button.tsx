import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { UserMenuWrapper } from "./user-menu-wrapper";
import { HeaderCopyButton } from "./header-copy-button";

export async function AuthButton() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // If logged in, check if user has a profile and get full data
  let hasProfile = false;
  let username: string | undefined;
  let isPublic = true;
  let apiKey: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, is_public, api_key")
      .eq("user_id", user.sub)
      .single();

    if (profile) {
      hasProfile = true;
      username = profile.username;
      isPublic = profile.is_public;
      apiKey = profile.api_key;
    }
  }

  return user ? (
    <div className="flex items-center gap-2">
      {hasProfile && username && (
        <HeaderCopyButton
          username={username}
          isPublic={isPublic}
          apiKey={apiKey}
        />
      )}
      <UserMenuWrapper
        email={user.email || ""}
        hasProfile={hasProfile}
        username={username}
      />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
