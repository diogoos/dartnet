"use client"
import { useState } from "react"
import { PostWithAuthor } from "@/lib/types"
import { Button } from "@/components/ui/button"

export function PostComposer({ onPostAction }: {
  onPostAction: (newPost: PostWithAuthor) => void;
}) {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    // create a mock post to add to timeline
    // (replace w/ POST later)
    const newPost: PostWithAuthor = {
      text: text.trim(),
      author: {
        id: -1,
        name: "You",
        img: null,
      },
      userId: -1,
      clubId: -1,
      date: new Date(),
      id: -1
    };

    onPostAction(newPost);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="font-bold mb-2.5">What&#39;s on your mind?</h3>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder=""
        className="w-full border border-gray-300 rounded-md p-2 text-sm"
        rows={3}
      />
      <Button
        type="submit"
        className="mt-2 px-4 py-1 text-sm rounded"
      >
        Post to DALI Lab
      </Button>
    </form>
  );
}
