# Brave Takes

A daily confidence-rep tool for voice actors who struggle with posting and self-promotion.

## Features

- 🔐 Magic link authentication (no passwords)
- 📋 Personalized onboarding
- 📅 14-day confidence ladder with daily micro-challenges
- 📊 Daily anxiety check-ins
- 🔥 Streak tracking
- 📝 Post template library
- 🏆 Wins log

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS
- **Backend:** Supabase (Auth + PostgreSQL)
- **Hosting:** Digital Ocean App Platform

## Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to SQL Editor and run `supabase/schema.sql`
3. Then run `supabase/seed.sql` to populate the 14-day ladder and templates
4. Go to Settings > API to get your URL and anon key

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

### 3. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Digital Ocean

1. Push to GitHub
2. Create app in Digital Ocean App Platform
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Project Structure

```
src/
├── app/
│   ├── auth/callback/     # Magic link callback
│   ├── login/             # Login page
│   ├── onboarding/        # User setup flow
│   ├── today/             # Daily rep page
│   ├── templates/         # Post templates
│   ├── progress/          # Stats & wins
│   └── settings/          # Account settings
├── components/
│   └── Navigation.tsx     # Bottom nav
└── lib/
    ├── supabase/          # Supabase clients
    └── types.ts           # TypeScript types
```

## Credits

Created by Carrie Farris  
Built with ❤️ by MineAI
