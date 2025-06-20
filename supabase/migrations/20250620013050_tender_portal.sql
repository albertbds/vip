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
    - Trigger para criar perfil automaticamente quando usuário se registra
    - Função para atualizar timestamp de updated_at
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

-- Trigger para atualizar updated_at
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
END;
$$ language 'plpgsql' security definer;

-- Trigger para criar perfil quando usuário se registra
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Inserir usuário admin padrão (opcional)
-- Nota: Este usuário será criado apenas se não existir
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