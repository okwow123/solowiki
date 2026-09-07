// app/community/[number]/page.tsx
import { notFound } from "next/navigation";
import { getSeasonByNumber } from "@/lib/data/seasons";
import { getPostsBySeason } from "@/lib/data/posts";
import { PostForm } from "@/components/community/PostForm";
import { PostCard } from "@/components/community/PostCard";
import { VoteButton } from "@/components/community/VoteButton";
import { ReportButton } from "@/components/community/ReportButton";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface PageProps {
  params: { number: string };
}

export async function generateMetadata({ params }: PageProps) {
  const num = parseInt(params.number, 10);
  if (isNaN(num)) return { title: "커뮤니티" };
  return {
    title: `${num}기 커뮤니티`,
    description: `${num}기 팬들이 나누는 익명 이야기.`,
  };
}

export default async function CommunityPage({ params }: PageProps) {
  const num = parseInt(params.number, 10);
  if (isNaN(num)) notFound();

  const season = await getSeasonByNumber(num);

  if (!season) {
    return (
      <section className="py-16">
        <div className="max-w-site mx-auto px-6 text-center py-20 border border-dashed border-line-strong rounded-[14px]">
          <p className="text-ink-soft mb-2">{num}기는 아직 데이터가 없어요.</p>
          <p className="text-muted text-[13px]">다른 시즌 커뮤니티를 구경해보세요.</p>
        </div>
      </section>
    );
  }

  const posts = await getPostsBySeason(season.id, 50);

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-muted text-[12px] tracking-widest mb-2">COMMUNITY</p>
          <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-semibold mb-2">
            {num}기 커뮤니티
          </h1>
          <p className="text-ink-soft text-[14.5px]">
            로그인 없이, 익명으로. 욕설/비방은 5회 누적 시 자동 숨김됩니다.
          </p>
        </div>

        {/* Post form */}
        <div className="mb-8">
          <PostForm seasonId={season.id} seasonNumber={num} />
        </div>

        {/* Posts list */}
        {posts.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-line-strong rounded-[14px]">
            <p className="text-ink-soft mb-1">아직 글이 없어요.</p>
            <p className="text-muted text-[13px]">첫 번째 이야기를 남겨보세요.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <article
                key={post.id}
                id={`post-${post.id}`}
                className="bg-bg-2 border border-line rounded-[14px] p-5"
              >
                <div className="flex items-center gap-2 mb-2.5 text-[12px] flex-wrap">
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
                  <span className="text-muted">
                    · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })}
                  </span>
                </div>

                <p className="text-[15px] leading-relaxed mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  <VoteButton
                    postId={post.id}
                    initialUp={post.vote_up_count}
                    initialDown={post.vote_down_count}
                  />
                  <ReportButton postId={post.id} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
