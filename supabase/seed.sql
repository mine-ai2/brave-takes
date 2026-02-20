-- Brave Takes Seed Data
-- Run this after schema.sql

-- 14-Day Ladder
insert into public.reps (id, ladder_name, day_number, title, rep_main, rep_easier) values
('day01','mvp14',1,'Draft only','Write a 1-sentence post. Save it. Do not post.','Write 5 words only.'),
('day02','mvp14',2,'Story post','Post a Story: photo + 5 words.','Take photo only.'),
('day03','mvp14',3,'Comment reps','Leave 3 genuine comments.','Leave 1 comment.'),
('day04','mvp14',4,'BTS post','Post mic setup + one line.','Write the line only.'),
('day05','mvp14',5,'Value tip','Share 1 helpful tip.','Write tip only.'),
('day06','mvp14',6,'Identity post','If you need ___ voice, I''m your gal.','Write identity sentence.'),
('day07','mvp14',7,'Tiny CTA','Comment DEMO and I''ll DM you.','Write CTA only.'),
('day08','mvp14',8,'No-check','Post and avoid checking for 1 hour.','Set 30-min timer.'),
('day09','mvp14',9,'2-line story','Post what you used to think vs now.','Write both lines.'),
('day10','mvp14',10,'Demo share','Share demo + description.','Select demo only.'),
('day11','mvp14',11,'Warm DM','DM 1 warm contact.','Draft message only.'),
('day12','mvp14',12,'Question post','Ask audience a question.','Write question only.'),
('day13','mvp14',13,'Micro pitch','If your brand needs ___ vibe, DM me.','Draft pitch only.'),
('day14','mvp14',14,'Bravery win','Share a win + lesson.','Write win only.');

-- Sample Templates
insert into public.templates (platform, content_type, tone, text) values
('Instagram', 'Story', 'Casual', 'Behind the mic today working on [project type]. What are you creating? 🎙️'),
('Instagram', 'Story', 'Professional', 'Studio session in progress. New [commercial/narration/character] work coming soon.'),
('Instagram', 'Post', 'Casual', 'Plot twist: I talk to myself for a living and people pay me for it. 🎙️ #voiceover'),
('Instagram', 'Post', 'Inspirational', 'Every audition is practice. Every booking is a bonus. Keep showing up.'),
('LinkedIn', 'Post', 'Professional', 'Excited to share that I recently completed [project] for [client type]. Voice acting continues to challenge and fulfill me in equal measure.'),
('LinkedIn', 'Post', 'Thought Leadership', 'What I''ve learned after [X] years in voiceover: The best voice actors aren''t the ones with perfect voices. They''re the ones who show up consistently.'),
('Twitter', 'Tweet', 'Casual', 'me: *records 47 takes* also me: "the first one was better" 🙃 #voiceover'),
('Twitter', 'Tweet', 'Promotional', 'Need a [warm/energetic/calm] voice for your next project? My DMs are open. 🎙️'),
('Facebook', 'Post', 'Personal', 'Sometimes I forget that talking into a microphone in my closet is actually my job. Living the dream! 🎙️'),
('Facebook', 'Post', 'Promotional', 'Looking for a voice that [specific quality]? I''d love to help bring your project to life. Send me a message!'),
('TikTok', 'Caption', 'Casual', 'POV: You''re a voice actor and someone asks you to "do a voice" at a party'),
('TikTok', 'Caption', 'Educational', 'Things I wish I knew before starting voiceover 👇'),
('Instagram', 'Reel', 'Behind the Scenes', 'A day in the life of a voice actor (it''s not as glamorous as you think 😂)'),
('Instagram', 'Reel', 'Educational', '3 tips for aspiring voice actors from someone who''s been there'),
('LinkedIn', 'Comment', 'Supportive', 'Congratulations! This is such an inspiring journey. Wishing you continued success!'),
('Instagram', 'Comment', 'Engaging', 'This is so relatable! I experience this all the time. What helps you push through?');
