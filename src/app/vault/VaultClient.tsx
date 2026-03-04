'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { VaultItem } from './page'

type Category = 'hooks' | 'characters' | 'commercials' | 'captions'

interface Props {
  initialItems: VaultItem[]
  userId: string
}

// All examples - we'll rotate through these daily
const ALL_EXAMPLES: Record<Category, string[]> = {
  hooks: [
    '"They said I couldn\'t do it. They were almost right."',
    '"What if I told you everything you know about [X] is wrong?"',
    '"Three seconds. That\'s all you get to make them care."',
    '"I used to think voice acting was just talking. Then I learned..."',
    '"Stop scrolling. This one\'s for you."',
    '"The secret nobody tells beginners..."',
    '"I made every mistake so you don\'t have to."',
    '"This changed everything for me."',
    '"Here\'s what 100 auditions taught me..."',
    '"The one thing holding you back isn\'t talent."',
    '"Plot twist: The rejection was the best thing that happened."',
    '"What I wish I knew before my first booking..."',
  ],
  characters: [
    'Wise grandpa who gives advice through cooking metaphors',
    'Overenthusiastic GPS that takes your life choices personally',
    'Tired medieval narrator who\'s seen too many quests',
    'Luxury brand spokesperson for mundane items (toilet paper, socks)',
    'Conspiracy theorist weather reporter',
    'Dramatic movie trailer voice for everyday activities',
    'Sarcastic AI assistant who\'s done with humans',
    'Cheerful pirate reading bedtime stories',
    'Grumpy cat food critic',
    'Overly calm crisis hotline for minor inconveniences',
    'Southern grandma explaining technology',
    'Noir detective narrating a trip to the grocery store',
  ],
  commercials: [
    'Car commercial but whispered like a bedtime story',
    'Fast food ad in documentary narrator style',
    'Insurance commercial as an epic movie trailer',
    'Tech product launch but make it cozy and intimate',
    'Luxury perfume ad but for coffee',
    'Action movie trailer for a vacuum cleaner',
    'Meditation app but it\'s for pizza delivery',
    'Sports energy drink but make it ASMR',
    'Real estate listing as a horror movie trailer',
    'Dating app promo in nature documentary style',
    'Bank commercial as a children\'s story',
    'Gym membership ad but noir detective style',
  ],
  captions: [
    'POV: You finally nail that character voice after 47 takes',
    'The mic doesn\'t lie. Neither does the playback. 😅',
    'Day [X] of showing up for my voice. Small steps, big dreams.',
    'Behind every smooth read is a pile of outtakes and cold coffee.',
    'My neighbors definitely think I\'m unhinged.',
    'Plot twist: The "bad take" was actually the keeper.',
    'Booth hair, don\'t care.',
    'Me vs. my voice vs. impostor syndrome. Daily battle.',
    'Recording in a closet hits different at 2am.',
    'When the director says "one more take" for the 15th time...',
    'Just talked to myself professionally for 3 hours. Living the dream.',
    'The audition I almost didn\'t send? Booked it.',
  ],
}

const CATEGORIES: { id: Category; label: string; emoji: string; placeholder: string }[] = [
  { id: 'hooks', label: 'Hooks', emoji: '🎣', placeholder: 'A great opening line or hook...' },
  { id: 'characters', label: 'Characters', emoji: '🎭', placeholder: 'A character voice idea...' },
  { id: 'commercials', label: 'Commercials', emoji: '📺', placeholder: 'A commercial concept...' },
  { id: 'captions', label: 'Captions', emoji: '✍️', placeholder: 'A caption draft...' },
]

// Get today's examples - rotates daily
function getDailyExamples(category: Category, count: number = 4): string[] {
  const allExamples = ALL_EXAMPLES[category]
  const today = new Date()
  // Use day of year as seed so examples change daily
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  
  // Shuffle based on day
  const shuffled = [...allExamples]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (dayOfYear + i * 7) % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled.slice(0, count)
}

export default function VaultClient({ initialItems, userId }: Props) {
  const supabase = createClient()
  
  const [items, setItems] = useState<VaultItem[]>(initialItems)
  const [activeCategory, setActiveCategory] = useState<Category>('hooks')
  const [newContent, setNewContent] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  const filteredItems = items.filter(item => item.category === activeCategory)
  const activeConfig = CATEGORIES.find(c => c.id === activeCategory)!
  
  // Get today's rotating examples for the active category
  const dailyExamples = useMemo(() => getDailyExamples(activeCategory, 4), [activeCategory])

  const handleAdd = async () => {
    if (!newContent.trim()) return
    
    setSaving(true)
    
    const { data, error } = await supabase
      .from('vault_items')
      .insert({
        user_id: userId,
        category: activeCategory,
        content: newContent.trim(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding item:', error)
      alert('Error saving: ' + error.message)
      setSaving(false)
      return
    }

    setItems([data, ...items])
    setNewContent('')
    setIsAdding(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this idea?')) return
    
    const { error } = await supabase
      .from('vault_items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting:', error)
      return
    }

    setItems(items.filter(item => item.id !== id))
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return `${Math.floor(seconds / 604800)}w ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Idea Vault</h1>
          <p className="text-slate-500">Capture your creative sparks</p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id)
                setIsAdding(false)
                setNewContent('')
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === cat.id
                  ? 'bg-white/20'
                  : 'bg-slate-100'
              }`}>
                {items.filter(i => i.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Add Button / Form */}
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full bg-white rounded-2xl shadow-lg p-4 mb-6 border border-slate-100 text-left text-slate-400 hover:border-rose-200 hover:shadow-rose-100 transition-all flex items-center gap-3"
          >
            <span className="w-10 h-10 bg-gradient-to-br from-rose-100 to-orange-100 rounded-xl flex items-center justify-center text-xl">
              {activeConfig.emoji}
            </span>
            <span>Add a new {activeConfig.label.toLowerCase().slice(0, -1)}...</span>
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-rose-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{activeConfig.emoji}</span>
              <span className="font-medium text-slate-700">New {activeConfig.label.slice(0, -1)}</span>
            </div>
            
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={activeConfig.placeholder}
              className="w-full p-3 border border-slate-200 rounded-xl resize-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-700"
              rows={4}
              autoFocus
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewContent('')
                }}
                className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-500 font-medium rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!newContent.trim() || saving}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 text-center">
              <div className="text-4xl mb-2">{activeConfig.emoji}</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                No {activeConfig.label.toLowerCase()} yet
              </h3>
              <p className="text-slate-500 text-sm">
                Check out the ideas below for inspiration!
              </p>
            </div>
          )}
          
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg p-4 border border-slate-100 group">
              <div className="flex justify-between items-start gap-3">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap flex-1">
                  {item.content}
                </p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {getTimeAgo(item.created_at)}
              </p>
            </div>
          ))}
        </div>

        {/* Inspiration Section - ALWAYS visible */}
        <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💡</span>
            <h3 className="font-semibold text-slate-700">Need inspiration?</h3>
          </div>
          
          <div className="space-y-2">
            {dailyExamples.map((example, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setNewContent(example)
                  setIsAdding(true)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="w-full p-3 bg-white/70 rounded-xl text-left text-sm text-slate-600 hover:bg-white hover:text-slate-800 transition-all border border-transparent hover:border-amber-200 hover:shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">+</span>
                  <span className="italic">{example}</span>
                </div>
              </button>
            ))}
          </div>
          
          <p className="text-xs text-amber-600/70 mt-3 text-center">
            Tap any idea to add it to your vault
          </p>
        </div>

        {/* Stats */}
        {items.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              {items.length} idea{items.length !== 1 ? 's' : ''} saved in your vault
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
