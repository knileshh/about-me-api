import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { ProfileData } from "@/types/profile";
import { Suspense } from "react";
import { ShareCTA } from "@/components/share-buttons";
import { PrivacySettings } from "@/components/privacy-settings";
import { QuickCopyButton, ProfileAvatar } from "@/components/quick-copy";
import { getApiUrl } from "@/lib/config";

// Disable prerendering - this page uses auth data (cookies)
export const dynamic = 'force-dynamic';

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-9 bg-muted rounded w-64 mb-2"></div>
        <div className="h-5 bg-muted rounded w-96"></div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="h-6 bg-muted rounded w-full mb-4"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-10 bg-muted rounded w-16 mx-auto mb-2"></div>
              <div className="h-4 bg-muted rounded w-20 mx-auto"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

async function DashboardContent() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }

  const userId = authData.claims.sub;

  // Fetch user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  // Fetch API logs for this user's profile
  let apiLogs: { id: string; caller_ip: string; user_agent: string; referer: string; created_at: string }[] = [];
  let totalCalls = 0;
  let uniqueIps = 0;

  if (profile) {
    const { data: logs } = await supabase
      .from("api_logs")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(10);

    apiLogs = logs || [];

    // Get total count
    const { count } = await supabase
      .from("api_logs")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", profile.id);

    totalCalls = count || 0;

    // Get unique IPs (approximate)
    const { data: ips } = await supabase
      .from("api_logs")
      .select("caller_ip")
      .eq("profile_id", profile.id);

    if (ips) {
      const uniqueIpSet = new Set(ips.map((log) => log.caller_ip));
      uniqueIps = uniqueIpSet.size;
    }
  }

  const profileData = profile?.profile_data as ProfileData | undefined;
  const fullName = profileData?.identity?.name
    ? [profileData.identity.name.first, profileData.identity.name.last].filter(Boolean).join(" ")
    : null;

  return (
    <div className="space-y-8">
      {/* Welcome with Quick Copy */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {profile && (
            <ProfileAvatar
              initials={fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase() : profile.username[0].toUpperCase()}
              isPublic={profile.is_public}
              size="lg"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">
              Welcome{fullName ? `, ${fullName}` : ""}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your profile and view your API analytics
            </p>
          </div>
        </div>
        {profile && (
          <QuickCopyButton
            username={profile.username}
            isPublic={profile.is_public}
            apiKey={profile.api_key}
          />
        )}
      </div>

      {profile ? (
        <>
          {/* API URL Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your API URL</CardTitle>
              <CardDescription>
                Share this URL with AI tools to give them context about you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <code className="flex-1 bg-muted px-4 py-3 rounded-md text-sm font-mono">
                  {getApiUrl(profile.username)}
                </code>
                <CopyButton text={getApiUrl(profile.username)} />
              </div>
              <div className="flex gap-2 mt-4">
                <Link href={`/u/${profile.username}`}>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </Link>
                <Link href="/builder">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <PrivacySettings
            profileId={profile.id}
            isPublic={profile.is_public}
            apiKey={profile.api_key}
          />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{totalCalls}</p>
                  <p className="text-sm text-muted-foreground mt-1">API Calls</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{uniqueIps}</p>
                  <p className="text-sm text-muted-foreground mt-1">Unique IPs</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Badge
                    className={
                      profile.is_public
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {profile.is_public ? "Public" : "Private"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Profile Status</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent API Calls */}
          <Card>
            <CardHeader>
              <CardTitle>Recent API Calls</CardTitle>
              <CardDescription>
                Last 10 requests to your profile API
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apiLogs.length > 0 ? (
                <div className="space-y-2">
                  {apiLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground w-24">
                          {new Date(log.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-sm font-mono">
                          {log.caller_ip?.substring(0, 15) || "unknown"}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {log.referer || log.user_agent?.substring(0, 30) || "Direct"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No API calls yet. Share your URL to get started!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Share CTA */}
          <ShareCTA />
        </>
      ) : (
        /* No Profile Yet */
        <Card>
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Create Your Profile</h2>
            <p className="text-muted-foreground mb-6">
              You haven't created a profile yet. Get started to get your personal API URL!
            </p>
            <Link href="/builder">
              <Button className="bg-green-600 hover:bg-green-700">
                Create Profile →
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

