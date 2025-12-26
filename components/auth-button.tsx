import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { UserMenuWrapper } from "./user-menu-wrapper";

export async function AuthButton() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // If logged in, check if user has a profile
  let hasProfile = false;
  let username: string | undefined;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", user.sub)
      .single();

    if (profile) {
      hasProfile = true;
      username = profile.username;
    }
  }

  return user ? (
    <UserMenuWrapper
      email={user.email || ""}
      hasProfile={hasProfile}
      username={username}
    />
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
