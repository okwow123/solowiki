// app/legal/page.tsx
export const metadata = {
  title: "운영 원칙 · 저작권 · Fair Use",
  description: "르헤메스(Lexemes)의 저작권·커뮤니티 운영 원칙. fan archive 정당성, fair use 가이드, 정보 정정 요청.",
};

export default function LegalPage() {
  return (
    <section className="py-16">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-semibold mb-6">
          운영 원칙
        </h1>

        <div className="space-y-6 text-ink-soft leading-relaxed">
          <section>
            <h2 className="text-ink font-semibold text-lg mb-2">1. 우리는 팬덤 아카이브입니다</h2>
            <p>
              르헤메스(Lexemes)는 특정 방송사·영화사·OTT와 제휴하지 않은{" "}
              <strong>비공인 팬덤 캐릭터 도감</strong>이에요. 모든 캐릭터 정보는 팬이 직접 큐레이션한 것이며,
              공식 자료가 아닙니다. 영화·드라마·예능 등 다양한 작품의 캐릭터들을 한 곳에서 만나볼 수 있어요.
            </p>
          </section>

          <section>
            <h2 className="text-ink font-semibold text-lg mb-2">2. 저작권 및 Fair Use 정책</h2>
            <p className="mb-3">
              르헤메스는 한국 저작권법 및 국제 fair use (공정 이용) 원칙을 준수합니다.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>방송 화면·영화 스틸컷·공식 로고는 일절 사용하지 않습니다.</strong>
              </li>
              <li>
                <strong>YouTube 영상은 클릭 시 YouTube로 이동</strong>하여 재생합니다.
                르헤메스는 영상을 호스팅하지 않으며, YouTube가 공식 제공하는 thumbnail URL만 사용합니다.
              </li>
              <li>
                모든 thumbnail 하단에는 <strong>출처 채널(© ENA, © SBS Plus, © 넷플릭스 등)</strong>을 명시합니다.
                시청자가 클릭하면 YouTube의 원본 페이지로 이동해, 원작자의 조회수·수익에 기여합니다.
              </li>
              <li>
                캐릭터 사진은 본 사이트에서 자체 제작한 이니셜 + 그라데이션 아바타로만 표시합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-ink font-semibold text-lg mb-2">3. 커뮤니티 규칙</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>욕설, 비방, 명예훼손은 신고 5회 누적 시 자동 숨김</li>
              <li>캐릭터/배우 사생활(미공개 정보) 공유 금지</li>
              <li>개인정보(이름, 연락처, 주소) 작성 금지</li>
              <li>광고/홍보/스팸 신고 5회 누적 시 자동 숨김</li>
              <li>성적/혐오 표현 금지</li>
            </ul>
          </section>

          <section>
            <h2 className="text-ink font-semibold text-lg mb-2">4. 정보 정정 요청</h2>
            <p>
              캐릭터 정보가 사실과 다를 경우, 커뮤니티 댓글 또는 신고 기능을 통해 알려주세요.
              검토 후 빠르게 반영할게요. 만일 thumbnail 또는 영상이 본인 권리를 침해한다고 판단되시면
              아래 연락처로 알려주세요. 24시간 내 조치합니다.
            </p>
          </section>

          <section>
            <h2 className="text-ink font-semibold text-lg mb-2">5. 비상업적 운영</h2>
            <p>
              르헤메스는 현재 비상업적으로 운영됩니다. 추후 광고·제휴가 붙더라도
              영상·thumbnail의 fair use 가이드라인은 그대로 유지되며, 모든 시청은 YouTube로 연결되어
              원작자의 수익 모델을 침해하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-ink font-semibold text-lg mb-2">6. 면책</h2>
            <p>
              본 사이트의 모든 정보는 팬이 편집한 자료로, 정확성을 보장하지 않습니다.
              공식 정보는 해당 방송사·영화사·OTT를 통해 확인해주세요.
            </p>
          </section>

          <section className="pt-4 border-t border-line">
            <p className="text-muted text-[12.5px]">
              <strong className="text-ink-soft">저작권 침해 신고 / 제휴 문의:</strong>{" "}
              contact@lexemes.example (placeholder)
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
