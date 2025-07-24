import {NextRequest, NextResponse} from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const clubs = await prisma.club.findMany({
    include: {
      members: {
        select: { userId: true }
      }
    }
  });

  return NextResponse.json(clubs)
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated "}, { status: 403 })
  }

  const body: { clubId: string } = await req.json();
  const { clubId } = body;

  try {
    await prisma.clubMembership.create({
      data: {
        user: {
          connect: { id: parseInt(session.user.id) }
        },
        club: {
          connect: { id: parseInt(clubId) }
        },
        joinedAt: new Date(),
      },
    })

  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error: ${error}` }, { status: 500 });
  }

  return NextResponse.json({}, { status: 200 })
}
