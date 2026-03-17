
# Configuração Técnica Supabase

## Storage Buckets (Públicos)
1.  `avatars`: Fotos de perfil de mães e filhos.
2.  `mood_entries`: Fotos capturadas no diário emocional.

## Realtime
- Habilitado para a tabela `channel_messages` e `app_notifications`.

## Índices de Performance
- `idx_channel_messages_lookup`: `(channel_id, created_at DESC)`
- `idx_agenda_date`: `(user_id, date)`
- `idx_mood_logs_date`: `(user_id, date)`

## Políticas de Segurança (RLS)
- Padrão: `auth.uid() = user_id`.
- Exceção Mural/Chat: `SELECT` habilitado para todos os usuários autenticados.
