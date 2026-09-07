// components/layout/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-10 border-t border-line">
      <div className="max-w-site mx-auto px-6 flex flex-col gap-5">
        {/* 본 사이트는 fan archive라는 점을 명시 */}
        <p className="text-muted text-[12px] leading-relaxed text-center md:text-left">
          <strong className="text-ink-soft">저작권 안내:</strong>{" "}
          르헤메스는 팬덤 아카이브로, YouTube 영상을 호스팅하지 않습니다. 모든 thumbnail은
          YouTube가 공식 제공하는 URL을 그대로 사용하며, 클릭 시 YouTube 원본 페이지로 이동합니다.
          영상 및 thumbnail의 저작권은 각 업로더(ENA, SBS Plus, 넷플릭스, 팬채널 등)에게 있습니다.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-6 pt-2 border-t border-line">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 grid place-items-center rounded-lg font-serif text-[20px] font-semibold text-bg bg-gradient-to-br from-accent-rose to-accent-gold">
                L
              </span>
              <span className="font-semibold text-[18px]">
                르헤메스{" "}
                <em className="font-serif italic font-medium text-ink-soft text-sm ml-1.5">Lexemes</em>
              </span>
            </div>
            <p className="text-muted text-[13px] mt-2">
              영화 · 드라마 · 예능 — 캐릭터 백과사전 · 익명 팬 커뮤니티
            </p>
          </div>
          <div className="text-[13px] text-right">
            <p>© 2026 르헤메스 · Lexemes</p>
            <p className="text-muted mt-1">
              팬 큐레이션 정보 · UGC 기반 · {""}
              <Link href="/legal" className="hover:text-ink-soft transition-colors underline underline-offset-2">
                운영 원칙 · 저작권
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
