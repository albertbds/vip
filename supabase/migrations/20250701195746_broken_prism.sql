/*
  # Sistema de Autenticação

  1. Novas Tabelas
    - `user_profiles`
      - `id` (uuid, chave primária, referência ao auth.users)
      - `email` (text, único)
      - `full_name` (text)
      - `avatar_url` (text, opcional)
      - `role` (text, padrão 'user')
      - `is_active` (boolean, padrão true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `user_profiles`
    - Adicionar políticas para usuários autenticados lerem seus próprios dados
    - Adicionar políticas para criação e atualização de perfis

  3. Funções
    - Função para atualizar timestamp de updated_at
    - Função para promover usuários a admin
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

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at (com verificação se já existe)
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para promover usuário existente a admin
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