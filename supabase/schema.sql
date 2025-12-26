-- About Me API Database Schema
-- Run this in the Supabase SQL Editor

-- ===========================================
-- PROFILES TABLE
-- Main profile data stored as JSONB for flexibility
-- ===========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  profile_data JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- RLS: Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (is_public = true);

-- Policy: Users can manage their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users can view their own profile (even if private)
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- ===========================================
-- API_LOGS TABLE
-- Track API usage for analytics
-- ===========================================
CREATE TABLE IF NOT EXISTS api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  caller_ip TEXT,
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_api_logs_profile_id ON api_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_username ON api_logs(username);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at);

-- RLS: Enable Row Level Security
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own logs
CREATE POLICY "Users can view their own API logs"
  ON api_logs FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Policy: Allow insert for service role (Edge Functions)
-- Note: Edge Functions use service_role key which bypasses RLS
-- This policy allows the anon role to insert when needed
CREATE POLICY "Allow public insert for API logging"
  ON api_logs FOR INSERT
  WITH CHECK (true);

-- ===========================================
-- DRAFT_PROFILES TABLE
-- Temporary storage for profiles before signup (progressive flow)
-- ===========================================
CREATE TABLE IF NOT EXISTS draft_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  profile_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '24 hours')
);

-- Index for session lookups and cleanup
CREATE INDEX IF NOT EXISTS idx_draft_profiles_session ON draft_profiles(session_id);
CREATE INDEX IF NOT EXISTS idx_draft_profiles_expires ON draft_profiles(expires_at);

-- RLS: Enable Row Level Security (but allow public access for drafts)
ALTER TABLE draft_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can manage drafts (they're temporary and session-based)
CREATE POLICY "Anyone can insert drafts"
  ON draft_profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read drafts by session"
  ON draft_profiles FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update drafts by session"
  ON draft_profiles FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete drafts"
  ON draft_profiles FOR DELETE
  USING (true);

-- ===========================================
-- HELPER FUNCTION: Auto-update updated_at
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- CLEANUP FUNCTION: Remove expired drafts
-- This can be scheduled with pg_cron or called periodically
-- ===========================================
CREATE OR REPLACE FUNCTION cleanup_expired_drafts()
RETURNS void AS $$
BEGIN
  DELETE FROM draft_profiles WHERE expires_at < now();
END;
$$ language 'plpgsql';
