-- Migration: Fix profile upsert and RLS policies
-- Run this in the Supabase SQL Editor

-- Add unique constraint on user_id to allow upsert
-- First, check if any duplicates exist (there shouldn't be)
-- Then add the constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_user_id_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Drop existing policies and recreate with proper precedence
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create a single SELECT policy that covers both cases
CREATE POLICY "Users can view public profiles or their own"
  ON profiles FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);
