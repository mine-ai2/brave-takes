'use client'

import { useState } from 'react'
import { POST_TYPES, POST_FRAMEWORKS, STEP_MICROCOPY, PostType } from '@/lib/session-types'

interface Props {
  initialPostType?: PostType
  initialFramework?: string
  initialDraft?: string
  selectedAction?: string
  onComplete: (postType: PostType, framework: string, draft: string) => void
}

export default function RepBuilderStep({
  initialPostType,
  initialFramework,
  initialDraft,
  selectedAction,
  onComplete,
}: Props) {
  const [step, setStep] = useState<'type' | 'framework' | 'expand'>(
    initialPostType ? (initialFramework ? 'expand' : 'framework') : 'type'
  )
  const [postType, setPostType] = useState<PostType | undefined>(initialPostType)
  const [framework, setFramework] = useState(initialFramework || '')
  const [draft, setDraft] = useState(initialDraft || '')
  const [charCount, setCharCount] = useState(initialDraft?.length || 0)

  const handleTypeSelect = (type: PostType) => {
    setPostType(type)
    setStep('framework')
  }

  const handleFrameworkSelect = (fw: string) => {
    setFramework(fw)
    // Pre-fill draft with framework and action if available
    const starter = selectedAction 
      ? fw.replace('[thought]', selectedAction)
           .replace('[opinion]', selectedAction)
           .replace('[tip]', selectedAction)
      : fw
    setDraft(starter)
    setCharCount(starter.length)
    setStep('expand')
  }

  const handleDraftChange = (text: string) => {
    setDraft(text)
    setCharCount(text.length)
  }

  const handleComplete = () => {
    if (postType && framework) {
      onComplete(postType, framework, draft)
    }
  }

  const handleSave = () => {
    // For now, just complete - could add save to drafts functionality
    handleComplete()
  }

  const selectedTypeData = POST_TYPES.find(t => t.id === postType)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-2">Build Your Rep</h2>
        <p className="text-amber-700">{STEP_MICROCOPY.repbuilder}</p>
      </div>

      {/* Show selected action reminder */}
      {selectedAction && (
        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-sm text-amber-700">
            <span className="font-medium">Today's action:</span> {selectedAction}
          </p>
        </div>
      )}

      {step === 'type' && (
        <div className="space-y-3">
          <p className="text-gray-600 text-center mb-4">What kind of post feels right?</p>
          <div className="grid grid-cols-2 gap-3">
            {POST_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <span className="text-3xl">{type.icon}</span>
                <span className="font-medium text-gray-800">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'framework' && postType && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{selectedTypeData?.icon}</span>
            <span className="font-semibold text-gray-800">{selectedTypeData?.label}</span>
          </div>

          <p className="text-gray-600">Pick a framework to get started:</p>
          
          <div className="space-y-3">
            {POST_FRAMEWORKS[postType].map((fw, i) => (
              <button
                key={i}
                onClick={() => handleFrameworkSelect(fw)}
                className="w-full p-4 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-amber-50 transition-all text-left text-gray-700"
              >
                {fw}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep('type')}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
          >
            ← Change post type
          </button>
        </div>
      )}

      {step === 'expand' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{selectedTypeData?.icon}</span>
            <span className="font-semibold text-gray-800">{selectedTypeData?.label}</span>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4">
            <textarea
              value={draft}
              onChange={(e) => handleDraftChange(e.target.value)}
              placeholder="Expand on your idea..."
              className="w-full h-48 p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none resize-none text-gray-800"
            />
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-400">{charCount} characters</span>
              <span className={`${charCount > 280 ? 'text-orange-500' : 'text-gray-400'}`}>
                {charCount <= 280 ? 'Twitter-ready ✓' : 'May need trimming for Twitter'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setStep('framework')}
              className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
            >
              ← Try another
            </button>
            <button
              onClick={handleSave}
              className="py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
            >
              Save Draft
            </button>
          </div>

          <button
            onClick={handleComplete}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            ✓ Ready to Record
          </button>

          <button
            onClick={handleComplete}
            className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            Skip recording →
          </button>
        </div>
      )}
    </div>
  )
}
