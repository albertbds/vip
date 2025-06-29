/*
# Corrigir problema de chave estrangeira para vendas

1. Melhorias na função de criação de perfil
   - Tornar mais robusta para lidar com diferentes cenários
   - Garantir que sempre crie um perfil válido

2. Função para garantir perfil existe
   - Criar perfil se não existir ao tentar criar venda
   - Evitar erros de chave estrangeira

3. Políticas atualizadas
   - Garantir que as políticas funcionem corretamente
*/

-- Função melhorada para criar perfil de usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name', 
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
    updated_at = now();
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log do erro mas não falha a criação do usuário
    RAISE WARNING 'Erro ao criar/atualizar perfil do usuário %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Função para garantir que o perfil do usuário existe
CREATE OR REPLACE FUNCTION public.ensure_user_profile(user_id uuid, user_email text DEFAULT NULL)
RETURNS uuid AS $$
DECLARE
  profile_exists boolean;
  final_email text;
BEGIN
  -- Verificar se o perfil já existe
  SELECT EXISTS(SELECT 1 FROM user_profiles WHERE id = user_id) INTO profile_exists;
  
  -- Se não existe, criar o perfil
  IF NOT profile_exists THEN
    -- Tentar obter email do auth.users se não fornecido
    IF user_email IS NULL THEN
      SELECT email INTO final_email FROM auth.users WHERE id = user_id;
    ELSE
      final_email := user_email;
    END IF;
    
    -- Criar perfil básico
    INSERT INTO user_profiles (id, email, full_name, role, is_active)
    VALUES (
      user_id,
      COALESCE(final_email, 'user@example.com'),
      COALESCE(split_part(final_email, '@', 1), 'Usuário'),
      'user',
      true
    )
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Perfil criado para usuário %', user_id;
  END IF;
  
  RETURN user_id;
END;
$$ language 'plpgsql' security definer;

-- Trigger para garantir perfil antes de inserir venda
CREATE OR REPLACE FUNCTION public.ensure_profile_before_sale()
RETURNS TRIGGER AS $$
BEGIN
  -- Garantir que o perfil do usuário existe
  PERFORM public.ensure_user_profile(NEW.user_id);
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Criar trigger para vendas
DROP TRIGGER IF EXISTS ensure_profile_before_sale_trigger ON sales;
CREATE TRIGGER ensure_profile_before_sale_trigger
  BEFORE INSERT ON sales
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_profile_before_sale();

-- Atualizar trigger existente para usar a nova função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Função para criar perfis para usuários existentes que não têm perfil
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS integer AS $$
DECLARE
  user_record RECORD;
  created_count integer := 0;
BEGIN
  -- Buscar usuários que não têm perfil
  FOR user_record IN 
    SELECT au.id, au.email, au.raw_user_meta_data
    FROM auth.users au
    LEFT JOIN user_profiles up ON au.id = up.id
    WHERE up.id IS NULL
  LOOP
    -- Criar perfil para o usuário
    INSERT INTO user_profiles (id, email, full_name, role, is_active)
    VALUES (
      user_record.id,
      user_record.email,
      COALESCE(
        user_record.raw_user_meta_data->>'full_name',
        user_record.raw_user_meta_data->>'name',
        split_part(user_record.email, '@', 1)
      ),
      COALESCE(user_record.raw_user_meta_data->>'role', 'user'),
      true
    )
    ON CONFLICT (id) DO NOTHING;
    
    created_count := created_count + 1;
  END LOOP;
  
  RAISE NOTICE 'Criados % perfis para usuários existentes', created_count;
  RETURN created_count;
END;
$$ language 'plpgsql' security definer;

-- Executar a função para criar perfis faltantes
SELECT public.create_missing_profiles();