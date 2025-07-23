import { prisma } from "@/lib/prisma"
import {NextRequest, NextResponse} from "next/server";
import moment from "moment";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const posts = await prisma.post.findMany({
    where: {
      clubId: parseInt(id),
    },
    select: {
      date: true
    }
  })

  // count posts for each day
  const heatmap: Record<string, number> = {}
  for (const date of posts.map(p => p.date)) {
    const dateKey = moment(date).format('YYYY-MM-DD')
    heatmap[dateKey] = (heatmap[dateKey] || 0) + 1
  }

  // normalize in a 1-4 scale
  const max = Math.max(...Object.values(heatmap), 1)
  const normalized: Record<string, number> = {}
  for (const [date, count] of Object.entries(heatmap)) {
    const value = Math.ceil((count / max) * 4)
    normalized[date] = Math.max(value, 1) // ensure min value is 1
  }

  return NextResponse.json(normalized)
}