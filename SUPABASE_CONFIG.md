
# Espelho de Configuração Supabase - Super Mãe

Este arquivo serve como referência para a Inteligência Artificial manter a consistência entre o código frontend e o banco de dados backend.

## 1. Tabelas e Colunas

### Tabela: `profiles`
Armazena os dados cadastrais e preferências da mãe.
- `id`: uuid (Primary Key, references auth.users)
- `name`: text
- `email`: text
- `phone`: text
- `state`: text (UF)
- `city`: text
- `avatar_url`: text (Link público do Storage)
- `welcoming_goal`: text (Objetivo selecionado no onboarding)
- `app_interests`: text[] (Array de interesses)
- `has_seen_welcome_modal`: boolean (Default: false)
- `created_at`: timestamp with time zone

### Tabela: `children`
Armazena os dados dos filhos cadastrados.
- `id`: uuid (Default: gen_random_uuid())
- `parent_id`: uuid (References auth.users)
- `name`: text
- `birth_date`: date
- `avatar_url`: text
- `has_diagnosis`: boolean (Default: true)
- `diagnosis_status`: text
- `created_at`: timestamp with time zone

### Tabela: `mood_logs`
Registros diários de humor (Mãe e Filhos).
- `id`: uuid (Primary Key)
- `user_id`: uuid (References auth.users)
- `child_id`: uuid (References children, null se for da mãe)
- `date`: date (Default: current_date)
- `sentiment_ids`: text[] (IDs como 'happy', 'anxious', etc)
- `note`: text (Desafio ou nota do dia)
- `created_at`: timestamp with time zone

**Índices de Unicidade Necessários:**
1. `unique_mom_mood_per_day_idx`: `(user_id, date) WHERE child_id IS NULL`
2. `unique_child_mood_per_day_idx`: `(user_id, date, child_id) WHERE child_id IS NOT NULL`

### Tabela: `agenda_items`
Compromissos e tarefas.
- `id`: uuid (Primary Key)
- `user_id`: uuid (References auth.users)
- `title`: text
- `time`: time
- `date`: date
- `category`: text (Enum: Terapêutico, Sensorial, Funcional, Lúdico, Relacional, Cuidado, Outros)
- `participant_ids`: text[] (Contém 'mom' e/ou UUIDs dos filhos)
- `completed`: boolean (Default: false)
- `reminder`: boolean (Default: false)
- `description`: text
- `created_at`: timestamp with time zone

## 2. Storage (Armazenamento de Arquivos)

### Bucket: `avatars`
- **Acesso**: Público (`public: true`)
- **Pasta Raiz**: Organizado por `auth.uid()` para evitar conflitos.

## 3. Segurança (RLS - Row Level Security)

- **profiles**: `auth.uid() = id`
- **children**: `auth.uid() = parent_id`
- **mood_logs**: `auth.uid() = user_id`
- **agenda_items**: `auth.uid() = user_id`

---
*Última atualização: Março de 2025*
