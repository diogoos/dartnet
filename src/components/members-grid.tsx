'use client'

import Link from "next/link";

export function MembersGrid() {
  return (
    <div className="flex flex-col items-start space-y-0.5">
      <p><Link href="/profile/1">Member</Link></p>
      <p>Member</p>
      <p>Member</p>
      <p>Member</p>
    </div>
  )
}