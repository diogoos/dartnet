import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 403 })
  }

  const body = await req.json();
  const { postId, like }: {
    postId: number,
    like: boolean
  } = body;
  const userId = parseInt(session.user.id)

  try {
    await prisma.post.update({
      where: { id: postId },
      data: like
        ? { likedBy: { connect: { id: userId } } }
        : { likedBy: { disconnect: { id: userId } } },
    });
  } catch {
    return NextResponse.json({ error: "Failed to update like" }, { status: 500 });
  }

  return NextResponse.json({}, { status: 200 })
}
