/*
  # Criar tabela de vendas com políticas de segurança

  1. Nova Tabela
    - `sales`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key para user_profiles)
      - `client_name` (text, nome do cliente)
      - `contract_number` (text, número do contrato)
      - `phone` (text, telefone do cliente)
      - `email` (text, email do cliente)
      - `address` (text, endereço completo)
      - `plan` (text, plano contratado)
      - `value` (numeric, valor do plano)
      - `status` (text, status da venda)
      - `installation_date` (date, data de instalação)
      - `notes` (text, observações)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Segurança
    - Habilitar RLS na tabela `sales`
    - Políticas para usuários verem apenas suas próprias vendas
    - Políticas para CRUD apenas das próprias vendas

  3. Performance
    - Índices para consultas otimizadas
    - Trigger para atualização automática de timestamps
*/

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Users can view own sales" ON sales;
DROP POLICY IF EXISTS "Users can insert own sales" ON sales;
DROP POLICY IF EXISTS "Users can update own sales" ON sales;
DROP POLICY IF EXISTS "Users can delete own sales" ON sales;

-- Remover trigger existente se existir
DROP TRIGGER IF EXISTS update_sales_updated_at ON sales;

-- Criar tabela de vendas se não existir
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  contract_number text NOT NULL,
  phone text NOT NULL,
  email text,
  address text NOT NULL,
  plan text NOT NULL,
  value numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'ag-instalacao' CHECK (status IN ('ag-instalacao', 'instalada', 'reprovada')),
  installation_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para vendas
CREATE POLICY "Users can view own sales"
  ON sales
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sales"
  ON sales
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sales"
  ON sales
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own sales"
  ON sales
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Trigger para atualizar updated_at (usando função existente)
CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON sales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_contract_number ON sales(contract_number);

-- Comentários
COMMENT ON TABLE sales IS 'Vendas realizadas por cada usuário';
COMMENT ON COLUMN sales.user_id IS 'ID do usuário que realizou a venda';
COMMENT ON COLUMN sales.client_name IS 'Nome completo do cliente';
COMMENT ON COLUMN sales.contract_number IS 'Número do contrato (editável pelo usuário)';
COMMENT ON COLUMN sales.phone IS 'Telefone do cliente';
COMMENT ON COLUMN sales.email IS 'Email do cliente';
COMMENT ON COLUMN sales.address IS 'Endereço completo do cliente';
COMMENT ON COLUMN sales.plan IS 'Plano contratado';
COMMENT ON COLUMN sales.value IS 'Valor do plano';
COMMENT ON COLUMN sales.status IS 'Status da venda (ag-instalacao, instalada, reprovada)';
COMMENT ON COLUMN sales.installation_date IS 'Data prevista/realizada da instalação';
COMMENT ON COLUMN sales.notes IS 'Observações sobre a venda';