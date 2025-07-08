import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const customToken = jwt.sign(
          {
            userId: profile.sub || profile.id,
            email: profile.email,
            name: profile.name,
            roleId: 3, // or dynamic role from DB
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        token.customToken = customToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.customToken = token.customToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
