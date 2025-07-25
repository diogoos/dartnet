"use client"

import * as React from "react"
import {
  ChartNoAxesCombined,
  MessageSquareText,
  Users,
} from "lucide-react"

import { usePathname, useSearchParams, useRouter } from "next/navigation";
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

export function AppSidebar({ activeClub, setClubAction }: {
  activeClub: Club | null,
  setClubAction: (club: Club) => void
}) {
  const [clubs, setClubs] = useState<Club[]>([]);

  const pathname = usePathname();
  const clubNav = useMemo(() => {
    return [
      {
        title: "Posts",
        url: "/",
        icon: MessageSquareText,
        isActive: pathname === "/" || pathname.startsWith("/home"),
      },
      {
        title: "Members",
        url: "/members",
        icon: Users,
        isActive: pathname.startsWith("/members"),
      },
      {
        title: "Statistics",
        url: "/stats",
        icon: ChartNoAxesCombined,
        isActive: pathname.startsWith("/stats"),
      },
    ]
  }, [pathname]);

  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/clubs/list`)
      .then(res => res.json())
      .then((clubList) => {
        setClubs(clubList)

        const clubQueryString = params.get('selectClub')
        if (clubQueryString) {
          const clubQuery = parseInt(clubQueryString)
          const newActiveClub = clubList.filter((c: Club) => ( c.id == clubQuery ))[0]

          if (newActiveClub) {
            setClubAction(newActiveClub);
            router.replace(window.location.pathname);
            return
          }
        }

        if (activeClub == null) {
          setClubAction(clubList[0]);
        }
      })
  // eslint-disable-next-line
  }, [setClubAction, params]);

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
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
