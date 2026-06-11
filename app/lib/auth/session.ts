// src/lib/auth/session.ts
import { getServerSession } from 'next-auth'
import { authProvider } from './config'
import type { NextRequest } from 'next/server'

export async function getSessionTenantId(request: NextRequest): Promise<string | null> {
  const session = await getServerSession(authProvider)
  if (!session?.user?.id) return null
  return `usr_${session.user.id}`
}