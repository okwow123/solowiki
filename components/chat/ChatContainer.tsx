"use client";
// components/chat/ChatContainer.tsx
// PC: 사이드바 (접기/펼치기) / Mobile: 플로팅 버튼 + 모달
// 카카오톡 스타일: 메시지 도착 시 floating 버튼에 "1" 배지 (panel 닫혀있을 때만).
//
// 핵심: PC와 Mobile에서 ChatPanel 인스턴스를 동시에 mount하지 않음.
// isLg media query로 PC면 sidebar, Mobile이면 mobileOpen 따라 modal/floating.

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { ChatPanel } from "./ChatPanel";
import type { ChatMessage } from "@/lib/data/chat";
import { cn } from "@/lib/utils";

interface ChatContainerProps {
  initialMessages: ChatMessage[];
}

export function ChatContainer({ initialMessages }: ChatContainerProps) {
  const [isLg, setIsLg] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pcCollapsed, setPcCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // PC / Mobile 감지 (lg breakpoint = 1024px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsLg(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      setIsLg(e.matches);
      // PC → Mobile 전환 시 모바일에서 열려있던 모달은 의미 없으므로 닫기
      if (!e.matches) setMobileOpen(false);
      // Mobile → PC 전환 시 mobileOpen은 의미 없음
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Hydration mismatch 방지: 초기엔 둘 다 안 보이고 useEffect 후 결정
  // 단, SSR에서는 sidebar가 안 보이도록 (mobile first), 클라이언트에서 PC면 보이게

  const openMobile = () => {
    setMobileOpen(true);
    setUnreadCount(0);
  };
  const closeMobile = () => setMobileOpen(false);
  const openPc = () => setPcCollapsed(false);
  const closePc = () => setPcCollapsed(true);

  // 어느 panel을 보여줄지 결정
  const showPcSidebar = isLg && !pcCollapsed;
  const showMobileModal = !isLg && mobileOpen;
  const showPcFloating = isLg && pcCollapsed;
  const showMobileFloating = !isLg && !mobileOpen;

  return (
    <>
      {/* PC: 사이드바 (열렸을 때만) */}
      {showPcSidebar && (
        <ChatPanel
          initialMessages={initialMessages}
          variant="sidebar"
          isOpen={true}
          closable
          onClose={closePc}
          onUnreadChange={() => {
            /* PC sidebar는 항상 보이므로 unread 0 — 처리 불필요 */
          }}
        />
      )}

      {/* Mobile: 풀스크린 모달 (열렸을 때만) */}
      {showMobileModal && (
        <ChatPanel
          initialMessages={initialMessages}
          variant="modal"
          isOpen={true}
          onClose={closeMobile}
          onUnreadChange={() => {
            /* 모달 열려있으면 unread 0 */
          }}
        />
      )}

      {/* PC: 접혔을 때 작은 토글 버튼 (lg+에서만 보임) */}
      {showPcFloating && (
        <button
          type="button"
          onClick={openPc}
          className="hidden lg:grid fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-accent-rose text-bg shadow-xl place-items-center hover:brightness-110 active:scale-95 transition-all"
          aria-label="채팅 열기"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold grid place-items-center ring-2 ring-bg">
              1
            </span>
          )}
        </button>
      )}

      {/* Mobile: 플로팅 버튼 (모달 닫혔을 때만) */}
      {showMobileFloating && (
        <button
          type="button"
          onClick={openMobile}
          className={cn(
            "lg:hidden fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-accent-rose text-bg shadow-xl grid place-items-center hover:brightness-110 active:scale-95 transition-all"
          )}
          aria-label="채팅 열기"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold grid place-items-center ring-2 ring-bg">
              1
            </span>
          )}
        </button>
      )}
    </>
  );
}
