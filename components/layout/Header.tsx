// components/layout/Header.tsx
import Link from "next/link";
import { Search, Users, MessageSquare } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-line">
      <div className="max-w-site mx-auto px-6 h-[68px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 grid place-items-center rounded-lg font-serif text-[22px] font-semibold text-bg bg-gradient-to-br from-accent-rose to-accent-gold">
            S
          </span>
          <span className="font-semibold text-[18px] tracking-wide">
            솔로위키 <em className="font-serif italic font-medium text-ink-soft text-sm ml-1.5">Solo Wiki</em>
          </span>
        </Link>

        <nav className="flex items-center gap-7">
          <Link
            href="/seasons"
            className="text-sm text-ink-soft hover:text-ink transition-colors hidden md:flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            출연자
          </Link>
          <Link
            href="/community/1"
            className="text-sm text-ink-soft hover:text-ink transition-colors hidden md:flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            커뮤니티
          </Link>
          <Link
            href="/search"
            className="text-sm px-3.5 py-2 border border-line-strong rounded-full hover:bg-bg-3 transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            검색
          </Link>
        </nav>
      </div>
    </header>
  );
}
