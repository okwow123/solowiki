// lib/anonymous.ts
// 익명 닉네임 생성기 — 가벼운 형용사 + 동물/사물

const ADJECTIVES = [
  "조용한", "용감한", "친절한", "엉뚱한", "신중한", "엉성한",
  "다정한", "재빠른", "느긋한", "엉클어진", "빛나는", "어두운",
  "밝은", "깔끔한", "엉뚱한", "새벽의", "한밤의", "구름의",
  "달빛의", "별빛의", "바람의", "비밀의", "외로운", "행복한",
  "엉성한", "엉뚱한", "진지한", "게으른", "영리한", "엉클어진",
];

const NOUNS = [
  "고양이", "강아지", "부엉이", "여우", "토끼", "사슴",
  "독자", "관찰자", "여행자", "산책자", "낮잠꾸러기", "새벽형",
  "밤형", "은하수", "달무리", "별빛", "구름", "비밀",
  "조개", "돌멩이", "나비", "사슴", "강아지", "고양이",
  "오리너구리", "수달", "햄스터", "앵무새", "카멜레온", "독수리",
];

export function generateAnonymousName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  // 70% 확률로 숫자 suffix
  const suffix = Math.random() < 0.7 ? Math.floor(Math.random() * 99) : "";
  return `${adj}${noun}${suffix}`;
}
