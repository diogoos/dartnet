// user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Club } from "@prisma/client"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Query missing user ID' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: {
      clubs: {
        select: {
          club: true
        }
      }
    }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 403 });
  }

  const userId = parseInt(session.user.id);
  const body = await req.json();

  const { quote, favThings, roles, clubs, major, minor, birthday, locale, tradition } = body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        quote,
        favThings,
        roles,
        major,
        minor,
        birthday,
        locale,
        tradition,
        clubs: {
          deleteMany: {}, // remove all existing
          create: clubs?.map(({ club }: { club: Club }) => ({
            club: { connect: { id: club.id } }
          })) // connect to the new clubs
        }
      },
      include: {
        clubs: {
          select: { club: true }
        }
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: `Update failed: ${error}` }, { status: 500 });
  }
}
