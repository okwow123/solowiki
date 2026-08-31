// app/legal/page.tsx
export const metadata = {
  title: "운영 원칙",
  description: "솔로위키의 저작권·커뮤니티 운영 원칙.",
};

export default function LegalPage() {
  return (
    <section className="py-16">
      <div className="max-w-2xl mx-auto px-6 prose prose-invert">
        <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-semibold mb-6">
          운영 원칙
        </h1>

        <div className="space-y-6 text-ink-soft leading-relaxed">
          <section>
            <h2 className="text-ink font-semibold text-lg mb-2">1. 우리는 팬덤 아카이브입니다</h2>
            <p>
              솔로위키는 특정 방송 프로그램과 제휴하지 않은 비공인 팬덤 정보 도감이에요.
              모든 출연자 정보는 팬이 직접 큐레이션한 것이며, 공식 자료가 아닙니다.
            </p>
          </section>

          <section>
            <h2 className="text-ink font-semibold text-lg mb-2">2. 저작권 가이드</h2>
            <p>
              방송 화면·스틸컷·공식 로고는 일절 사용하지 않아요. YouTube 영상은 임베드 방식으로만
              노출하며, 출처(채널명)를 항상 표기합니다. 출연자 사진은 공식 자료가 아닌 경우
              이니셜 + 그라데이션 아바타로 대체합니다.
            </p>
          </section>

          <section>
            <h2 className="text-ink font-semibold text-lg mb-2">3. 커뮤니티 규칙</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>욕설, 비방, 명예훼손은 신고 5회 누적 시 자동 숨김</li>
              <li>출연자 사생활(미공개 정보) 공유 금지</li>
              <li>개인정보(이름, 연락처, 주소) 작성 금지</li>
              <li>광고/홍보/스팸 신고 5회 누적 시 자동 숨김</li>
              <li>성적/혐오 표현 금지</li>
            </ul>
          </section>

          <section>
            <h2 className="text-ink font-semibold text-lg mb-2">4. 정보 정정 요청</h2>
            <p>
              출연자 정보가 사실과 다를 경우, 커뮤니티 댓글 또는 신고 기능을 통해 알려주세요.
              검토 후 빠르게 반영할게요.
            </p>
          </section>

          <section>
            <h2 className="text-ink font-semibold text-lg mb-2">5. 면책</h2>
            <p>
              본 사이트의 모든 정보는 팬이 편집한 자료로, 정확성을 보장하지 않습니다.
              공식 정보는 해당 방송사/공식 채널을 통해 확인해주세요.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
