// Brave Takes Phase 1 Types

export interface Profile {
  id: string
  created_at: string
  user_type: string | null
  avoidance: string | null
  top_fear: string | null
  daily_minutes: number | null
  // Phase 1 additions
  selected_track: string | null
  selected_platforms: string[] | null
  current_day: number
  onboarding_complete: boolean
  // Phase 2 additions
  preferred_mode: 'structured' | 'creative'
}

export interface Track {
  id: string
  name: string
  description: string
  icon: string
  color: string
  sort_order: number
}

export interface TrackMission {
  id: string
  track_id: string
  day_number: number
  title: string
  instructions: string
  why_it_works: string | null
  difficulty: number
}

export interface Platform {
  id: string
  name: string
  icon: string
  color: string
  sort_order: number
}

export interface PlatformPrompt {
  id: string
  platform_id: string
  prompt_number: number
  title: string
  prompt_text: string
  example: string | null
}

export interface CreativePrompt {
  id: string
  category: string
  title: string
  prompt_text: string
  example: string | null
  difficulty: number
  sort_order: number
}

export interface Mood {
  id: string
  name: string
  emoji: string
  affirmation: string
  sort_order: number
}

export interface DailyCompletion {
  id: string
  user_id: string
  date_local: string
  mood_id: string | null
  affirmation_shown: string | null
  mission_id: string | null
  platform_prompt_id: string | null
  creative_prompt_id: string | null
  mode_used: 'structured' | 'creative' | null
  completed_at: string | null
  notes: string | null
  created_at: string
}

export interface LoungePost {
  id: string
  user_id: string
  content: string
  post_type: 'general' | 'win' | 'question' | 'support'
  likes_count: number
  created_at: string
  // Joined data
  user_display_name?: string
  user_has_liked?: boolean
}

export interface LoungeLike {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export interface UserStreak {
  user_id: string
  current_streak: number
  longest_streak: number
}

// Legacy types for backward compatibility
export interface Checkin {
  id: string
  user_id: string
  created_at: string
  date_local: string
  anxiety_before: number
  anxiety_after: number | null
  thought_tag: string | null
  note: string | null
}

export interface Rep {
  id: string
  ladder_name: string | null
  day_number: number | null
  title: string | null
  rep_main: string | null
  rep_easier: string | null
}

export interface RepCompletion {
  id: string
  user_id: string
  rep_id: string | null
  created_at: string
  date_local: string
  status: 'done' | 'easier_done' | 'skipped' | null
  skip_reason: string | null
}

export interface Win {
  id: string
  user_id: string
  created_at: string
  date_local: string
  text: string
}

export interface Template {
  id: string
  platform: string | null
  content_type: string | null
  tone: string | null
  text: string | null
}

// V2 Session State - stored in Supabase for resume functionality
export interface SessionStateRecord {
  id: string
  user_id: string
  date_local: string
  current_step: string
  anxiety_level: number | null
  thought_tag: string | null
  goal_category: string | null
  boldness_level: number | null
  action_steps: string[] | null
  selected_action: string | null
  identity_choice: string | null
  meditation_track: string | null
  meditation_duration: number | null
  post_type: string | null
  post_framework: string | null
  post_draft: string | null
  recording_url: string | null
  reflection_note: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}
