"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react";
import ActivityHeatmap from "@/components/activity-heatmap";

export default function StatsPage(){
  const Map = useMemo(() => dynamic(
    () => import("@/components/members-map"),
    {
      loading: () => <h2>Map loading...</h2>,
      ssr: false
    }
  ), [])

  return <div>
    <ActivityHeatmap />
    <Map />
  </div>
}
