import NextAuth, { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from "next-auth/providers/google";
import { redirect } from 'next/dist/server/api-utils';
import { checkUserEmailPassword, oAuthToDbUser } from '../../../database';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [

    Credentials({
      name: 'Custom Login',
      credentials :{
        email: {label: 'Correo:', type: 'email', placeholder: "example@example.com"},
        password: {label: 'Contraseña:', type: 'password', placeholder: "Contraseña"}
      },
      async authorize(credentials) {
        return await checkUserEmailPassword(credentials?.email, credentials?.password)
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages:{
    signIn: "/auth/login",
    newUser: "/auth/register"
  },

  session: {
    maxAge: 2592000,
    strategy: 'jwt',
    updateAge: 86400
  },

  callbacks: {

    async jwt({ token, account, user }){
      if(account){
        token.accessToken = account.access_token
        switch (account.type) {
          case "oauth":
            token.user = await oAuthToDbUser(user?.email || '', user?.name || '')
            break;

          case "credentials":
            token.user = user
            break;
        }
      }
  
      return token
    },  
  
    async session({ session, token, user }){
      
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session
    }
  }
}

export default NextAuth(authOptions);