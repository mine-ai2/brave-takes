'use client'

import { useState, useMemo } from 'react'
import type { Template } from '@/lib/types'
import Navigation from '@/components/Navigation'

interface Props {
  templates: Template[]
  platforms: string[]
  contentTypes: string[]
  tones: string[]
}

export default function TemplatesClient({
  templates,
  platforms,
  contentTypes,
  tones,
}: Props) {
  const [platform, setPlatform] = useState('')
  const [contentType, setContentType] = useState('')
  const [tone, setTone] = useState('')

  const filteredTemplates = useMemo(() => {
    let filtered = templates

    if (platform) {
      filtered = filtered.filter(t => t.platform === platform)
    }
    if (contentType) {
      filtered = filtered.filter(t => t.content_type === contentType)
    }
    if (tone) {
      filtered = filtered.filter(t => t.tone === tone)
    }

    // Shuffle and take 3
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }, [templates, platform, contentType, tone])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-md mx-auto p-4 pb-24">
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-amber-900">Templates</h1>
          <p className="text-amber-700 mt-1">Get inspired for your posts</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-amber-400 outline-none"
              >
                <option value="">All platforms</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-amber-400 outline-none"
              >
                <option value="">All types</option>
                {contentTypes.map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-amber-400 outline-none"
              >
                <option value="">All tones</option>
                {tones.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="space-y-4">
          {filteredTemplates.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-500">
              No templates found. Try different filters!
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex gap-2 mb-3">
                  {template.platform && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {template.platform}
                    </span>
                  )}
                  {template.content_type && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {template.content_type}
                    </span>
                  )}
                  {template.tone && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {template.tone}
                    </span>
                  )}
                </div>
                <p className="text-gray-800 mb-4">{template.text}</p>
                <button
                  onClick={() => copyToClipboard(template.text || '')}
                  className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium rounded-xl transition-colors"
                >
                  📋 Copy
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <Navigation current="templates" />
    </div>
  )
}
