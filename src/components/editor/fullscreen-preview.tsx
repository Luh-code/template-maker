"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useDesignStore } from "@/store/design-store";
import { FramePreview } from "./frame-preview";

export function FullscreenPreview() {
  const isOpen = useDesignStore((s) => s.fullscreenPreview);
  const setFullscreenPreview = useDesignStore((s) => s.setFullscreenPreview);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFullscreenPreview(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, setFullscreenPreview]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 sm:p-12">
      <button
        onClick={() => setFullscreenPreview(false)}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="w-full max-w-5xl">
        <FramePreview />
      </div>
    </div>
  );
}
