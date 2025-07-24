import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import moment from 'moment';
import { PostWithAuthor } from "@/lib/types";
import Link from "next/link"
import {Heart} from "lucide-react";
import {useState} from "react";
import {useSession} from "next-auth/react";

export const PostCard = ({ post }: { post: PostWithAuthor }) => {
  const session = useSession();
  const { author, text, likedBy, id } = post;
  moment.locale()

  const currentUserId = parseInt(session.data?.user.id ?? '-1');
  const [liked, setLiked] = useState(() =>
    likedBy.some(user => user.id === currentUserId)
  );
  const [likeCount, setLikeCount] = useState(likedBy.length);

  if (!session || !session.data) { return null }

  const handleLikeToggle = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(count => newLiked ? count + 1 : count - 1);

    // Revert UI state on error
    const revert = () => {
      setLiked(liked);
      setLikeCount(count => newLiked ? count - 1 : count + 1);
      console.error('Failed to toggle like');
    }

    try {
      const res = await fetch('/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id, like: newLiked }),
      });

      if (!res.ok) revert()
    } catch {
      revert()
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <Link href={`/members/${author.id}`}>
        <div className="flex items-center gap-4">
          <Avatar>
            {author.img == null ? <AvatarImage/> : <AvatarImage src={author.img} alt={`${author.name}'s avatar`}/>}
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">{author.name}</div>
        </div>
      </Link>

      <p className="mt-3 text-sm text-gray-700">{text}</p>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center gap-2 text-sm font-semibold cursor-pointer ${liked ? 'text-red-500' : 'text-gray-500'}`}
        >
          <Heart className="h-5 w-5 hover:scale-[1.3] transition-transform duration-200 ease-in-out" fill={liked ? 'currentColor' : 'none'}/>
          { likeCount }
        </button>

        <p className="text-sm text-gray-500">{moment(post.date).format('LL')}</p>
      </div>
    </div>
  )
}
