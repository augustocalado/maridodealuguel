// =====================================================
// CONFIGURAÇÃO DO SUPABASE — MARIDO DE ALUGUEL
// =====================================================
// 1. Acesse https://supabase.com e faça login
// 2. Vá em Settings → API
// 3. Copie a URL e a Anon Key e cole abaixo
// =====================================================

const SUPABASE_URL = 'https://iyfxnihemjawriguyamc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5ZnhuaWhlbWphd3JpZ3V5YW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTczNTcsImV4cCI6MjEwNTA3MzM1N30.g95J_ztiz5WQvUXU_6Ehv9lXqkuWCnUTGklSyeI08HU';

// =====================================================
// SQL PARA EXECUTAR NO SUPABASE (SQL Editor)
// Copie e cole no painel: Supabase → SQL Editor → New Query
// =====================================================
/*

-- =====================================================
-- TABELAS
-- =====================================================

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text,
  email text,
  endereco text,
  bairro text,
  cidade text default 'Guarulhos',
  observacoes text,
  criado_em timestamptz default now()
);

create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  categoria text,
  preco_unitario numeric(10,2) not null default 0,
  unidade text default 'serviço',
  ativo boolean default true,
  criado_em timestamptz default now()
);

create sequence if not exists orcamento_numero_seq start 1;

create table if not exists orcamentos (
  id uuid primary key default gen_random_uuid(),
  numero integer default nextval('orcamento_numero_seq'),
  cliente_id uuid references clientes(id),
  status text default 'rascunho'
    check (status in ('rascunho','enviado','aprovado','executado','cancelado')),
  observacoes text,
  desconto_geral numeric(5,2) default 0,
  total numeric(10,2) default 0,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

create table if not exists orcamento_itens (
  id uuid primary key default gen_random_uuid(),
  orcamento_id uuid references orcamentos(id) on delete cascade,
  produto_id uuid references produtos(id),
  descricao text not null,
  quantidade numeric(10,2) default 1,
  preco_unitario numeric(10,2) not null,
  desconto numeric(5,2) default 0,
  subtotal numeric(10,2)
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table clientes enable row level security;
alter table produtos enable row level security;
alter table orcamentos enable row level security;
alter table orcamento_itens enable row level security;

create policy "Auth users only" on clientes for all using (auth.role() = 'authenticated');
create policy "Auth users only" on produtos for all using (auth.role() = 'authenticated');
create policy "Auth users only" on orcamentos for all using (auth.role() = 'authenticated');
create policy "Auth users only" on orcamento_itens for all using (auth.role() = 'authenticated');

-- =====================================================
-- SERVIÇOS PRÉ-CADASTRADOS (MÃO DE OBRA)
-- =====================================================

insert into produtos (nome, descricao, categoria, preco_unitario, unidade) values

-- ELÉTRICA
('Instalação de Chuveiro Elétrico', 'Instalação e troca de chuveiro elétrico, duchas e troca de resistência com segurança total na fiação.', 'Elétrica', 120.00, 'serviço'),
('Troca de Resistência de Chuveiro', 'Substituição de resistência com limpeza do chuveiro.', 'Elétrica', 60.00, 'serviço'),
('Instalação de Luminária / Plafon', 'Instalação de lustres, plafons, pendentes e fitas LED em salas, quartos e gesso rebaixado.', 'Elétrica', 80.00, 'serviço'),
('Instalação de Ventilador de Teto', 'Instalação completa de ventiladores de teto com reforço, fiação e controle de velocidade.', 'Elétrica', 150.00, 'serviço'),
('Instalação de Tomada (10A ou 20A)', 'Instalação de nova tomada, alteração de voltagem e troca de espelhos.', 'Elétrica', 90.00, 'unidade'),
('Troca de Interruptor / Dimmer', 'Troca de interruptores simples, paralelo (three-way), dimmer ou interruptor inteligente Wi-Fi.', 'Elétrica', 60.00, 'unidade'),
('Instalação de Ar-Condicionado Split', 'Instalação completa de ar-condicionado split incluindo suporte externo e vedação.', 'Elétrica', 250.00, 'serviço'),
('Instalação de Refletor / Spot LED', 'Instalação de refletor ou spot LED embutido no gesso ou sancas.', 'Elétrica', 50.00, 'unidade'),
('Passagem de Fio / Cabeamento', 'Passagem de fio elétrico por canaleta ou dentro de parede.', 'Elétrica', 80.00, 'hora'),
('Instalação de Disjuntor', 'Troca ou instalação de disjuntor no quadro elétrico.', 'Elétrica', 80.00, 'serviço'),

-- HIDRÁULICA
('Troca de Torneira (Convencional)', 'Troca de torneira convencional de pia, tanque ou lavatório.', 'Hidráulica', 80.00, 'serviço'),
('Troca de Misturador / Monocomando', 'Troca de torneira monocomando ou misturador de banheiro.', 'Hidráulica', 100.00, 'serviço'),
('Reparo de Vazamento em Torneira', 'Troca de vedações, reparo e registro interno.', 'Hidráulica', 60.00, 'serviço'),
('Desentupimento de Ralo / Pia', 'Desentupimento de ralo de pia, chuveiro ou tanque.', 'Hidráulica', 80.00, 'serviço'),
('Instalação de Vaso Sanitário', 'Instalação de vaso sanitário convencional ou com caixa acoplada.', 'Hidráulica', 150.00, 'serviço'),
('Reparo de Descarga / Flutuador', 'Troca ou reparo de mecanismo de descarga e flutuador.', 'Hidráulica', 70.00, 'serviço'),
('Troca de Registro de Gaveta/Esfera', 'Substituição de registro de gaveta ou esfera de ½" a 1".', 'Hidráulica', 90.00, 'serviço'),
('Instalação de Aquecedor a Gás', 'Instalação de aquecedor a gás (passagem ou acumulação) com teste de estanqueidade.', 'Hidráulica', 200.00, 'serviço'),
('Instalação de Filtro de Água', 'Instalação de filtro de água sob bancada ou de parede.', 'Hidráulica', 80.00, 'serviço'),

-- MONTAGEM & FIXAÇÃO
('Fixação de TV na Parede (Suporte Fixo)', 'Fixação de TV na parede com suporte fixo, buchas e nivelamento laser. Até 65".', 'Montagem & Fixação', 120.00, 'serviço'),
('Fixação de TV na Parede (Suporte Articulado)', 'Fixação de TV com suporte articulado ou inclinável em alvenaria ou drywall.', 'Montagem & Fixação', 150.00, 'serviço'),
('Fixação de TV em Painel MDF / Drywall', 'Fixação com buchas basculantes (Fly/Moly) em painel MDF ou parede de gesso.', 'Montagem & Fixação', 160.00, 'serviço'),
('Montagem de Guarda-Roupa', 'Montagem de guarda-roupa de 2 a 6 portas de todas as marcas (IKEA, Tok&Stok, etc.).', 'Montagem & Fixação', 200.00, 'serviço'),
('Montagem de Rack / Painel de TV', 'Montagem de rack, painel de TV ou estante com espelho.', 'Montagem & Fixação', 120.00, 'serviço'),
('Montagem de Cama Box / Berço', 'Montagem de cama box casal, solteiro ou berço de bebê.', 'Montagem & Fixação', 100.00, 'serviço'),
('Montagem de Mesa / Cadeira / Escritório', 'Montagem de mesa de jantar, escritório, cadeiras e armário de escritório.', 'Montagem & Fixação', 80.00, 'serviço'),
('Montagem de Armário de Cozinha', 'Montagem e ajuste de armário de cozinha planejado ou modulado.', 'Montagem & Fixação', 250.00, 'serviço'),
('Instalação de Cortina (Varão)', 'Instalação de varão de cortina em parede de alvenaria, concreto ou teto de gesso.', 'Montagem & Fixação', 90.00, 'serviço'),
('Instalação de Trilho Suíço', 'Instalação de trilho suíço para cortinas sob medida.', 'Montagem & Fixação', 12.00, 'metro'),
('Instalação de Persiana Rolo / Romana', 'Fixação de persiana rolo, romana ou horizontal.', 'Montagem & Fixação', 80.00, 'serviço'),
('Instalação de Varal de Parede', 'Fixação de varal retrátil ou de parede em área de serviço.', 'Montagem & Fixação', 70.00, 'serviço'),
('Fixação de Quadros e Espelhos', 'Fixação de quadros, espelhos e prateleiras com suportes adequados ao peso.', 'Montagem & Fixação', 50.00, 'unidade'),
('Instalação de Prateleiras', 'Fixação de prateleiras em paredes com suportes ou trilho.', 'Montagem & Fixação', 70.00, 'serviço'),

-- MANUTENÇÃO GERAL
('Troca de Fechadura / Maçaneta', 'Substituição de fechadura de entrada, quarto ou banheiro.', 'Manutenção Geral', 80.00, 'serviço'),
('Instalação de Fechadura Elétrica', 'Instalação de fechadura digital ou elétrica com programação.', 'Manutenção Geral', 180.00, 'serviço'),
('Reparos em Porta (Ajuste de Batente)', 'Ajuste de porta que abre sozinha, rangendo ou com folga no batente.', 'Manutenção Geral', 80.00, 'serviço'),
('Instalação de Tela Mosquiteira', 'Fixação de tela mosquiteira em janelas de PVC, madeira ou alumínio.', 'Manutenção Geral', 60.00, 'unidade'),
('Visita Técnica', 'Hora de mão de obra para diagnóstico e pequenos reparos avulsos.', 'Manutenção Geral', 120.00, 'hora'),
('Silicone / Vedação de Box', 'Aplicação de silicone de vedação no box do banheiro, janelas e peitoris.', 'Manutenção Geral', 80.00, 'serviço'),
('Revisão de Ar-Condicionado (Limpeza)', 'Limpeza e higienização de ar-condicionado split.', 'Manutenção Geral', 150.00, 'serviço'),
('Instalação de Câmera de Segurança', 'Instalação e configuração de câmera de segurança interna ou externa.', 'Manutenção Geral', 120.00, 'unidade');

*/
