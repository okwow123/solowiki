"use client";
// components/contestant/YouTubeThumbnail.tsx
// 출연자 프로필 이미지를 YouTube 썸네일로 표시.
// maxresdefault.jpg → hqdefault.jpg → 그라데이션 + 이니셜 fallback.

import { useState } from "react";
import { PORTRAIT_GRADIENT, type PortraitColor, STATUS_LABELS, type CurrentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface YouTubeThumbnailProps {
  youtubeId?: string | null;
  nameInitial: string;
  color: PortraitColor;
  status?: CurrentStatus;
  size?: "sm" | "md" | "lg" | "xl" | "square" | "video";
  className?: string;
  /** 유튜브 영상 페이지로 연결하고 싶을 때 */
  href?: string;
  /** 출처 채널명 (예: "ENA", "SBS Plus", "팬채널") */
  sourceChannel?: string | null;
  /** 워터마크 표시 여부 (기본 true) */
  showAttribution?: boolean;
  /** object-fit: cover(기본, 자르고 채움) | contain(잘림 없이, 여백 가능) */
  fit?: "cover" | "contain";
}

type ImageState = "maxres" | "hq" | "fallback";

export function YouTubeThumbnail({
  youtubeId,
  nameInitial,
  color,
  status,
  size = "md",
  className,
  href,
  sourceChannel,
  showAttribution = true,
  fit = "cover",
}: YouTubeThumbnailProps) {
  const hasYoutube = !!youtubeId && youtubeId.length >= 6;
  // state: 현재 시도 중인 썸네일 종류
  const [imgState, setImgState] = useState<ImageState>(hasYoutube ? "maxres" : "fallback");

  // 유튜브 ID가 바뀌면 state 리셋
  // (마운트 시 한 번만 결정되므로 key prop을 부모에서 관리하는 게 깔끔하지만, useState로 충분)
  const maxresUrl = hasYoutube ? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg` : null;
  const hqUrl = hasYoutube ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null;

  const Wrapper: any = href ? "a" : "div";
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "relative grid place-items-center overflow-hidden",
        size === "sm" && "w-12 h-12 rounded-lg text-base",
        size === "md" && "aspect-[4/3]",
        size === "lg" && "aspect-[4/3] rounded-xl",
        size === "xl" && "aspect-[3/4] rounded-2xl",
        size === "square" && "aspect-square rounded-xl",
        size === "video" && "aspect-video rounded-2xl",
        className
      )}
      style={
        imgState === "fallback" || !maxresUrl
          ? { background: PORTRAIT_GRADIENT[color] }
          : undefined
      }
    >
      {/* 실제 이미지 (maxresdefault → hqdefault) */}
      {imgState !== "fallback" && maxresUrl && (
        <img
          src={imgState === "maxres" ? maxresUrl : hqUrl!}
          alt={`${nameInitial} YouTube 썸네일`}
          className={cn(
            "absolute inset-0 w-full h-full z-[1]",
            fit === "cover" ? "object-cover" : "object-contain bg-black/5"
          )}
          loading="lazy"
          onError={() => {
            if (imgState === "maxres") setImgState("hq");
            else setImgState("fallback");
          }}
        />
      )}

      {/* fallback 이니셜 표시 */}
      {imgState === "fallback" && (
        <span
          className={cn(
            "font-serif font-semibold text-ink/90 z-[1] tracking-wider",
            size === "sm" && "text-base",
            size === "md" && "text-[36px]",
            size === "lg" && "text-5xl",
            size === "xl" && "text-6xl md:text-7xl",
            size === "square" && "text-3xl"
          )}
        >
          {nameInitial}
        </span>
      )}

      {/* 그라데이션 오버레이 (이미지 위 살짝 어둡게, 텍스트 가독성) */}
      {imgState !== "fallback" && size !== "sm" && (
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.25) 100%)",
          }}
        />
      )}

      {/* 상태 뱃지 */}
      {status && size !== "sm" && (
        <span
          className={cn(
            "absolute top-2.5 left-2.5 z-[3] text-[11.5px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border",
            status === "single" && "bg-bg/70 text-[#c4d6ff] border-[rgba(196,214,255,0.35)]",
            status === "married" && "bg-accent-rose/90 text-[#1a1418] border-transparent",
            status === "divorced" && "bg-bg/70 text-[#f1c178] border-[rgba(241,193,120,0.4)]",
            status === "returned" && "bg-bg/70 text-[#b9e0c0] border-[rgba(185,224,192,0.4)]",
            status === "doubly_returned" && "bg-bg/70 text-[#d6a8e0] border-[rgba(214,168,224,0.4)]",
            status === "dating" && "bg-bg/70 text-[#ffd6a0] border-[rgba(255,214,160,0.4)]",
            status === "unknown" && "bg-bg/70 text-ink-soft border-line-strong"
          )}
        >
          {STATUS_LABELS[status]}
        </span>
      )}

      {/* 유튜브 표시 + 출처 attribution */}
      {imgState !== "fallback" && (
        <div className="absolute bottom-2 right-2 z-[3] flex items-center gap-1.5">
          {showAttribution && sourceChannel && size !== "sm" && (
            <span className="bg-black/65 backdrop-blur-sm text-white/90 text-[9.5px] font-medium px-1.5 py-0.5 rounded">
              © {sourceChannel}
            </span>
          )}
          {href && (
            <span className="bg-red-600/90 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
              <span>▶</span> YouTube
            </span>
          )}
          {!href && size !== "sm" && (
            <span className="bg-black/65 backdrop-blur-sm text-white/90 text-[9.5px] font-medium px-1.5 py-0.5 rounded">
              YouTube
            </span>
          )}
        </div>
      )}
    </Wrapper>
  );
}
