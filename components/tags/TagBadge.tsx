"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  name: string;
  color?: string | null;
  onRemove?: () => void;
  className?: string;
  size?: "sm" | "md";
}

export function TagBadge({
  name,
  color = "#6366f1",
  onRemove,
  className,
  size = "md",
}: TagBadgeProps) {
  const bgColor = color || "#6366f1";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className
      )}
      style={{
        backgroundColor: `${bgColor}20`,
        color: bgColor,
        borderColor: bgColor,
        borderWidth: "1px",
      }}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors"
        >
          <X className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
          <span className="sr-only">Remove tag</span>
        </button>
      )}
    </span>
  );
}
