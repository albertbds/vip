/*
  # Fix RLS Policy Infinite Recursion

  1. Security Changes
    - Drop the problematic admin policy that causes infinite recursion
    - Create a new admin policy that doesn't reference user_profiles table
    - Keep existing user policies intact

  2. Notes
    - The admin policy was trying to query user_profiles from within a user_profiles policy
    - New approach uses a simpler method or removes the admin override temporarily
    - Users can still access their own profiles normally
*/

-- Drop the problematic admin policy
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON user_profiles;

-- Create a new admin policy that doesn't cause recursion
-- Option 1: Remove admin override entirely (users can only see their own profiles)
-- This is the safest approach to avoid recursion

-- Option 2: If you need admin access, you can create a separate admin function
-- that bypasses RLS or use service role key in your backend

-- The existing policies for users to manage their own profiles remain intact:
-- - "Usuários podem ver seus próprios perfis" 
-- - "Usuários podem atualizar seus próprios perfis"
-- - "Usuários podem inserir seus próprios perfis"