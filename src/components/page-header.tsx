'use client'

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react"
import {Skeleton} from "@/components/ui/skeleton";

export function PageHeader({ breadcrumbs }: {
  breadcrumbs: { href?: string; label: string | null; }[]
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, idx) => {
              if (crumb.label == null) {
                return <Skeleton style={{width: 60, height: 16}} key={idx} />
              }

              const isLast = idx === breadcrumbs.length - 1;
              if (isLast) {
                return (
                  <BreadcrumbItem key={idx}>
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                )
              }

              return <Fragment key={idx}>
                <BreadcrumbItem className="hidden md:block">
                  <Link href={crumb.href || "#"}>{crumb.label}</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </Fragment>
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
