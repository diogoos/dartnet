"use client"

import { useParams } from "next/navigation";
import { User } from '@prisma/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const userId = parseInt(params.id);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/user?id=' + userId)
      .then(res => res.json())
      .then(setUser)
  }, [userId]);

  const profileImage = (() => {
    if (user == null) return <Skeleton className="w-full h-full"/>;
    return <>
      <AvatarImage src={user.img ?? undefined} alt={`${user.name}'s avatar`} />
      <AvatarFallback>
        {user.name[0]}
      </AvatarFallback>
    </>
  })();

  const cardBody = (() => {
    if (user == null) return (
      <div className="space-y-4">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-15" />
        <Skeleton className="w-full h-18" />
        <Skeleton className="w-full h-12" />
      </div>
    )

    return <>
      <div className="space-y-2">
        <h3 className="text-xl font-bold border-b pb-1 mb-2 text-gray-800">Academic Info</h3>
        <p>
          Major: <span className="font-medium">{user.major}</span>
        </p>
        <p>
          Minor: <span className="font-medium">{user.minor ?? 'N/A'}</span>
        </p>
        <p>
          Year: <span className="font-medium">{user.year ?? 'N/A'}</span>
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold border-b pb-1 mb-2 text-gray-800">Personal Details</h3>
        <p>
          Birthday: <span className="font-medium">{user.birthday}</span>
        </p>
        <p>
          Locale: <span className="font-medium">{user.locale}</span>
        </p>
        <p>
          Fun Fact: <span className="font-medium">{user.funFact}</span>
        </p>
        <p>
          Tradition: <span className="font-medium">{user.tradition}</span>
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold border-b pb-1 mb-2 text-gray-800">Favorite Things</h3>
        <ul className="list-disc list-inside">
          {user.favThings.length > 0 ? (
            user.favThings.map((thing, i) => <li key={i}>{thing}</li>)
          ) : (
            'N/A'
          )}
        </ul>
      </div>
    </>
  })();

  return <>
    <PageHeader breadcrumbs={[
      { href: '/members', label: "Members" },
      { href: '#', label: user?.name ?? null }
    ]} />

    <main>
      <Card className="w-md mx-auto mb-8">
        <CardHeader className="flex flex-col items-center space-y-1 text-center">

          <Avatar className="w-28 h-28">
            {profileImage}
          </Avatar>

          { user != null ?
            <CardTitle className="text-3xl font-bold tracking-tight">{ user.name }</CardTitle> :
            <Skeleton className="w-[250px] h-8 mb-2 mt-2" />
          }

          { user != null ?
            <CardDescription className="text-muted-foreground italic text-base">{ user.quote }</CardDescription> :
            <Skeleton className="w-full h-18" />
          }

          <div className="flex flex-wrap justify-center gap-2 mt-2">
            { user != null &&
              user.roles.map(role => <Button key={role} className="bg-teal-800">{role}</Button>)
            }
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          { cardBody }
        </CardContent>
      </Card>
    </main>
  </>
}
