
-- Create wishes table for storing guest wishes
CREATE TABLE public.wishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL CHECK (length(content) <= 280),
  image_url TEXT,
  likes_count INTEGER NOT NULL DEFAULT 0,
  replies_count INTEGER NOT NULL DEFAULT 0,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wish_likes table for tracking likes
CREATE TABLE public.wish_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wish_id UUID NOT NULL REFERENCES public.wishes(id) ON DELETE CASCADE,
  guest_id TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wish_id, guest_id)
);

-- Create wish_replies table for threaded comments
CREATE TABLE public.wish_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wish_id UUID NOT NULL REFERENCES public.wishes(id) ON DELETE CASCADE,
  guest_id TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL CHECK (length(content) <= 280),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wish_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wish_replies ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to approved wishes
CREATE POLICY "Anyone can view approved wishes" 
  ON public.wishes 
  FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Anyone can view wish likes" 
  ON public.wish_likes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can view approved replies" 
  ON public.wish_replies 
  FOR SELECT 
  USING (is_approved = true);

-- Create policies for inserting wishes and likes
CREATE POLICY "Anyone can create wishes" 
  ON public.wishes 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can like wishes" 
  ON public.wish_likes 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can reply to wishes" 
  ON public.wish_replies 
  FOR INSERT 
  WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX idx_wishes_approved_created ON public.wishes(is_approved, created_at DESC);
CREATE INDEX idx_wish_likes_wish_id ON public.wish_likes(wish_id);
CREATE INDEX idx_wish_replies_wish_id ON public.wish_replies(wish_id);

-- Enable realtime for live updates
ALTER TABLE public.wishes REPLICA IDENTITY FULL;
ALTER TABLE public.wish_likes REPLICA IDENTITY FULL;
ALTER TABLE public.wish_replies REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wish_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wish_replies;

-- Create function to update wishes count when likes change
CREATE OR REPLACE FUNCTION update_wish_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.wishes 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.wish_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.wishes 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.wish_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to update replies count
CREATE OR REPLACE FUNCTION update_wish_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.wishes 
    SET replies_count = replies_count + 1 
    WHERE id = NEW.wish_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.wishes 
    SET replies_count = replies_count - 1 
    WHERE id = OLD.wish_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_likes_count
  AFTER INSERT OR DELETE ON public.wish_likes
  FOR EACH ROW EXECUTE FUNCTION update_wish_likes_count();

CREATE TRIGGER trigger_update_replies_count
  AFTER INSERT OR DELETE ON public.wish_replies
  FOR EACH ROW EXECUTE FUNCTION update_wish_replies_count();
