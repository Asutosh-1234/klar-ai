'use client'
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  return (
    <button onClick={() => signIn('google', { callbackUrl: '/inbox' })}>
      Continue with Google
    </button>
  )
}
