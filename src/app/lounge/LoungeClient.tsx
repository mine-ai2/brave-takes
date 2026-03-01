'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { LoungePost } from '@/lib/types'

type PostType = 'general' | 'win' | 'question' | 'support'

interface Props {
  initialPosts: LoungePost[]
  userId: string
  userStreak: number
}

const POST_TYPES: { id: PostType; label: string; emoji: string }[] = [
  { id: 'general', label: 'Share', emoji: '💬' },
  { id: 'win', label: 'Win', emoji: '🏆' },
  { id: 'question', label: 'Ask', emoji: '❓' },
  { id: 'support', label: 'Support', emoji: '💪' },
]

export default function LoungeClient({ initialPosts, userId, userStreak }: Props) {
  const router = useRouter()
  const supabase = createClient()
  
  const [posts, setPosts] = useState<LoungePost[]>(initialPosts)
  const [newPost, setNewPost] = useState('')
  const [postType, setPostType] = useState<PostType>('general')
  const [isComposing, setIsComposing] = useState(false)
  const [posting, setPosting] = useState(false)
  const [filter, setFilter] = useState<PostType | 'all'>('all')

  const handleSubmitPost = async () => {
    if (!newPost.trim()) return
    
    setPosting(true)
    
    const { data, error } = await supabase
      .from('lounge_posts')
      .insert({
        user_id: userId,
        content: newPost.trim(),
        post_type: postType,
      })
      .select()
      .single()

    if (error) {
      console.error('Error posting:', error)
      setPosting(false)
      return
    }

    // Add to local state
    setPosts([{
      ...data,
      user_display_name: `Brave Creator ${userId.slice(0, 4)}`,
      user_has_liked: false,
    }, ...posts])
    
    setNewPost('')
    setIsComposing(false)
    setPosting(false)
  }

  const handleLike = async (postId: string, hasLiked: boolean) => {
    if (hasLiked) {
      // Unlike
      await supabase
        .from('lounge_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
      
      // Update likes count
      await supabase
        .from('lounge_posts')
        .update({ likes_count: posts.find(p => p.id === postId)!.likes_count - 1 })
        .eq('id', postId)
    } else {
      // Like
      await supabase
        .from('lounge_likes')
        .insert({ post_id: postId, user_id: userId })
      
      // Update likes count
      await supabase
        .from('lounge_posts')
        .update({ likes_count: posts.find(p => p.id === postId)!.likes_count + 1 })
        .eq('id', postId)
    }

    // Update local state
    setPosts(posts.map(p => 
      p.id === postId 
        ? { 
            ...p, 
            user_has_liked: !hasLiked, 
            likes_count: hasLiked ? p.likes_count - 1 : p.likes_count + 1 
          }
        : p
    ))
  }

  const getPostTypeEmoji = (type: PostType) => {
    return POST_TYPES.find(t => t.id === type)?.emoji || '💬'
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(p => p.post_type === filter)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">The Lounge</h1>
          <p className="text-slate-500">Where brave creators hang out</p>
          {userStreak > 0 && (
            <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm mt-3">
              🔥 {userStreak} day streak
            </div>
          )}
        </div>

        {/* Compose Button / Form */}
        {!isComposing ? (
          <button
            onClick={() => setIsComposing(true)}
            className="w-full bg-white rounded-2xl shadow-lg p-4 mb-6 border border-slate-100 text-left text-slate-400 hover:border-slate-200 transition-all"
          >
            Share something with the community...
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-slate-100">
            {/* Post Type Selector */}
            <div className="flex gap-2 mb-4">
              {POST_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setPostType(type.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                    postType === type.id
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type.emoji} {type.label}
                </button>
              ))}
            </div>

            {/* Text Area */}
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={
                postType === 'win' ? "Share your win! What brave thing did you do?" :
                postType === 'question' ? "What do you want to ask the community?" :
                postType === 'support' ? "What support or encouragement can you offer?" :
                "What's on your mind?"
              }
              className="w-full p-3 border border-slate-200 rounded-xl resize-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-700"
              rows={4}
              autoFocus
            />

            {/* Actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setIsComposing(false)
                  setNewPost('')
                }}
                className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-500 font-medium rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPost}
                disabled={!newPost.trim() || posting}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            All
          </button>
          {POST_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setFilter(type.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === type.id
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {type.emoji} {type.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-slate-100">
              <div className="text-4xl mb-3">🦁</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                No posts yet
              </h3>
              <p className="text-slate-500 text-sm">
                Be the first to share something brave!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg p-4 border border-slate-100">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {post.user_display_name?.charAt(0) || 'B'}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700">
                        {post.user_display_name}
                      </span>
                      <span className="text-slate-400 text-xs ml-2">
                        {getTimeAgo(post.created_at)}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg">
                    {getPostTypeEmoji(post.post_type)}
                  </span>
                </div>

                {/* Post Content */}
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Post Actions */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleLike(post.id, post.user_has_liked || false)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-all ${
                      post.user_has_liked
                        ? 'text-rose-500'
                        : 'text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <span>{post.user_has_liked ? '❤️' : '🤍'}</span>
                    <span>{post.likes_count || 0}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
