import { corsair } from "@/corsair"
import { prisma } from '../config/prisma'
import ENV from "../config/ENV"

export async function handleSignIn({ account, user }: any) {
  if (!user?.id) return false

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!existingUser) {
      // New user registration, trigger welcome email asynchronously
      fetch(`${ENV.NEXTAUTH_URL}/api/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.name,
          userAvatar: user.image,
        }),
      }).then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          console.error(`Welcome email API returned status ${res.status}: ${errText}`);
        }
      }).catch(err => {
        console.error('Failed to send welcome email:', err);
      });
    }
  } catch (error) {
    console.error('Error in registration check/welcome email:', error);
  }

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