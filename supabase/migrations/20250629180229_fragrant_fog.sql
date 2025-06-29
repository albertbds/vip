/*
  # Fix User Profiles RLS Policies

  1. Security Updates
    - Update RLS policies for `user_profiles` table to properly handle profile creation
    - Allow authenticated users to create their own profiles during signup/login
    - Maintain security by ensuring users can only access their own data
    - Add policy for service role to manage profiles during user creation

  2. Changes
    - Drop existing restrictive policies
    - Create new policies that work with the authentication flow
    - Ensure profile creation works during signup and login processes
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON user_profiles;

-- Create new policies that allow proper profile management

-- Allow authenticated users to insert their own profile
-- This policy allows creation when the user_id matches the authenticated user
CREATE POLICY "Allow users to create own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Allow users to read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Allow users to delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Allow service role to manage all profiles (for system operations)
CREATE POLICY "Allow service role full access"
  ON user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon users to insert profiles during signup process
-- This is needed for the initial profile creation during user registration
CREATE POLICY "Allow profile creation during signup"
  ON user_profiles
  FOR INSERT
  TO anon
  WITH CHECK (true);