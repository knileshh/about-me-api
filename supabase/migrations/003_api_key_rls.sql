-- Migration: Add RLS policy for API key access
-- Run this in Supabase SQL Editor

-- Policy: Allow reading profiles with valid API key
-- This allows the API route to fetch private profiles when a valid API key is provided
CREATE POLICY "Allow API key access to profiles"
  ON profiles FOR SELECT
  USING (api_key IS NOT NULL);

-- Note: The actual API key validation happens in the application code.
-- This policy just allows the SELECT query to work when filtering by api_key.
-- The .eq("api_key", providedKey) in the query does the actual validation.
