"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Component } from "lucide-react"
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { Club } from "@prisma/client";

export function ClubSwitcher({ clubs }: {
  clubs: Club[]
}) {
  const { isMobile } = useSidebar()
  const [activeClub, setActiveClub] = React.useState(clubs[0])

  if (!activeClub) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                { activeClub.img != null ? (
                  <Image
                    src={activeClub.img}
                    width={32}
                    height={32}
                    className="h-full w-full rounded-lg object-cover"
                    alt={`${activeClub.name} logo`}
                  />
                ) : <Component className="size-4" /> }
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeClub.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Clubs
            </DropdownMenuLabel>
            {clubs.map((team) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveClub(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {team.img != null ? (
                    <Image
                      src={team.img}
                      width={32}
                      height={32}
                      className="h-full w-full rounded-md object-cover"
                      alt={`${team.name} logo`}
                    />
                  ) : <Component className="size-3.5 shrink-0" /> }
                </div>
                {team.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Join club</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
