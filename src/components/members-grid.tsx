'use client'

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BasicUser } from "@/lib/types";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export function MembersGrid() {
  const [members, setMembers] = useState<BasicUser[]>([]);
  const clubId = 1;

  useEffect(() => {
    fetch(`/api/clubs/${clubId}/members`)
      .then(res => res.json())
      .then(setMembers)
  }, [clubId]);

  return (
    <div
      className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-8 items-stretch pt-2">
      {members.map((member) => (
        <Link href={`/profile/${member.id}`} key={member.id}>
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