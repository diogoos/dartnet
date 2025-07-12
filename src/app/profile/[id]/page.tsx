import ProfileView from '@/components/ProfileView'
import { User } from '@prisma/client';
import { prisma } from '@/lib/prisma';

async function fetchUser(userId: number): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Failed to fetch user');
  return user;
}

export default async function ProfilePage({ params }: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const user = await fetchUser(parseInt(id));
  return (
    <ProfileView
      user={user}
    />
  )
}
