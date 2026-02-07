"use client";

import { useState } from "react";
import { ClipboardCopy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

export function CopyButton({
  text,
  className,
  variant = "ghost",
  size = "sm",
  showText = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Button
      type="button"
      variant={copied ? "default" : variant}
      size={size}
      onClick={copyToClipboard}
      className={cn(
        "transition-all duration-200",
        copied && "bg-green-500 hover:bg-green-600 text-white",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          {showText && <span className="ml-1">Copied!</span>}
        </>
      ) : (
        <>
          <ClipboardCopy className="h-4 w-4" />
          {showText && <span className="ml-1">Copy</span>}
        </>
      )}
      <span className="sr-only">{copied ? "Copied!" : "Copy to clipboard"}</span>
    </Button>
  );
}
