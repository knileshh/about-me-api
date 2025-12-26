-- Migration: Add API Key for Private Profile Access
-- Run this in Supabase SQL Editor

-- Add api_key column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS api_key TEXT UNIQUE;

-- Create index for fast API key lookups
CREATE INDEX IF NOT EXISTS idx_profiles_api_key ON profiles(api_key);

-- Function to generate a random API key
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT AS $$
BEGIN
  RETURN 'aboutme_' || encode(gen_random_bytes(24), 'base64');
END;
$$ LANGUAGE plpgsql;
