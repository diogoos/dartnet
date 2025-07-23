import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha512 } from "@noble/hashes/sha2";

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
      authorize: async (credentials) => {
        // write authorization code here
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await verifyUser(credentials.username, credentials.password);
        if (!user) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    })
  ],

  callbacks: {
    authorized: async ({ auth }) => {
      // Logged-in users are authenticated, otherwise redirect to login page
      return !!auth
    }
  }
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
