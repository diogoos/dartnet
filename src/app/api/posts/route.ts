import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const clubId = searchParams.get("clubId")
  if (!clubId) {
    return NextResponse.json({ error: "No Club ID" }, { status: 400 })
  }

  const posts = await prisma.post.findMany({
    where: {
      clubId: {
        equals: parseInt(clubId),
      }
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          img: true
        }
      }
    },
    orderBy: {
      date: 'desc'
    }
  })

  return NextResponse.json(posts);
}