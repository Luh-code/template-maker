"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Download,
  Expand,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Moon,
  PencilLine,
  Redo2,
  Sun,
  Undo2,
} from "lucide-react";
import { useDesignStore } from "@/store/design-store";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useExportDesign } from "@/hooks/use-export";
import { encodeDesignToHash } from "@/lib/share-link";

export function Header({
  onOpenPanel,
}: {
  onOpenPanel: (panel: "left" | "right") => void;
}) {
  const undo = useDesignStore((s) => s.undo);
  const redo = useDesignStore((s) => s.redo);
  const past = useDesignStore((s) => s.past);
  const future = useDesignStore((s) => s.future);
  const editorTheme = useDesignStore((s) => s.editorTheme);
  const toggleEditorTheme = useDesignStore((s) => s.toggleEditorTheme);
  const setFullscreenPreview = useDesignStore((s) => s.setFullscreenPreview);
  const design = useDesignStore((s) => s.design);
  const { exportPng, exportPdf, isExporting } = useExportDesign();
  const [copied, setCopied] = useState(false);

  return (
    <header className="no-print flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-3 dark:border-neutral-800 dark:bg-neutral-950 sm:px-4">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1 rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <span className="hidden font-semibold text-neutral-900 dark:text-neutral-50 sm:inline">
          Memory Frame Designer
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" disabled={past.length === 0} onClick={undo} title="Undo (Ctrl+Z)">
          <Undo2 />
        </Button>
        <Button variant="ghost" size="icon" disabled={future.length === 0} onClick={redo} title="Redo (Ctrl+Y)">
          <Redo2 />
        </Button>

        <div className="mx-1 hidden h-6 w-px bg-neutral-200 dark:bg-neutral-800 sm:block" />

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => onOpenPanel("left")}
          title="Edit panels"
        >
          <PencilLine />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => onOpenPanel("right")}
          title="Uploaded photos"
        >
          <ImageIcon />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:inline-flex"
          onClick={() => setFullscreenPreview(true)}
          title="Fullscreen preview"
        >
          <Expand />
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleEditorTheme} title="Toggle editor theme">
          {editorTheme === "light" ? <Moon /> : <Sun />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:inline-flex"
          title="Copy share link"
          onClick={async () => {
            const url = encodeDesignToHash(design);
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
        >
          <LinkIcon />
        </Button>
        {copied && <span className="hidden text-xs text-emerald-600 sm:inline">Copied!</span>}

        <div className="mx-1 hidden h-6 w-px bg-neutral-200 dark:bg-neutral-800 sm:block" />

        <span className="hidden text-xs text-neutral-400 sm:inline">Saved to browser</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="primary" size="sm" disabled={isExporting !== null}>
              {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
              <span className="hidden sm:inline">Download</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-2">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="sm" className="justify-start" onClick={exportPng}>
                Download PNG
              </Button>
              <Button variant="ghost" size="sm" className="justify-start" onClick={exportPdf}>
                Download PDF
              </Button>
              <p className="px-2 pt-1 text-[11px] text-neutral-400">
                Exports at 300 DPI print quality
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
