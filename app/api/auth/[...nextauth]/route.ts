import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { corsair } from '@/corsair'
import ENV from '@/lib/config/ENV'
import {prisma} from "@/lib/config/prisma"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar',
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
  ],
  callbacks: {
    async signIn({ account, user }: any) {
      if (!user?.id) return false
      const tenant = corsair.withTenant(user.id)

      if (account?.access_token) {
        await tenant.gmail.keys.set_access_token(account.access_token)
        await tenant.googlecalendar.keys.set_access_token(account.access_token)
      }
      if (account?.refresh_token) {
        await tenant.gmail.keys.set_refresh_token(account.refresh_token)
        await tenant.googlecalendar.keys.set_refresh_token(account.refresh_token)
      }

      prisma.user.create({
        data:{
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.image
        }
      })

      return true
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }
