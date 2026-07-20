"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useDesignStore, type LeftPanelTab } from "@/store/design-store";
import { useUndoRedoShortcuts } from "@/hooks/use-undo-redo-shortcuts";
import { Header } from "./header";
import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import { FramePreview } from "./frame-preview";
import { FullscreenPreview } from "./fullscreen-preview";
import { cn } from "@/lib/utils";

const LEFT_TAB_LABELS: Record<LeftPanelTab, string> = {
  upload: "Photos",
  text: "Text",
  calendar: "Calendar",
  spotify: "Spotify",
  style: "Frame Style",
};

export function EditorShell() {
  useUndoRedoShortcuts();
  const editorTheme = useDesignStore((s) => s.editorTheme);
  const selectedTileId = useDesignStore((s) => s.selectedTileId);
  const mobilePanel = useDesignStore((s) => s.mobilePanel);
  const setMobilePanel = useDesignStore((s) => s.setMobilePanel);
  const leftPanelTab = useDesignStore((s) => s.leftPanelTab);

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

      {/* Mobile/tablet controls surface as a bottom sheet rather than a
          full-screen drawer, so the frame stays visible (and tappable)
          above it — essential for seeing live updates while dragging a
          slider or picking a photo. Selecting a tile or text field (from
          the store, wherever that happens) opens this automatically. */}
      {mobilePanel && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex max-h-[75vh] flex-col rounded-t-2xl border-t border-neutral-200 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.15)] lg:hidden dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex shrink-0 flex-col items-center pt-2">
            <div className="h-1 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </div>
          <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
            <span className="text-sm font-semibold">
              {mobilePanel === "left"
                ? LEFT_TAB_LABELS[leftPanelTab]
                : selectedTileId
                  ? "Selected tile"
                  : "Uploaded photos"}
            </span>
            <button
              onClick={() => setMobilePanel(null)}
              aria-label="Close panel"
              className="rounded p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {mobilePanel === "left" ? <LeftSidebar /> : <RightSidebar />}
          </div>
        </div>
      )}

      <FullscreenPreview />
    </div>
  );
}
