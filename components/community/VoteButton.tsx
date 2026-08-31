// components/community/VoteButton.tsx
"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useVoterHash } from "@/hooks/useVoterHash";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  postId: string;
  initialUp: number;
  initialDown: number;
}

export function VoteButton({ postId, initialUp, initialDown }: VoteButtonProps) {
  const voterHash = useVoterHash();
  const [up, setUp] = useState(initialUp);
  const [down, setDown] = useState(initialDown);
  const [myVote, setMyVote] = useState<"up" | "down" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function cast(vote: "up" | "down") {
    if (!voterHash || submitting) return;
    setSubmitting(true);

    // Optimistic update
    if (myVote === vote) {
      // undo
      if (vote === "up") setUp((n) => Math.max(0, n - 1));
      else setDown((n) => Math.max(0, n - 1));
      setMyVote(null);
    } else {
      if (myVote === "up") setUp((n) => Math.max(0, n - 1));
      if (myVote === "down") setDown((n) => Math.max(0, n - 1));
      if (vote === "up") setUp((n) => n + 1);
      else setDown((n) => n + 1);
      setMyVote(vote);
    }

    const supabase = createClient();
    // Try insert — if conflict (already voted), delete old then insert new
    if (myVote) {
      await supabase
        .from("post_votes")
        .delete()
        .eq("post_id", postId)
        .eq("voter_hash", voterHash);
    }
    if (myVote !== vote) {
      await supabase.from("post_votes").insert({
        post_id: postId,
        voter_hash: voterHash,
        vote_type: vote,
      });
    }

    setSubmitting(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => cast("up")}
        disabled={!voterHash}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] transition-colors",
          myVote === "up"
            ? "bg-accent-rose/15 border-accent-rose/40 text-accent-rose"
            : "border-line-strong text-ink-soft hover:border-accent-rose/40 hover:text-accent-rose"
        )}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        {up}
      </button>
      <button
        onClick={() => cast("down")}
        disabled={!voterHash}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] transition-colors",
          myVote === "down"
            ? "bg-bg-3 border-line-strong text-ink-soft"
            : "border-line text-muted hover:border-line-strong"
        )}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
        {down}
      </button>
    </div>
  );
}
