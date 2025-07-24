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
import { Skeleton } from "@/components/ui/skeleton";

import {
  DialogTrigger,
  Dialog
} from "@/components/ui/dialog"

import { Club } from "@prisma/client";
import JoinClubDialog from "@/components/join-club-dialog";

export function ClubSwitcher({ clubs, activeClub, setClubAction }: {
  clubs: Club[],
  activeClub: Club | null,
  setClubAction: (club: Club) => void,
}) {
  const { isMobile } = useSidebar()

  const activeClubImage = (() => {
    if (activeClub == null) {
      return <Skeleton className="h-full w-full" />
    }

    if (activeClub.img == null) {
      return <Component className="size-4" />
    }

    return <Image
      src={activeClub.img}
      width={32}
      height={32}
      className="h-full w-full rounded-lg object-cover"
      alt={`${activeClub.name} logo`}
    />
  })();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-border text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  { activeClubImage }
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  { activeClub == null ?
                    <Skeleton className="h-[20px] w-auto" />
                    : <span className="truncate font-medium">{activeClub.name}</span>
                  }
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
              {clubs.map((club) => (
                <DropdownMenuItem
                  key={club.name}
                  onClick={() => setClubAction(club)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    {club.img != null ? (
                      <Image
                        src={club.img}
                        width={32}
                        height={32}
                        className="h-full w-full rounded-md object-cover"
                        alt={`${club.name} logo`}
                      />
                    ) : <Component className="size-3.5 shrink-0" /> }
                  </div>
                  {club.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                  <div className="text-muted-foreground font-medium">Join club</div>
              </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <JoinClubDialog />
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
