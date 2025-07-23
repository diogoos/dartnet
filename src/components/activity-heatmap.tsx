"use client"

import {useState, useContext, useEffect} from "react";
import moment from "moment";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {ClubContext} from "@/components/app-body";

type HeatmapEntry = { date: string, heat: number }

const colorScale = [
  "bg-gray-200", // 0
  "bg-green-100", // 1
  "bg-green-300", // 2
  "bg-green-500", // 3
  "bg-green-700", // 4
];

export default function ActivityHeatmap() {
  const [activity, setActivity] = useState<HeatmapEntry[]>([]);
  const club = useContext(ClubContext)

  const fetchActivity = async () => {
    if (club == null) return [];

    const records: Record<string, number> = await fetch(`/api/clubs/${club.id}/stats/activity`).then(res => res.json())

    const days = 365;
    const heatmap: HeatmapEntry[] = [];

    for (let i = 0; i < days; i++) {
      const m = moment(new Date()).subtract(i, "days")
      const dateStr = m.format("YYYY-MM-DD")

      heatmap.push({
        date: dateStr,
        heat: records[dateStr] || 0, // 0–4 activity
      });
    }

    return heatmap.reverse(); // chronological order
  }

  useEffect(() => {
    fetchActivity()
      .then(setActivity)
  }, [fetchActivity]);

  const weeks = Array.from({ length: 53 }, (_, i) => i);
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => i);

  const grid = weeks.map((week) =>
    daysOfWeek.map((day) => {
      const index = week * 7 + day;
      const entry = activity[index];
      return entry || { date: "hide", heat: 0 };
    })
  );

  return (
    <div className="flex overflow-x-auto p-4">
      <div className="grid grid-rows-7 grid-flow-col gap-0.5">
        {grid.map((week, weekIdx) =>
          week.map((cell, dayIdx) => {
            if (cell.date == "hide") {
              return <div key={`${weekIdx}-${dayIdx}`} className="w-3 h-3" aria-hidden={true}></div>
            }

            return <Tooltip key={`${weekIdx}-${dayIdx}`}>
              <TooltipTrigger asChild>
                <div
                  className={`w-3 h-3 rounded-xs ${colorScale[cell.heat]}`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{cell.date}</p>
              </TooltipContent>
            </Tooltip>
          })
        )}
      </div>
    </div>
  );
}