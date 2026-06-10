'use client'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <button onClick={() => signIn('google', { callbackUrl: '/inbox' })}>
      Continue with Google
    </button>
  )
}