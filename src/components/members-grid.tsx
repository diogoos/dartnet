'use client'

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {useContext, useEffect, useState} from "react";
import { BasicUser } from "@/lib/types";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Skeleton} from "@/components/ui/skeleton";
import {ClubContext} from "@/components/app-body";

export function MembersGrid() {
  const club = useContext(ClubContext)
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<BasicUser[]>([]);

  useEffect(() => {
    if (club == null) return

    setLoading(true)
    fetch(`/api/clubs/${club.id}/members`)
      .then(res => res.json())
      .then(setMembers)
      .then(() => setLoading(false));
  }, [club]);

  if (loading) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-8 items-stretch pt-2">
        {
          Array(20).fill(null).map((_, i) => (
            <Skeleton key={i} className="w-full" style={{ height: "10rem" }} />
          ))
        }
      </div>
    )
  }

  return (
    <div
      className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-8 items-stretch pt-2">
      {members.map((member) => (
        <Link href={`/members/${member.id}`} key={member.id}>
          <Card className="w-full h-full transition-transform duration-200 ease-in-out hover:scale-[1.03]">
            <CardHeader className="flex flex-col items-center text-center gap-2">
              <Avatar className="w-12 h-12">
                <AvatarImage src={member.img ?? undefined} alt={`${member.name}'s avatar`} />
                <AvatarFallback>
                  {member.name[0]}
                </AvatarFallback>
              </Avatar>

              <CardTitle className="text-base">{member.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{member.roles.join(', ')}</p>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}