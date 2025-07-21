"use client";

import { PostCard } from "@/components/post-card";
import { PostWithAuthor } from "@/lib/types";
import {useState, useEffect } from "react";
import { PostComposer } from "@/components/post-composer";
import {Skeleton} from "@/components/ui/skeleton";
import {PageHeader} from "@/components/page-header";

export default function Home() {
  const clubId = 1;

  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/posts?clubId=${clubId}`)
      .then(r => r.json())
      .then(setPosts)
      .then(() => { setLoading(false) })
  }, []);

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
