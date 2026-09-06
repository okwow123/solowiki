// lib/data/chat.ts
// 실시간 채팅 — 최근 메시지 fetch (서버 사이드)

import { createClient } from "@/lib/supabase/server";

export interface ChatMessage {
  id: string;
  anonymous_name: string;
  content: string;
  is_system: boolean;
  created_at: string;
}

export async function getRecentChatMessages(limit = 50): Promise<ChatMessage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, anonymous_name, content, is_system, created_at")
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  // 오래된 순으로 (UI에서 아래로 흐르게)
  return (data as ChatMessage[]).slice().reverse();
}
