
-- Drop existing conflicting policies and recreate them properly
DROP POLICY IF EXISTS "Anyone can view approved wishes" ON public.wishes;
DROP POLICY IF EXISTS "Anyone can like wishes" ON public.wish_likes;
DROP POLICY IF EXISTS "Anyone can view wish likes" ON public.wish_likes;
DROP POLICY IF EXISTS "Anyone can view approved replies" ON public.wish_replies;
DROP POLICY IF EXISTS "Anyone can create wishes" ON public.wishes;
DROP POLICY IF EXISTS "Anyone can reply to wishes" ON public.wish_replies;

-- Create comprehensive policies for wishes table
CREATE POLICY "Anyone can submit wishes" 
  ON public.wishes 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view approved wishes" 
  ON public.wishes 
  FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Anyone can view all wishes for management" 
  ON public.wishes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can update wishes" 
  ON public.wishes 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete wishes" 
  ON public.wishes 
  FOR DELETE 
  USING (true);

-- Enable RLS on wish_likes table if not already enabled
ALTER TABLE public.wish_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for wish_likes table
CREATE POLICY "Anyone can like wishes" 
  ON public.wish_likes 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view likes" 
  ON public.wish_likes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can delete likes" 
  ON public.wish_likes 
  FOR DELETE 
  USING (true);
