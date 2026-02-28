import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe Auth.js configuration (no Node.js-only imports).
 *
 * This file is imported by BOTH:
 *  - middleware.ts  (Edge runtime — no `crypto`, no `mongodb`)
 *  - auth.ts        (Node runtime — adds MongoDBAdapter on top)
 *
 * Keep this file free of any Node.js modules (mongodb, mongoose, etc.).
 */
const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * Runs on every middleware-matched request.
     * Returns true to allow, or redirects to /login.
     */
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isProtected = nextUrl.pathname.startsWith("/dashboard");

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },

    /** Attach the user id to the JWT */
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },

    /** Expose user id on the client-side session */
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export default authConfig;
