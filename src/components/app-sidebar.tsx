"use client"

import * as React from "react"
import {
  ChartNoAxesCombined,
  MessageSquareText,
  Users,
} from "lucide-react"

import { usePathname } from "next/navigation";
import { NavSection } from "@/components/nav-section"
import { NavUser } from "@/components/nav-user"
import { ClubSwitcher } from "@/components/club-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {useEffect, useMemo, useState} from "react";
import { Club } from "@prisma/client";

// This is sample data.
const data = {
  user: {
    name: "Andy Kotz",
    avatar: "/avatars/shadcn.jpg",
  }
}

export function AppSidebar({ activeClub, setClubAction }: {
  activeClub: Club | null,
  setClubAction: (club: Club) => void
}) {
  const userId = 44; // temp set to me
  const [clubs, setClubs] = useState<Club[]>([]);

  const pathname = usePathname();
  const clubNav = useMemo(() => {
    return [
      {
        title: "Posts",
        url: "/",
        icon: MessageSquareText,
        isActive: pathname === "/",
      },
      {
        title: "Members",
        url: "/members",
        icon: Users,
        isActive: pathname.startsWith("/members"),
      },
      {
        title: "Stats",
        url: "/stats",
        icon: ChartNoAxesCombined,
        isActive: pathname.startsWith("/stats"),
      },
    ]
  }, [pathname]);

  useEffect(() => {
    fetch(`/api/clubs/list?forUser=${userId}`)
      .then(res => res.json())
      .then((clubList) => {
        setClubs(clubList);
        setClubAction(clubList[0]);
      })
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ClubSwitcher
          clubs={clubs}
          activeClub={activeClub}
          setClubAction={setClubAction}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavSection section="My Club" items={clubNav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
