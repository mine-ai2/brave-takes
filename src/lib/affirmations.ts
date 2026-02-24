// Affirmations data by category - Carrie's voice
export const affirmations = {
  checkin: [
    "This is practice, not performance.",
    "I'm safe to be seen.",
    "My nervous system is just doing its job.",
    "Anxiety is excitement without breath.",
    "I don't have to feel ready to start.",
    "Today I show up messy.",
    "Fear means I'm at my edge. Good.",
    "I can be scared and do it anyway.",
  ],
  goal: [
    "Today I move with intention, not pressure.",
    "Small bold moves still count.",
    "I don't need to be impressive. I need to be useful.",
    "My voice matters to someone today.",
    "Progress isn't always visible. I trust it anyway.",
    "I'm building something only I can build.",
    "One rep closer to the version of me I'm becoming.",
  ],
  reset: [
    "Breathe. Your talent is still here.",
    "You're safe. This is just a rep.",
    "Pause is not the same as quit.",
    "This feeling will pass. My work will remain.",
    "I'm allowed to rest without earning it.",
    "My creativity needs space, not pressure.",
    "Stillness is part of the work.",
  ],
  complete: [
    "You did it anyway. That's the whole game.",
    "Another rep in the bank.",
    "The hardest part was starting. Look at you now.",
    "Your future self is grateful.",
    "Momentum is built one day at a time.",
    "You just proved your fears wrong.",
    "This is what consistency looks like.",
  ],
  progress: [
    "Visibility is part of the job.",
    "I'm allowed to take up space.",
    "Someone needs what only I can offer.",
    "Growth isn't always comfortable.",
    "I'm not behind. I'm on my path.",
    "Compare less. Create more.",
    "The only way out is through.",
  ],
} as const;

export type AffirmationCategory = keyof typeof affirmations;

export function getRandomAffirmation(category: AffirmationCategory): string {
  const categoryAffirmations = affirmations[category];
  return categoryAffirmations[Math.floor(Math.random() * categoryAffirmations.length)];
}

export function shuffleAffirmation(category: AffirmationCategory, current: string): string {
  const categoryAffirmations = affirmations[category];
  const others = categoryAffirmations.filter(a => a !== current);
  if (others.length === 0) return current;
  return others[Math.floor(Math.random() * others.length)];
}
