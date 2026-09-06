"use client";
// components/chat/ChatPanel.tsx
// 실시간 채팅 패널 — PC 사이드바 / Mobile 플로팅 모달 둘 다 지원.
// 카카오톡 스타일 unread badge 지원 (panel이 닫혀있을 때 새 메시지면 badge '1').

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { generateAnonymousName } from "@/lib/anonymous";
import type { ChatMessage } from "@/lib/data/chat";
import { cn } from "@/lib/utils";
import { MessageCircle, Send, X, Smile } from "lucide-react";

const EMOJIS = [
  "😀", "😂", "😍", "🥰", "😎", "🤔", "😢", "😭",
  "👍", "👎", "👏", "🙌", "💪", "🙏",
  "❤️", "💔", "💕", "💖", "🔥", "✨", "⭐", "🎉",
  "😱", "🤯", "😅", "🙄", "😴", "🤤",
];

const NAME_KEY = "sw_chat_name";
const LAST_READ_KEY = "sw_chat_lastread";

interface ChatPanelProps {
  initialMessages: ChatMessage[];
  variant: "sidebar" | "modal";
  /** panel이 보이는지. true면 새 메시지 도착 시 자동으로 read 처리. */
  isOpen?: boolean;
  /** 안 읽은 메시지 수가 변할 때 호출 (mobile floating badge용) */
  onUnreadChange?: (count: number) => void;
  onClose?: () => void;
  /** X 버튼 표시 (PC sidebar 접기, mobile modal 닫기) */
  closable?: boolean;
}

export function ChatPanel({
  initialMessages,
  variant,
  isOpen = true,
  onUnreadChange,
  onClose,
  closable = false,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [name, setName] = useState<string>("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const joinedRef = useRef(false);
  const lastReadIdRef = useRef<string>("");

  // Get or generate name once
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(NAME_KEY);
    } catch {}
    if (!stored) {
      stored = generateAnonymousName();
      try {
        localStorage.setItem(NAME_KEY, stored);
      } catch {}
    }
    setName(stored);
  }, []);

  // Load lastRead from localStorage on mount
  useEffect(() => {
    try {
      lastReadIdRef.current = localStorage.getItem(LAST_READ_KEY) || "";
    } catch {}
  }, []);

  // Compute unread count when messages change or isOpen changes
  useEffect(() => {
    if (messages.length === 0) {
      if (unreadCount !== 0) {
        setUnreadCount(0);
        onUnreadChange?.(0);
      }
      return;
    }

    if (isOpen) {
      // panel이 열려있으면 가장 최근 메시지 ID로 lastRead 업데이트
      const lastMsg = messages[messages.length - 1];
      if (lastReadIdRef.current !== lastMsg.id) {
        lastReadIdRef.current = lastMsg.id;
        try {
          localStorage.setItem(LAST_READ_KEY, lastMsg.id);
        } catch {}
      }
      if (unreadCount !== 0) {
        setUnreadCount(0);
        onUnreadChange?.(0);
      }
    } else {
      // panel 닫혀있으면 lastRead 이후의 user message 수 계산
      const lastReadId = lastReadIdRef.current;
      const idx = lastReadId
        ? messages.findIndex((m) => m.id === lastReadId)
        : -1;
      // 시스템 메시지(입장/퇴장)는 카운트 제외
      const userMsgsAfter = messages
        .slice(idx + 1)
        .filter((m) => !m.is_system);
      const newCount = userMsgsAfter.length;
      // 최대 1만 표시 (사용자 요청)
      const displayCount = Math.min(newCount, 1);
      if (newCount !== unreadCount) {
        setUnreadCount(displayCount);
        onUnreadChange?.(displayCount);
      }
    }
  }, [messages, isOpen, unreadCount, onUnreadChange]);

  // Subscribe to realtime + post join message
  useEffect(() => {
    if (!name) return;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel("chat:global", {
        config: { presence: { key: name } },
      })
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const msg = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      )
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setOnlineCount(Object.keys(state).length || 1);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ name, online_at: new Date().toISOString() });
          if (!joinedRef.current) {
            joinedRef.current = true;
            try {
              await fetch("/api/chat/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  content: "들어왔습니다 👋",
                  anonymous_name: name,
                  is_system: true,
                }),
              });
            } catch {}
          }
        }
      });

    return () => {
      try {
        navigator.sendBeacon?.(
          "/api/chat/post",
          new Blob(
            [
              JSON.stringify({
                content: "떠났습니다",
                anonymous_name: name,
                is_system: true,
              }),
            ],
            { type: "application/json" }
          )
        );
      } catch {}
      supabase.removeChannel(channel);
    };
  }, [name]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending || !name) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/chat/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text.slice(0, 500),
          anonymous_name: name,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.message || "전송 실패");
      } else {
        setInput("");
        setShowEmoji(false);
      }
    } catch (e) {
      setError("네트워크 오류");
    } finally {
      setSending(false);
    }
  };

  const insertEmoji = (e: string) => {
    setInput((prev) => (prev + e).slice(0, 500));
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const timeFmt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };

  const isModal = variant === "modal";
  const showCloseButton = isModal || closable;

  return (
    <div
      className={cn(
        "flex flex-col bg-bg-2 border border-line rounded-[14px] overflow-hidden",
        isModal
          ? "fixed inset-x-3 bottom-3 top-16 z-50 shadow-2xl"
          : "fixed top-20 right-4 w-[340px] h-[520px] z-30 shadow-lg hidden lg:flex"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-bg-3/50">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-accent-rose" />
          <h3 className="font-semibold text-[14px]">실시간 채팅</h3>
          <span className="text-[11px] text-muted flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {onlineCount}명 접속중
          </span>
        </div>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-bg-3 rounded transition-colors"
            aria-label="채팅 닫기"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-2"
      >
        {messages.length === 0 && (
          <p className="text-muted text-[12.5px] text-center py-6">
            아직 메시지가 없어요. 첫 인사를 남겨보세요!
          </p>
        )}
        {messages.map((m) => {
          if (m.is_system) {
            return (
              <div
                key={m.id}
                className="text-center text-[11.5px] text-muted py-0.5"
              >
                <span className="bg-bg-3 px-2 py-0.5 rounded-full">
                  {m.content}
                </span>
              </div>
            );
          }
          const isMine = m.anonymous_name === name;
          return (
            <div
              key={m.id}
              className={cn(
                "flex flex-col gap-0.5",
                isMine ? "items-end" : "items-start"
              )}
            >
              <div className="flex items-baseline gap-1.5">
                <span
                  className={cn(
                    "text-[12px] font-semibold",
                    isMine ? "text-accent-rose" : "text-ink-soft"
                  )}
                >
                  {m.anonymous_name}
                </span>
                <span className="text-[10.5px] text-muted">{timeFmt(m.created_at)}</span>
              </div>
              <div
                className={cn(
                  "max-w-[85%] px-3 py-1.5 rounded-[12px] text-[13.5px] leading-snug break-words",
                  isMine
                    ? "bg-accent-rose/15 text-ink rounded-tr-sm"
                    : "bg-bg-3 text-ink-soft rounded-tl-sm"
                )}
              >
                {m.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Emoji picker */}
      {showEmoji && (
        <div className="border-t border-line bg-bg px-2 py-2 grid grid-cols-8 gap-1 max-h-[140px] overflow-y-auto">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => insertEmoji(e)}
              className="text-xl hover:bg-bg-3 rounded p-1 transition-colors"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-line p-2.5 bg-bg">
        {error && (
          <p className="text-[11.5px] text-red-400 mb-1.5 px-1">{error}</p>
        )}
        <div className="flex items-end gap-1.5">
          <button
            type="button"
            onClick={() => setShowEmoji((v) => !v)}
            className={cn(
              "p-1.5 rounded transition-colors shrink-0",
              showEmoji ? "bg-accent-rose/20 text-accent-rose" : "text-muted hover:text-ink-soft"
            )}
            aria-label="이모티콘"
          >
            <Smile className="w-4 h-4" />
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 500))}
            onKeyDown={handleKey}
            placeholder="메시지... (Enter 전송)"
            rows={1}
            className="flex-1 bg-bg-3 border border-line rounded-lg px-3 py-1.5 text-[13px] resize-none focus:outline-none focus:border-accent-rose/40 placeholder:text-muted"
          />
          <button
            type="button"
            onClick={send}
            disabled={!input.trim() || sending}
            className={cn(
              "p-1.5 rounded transition-colors shrink-0",
              input.trim() && !sending
                ? "bg-accent-rose text-bg hover:brightness-110"
                : "bg-bg-3 text-muted cursor-not-allowed"
            )}
            aria-label="전송"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10.5px] text-muted mt-1 px-1 truncate">
          👤 {name} · 3초 쿨다운
        </p>
      </div>
    </div>
  );
}
