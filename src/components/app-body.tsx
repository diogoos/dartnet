"use client";

import {createContext, ReactNode, useState} from "react";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import { Club } from "@prisma/client";
import {SessionProvider} from "next-auth/react";

export const ClubContext = createContext<Club | null>(null);

export function AppBody({ children }: Readonly<{
  children: ReactNode;
}>) {
  const [club, setClub] = useState<Club | null>(null);

  return (
    <SessionProvider>
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
    </SessionProvider>
  )
}