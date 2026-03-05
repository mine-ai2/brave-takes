// Brave Takes Brand Colors
export const BRAND = {
  colors: {
    deepPurple: '#5B21B6',
    magenta: '#A855F7',
    teal: '#14B8A6',
    gold: '#D4A574',
    navy: '#1E3A5F',
    lavender: '#E9D5FF',
    lightBg: 'from-white via-purple-50/30 to-purple-100/40',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #5B21B6, #A855F7)',
    button: 'linear-gradient(to right, #5B21B6, #A855F7)',
    gold: 'linear-gradient(135deg, #D4A574, #E9D5FF)',
  },
} as const

// CSS class helpers for Tailwind
export const brandClasses = {
  // Backgrounds
  pageBg: 'bg-gradient-to-b from-white via-purple-50/30 to-purple-100/40',
  cardBg: 'bg-white',
  
  // Text
  heading: 'text-[#5B21B6]',
  subtext: 'text-slate-600',
  accent: 'text-[#D4A574]',
  
  // Buttons (use style prop for gradients)
  buttonPrimary: 'text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all',
  buttonSecondary: 'border-2 border-[#5B21B6] text-[#5B21B6] font-medium rounded-xl hover:bg-purple-50 transition-all',
}
