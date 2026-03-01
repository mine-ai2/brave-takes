-- Phase 1 Schema Migration
-- Run this in Supabase SQL Editor

-- =============================================
-- USER PROFILES UPDATE
-- =============================================

-- Add new columns to profiles table for Phase 1
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS selected_track TEXT,
ADD COLUMN IF NOT EXISTS selected_platforms TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS current_day INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false;

-- =============================================
-- TRACKS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.tracks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Enable RLS (public read)
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tracks"
  ON public.tracks FOR SELECT
  USING (true);

-- Seed tracks
INSERT INTO public.tracks (id, name, description, icon, color, sort_order) VALUES
  ('foundation', 'Foundation', 'Build your confidence from the ground up. Perfect for beginners.', '🌱', 'emerald', 1),
  ('structured-visibility', 'Structured Visibility', 'Strategic content creation with purpose. For those ready to be seen.', '📈', 'blue', 2),
  ('accountability', 'Accountability', 'Daily commitment with community support. For those who thrive with structure.', '🎯', 'purple', 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- =============================================
-- TRACK MISSIONS TABLE (63 missions: 21 days × 3 tracks)
-- =============================================

CREATE TABLE IF NOT EXISTS public.track_missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 21),
  title TEXT NOT NULL,
  description TEXT,
  action_prompt TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'brave')),
  UNIQUE(track_id, day_number)
);

ALTER TABLE public.track_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view track missions"
  ON public.track_missions FOR SELECT
  USING (true);

-- =============================================
-- PLATFORMS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.platforms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view platforms"
  ON public.platforms FOR SELECT
  USING (true);

-- Seed platforms
INSERT INTO public.platforms (id, name, icon, color, sort_order) VALUES
  ('instagram', 'Instagram', '📸', 'pink', 1),
  ('linkedin', 'LinkedIn', '💼', 'blue', 2),
  ('youtube', 'YouTube', '🎬', 'red', 3),
  ('x', 'X (Twitter)', '𝕏', 'gray', 4),
  ('tiktok', 'TikTok', '🎵', 'teal', 5),
  ('facebook', 'Facebook', '👥', 'indigo', 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- =============================================
-- PLATFORM PROMPTS TABLE (36 prompts: 6 per platform)
-- =============================================

CREATE TABLE IF NOT EXISTS public.platform_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_id TEXT NOT NULL REFERENCES public.platforms(id) ON DELETE CASCADE,
  prompt_number INTEGER NOT NULL CHECK (prompt_number >= 1 AND prompt_number <= 6),
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  example TEXT,
  UNIQUE(platform_id, prompt_number)
);

ALTER TABLE public.platform_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view platform prompts"
  ON public.platform_prompts FOR SELECT
  USING (true);

-- =============================================
-- MOODS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.moods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  affirmations TEXT[] NOT NULL,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view moods"
  ON public.moods FOR SELECT
  USING (true);

-- Seed moods with affirmations
INSERT INTO public.moods (id, name, emoji, affirmations, sort_order) VALUES
  ('energized', 'Energized', '⚡', ARRAY[
    'Your energy today is contagious. Use it to create something bold.',
    'Ride this wave. The world needs your spark today.',
    'This is your moment. Channel that fire into your content.'
  ], 1),
  ('calm', 'Calm', '🌊', ARRAY[
    'Calm is a superpower. Your grounded energy will come through.',
    'From this peaceful place, your authentic voice emerges.',
    'Clarity comes from stillness. Trust what surfaces today.'
  ], 2),
  ('anxious', 'Anxious', '🦋', ARRAY[
    'Those butterflies? They mean you care. Courage isn''t the absence of fear.',
    'Anxiety is just excitement without the breath. Take one now.',
    'Your nervous system is preparing you. That''s readiness, not weakness.'
  ], 3),
  ('tired', 'Tired', '🌙', ARRAY[
    'Even on tired days, showing up is enough. Small steps count.',
    'Rest is productive too. A gentle rep is still a rep.',
    'Your consistency matters more than your intensity today.'
  ], 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  emoji = EXCLUDED.emoji,
  affirmations = EXCLUDED.affirmations,
  sort_order = EXCLUDED.sort_order;

-- =============================================
-- DAILY COMPLETIONS TABLE (Phase 1 version)
-- =============================================

CREATE TABLE IF NOT EXISTS public.daily_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_local DATE NOT NULL,
  mood_id TEXT REFERENCES public.moods(id),
  affirmation_shown TEXT,
  mission_id UUID REFERENCES public.track_missions(id),
  platform_prompt_id UUID REFERENCES public.platform_prompts(id),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date_local)
);

ALTER TABLE public.daily_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own completions"
  ON public.daily_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
  ON public.daily_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own completions"
  ON public.daily_completions FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- LOUNGE POSTS TABLE (Community Feature)
-- =============================================

CREATE TABLE IF NOT EXISTS public.lounge_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'general' CHECK (post_type IN ('general', 'win', 'question', 'support')),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lounge_posts ENABLE ROW LEVEL SECURITY;

-- Users can read all lounge posts
CREATE POLICY "Anyone authenticated can view lounge posts"
  ON public.lounge_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create lounge posts"
  ON public.lounge_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lounge posts"
  ON public.lounge_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lounge posts"
  ON public.lounge_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- LOUNGE LIKES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.lounge_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.lounge_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.lounge_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view likes"
  ON public.lounge_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like posts"
  ON public.lounge_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.lounge_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- STREAKS VIEW (Calculate streaks efficiently)
-- =============================================

CREATE OR REPLACE VIEW public.user_streaks AS
WITH date_series AS (
  SELECT 
    user_id,
    date_local,
    completed_at,
    date_local - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY date_local)::INTEGER AS streak_group
  FROM public.daily_completions
  WHERE completed_at IS NOT NULL
),
streaks AS (
  SELECT 
    user_id,
    MIN(date_local) AS streak_start,
    MAX(date_local) AS streak_end,
    COUNT(*) AS streak_length
  FROM date_series
  GROUP BY user_id, streak_group
)
SELECT 
  user_id,
  COALESCE(MAX(CASE WHEN streak_end = CURRENT_DATE OR streak_end = CURRENT_DATE - 1 THEN streak_length ELSE 0 END), 0) AS current_streak,
  COALESCE(MAX(streak_length), 0) AS longest_streak
FROM streaks
GROUP BY user_id;

-- =============================================
-- UPDATE HANDLE NEW USER TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, current_day, onboarding_complete)
  VALUES (new.id, 1, false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger already exists, just updating the function
