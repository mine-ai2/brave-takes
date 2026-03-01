import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import LoungeClient from './LoungeClient'

export default async function LoungePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get lounge posts with user likes
  const { data: posts } = await supabase
    .from('lounge_posts')
    .select(`
      *,
      profiles:user_id (
        id
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  // Get user's likes
  const { data: userLikes } = await supabase
    .from('lounge_likes')
    .select('post_id')
    .eq('user_id', user.id)

  const userLikedPostIds = new Set(userLikes?.map(l => l.post_id) || [])

  // Transform posts
  const transformedPosts = (posts || []).map(post => ({
    ...post,
    user_display_name: `Brave Creator ${post.user_id.slice(0, 4)}`,
    user_has_liked: userLikedPostIds.has(post.id),
  }))

  // Get user's streak for display
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('current_streak')
    .eq('user_id', user.id)
    .single()

  return (
    <>
      <LoungeClient 
        initialPosts={transformedPosts} 
        userId={user.id}
        userStreak={streak?.current_streak || 0}
      />
      <Navigation current="lounge" />
    </>
  )
}
