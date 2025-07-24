"use client"
import {useContext, useState, FormEvent} from "react"
import { Button } from "@/components/ui/button"
import {ClubContext} from "@/components/app-body";

export function PostComposer({ onPostAction }: {
  onPostAction: (postText: string) => void;
}) {
  const club = useContext(ClubContext);
  const [text, setText] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    onPostAction(text.trim());
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
        disabled={club == null}
      >
        Post { club != null && ` to ${club.name}` }
      </Button>
    </form>
  );
}
