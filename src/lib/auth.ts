import NextAuth, {CredentialsSignin} from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha512 } from "@noble/hashes/sha2";

import { DefaultSession } from "next-auth";
import { User as PrismaUser } from "@prisma/client";
import {NextRequest, NextResponse} from "next/server";

declare module "next-auth" {
  interface Session {
    user: PrismaUser & DefaultSession["user"]
  }

  interface User extends PrismaUser {
    id: string
    password?: string
    salt?: string
  }
}

class InvalidCredentials extends CredentialsSignin {
  code= "invalid_credentials"
}

class MissingCredentials extends CredentialsSignin {
  code = "missing_credentials"
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {
          type: "text",
          label: "Username",
          placeholder: "first.last"
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****"
        }
      },

      authorize: async (
        credentials: Partial<Record<"username" | "password", unknown>>
      ) => {
        // write authorization code here
        if (!credentials?.username || !credentials?.password) {
          throw new MissingCredentials()
        }

        const user = await verifyUser(credentials.username as string, credentials.password as string);
        if (!user) {
          throw new InvalidCredentials()
        }

        return {
          ...user,
          id: String(user.id)
        }
      }
    }),
  ],

  callbacks: {
    authorized: async ({ request, auth }) => {
      if (request.nextUrl.pathname === "/") {
        if (!auth || !auth.user) {
          return true
        }

        const url = request.nextUrl.clone()
        url.pathname = "/home"
        return NextResponse.rewrite(url)
      }

      // Logged-in users are authenticated, otherwise redirect to login page
      return !!auth
    },

    session: ({ session, token }) => {
      if (token.user) {
        session.user = token.user as typeof session.user
      }
      return session
    },

    jwt: ({ token, user }) => {
      if (user) {
        token.user = {
          id: user.id,
          username: user.username,
          name: user.name,
          img: user.img
        }
      }

      return token;
    }
  },
})

async function verifyUser(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    omit: {
      password: false,
      salt: false
    }
  });

  if (!user || !user.salt || !user.password) {
    return null;
  }

  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const saltBytes = encoder.encode(user.salt);

  const derivedKey = await pbkdf2Async(sha512, passwordBytes, saltBytes, {
    c: 210_000,
    dkLen: 32
  });

  const storedPassword = Uint8Array.from(Buffer.from(user.password, "hex"));
  const isValid = equalBytes(derivedKey, storedPassword);

  // Strip sensitive fields before returning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pwd, salt: _salt, ...safeUser } = user;

  return isValid ? safeUser : null;
}

function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}
