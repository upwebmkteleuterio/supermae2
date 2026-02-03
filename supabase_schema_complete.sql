
-- 1. Tabela de Perfis (Caso não exista ou precise de ajustes)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name text,
    email text,
    phone text,
    state text,
    city text,
    avatar_url text,
    welcoming_goal text,
    app_interests text[],
    selected_voice text DEFAULT 'Beatriz',
    has_seen_welcome_modal boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- 2. Tabela de Filhos
CREATE TABLE IF NOT EXISTS public.children (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    birth_date text,
    avatar_url text,
    has_diagnosis boolean DEFAULT false,
    diagnosis_status text,
    created_at timestamptz DEFAULT now()
);

-- 3. Tabela de Rotinas (A que causou o erro)
CREATE TABLE IF NOT EXISTS public.routines (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    subtitle text,
    icon text DEFAULT 'Sparkles',
    image_url text,
    created_at timestamptz DEFAULT now()
);

-- 4. Tabela de Hábitos (Filha das Rotinas)
CREATE TABLE IF NOT EXISTS public.habits (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    routine_id uuid REFERENCES public.routines(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    category text,
    period text DEFAULT 'A qualquer momento',
    reminder boolean DEFAULT false,
    repetition text DEFAULT 'Todos os dias',
    custom_days int[],
    created_at timestamptz DEFAULT now()
);

-- 5. Tabela de Agenda de Itens (Compromissos Manuais)
CREATE TABLE IF NOT EXISTS public.agenda_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    time time NOT NULL,
    date date NOT NULL,
    category text,
    participant_ids text[],
    completed boolean DEFAULT false,
    reminder boolean DEFAULT false,
    description text,
    created_at timestamptz DEFAULT now()
);

-- 6. Tabela de Logs de Humor (Diário Emocional)
CREATE TABLE IF NOT EXISTS public.mood_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    child_id uuid REFERENCES public.children(id) ON DELETE CASCADE,
    date date NOT NULL,
    sentiment_ids text[] NOT NULL,
    note text,
    photo_url text,
    created_at timestamptz DEFAULT now()
);

-- 7. Tabela de Logs de Hábitos (Para o Dashboard)
CREATE TABLE IF NOT EXISTS public.habit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    habit_id uuid REFERENCES public.habits(id) ON DELETE CASCADE,
    date date NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- HABILITAR RLS (Segurança de Linha) em tudo
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO (Usuário só vê o dele)
DO $$ 
BEGIN
    -- Perfis
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
    END IF;

    -- Filhos
    CREATE POLICY "Users can manage own children" ON public.children 
    FOR ALL USING (auth.uid() = parent_id);

    -- Rotinas
    CREATE POLICY "Users can manage own routines" ON public.routines 
    FOR ALL USING (auth.uid() = user_id);

    -- Hábitos
    CREATE POLICY "Users can manage own habits" ON public.habits 
    FOR ALL USING (auth.uid() = user_id);

    -- Agenda
    CREATE POLICY "Users can manage own agenda" ON public.agenda_items 
    FOR ALL USING (auth.uid() = user_id);

    -- Logs
    CREATE POLICY "Users can manage own mood logs" ON public.mood_logs 
    FOR ALL USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can manage own habit logs" ON public.habit_logs 
    FOR ALL USING (auth.uid() = user_id);
END $$;
