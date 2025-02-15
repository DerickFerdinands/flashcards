import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    select: { id: true, name: true, email: true, password: true },
                });

                if (user && (await compare(credentials.password, user.password))) {
                    return { id: user.id, name: user.name, email: user.email };
                }

                return null;
            },
        }),
    ],
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ account, profile }) {
            // If the provider is Google
            if (account.provider === "google") {
                // Check if the user already exists in the database
                const existingUser = await prisma.user.findUnique({
                    where: { email: profile.email },
                });

                // If the user does not exist, create them (without a password field)
                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email: profile.email,   // email
                            name: profile.name,     // name (optional)
                            // Do not include the password field since it's optional
                            password:""
                        },
                    });
                }
            }
            return true; // Allow sign-in to proceed
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            }
            if (account?.provider === "google") {
                token.googleId = account.providerAccountId;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.googleId = token.googleId;
            }
            return session;
        },
    },
};

export default authOptions;
