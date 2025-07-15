import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import moment from 'moment';
import { PostWithAuthor } from "@/lib/post";

export const PostCard = ({ post }: { post: PostWithAuthor }) => {
  const { author, text } = post
  moment.locale()

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar>
            {author.img != null && <AvatarImage src={author.img} alt={`${author.name}'s avatar`} /> }
            <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium">{author.name}</div>
      </div>
      <p className="mt-3 text-sm text-gray-700">{text}</p>
      <p className="mt-1 text-sm text-gray-500">{moment(post.date).format('LL')}</p>
    </div>
  )
}
