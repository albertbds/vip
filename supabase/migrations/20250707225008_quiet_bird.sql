/*
  # Sistema de Vendas Atualizado

  1. Atualizar Tabela
    - `sales`
      - Remover campos `email` e `address`
      - Manter campos essenciais para vendas

  2. Segurança
    - Manter RLS e políticas existentes
    - Atualizar comentários

  3. Índices
    - Manter índices existentes para performance
*/

-- Atualizar tabela de vendas removendo campos desnecessários
DO $$
BEGIN
  -- Verificar se as colunas existem antes de tentar removê-las
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sales' AND column_name = 'email'
  ) THEN
    ALTER TABLE sales DROP COLUMN email;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sales' AND column_name = 'address'
  ) THEN
    ALTER TABLE sales DROP COLUMN address;
  END IF;
END $$;

-- Atualizar comentários
COMMENT ON TABLE sales IS 'Vendas realizadas por cada usuário (versão simplificada)';
COMMENT ON COLUMN sales.client_name IS 'Nome completo do cliente';
COMMENT ON COLUMN sales.phone IS 'Telefone do cliente';
COMMENT ON COLUMN sales.plan IS 'Plano contratado';
COMMENT ON COLUMN sales.value IS 'Valor do plano';
COMMENT ON COLUMN sales.status IS 'Status da venda (ag-instalacao, instalada, reprovada)';
COMMENT ON COLUMN sales.installation_date IS 'Data prevista/realizada da instalação';
COMMENT ON COLUMN sales.notes IS 'Observações sobre a venda';