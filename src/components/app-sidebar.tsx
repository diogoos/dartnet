"use client"

import * as React from "react"
import {
  AudioWaveform,
  Cog,
  Command,
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
  },

  navPersonal: [
    {
      title: "Account",
      url: "#",
      icon: Command,
    },
    {
      title: "Profile",
      url: "#",
      icon: AudioWaveform,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userId = 44; // temp set to me
  const [clubs, setClubs] = useState<Club[]>([]);
  const [activeClub, setActiveClub] = useState<Club | null>(null);

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
        isActive: pathname.startsWith("/members") || pathname.startsWith("/profile"),
      },
      {
        title: "Settings",
        url: "#",
        icon: Cog,
        isActive: false,
      },
    ]
  }, [pathname]);

  useEffect(() => {
    fetch(`/api/clubs/list?forUser=${userId}`)
      .then(res => res.json())
      .then((clubList) => {
        setClubs(clubList);
        setActiveClub(clubList[0]);
      })
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ClubSwitcher
          clubs={clubs}
          activeClub={activeClub}
          setClubAction={setActiveClub}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavSection section="My Club" items={clubNav} />
        <NavSection section="Personal" items={data.navPersonal} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
