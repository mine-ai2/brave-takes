export interface Profile {
  id: string
  created_at: string
  user_type: string | null
  avoidance: string | null
  top_fear: string | null
  daily_minutes: number | null
}

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
