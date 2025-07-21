import {NextRequest, NextResponse} from "next/server";
import { prisma } from "@/lib/prisma";

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
      id: true,
      name: true,
      img: true,
      roles: true
    }
  })

  return NextResponse.json(members);
}
