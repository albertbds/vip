/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Problem
    - Multiple duplicate policies causing conflicts
    - Admin policy causing infinite recursion by querying user_profiles within itself
    - Policies with Portuguese and English names creating confusion

  2. Solution
    - Drop all existing policies
    - Create clean, non-recursive policies
    - Use auth.jwt() to check user role instead of querying user_profiles table
    - Ensure each operation has only one clear policy

  3. New Policies
    - Users can read their own profile
    - Users can insert their own profile  
    - Users can update their own profile
    - Admins can read all profiles (using JWT claims)
*/

-- Drop all existing policies to start clean
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own data" ON user_profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON user_profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON user_profiles;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON user_profiles;

-- Create new, clean policies without recursion
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin policy that doesn't cause recursion
-- This checks the JWT token directly instead of querying user_profiles
CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR 
    (auth.jwt() ->> 'role')::text = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );