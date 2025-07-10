/*
  # Fix user profiles migration with proper conditional checks

  1. Tables
    - Create user_profiles table if not exists
    - Add proper constraints and indexes

  2. Security
    - Enable RLS on user_profiles table
    - Create policies with proper conditional checks
    - Add service role access

  3. Functions and Triggers
    - Create update timestamp function
    - Create auto profile creation function
    - Set up triggers with proper checks

  4. Initial Data
    - Insert admin user if none exists
*/

-- Criar tabela de perfis de usuário
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

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Função para criar políticas condicionalmente
DO $$
BEGIN
  -- Política para usuários lerem próprio perfil
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile"
      ON user_profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  -- Política para usuários atualizarem próprio perfil
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON user_profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Política para usuários criarem próprio perfil
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can create own profile'
  ) THEN
    CREATE POLICY "Users can create own profile"
      ON user_profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Política para usuários deletarem próprio perfil
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can delete own profile'
  ) THEN
    CREATE POLICY "Users can delete own profile"
      ON user_profiles
      FOR DELETE
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  -- Política para permitir criação de perfil durante signup
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Allow profile creation during signup'
  ) THEN
    CREATE POLICY "Allow profile creation during signup"
      ON user_profiles
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;

  -- Política para service role ter acesso total
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Allow service role full access'
  ) THEN
    CREATE POLICY "Allow service role full access"
      ON user_profiles
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Remover trigger existente se existir e criar novo
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente
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
    -- Se falhar, apenas retornar NEW para não bloquear o registro
    RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Remover trigger existente se existir e criar novo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Inserir usuário admin padrão (opcional)
DO $$
BEGIN
  -- Verificar se já existe um admin
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE role = 'admin'
  ) THEN
    -- Inserir dados de exemplo (você pode remover isso em produção)
    INSERT INTO user_profiles (
      id,
      email,
      full_name,
      role,
      created_at
    ) VALUES (
      gen_random_uuid(),
      'admin@gigafibra.com',
      'Administrador',
      'admin',
      now()
    ) ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);