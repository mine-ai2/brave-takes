'use client'

import { SESSION_STEPS, STEP_TITLES, SessionStep } from '@/lib/session-types'

interface Props {
  currentStep: SessionStep
  completedSteps: SessionStep[]
}

export default function SessionProgress({ currentStep, completedSteps }: Props) {
  const currentIndex = SESSION_STEPS.indexOf(currentStep)
  const progressPercent = (currentIndex / (SESSION_STEPS.length - 1)) * 100

  return (
    <div className="mb-6">
      {/* Step indicator */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-amber-700">
          {STEP_TITLES[currentStep]}
        </span>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {SESSION_STEPS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-2">
        {SESSION_STEPS.map((step, i) => {
          const isCompleted = completedSteps.includes(step)
          const isCurrent = step === currentStep
          
          return (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-all ${
                isCompleted
                  ? 'bg-amber-500'
                  : isCurrent
                  ? 'bg-amber-400 ring-2 ring-amber-200'
                  : 'bg-gray-300'
              }`}
              title={STEP_TITLES[step]}
            />
          )
        })}
      </div>
    </div>
  )
}
