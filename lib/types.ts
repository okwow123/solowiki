// lib/types.ts
// Supabase row types + derived view types

export type Gender = "male" | "female";
export type PortraitColor = "rose" | "gold" | "navy" | "sage" | "plum";
export type CurrentStatus =
  | "single"
  | "dating"
  | "married"
  | "divorced"
  | "widowed"
  | "returned"
  | "doubly_returned"
  | "unknown";

export type MaritalHistory =
  | "never_married"
  | "divorced"
  | "twice_divorced"
  | "widowed"
  | "de_facto"
  | "unknown";

export type WorkKind = "variety" | "movie" | "drama" | "anime" | "other";

export const WORK_KIND_LABELS: Record<WorkKind, string> = {
  variety: "예능",
  movie: "영화",
  drama: "드라마",
  anime: "애니",
  other: "기타",
};

export interface Season {
  id: number;
  number: number;
  title: string | null;
  franchise: string | null; // 프랜차이즈명 (예: "나는솔로"). NULL이면 단독 작품.
  kind: WorkKind;
  air_date_start: string | null;
  air_date_end: string | null;
  episode_count: number | null;
  description: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

/** 프랜차이즈 단위로 묶인 작품 그룹 (예: 나는솔로 1~33기) */
export interface Franchise {
  name: string;
  kind: WorkKind;
  seasons: Season[];
  totalCharacters: number;
}

export interface Contestant {
  id: string;
  season_id: number;
  name: string;
  name_initial: string | null;
  gender: Gender;
  birth_date: string | null;
  age_at_appearance: number | null;
  job: string | null;
  job_category: string | null;
  location_city: string | null;
  location_district: string | null;
  mbti: string | null;
  height_cm: number | null;
  body_type: string | null;
  education: string | null;
  intro: string | null;
  ideal_type: string | null;
  catchphrase: string | null;
  charm_points: string[] | null;
  hobbies: string[] | null;
  marital_history: MaritalHistory;
  current_status: CurrentStatus;
  is_final_couple: boolean;
  final_choice: string | null;
  eliminated_episode: number | null;
  partner_id: string | null;
  instagram_handle: string | null;
  instagram_followers: number | null;
  tiktok_handle: string | null;
  tiktok_followers: number | null;
  youtube_handle: string | null;
  recent_news: string | null;
  data_source: string | null;
  confidence: "high" | "medium" | "low";
  portrait_color: PortraitColor;
  appearance_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContestantStat {
  contestant_id: string;
  // v3 — 10 stats
  overall_charm: number;     // 종합매력
  villain_power: number;     // 빌런력
  appearance: number;        // 외모점수
  inner_qualities: number;   // 내면점수
  career_score: number;      // 직업점수
  age_score: number;         // 연령점수
  conversation: number;      // 대화점수
  style_score: number;       // 스타일점수
  intelligence_score: number;// 지능점수
  appetite: number;          // 식욕점수
  // v1/v2 (deprecated, but kept in DB)
  charm?: number;
  humor?: number;
  warmth?: number;
  intelligence?: number;
  leadership?: number;
  style?: number;
  updated_at: string;
}

export interface Highlight {
  id: string;
  contestant_id: string;
  youtube_id: string;
  title: string | null;
  description: string | null;
  duration_sec: number | null;
  source_channel: string | null;
  sort_order: number;
  created_at: string;
}

export interface Post {
  id: string;
  season_id: number | null;
  contestant_id: string | null;
  content: string;
  anonymous_name: string;
  vote_up_count: number;
  vote_down_count: number;
  report_count: number;
  is_hidden: boolean;
  created_at: string;
}

export interface ContestantWithStats extends Contestant {
  stats: ContestantStat | null;
  season: Season | null;
  highlights: Highlight[];
  partner: Pick<Contestant, "id" | "name" | "name_initial" | "portrait_color"> | null;
}

export interface PostWithRefs extends Post {
  season: Pick<Season, "id" | "number" | "title" | "kind"> | null;
  contestant: Pick<Contestant, "id" | "name" | "name_initial" | "portrait_color"> | null;
}

// UI helpers
export const STATUS_LABELS: Record<CurrentStatus, string> = {
  single: "미혼",
  dating: "연애중",
  married: "결혼",
  divorced: "이혼",
  widowed: "사별",
  returned: "돌싱",
  doubly_returned: "돌돌싱",
  unknown: "미공개",
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: "남",
  female: "여",
};

export const MARITAL_LABELS: Record<MaritalHistory, string> = {
  never_married: "미혼",
  divorced: "이혼 (돌싱)",
  twice_divorced: "이혼 2회 (돌돌싱)",
  widowed: "사별",
  de_facto: "사실혼 경험",
  unknown: "미공개",
};

export const PORTRAIT_GRADIENT: Record<PortraitColor, string> = {
  rose: "linear-gradient(135deg, #d96b7c, #6e2c39)",
  gold: "linear-gradient(135deg, #c8a96a, #5a4322)",
  navy: "linear-gradient(135deg, #4b5a8a, #1d2548)",
  sage: "linear-gradient(135deg, #7a9a7e, #2f4633)",
  plum: "linear-gradient(135deg, #8e5d8a, #3b254a)",
};
