
# Espelho de Configuração Supabase - Super Mãe (Completo)

Este arquivo é a referência técnica da estrutura do banco de dados.

## 1. Tabelas e Esquema

### `profiles` (Perfil da Mãe)
- `id`: uuid (PK, references auth.users)
- `name`: text
- `email`: text
- `phone`: text
- `state`: text
- `city`: text
- `avatar_url`: text
- `welcoming_goal`: text
- `app_interests`: text[]
- `selected_voice`: text (Default: 'Kore')
- `has_seen_welcome_modal`: boolean (Default: false)
- `created_at`: timestamp with time zone

### `children` (Filhos)
- `id`: uuid (PK)
- `parent_id`: uuid (References auth.users)
- `name`: text
- `birth_date`: text (Format: DD/MM/AAAA ou ISO)
- `avatar_url`: text
- `has_diagnosis`: boolean
- `diagnosis_status`: text
- `created_at`: timestamp with time zone

### `agenda_items` (Eventos e Compromissos)
- `id`: uuid (PK)
- `user_id`: uuid (References auth.users)
- `title`: text
- `time`: time
- `date`: date (YYYY-MM-DD)
- `category`: text (Enum: Terapêutico, Cuidado, etc.)
- `participant_ids`: text[] (Contém 'mom' e/ou UUIDs de filhos)
- `completed`: boolean (Default: false)
- `reminder`: boolean (Default: false)
- `description`: text (Usado também para recorrência)

### `mood_logs` (Diários Emocionais)
- `id`: uuid (PK)
- `user_id`: uuid (References auth.users)
- `child_id`: uuid (NULL para mãe, UUID para filho)
- `date`: date
- `sentiment_ids`: text[]
- `note`: text (Resposta da IA ou observações)
- `created_at`: timestamp with time zone

### `routines` (Grupos de Hábitos)
- `id`: uuid (PK)
- `user_id`: uuid (References auth.users)
- `name`: text
- `subtitle`: text
- `icon`: text
- `image_url`: text

### `habits` (Hábitos Individuais)
- `id`: uuid (PK)
- `routine_id`: uuid (References routines)
- `user_id`: uuid (References auth.users)
- `title`: text
- `description`: text
- `category`: text
- `period`: text (Manhã, Tarde, Noite, etc.)
- `reminder`: boolean
- `repetition`: text
- `custom_days`: int2[] (0-6)

### `habit_logs` (Histórico de Conclusão)
- `user_id`: uuid (References auth.users)
- `habit_id`: uuid (References habits)
- `date`: date
- `PRIMARY KEY (habit_id, date)`

### `channel_messages` (Chat Comunitário)
- `id`: uuid (PK)
- `channel_id`: text
- `user_id`: uuid (References auth.users)
- `user_name`: text
- `user_avatar`: text
- `text`: text
- `created_at`: timestamp with time zone

## 2. Automações e Gatilhos (SQL)

### `trigger_clean_messages`
- **Função:** `clean_old_messages()`
- **Comportamento:** Monitora `channel_messages`. Após cada inserção, deleta registros que excedem o limite de 50 mensagens mais recentes por `channel_id`.

## 3. Configurações de Tempo Real (Realtime)
- **Publicação `supabase_realtime`:** Habilitada para a tabela `channel_messages`.
- **Presence:** Habilitado via WebSockets no frontend para contagem de usuários por canal.

## 4. Políticas de Segurança (RLS)
- Todas as tabelas possuem RLS ativado.
- Usuários só podem ler/escrever seus próprios dados (baseado em `auth.uid() = user_id`), exceto `channel_messages` onde a leitura é permitida para qualquer usuário autenticado.

---
*Última revisão: Março de 2025*
