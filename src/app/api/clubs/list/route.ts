import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    return NextResponse.json({ error: "Not logged in "}, { status: 403 })
  }

  const clubs = await prisma.club.findMany({
    where: {
      members: { some: { userId: { equals: parseInt(userId) } } }
    },
    select: {
      id: true,
      name: true,
      description: true,
      img: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  return NextResponse.json(clubs);
}
