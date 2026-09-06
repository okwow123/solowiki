// app/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { getRecentChatMessages } from "@/lib/data/chat";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const notoKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-kr",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "솔로위키";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · 솔로 데이팅 출연자 아카이브`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "솔로 데이팅 프로그램 1기~33기 출연자 정보, 커플 현황, 게임 스탯, 하이라이트 영상, 익명 팬 커뮤니티. 로그인 없이 자유롭게.",
  keywords: [
    "나는솔로",
    "솔로위키",
    "솔로 데이팅",
    "출연자",
    "커플",
    "팬 커뮤니티",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} · 솔로 데이팅 출연자 아카이브`,
    description:
      "솔로 데이팅 프로그램 1기~33기 출연자 정보, 커플 현황, 게임 스탯, 하이라이트 영상, 익명 팬 커뮤니티.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · 솔로 데이팅 출연자 아카이브`,
    description:
      "솔로 데이팅 프로그램 1기~33기 출연자 정보, 커플 현황, 게임 스탯, 하이라이트 영상, 익명 팬 커뮤니티.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialMessages = await getRecentChatMessages(50);
  return (
    <html lang="ko" className={`${cormorant.variable} ${notoKr.variable}`}>
      <body>
        <Header />
        <main className="min-h-[calc(100vh-68px)]">{children}</main>
        <Footer />
        <ChatContainer initialMessages={initialMessages} />
      </body>
    </html>
  );
}
