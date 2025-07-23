import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function GET(_: NextRequest, { params }: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const members = await prisma.user.findMany({
    where: {
      clubs: {
        some: {
          clubId: parseInt(id)
        }
      }
    },
    select: {
      locale: true
    }
  })

  const locations = members.map(l => l.locale)
  return NextResponse.json(locations)
}