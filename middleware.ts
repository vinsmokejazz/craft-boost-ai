import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

/**
 * Protect /dashboard (and all sub-routes).
 * Unauthenticated users are redirected to the custom /login page
 * (configured via `pages.signIn` in auth.config.ts).
 */
export const config = {
  matcher: ["/dashboard/:path*"],
};
