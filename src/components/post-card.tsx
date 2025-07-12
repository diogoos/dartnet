import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Post } from "@prisma/client";


export type Post = {
  user: {
    name: string
    avatarUrl?: string
  }
  content: string
}

export const PostCard = ({ post }: { post: Post }) => {
  const { user, content } = post

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar>
            <AvatarImage src={user.avatarUrl} alt={`${user.name}'s avatar`} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium">{user.name}</div>
      </div>
      <p className="mt-3 text-sm text-gray-700">{content}</p>
    </div>
  )
}
