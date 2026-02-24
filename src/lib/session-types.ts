// V2 Session Types

export type SessionStep =
  | 'checkin'
  | 'goal'
  | 'identity'
  | 'reset'
  | 'repbuilder'
  | 'studio'
  | 'reflection'
  | 'celebration';

export const SESSION_STEPS: SessionStep[] = [
  'checkin',
  'goal',
  'identity',
  'reset',
  'repbuilder',
  'studio',
  'reflection',
  'celebration',
];

export const STEP_TITLES: Record<SessionStep, string> = {
  checkin: 'Check In',
  goal: 'Set Your Goal',
  identity: 'Identity Reframe',
  reset: 'Reset',
  repbuilder: 'Build Your Rep',
  studio: 'Recording Studio',
  reflection: 'Reflect',
  celebration: 'Celebrate!',
};

export const STEP_MICROCOPY: Record<SessionStep, string> = {
  checkin: "How loud is your nervous system today?",
  goal: "Let's aim this somewhere.",
  identity: "What kind of creator do you want to be?",
  reset: "You're safe. This is just a rep.",
  repbuilder: "Let's build something small but brave.",
  studio: "Say it out loud.",
  reflection: "What did you notice?",
  celebration: "You did it anyway. That's the whole game.",
};

// Goal types for the Goal Selection step
export const GOAL_CATEGORIES = [
  { id: 'content', label: 'Create Content', icon: '📝' },
  { id: 'engage', label: 'Engage with Others', icon: '💬' },
  { id: 'pitch', label: 'Pitch Something', icon: '🎯' },
  { id: 'share', label: 'Share Personal Story', icon: '❤️' },
  { id: 'learn', label: 'Learn in Public', icon: '📚' },
  { id: 'connect', label: 'Connect with Someone', icon: '🤝' },
] as const;

export type GoalCategory = typeof GOAL_CATEGORIES[number]['id'];

// Boldness levels
export const BOLDNESS_LEVELS = [
  { level: 1, label: 'Gentle', description: 'Small, safe step' },
  { level: 2, label: 'Moderate', description: 'Some stretch involved' },
  { level: 3, label: 'Bold', description: 'Real vulnerability' },
  { level: 4, label: 'Brave', description: 'Major courage required' },
  { level: 5, label: 'Fearless', description: 'All in, nothing held back' },
] as const;

// Action step templates based on goal + boldness
export const ACTION_TEMPLATES: Record<GoalCategory, Record<number, string[]>> = {
  content: {
    1: ["Draft a short post without publishing", "Write 3 content ideas", "Edit an old draft"],
    2: ["Post a quick thought or tip", "Share a behind-the-scenes moment", "Reply to 3 posts with value"],
    3: ["Publish a longer piece you have been holding back", "Share a lesson from a failure", "Post a video of yourself"],
    4: ["Share a controversial opinion", "Go live for 5 minutes", "Post something with zero editing"],
    5: ["Publish your most vulnerable story", "Create content in a format you have never tried", "Share your biggest fear about your work"],
  },
  engage: {
    1: ["Like and save 5 posts for inspiration", "Follow 3 new accounts in your niche", "Read comments on popular posts"],
    2: ["Leave 3 thoughtful comments", "Reply to someone you admire", "Answer a question in your field"],
    3: ["DM someone whose work inspires you", "Join a conversation thread", "Offer to help someone publicly"],
    4: ["Ask for feedback on your work", "Propose a collaboration", "Challenge an idea respectfully"],
    5: ["Start a conversation with someone above your level", "Host a discussion or Q&A", "Be the first to share an unpopular take"],
  },
  pitch: {
    1: ["Write out your pitch privately", "Research 3 potential opportunities", "Update your bio or portfolio"],
    2: ["Pitch yourself in a low-stakes situation", "Submit to an open call", "Apply to one opportunity"],
    3: ["Cold email someone about your work", "Pitch a guest post or collaboration", "Ask for a testimonial"],
    4: ["Pitch to someone who intimidates you", "Follow up on a pitch that went silent", "Negotiate your rate"],
    5: ["Pitch your dream opportunity", "Make a big ask you have been avoiding", "Put a deadline on yourself publicly"],
  },
  share: {
    1: ["Journal about a personal experience", "Tell one person about something you are proud of", "Share a win with a friend"],
    2: ["Post a personal update", "Share what you are working on", "Mention a challenge you are facing"],
    3: ["Tell a story about a mistake you made", "Share something you are still figuring out", "Be honest about a struggle"],
    4: ["Share a story you have never told publicly", "Admit something you are afraid people will judge", "Talk about a failure openly"],
    5: ["Share your deepest creative fear", "Post about your journey without filters", "Let people see the real you"],
  },
  learn: {
    1: ["Take notes on something you are learning", "Bookmark resources to study later", "Watch one tutorial"],
    2: ["Share what you are learning today", "Ask a question publicly", "Document your learning process"],
    3: ["Teach something you just learned", "Share your notes or takeaways", "Admit what you do not know yet"],
    4: ["Create a tutorial or guide", "Share a project in progress", "Ask for critique on your learning"],
    5: ["Learn something new live", "Start a learning in public series", "Share your entire process, including mistakes"],
  },
  connect: {
    1: ["Think of 3 people you want to connect with", "Research someone you admire", "Find common ground with someone"],
    2: ["Send a friendly DM", "Comment on their work with genuine appreciation", "Share someone elses work"],
    3: ["Ask someone for advice", "Offer help to someone in your network", "Make an introduction"],
    4: ["Have a deeper conversation with someone new", "Ask to meet virtually", "Be vulnerable in a conversation"],
    5: ["Reach out to your biggest inspiration", "Propose a meaningful collaboration", "Share your authentic self with someone new"],
  },
};

// Identity reframe options
export const IDENTITY_OPTIONS = {
  impressive: {
    title: 'Impressive',
    description: 'I want people to see my talent and achievements',
    reframe: "What if impressing others was a side effect, not the goal?",
  },
  useful: {
    title: 'Useful',
    description: 'I want to help people and make a difference',
    reframe: "You're already useful. The question is: to whom?",
  },
} as const;

// Post types for Rep Builder
export const POST_TYPES = [
  { id: 'thought', label: 'Quick Thought', icon: '💭' },
  { id: 'story', label: 'Personal Story', icon: '📖' },
  { id: 'tip', label: 'Tip or Lesson', icon: '💡' },
  { id: 'question', label: 'Question', icon: '❓' },
  { id: 'behind-scenes', label: 'Behind the Scenes', icon: '🎬' },
  { id: 'opinion', label: 'Hot Take', icon: '🔥' },
] as const;

export type PostType = typeof POST_TYPES[number]['id'];

// Frameworks for each post type
export const POST_FRAMEWORKS: Record<PostType, string[]> = {
  thought: [
    "Something I've been thinking about: [thought]",
    "Unpopular opinion: [opinion]",
    "I used to believe [old belief]. Now I think [new belief].",
  ],
  story: [
    "The moment I realized [insight] was when [story]...",
    "Here's what [experience] taught me about [topic]...",
    "[Time period] ago, I [situation]. Here's what happened...",
  ],
  tip: [
    "One thing that changed [area] for me: [tip]",
    "If you're struggling with [problem], try this: [solution]",
    "The simple habit that [result]: [habit]",
  ],
  question: [
    "I'm curious: [question]",
    "What's your take on [topic]?",
    "Am I the only one who [observation/question]?",
  ],
  'behind-scenes': [
    "Here's what [process] actually looks like...",
    "POV: You're watching me [activity]",
    "The unglamorous reality of [topic]...",
  ],
  opinion: [
    "Hot take: [opinion]",
    "I'll probably get pushback for this, but [opinion]",
    "[Common belief] is wrong. Here's why...",
  ],
};

// Session state for resume functionality
export interface SessionState {
  id?: string;
  user_id: string;
  date_local: string;
  current_step: SessionStep;
  anxiety_level?: number;
  thought_tag?: string;
  goal_category?: GoalCategory;
  boldness_level?: number;
  action_steps?: string[];
  selected_action?: string;
  identity_choice?: 'impressive' | 'useful';
  meditation_track?: string;
  meditation_duration?: number;
  post_type?: PostType;
  post_framework?: string;
  post_draft?: string;
  recording_url?: string;
  reflection_note?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Meditation tracks
export interface MeditationTrack {
  id: string;
  name: string;
  url: string;
  duration: number; // in seconds, for display
}

// We'll use placeholder tracks - in production these would be real audio files
export const MEDITATION_TRACKS: MeditationTrack[] = [
  { id: 'calm-waves', name: 'Calm Waves', url: '/audio/calm-waves.mp3', duration: 300 },
  { id: 'forest-morning', name: 'Forest Morning', url: '/audio/forest-morning.mp3', duration: 300 },
  { id: 'gentle-rain', name: 'Gentle Rain', url: '/audio/gentle-rain.mp3', duration: 300 },
  { id: 'soft-piano', name: 'Soft Piano', url: '/audio/soft-piano.mp3', duration: 300 },
  { id: 'breathing-space', name: 'Breathing Space', url: '/audio/breathing-space.mp3', duration: 300 },
  { id: 'zen-garden', name: 'Zen Garden', url: '/audio/zen-garden.mp3', duration: 300 },
];

export const TIMER_OPTIONS = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
];
