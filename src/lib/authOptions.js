// src/lib/authOptions.js
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/auth";
import jwt from "jsonwebtoken";


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  callbacks: {
    async jwt({ token, account, profile }) {
      try {
        if (account && profile) {
          await connectToDatabase();

          const email = profile.email;
          const provider = account.provider;
          const providerId = account.providerAccountId;

          let user = await User.findOne({ email });

          if (!user) {
            // 👤 New user
            user = await User.create({
              name: profile.name,
              email,
              password: "", // empty for social login
              provider,
              providers: [provider],
              identities: [
                {
                  provider,
                  providerId,
                  email,
                },
              ],
              image: profile.picture || profile.avatar_url || null,
            });
          } else {
            // 👤 Existing user
            let updated = false;

            // Ensure providers array exists
            if (!Array.isArray(user.providers)) {
              user.providers = [];
              updated = true;
            }

            if (!user.providers.includes(provider)) {
              user.providers.push(provider);
              updated = true;
            }

            // Ensure identities array exists
            if (!Array.isArray(user.identities)) {
              user.identities = [];
              updated = true;
            }

            const identityExists = user.identities.some(
              (id) =>
                id.provider === provider && id.providerId === providerId
            );

            if (!identityExists) {
              user.identities.push({
                provider,
                providerId,
                email,
              });
              updated = true;
            }

            if (updated) {
              await user.save();
            }
          }

          // Add info to JWT token
          token.userId = user._id;
          token.email = user.email;
          token.name = user.name;
          token.roleId = user.roleId || 3;

          token.customToken = jwt.sign(
            {
              userId: token.userId,
              email: token.email,
              name: token.name,
              roleId: token.roleId,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );
        }

        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        throw error;
      }
    },

    async session({ session, token }) {
      session.customToken = token.customToken;
      return session;
    },
  },
};
