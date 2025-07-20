"use client"

import * as React from "react"
import {
  AudioWaveform,
  Cog,
  Command,
  Globe,
  MessageSquareText,
  Users,
  Car
} from "lucide-react"

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
import { useEffect, useState } from "react";
import { Club } from "@prisma/client";

// This is sample data.
const data = {
  user: {
    name: "Andy Kotz",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "DALI Lab",
      imgLogo: "/dali.jpeg",
      logo: null,
    },
    {
      name: "Brazil Society",
      logo: Globe,
    },
    {
      name: "Formula Racing",
      logo: Car,
    },
  ],

  navClub: [
    {
      title: "Posts",
      url: "/",
      icon: MessageSquareText,
      isActive: true,
    },
    {
      title: "Members",
      url: "#",
      icon: Users,
    },
    {
      title: "Settings",
      url: "#",
      icon: Cog,
    },
  ],

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
        <NavSection section="My Club" items={data.navClub} />
        <NavSection section="Personal" items={data.navPersonal} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
