"use client";

import { useEffect, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import { useDesignStore } from "@/store/design-store";
import { EditorShell } from "@/components/editor/editor-shell";
import { decodeDesignFromHash } from "@/lib/share-link";
import type { TemplateId } from "@/types";

const VALID_TEMPLATES: TemplateId[] = ["black-anniversary", "white-valentine"];

export default function EditorPage() {
  const params = useParams<{ template: string }>();
  const hasHydrated = useDesignStore((s) => s.hasHydrated);
  const design = useDesignStore((s) => s.design);
  const setTemplate = useDesignStore((s) => s.setTemplate);
  const loadDesign = useDesignStore((s) => s.loadDesign);
  const initialized = useRef(false);

  const template = params.template as TemplateId;
  const isValid = VALID_TEMPLATES.includes(template);

  useEffect(() => {
    if (!hasHydrated || !isValid || initialized.current) return;
    initialized.current = true;

    const shared = decodeDesignFromHash(window.location.hash);
    if (shared) {
      loadDesign(shared);
    } else if (design.template !== template) {
      setTemplate(template);
    }
    // Only run once, right after hydration settles for this route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, isValid, template]);

  if (!isValid) {
    notFound();
  }

  if (!hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center text-neutral-400">
        Loading your design…
      </div>
    );
  }

  return <EditorShell />;
}
