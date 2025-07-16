"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { PostWithAuthor } from "@/lib/post";
import { useState, useEffect } from "react";
import { PostComposer } from "@/components/post-composer";

export default function Home() {
  const clubId = 1;

  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  useEffect(() => {
    fetch(`/api/posts?clubId=${clubId}`)
      .then(r => r.json())
      .then(setPosts);
  }, []);

  const addPost = (post: PostWithAuthor) => {
    // later add the POST request here, for now add to feed
    setPosts([
      post,
      ...posts,
    ])
  }

  return <>
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1"/>
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4"/>
        <Link href="">Posts</Link>
      </div>
    </header>

    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center">
      <main className="flex flex-col gap-6 lg:w-3xl">
        <PostComposer onPostAction={addPost} />
        {posts.map((post, idx) => (
          <PostCard key={idx} post={post} />
        ))}
      </main>
    </div>
  </>
}
