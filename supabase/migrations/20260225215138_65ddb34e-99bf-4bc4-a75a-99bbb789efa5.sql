-- Create movies table
CREATE TABLE public.movies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  categorias TEXT[] NOT NULL DEFAULT '{}',
  ano INTEGER,
  poster_url TEXT,
  assistido BOOLEAN NOT NULL DEFAULT false,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own movies" ON public.movies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own movies" ON public.movies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own movies" ON public.movies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own movies" ON public.movies
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_movies_updated_at
  BEFORE UPDATE ON public.movies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_movies_user_id ON public.movies (user_id);
CREATE INDEX idx_movies_categorias ON public.movies USING GIN (categorias);