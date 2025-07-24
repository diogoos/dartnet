"use client"

import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

import Link from "next/link"

export function NavSection({
  section,
  items,
}: {
  section: string,
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{section}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Link key={item.title} href={item.url}>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                {item.icon && <item.icon />}
                  <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
