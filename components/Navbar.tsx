'use client'
import { signIn } from 'next-auth/react'
import { Button, buttonVariants } from "@/components/ui/button"

import { NavbarProps } from "@/app/lib/types";

export function Navbar({ session }: NavbarProps) {
  const handleAuth = (e: React.MouseEvent) => {
    e.preventDefault()
    signIn('google', { callbackUrl: '/connect' })
  }

  const isLoggedIn = !!session?.user;

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-container-max mx-auto px-gutter h-20 flex items-center justify-between">
        <div className="font-headline-md text-headline-md font-bold text-on-background tracking-tighter">
          Klar AI
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Product</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Features</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Pricing</a>
          {isLoggedIn && (
            <>
              <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="/connect">Dashboard</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-semibold" href="/gmail">Inbox</a>
            </>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {isLoggedIn ? (
            <a 
              href="/connect"
              className={buttonVariants({
                variant: "default",
                className: "h-9 px-6 rounded-full bg-primary-container text-white font-semibold hover:scale-95 transition-transform duration-200 glow-button cursor-pointer text-center flex items-center justify-center border-0 hover:bg-primary-container/90"
              })}
            >
              Go to Dashboard
            </a>
          ) : (
            <>
              <Button 
                variant="ghost"
                onClick={handleAuth}
                className="hidden md:flex text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer bg-transparent border-0 hover:bg-transparent px-3 py-1 font-semibold"
              >
                Login
              </Button>
              <Button 
                onClick={handleAuth}
                className="h-9 px-6 rounded-full bg-primary-container text-white font-semibold hover:scale-95 transition-transform duration-200 glow-button cursor-pointer border-0 hover:bg-primary-container/90"
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
