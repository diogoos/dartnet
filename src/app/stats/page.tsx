"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react";

export default function StatsPage(){
  const Map = useMemo(() => dynamic(
    () => import("@/components/members-map"),
    {
      loading: () => <h2>Map loading...</h2>,
      ssr: false
    }
  ), [])

  return (
    <Map />
  )
}
