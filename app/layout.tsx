// app/layout.tsx
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lehemes.app";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "르헤메스";
const SITE_TAGLINE = process.env.NEXT_PUBLIC_SITE_TAGLINE ?? "캐릭터 백과사전";
const SITE_ENG = process.env.NEXT_PUBLIC_SITE_ENG ?? "lehemes";
// og:site_name 등 국제 메타에는 영문 브랜드(lehemes) 사용
const SITE_OG_NAME = process.env.NEXT_PUBLIC_SITE_OG_NAME ?? SITE_ENG;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "영화, 드라마, 예능의 캐릭터들을 한 곳에 모았습니다. 출연자 도감, 게임 스탯, 하이라이트 영상, 익명 팬 커뮤니티. 로그인 없이 자유롭게.",
  keywords: [
    "르헤메스",
    "lehemes",
    "캐릭터 백과사전",
    "영화",
    "드라마",
    "예능",
    "애니",
    "나는솔로",
    "커플",
    "팬 커뮤니티",
  ],
  authors: [{ name: SITE_NAME }],
  // canonical: 중복 콘텐츠 방지용 정규 URL. Google이 이걸 우선 색인.
  alternates: {
    canonical: SITE_URL,
    languages: {
      "ko-KR": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_OG_NAME,
    title: `${SITE_OG_NAME} · ${SITE_TAGLINE}`,
    description:
      "영화, 드라마, 예능의 캐릭터들을 한 곳에. 출연자 도감, 게임 스탯, 하이라이트 영상, 익명 팬 커뮤니티.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_OG_NAME} · ${SITE_TAGLINE}`,
    description:
      "영화, 드라마, 예능의 캐릭터들을 한 곳에. 출연자 도감, 게임 스탯, 하이라이트 영상, 익명 팬 커뮤니티.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Google Search Console 인증 (사이트에 등록한 meta tag의 content 값)
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? undefined,
    // Naver Search Advisor 인증
    other: process.env.NEXT_PUBLIC_NAVER_VERIFICATION
      ? { "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_VERIFICATION }
      : undefined,
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
        {/* JSON-LD: Organization + WebSite 스키마 (Google 검색 결과 리치 스니펫) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": `${SITE_URL}#organization`,
                name: SITE_NAME,
                alternateName: SITE_ENG,
                url: SITE_URL,
                logo: `${SITE_URL}/icon.png`,
                description:
                  "영화, 드라마, 예능의 캐릭터들을 한 곳에 모은 백과사전",
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": `${SITE_URL}#website`,
                url: SITE_URL,
                name: SITE_NAME,
                alternateName: SITE_ENG,
                inLanguage: "ko-KR",
                description:
                  "영화 · 드라마 · 예능의 모든 캐릭터를 한 곳에서. 출연자 도감, 게임 스탯, 하이라이트 영상, 익명 팬 커뮤니티.",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
                publisher: { "@id": `${SITE_URL}#organization` },
              },
            ]),
          }}
        />
        <Header />
        <main className="min-h-[calc(100vh-68px)]">{children}</main>
        <Footer />
        <ChatContainer initialMessages={initialMessages} />
        <Analytics />
      </body>
    </html>
  );
}
