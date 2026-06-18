// proxy.ts (in root, same level as package.json)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/index' || pathname.startsWith('/index/')) {
    const sessionCookie =
      req.cookies.get('next-auth.session-token') ||
      req.cookies.get('__Secure-next-auth.session-token')

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}