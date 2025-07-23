"use client";

import {createContext, ReactNode, useCallback, useState} from "react";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import { Club } from "@prisma/client";

export const ClubContext = createContext<Club | null>(null);

export function AppBody({ children }: Readonly<{
  children: ReactNode;
}>) {
  const [club, setClub] = useState<Club | null>(null);

  return (
    <SidebarProvider>
      <ClubContext value={club}>
        <AppSidebar
          activeClub={club}
          setClubAction={setClub}
        />
        <SidebarInset>
          {children}
        </SidebarInset>
      </ClubContext>
    </SidebarProvider>
  )
}