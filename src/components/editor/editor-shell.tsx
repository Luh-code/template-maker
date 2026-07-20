"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDesignStore } from "@/store/design-store";
import { useUndoRedoShortcuts } from "@/hooks/use-undo-redo-shortcuts";
import { Header } from "./header";
import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import { FramePreview } from "./frame-preview";
import { FullscreenPreview } from "./fullscreen-preview";
import { cn } from "@/lib/utils";

export function EditorShell() {
  useUndoRedoShortcuts();
  const editorTheme = useDesignStore((s) => s.editorTheme);
  const [mobilePanel, setMobilePanel] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", editorTheme === "dark");
  }, [editorTheme]);

  return (
    <div className={cn("flex h-screen flex-col overflow-hidden", editorTheme === "dark" && "dark bg-neutral-950")}>
      <Header onOpenPanel={setMobilePanel} />

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-72 shrink-0 border-r border-neutral-200 dark:border-neutral-800 lg:block">
          <LeftSidebar />
        </aside>

        <main className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-neutral-100 p-4 dark:bg-neutral-900 sm:p-8">
          <div className="w-full max-w-4xl">
            <FramePreview />
          </div>
        </main>

        <aside className="hidden w-72 shrink-0 border-l border-neutral-200 dark:border-neutral-800 lg:block">
          <RightSidebar />
        </aside>
      </div>

      {mobilePanel && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobilePanel(null)}
          />
          <div
            className={cn(
              "relative ml-auto flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-xl dark:bg-neutral-950",
              mobilePanel === "left" && "ml-0 mr-auto"
            )}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 p-3 dark:border-neutral-800">
              <span className="text-sm font-semibold">
                {mobilePanel === "left" ? "Edit design" : "Uploaded photos"}
              </span>
              <button
                onClick={() => setMobilePanel(null)}
                className="rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {mobilePanel === "left" ? <LeftSidebar /> : <RightSidebar />}
            </div>
          </div>
        </div>
      )}

      <FullscreenPreview />
    </div>
  );
}
