"use client"

import dynamic from "next/dynamic"
import {useEffect, useMemo, useState} from "react";
import ActivityHeatmap from "@/components/activity-heatmap";
import {Card} from "@/components/ui/card";
import {PageHeader} from "@/components/page-header";

export default function StatsPage(){
  const Map = useMemo(() => dynamic(
    () => import("@/components/members-map"),
    {
      loading: () => <h2>Map loading...</h2>,
      ssr: false
    }
  ), [])

  const clubId = 1
  const [count, setCount] = useState<{
    members: number, posts: number, postsToday: number
  } | null>(null);
  useEffect(() => {
    fetch(`/api/clubs/${clubId}/stats/count`)
      .then(res => res.json())
      .then(setCount)
  }, [])

  return <>
    <PageHeader breadcrumbs={[
      { href: "#", label: "Stats" },
    ]} />

    <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="w-full lg:col-span-2 gap-0">
          <h2 className="text-lg md:text-xl font-semibold mb-0 ml-4">Post Activity:</h2>
          <div className="overflow-x-auto overflow-x-clip-right">
            <div className="min-w-max float-right">
              <ActivityHeatmap />
            </div>
          </div>
        </Card>

        <Card className="w-full lg:col-span-1 flex flex-row justify-between items-center py-6 px-4">
          <div className="text-center" style={{ width: "33%" }}>
            <div className="text-4xl font-bold">{count?.members}</div>
            <div className="text-sm text-muted-foreground">Members</div>
          </div>
          <div className="text-center" style={{ width: "33%" }}>
            <div className="text-4xl font-bold">{count?.posts}</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </div>
          <div className="text-center" style={{ width: "33%" }}>
            <div className="text-4xl font-bold">{count?.postsToday}</div>
            <div className="text-sm text-muted-foreground">Today</div>
          </div>
        </Card>
      </div>

      <Card className="w-full text-center space-y-2 p-4 items-center">
        <Map/>
      </Card>
    </main>
  </>
}
