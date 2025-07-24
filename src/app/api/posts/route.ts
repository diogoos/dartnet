import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

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
      },

      likedBy: {
        select: { id: true }
      }
    },
    orderBy: {
      date: 'desc'
    }
  })

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({error: "Not authenticated"}, { status: 403 });
  }

  const body = await req.json();
  const { text, clubId } = body;

  if (!text || !clubId) {
    return Response.json({ error: "Missing post content or club" }, { status: 400 })
  }

  // fetch the usr clubs from prisma to validate
  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
    include: { clubs: true }
  })
  if (!user) return NextResponse.json({error: "Not authenticated"}, { status: 403 });

  // ensure that the user actually belongs to this club!
  const isMember = user.clubs.some(c => c.clubId == body.clubId)
  if (!isMember) {
    return Response.json({ error: "Not a member of this club" }, { status: 403 });
  }

  // send back the created post
  const newPost = await prisma.post.create({
    data: {
      text,
      date: new Date(),
      author: {
        connect: {
          id: parseInt(session.user.id)
        }
      },
      club: {
        connect: {
          id: parseInt(clubId)
        }
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          img: true
        }
      }
    }
  })

  return Response.json(newPost);
}