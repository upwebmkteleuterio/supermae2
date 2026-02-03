
-- SQL para Etapa 4: Performance e Segurança

-- 1. Indexação Otimizada
-- Garante que as consultas aos canais sejam instantâneas mesmo com milhares de mensagens
CREATE INDEX IF NOT EXISTS idx_channel_messages_lookup 
ON public.channel_messages (channel_id, created_at DESC);

-- 2. Reforço das Políticas RLS para os Novos Canais
-- Permite que usuários autenticados leiam mensagens de qualquer canal comunitário
DROP POLICY IF EXISTS "Permitir leitura de mensagens por usuários autenticados" ON public.channel_messages;
CREATE POLICY "Permitir leitura de mensagens por usuários autenticados" 
ON public.channel_messages FOR SELECT 
TO authenticated 
USING (true);

-- Permite que usuários autenticados enviem mensagens com seu próprio user_id
DROP POLICY IF EXISTS "Permitir inserção de mensagens por usuários autenticados" ON public.channel_messages;
CREATE POLICY "Permitir inserção de mensagens por usuários autenticados" 
ON public.channel_messages FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 3. Garantia de Tipagem
-- Garante que o channel_id é texto livre para aceitar os novos IDs atípicos
ALTER TABLE public.channel_messages 
ALTER COLUMN channel_id TYPE text;
