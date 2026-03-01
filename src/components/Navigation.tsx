'use client'

import Link from 'next/link'

interface Props {
  current: 'today' | 'lounge' | 'progress' | 'settings'
}

const navItems = [
  { id: 'today', label: 'Today', icon: '🎯', href: '/today' },
  { id: 'lounge', label: 'Lounge', icon: '💬', href: '/lounge' },
  { id: 'progress', label: 'Progress', icon: '📊', href: '/progress' },
  { id: 'settings', label: 'Settings', icon: '⚙️', href: '/settings' },
]

export default function Navigation({ current }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-lg">
      <div className="max-w-md mx-auto flex justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
              current === item.id
                ? 'text-rose-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className={`text-xl ${current === item.id ? 'scale-110' : ''} transition-transform`}>
              {item.icon}
            </span>
            <span className={`text-xs mt-1 font-medium ${current === item.id ? 'text-rose-600' : ''}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
