// components/layout/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-10 border-t border-line">
      <div className="max-w-site mx-auto px-6 flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 grid place-items-center rounded-lg font-serif text-[22px] font-semibold text-bg bg-gradient-to-br from-accent-rose to-accent-gold">
              S
            </span>
            <span className="font-semibold text-[18px]">
              솔로위키 <em className="font-serif italic font-medium text-ink-soft text-sm ml-1.5">Solo Wiki</em>
            </span>
          </div>
          <p className="text-muted text-[13px] mt-2">
            솔로 데이팅 팬을 위한 출연자 도감 · 익명 커뮤니티
          </p>
        </div>
        <div className="text-[13px] text-right">
          <p>© 2026 솔로위키 · Solo Wiki</p>
          <p className="text-muted mt-1">
            팬 큐레이션 정보 · UGC 기반 · {""}
            <Link href="/legal" className="hover:text-ink-soft transition-colors">
              운영 원칙
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
