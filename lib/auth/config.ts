import GoogleProvider from "next-auth/providers/google"
import ENV from "../config/ENV"
import { handleSignIn, handleJwt, handleSession } from "./callbacks"


export const authProvider = {
  secret: ENV.NEXTAUTH_SECRET,
  useSecureCookies: true,
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    state: {
      name: "next-auth.state",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
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
    signIn: handleSignIn,
    jwt: handleJwt,
    session: handleSession
  }
}