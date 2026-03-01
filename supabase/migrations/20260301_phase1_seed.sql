-- Phase 1 Seed Data: Track Missions (63) and Platform Prompts (36)

-- =============================================
-- FOUNDATION TRACK MISSIONS (21 days)
-- =============================================

INSERT INTO public.track_missions (track_id, day_number, title, description, action_prompt, difficulty) VALUES
  ('foundation', 1, 'Break the Silence', 'Your first step: just show up.', 'Open your chosen platform and simply observe for 5 minutes. Notice what others are posting. No pressure to engage yet.', 'easy'),
  ('foundation', 2, 'Find Your Voice', 'What do you actually want to say?', 'Write down 3 topics you could talk about comfortably. Keep it private for now.', 'easy'),
  ('foundation', 3, 'The First Like', 'Engagement starts small.', 'Like 5 posts that genuinely resonate with you. No comments required.', 'easy'),
  ('foundation', 4, 'Leave a Mark', 'Your voice matters.', 'Leave one genuine comment on a post you enjoyed. Keep it simple and authentic.', 'easy'),
  ('foundation', 5, 'The Draft Zone', 'Writing without publishing.', 'Write a short post (2-3 sentences) about your day or a thought. Save it as a draft. Do not publish.', 'easy'),
  ('foundation', 6, 'Comment Round Two', 'Building the habit.', 'Leave 3 comments on different posts. Focus on adding value or genuine appreciation.', 'easy'),
  ('foundation', 7, 'Story Time', 'Your first visual moment.', 'Post a story (ephemeral content that disappears). Can be anything: coffee, workspace, sky.', 'medium'),
  ('foundation', 8, 'The Micro Post', 'Smallest viable content.', 'Publish your shortest possible post. One sentence. One thought. Hit publish.', 'medium'),
  ('foundation', 9, 'Engage with Intent', 'Conversations are currency.', 'Reply to 2 comments on your content or continue 2 conversations you started.', 'easy'),
  ('foundation', 10, 'Share Something Real', 'A glimpse of the real you.', 'Post something personal but safe - a book you love, music that moves you, or a place that matters.', 'medium'),
  ('foundation', 11, 'Ask a Question', 'Curiosity creates connection.', 'Post a genuine question to your audience. Something you actually want to know.', 'medium'),
  ('foundation', 12, 'The Behind-the-Scenes', 'Let them see the process.', 'Share a peek behind your curtain. Work in progress, messy desk, real life.', 'medium'),
  ('foundation', 13, 'Value Drop', 'Give something useful.', 'Share one tip, hack, or insight from your area of knowledge.', 'medium'),
  ('foundation', 14, 'The Halfway Mark', 'Celebrate progress.', 'Post about something you are proud of. Big or small. Celebrate yourself.', 'medium'),
  ('foundation', 15, 'Reply to Everyone', 'Community is reciprocal.', 'Respond to every comment you have received this week. Every single one.', 'easy'),
  ('foundation', 16, 'Longer Form', 'Say more.', 'Write a post with a beginning, middle, and end. Tell a mini-story.', 'medium'),
  ('foundation', 17, 'Share Your Why', 'The deeper layer.', 'Post about why you do what you do. What drives you?', 'brave'),
  ('foundation', 18, 'The Repost', 'Curate and credit.', 'Share someone else''s content that inspired you. Tag them. Add your thoughts.', 'easy'),
  ('foundation', 19, 'Opinion Time', 'Take a stance.', 'Share an opinion about something in your field. Keep it thoughtful.', 'brave'),
  ('foundation', 20, 'Vulnerable Truth', 'Go deeper.', 'Share something you have been hesitant to post. A struggle, lesson, or truth.', 'brave'),
  ('foundation', 21, 'Foundation Complete', 'You built the base.', 'Reflect on your 21-day journey. Post your biggest takeaway or growth moment.', 'brave')
ON CONFLICT (track_id, day_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  action_prompt = EXCLUDED.action_prompt,
  difficulty = EXCLUDED.difficulty;

-- =============================================
-- STRUCTURED VISIBILITY TRACK MISSIONS (21 days)
-- =============================================

INSERT INTO public.track_missions (track_id, day_number, title, description, action_prompt, difficulty) VALUES
  ('structured-visibility', 1, 'Content Audit', 'Know where you stand.', 'Review your last 10 posts. What worked? What didn''t? Write down patterns.', 'easy'),
  ('structured-visibility', 2, 'Ideal Audience', 'Who are you talking to?', 'Write a detailed description of your ideal follower. Be specific.', 'easy'),
  ('structured-visibility', 3, 'Content Pillars', 'Define your lanes.', 'Choose 3-4 topics you will consistently create content about.', 'easy'),
  ('structured-visibility', 4, 'Hook Practice', 'First lines matter most.', 'Write 5 different hooks for the same piece of content. Test which grabs attention.', 'medium'),
  ('structured-visibility', 5, 'Value-First Post', 'Give before you ask.', 'Create a post that solves a problem your audience has. Pure value, no pitch.', 'medium'),
  ('structured-visibility', 6, 'Story Structure', 'Narrative is everything.', 'Write a post using: Setup → Conflict → Resolution. Classic story beats.', 'medium'),
  ('structured-visibility', 7, 'Visual Upgrade', 'Stand out visually.', 'Create or curate a strong visual to pair with your post. First impressions count.', 'medium'),
  ('structured-visibility', 8, 'Call to Action', 'Tell them what to do.', 'End your post with a clear, specific call to action. Not just "thoughts?"', 'medium'),
  ('structured-visibility', 9, 'Engagement Block', 'Dedicated connection time.', 'Spend 20 minutes engaging meaningfully with others in your niche.', 'easy'),
  ('structured-visibility', 10, 'Controversial Take', 'Safe is invisible.', 'Share an opinion that might ruffle feathers. Stand for something.', 'brave'),
  ('structured-visibility', 11, 'Social Proof', 'Let results speak.', 'Share a win, testimonial, or result. Show don''t just tell.', 'medium'),
  ('structured-visibility', 12, 'Collaboration Reach', 'Two audiences are better.', 'Reach out to someone for a potential collaboration. Start the conversation.', 'brave'),
  ('structured-visibility', 13, 'Series Start', 'Build anticipation.', 'Begin a content series. Part 1 of something valuable.', 'medium'),
  ('structured-visibility', 14, 'Repurpose Magic', 'Work smarter.', 'Take old content and remake it for a different format or platform.', 'easy'),
  ('structured-visibility', 15, 'Trend Riding', 'Relevance is currency.', 'Create content that ties into a current trend or conversation.', 'medium'),
  ('structured-visibility', 16, 'Long-Form Depth', 'Go deep on something.', 'Create your most comprehensive piece of content yet. Be the resource.', 'brave'),
  ('structured-visibility', 17, 'Personal Brand Story', 'Your origin matters.', 'Share your journey. How did you get here? Why should people care?', 'brave'),
  ('structured-visibility', 18, 'DM Strategy', 'Relationships in private.', 'Send 5 genuine DMs to people whose content you admire. No pitch.', 'medium'),
  ('structured-visibility', 19, 'Analytics Review', 'Data drives decisions.', 'Review your analytics. What time, format, and topics perform best?', 'easy'),
  ('structured-visibility', 20, 'Signature Content', 'What only you can make.', 'Create content in your unique voice that no one else could replicate.', 'brave'),
  ('structured-visibility', 21, 'Visibility Complete', 'You have been seen.', 'Post about your visibility journey. What changed? What will you keep doing?', 'brave')
ON CONFLICT (track_id, day_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  action_prompt = EXCLUDED.action_prompt,
  difficulty = EXCLUDED.difficulty;

-- =============================================
-- ACCOUNTABILITY TRACK MISSIONS (21 days)
-- =============================================

INSERT INTO public.track_missions (track_id, day_number, title, description, action_prompt, difficulty) VALUES
  ('accountability', 1, 'Public Commitment', 'Put it out there.', 'Post your 21-day challenge commitment publicly. Tell people what you are doing.', 'medium'),
  ('accountability', 2, 'Daily Check-In', 'Consistency starts now.', 'Post a quick update on Day 2. Just show up. That is the whole point.', 'easy'),
  ('accountability', 3, 'Find Your People', 'Community accelerates growth.', 'Find 3 others doing similar work. Follow, engage, and connect.', 'easy'),
  ('accountability', 4, 'Share a Struggle', 'Vulnerability builds trust.', 'Post about something you are finding difficult. Ask for support or advice.', 'brave'),
  ('accountability', 5, 'Accountability Partner', 'Two is stronger than one.', 'Reach out to someone to be accountability buddies. Check in daily.', 'medium'),
  ('accountability', 6, 'Document, Don''t Create', 'Share the process.', 'Instead of creating polished content, document what you are actually doing today.', 'easy'),
  ('accountability', 7, 'Weekly Recap', 'Reflection builds momentum.', 'Post a summary of your first week. Wins, struggles, learnings.', 'medium'),
  ('accountability', 8, 'Encourage Someone', 'Give what you need.', 'Leave 5 genuinely encouraging comments on others'' content.', 'easy'),
  ('accountability', 9, 'Behind the Numbers', 'Real talk about metrics.', 'Share honestly about your numbers. Views, followers, engagement. No shame.', 'brave'),
  ('accountability', 10, 'Habit Stack', 'Tie it to existing routines.', 'Post about how you are making content creation part of your daily routine.', 'easy'),
  ('accountability', 11, 'Failed Attempt', 'Failure is data.', 'Share something that did not work. What did you learn?', 'brave'),
  ('accountability', 12, 'Midpoint Reflection', 'Halfway there.', 'Post about your journey so far. What has surprised you?', 'medium'),
  ('accountability', 13, 'Support Circle', 'Cheer others on.', 'Spend today actively supporting others. Comments, shares, DMs of encouragement.', 'easy'),
  ('accountability', 14, 'Real-Time Content', 'Post as it happens.', 'Share something in real-time today. Work session, thoughts, moment.', 'medium'),
  ('accountability', 15, 'Ask for Help', 'Independence is overrated.', 'Post asking for specific help, feedback, or advice on something.', 'brave'),
  ('accountability', 16, 'Celebrate Others', 'Abundance mindset.', 'Create a post celebrating or highlighting someone else''s work.', 'easy'),
  ('accountability', 17, 'Day in the Life', 'Let them see all of it.', 'Document and share your entire day. The mundane and the meaningful.', 'medium'),
  ('accountability', 18, 'Commitment Renewal', 'Recommit publicly.', 'Post about why you are still here. Renew your commitment for the final stretch.', 'medium'),
  ('accountability', 19, 'Honest Metrics Update', 'Numbers with context.', 'Share your growth over these 19 days. Be honest about what the numbers mean.', 'medium'),
  ('accountability', 20, 'Thank Your Community', 'Gratitude is content.', 'Post a genuine thank you to those who have supported you.', 'easy'),
  ('accountability', 21, 'Accountability Complete', 'You showed up.', 'Post your final reflection. What did 21 days of accountability teach you?', 'brave')
ON CONFLICT (track_id, day_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  action_prompt = EXCLUDED.action_prompt,
  difficulty = EXCLUDED.difficulty;

-- =============================================
-- PLATFORM PROMPTS (6 per platform = 36 total)
-- =============================================

-- INSTAGRAM PROMPTS
INSERT INTO public.platform_prompts (platform_id, prompt_number, title, prompt_text, example) VALUES
  ('instagram', 1, 'Story Poll', 'Create a Story with a poll asking your audience to choose between two options related to your niche.', 'This or That? Morning coffee ☕ or afternoon tea 🍵'),
  ('instagram', 2, 'Carousel Education', 'Create a carousel post teaching something valuable in 5-7 slides.', 'Swipe for 5 ways to overcome creative block →'),
  ('instagram', 3, 'Behind the Scenes Reel', 'Film a 15-30 second Reel showing your process or workspace.', 'POV: You''re watching me record my podcast 🎙️'),
  ('instagram', 4, 'Quote Card', 'Create a visually appealing quote graphic with your own words or insight.', 'Your visual should match your brand aesthetic'),
  ('instagram', 5, 'Day in My Life', 'Document your day through Stories with 5-8 moments.', 'Include the mundane and the meaningful'),
  ('instagram', 6, 'Authentic Selfie + Story', 'Post a selfie with a genuine caption about where you are in your journey.', 'No filters required. Real > Perfect.')
ON CONFLICT (platform_id, prompt_number) DO UPDATE SET
  title = EXCLUDED.title,
  prompt_text = EXCLUDED.prompt_text,
  example = EXCLUDED.example;

-- LINKEDIN PROMPTS
INSERT INTO public.platform_prompts (platform_id, prompt_number, title, prompt_text, example) VALUES
  ('linkedin', 1, 'Professional Lesson', 'Share a lesson learned from your career or industry. Use clear formatting.', 'Start with a hook. Use line breaks. End with a question.'),
  ('linkedin', 2, 'Hot Take', 'Share a contrarian opinion about your industry. Be bold but respectful.', 'Unpopular opinion: [Your stance] Here''s why...'),
  ('linkedin', 3, 'Celebration Post', 'Share a win or milestone. Make it relatable, not braggy.', 'Focus on the journey, not just the destination'),
  ('linkedin', 4, 'Story Format', 'Tell a story with a beginning, middle, and end. Include a lesson.', 'It was 2019. I had just been rejected for the 47th time...'),
  ('linkedin', 5, 'Resource Share', 'Share something valuable: tool, book, podcast, or insight.', 'Add your personal take on why it matters'),
  ('linkedin', 6, 'Ask for Input', 'Post a thoughtful question that invites professional discussion.', 'I''m curious: How do you handle [specific situation]?')
ON CONFLICT (platform_id, prompt_number) DO UPDATE SET
  title = EXCLUDED.title,
  prompt_text = EXCLUDED.prompt_text,
  example = EXCLUDED.example;

-- YOUTUBE PROMPTS
INSERT INTO public.platform_prompts (platform_id, prompt_number, title, prompt_text, example) VALUES
  ('youtube', 1, 'Community Post', 'Create a Community tab post with a poll or question.', 'What video topic should I cover next? A, B, or C?'),
  ('youtube', 2, 'Short Tutorial', 'Record a 30-60 second Short teaching one specific thing.', 'Quick tip format works great for Shorts'),
  ('youtube', 3, 'Talking Head Check-in', 'Film a simple video talking directly to camera about your journey.', 'No fancy editing needed. Authenticity wins.'),
  ('youtube', 4, 'Response Video', 'Create a video responding to a comment or common question.', 'This creates community and shows you listen'),
  ('youtube', 5, 'Behind the Scenes', 'Show your setup, process, or how you create content.', 'People love seeing how the sausage is made'),
  ('youtube', 6, 'List Video', 'Create a video with a numbered list: 5 tips, 7 mistakes, 3 tools.', 'Lists perform well and are easy to structure')
ON CONFLICT (platform_id, prompt_number) DO UPDATE SET
  title = EXCLUDED.title,
  prompt_text = EXCLUDED.prompt_text,
  example = EXCLUDED.example;

-- X (TWITTER) PROMPTS
INSERT INTO public.platform_prompts (platform_id, prompt_number, title, prompt_text, example) VALUES
  ('x', 1, 'Single Tweet Insight', 'Post one clear, valuable insight in under 280 characters.', 'The best tweets are complete thoughts, not teasers'),
  ('x', 2, 'Thread Starter', 'Start a thread with a hook, then deliver value across 5-7 tweets.', 'First tweet: Hook. Last tweet: Summary + CTA.'),
  ('x', 3, 'Quote Tweet Add', 'Quote tweet something relevant and add your unique perspective.', 'This → [Quote] My take: ...'),
  ('x', 4, 'Question Post', 'Ask a genuine question that sparks conversation.', 'Questions with two clear options get more replies'),
  ('x', 5, 'Personal Story Tweet', 'Share a brief personal story or moment that teaches something.', 'I once [thing]. Here''s what I learned:'),
  ('x', 6, 'Hot Take', 'Share a bold opinion. Be prepared for engagement.', 'Controversial (but thoughtful) takes spread')
ON CONFLICT (platform_id, prompt_number) DO UPDATE SET
  title = EXCLUDED.title,
  prompt_text = EXCLUDED.prompt_text,
  example = EXCLUDED.example;

-- TIKTOK PROMPTS
INSERT INTO public.platform_prompts (platform_id, prompt_number, title, prompt_text, example) VALUES
  ('tiktok', 1, 'Trending Sound', 'Use a trending sound to share your message in a familiar format.', 'Check Discover tab for trending sounds'),
  ('tiktok', 2, 'Talking to Camera', 'Record yourself talking directly to camera about your niche.', 'Start with a hook in the first 2 seconds'),
  ('tiktok', 3, 'Day in My Life', 'Show snippets of your day with voiceover or text.', 'Keep it real. Polished perfection does not work here.'),
  ('tiktok', 4, 'Duet or Stitch', 'Duet or Stitch someone else''s video with your response.', 'Add value, not just reaction'),
  ('tiktok', 5, 'Tutorial Quick', 'Teach something in under 60 seconds with clear visuals.', 'Show, don''t just tell'),
  ('tiktok', 6, 'Get Ready With Me', 'Film a GRWM while talking about your work or thoughts.', 'Casual format, valuable content')
ON CONFLICT (platform_id, prompt_number) DO UPDATE SET
  title = EXCLUDED.title,
  prompt_text = EXCLUDED.prompt_text,
  example = EXCLUDED.example;

-- FACEBOOK PROMPTS
INSERT INTO public.platform_prompts (platform_id, prompt_number, title, prompt_text, example) VALUES
  ('facebook', 1, 'Personal Update', 'Share a genuine life update with your network.', 'Facebook rewards authenticity over polish'),
  ('facebook', 2, 'Photo + Story', 'Post a photo with a meaningful story behind it.', 'The story matters more than the photo quality'),
  ('facebook', 3, 'Group Engagement', 'Find a relevant group and make a valuable contribution.', 'Answer questions, share insights, be helpful'),
  ('facebook', 4, 'Video Update', 'Record a short video update about what you are working on.', 'Native video gets more reach than links'),
  ('facebook', 5, 'Ask Your Network', 'Post a question to leverage your existing connections.', 'Your network wants to help. Let them.'),
  ('facebook', 6, 'Throwback + Lesson', 'Share a memory or old photo with a lesson learned.', 'Then vs Now posts perform well')
ON CONFLICT (platform_id, prompt_number) DO UPDATE SET
  title = EXCLUDED.title,
  prompt_text = EXCLUDED.prompt_text,
  example = EXCLUDED.example;
