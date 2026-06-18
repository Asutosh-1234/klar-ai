'use client'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    // Use non-redirect signOut then navigate client-side to avoid issues with secure cookies/local dev
    try {
      await signOut({ redirect: false })
    } finally {
      router.push('/')
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 rounded-full border border-white/20 text-on-surface-variant hover:text-white hover:bg-white/5 hover:border-white/30 transition-all duration-200 text-sm font-semibold cursor-pointer"
    >
      Sign Out
    </button>
  )
}
