import NextAuth from 'next-auth'
import { authProvider } from './config'

export const { auth, handlers, signIn, signOut } = NextAuth(authProvider)