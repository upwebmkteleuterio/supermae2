
# Estrutura do Banco de Dados (Sincronizada Março 2025)

## Tabelas Ativas no Supabase

### 1. `profiles`
Perfil principal e configurações de voz/onboarding.
- `id` (PK), `name`, `email`, `state`, `city`, `avatar_url`, `welcoming_goal`, `app_interests`, `selected_voice`, `has_seen_welcome_modal`.

### 2. `children`
Dados dos filhos para agendas personalizadas.
- `id` (PK), `parent_id` (FK), `name`, `birth_date`, `avatar_url`, `has_diagnosis`, `diagnosis_status`.

### 3. `routines`
Agrupadores de hábitos.
- `id` (PK), `user_id` (FK), `name`, `subtitle`, `icon`, `image_url`.

### 4. `habits`
Ações recorrentes dentro de uma rotina.
- `id` (PK), `routine_id` (FK), `user_id` (FK), `title`, `description`, `period`, `repetition`, `custom_days`.

### 5. `agenda_items`
Compromissos manuais e integrados (Mãe + Filhos).
- `id` (PK), `user_id` (FK), `title`, `time`, `date`, `participant_ids` (array), `completed`.

### 6. `mood_logs`
Histórico emocional detalhado com fotos e relatos.
- `id` (PK), `user_id` (FK), `child_id` (FK, opcional), `date`, `sentiment_ids` (array), `note`, `photo_url`.

### 7. `local_support_posts`
Mural de caronas e ajuda local.
- `id` (PK), `user_id` (FK), `type` (offer/request), `category`, `destination`, `date_time`, `status`.

### 8. `channel_messages`
Mensagens em tempo real dos canais temáticos.
- `id` (PK), `channel_id` (texto), `user_id` (FK), `text`, `user_name`, `user_avatar`.

### 9. `app_notifications`
Alertas de sistema e interações no mural.
- `id` (PK), `user_id` (FK), `sender_name`, `type`, `data` (jsonb), `read`.

---
*Status: Todas as tabelas migradas e políticas RLS configuradas.*
