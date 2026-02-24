-- V2 Session States table for multi-step session flow
-- This table stores the state of each daily session for resume functionality

CREATE TABLE IF NOT EXISTS session_states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_local DATE NOT NULL,
  current_step TEXT NOT NULL DEFAULT 'checkin',
  
  -- Check-in data
  anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  thought_tag TEXT,
  
  -- Goal data
  goal_category TEXT,
  boldness_level INTEGER CHECK (boldness_level >= 1 AND boldness_level <= 5),
  action_steps TEXT[],
  selected_action TEXT,
  
  -- Identity reframe
  identity_choice TEXT CHECK (identity_choice IN ('impressive', 'useful')),
  
  -- Reset/meditation
  meditation_track TEXT,
  meditation_duration INTEGER,
  
  -- Rep builder
  post_type TEXT,
  post_framework TEXT,
  post_draft TEXT,
  
  -- Recording studio
  recording_url TEXT,
  
  -- Reflection
  reflection_note TEXT,
  
  -- Session completion
  completed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one session per user per day
  UNIQUE(user_id, date_local)
);

-- Index for fast lookup by user and date
CREATE INDEX IF NOT EXISTS idx_session_states_user_date 
ON session_states(user_id, date_local);

-- Row Level Security
ALTER TABLE session_states ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own session states
CREATE POLICY "Users can view own session states"
ON session_states FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own session states"
ON session_states FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own session states"
ON session_states FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Update the rep_completions table to add unique constraint if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'rep_completions_user_date_unique'
  ) THEN
    ALTER TABLE rep_completions 
    ADD CONSTRAINT rep_completions_user_date_unique 
    UNIQUE (user_id, date_local);
  END IF;
END $$;
