import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import LoungeClient from './LoungeClient'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function LoungePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get lounge posts
  const { data: posts, error: postsError } = await supabase
    .from('lounge_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  
  if (postsError) {
    console.error('Error fetching posts:', postsError)
  }

  // Get unique user IDs from posts
  const userIds = [...new Set((posts || []).map(p => p.user_id))]
  
  // Get profiles for all post authors
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', userIds.length > 0 ? userIds : ['none'])

  const profileMap = new Map(
    (profiles || []).map(p => [p.id, p.display_name])
  )

  // Get user's likes
  const { data: userLikes } = await supabase
    .from('lounge_likes')
    .select('post_id')
    .eq('user_id', user.id)

  const userLikedPostIds = new Set(userLikes?.map(l => l.post_id) || [])

  // Transform posts with actual display names
  const transformedPosts = (posts || []).map(post => ({
    ...post,
    user_display_name: profileMap.get(post.user_id) || `Brave Creator`,
    user_has_liked: userLikedPostIds.has(post.id),
  }))

  // Get user's streak and profile for display
  const [{ data: streak }, { data: userProfile }] = await Promise.all([
    supabase
      .from('user_streaks')
      .select('current_streak')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()
  ])

  return (
    <>
      <LoungeClient 
        initialPosts={transformedPosts} 
        userId={user.id}
        userDisplayName={userProfile?.display_name || 'Brave Creator'}
        userStreak={streak?.current_streak || 0}
      />
      <Navigation current="lounge" />
    </>
  )
}
