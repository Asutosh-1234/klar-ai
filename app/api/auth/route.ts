import { processOAuthCallback } from 'corsair/oauth'
import { NextRequest, NextResponse } from 'next/server'
import { corsair } from '@/corsair'
import ENV from '@/app/lib/config/ENV'


const REDIRECT_URI = `${ENV.NEXTAUTH_URL}/api/auth`

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  if (!code || !state) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 })
  }

  try {
    const result = await processOAuthCallback(corsair, {
      code,
      state,
      redirectUri: REDIRECT_URI,
    })

    return NextResponse.redirect(new URL('/connect', request.url))
  } catch (err) {
    console.error('OAuth callback failed:', err)
    return NextResponse.redirect(new URL('/connect?error=oauth_failed', request.url))
  }
}