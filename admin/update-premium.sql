-- =====================================================
-- ATUALIZAÇÃO PREMIUM: NOVAS COLUNAS E TABELAS
-- Copie todo este código e rode no SQL Editor do Supabase
-- =====================================================

-- 1. Adicionando novas colunas na tabela de orçamentos
ALTER TABLE orcamentos ADD COLUMN IF NOT EXISTS data_agendamento timestamptz;
ALTER TABLE orcamentos ADD COLUMN IF NOT EXISTS custo_materiais numeric(10,2) DEFAULT 0;
ALTER TABLE orcamentos ADD COLUMN IF NOT EXISTS custo_deslocamento numeric(10,2) DEFAULT 0;
ALTER TABLE orcamentos ADD COLUMN IF NOT EXISTS lucro_liquido numeric(10,2) DEFAULT 0;
ALTER TABLE orcamentos ADD COLUMN IF NOT EXISTS prazo_garantia_dias integer DEFAULT 90;

-- 2. Nova tabela para as fotos (Antes e Depois)
CREATE TABLE IF NOT EXISTS orcamento_fotos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  orcamento_id uuid REFERENCES orcamentos(id) ON DELETE CASCADE,
  tipo text CHECK (tipo IN ('antes', 'depois')),
  url_foto text NOT NULL,
  criado_em timestamptz DEFAULT now()
);

-- 3. Habilitando Segurança (RLS) para a nova tabela
ALTER TABLE orcamento_fotos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users only" ON orcamento_fotos FOR ALL USING (auth.role() = 'authenticated');

-- 4. Nova tabela para Checklists do serviço
CREATE TABLE IF NOT EXISTS orcamento_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  orcamento_id uuid REFERENCES orcamentos(id) ON DELETE CASCADE,
  item_texto text NOT NULL,
  concluido boolean DEFAULT false,
  criado_em timestamptz DEFAULT now()
);

-- 5. Segurança (RLS) para checklist
ALTER TABLE orcamento_checklists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users only" ON orcamento_checklists FOR ALL USING (auth.role() = 'authenticated');
