# Brave Takes V2 Upgrade Guide

## What's New in V2

### Multi-Step Daily Session Flow
The daily session now guides users through 8 steps:
1. **Check-In** - Anxiety slider (1-10) + thought tags
2. **Goal Selection** - Choose goal category + boldness level → generates action steps
3. **Identity Reframe** - "Impressive vs Useful" branching with reframe messages
4. **Reset** - Meditation with background music, timer (2/5/10 min), volume control
5. **Rep Builder** - Select post type → choose framework → expand draft
6. **Recording Studio** - Video+audio recording with bg music mixing and text overlay
7. **Reflection** - Journal prompt and notes
8. **Celebration** - Confetti, stats, tomorrow tease

### Features
- **Affirmations** with accent font (Playfair Display), shuffle button
- **Session state persistence** - resume where you left off
- **Progress tracking** - goals by category, average boldness, average anxiety
- **Carrie-voice microcopy** throughout

## Database Migration Required

Run this SQL in your Supabase SQL Editor:

```sql
-- V2 Session States table
CREATE TABLE IF NOT EXISTS session_states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_local DATE NOT NULL,
  current_step TEXT NOT NULL DEFAULT 'checkin',
  anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  thought_tag TEXT,
  goal_category TEXT,
  boldness_level INTEGER CHECK (boldness_level >= 1 AND boldness_level <= 5),
  action_steps TEXT[],
  selected_action TEXT,
  identity_choice TEXT CHECK (identity_choice IN ('impressive', 'useful')),
  meditation_track TEXT,
  meditation_duration INTEGER,
  post_type TEXT,
  post_framework TEXT,
  post_draft TEXT,
  recording_url TEXT,
  reflection_note TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date_local)
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_session_states_user_date 
ON session_states(user_id, date_local);

-- Row Level Security
ALTER TABLE session_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own session states"
ON session_states FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own session states"
ON session_states FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own session states"
ON session_states FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

## Audio Files (Optional)

For the meditation/reset feature to have actual background audio, add MP3 files to `public/audio/`:
- `calm-waves.mp3`
- `forest-morning.mp3`
- `gentle-rain.mp3`
- `soft-piano.mp3`
- `breathing-space.mp3`
- `zen-garden.mp3`

Recommended sources: Pixabay Music, Free Music Archive, Mixkit

The app works without these files - the timer still functions, just without audio.

## Safari Limitations

The Recording Studio uses the MediaRecorder API which has varying support:
- **Chrome/Edge/Firefox**: Full support for video+audio recording
- **Safari (iOS/macOS)**: Limited MediaRecorder support. May not record video. Users can still use the rest of the session flow.

WebM is the primary export format. MP4 would require server-side transcoding.

## Environment Variables

Same as V1:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deployment

The app auto-deploys on push to main via DigitalOcean App Platform.

Manual deploy: `doctl apps create-deployment 3dbeaaa6-6e3d-428a-a14a-a7783d76bf77`

Live URL: https://brave-takes-ebuc6.ondigitalocean.app
