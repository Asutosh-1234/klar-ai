'use client'
import { signOut } from 'next-auth/react'

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="px-4 py-2 rounded-full border border-white/20 text-on-surface-variant hover:text-white hover:bg-white/5 hover:border-white/30 transition-all duration-200 text-sm font-semibold cursor-pointer"
    >
      Sign Out
    </button>
  )
}
