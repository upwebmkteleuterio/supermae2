-- Tabela de Parceiros/Indicações
CREATE TABLE public.indications_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT,
  category TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Avaliações/Reviews
CREATE TABLE public.indications_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.indications_partners(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.indications_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indications_reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para indications_partners
CREATE POLICY "Leitura pública para autenticados" ON public.indications_partners
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários podem inserir indicações" ON public.indications_partners
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Criadores podem editar suas indicações" ON public.indications_partners
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Criadores podem excluir suas indicações" ON public.indications_partners
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Políticas para indications_reviews
CREATE POLICY "Leitura pública de reviews" ON public.indications_reviews
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Mães podem avaliar" ON public.indications_reviews
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Criadores podem excluir suas avaliações" ON public.indications_reviews
FOR DELETE TO authenticated USING (auth.uid() = user_id);