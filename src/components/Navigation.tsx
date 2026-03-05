'use client'

import Link from 'next/link'
import { BRAND } from '@/lib/brand'

interface Props {
  current: 'today' | 'vault' | 'lounge' | 'progress' | 'settings'
}

const navItems = [
  { id: 'today', label: 'Today', icon: '🎯', href: '/today' },
  { id: 'vault', label: 'Vault', icon: '💡', href: '/vault' },
  { id: 'lounge', label: 'Lounge', icon: '💬', href: '/lounge' },
  { id: 'progress', label: 'Progress', icon: '📊', href: '/progress' },
  { id: 'settings', label: 'Settings', icon: '⚙️', href: '/settings' },
]

export default function Navigation({ current }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 shadow-lg">
      <div className="max-w-md mx-auto flex justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex flex-col items-center py-2 px-4 rounded-xl transition-all"
            style={{ 
              color: current === item.id ? BRAND.colors.deepPurple : '#94a3b8'
            }}
          >
            <span className={`text-xl ${current === item.id ? 'scale-110' : ''} transition-transform`}>
              {item.icon}
            </span>
            <span className="text-xs mt-1 font-medium">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
