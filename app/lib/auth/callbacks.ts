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