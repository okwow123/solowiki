// components/layout/Header.tsx
// 르헤메스 (Lexemes) — 캐릭터 백과사전
// 카테고리 네비: 전체 / 예능 / 드라마 / 영화

import Link from "next/link";
import { Search } from "lucide-react";

const CATEGORIES = [
  { label: "전체", href: "/works", kind: null },
  { label: "예능", href: "/works?kind=variety", kind: "variety" },
  { label: "드라마", href: "/works?kind=drama", kind: "drama" },
  { label: "영화", href: "/works?kind=movie", kind: "movie" },
  { label: "애니", href: "/works?kind=anime", kind: "anime" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-line">
      <div className="max-w-site mx-auto px-6 h-[68px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="w-8 h-8 grid place-items-center rounded-lg font-serif text-[20px] font-semibold text-bg bg-gradient-to-br from-accent-rose to-accent-gold">
            L
          </span>
          <span className="font-semibold text-[18px] tracking-wide whitespace-nowrap">
            르헤메스{" "}
            <em className="font-serif italic font-medium text-ink-soft text-sm ml-1.5">
              Lexemes
            </em>
          </span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-3 flex-1 justify-center overflow-x-auto">
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="text-[13.5px] md:text-sm text-ink-soft hover:text-ink transition-colors px-2.5 md:px-3 py-1.5 rounded-full hover:bg-bg-3 whitespace-nowrap"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/search"
            className="text-sm px-3.5 py-2 border border-line-strong rounded-full hover:bg-bg-3 transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">검색</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
