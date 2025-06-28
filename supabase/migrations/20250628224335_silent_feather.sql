/*
  # User Profiles Migration

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text, optional)
      - `avatar_url` (text, optional)
      - `role` (text, default 'user')
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to manage their own profiles
    - Add policy for admins to view all profiles

  3. Functions & Triggers
    - Auto-update timestamp function
    - Auto-create profile on user registration
    - Admin promotion function
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

-- Políticas de segurança
CREATE POLICY "Usuários podem ver seus próprios perfis"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seus próprios perfis"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Política para permitir que admins vejam todos os perfis
CREATE POLICY "Admins podem ver todos os perfis"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
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
    -- Log do erro mas não falha a criação do usuário
    RAISE WARNING 'Erro ao criar perfil do usuário: %', SQLERRM;
    RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger para criar perfil quando usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Função para criar usuário admin via SQL (sem usar auth.users diretamente)
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
BEGIN
  -- Esta função será chamada após a criação manual do usuário admin
  -- através do painel do Supabase ou da aplicação
  RAISE NOTICE 'Para criar um usuário admin, use o painel do Supabase Auth ou registre-se pela aplicação e depois atualize o role para admin';
END;
$$ language 'plpgsql';

-- Função para promover usuário existente a admin (corrigida)
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email text)
RETURNS boolean AS $$
DECLARE
  rows_affected integer;
BEGIN
  UPDATE user_profiles 
  SET role = 'admin', updated_at = now()
  WHERE email = user_email;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  
  IF rows_affected > 0 THEN
    RAISE NOTICE 'Usuário % promovido a admin com sucesso', user_email;
    RETURN true;
  ELSE
    RAISE NOTICE 'Usuário % não encontrado', user_email;
    RETURN false;
  END IF;
END;
$$ language 'plpgsql' security definer;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);

-- Comentários nas tabelas e colunas
COMMENT ON TABLE user_profiles IS 'Perfis de usuário com informações adicionais';
COMMENT ON COLUMN user_profiles.id IS 'ID do usuário (referência para auth.users)';
COMMENT ON COLUMN user_profiles.email IS 'Email único do usuário';
COMMENT ON COLUMN user_profiles.full_name IS 'Nome completo do usuário';
COMMENT ON COLUMN user_profiles.avatar_url IS 'URL do avatar do usuário';
COMMENT ON COLUMN user_profiles.role IS 'Função do usuário (user, admin, moderator)';
COMMENT ON COLUMN user_profiles.is_active IS 'Status ativo/inativo do usuário';