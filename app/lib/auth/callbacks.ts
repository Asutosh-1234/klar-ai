import { corsair } from "@/corsair"
import { prisma } from '../config/prisma'

export async function handleSignIn({ account, user }: any) {
  if (!user?.id) return false

  // Save to DB
  await prisma.user.upsert({
    where: { email: user.email },
    update: { name: user.name, avatar: user.image },
    create: { id: user.id, email: user.email, name: user.name, avatar: user.image }
  })

  // Store tokens in Corsair
  const tenant = corsair.withTenant(user.id)
  if (account?.access_token) {
    await tenant.gmail.keys.set_access_token(account.access_token)
    await tenant.googlecalendar.keys.set_access_token(account.access_token)
  }
  if (account?.refresh_token) {
    await tenant.gmail.keys.set_refresh_token(account.refresh_token)
    await tenant.googlecalendar.keys.set_refresh_token(account.refresh_token)
  }

  return true
}

export async function handleJwt({ token, user }: any) {
  if (user) token.id = user.id
  return token
}

export async function handleSession({ session, token }: any) {
  if (session?.user) session.user.id = token.id
  return session
}