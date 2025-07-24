import { Users, Handshake, CalendarClock } from "lucide-react";
import { signIn } from "@/lib/auth"
import {prisma} from "@/lib/prisma";

export default async function Landing() {
  const numUsers = await prisma.user.count();

  return (
    <div className="h-screen w-screen fixed top-0 left-0 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 text-white px-4">
      <div className="text-center space-y-6 max-w-md w-full">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">dartnet</h1>
        <p className="text-lg sm:text-xl font-medium">join. connect. grow.</p>

        <form action={async () => {
          "use server"
          await signIn()
        }}>
          <button className="mt-6 px-6 py-3 bg-white text-green-700 font-semibold rounded-full shadow-lg hover:bg-green-100 hover:scale-[1.05] transition duration-300 cursor-pointer">
            Sign in to join { numUsers } others
          </button>
        </form>

        <p className="mt-4 text-base text-white/90">
          Discover and join campus clubs, connect with new people, and stay updated on events—all in one place.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3 text-white">
          <div className="flex flex-col items-center space-y-2">
            <Users className="w-8 h-8" />
            <p className="text-sm">Join clubs</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Handshake className="w-8 h-8" />
            <p className="text-sm">Meet new people</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <CalendarClock className="w-8 h-8" />
            <p className="text-sm">Stay up to date</p>
          </div>
        </div>
      </div>
    </div>
  );
}
