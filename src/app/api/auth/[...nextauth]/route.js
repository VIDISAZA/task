import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// User schema — reuse if already defined
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String }
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        
        const user = await UserModel.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
        }
        
        if (!user.password) {
          throw new Error("This email is registered with Google. Please use Continue with Google.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return { id: user._id.toString(), name: user.name, email: user.email, image: user.image };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      // Auto-create user document for Google sign-in
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await UserModel.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = await UserModel.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
          user.id = newUser._id.toString();
        } else {
          user.id = existingUser._id.toString();
          // Update image if changed
          if (user.image && user.image !== existingUser.image) {
            existingUser.image = user.image;
            await existingUser.save();
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key_for_dev_only",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
