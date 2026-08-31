// components/contestant/PortraitPlaceholder.tsx
import { PORTRAIT_GRADIENT, type PortraitColor, STATUS_LABELS, type CurrentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PortraitPlaceholderProps {
  nameInitial: string;
  color: PortraitColor;
  status?: CurrentStatus;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function PortraitPlaceholder({
  nameInitial,
  color,
  status,
  size = "md",
  className,
}: PortraitPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden",
        size === "sm" && "w-12 h-12 rounded-lg text-base",
        size === "md" && "aspect-[4/3]",
        size === "lg" && "aspect-[4/3] rounded-xl",
        size === "xl" && "aspect-[3/4] rounded-2xl",
        className
      )}
      style={{ background: PORTRAIT_GRADIENT[color] }}
    >
      <span
        className={cn(
          "font-serif font-semibold text-ink/90 z-[1] tracking-wider",
          size === "sm" && "text-base",
          size === "md" && "text-[36px]",
          size === "lg" && "text-5xl",
          size === "xl" && "text-6xl md:text-7xl"
        )}
      >
        {nameInitial}
      </span>
      {status && size !== "sm" && (
        <span
          className={cn(
            "absolute top-2.5 left-2.5 z-[2] text-[11.5px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border",
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
    </div>
  );
}
