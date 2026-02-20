'use client'

import Link from 'next/link'

interface Props {
  current: 'today' | 'templates' | 'progress' | 'settings'
}

const navItems = [
  { id: 'today', label: 'Today', icon: '📅', href: '/today' },
  { id: 'templates', label: 'Templates', icon: '📝', href: '/templates' },
  { id: 'progress', label: 'Progress', icon: '📊', href: '/progress' },
  { id: 'settings', label: 'Settings', icon: '⚙️', href: '/settings' },
]

export default function Navigation({ current }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto flex justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              current === item.id
                ? 'text-amber-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
