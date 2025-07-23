import { prisma } from "@/lib/prisma"
import {NextRequest, NextResponse} from "next/server";
import moment from "moment";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const numPosts = await prisma.post.count({
    where: {
      clubId: parseInt(id)
    }
  });

  const today = moment(new Date())
  const numPostsToday = await prisma.post.count({
    where: {
      date: {
        gte: today.startOf("day").toDate(),
        lte: today.endOf("day").toDate()
      }
    }
  })

  const numMembers = await prisma.user.count({
    where: {
      clubs: {
        some: {
          clubId: parseInt(id)
        }
      }
    }
  });

  return NextResponse.json({
    posts: numPosts,
    postsToday: numPostsToday,
    members: numMembers,
  })
}
