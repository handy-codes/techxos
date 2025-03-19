// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  theme: {
    colorScheme: "light",
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);