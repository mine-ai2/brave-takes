# Brave Takes - Project Log

**Client:** Carrie Farris (carrie@carriefarris.com)
**Connection:** Adam Farris (Welligence) — his wife
**Status:** Active (favor project, low priority)
**Repo:** https://github.com/mine-ai2/brave-takes
**Live:** https://app.bravetakes.com
**Discord:** #app-brave-takes

---

## Phase 1 (COMPLETE) ✅

**Shipped:** 2026-03-01
**Time:** ~4 hours

### Features Built:

1. **Email + Password Auth** ✅
   - Sign up with email + password
   - Login with email + password
   - Forgot password reset flow
   - Magic link kept as fallback option

2. **Track Selection Onboarding** ✅
   - 3 tracks: Foundation / Structured Visibility / Accountability
   - Beautiful track cards with descriptions
   - 63 track missions seeded (21 days × 3 tracks)

3. **Platform Selection** ✅
   - 6 platforms: Instagram, LinkedIn, YouTube, X, TikTok, Facebook
   - Multi-select grid interface
   - 36 platform prompts seeded (6 per platform)

4. **Daily Flow** ✅
   - Mood check-in (4 moods: Energized, Calm, Anxious, Tired)
   - Affirmation display (3 per mood, randomly selected)
   - Mission card from selected track + current day
   - Platform prompt (random from user's selected platforms)
   - Completion tracking

5. **Streaks** ✅
   - Track consecutive daily completions
   - Current streak and longest streak display
   - Database view for efficient streak calculation

6. **The Lounge** ✅
   - Community post feed
   - 4 post types: Share, Win, Question, Support
   - Like/unlike functionality
   - Filter by post type

7. **Editorial UI** ✅
   - Clean slate/rose/orange color palette
   - Gradient accents
   - Modern rounded card design
   - Mobile-first responsive layout

### Database Changes:
- New tables: tracks, track_missions, platforms, platform_prompts, moods, daily_completions, lounge_posts, lounge_likes
- Updated profiles table with track/platform selection
- User streaks view

### Migration Required:
Run these SQL files in Supabase SQL Editor (in order):
1. `supabase/migrations/20260301_phase1_schema.sql`
2. `supabase/migrations/20260301_phase1_seed.sql`

---

## V1 MVP (COMPLETE) ✅

**Shipped:** 2026-02-20
**Time:** ~2 hours

Features:
- [x] Magic link auth (Supabase)
- [x] Onboarding (user type, fear, avoidance)
- [x] 14-day confidence ladder
- [x] Daily check-ins (anxiety 1-10 + thought tag)
- [x] Rep completion tracking + streak
- [x] Template library with filtering
- [x] Progress page with wins log
- [x] Mobile-first UI

---

## V2 Feature Request (SUPERSEDED by Phase 1)

The V2 multi-step session flow was built but has been replaced by the simpler Phase 1 daily flow per Carrie's updated requirements.

---

## Open Questions

- [ ] Custom domain: app.bravetakes.com needs DNS setup

---

## Timeline

| Date | Update |
|------|--------|
| 2026-02-20 | V1 MVP shipped, deployed to DO |
| 2026-02-20 | V2 spec received from Carrie |
| 2026-02-20 | Confirmed phased approach |
| 2026-03-01 | Phase 1 complete: auth, tracks, platforms, daily flow, lounge |

---

## Notes

- This is a favor project for Adam Farris's wife
- Low priority — paying work comes first
- Troy approved "chip away over time" approach
- Carrie is enthusiastic and detailed — good to work with
