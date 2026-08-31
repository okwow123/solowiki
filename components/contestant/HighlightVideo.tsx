// components/contestant/HighlightVideo.tsx
import { Play } from "lucide-react";

interface HighlightVideoProps {
  youtubeId: string;
  title?: string | null;
  description?: string | null;
  sourceChannel?: string | null;
}

export function HighlightVideo({
  youtubeId,
  title,
  description,
  sourceChannel,
}: HighlightVideoProps) {
  return (
    <div className="bg-bg-3 border border-line rounded-[14px] overflow-hidden">
      <div className="aspect-video relative bg-bg">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title={title ?? "하이라이트 영상"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
      </div>
      {(title || description || sourceChannel) && (
        <div className="p-4">
          {title && (
            <div className="flex items-start gap-2 mb-1.5">
              <Play className="w-4 h-4 text-accent-rose shrink-0 mt-0.5" />
              <h4 className="font-semibold text-[15px]">{title}</h4>
            </div>
          )}
          {description && (
            <p className="text-[13.5px] text-ink-soft leading-relaxed">{description}</p>
          )}
          {sourceChannel && (
            <p className="text-[11.5px] text-muted mt-2">출처 · {sourceChannel}</p>
          )}
        </div>
      )}
    </div>
  );
}
