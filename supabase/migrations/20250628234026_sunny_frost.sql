/*
  # Fix user profiles migration

  1. Tables
    - Ensure user_profiles table exists with proper structure
    - Add proper constraints and indexes

  2. Security
    - Enable RLS on user_profiles table
    - Add policies for authenticated users to manage their own data

  3. Functions and Triggers
    - Create update_updated_at_column function (only if it doesn't exist)
    - Add trigger for automatic updated_at timestamp
    - Add function to handle new user creation
    - Add utility functions for admin management

  4. Performance
    - Add indexes for commonly queried columns
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON user_profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON user_profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON user_profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own data" ON user_profiles;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing functions if they exist (but only the ones we're recreating)
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS create_admin_user();
DROP FUNCTION IF EXISTS promote_user_to_admin(text);

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own data"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create update_updated_at_column function only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'update_updated_at_column' 
    AND pg_function_is_visible(oid)
  ) THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $func$ language 'plpgsql';
  END IF;
END $$;

-- Trigger to update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger to create profile when user registers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to create admin user via SQL
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
BEGIN
  RAISE NOTICE 'To create an admin user, use the Supabase Auth panel or register through the app and then update the role to admin';
END;
$$ language 'plpgsql';

-- Function to promote existing user to admin
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email text)
RETURNS boolean AS $$
DECLARE
  user_found boolean := false;
BEGIN
  UPDATE user_profiles 
  SET role = 'admin', updated_at = now()
  WHERE email = user_email;
  
  GET DIAGNOSTICS user_found = FOUND;
  
  IF user_found THEN
    RAISE NOTICE 'User % promoted to admin successfully', user_email;
    RETURN true;
  ELSE
    RAISE NOTICE 'User % not found', user_email;
    RETURN false;
  END IF;
END;
$$ language 'plpgsql' security definer;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);

-- Comments on tables and columns
COMMENT ON TABLE user_profiles IS 'Perfis de usuário com informações adicionais';
COMMENT ON COLUMN user_profiles.id IS 'ID do usuário (referência para auth.users)';
COMMENT ON COLUMN user_profiles.email IS 'Email único do usuário';
COMMENT ON COLUMN user_profiles.full_name IS 'Nome completo do usuário';
COMMENT ON COLUMN user_profiles.avatar_url IS 'URL do avatar do usuário';
COMMENT ON COLUMN user_profiles.role IS 'Função do usuário (user, admin, moderator)';
COMMENT ON COLUMN user_profiles.is_active IS 'Status ativo/inativo do usuário';