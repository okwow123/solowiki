// components/community/ReportButton.tsx
"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useVoterHash } from "@/hooks/useVoterHash";

const REASONS = [
  { value: "spam", label: "스팸/홍보" },
  { value: "abuse", label: "욕설/비방" },
  { value: "hate", label: "혐오/차별" },
  { value: "sexual", label: "성적 불쾌" },
  { value: "privacy", label: "개인정보" },
  { value: "other", label: "기타" },
] as const;

interface ReportButtonProps {
  postId: string;
}

export function ReportButton({ postId }: ReportButtonProps) {
  const voterHash = useVoterHash();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<typeof REASONS[number]["value"]>("spam");
  const [detail, setDetail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!voterHash || submitting) return;
    setSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.from("reports").insert({
      post_id: postId,
      reason,
      detail: detail.slice(0, 500) || null,
      reporter_hash: voterHash,
    });

    setSubmitting(false);
    if (!error) {
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
        setDetail("");
      }, 1500);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-[12px] text-muted hover:text-accent-rose transition-colors"
        aria-label="신고"
      >
        <Flag className="w-3.5 h-3.5" />
        신고
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-bg/80 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => !submitting && setOpen(false)}
        >
          <div
            className="bg-bg-2 border border-line-strong rounded-[14px] p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {done ? (
              <div className="py-8 text-center">
                <p className="text-accent-sage text-lg font-semibold mb-2">신고 접수 완료</p>
                <p className="text-muted text-sm">검토 후 조치할게요.</p>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-lg mb-1">이 글을 신고</h3>
                <p className="text-muted text-[13px] mb-4">
                  신고는 익명으로 처리돼요. 누적 5회 시 자동 숨김됩니다.
                </p>

                <div className="space-y-1.5 mb-4">
                  {REASONS.map((r) => (
                    <label
                      key={r.value}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-bg-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r.value}
                        checked={reason === r.value}
                        onChange={() => setReason(r.value)}
                        className="accent-accent-rose"
                      />
                      <span className="text-[14px]">{r.label}</span>
                    </label>
                  ))}
                </div>

                <textarea
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="추가 설명 (선택, 500자 이내)"
                  rows={3}
                  className="w-full bg-bg border border-line rounded-lg p-3 text-[13px] placeholder:text-muted focus:border-accent-rose focus:outline-none resize-none mb-4"
                />

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setOpen(false)}
                    disabled={submitting}
                    className="px-4 py-2 text-[13px] text-ink-soft hover:text-ink transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={submit}
                    disabled={submitting || !voterHash}
                    className="px-4 py-2 bg-accent-rose text-bg font-semibold text-[13px] rounded-full hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? "전송 중..." : "신고 보내기"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
