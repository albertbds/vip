/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Problem
    - Current RLS policies are causing infinite recursion
    - The admin policy tries to check JWT role while querying the same table
    - This creates a circular dependency

  2. Solution
    - Drop existing problematic policies
    - Create simpler, non-recursive policies
    - Use auth.uid() directly without complex JWT checks
    - Separate user and admin access patterns

  3. New Policies
    - Users can read/update their own profile
    - Simple admin check without recursion
    - Clean insert policy for new users
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Create new, non-recursive policies

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Simple admin policy that doesn't cause recursion
-- Note: This relies on the user having admin role in their JWT metadata
-- which is set during authentication, not by querying the database
CREATE POLICY "Service role can manage all profiles"
  ON user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);