// components/community/PostCard.tsx
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ThumbsUp, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { PostWithRefs } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostWithRefs;
  href?: string;
  compact?: boolean;
}

export function PostCard({ post, href, compact = false }: PostCardProps) {
  const target = href ?? `/community/${post.season?.number ?? 1}`;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <Link
      href={target}
      className="block bg-bg-2 border border-line rounded-[14px] p-5 hover:border-line-strong hover:bg-bg-3 transition-all"
    >
      <div className="flex items-center gap-2 mb-2.5 text-[12px]">
        {post.season && (
          <span className="px-2 py-0.5 rounded-md bg-ink/[0.06] text-ink-soft">
            {post.season.number}기
          </span>
        )}
        {post.contestant && (
          <span className="text-accent-rose font-medium">
            {post.contestant.name_initial ?? post.contestant.name}
          </span>
        )}
        <span className="text-ink-soft font-medium">{post.anonymous_name}</span>
        <span className="text-muted">· {timeAgo}</span>
      </div>

      <p className={cn("text-[14.5px] leading-relaxed mb-3", compact ? "clamp-2" : "clamp-3")}>
        {post.content}
      </p>

      <div className="flex items-center gap-4 text-[12px] text-muted">
        <span className="flex items-center gap-1">
          <ThumbsUp className="w-3.5 h-3.5" />
          {post.vote_up_count}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="w-3.5 h-3.5" />
          {post.vote_up_count + post.vote_down_count}
        </span>
        {post.report_count > 0 && (
          <span className="text-accent-rose">🚨 {post.report_count}</span>
        )}
      </div>
    </Link>
  );
}
