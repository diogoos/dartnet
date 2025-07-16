import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("forUser")
  if (!userId) {
    return NextResponse.json({ error: "No user ID" }, { status: 400 })
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
