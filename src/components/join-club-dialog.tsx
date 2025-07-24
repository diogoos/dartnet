import {DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose} from "@/components/ui/dialog";
import {useState, useEffect} from "react";
import { useSession } from "next-auth/react"
import { type ClubWithMemberIds } from "@/lib/types";
import {redirect, RedirectType} from "next/navigation";
import Image from "next/image"
import {Skeleton} from "@/components/ui/skeleton";

export default function JoinClubDialog() {
  const [clubs, setClubs] = useState<ClubWithMemberIds[]>([]);
  const session = useSession();

  useEffect(() => {
    fetch('/api/clubs/join')
      .then(res => res.json())
      .then(setClubs)
  }, []);

  const joinClubAction = (newClub: ClubWithMemberIds) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { members, ...club } = newClub;

    fetch('/api/clubs/join', {
      method: "POST",
      headers: {
        contentType: "application/json",
      },
      body: JSON.stringify({ clubId: club.id }),
    })
      .then((res) => {
        if (!res.ok) {
          alert("Error joining club.")
          return
        }

        redirect(`/?selectClub=${club.id}`, RedirectType.push)
      })
  }

  if (!session || !session.data?.user) return null;

  return (
    <DialogContent className="fixed z-[1000] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 md:rounded-lg md:shadow-lg md:max-h-[90vh] overflow-y-auto w-full max-w-4xl max-h-[100vh] rounded-none">
      <DialogHeader>
        <DialogTitle>Join a Club</DialogTitle>
        <DialogDescription>Select a club to get involved with your community.</DialogDescription>
      </DialogHeader>


      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {clubs.map((club: ClubWithMemberIds) => {
          const joined = club.members.filter(m => {
            return m.userId == session.data.user.id;
          }).length > 0

          return <div key={club.id} className="bg-white rounded-lg overflow-hidden shadow-md">
            { club.img != null ?
              <Image src={club.img} alt={`${club.name} logo`} width={512} height={512} className="h-32 w-full object-cover"/> :
              <Skeleton className="h-32 w-full object-cover" />
            }

            <div className="p-4 text-black">
              <h3 className="text-lg font-semibold">{club.name}</h3>
              <p className="text-sm text-gray-600">{club.description}</p>

              <DialogClose asChild>
                <button
                  disabled={joined}
                  onClick={ () => joinClubAction(club) }
                  className={`mt-3 px-4 py-2 rounded-md text-white w-full ${
                    joined ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {joined ? "Already Joined" : "Join"}
                </button>
              </DialogClose>
            </div>
          </div>
        })}
      </div>
    </DialogContent>
  );
}