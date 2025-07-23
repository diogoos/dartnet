"use client";

import { PostCard } from "@/components/post-card";
import { PostWithAuthor } from "@/lib/types";
import {useState, useEffect, useContext} from "react";
import { PostComposer } from "@/components/post-composer";
import {Skeleton} from "@/components/ui/skeleton";
import {PageHeader} from "@/components/page-header";
import {ClubContext} from "@/components/app-body";

export default function Home() {
  const club = useContext(ClubContext);
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (club == null) return;
    setLoading(true);
    fetch(`/api/posts?clubId=${club.id}`)
      .then(r => r.json())
      .then(setPosts)
      .then(() => { setLoading(false) })
  }, [club]);

  const addPost = (post: PostWithAuthor) => {
    // later add the POST request here, for now add to feed
    setPosts([
      post,
      ...posts,
    ])
  }

  return <>
    <PageHeader breadcrumbs={[
      { href: "#", label: "Posts" },
    ]} />

    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center">
      <main className="flex flex-col gap-6 lg:w-3xl">
        <PostComposer onPostAction={addPost} />
        { loading &&
            [...Array(5).keys()].map((idx) => (
              <Skeleton key={idx} className="h-[150px] rounded-lg"/>
            ))
        }
        { posts.map((post, idx) => (
            <PostCard key={idx} post={post} />
        ))}
      </main>
    </div>
  </>
}
