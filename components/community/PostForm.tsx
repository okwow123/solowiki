// components/community/PostForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateAnonymousName } from "@/lib/anonymous";
import { useVoterHash } from "@/hooks/useVoterHash";

interface PostFormProps {
  seasonId: number;
  seasonNumber: number;
  contestantId?: string;
}

export function PostForm({ seasonId, seasonNumber, contestantId }: PostFormProps) {
  const router = useRouter();
  const voterHash = useVoterHash();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = 1000 - content.length;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!voterHash || submitting) return;
    const trimmed = content.trim();
    if (trimmed.length < 1) {
      setError("내용을 입력해주세요.");
      return;
    }
    if (trimmed.length > 1000) {
      setError("1000자 이내로 작성해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("posts").insert({
      season_id: seasonId,
      contestant_id: contestantId ?? null,
      content: trimmed,
      anonymous_name: generateAnonymousName(),
      ip_hash: voterHash, // dedup hint (not exposed publicly)
    });

    setSubmitting(false);

    if (insertError) {
      setError("전송에 실패했어요. 잠시 후 다시 시도해주세요.");
      return;
    }

    setContent("");
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="bg-bg-2 border border-line rounded-[14px] p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] text-ink-soft">
          {contestantId ? "이 출연자에 대해" : `${seasonNumber}기에 대해`} 이야기하기
        </p>
        <span
          className={`text-[11.5px] tabular-nums ${
            remaining < 100 ? "text-accent-rose" : "text-muted"
          }`}
        >
          {remaining}자
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="로그인 없이, 익명으로, 자유롭게. 욕설/비방은 자동 숨김 처리됩니다."
        rows={4}
        className="w-full bg-bg border border-line rounded-lg p-3.5 text-[14px] placeholder:text-muted focus:border-accent-rose/50 focus:outline-none resize-none mb-3"
        disabled={!voterHash}
      />

      {error && <p className="text-accent-rose text-[12.5px] mb-3">{error}</p>}

      <div className="flex items-center justify-between">
        <p className="text-[11.5px] text-muted">
          닉네임은 매번 자동 생성 · 본인 식별 불가
        </p>
        <button
          type="submit"
          disabled={submitting || !voterHash || content.trim().length === 0}
          className="px-5 py-2 bg-gradient-to-br from-accent-rose to-accent-gold text-bg font-semibold text-[13.5px] rounded-full hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "게시 중..." : "게시"}
        </button>
      </div>
    </form>
  );
}
