import { MembersGrid } from "@/components/members-grid"
import { PageHeader } from "@/components/page-header";

export default function MembersPage() {
  return <>
    <PageHeader breadcrumbs={[
      { href: "#", label: "Members"},
    ]} />

    <main>
      <MembersGrid />
    </main>
  </>
}