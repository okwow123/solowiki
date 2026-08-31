// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-24">
      <div className="max-w-md mx-auto px-6 text-center">
        <p className="font-serif text-7xl font-semibold text-accent-rose mb-3">404</p>
        <h1 className="font-serif text-2xl font-semibold mb-2">페이지를 찾을 수 없어요</h1>
        <p className="text-ink-soft text-[14.5px] mb-8">
          이미 삭제됐거나, 주소가 잘못 입력된 것 같아요.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-gradient-to-br from-accent-rose to-accent-gold text-bg font-semibold text-[13.5px] rounded-full hover:brightness-110"
        >
          홈으로 가기
        </Link>
      </div>
    </section>
  );
}
