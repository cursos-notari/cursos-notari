-- Adiciona campos para armazenar dados de pagamento na tabela pre_registrations
-- Execute este script para adicionar suporte a cache de ordens PagBank

-- Adiciona colunas para armazenar dados da ordem PagBank
ALTER TABLE public.pre_registrations 
ADD COLUMN IF NOT EXISTS pagbank_order_id text,
ADD COLUMN IF NOT EXISTS pagbank_order_data jsonb,
ADD COLUMN IF NOT EXISTS order_created_at timestamptz;

-- Cria índice para busca rápida por ordem PagBank
CREATE INDEX IF NOT EXISTS pre_registrations_pagbank_order_idx ON public.pre_registrations (pagbank_order_id);

-- Cria índice para limpeza de ordens antigas
CREATE INDEX IF NOT EXISTS pre_registrations_order_created_at_idx ON public.pre_registrations (order_created_at);

-- Comentários para documentação
COMMENT ON COLUMN public.pre_registrations.pagbank_order_id IS 'ID da ordem no PagBank para evitar duplicatas';
COMMENT ON COLUMN public.pre_registrations.pagbank_order_data IS 'Dados completos da ordem PagBank (JSON)';
COMMENT ON COLUMN public.pre_registrations.order_created_at IS 'Timestamp de quando a ordem foi criada';